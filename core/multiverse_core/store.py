"""SQLite trace store and memory store.

Events are append-only: triggers abort any UPDATE or DELETE. Memory status
changes are logged in an append-only table, so history is never rewritten.
"""
import json, sqlite3, threading, time, uuid

SCHEMA = """
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT, ts REAL, kind TEXT, payload TEXT);
CREATE TRIGGER IF NOT EXISTS events_no_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT,'events are append-only'); END;
CREATE TRIGGER IF NOT EXISTS events_no_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT,'events are append-only'); END;
CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, task_id TEXT, agent TEXT, arm TEXT, started REAL, verified INTEGER,
  visible_pass INTEGER, attempts INTEGER, tokens_in INTEGER, tokens_out INTEGER, memory_ids TEXT, budget INTEGER,
  status TEXT, completed REAL, duration_ms INTEGER, error TEXT, config_digest TEXT, winning_op TEXT);
CREATE TABLE IF NOT EXISTS memory(id TEXT PRIMARY KEY, status TEXT, scope TEXT, tags TEXT, text TEXT, op TEXT, confidence REAL,
  source_run TEXT, source_task TEXT, created REAL, expires REAL, version INTEGER, evidence TEXT);
CREATE TABLE IF NOT EXISTS memory_log(id INTEGER PRIMARY KEY AUTOINCREMENT, memory_id TEXT, ts REAL, from_status TEXT, to_status TEXT, actor TEXT, reason TEXT);
CREATE TRIGGER IF NOT EXISTS mlog_no_update BEFORE UPDATE ON memory_log BEGIN SELECT RAISE(ABORT,'memory log is append-only'); END;
CREATE TRIGGER IF NOT EXISTS mlog_no_delete BEFORE DELETE ON memory_log BEGIN SELECT RAISE(ABORT,'memory log is append-only'); END;
CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY, kind TEXT, status TEXT, created REAL, started REAL, completed REAL, result TEXT, error TEXT);
CREATE TABLE IF NOT EXISTS repository_inspections(id TEXT PRIMARY KEY, status TEXT, created REAL, completed REAL,
  repo_url TEXT, commit_sha TEXT, result TEXT, error TEXT);
CREATE TABLE IF NOT EXISTS coding_tasks(id TEXT PRIMARY KEY, inspection_id TEXT, created REAL, spec TEXT);
CREATE TABLE IF NOT EXISTS coding_runs(id TEXT PRIMARY KEY, task_id TEXT, job_id TEXT, status TEXT, outcome TEXT,
  created REAL, started REAL, completed REAL, adapter_policy TEXT, memory_mode TEXT, composite INTEGER,
  comparable INTEGER, summary TEXT);
CREATE TABLE IF NOT EXISTS coding_events(id INTEGER PRIMARY KEY AUTOINCREMENT, run_id TEXT, ts REAL, kind TEXT, payload TEXT);
CREATE TRIGGER IF NOT EXISTS coding_events_no_update BEFORE UPDATE ON coding_events BEGIN SELECT RAISE(ABORT,'coding events are append-only'); END;
CREATE TRIGGER IF NOT EXISTS coding_events_no_delete BEFORE DELETE ON coding_events BEGIN SELECT RAISE(ABORT,'coding events are append-only'); END;
CREATE TABLE IF NOT EXISTS coding_artifacts(run_id TEXT, name TEXT, media_type TEXT, content TEXT, digest TEXT,
  PRIMARY KEY(run_id,name));
CREATE TABLE IF NOT EXISTS coding_evaluations(id TEXT PRIMARY KEY, task_id TEXT, status TEXT, created REAL,
  completed REAL, baseline_run TEXT, treatment_run TEXT, result TEXT, error TEXT);
CREATE TABLE IF NOT EXISTS idempotency_keys(key TEXT, operation TEXT, request_digest TEXT, resource_id TEXT, created REAL,
  PRIMARY KEY(key,operation));
CREATE TABLE IF NOT EXISTS waitlist_signups(email TEXT PRIMARY KEY COLLATE NOCASE, created REAL, source TEXT);
"""
MEMORY_STATES = ("candidate", "verified", "promoted", "rejected", "demoted")
MEMORY_TRANSITIONS = {
    "candidate": {"verified", "rejected"},
    "verified": {"promoted", "rejected"},
    "promoted": {"demoted"},
    "demoted": {"verified", "rejected"},
    "rejected": set(),
}


class Store:
    def __init__(self, path=":memory:"):
        self.db = sqlite3.connect(path, check_same_thread=False)
        self.db.row_factory = sqlite3.Row
        self.lock = threading.RLock()
        with self.lock:
            self.db.executescript(SCHEMA)
            self._migrate()

    def _migrate(self):
        columns = {row[1] for row in self.db.execute("PRAGMA table_info(runs)")}
        additions = {
            "status": "TEXT",
            "completed": "REAL",
            "duration_ms": "INTEGER",
            "error": "TEXT",
            "config_digest": "TEXT",
            "winning_op": "TEXT",
        }
        for name, declaration in additions.items():
            if name not in columns:
                self.db.execute(f"ALTER TABLE runs ADD COLUMN {name} {declaration}")
        self.db.commit()

    def _q(self, sql, args=()):
        with self.lock:
            cur = self.db.execute(sql, args)
            self.db.commit()
            return cur

    def _one(self, sql, args=()):
        with self.lock:
            return self.db.execute(sql, args).fetchone()

    def _all(self, sql, args=()):
        with self.lock:
            return self.db.execute(sql, args).fetchall()

    # ---- trace ----
    def event(self, run_id, kind, payload):
        self._q("INSERT INTO events(run_id,ts,kind,payload) VALUES(?,?,?,?)", (run_id, time.time(), kind, json.dumps(payload)))

    def events(self, run_id):
        rows = self._all("SELECT * FROM events WHERE run_id=? ORDER BY id", (run_id,))
        return [{"id": r["id"], "ts": r["ts"], "kind": r["kind"], "payload": json.loads(r["payload"])} for r in rows]

    # ---- runs ----
    def save_run(self, r):
        self._q("""INSERT INTO runs(id,task_id,agent,arm,started,verified,visible_pass,attempts,tokens_in,tokens_out,
                memory_ids,budget,status,completed,duration_ms,error,config_digest,winning_op)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (r["id"], r["task_id"], r["agent"], r["arm"], r["started"], int(r["verified"]), int(r["visible_pass"]),
                 r["attempts"], r["tokens_in"], r["tokens_out"], json.dumps(r["memory_ids"]), r["budget"], r.get("status", "completed"),
                 r.get("completed"), r.get("duration_ms"), r.get("error"), r.get("config_digest"), r.get("winning_op")))

    def runs(self):
        out = []
        for r in self._all("SELECT * FROM runs ORDER BY started"):
            d = dict(r); d["memory_ids"] = json.loads(d["memory_ids"]); d["verified"] = bool(d["verified"]); d["visible_pass"] = bool(d["visible_pass"]); out.append(d)
        return out

    def run(self, rid):
        return next((r for r in self.runs() if r["id"] == rid), None)

    # ---- memory ----
    def add_memory(self, m):
        mid = "mem_" + uuid.uuid4().hex[:8]
        now = time.time()
        self._q("INSERT INTO memory VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (mid, "candidate", m["scope"], json.dumps(m["tags"]), m["text"], m["op"], m.get("confidence", .5), m["source_run"],
                 m["source_task"], now, now + m.get("ttl_days", 90) * 86400, 1, json.dumps({})))
        self._q("INSERT INTO memory_log(memory_id,ts,from_status,to_status,actor,reason) VALUES(?,?,?,?,?,?)", (mid, now, None, "candidate", "system", "extracted from a verified run"))
        return mid

    def _mem(self, r):
        d = dict(r); d["tags"] = json.loads(d["tags"]); d["evidence"] = json.loads(d["evidence"]); return d

    def memories(self, status=None):
        rows = self._all("SELECT * FROM memory" + (" WHERE status=?" if status else "") + " ORDER BY created", (status,) if status else ())
        return [self._mem(r) for r in rows]

    def memory(self, mid):
        r = self._one("SELECT * FROM memory WHERE id=?", (mid,))
        return self._mem(r) if r else None

    def set_status(self, mid, to, actor, reason, evidence=None):
        if to not in MEMORY_STATES:
            raise ValueError(to)
        if not actor or not reason:
            raise ValueError("memory transitions require an actor and reason")
        with self.lock:
            row = self.db.execute("SELECT * FROM memory WHERE id=?", (mid,)).fetchone()
            if row is None:
                raise KeyError(mid)
            m = self._mem(row)
            if to not in MEMORY_TRANSITIONS[m["status"]]:
                raise ValueError(f"invalid memory transition: {m['status']} -> {to}")
            payload = json.dumps(evidence if evidence is not None else m["evidence"])
            try:
                self.db.execute("UPDATE memory SET status=?, version=version+1, evidence=? WHERE id=?", (to, payload, mid))
                self.db.execute("INSERT INTO memory_log(memory_id,ts,from_status,to_status,actor,reason) VALUES(?,?,?,?,?,?)",
                                (mid, time.time(), m["status"], to, actor, reason))
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise

    def memory_log(self, mid):
        return [dict(r) for r in self._all("SELECT * FROM memory_log WHERE memory_id=? ORDER BY id", (mid,))]

    # ---- jobs ----
    def create_job(self, jid, kind):
        self._q("INSERT INTO jobs(id,kind,status,created,started,completed,result,error) VALUES(?,?,?,?,?,?,?,?)",
                (jid, kind, "pending", time.time(), None, None, None, None))
        return self.job(jid)

    def update_job(self, jid, status, result=None, error=None):
        now = time.time()
        with self.lock:
            current = self.db.execute("SELECT * FROM jobs WHERE id=?", (jid,)).fetchone()
            if current is None:
                raise KeyError(jid)
            started = current["started"] or (now if status == "running" else None)
            completed = now if status in {"completed", "failed"} else None
            self.db.execute("UPDATE jobs SET status=?,started=?,completed=?,result=?,error=? WHERE id=?",
                            (status, started, completed, json.dumps(result) if result is not None else None, error, jid))
            self.db.commit()
        return self.job(jid)

    def job(self, jid):
        row = self._one("SELECT * FROM jobs WHERE id=?", (jid,))
        if row is None:
            return None
        item = dict(row)
        item["result"] = json.loads(item["result"]) if item["result"] else None
        return item

    def jobs(self, limit=50):
        rows = self._all("SELECT * FROM jobs ORDER BY created DESC LIMIT ?", (limit,))
        out = []
        for row in rows:
            item = dict(row)
            item["result"] = json.loads(item["result"]) if item["result"] else None
            out.append(item)
        return out

    # ---- repository coding workbench ----
    def create_inspection(self, repo_url, commit_sha):
        iid = "inspect_" + uuid.uuid4().hex
        self._q("INSERT INTO repository_inspections VALUES(?,?,?,?,?,?,?,?)",
                (iid, "pending", time.time(), None, repo_url, commit_sha, None, None))
        return self.inspection(iid)

    def update_inspection(self, iid, status, result=None, error=None):
        completed = time.time() if status in {"ready", "failed"} else None
        self._q("UPDATE repository_inspections SET status=?,completed=?,result=?,error=? WHERE id=?",
                (status, completed, json.dumps(result) if result is not None else None, error, iid))
        return self.inspection(iid)

    def inspection(self, iid):
        row = self._one("SELECT * FROM repository_inspections WHERE id=?", (iid,))
        if not row:
            return None
        item = dict(row)
        item["result"] = json.loads(item["result"]) if item["result"] else None
        if item["result"]:
            item.update(item["result"])
        return item

    def create_coding_task(self, inspection_id, spec):
        tid = "task_" + uuid.uuid4().hex
        payload = dict(spec)
        self._q("INSERT INTO coding_tasks VALUES(?,?,?,?)", (tid, inspection_id, time.time(), json.dumps(payload)))
        return self.coding_task(tid)

    def coding_task(self, tid):
        row = self._one("SELECT * FROM coding_tasks WHERE id=?", (tid,))
        if not row:
            return None
        item = dict(row)
        item.update(json.loads(item.pop("spec")))
        return item

    def create_coding_run(self, task_id, adapter_policy="auto", memory_mode="none"):
        rid = "repo_run_" + uuid.uuid4().hex
        self._q("INSERT INTO coding_runs VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (rid, task_id, None, "queued", None, time.time(), None, None, adapter_policy, memory_mode, 0, 1, json.dumps({})))
        return self.coding_run(rid)

    def attach_coding_job(self, rid, jid):
        self._q("UPDATE coding_runs SET job_id=? WHERE id=?", (jid, rid))

    def update_coding_run(self, rid, status, outcome=None, started=None, completed=None, composite=False, comparable=True, summary=None):
        current = self.coding_run(rid)
        if not current:
            raise KeyError(rid)
        self._q("""UPDATE coding_runs SET status=?,outcome=?,started=?,completed=?,composite=?,comparable=?,summary=? WHERE id=?""",
                (status, outcome if outcome is not None else current.get("outcome"),
                 started if started is not None else current.get("started"), completed if completed is not None else current.get("completed"),
                 int(composite), int(comparable), json.dumps(summary if summary is not None else current.get("summary", {})), rid))
        return self.coding_run(rid)

    def coding_run(self, rid):
        row = self._one("SELECT * FROM coding_runs WHERE id=?", (rid,))
        if not row:
            return None
        item = dict(row)
        item["composite"] = bool(item["composite"])
        item["comparable"] = bool(item["comparable"])
        item["summary"] = json.loads(item["summary"] or "{}")
        return item

    def coding_runs(self):
        return [self.coding_run(row["id"]) for row in self._all("SELECT id FROM coding_runs ORDER BY created DESC")]

    def coding_event(self, rid, kind, payload):
        self._q("INSERT INTO coding_events(run_id,ts,kind,payload) VALUES(?,?,?,?)", (rid, time.time(), kind, json.dumps(payload)))

    def coding_events(self, rid):
        rows = self._all("SELECT * FROM coding_events WHERE run_id=? ORDER BY id", (rid,))
        return [{**dict(row), "payload": json.loads(row["payload"])} for row in rows]

    def save_coding_artifact(self, rid, name, media_type, content):
        import hashlib
        digest = hashlib.sha256(content.encode("utf-8")).hexdigest()
        self._q("INSERT OR REPLACE INTO coding_artifacts VALUES(?,?,?,?,?)", (rid, name, media_type, content, digest))

    def coding_artifacts(self, rid):
        return [dict(row) for row in self._all("SELECT * FROM coding_artifacts WHERE run_id=? ORDER BY name", (rid,))]

    def create_evaluation(self, task_id):
        eid = "evaluation_" + uuid.uuid4().hex
        self._q("INSERT INTO coding_evaluations VALUES(?,?,?,?,?,?,?,?,?)",
                (eid, task_id, "pending", time.time(), None, None, None, None, None))
        return self.coding_evaluation(eid)

    def update_evaluation(self, eid, status, baseline_run=None, treatment_run=None, result=None, error=None):
        completed = time.time() if status in {"completed", "failed"} else None
        self._q("""UPDATE coding_evaluations SET status=?,completed=?,baseline_run=?,treatment_run=?,result=?,error=? WHERE id=?""",
                (status, completed, baseline_run, treatment_run, json.dumps(result) if result is not None else None, error, eid))
        return self.coding_evaluation(eid)

    def coding_evaluation(self, eid):
        row = self._one("SELECT * FROM coding_evaluations WHERE id=?", (eid,))
        if not row:
            return None
        item = dict(row)
        item["result"] = json.loads(item["result"]) if item["result"] else None
        return item

    def idempotency_resource(self, key, operation, request_digest):
        row = self._one("SELECT * FROM idempotency_keys WHERE key=? AND operation=?", (key, operation))
        if not row:
            return None
        if row["request_digest"] != request_digest:
            raise ValueError("idempotency key was already used with a different request")
        return row["resource_id"]

    def remember_idempotency(self, key, operation, request_digest, resource_id):
        self._q("INSERT INTO idempotency_keys VALUES(?,?,?,?,?)", (key, operation, request_digest, resource_id, time.time()))

    # ---- public waitlist ----
    def add_waitlist_signup(self, email, source="landing"):
        normalized = email.strip().lower()
        with self.lock:
            existing = self.db.execute("SELECT created FROM waitlist_signups WHERE email=?", (normalized,)).fetchone()
            if existing:
                return {"accepted": True, "new": False, "created": existing["created"]}
            created = time.time()
            self.db.execute("INSERT INTO waitlist_signups(email,created,source) VALUES(?,?,?)", (normalized, created, source))
            self.db.commit()
            return {"accepted": True, "new": True, "created": created}

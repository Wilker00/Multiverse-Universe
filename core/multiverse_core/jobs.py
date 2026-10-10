"""Small local job queue used by the evaluation wedge.

The queue is intentionally single-worker so two evaluations cannot interleave
against the same mutable store. Replace it with a durable worker service before
deploying more than one API process.
"""
from concurrent.futures import ThreadPoolExecutor
import uuid


class JobManager:
    def __init__(self, store, max_workers=1):
        self.store = store
        self.executor = ThreadPoolExecutor(max_workers=max_workers, thread_name_prefix="multiverse-job")

    def submit(self, kind, operation):
        jid = "job_" + uuid.uuid4().hex
        self.store.create_job(jid, kind)
        self.executor.submit(self._run, jid, operation)
        return self.store.job(jid)

    def _run(self, jid, operation):
        self.store.update_job(jid, "running")
        try:
            result = operation()
        except Exception as error:
            self.store.update_job(jid, "failed", error=f"{type(error).__name__}: {error}")
        else:
            self.store.update_job(jid, "completed", result=result)

    def shutdown(self, wait=True):
        self.executor.shutdown(wait=wait, cancel_futures=False)

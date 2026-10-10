const $=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms)),div=c=>{const d=document.createElement('div');d.className=c;return d};
const lc=t=>t?t[0].toLowerCase()+t.slice(1):'';
const SC={
runs:{rows:[['view','Main view'],['step','What each step carries'],['scope','Version one scope']],
unique:[[0,'Kept version one small'],[1,'Brought the timeline view and the per-step fields'],[2,'Flagged the risk of comparing stale runs']],
final:V=>`Here is what we agreed to build: a run comparison tool with ${lc(V.view)}. Each step carries: ${lc(V.step)}. Version one scope: ${lc(V.scope)}.`,
blocks:[
{r:1,m:0,k:'Plan',txt:'Before we build anything, let us agree on the problem. I think this tool exists to show where two agent runs diverge.'},
{m:1,to:0,k:'Recall',txt:'That fits what I found. These are the closest patterns we have used before.',chips:[['trace viewer',.84],['diff-style view',.79],['timeline scrubbing',.71]]},
{m:2,to:0,k:'Object',txt:'Side by side gets cramped past two runs. I would put every run on one timeline and mark the steps where they split.',bd:[['view','disputed',null,[[2,'one timeline'],[0,'side by side']]]]},
{m:0,to:2,k:'Reply',txt:'Fair, the split points are the useful part. We can still keep a side-by-side panel for the detail of a single step.'},
{m:1,k:'Weigh',opts:[['Side-by-side columns',.55],['One timeline with split markers',.82],['Single list with filters',.38]],pick:1,post:'The timeline holds up at three runs or more, and the side-by-side view survives as a detail panel.',bd:[['view','agreed','One timeline with split markers and a detail panel']]},
{m:2,to:1,k:'Ask',txt:'What does one step need to carry for this to work?'},
{m:1,to:2,k:'Reply',txt:'Which agent ran it, the tool call, the memory it used, the decision it made, and its score.',chips:[['agent','id'],['tool call','input + output'],['memory','matches'],['score','0 to 10']],bd:[['step','agreed','Agent, tool call, memory used, decision, score']]},
{k:'Review',note:'Scored anonymously by the two models that did not write each proposal. Authors are revealed after.',review:[['One timeline',[8,9],2],['Side by side',[6,6],0],['Single list',[3,4],1]]},
{div:'Round 2 of 2',r:2},
{m:2,to:0,k:'Object',txt:'What about version one? I want live updates while a run is still going, otherwise people compare stale runs.',bd:[['scope','disputed',null,[[2,'include live streaming'],[0,'recorded runs only'],[1,'recorded runs only']]]]},
{m:0,to:2,k:'Reply',txt:'Live streaming doubles the work and adds cost. I would keep version one to recorded runs.'},
{m:1,to:'you',k:'Ask',row:'scope',auto:2,txt:'Models 1 and 2 would ship recorded runs only. Model 3 wants live streaming in version one. Your call?',choices:[
{label:'Recorded runs only',bd:[['scope','agreed','Recorded runs only',null,[[2,'wants live streaming in version one']]]],rep:{m:2,txt:'Understood. Please keep my dissent in the summary, because stale comparisons are a real risk.'}},
{label:'Include live streaming',bd:[['scope','agreed','Recorded runs plus live streaming',null,[[0,'worries about cost and extra work'],[1,'prefers a smaller first version']]]],rep:{m:0,txt:'Fine, but I want a hard limit on live runs shown at once, or cost will climb.'}},
{label:'Let the models decide',bd:[['scope','agreed','Recorded runs only',null,[[2,'wants live streaming in version one']]]],rep:{m:1,txt:'Two against one, so recorded runs only. Model 3 can reopen it for version two.'}}]},
{m:1,k:'Draft',file:'spec.md',lines:['view: {view}','each step: {step}','scope: {scope}']}]},
docs:{rows:[['first','Who opens it first'],['list','Checklist style'],['done','What counts as done']],
unique:[[1,'Framed the job around missing paperwork'],[2,'Argued for editable templates over a fixed list'],[0,'Pushed for approval as the definition of done']],
final:V=>`Here is what we agreed to build: a tool for ${lc(V.first)} that lists the missing documents and why each matters, driven by an ${lc(V.list)}. A document counts as done when it is ${lc(V.done)}.`,
blocks:[
{r:1,m:1,k:'Plan',txt:'The job is to catch missing paperwork before anyone has to chase it by email. First, who opens this tool?'},
{m:0,to:'you',k:'Ask',row:'first',txt:'Who opens this first: the person who signs off, or the person who uploads documents?',choices:[
{label:'The person who signs off',bd:[['first','agreed','The person who signs off']],rep:{m:1,txt:'Then the first screen lists what is missing and why it matters, not an upload form.'}},
{label:'The person who uploads',bd:[['first','agreed','The person who uploads documents']],rep:{m:1,txt:'Then the first screen is a simple upload list showing what is still needed per document.'}}]},
{m:2,to:1,k:'Object',txt:'Requirements change by project, so a fixed checklist will be wrong within a week.',bd:[['list','disputed',null,[[2,'editable per project'],[1,'fixed checklist']]]]},
{m:1,to:2,k:'Recall',txt:'Agreed. These are the setups that held up best for us.',chips:[['per-project template',.86],['status by document',.8],['reminder after 3 days',.66]]},
{m:0,k:'Weigh',opts:[['Fixed checklist',.35],['Editable template per project',.84],['Free-form notes',.3]],pick:1,post:'An editable template gives structure without hard-coding a list that will drift.',bd:[['list','agreed','Editable template per project type']]},
{k:'Review',note:'Scored anonymously by the two models that did not write each proposal. Authors are revealed after.',review:[['Editable template',[9,8],2],['Fixed checklist',[5,6],1],['Free-form notes',[2,3],0]]},
{div:'Round 2 of 2',r:2},
{m:2,to:0,k:'Ask',txt:'What counts as done for a document, uploaded or approved?',bd:[['done','disputed',null,[[0,'approved'],[2,'uploaded is enough']]]]},
{m:0,to:2,k:'Reply',txt:'Approved. Uploaded but unreviewed should show as pending, not complete.'},
{m:2,to:'you',k:'Ask',row:'done',txt:'I still think uploaded should count, or people get chased for documents they already sent. Which do you want?',choices:[
{label:'Approved means done',bd:[['done','agreed','Approved',null,[[2,'wants uploaded to count as done']]]],rep:{m:2,txt:'Noted. I would still show uploaded documents as pending so nobody is chased twice.'}},
{label:'Uploaded counts as done',bd:[['done','agreed','Uploaded',null,[[0,'wants approval before a document counts']]]],rep:{m:0,txt:'Then we need a clear approved badge, or reviewers will not know what is still unchecked.'}}]},
{m:1,k:'Draft',file:'spec.md',lines:['first screen: for {first}','checklist: {list}','done means: {done}']}]}};
const BR={
runs:{view:[{l:'Side by side',v:'Side-by-side columns',m:[0],why:'Easy to read for two runs, but cramped past two.'},{l:'One timeline',v:'One timeline with split markers and a detail panel',m:[2],why:'Scales to five runs and shows where they split. Needs split detection.'}],
scope:[{l:'Recorded runs only',v:'Recorded runs only',m:[0,1],why:'Ships sooner and costs less, but runs can be stale.'},{l:'Live streaming',v:'Recorded runs plus live streaming',m:[2],why:'Always fresh, but roughly doubles the work and cost.'}]},
docs:{first:[{l:'Sign-off first',v:'The person who signs off',m:[],why:'Opens on what is missing and why it matters.'},{l:'Uploader first',v:'The person who uploads documents',m:[],why:'Opens on a simple upload list.'}],
list:[{l:'Fixed checklist',v:'Fixed checklist',m:[1],why:'Simple to build, but drifts as projects change.'},{l:'Editable template',v:'Editable template per project type',m:[2],why:'Stays accurate, but needs template editing.'}],
done:[{l:'Approved',v:'Approved',m:[0],why:'Trustworthy, but slower to clear a document.'},{l:'Uploaded',v:'Uploaded',m:[2],why:'Fast, but unchecked documents can slip through.'}]}};
const MD=[{n:'planner',c:'#b8b8b2'},{n:'researcher',c:'#a6a6a0'},{n:'challenger',c:'#92928c'}];
const MS=['P','R','C'];
$('#cast').innerHTML='<span>Configured roles</span>'+MD.map((m,i)=>`<span class="cm"><span class="role-mark" aria-hidden="true">${MS[i]}</span><span><b style="font-weight:600;color:var(--ink)">${m.n}</b><span class="ct" id="ct${i}"></span></span></span>`).join('');
let run=0,busy=false,mode='idle',tick;
const bars=[...Array(24)].map(()=>{const d=document.createElement('i');$('#wave').appendChild(d);return d});
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const AMP={idle:.04,thinking:.22,acting:.32,speaking:.42};
if(!reduceMotion)(function lp(t){const a=AMP[mode];bars.forEach((b,i)=>{const v=.5+.5*Math.sin(t/(mode==='speaking'?110:260)+i*.55)*Math.sin(t/430+i*.23);b.style.height=(2+a*20*v)+'px'});requestAnimationFrame(lp)})(0);
function setState(s,l){mode=s;const stage=$('#orb'),image=stage.querySelector('img'),poses={idle:'welcome.svg',thinking:'thinking.svg',acting:'point.svg',speaking:'welcome.svg'};stage.className='mascot-stage '+s;image.src='../public/mascot/'+poses[s];$('#st').textContent=l;$('#wave').className='wave'+(s==='idle'?'':' on')}
const scr=()=>window.scrollTo({top:document.body.scrollHeight});
async function type(el,text,id){if(reduceMotion){el.textContent=text;return id===run}const words=text.split(' ');for(let index=0;index<words.length;index++){if(id!==run)return false;el.textContent+=(index?' ':'')+words[index];scr();await sleep(34)}return true}
async function para(body,text,id){const p=document.createElement('p');p.className='typing';body.appendChild(p);const ok=await type(p,text,id);p.classList.remove('typing');return ok}
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BD={},pending=[],ST={open:'Open',disputed:'Disputed',agreed:'Selected',yours:'Your call'};let waiter=null,un=0,BRS={},cur=null,finished=false;const LT="ABC";
const avx=m=>`<span class="av xs" style="--c:${MD[m].c}" aria-hidden="true">${MS[m]}</span>`;
function mark(t){const x=div('rd fk');x.textContent=t;$('#think').appendChild(x);scr()}
function chip(r,i,dn){const b=r.br[i],ms=b.m||[],can=dn&&i===r.canon,alt=dn&&!can;
return `<div class="vc ${can?'can':alt?'alt':''}" style="--c:${ms.length?MD[ms[0]].c:'#c9ced6'}"><div class="vr"><span class="vt">${r.n}·${LT[i]}</span><span>${esc(b.l)}</span><span class="avs">${ms.map(avx).join('')}</span><span class="vk">${can?'selected':alt?'alternate':'proposed'}</span></div><div class="dt"><div>${esc(b.why)}</div>${ms.length?`<div class="who">${ms.map(m=>MD[m].n).join(', ')} back${ms.length>1?'':'s'} this verse</div>`:''}${alt&&finished?`<button class="pill" data-sw="${r.id}:${i}">Hop to this verse</button>`:''}</div></div>`}
function colHtml(r){const dn=r.s==='agreed';let h=`<div class="mn ${dn?'sp':''}"><i class="nd ${dn?'on':''}"></i><b>${esc(r.t)}</b></div>`;
if(r.s==='open')h+='<div class="vc ph">undecided</div>';
else if(!r.br)h+=`<div class="vc can solo"><div class="vr"><span class="vt">${r.n}</span><span>${esc(r.v)}</span></div></div>`;
else{const ix=r.br.map((_,i)=>i),o=dn&&r.canon>=0?[r.canon,...ix.filter(i=>i!==r.canon)]:ix;h+='<div class="bk">'+o.map(i=>chip(r,i,dn)).join('')+'</div>'}
if(dn&&r.dis&&r.dis.length)h+=r.dis.map(([m,t])=>`<div class="dsl">${avx(m)}${MD[m].n} dissents: ${esc(t)}</div>`).join('');
return h}
function addRow(id,t,v,s){const el=div('mc'),r=BD[id]={id,t,v:v||'',s:s||'agreed',dis:null,el,br:BRS[id]||null,canon:-1,n:Object.keys(BD).length+1};el.innerHTML=colHtml(r);$('#rows').appendChild(el)}
function applyBd(l){l.forEach(([id,s,v,st,dis])=>{const r=BD[id],prev=r.s;r.s=s;if(v!=null)r.v=v;if(dis)r.dis=dis;
if(s==='agreed'&&r.br)r.canon=r.br.findIndex(b=>b.v===r.v);
if(r.br&&prev==='open'&&(s==='disputed'||s==='yours'))mark(`Verse ${r.n} forks into ${r.br.map((b,i)=>r.n+'·'+LT[i]+' '+b.l.toLowerCase()).join(' and ')}`);
if(r.br&&s==='agreed'&&prev!=='agreed'&&r.canon>=0)mark(`Verse ${r.n}·${LT[r.canon]} is selected, the other stays as an alternate verse`);
r.el.innerHTML=colHtml(r);r.el.classList.remove('flash');void r.el.offsetWidth;r.el.classList.add('flash')});emitEv({t:'bd',rows:snap()})}
function buildBoard(sc){Object.keys(BD).forEach(k=>delete BD[k]);$('#rows').innerHTML='';sc.rows.forEach(([id,t])=>addRow(id,t,'','open'));un=0;rnd(1)}
function compose(){const V={};Object.entries(BD).forEach(([k,r])=>V[k]=r.v);let txt=cur.sc.final(V);
const us=Object.entries(BD).filter(([k])=>/^u\d+$/.test(k)).map(([k,r])=>r.v);if(us.length)txt+=' Your constraints: '+us.join('; ')+'.';
const ds=Object.values(BD).flatMap(r=>(r.dis||[]).map(([m,t])=>MD[m].n+' '+t));if(ds.length)txt+=' Dissent noted: '+ds.join('; ')+'.';
const alt=Object.values(BD).filter(r=>r.br&&r.canon>=0).flatMap(r=>r.br.filter((b,i)=>i!==r.canon).map(b=>b.l.toLowerCase()+' ('+r.t.toLowerCase()+')'));if(alt.length)txt+=' Alternate verses kept: '+alt.join('; ')+'.';
return txt}
function hop(id,bi){const r=BD[id];if(!finished||!r.br||r.canon===bi)return;const b=r.br[bi],old=r.br[r.canon];
youBlock('Hop to verse '+r.n+'·'+LT[bi]+': '+b.l);mark(`Verse ${r.n}·${LT[bi]} is now selected, ${r.n}·${LT[r.canon]} stays as an alternate verse`);
r.canon=bi;r.v=b.v;r.dis=old.m&&old.m.length?old.m.map(m=>[m,'preferred '+old.l.toLowerCase()]):[];
Object.values(BD).forEach(x=>x.el.innerHTML=colHtml(x));r.el.classList.remove('flash');void r.el.offsetWidth;r.el.classList.add('flash');
$('#final').textContent=compose();S.stats.hops++;const LR=S.runs[S.runs.length-1];if(LR){LR.rows=snap();LR.final=$('#final').textContent}save();badge()}
$('#rows').addEventListener('click',e=>{const w=e.target.closest('[data-sw]');if(w){const[a,b]=w.dataset.sw.split(':');hop(a,+b);return}const c=e.target.closest('.vc');if(c&&!c.classList.contains('ph'))c.classList.toggle('open')});
const rnd=(r,l)=>{$('#rc').textContent=l||(r?`Round ${r} of 2`:'Consolidating')};
function youBlock(t){const d=div('blk');d.innerHTML='<div class="av you">you</div><div class="lab"><b>You</b></div>';const p=document.createElement('p');p.textContent=t;d.appendChild(p);$('#think').appendChild(d);scr()}
async function constraint(t,id){youBlock(t);addRow('u'+(++un),'Your constraint',t);
if(!await block({m:0,to:'you',k:'Reply',txt:'Noted. I will treat "'+t+'" as a requirement and check it against what we have agreed so far.'},id))return false;
return block({m:2,to:0,k:'Reply',txt:'If it conflicts with anything we settled, I will flag it before we finalize.'},id)}
async function consensus(b,id){rnd(0);const d=div('blk');d.innerHTML='<div class="av all">3</div><div class="lab"><b>Combined draft</b> · Not verified</div>';const body=div('body');d.appendChild(body);$('#think').appendChild(d);setState('thinking','Consolidating');await sleep(700);
const ag=Object.values(BD).filter(r=>r.s==='agreed');
const grp=async(h,items)=>{if(!items.length)return true;const g=div('gh');g.textContent=h;body.appendChild(g);for(const it of items){if(id!==run)return false;const x=div('gi');x.innerHTML=it;body.appendChild(x);scr();await sleep(520)}return true};
if(!await grp('Selected for this draft',ag.map(r=>`<span><b style="font-weight:600">${esc(r.t)}</b>: ${esc(r.v)}</span>`)))return false;
if(!await grp('Where we split',ag.flatMap(r=>(r.dis||[]).map(([m,t])=>`${avx(m)}<span>${MD[m].n} ${esc(t)}</span>`))))return false;
if(!await grp('Alternate verses kept',ag.flatMap(r=>r.br&&r.canon>=0?r.br.map((b,i)=>i===r.canon?null:`<span class="vt">${r.n}·${LT[i]}</span><span>${esc(b.l)} <span style="color:var(--mut)">(${esc(r.t.toLowerCase())})</span></span>`).filter(Boolean):[])))return false;
if(!await grp('What each model added',(b.unique||[]).map(([m,t])=>`${avx(m)}<span>${MD[m].n}: ${esc(t)}</span>`)))return false;
return id===run}
async function block(b,id){
if(b.div){rnd(b.r,b.div);const x=div('rd');x.textContent=b.div;$('#think').appendChild(x);scr();await sleep(600);return id===run}
if(b.k==='Synthesis')return consensus(b,id);
if(b.k==='Review')return review(b,id);
if(b.r)rnd(b.r);
const md=MD[b.m],d=div('blk');
d.innerHTML=`<div class="av" style="--c:${md.c}">${MS[b.m]}</div><div class="lab"><b>${md.n}</b>${b.to!=null?' → '+(b.to==='you'?'you':MD[b.to].n):''} · ${b.k}</div>`;
const fb=document.createElement('button');fb.className='fkb';fb.textContent='fork';fb.title='Fork from this message';fb.onclick=()=>{forkFrom=md.n+' · '+b.k;$('#in').placeholder='Fork from '+forkFrom+': what if…';$('#in').focus()};d.querySelector('.lab').appendChild(fb);
const body=div('body');d.appendChild(body);$('#think').appendChild(d);setState('thinking',md.n+' is working');const t0=Date.now();if(b.k==='Recall')b=recallInto(b);
if(b.txt&&!await para(body,b.txt,id))return false;
if(b.chips){const r=div('chips');body.appendChild(r);for(const[l,v]of b.chips){if(id!==run)return false;const c=document.createElement('span');c.className='chip';c.innerHTML=`<span>${l}</span><b>${typeof v==='number'?v.toFixed(2):v}</b>`;r.appendChild(c);scr();await sleep(300)}}
if(b.prov){const pv=div('sub');pv.textContent='recalled from "'+b.prov.task.slice(0,34)+'" · '+b.prov.verse+' · '+(b.prov.m!=null?MD[b.prov.m].n:'you')+' · verified source';body.appendChild(pv)}
if(b.opts){const g=div('opts');b.opts.forEach(([l,c])=>{const o=div('opt');o.innerHTML=`<div class="ol">${l}</div><div class="bar2"><u></u></div><div class="oc">confidence ${c.toFixed(2)}</div>`;g.appendChild(o)});body.appendChild(g);scr();await sleep(250);[...g.children].forEach((o,i)=>o.querySelector('u').style.width=b.opts[i][1]*100+'%');await sleep(1000);g.children[b.pick].classList.add('pick');await sleep(300)}
if(b.post&&!await para(body,b.post,id))return false;
if(b.file){const x=div('diff');x.innerHTML=`<div class="df">${b.file}</div>`;body.appendChild(x);for(const l of b.lines){if(id!==run)return false;const a=div('add');a.textContent='+ '+l.replace(/\{(\w+)\}/g,(m,k)=>lc(BD[k]&&BD[k].v)||'...');x.appendChild(a);scr();await sleep(450)}}
if(b.bd)applyBd(b.bd);
if(b.choices){if(b.row)applyBd([[b.row,'yours']]);setState('idle','Waiting for your call');
const box=div('choices');b.choices.forEach((c,i)=>{const x=document.createElement('button');x.className='pill';x.textContent=c.label;x.onclick=()=>{if(waiter){const w=waiter;waiter=null;w(i)}};box.appendChild(x)});body.appendChild(box);scr();
const i=await askUser(b,id);if(i<0||id!==run)return false;
box.remove();const c=b.choices[i];if(askUser.auto)mark('Models decided: '+c.label);else youBlock(c.label);applyBd(c.bd);await sleep(500);
if(!await block({m:c.rep.m,to:'you',k:'Reply',txt:c.rep.txt},id))return false}
if(b.txt)tally(b.m,(b.txt||'')+(b.post||''),Date.now()-t0);emitEv({t:'msg',m:b.m,to:b.to==null?null:b.to,k:b.k,txt:b.txt||'',post:b.post||''});await sleep(300);return id===run}
function ui(on){const hasInput=$('#in').value.trim().length>0;$('.send-label').textContent=on?(hasInput?'Add':'Stop'):'Run';$('#send').setAttribute('aria-label',on?(hasInput?'Add constraint':'Stop run'):'Start run');$('#sug').style.display=on?'none':'flex';$('#in').placeholder=on?'Add a constraint or answer a question':'Describe a task with a checkable outcome'}
async function submit(task){if(busy||!task.trim())return;busy=true;const id=++run;pending.length=0;waiter=null;$('#in').value='';
document.body.classList.add('running');const u=$('#usr');u.textContent=task;u.style.display='block';
$('#tp').style.display='block';$('#tp').className='tp';$('#think').innerHTML='';$('#final').textContent='';$('#meta').innerHTML='';ui(true);document.body.classList.remove('finished');TL.forEach(x=>{x.tok=0;x.ms=0;x.real=false});ctUp();emitEv({t:'start',task});if(S.set.live&&(SMP||BE))return live(task,id);
const key=/doc|paper|file|missing|closeout|checklist|project/i.test(task)?'docs':'runs',sc=SC[key];BRS=BR[key];cur={sc,task};finished=false;buildBoard(sc);
const t0=Date.now();clearInterval(tick);tick=setInterval(()=>{$('#tl').textContent='Thinking · '+Math.round((Date.now()-t0)/1000)+'s'},250);
let ok=true;
for(const b of sc.blocks){while(ok&&pending.length)ok=await constraint(pending.shift(),id);if(!ok)break;ok=await block(b,id);if(!ok)break}
while(ok&&pending.length)ok=await constraint(pending.shift(),id);
if(ok)ok=await block({k:'Synthesis',unique:sc.unique},id);
if(ok)return finishRun(task,id,t0,key)}
function stop(){run++;busy=false;if(waiter){const w=waiter;waiter=null;w(-1)}clearInterval(tick);$('#tl').textContent='Stopped';$('#tp').classList.add('done');setState('idle','Stopped');ui(false)}
$('#send').onclick=()=>{if(busy){const v=$('#in').value.trim();if(v){$('#in').value='';ui(true);const t=forkFrom?'What if '+v+' (fork from '+forkFrom+')':v;forkFrom=null;if(waiter)constraint(t,run);else pending.push(t)}else stop()}else submit($('#in').value)};
$('#in').onkeydown=e=>{if(e.key==='Enter')$('#send').click()};
$('#in').oninput=()=>ui(busy);
document.querySelectorAll('.sug .pill').forEach(b=>b.onclick=()=>submit(b.textContent));
$('#tt').onclick=()=>{const closed=$('#tp').classList.toggle('shut');$('#tt').setAttribute('aria-expanded',String(!closed))};

// ======== app: store ========
const KEY='multiverse.v2';let S={mem:[],runs:[],stats:{hops:0},set:{autonomy:'ask',live:false}};
try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j)S=Object.assign(S,j)}catch(e){}
S.set=Object.assign({autonomy:'ask',live:false},S.set);S.stats=Object.assign({hops:0},S.stats);S.mem=(S.mem||[]).map(memory=>({...memory,status:memory.status||'candidate',scope:memory.scope||'task'}));
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
let page='arena',SMP=null,DL=null,forkFrom=null,BUILD=null,cmpRun=null,bt=null,BE=null,CORE=null;
(async()=>{try{if(window.claude){SMP=(await window.claude.use('sample'))||null;DL=(await window.claude.use('downloads'))||null}}catch(e){}tagUp();if(page==='set')renderSet();if(page==='bld')renderBld()})();
const TIER=['default','quick','complex'],PR=[.003,.001,.015],ROLE=['planner','researcher','skeptic'],TL=[{tok:0,ms:0},{tok:0,ms:0},{tok:0,ms:0}];
function tally(m,t,ms,u){const x=TL[m];if(u&&u.in!=null){x.tok+=u.in+u.out;x.real=true}else x.tok+=Math.ceil(t.length/4);x.ms+=ms;ctUp()}
function ctUp(){TL.forEach((x,i)=>{const e=$('#ct'+i);if(e)e.textContent=x.tok?`${x.tok} tok${x.real?'':' est.'} · ${(x.ms/1000).toFixed(1)}s`:ROLE[i]})}
function tagUp(){$('#tg').textContent=CORE?'Core connected · '+(CORE.health.synthetic?'synthetic agent':'live agent'):'Prototype · '+(S.set.live&&(SMP||BE)?'connected runner':'scripted')+' · '+{ask:'asks you',timed:'uses a default after 8s',auto:'uses scripted defaults'}[S.set.autonomy]}
// ======== autonomy ========
async function askUser(b,id){const mode=S.set.autonomy,au=b.auto!=null?b.auto:0;askUser.auto=false;
if(mode==='auto'){askUser.auto=true;setState('thinking','Using the configured default');await sleep(800);return au}
const p=new Promise(r=>waiter=r);let t=null;
if(mode==='timed'){let n=8;t=setInterval(()=>{n--;if(n<=0){clearInterval(t);if(waiter){const w=waiter;waiter=null;askUser.auto=true;w(au)}}else $('#st').textContent='Waiting for your call · '+n+'s'},1000)}
const r=await p;clearInterval(t);return r}
// ======== recall with provenance ========
function recallInto(b){const query=((cur&&cur.task||'')+' '+b.txt).toLowerCase().match(/[a-z]{4,}/g)||[];
const eligible=S.mem.concat(SH.mem).filter(memory=>memory.status==='verified');const scored=eligible.map(memory=>{const words=new Set(memory.text.toLowerCase().match(/[a-z]{4,}/g)||[]),overlap=query.filter(word=>words.has(word)).length;return{memory,score:overlap?Math.min(.99,(overlap/6+.3)*(memory.trust||.7)):0}}).filter(item=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
if(!scored.length)return b;return{...b,chips:scored.map(item=>[item.memory.text.slice(0,30)+(item.memory.text.length>30?'…':''),+item.score.toFixed(2)]),prov:scored[0].memory}}
// ======== anonymous peer review ========
async function review(b,id){const d=div('blk');d.innerHTML='<div class="av all">R</div><div class="lab"><b>Model review</b> · Not verification</div>';const body=div('body');d.appendChild(body);$('#think').appendChild(d);setState('thinking','Reviewing anonymously');
const p=div('sub');p.textContent=b.note;body.appendChild(p);const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
const rows=b.review.map(([l,sc],i)=>{const r=div('rv2');r.innerHTML=`<span>Proposal ${'ABC'[i]}</span><div class="b2"><u></u></div><b style="font-weight:500">${avg(sc).toFixed(1)}</b>`;body.appendChild(r);return r});
scr();await sleep(300);rows.forEach((r,i)=>r.querySelector('u').style.width=avg(b.review[i][1])*10+'%');await sleep(1100);
rows.forEach((r,i)=>{r.querySelector('span').innerHTML=`${avx(b.review[i][2])} ${esc(b.review[i][0])}`});await sleep(500);return id===run}
// ======== saving runs + memory ========
function snap(){return Object.values(BD).map(r=>({id:r.id,t:r.t,v:r.v,s:r.s,dis:r.dis,canon:r.canon,br:r.br,n:r.n}))}
function saveRun(task,key){const rows=snap();
S.runs.push({id:Date.now(),task,key,ts:Date.now(),rows,final:$('#final').textContent,tally:TL.map(x=>({tok:x.tok,ms:x.ms}))});S.runs=S.runs.slice(-30);
rows.forEach(r=>{if(r.s!=='agreed'||!r.v)return;const text=r.t+': '+r.v;if(S.mem.some(m=>m.text===text&&m.task===task))return;
const ch=r.br&&r.canon>=0?(r.br[r.canon].m||[])[0]:null;S.mem.push({id:Date.now()+Math.random(),text,task,verse:r.br&&r.canon>=0?`verse ${r.n}·${LT[r.canon]}`:`verse ${r.n}`,m:ch==null?null:ch,trust:.7,ts:Date.now(),kind:/^u\d/.test(r.id)?'constraint':'decision',status:'candidate',scope:'task'})});
S.mem=S.mem.slice(-200);save();badge()}
async function finishRun(task,id,t0,key){if(id!==run)return;clearInterval(tick);
$('#tl').textContent='Trace · '+Math.round((Date.now()-t0)/1000)+'s';$('#tp').classList.add('done');
const txt=compose();setState('speaking','Responding');const f=$('#final');f.className='typing';await type(f,txt,id);f.className='';emitEv({t:'final',txt});
if(id!==run)return;setState('idle','Draft complete');busy=false;finished=true;document.body.classList.add('finished');ui(false);Object.values(BD).forEach(r=>{r.el.innerHTML=colHtml(r)});saveRun(task,key);
$('#meta').innerHTML='<button class="pill" id="again">Run again</button><span class="sub" style="margin-left:12px">Tap an alternate verse on the map to hop to it. Saved as a run with unverified memory candidates.</span>';$('#again').onclick=()=>submit(task)}
// ======== live mode (real Claude calls) ========
async function live(task,id){const t0=Date.now();clearInterval(tick);tick=setInterval(()=>{$('#tl').textContent='Thinking · '+Math.round((Date.now()-t0)/1000)+'s'},250);
BRS={};cur={sc:{final:()=>''},task};finished=false;buildBoard({rows:[]});
const PERS=['the planner, who turns the goal into a clear problem and a first proposal','the researcher, who brings evidence and prior patterns and proposes concrete options','the skeptic, who challenges scope and assumptions and names risks'],hist=[];
const turn=async(m,to,k,instr,indep)=>{const d=div('blk');d.innerHTML=`<div class="av" style="--c:${MD[m].c}">${MS[m]}</div><div class="lab"><b>${MD[m].n}</b>${to!=null?' → '+MD[to].n:''} · ${k}</div>`;const p=document.createElement('p');p.textContent='…';d.appendChild(p);$('#think').appendChild(d);scr();
const t=Date.now(),r=await askModel([{role:'user',content:`You are model ${m+1} in a three-model design discussion, ${PERS[m]}. Task: "${task}".\nDiscussion so far:\n${indep?'(none, give your own independent view)':hist.join('\n')||'(none)'}\n\n${instr}\nAnswer in two or three plain sentences. No markdown, no lists.`}],m,({text})=>{p.textContent=text;scr()});
const tx=r.text.trim();p.textContent=tx;tally(m,tx,Date.now()-t,r.usage);return`model ${m+1}: ${tx}`};
try{rnd(1);setState('thinking','Models are answering');
const r1=await Promise.all([0,1,2].map(m=>turn(m,null,'Proposal','Propose how to approach this and what the tool must do.',true)));if(id!==run)return;hist.push(...r1);
mark('Each model answered alone first. Now they respond to each other.');rnd(2,'Round 2 of 2');
for(const m of [0,1,2]){if(id!==run)return;setState('thinking',MD[m].n+' is working');hist.push(await turn(m,(m+1)%3,'Reply','Respond to the other models. Name one point you agree with and one you disagree with.',false))}
if(id!==run)return;rnd(0);setState('thinking','Consolidating');
const j=(await genJson(`You are the chairman of a three-model design discussion. Task: "${task}". Discussion:\n${hist.join('\n')}\n\nReturn JSON only: {"decisions":[{"title":"short","options":[{"label":"short","why":"one sentence","backers":[1]},{"label":"short","why":"one sentence","backers":[2,3]}],"pick":0}],"unique":[{"model":1,"idea":"short"}],"summary":"two sentences describing what to build"}. Use 3 decisions with 2 options each. Backers are model numbers 1 to 3.`,2)).j;
if(id!==run)return;const ds=(j.decisions||[]).slice(0,4);
ds.forEach((d,i)=>{BRS['d'+i]=(d.options||[]).slice(0,3).map(o=>({l:o.label,v:o.label,m:(o.backers||[]).map(x=>x-1).filter(x=>x>=0&&x<3),why:o.why||''}));addRow('d'+i,d.title,'','open')});
for(let i=0;i<ds.length;i++){const br=BRS['d'+i];if(!br.length)continue;applyBd([['d'+i,'disputed']]);await sleep(500);const pk=Math.min(ds[i].pick||0,br.length-1),o=br[pk];
applyBd([['d'+i,'agreed',o.v,null,br.flatMap((x,k)=>k===pk?[]:x.m.slice(0,1).map(m=>[m,'preferred '+x.l.toLowerCase()]))]]);await sleep(400)}
cur.sc={final:()=>j.summary||'Here is what we agreed to build.'};
if(!await consensus({unique:(j.unique||[]).filter(u=>u.model>=1&&u.model<=3).map(u=>[u.model-1,u.idea])},id))return;
return finishRun(task,id,t0,'live')}
catch(e){if(id!==run)return;clearInterval(tick);busy=false;ui(false);setState('idle','Live run failed');$('#final').textContent='The live run stopped: '+((e&&(e.message||e.code))||'unknown error')+'. Switch to Scripted in Settings or try again.'}}
// ======== pages ========
const PG={arena:()=>{},mem:renderMem,ver:renderVer,bld:renderBld,sim:renderSim,brd:renderBrd,st:renderSt,set:renderSet};
function show(p){if(!PG[p])return;page=p;document.querySelectorAll('.pg').forEach(section=>section.classList.toggle('on',section.id==='p-'+p));document.querySelectorAll('#nav button[data-p]').forEach(button=>{const active=button.dataset.p===p;button.classList.toggle('on',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});PG[p]();badge();$('#nav').classList.remove('open');$('#nav-more')?.classList.remove('open');$('#nav-more-trigger')?.setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-expanded','false');window.scrollTo(0,0)}
function badge(){const memory=$('#bg-mem'),runs=$('#bg-st'),coreMem=CORE?CORE.memory.length:0,coreRuns=CORE?CORE.runs.length:0;if(memory)memory.textContent=S.mem.length+coreMem||'';if(runs)runs.textContent=S.runs.length+coreRuns||''}
const navButton=([key,label])=>`<button type="button" data-p="${key}">${label}${key==='mem'||key==='st'?`<i id="bg-${key}"></i>`:''}</button>`;
$('#nav').innerHTML=[['arena','Task'],['st','Runs'],['mem','Memory'],['ver','Verses']].map(navButton).join('')+`<div class="nav-more" id="nav-more"><button class="nav-more-trigger" id="nav-more-trigger" type="button" aria-expanded="false" aria-controls="nav-more-panel">More</button><div class="nav-more-panel" id="nav-more-panel">${[['bld','Execution'],['sim','Evaluation'],['set','Settings']].map(navButton).join('')}</div></div>`;
$('#nav').onclick=event=>{const more=event.target.closest('#nav-more-trigger');if(more){const open=$('#nav-more').classList.toggle('open');more.setAttribute('aria-expanded',String(open));return}const button=event.target.closest('button[data-p]');if(button)show(button.dataset.p)};
$('#menu-toggle').onclick=()=>{const open=$('#nav').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open))};
function renderMem0(){const query=($('#mq').value||'').toLowerCase(),list=$('#ml');list.innerHTML='';
const items=S.mem.filter(memory=>!query||memory.text.toLowerCase().includes(query)||(memory.task||'').toLowerCase().includes(query));
if(!items.length){list.innerHTML='<p class="lede2">'+(S.mem.length?'No matching candidates.':'No memory candidates yet. Complete a run to create task-local candidates for review.')+'</p>';return}
items.slice().sort((a,b)=>b.ts-a.ts).forEach(memory=>{const card=div('mcard'),who=memory.m!=null?`${avx(memory.m)}${MD[memory.m].n}`:'you',status=memory.status||'candidate';
card.innerHTML=`<p></p><div class="prov"><span class="memory-status">${status}</span><span>${who}</span><span>${esc(memory.verse||'')}</span><span>${esc((memory.task||'').slice(0,40))}</span><span>${new Date(memory.ts).toLocaleDateString()}</span><span class="tr"><button class="mini" type="button" data-d="keep">Keep task-local</button>${DB&&status==='verified'?'<button class="mini" type="button" data-d="share">Share verified</button>':''}<button class="mini" type="button" data-d="reject">Reject</button></span></div>`;
card.querySelector('p').textContent=memory.text;card.querySelector('.tr').onclick=event=>{const action=event.target.dataset.d;if(!action)return;if(action==='share'){shareMem(memory);return}if(action==='reject')S.mem=S.mem.filter(item=>item!==memory);if(action==='keep')memory.scope='task';save();renderMem();badge()};list.appendChild(card)})}
$('#mq').oninput=renderMem;$('#mab').onclick=()=>{const value=$('#ma').value.trim();if(!value)return;S.mem.push({id:Date.now(),text:value,task:'added by you',verse:'manual note',m:null,trust:.7,ts:Date.now(),kind:'note',status:'candidate',scope:'task'});$('#ma').value='';save();renderMem();badge()};
function vopts(){const o=[];RUNS().forEach((r,i)=>{o.push([i+':c',`${r.shared?'Shared run':'Run'} ${i+1} · ${r.task.slice(0,30)} · selected`]);if(r.rows.some(x=>x.br))o.push([i+':a',`${r.shared?'Shared run':'Run'} ${i+1} · ${r.task.slice(0,30)} · alternates`])});return o}
function sideMap(k){const[i,m]=k.split(':'),r=RUNS()[+i],o={};r.rows.forEach(x=>{let v=x.v;if(m==='a'&&x.br&&x.canon>=0){const alt=x.br.find((b,j)=>j!==x.canon);if(alt)v=alt.v}o[x.t]=v});return o}
function renderVer(){const o=vopts(),sa=$('#va'),sb=$('#vb'),keep=[sa.value,sb.value],h=o.map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('');sa.innerHTML=h;sb.innerHTML=h;
if(!o.length){$('#vt').innerHTML='<p class="lede2">No runs yet. Finish a task run, then compare its selected verse with its alternates.</p>';$('#vm').innerHTML='';return}
const li=cmpRun!=null&&RUNS()[cmpRun]?cmpRun:RUNS().length-1,ok=v=>o.some(x=>x[0]===v),fresh=cmpRun!=null||!keep[0];
sa.value=!fresh&&ok(keep[0])?keep[0]:li+':c';const alt=li+':a',prev=(li-1)+':c';sb.value=!fresh&&ok(keep[1])?keep[1]:(ok(alt)?alt:ok(prev)?prev:li+':c');cmpRun=null;vdraw()}
function vdraw(){if(!RUNS().length)return;const A=sideMap($('#va').value),B=sideMap($('#vb').value),ts=[...new Set([...Object.keys(A),...Object.keys(B)])];
$('#vt').innerHTML='<table class="t"><tr><th>Decision</th><th>A</th><th>B</th><th>Take</th></tr>'+ts.map((t,i)=>{const same=A[t]===B[t];return`<tr class="${same?'':'df'}"><td>${esc(t)}</td><td>${esc(A[t]||'—')}</td><td>${esc(B[t]||'—')}</td><td>${same?'same':`<label><input type="radio" name="p${i}" value="A" checked> A</label> <label><input type="radio" name="p${i}" value="B"> B</label>`}</td></tr>`}).join('')+'</table>';
$('#vm').innerHTML='<button class="pill on" id="vgo">Use selected parts in Execution</button>';
$('#vgo').onclick=()=>{const lines=ts.map((t,i)=>{const r=document.querySelector(`input[name=p${i}]:checked`),side=r&&r.value==='B'?B:A;return[t,side[t]||A[t]||B[t]]}).filter(x=>x[1]);BUILD={title:'Merged verse',lines};show('bld')}}
$('#va').onchange=vdraw;$('#vb').onchange=vdraw;
const specMd=()=>`# ${BUILD.title}\n\n`+BUILD.lines.map(([t,v])=>`- **${t}**: ${v}`).join('\n')+'\n';
function renderBld(){if(!BUILD&&S.runs.length){const run=S.runs[S.runs.length-1];BUILD={title:run.task,lines:run.rows.filter(row=>row.s==='agreed'&&row.v).map(row=>[row.t,row.v])}}
const summary=$('#bs'),actions=$('#bb');if(!BUILD){summary.innerHTML='<p class="lede2">No selected specification yet. Complete a task run or combine two Verses first.</p>';actions.innerHTML='';return}
summary.innerHTML=`<div class="mcard"><b style="font-weight:600">${esc(BUILD.title)}</b>`+BUILD.lines.map(([title,value])=>`<div class="gi" style="margin-top:7px"><span><b style="font-weight:600">${esc(title)}</b>: ${esc(value)}</span></div>`).join('')+'</div>';
const connected=SMP||BE;
actions.innerHTML=`<button class="pill" id="bplan"${connected?'':' disabled title="Needs a connected runner"'}>Draft execution plan</button><button class="pill on" id="breal"${connected?'':' disabled title="Needs a connected runner"'}>Run in sandbox</button><button class="pill" id="bgo">Show simulated execution</button>${DL?'<button class="pill" id="bdl">Download specification</button>':''}`;
$('#bplan').onclick=plan;$('#bgo').onclick=build;$('#breal').onclick=buildReal;if($('#bdl'))$('#bdl').onclick=()=>DL.save({filename:'spec.md',data:specMd()}).catch(()=>{})}
async function plan(){const p=$('#bp');p.style.display='block';p.textContent='Thinking…';try{const r=await askModel(`Write a short build plan (6 to 8 numbered steps, plain text, no markdown headers) for this spec:\n${specMd()}`,0,({text})=>{p.textContent=text});p.textContent=r.text}catch(e){p.textContent='Could not reach Claude: '+((e&&(e.message||e.code))||'error')}}
function build(){clearInterval(bt);const L=$('#bl');L.innerHTML='';const slug=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const bs=BUILD.lines.map(([t],i)=>{const e=div('lane');e.innerHTML=`<span>worker ${i+1}</span><div class="b2"><u></u></div><span style="color:var(--mut)">queued</span>`;L.appendChild(e);return{f:'src/'+slug(t)+'.ts',p:0,e}});
const ve=div('lane');ve.innerHTML='<span>verifier</span><div class="b2"><u></u></div><span style="color:var(--mut)">waits for builders</span>';L.appendChild(ve);
const set=(e,p,t)=>{e.querySelector('u').style.width=p+'%';e.lastChild.textContent=t};let lock=null,vp=0,retry=false,pause=0;
bt=setInterval(()=>{if(bs.some(b=>b.p<100)){bs.forEach(b=>{if(b.p>=100)return;let wait=false;if(b.p>=36&&b.p<60){if(lock&&lock!==b)wait=true;else lock=b}
if(!wait)b.p=Math.min(100,b.p+4);if(lock===b&&b.p>=60)lock=null;set(b.e,b.p,b.p>=100?'done':wait?'waiting for lock on src/types.ts':'writing '+b.f)})}
else if(vp<100){if(pause>0){pause--;return}vp+=5;const c=['spec coverage','lint','tests'][Math.min(2,Math.floor(vp/34))];if(vp>=50&&!retry){retry=true;pause=6;set(ve,vp,'tests failed in '+bs[bs.length-1].f+', builder retrying');return}set(ve,vp,vp>=100?'simulated checks complete':'checking '+c)}else clearInterval(bt)},250)}
function renderSt(){const count=S.runs.length,forks=S.runs.reduce((total,run)=>total+run.rows.filter(row=>row.br).length,0);
const per=[0,1,2].map(model=>{let selected=0,dissents=0,tokens=0;S.runs.forEach(run=>{run.rows.forEach(row=>{if(row.br&&row.canon>=0&&(row.br[row.canon].m||[]).includes(model))selected++;(row.dis||[]).forEach(item=>{if(item[0]===model)dissents++})});tokens+=(run.tally&&run.tally[model]&&run.tally[model].tok)||0});return{selected,dissents,tokens}});
$('#sg').innerHTML=`<div class="cards">${[[count,'runs'],[forks,'Verse branches'],[S.stats.hops,'Verse changes'],[S.mem.length,'memory candidates']].map(([value,label])=>`<div class="kc"><b>${value}</b><span>${label}</span></div>`).join('')}</div><table class="t"><tr><th>Configured role</th><th>Selected contributions</th><th>Dissents</th><th>Tokens</th></tr>${per.map((item,index)=>`<tr><td>${avx(index)} ${MD[index].n}</td><td>${item.selected}</td><td>${item.dissents}</td><td>${item.tokens}</td></tr>`).join('')}</table>`+
(count?'<h3 style="font-weight:600;font-size:15px;margin:24px 0 7px">Recent runs</h3><table class="t">'+S.runs.map((run,index)=>[run,index]).reverse().slice(0,8).map(([run,index])=>`<tr><td>${esc(run.task.slice(0,48))}</td><td>${new Date(run.ts).toLocaleDateString()}</td><td>${run.rows.length} recorded decisions</td><td><button class="pill" data-cmp="${index}">Compare</button></td></tr>`).join('')+'</table>':'<p class="lede2" style="margin-top:14px">No prototype runs yet.</p>')+'<p class="sub" style="margin-top:14px">Local scripted runs are interaction examples, not capability evaluations. Connected providers may report measured token use; otherwise totals are estimates.</p>';
if(CORE){const coreRuns=CORE.runs.slice().reverse().slice(0,12);$('#sg').insertAdjacentHTML('beforeend',`<section class="core-panel"><div class="core-panel-head"><div><span class="core-kicker">Evaluation Core</span><h3>Measured runs</h3></div><button class="mini" type="button" data-core-refresh>Refresh</button></div>${coreRuns.length?`<table class="t"><tr><th>Task</th><th>Arm</th><th>Result</th><th>Attempts</th><th>Time</th></tr>${coreRuns.map(run=>`<tr><td>${esc(run.task_id)}</td><td>${esc(run.arm)}</td><td><span class="memory-status">${run.verified?'verified':esc(run.status||'not verified')}</span></td><td>${run.attempts}/${run.budget}</td><td>${Math.max(0,run.duration_ms||0)} ms</td></tr>`).join('')}</table>`:'<p class="lede2">No measured Core runs yet.</p>'}</section>`);$('[data-core-refresh]').onclick=coreRefresh}
document.querySelectorAll('[data-cmp]').forEach(button=>button.onclick=()=>{cmpRun=+button.dataset.cmp;show('ver')})}
function renderSet(){const autonomy=S.set.autonomy;
$('#se').innerHTML=`<div class="set"><h3>Decision handling</h3><p>Choose what happens when the scripted roles disagree. This changes the prototype flow, not the system's verified capability.</p><div class="seg" id="sgA">${[['ask','Ask me'],['timed','Ask, then use default'],['auto','Use scripted default']].map(([key,label])=>`<button data-a="${key}" class="${autonomy===key?'on':''}">${label}</button>`).join('')}</div></div>
<div class="set"><h3>Runner</h3><p>${(SMP||BE)?'A runner is connected. Review its provider, permissions, and execution boundary before use.':'No runner is connected. Scripted mode demonstrates interface behavior only.'}</p><div class="seg" id="sgL">${[[false,'Scripted prototype'],[true,'Connected runner']].map(([key,label])=>`<button data-l="${key}" class="${S.set.live===key?'on':''}"${key&&!(SMP||BE)?' disabled':''}>${label}</button>`).join('')}</div></div>
<div class="set"><h3>Configured roles</h3><table class="t"><tr><th>Role</th><th>Purpose</th><th>Runner tier</th></tr>${[0,1,2].map(index=>`<tr><td>${avx(index)} ${MD[index].n}</td><td>${ROLE[index]}</td><td>${TIER[index]}</td></tr>`).join('')}</table><p style="margin-top:8px">Role labels organize the run. They are not evidence that one model is more capable than another.</p></div>
<div class="set"><h3>Shared activity</h3><p>${DB?'Optional shared runs are available. Memory still requires verification and an allowed scope before reuse.':'Shared activity needs an explicitly connected database or local server.'}</p><div class="seg" id="sgB">${[[false,'Keep runs private'],[true,'Share run activity']].map(([key,label])=>`<button data-b="${key}" class="${!!S.set.bcast===key?'on':''}"${ROOM?'':' disabled'}>${label}</button>`).join('')}</div></div>
<div class="set"><h3>Local service</h3><p>${BE?'Connected. Provider calls and sandbox jobs use the local service boundary.':'Not connected. Start the companion service only when you are ready to review its permissions and execution policy.'}</p>${BE?[0,1,2].map(index=>`<div class="row2" style="margin-bottom:6px"><span style="min-width:110px">${avx(index)} ${MD[index].n}</span><select data-p="${index}">${['page',...Object.keys(BE.providers).filter(key=>BE.providers[key])].map(key=>`<option ${((S.set.prov||[])[index]||'page')===key?'selected':''}>${key}</option>`).join('')}</select></div>`).join(''):''}</div>
${CORE?`<div class="set"><h3>Evaluation Core</h3><p>Connected to ${esc(CORE.health.agent)}. Jobs are bounded and asynchronous; memory promotion still requires review.</p><div class="row2"><button class="pill" type="button" data-core-job="learn">Find candidates</button><button class="pill" type="button" data-core-job="evaluate">Run held-out evaluation</button><button class="pill" type="button" data-core-refresh>Refresh</button></div><p class="sub" data-core-job-state>${CORE.jobs.length?`${esc(CORE.jobs[0].kind)} · ${esc(CORE.jobs[0].status)}`:'No Core jobs yet.'}</p></div>`:''}
<div class="set"><h3>Local data</h3><p>Runs and unverified memory candidates are stored in this browser. Clearing data cannot be undone.</p>${DL?'<button class="pill" id="sx">Export JSON</button> ':''}<button class="pill" id="sc">Clear local data</button></div>`;
$('#sgA').onclick=event=>{const key=event.target.dataset.a;if(key){S.set.autonomy=key;save();tagUp();renderSet()}};
$('#sgB').onclick=event=>{const button=event.target.closest('button');if(button&&!button.disabled){S.set.bcast=button.dataset.b==='true';save();renderSet()}};document.querySelectorAll('[data-p]').forEach(select=>select.onchange=()=>{S.set.prov=S.set.prov||[];S.set.prov[+select.dataset.p]=select.value;save()});
$('#sgL').onclick=event=>{const button=event.target.closest('button');if(button&&!button.disabled){S.set.live=button.dataset.l==='true';save();tagUp();renderSet()}};
if($('#sx'))$('#sx').onclick=()=>DL.save({filename:'multiverse.json',data:JSON.stringify(S,null,2)}).catch(()=>{});
document.querySelectorAll('[data-core-refresh]').forEach(button=>button.onclick=coreRefresh);document.querySelectorAll('[data-core-job]').forEach(button=>button.onclick=()=>coreQueue(button.dataset.coreJob));
let armed=false;$('#sc').onclick=event=>{if(!armed){armed=true;event.target.textContent='Confirm clear';setTimeout(()=>{armed=false;if(event.target.isConnected)event.target.textContent='Clear local data'},3000);return}S.mem=[];S.runs=[];S.stats={hops:0};save();badge();renderSet()}}
// ======== optional local server ========
async function beDetect(){if(!/^https?:$/.test(location.protocol))return;try{const r=await fetch('/api/health');if(r.ok&&(r.headers.get('content-type')||'').includes('json')){const j=await r.json();if(j&&j.ok){if(j.product==='multiverse-core'&&window.MultiverseCoreClient){CORE={health:j,runs:[],memory:[],jobs:[]};await coreRefresh(false)}else BE=j}}}catch(e){}}
async function coreRefresh(redraw=true){if(!CORE||!window.MultiverseCoreClient)return;try{const[runs,memory,jobs]=await Promise.all([MultiverseCoreClient.runs(),MultiverseCoreClient.memory(),MultiverseCoreClient.jobs()]);CORE.runs=runs;CORE.memory=memory;CORE.jobs=jobs;try{const latest=await MultiverseCoreClient.evalLatest();CORE.evalLatest=(latest&&latest.result&&latest.result.report)||null}catch(_){}badge();tagUp();if(redraw){if(page==='st')renderSt();if(page==='mem')renderMem();if(page==='set')renderSet();if(page==='sim')renderSim()}}catch(e){CORE.error=e.message}}
async function coreQueue(kind){if(!CORE)return;const state=$('[data-core-job-state]');if(state)state.textContent='Queueing…';try{if(kind==='learn')await MultiverseCoreClient.learn();else if(kind==='experiment')await MultiverseCoreClient.experiment();else await MultiverseCoreClient.evaluate(3);await coreRefresh();setTimeout(()=>coreRefresh(),1200)}catch(e){if(state)state.textContent=e.message}}
async function coreMemoryAction(id,action){try{await MultiverseCoreClient[action](id);await coreRefresh()}catch(e){alert(e.message)}}
function provOf(m){if(!BE)return null;let pv=(S.set.prov||[])[m];if(!pv||pv==='page'){if(SMP)return null;pv=Object.keys(BE.providers).find(k=>BE.providers[k]&&k!=='mock')||'mock'}return pv}
async function askModel(prompt,m,onText){const text=typeof prompt==='string'?prompt:prompt.map(x=>x.content).join('\n'),pv=provOf(m);
if(pv){const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({provider:pv,prompt:text,tier:TIER[m]})}),j=await r.json();if(!r.ok)throw new Error(j.error||'backend error');if(onText)onText({text:j.text});return{text:j.text,usage:j.usage}}
const r=await SMP(prompt,{modelTier:TIER[m],cache:false,onText});return{text:r.text}}
async function genJson(prompt,m){if(provOf(m)){const r=await askModel(prompt+'\nReturn only JSON, no prose.',m),mt=r.text.match(/\{[\s\S]*\}/);if(!mt)throw new Error('no JSON in the reply');return{j:JSON.parse(mt[0]),usage:r.usage}}return{j:await SMP.json(prompt,{modelTier:TIER[m],cache:false})}}
function beDb(){const J={'content-type':'application/json'};return{
doc:p=>{const[c,id]=p.split('/');return{set:async d=>{await fetch('/api/db/'+c+'/'+encodeURIComponent(id),{method:'PUT',headers:J,body:JSON.stringify(d)})}}},
collection:c=>{let ord=null,dir='asc',lim=1000;const q={orderBy(f,d){ord=f;dir=d||'asc';return q},limit(n){lim=n;return q},onSnapshot(cb){let on=true;const f=async()=>{if(!on)return;try{const l=await(await fetch('/api/db/'+c)).json();if(ord)l.sort((a,b)=>(a[ord]>b[ord]?1:-1)*(dir==='desc'?-1:1));cb({docs:l.slice(0,lim).map(x=>({id:x.id,data:()=>x}))})}catch(e){}if(on)setTimeout(f,3000)};f();return()=>{on=false}}};return q}}}
function beRoom(){const hs={};let es=null;const open=()=>{if(es||typeof EventSource==='undefined')return;es=new EventSource('/api/room');es.onmessage=e=>{try{const m=JSON.parse(e.data);(hs[m.topic]||[]).forEach(h=>h({topic:m.topic,data:m.data}))}catch(_){}}};
return{emit:async(topic,data)=>{await fetch('/api/room',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({topic,data})})},on:(topic,h)=>{open();(hs[topic]=hs[topic]||[]).push(h);return()=>{hs[topic]=hs[topic].filter(x=>x!==h)}},onPeers:h=>{let on=true;const f=async()=>{try{const j=await(await fetch('/api/peers')).json();h({peers:Array(j.n).fill({})})}catch(e){}if(on)setTimeout(f,4000)};f();return()=>{on=false}}}}
// ======== shared layer (db + room) ========
const SH={runs:[],votes:[],mem:[],live:[],bd:null,fin:''};let DB=null,UID=null,ROOM=null,PEERS=0;
const RUNS=()=>S.runs.concat(SH.runs.filter(r=>!S.runs.some(x=>String(x.id)===String(r.id))).map(r=>({...r,shared:true})));
const rr=()=>{if(page==='brd')renderBrd();if(page==='mem')renderMem()};
async function initShared(){try{if(window.claude){DB=(await window.claude.use('db'))||null;const u=await window.claude.use('user');UID=u?await u.id():null;ROOM=(await window.claude.use('room'))||null}}catch(e){}
if(!DB&&BE){DB=beDb();ROOM=beRoom();UID=localStorage.getItem('mv.uid');if(!UID){UID='u'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('mv.uid',UID)}catch(e){}}}
if(DB){const er=()=>{};
DB.collection('runs').orderBy('ts','desc').limit(40).onSnapshot(q=>{SH.runs=q.docs.map(d=>({...d.data(),id:d.id}));rr()},er);
DB.collection('votes').onSnapshot(q=>{SH.votes=q.docs.map(d=>({uid:d.id,v:(d.data()||{}).v||{}}));rr()},er);
DB.collection('memory').orderBy('ts','desc').limit(100).onSnapshot(q=>{SH.mem=q.docs.map(d=>({...d.data(),id:d.id,shared:true}));rr()},er)}
if(ROOM){ROOM.on('ev',m=>spec(m.data));if(ROOM.onPeers)ROOM.onPeers(c=>{PEERS=(c.peers||[]).length;rr()})}}
function emitEv(o){if(ROOM&&S.set.bcast)Promise.resolve(ROOM.emit('ev',o)).catch(()=>{})}
function spec(d){if(!d)return;if(d.t==='start'){SH.live=[{h:'Live run: '+d.task}];SH.bd=null;SH.fin=''}else if(d.t==='msg'){SH.live.push({m:d.m,to:d.to,k:d.k,txt:(d.txt||'')+(d.post?' '+d.post:'')});SH.live=SH.live.slice(-60)}else if(d.t==='bd')SH.bd=d.rows;else if(d.t==='final')SH.fin=d.txt;if(page==='brd')renderBrd()}
async function shareRun(r){if(!DB)return;try{await DB.doc('runs/'+r.id).set({task:r.task,key:r.key,ts:r.ts,rows:r.rows,final:r.final,tally:r.tally,by:UID||'anon'})}catch(e){alert('Could not share: '+((e&&e.code)||'error'))}}
async function shareMem(m){if(!DB||m.status!=='verified')return;try{await DB.doc('memory/'+String(m.id).replace(/[^A-Za-z0-9_-]/g,'_')).set({text:m.text,task:m.task,verse:m.verse,m:m.m,trust:m.trust,ts:m.ts,kind:m.kind,by:UID||'anon'})}catch(e){alert('Could not share: '+((e&&e.code)||'error'))}}
let vq=Promise.resolve();
function vote(rid,row,bi){if(!DB||!UID)return;vq=vq.then(async()=>{const mine=(SH.votes.find(v=>v.uid===UID)||{v:{}}).v,nv={...mine};nv[rid+'|'+row]=bi;try{await DB.doc('votes/'+UID).set({v:nv})}catch(e){alert('Could not save your vote: '+((e&&e.code)||'error'))}})}
function pool(){const list=$('#ml');if(!DB||!list)return;const memories=SH.mem.filter(memory=>memory.status==='verified');const heading=document.createElement('h3');heading.style.cssText='font-weight:600;font-size:15px;margin:24px 0 8px';heading.textContent='Verified shared memory ('+memories.length+')';list.appendChild(heading);
if(!memories.length){const empty=div('lede2');empty.textContent='No verified shared memory is available.';list.appendChild(empty)}
memories.forEach(memory=>{const card=div('mcard');card.innerHTML=`<p></p><div class="prov"><span class="memory-status">verified</span><span>${memory.m!=null?avx(memory.m)+MD[memory.m].n:'reviewer'}</span><span>${esc(memory.verse||'')}</span><span>${esc((memory.task||'').slice(0,40))}</span></div>`;card.querySelector('p').textContent=memory.text;list.appendChild(card)})}
function renderMem(){renderMem0();pool();if(!CORE)return;const list=$('#ml'),query=($('#mq').value||'').toLowerCase(),memories=CORE.memory.filter(memory=>!query||memory.text.toLowerCase().includes(query)||(memory.source_task||'').toLowerCase().includes(query));const heading=document.createElement('h3');heading.className='core-section-title';heading.textContent='Core memory ('+memories.length+')';list.appendChild(heading);if(!memories.length){const empty=div('lede2');empty.textContent='No matching Core memory.';list.appendChild(empty)}memories.forEach(memory=>{const card=div('mcard core-memory'),actions=memory.status==='verified'?['approve','reject']:memory.status==='candidate'?['reject']:memory.status==='promoted'?['demote']:[];card.innerHTML=`<p></p><div class="prov"><span class="memory-status">${esc(memory.status)}</span><span>${esc(memory.source_task)}</span><span>${esc(memory.scope)}</span>${actions.length?`<span class="tr">${actions.map(action=>`<button class="mini" type="button" data-core-memory="${action}">${action}</button>`).join('')}</span>`:''}</div>`;card.querySelector('p').textContent=memory.text;card.querySelectorAll('[data-core-memory]').forEach(button=>button.onclick=()=>coreMemoryAction(memory.id,button.dataset.coreMemory));list.appendChild(card)})}
function lboard(){const byRun={},byModel=[0,0,0];SH.votes.forEach(({v})=>Object.entries(v).forEach(([k,bi])=>{const[rid,row]=k.split('|'),run=SH.runs.find(r=>r.id===rid);if(!run)return;byRun[rid]=(byRun[rid]||0)+1;const r=(run.rows||[]).find(x=>x.id===row);((r&&r.br&&r.br[bi]&&r.br[bi].m)||[]).forEach(m=>byModel[m]++)}));return{byRun,byModel}}
function renderBrd(){const el=$('#brd'),n=$('#brdn');
if(!DB){n.textContent='Shared features need the db capability or the local server. Neither is available in this view.';el.innerHTML='';return}
n.textContent='Shared with everyone who opens this page.'+(PEERS?' '+PEERS+' here now.':'');
const{byRun,byModel}=lboard(),mine=(SH.votes.find(v=>v.uid===UID)||{v:{}}).v;let h='';
const priv=S.runs.filter(r=>!SH.runs.some(x=>String(x.id)===String(r.id)));
h+='<h3 style="font-weight:500;font-size:15px;margin:6px 0 8px">Live</h3>';
h+=SH.live.length?'<div class="lv">'+SH.live.map(x=>x.h?`<div><b style="font-weight:500">${esc(x.h)}</b></div>`:`<div>${MD[x.m]?avx(x.m)+' ':''}<b style="font-weight:500">${MD[x.m]?MD[x.m].n:''}</b>${x.to!=null?' → '+(x.to==='you'?'you':MD[x.to]?MD[x.to].n:''):''} · ${esc(x.k)}: ${esc(x.txt)}</div>`).join('')+(SH.fin?`<div><b style="font-weight:500">Result:</b> ${esc(SH.fin)}</div>`:'')+'</div>':'<p class="lede2">Nobody is broadcasting. Turn on broadcasting in Settings and run the arena to let others watch.</p>';
if(priv.length)h+='<h3 style="font-weight:500;font-size:15px;margin:22px 0 8px">Your runs</h3>'+priv.map(r=>`<div class="mcard"><b style="font-weight:500">${esc(r.task.slice(0,70))}</b> <button class="pill" data-share="${r.id}" style="margin-left:10px">Share</button></div>`).join('');
h+='<h3 style="font-weight:500;font-size:15px;margin:22px 0 8px">Shared runs</h3>';
h+=SH.runs.length?SH.runs.map(r=>`<div class="mcard"><b style="font-weight:500">${esc((r.task||'').slice(0,70))}</b> <span class="sub2">· ${byRun[r.id]||0} votes · ${new Date(r.ts).toLocaleDateString()}</span>`+(r.rows||[]).filter(x=>x.br).map(x=>`<div style="margin-top:8px"><span class="sub2">${esc(x.t)}</span><br>`+x.br.map((b,i)=>{const c=SH.votes.filter(v=>v.v[r.id+'|'+x.id]===i).length;return`<button class="vote ${mine[r.id+'|'+x.id]===i?'me':''}" data-vote="${r.id}|${x.id}|${i}">${esc(b.l)} · ${c}${x.canon===i?' ✓':''}</button>`}).join('')+'</div>').join('')+'</div>').join(''):'<p class="lede2">Nothing shared yet.</p>';
h+='<h3 style="font-weight:500;font-size:15px;margin:22px 0 8px">Leaderboard</h3><table class="t"><tr><th>Model</th><th>Votes for its verses</th></tr>'+[0,1,2].map(i=>`<tr><td>${avx(i)} ${MD[i].n}</td><td>${byModel[i]}</td></tr>`).join('')+'</table>';
const top=Object.entries(byRun).sort((a,b)=>b[1]-a[1]).slice(0,5);if(top.length)h+='<table class="t" style="margin-top:12px"><tr><th>Run</th><th>Votes</th></tr>'+top.map(([id,n])=>`<tr><td>${esc(((SH.runs.find(r=>r.id===id)||{}).task||'').slice(0,60))}</td><td>${n}</td></tr>`).join('')+'</table>';
el.innerHTML=h;
el.querySelectorAll('[data-share]').forEach(b=>b.onclick=()=>shareRun(S.runs.find(r=>String(r.id)===b.dataset.share)));
el.querySelectorAll('[data-vote]').forEach(b=>b.onclick=()=>{const[a,r,i]=b.dataset.vote.split('|');vote(a,r,+i)})}
// ======== code execution (sandboxed iframe, or the local server) ========
const PRE=`const __R=[];function test(n,f){__R.push([n,f])}const assert={ok(v,m){if(!v)throw new Error(m||'expected a truthy value')},equal(a,b,m){if(a!==b)throw new Error(m||('expected '+JSON.stringify(b)+' but got '+JSON.stringify(a)))},deepEqual(a,b,m){if(JSON.stringify(a)!==JSON.stringify(b))throw new Error(m||('expected '+JSON.stringify(b)+' but got '+JSON.stringify(a)))},throws(f,m){let t=false;try{f()}catch(e){t=true}if(!t)throw new Error(m||'expected an error')}};async function __run(){const o=[];for(const[n,f]of __R){try{await f();o.push({n,ok:true})}catch(e){o.push({n,ok:false,e:String(e&&e.message||e)})}}return o}`;
function sbx(impl,tests){return new Promise(res=>{const id='x'+Math.random().toString(36).slice(2),f=document.createElement('iframe');f.setAttribute('sandbox','allow-scripts');f.style.display='none';
const sc=t=>'<script>'+t.replace(/<\/script/gi,'<\\/script')+'<\/script>';
f.srcdoc='<!doctype html><html><body>'+sc('window.onerror=function(m){(window.__E=window.__E||[]).push(String(m))};'+PRE)+sc(impl)+sc(tests)+sc('__run().then(function(r){parent.postMessage({mv:"'+id+'",r:r,e:window.__E||[]},"*")})')+'</body></html>';
const done=v=>{clearTimeout(tm);removeEventListener('message',h);f.remove();res(v)};
const h=e=>{if(e.data&&e.data.mv===id)done({ok:true,r:e.data.r,e:e.data.e})};addEventListener('message',h);
const tm=setTimeout(()=>done({ok:false,error:'No result in 5 seconds. The code looped forever, or this view blocks sandboxed frames.'}),5000);document.body.appendChild(f)})}
async function nodeRun(impl,tests){const script=PRE+'\n'+impl+'\n'+tests+'\n__run().then(r=>console.log("__RESULT__"+JSON.stringify({r,e:[]})))';
const r=await fetch('/api/exec',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({script})}),j=await r.json(),m=(j.stdout||'').match(/__RESULT__(.*)/);
if(!m)return{ok:false,error:(j.timedOut?'Timed out. ':'')+(j.stderr||'no output').slice(0,300)};const o=JSON.parse(m[1]);return{ok:true,r:o.r,e:o.e}}
const execCode=(i,t)=>BE&&BE.exec?nodeRun(i,t):sbx(i,t);
async function buildReal(){clearInterval(bt);const L=$('#bl');L.innerHTML='';
const lane=(label,c)=>{const e=div('lane');e.innerHTML=`<span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c};margin-right:6px"></i>${label}</span><div class="b2"><u></u></div><span style="color:var(--mut)">queued</span>`;L.appendChild(e);return e};
const st=(e,p,t)=>{e.querySelector('u').style.width=p+'%';e.lastChild.textContent=t};
const bs=BUILD.lines.slice(0,5).map(([t,v],i)=>({t,v,m:i%3,e:lane('builder '+(i+1)+' · '+MD[i%3].n,MD[i%3].c)}));const ve=lane('verifier','#c9ced6');
const gen=async(b,extra)=>{const{j,usage}=await genJson(`Implement this requirement as plain JavaScript that runs in a browser, then test it.\nProduct spec:\n${specMd()}\nYour part: "${b.t}: ${b.v}".\nRules: no imports, no exports, no DOM, no network. Define top-level functions only. Write 3 tests using test("name",()=>{...}) with assert.equal(a,b), assert.deepEqual(a,b), assert.ok(v) and assert.throws(fn). The tests must call your functions directly.${extra||''}\nReturn only JSON: {"file":"name.js","code":"...","tests":"..."}`,b.m);tally(b.m,JSON.stringify(j),0,usage);return j};
await Promise.all(bs.map(async b=>{try{st(b.e,10,'asking '+MD[b.m].n+' for code');let j=await gen(b);b.j=j;
for(let a=0;a<2;a++){st(b.e,45+a*20,'running tests'+(a?' (retry)':''));const r=await execCode(j.code||'',j.tests||'');b.r=r;const bad=r.ok?r.r.filter(x=>!x.ok):[];if(r.ok&&!bad.length&&!r.e.length)break;if(a===1)break;
st(b.e,60,'fixing: '+String(r.ok?(bad[0]&&bad[0].e)||r.e[0]:r.error).slice(0,60));j=await gen(b,`\nYour previous attempt failed with: ${r.ok?JSON.stringify(bad.concat(r.e)):r.error}. Previous code:\n${j.code}\nFix it.`);b.j=j}
const r=b.r,p=r&&r.ok?r.r.filter(x=>x.ok).length:0,n=r&&r.ok?r.r.length:0;st(b.e,100,r&&r.ok&&p===n&&!r.e.length?`passed ${p}/${n} · ${b.j.file||'module.js'}`:r&&!r.ok?'could not run: '+String(r.error).slice(0,70):`failed ${n-p}/${n}`)}
catch(e){st(b.e,100,'error: '+String((e&&(e.message||e.code))||'unknown').slice(0,70))}}));
st(ve,10,'a different model writes extra tests');let tot=0,ok2=0;
await Promise.all(bs.filter(b=>b.j).map(async b=>{try{const{j}=await genJson(`Write 3 extra edge-case tests for this code. Use test("name",()=>{...}) with assert.equal, assert.deepEqual, assert.ok or assert.throws. Do not redefine the functions.\nRequirement: ${b.t}: ${b.v}\nCode:\n${b.j.code}\nReturn only JSON: {"tests":"..."}`,(b.m+1)%3);const r=await execCode(b.j.code||'',j.tests||'');if(r.ok){tot+=r.r.length;ok2+=r.r.filter(x=>x.ok).length}}catch(e){}}));
st(ve,100,`${ok2}/${tot} independent checks passed`);
const done=bs.filter(b=>b.j),d=div('mcard');d.innerHTML='<b style="font-weight:500">Generated files</b>'+done.map(b=>`<details style="margin-top:8px"><summary>${esc(b.j.file||'module.js')} <span style="color:var(--mut)">· ${esc(b.t)}</span></summary><pre style="white-space:pre-wrap;font:12px/1.5 ui-monospace,Menlo,monospace;margin:6px 0 0"></pre></details>`).join('');
[...d.querySelectorAll('pre')].forEach((p,i)=>{p.textContent=(done[i].j.code||'')+'\n\n// tests\n'+(done[i].j.tests||'')});L.appendChild(d);
if(DL&&done.length){const x=document.createElement('button');x.className='pill';x.style.marginTop='10px';x.textContent='Download files (JSON)';x.onclick=()=>DL.save({filename:'build.json',data:JSON.stringify(done.map(b=>({file:b.j.file,code:b.j.code,tests:b.j.tests})),null,2)}).catch(()=>{});L.appendChild(x)}}
// ======== sim: hover controllers ========
const SIMP={g:9.81,I:.03,T:12,dt:.004,zt:10},clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
const CT0=[{n:'PD',kp:9,ki:0,kd:6,ap:5,ad:2.5,lp:1.2,ld:1.6},{n:'PID',kp:9,ki:4,kd:6,ap:5,ad:2.5,lp:1.2,ld:1.6},{n:'P',kp:9,ki:0,kd:0,ap:5,ad:0,lp:1.2,ld:1.6}];
let CT=CT0.map(c=>({...c})),SIMR=null,simT0=0,simGust=4,simBusy='';
function simRun(c,P){const{g,I,dt}=SIMP,N=Math.round(SIMP.T/dt),m0=1.5;let m=1.8,x=0,z=SIMP.zt,th=0,vx=0,vz=0,w=0,iz=0,iae=0,md=0,en=0,last=0,crashed=false;const tr=[];
for(let k=0;k<N;k++){const t=k*dt;if(t>=6)m=1.5;const ez=SIMP.zt-z;iz=clampN(iz+ez*dt,-8,8);
const az=c.kp*ez+c.ki*iz-c.kd*vz,u1=clampN(m0*(g+az)/Math.max(.5,Math.cos(th)),0,40);
const axc=c.lp*(0-x)-c.ld*vx,thc=clampN(-axc/g,-.5,.5),u2=clampN(I*(c.ap*(thc-th)-c.ad*w),-3,3),fw=t>=3&&t<4.5?P.gust:0;
vx+=(-(u1/m)*Math.sin(th)+fw/m)*dt;vz+=((u1/m)*Math.cos(th)-g)*dt;w+=u2/I*dt;x+=vx*dt;z+=vz*dt;th+=w*dt;
if(z<.2||Math.abs(th)>1.4||!isFinite(z+x+th)){crashed=true;break}
iae+=(Math.abs(ez)+Math.abs(x))*dt;md=Math.max(md,Math.abs(ez));en+=u1*u1*dt;if(Math.abs(ez)>.25||Math.abs(x)>.6)last=t;
if(k%10===0)tr.push([t,x,z,th,fw!==0,m>1.5])}
return{tr,met:{iae:+iae.toFixed(2),md:+md.toFixed(2),settle:+last.toFixed(1),en:Math.round(en/1000),score:crashed?0:Math.max(0,Math.round(100-iae*1.6-md*9-last*2)),crashed}}}
function simGo(){SIMR=CT.map(c=>simRun(c,{gust:simGust}));simT0=performance.now();simTable()}
const f1=n=>(+n).toFixed(1),gtxt=c=>`kp ${f1(c.kp)} ki ${f1(c.ki)} kd ${f1(c.kd)} · ap ${f1(c.ap)} ad ${f1(c.ad)} · lp ${f1(c.lp)} ld ${f1(c.ld)}`;
function simTable(prev){if(!SIMR)return;$('#simt').innerHTML='<table class="t"><tr><th>Model</th><th>Controller</th><th>Gains</th><th>Score</th><th>Error</th><th>Max dip</th><th>Settled</th><th>Effort</th></tr>'+SIMR.map((r,i)=>`<tr><td>${avx(i)} ${MD[i].n}</td><td>${CT[i].n}</td><td class="sub2">${gtxt(CT[i])}</td><td><b style="font-weight:500">${r.met.crashed?'crashed':r.met.score}</b>${prev&&prev[i]!=null?` <span class="sub2">from ${prev[i]}</span>`:''}</td><td>${r.met.iae}</td><td>${r.met.md} m</td><td>${r.met.settle>=SIMP.T?'never':r.met.settle+' s'}</td><td>${r.met.en}</td></tr>`).join('')+'</table>'}
async function simTune(){if(!(SMP||BE)||simBusy)return;simBusy='tuning';renderSim();const prev=SIMR.map(r=>r.met.crashed?0:r.met.score);
const R={kp:[1,30],ki:[0,12],kd:[0,15],ap:[1,20],ad:[0,8],lp:[.2,6],ld:[.2,6]};
await Promise.all(CT.map(async(c,i)=>{try{const{j}=await genJson(`You tune a hover controller for a planar VTOL drone. Task: hold 10 m altitude while a ${simGust} N sideways gust hits at 3 s and a 0.3 kg payload drops at 6 s. Controller type: ${c.n}. Current gains: ${JSON.stringify({kp:c.kp,ki:c.ki,kd:c.kd,ap:c.ap,ad:c.ad,lp:c.lp,ld:c.ld})}. Last result: score ${SIMR[i].met.crashed?0:SIMR[i].met.score}, error ${SIMR[i].met.iae}, max dip ${SIMR[i].met.md} m, settled at ${SIMR[i].met.settle} s. Allowed ranges: ${JSON.stringify(R)}. kp,kd tune altitude, ap,ad tune pitch, lp,ld tune sideways position, ki removes steady offset. Return only JSON with the keys kp, ki, kd, ap, ad, lp, ld.`,i);
for(const k in R)if(typeof j[k]==='number')c[k]=clampN(j[k],R[k][0],R[k][1]);if(c.n==='P'){c.ki=0;c.kd=0;c.ad=0}if(c.n==='PD')c.ki=0}catch(e){}}));
simBusy='';SIMR=CT.map(c=>simRun(c,{gust:simGust}));simT0=performance.now();renderSim();simTable(prev)}
function simSave(){if(!SIMR)return;const best=SIMR.map((r,i)=>[r.met.crashed?0:r.met.score,i]).sort((a,b)=>b[0]-a[0])[0][1],ts=Date.now(),task=`Hover controllers under a ${simGust} N gust`;
const rows=CT.map((c,i)=>({id:'c'+i,t:`Controller · ${MD[i].n}`,v:`${c.n} · score ${SIMR[i].met.crashed?0:SIMR[i].met.score}`,s:'agreed',dis:null,canon:-1,br:null,n:i+1}));
S.runs.push({id:ts,task,key:'sim',ts,rows,final:`Best controller: ${MD[best].n} (${CT[best].n}), ${gtxt(CT[best])}.`,tally:[{tok:0,ms:0},{tok:0,ms:0},{tok:0,ms:0}]});
CT.forEach((c,i)=>S.mem.push({id:ts+i+Math.random(),text:`${c.n} controller scored ${SIMR[i].met.crashed?0:SIMR[i].met.score} under a ${simGust} N gust: ${gtxt(c)}`,task,verse:'evaluation',m:i,trust:.7,ts,kind:'evaluation',status:'candidate',scope:'task'}));
S.runs=S.runs.slice(-30);S.mem=S.mem.slice(-200);save();badge();$('#simsv').textContent='Saved as a run with evaluation memory candidates'}
function renderSim(){const cv=$('#simcv');if(CORE){if(cv)cv.style.display='none';const c=$('#simc');const jobState=CORE.jobs.length?`${CORE.jobs[0].kind} · ${CORE.jobs[0].status}`:'Idle';c.innerHTML=`<div class="row2" style="align-items:center;gap:10px;margin-bottom:14px"><button class="pill on" type="button" data-eval-run="evaluate">Run held-out evaluation</button><button class="pill" type="button" data-eval-run="experiment">Run full experiment</button><button class="pill" type="button" data-eval-run="learn">Find memory candidates</button><button class="mini" type="button" data-core-refresh>Refresh</button><span class="sub2" data-core-job-state style="margin-left:auto">${esc(jobState)}</span></div>`;c.querySelectorAll('[data-eval-run]').forEach(b=>b.onclick=()=>coreQueue(b.dataset.evalRun));c.querySelectorAll('[data-core-refresh]').forEach(b=>b.onclick=coreRefresh);const rp=CORE.evalLatest;const t=$('#simt');if(!rp){t.innerHTML=`<div class="mcard" style="margin-top:12px"><p><strong>No held-out evaluation has been recorded yet.</strong></p><p class="lede2" style="margin-top:6px">Multiverse Core evaluates whether selectively retrieved Memory DNA improves task completion on 8 held-out bug-fix fixtures compared to an equal-budget stateless baseline.</p><p class="sub" style="margin-top:8px">Click <strong>Run held-out evaluation</strong> above to queue the paired evaluation worker.</p></div>`;return}const fmtCost=v=>v==null?'n/a':`$${Number(v).toFixed(5)}`;let html=`<div class="cards" style="margin-bottom:16px"><div class="kc"><b>${rp.baseline.passed}/${rp.n_eval}</b><span>Baseline verified</span></div><div class="kc"><b>${rp.treatment.passed}/${rp.n_eval}</b><span>Treatment verified</span></div><div class="kc"><b>${fmtCost(rp.baseline.cost_per_verified)}</b><span>Baseline cost / success</span></div><div class="kc"><b>${fmtCost(rp.treatment.cost_per_verified)}</b><span>Treatment cost / success</span></div></div>`;html+=`<div class="mcard" style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><span><strong>Paired breakdown:</strong> both passed <b>${rp.paired.both}</b> · only treatment passed <b>${rp.paired.only_treatment}</b> · only baseline passed <b>${rp.paired.only_baseline}</b></span><span class="mono-meta">Exact sign test p = ${(rp.sign_test_p||1).toFixed(3)}</span></div></div>`;if(rp.notes&&rp.notes.length){html+=rp.notes.map(n=>`<div class="note" style="margin-bottom:10px">${esc(n)}</div>`).join('')}if(rp.regressions&&rp.regressions.length){html+=`<div class="mcard" style="border-color:var(--danger);margin-bottom:14px"><strong style="color:var(--danger)">Negative Transfer Regressions (${rp.regressions.length})</strong><p class="sub2" style="margin:4px 0 8px">Tasks where the stateless baseline succeeded but memory treatment failed:</p><table class="t"><tr><th>Task</th><th>Family</th><th>Retrieved operations</th></tr>${rp.regressions.map(r=>`<tr><td><code>${esc(r.task)}</code></td><td>${esc(r.family)}</td><td>${esc((r.ops||[]).join(', '))}</td></tr>`).join('')}</table></div>`}if(rp.per_task&&rp.per_task.length){html+=`<h3 style="font-weight:600;font-size:15px;margin:20px 0 8px">Per-task paired comparisons</h3><table class="t"><tr><th>Task</th><th>Family</th><th>Baseline</th><th>Treatment</th><th>Order</th></tr>${rp.per_task.map(row=>`<tr><td><code>${esc(row.task)}</code></td><td>${esc(row.family)}</td><td><span class="memory-status ${row.baseline?'pass':'fail'}">${row.baseline?'verified':'failed'} (${row.baseline_attempts})</span></td><td><span class="memory-status ${row.treatment?'pass':'fail'}">${row.treatment?'verified':'failed'} (${row.treatment_attempts})</span></td><td class="sub2">${esc((row.arm_order||[]).join(' → '))}</td></tr>`).join('')}</table>`}t.innerHTML=html}else{if(cv)cv.style.display='block';const can=SMP||BE;$('#simc').innerHTML=`<label class="sub2" style="display:flex;gap:8px;align-items:center">Gust <input type="range" id="simg" min="0" max="8" step="1" value="${simGust}" style="width:140px"> <b style="font-weight:500;color:var(--fg)">${simGust} N</b></label><button class="pill on" id="simr">Run</button><button class="pill" id="simu"${can&&SIMR&&!simBusy?'':' disabled'}${can?'':' title="Needs the Claude capability or the local server"'}>${simBusy?'Models are tuning…':'Ask the models to tune'}</button><button class="pill" id="simz">Reset gains</button><button class="pill" id="simv"${SIMR?'':' disabled'}>Save as a run</button><span class="sub2" id="simsv"></span>`;$('#simg').oninput=e=>{simGust=+e.target.value};$('#simg').onchange=()=>{simGo();renderSim()};$('#simr').onclick=simGo;$('#simu').onclick=simTune;$('#simz').onclick=()=>{CT=CT0.map(c=>({...c}));simGo();renderSim()};$('#simv').onclick=simSave;if(!SIMR)simGo();else simTable()}}
function simDraw(now){const cv=$('#simcv');if(!cv||page!=='sim'||!SIMR)return;const x=cv.getContext&&cv.getContext('2d');if(!x)return;const W=cv.width,H=cv.height,lh=H/3,t=((now-simT0)/1000)%(SIMP.T+1.5),k=Math.min(SIMR[0].tr.length-1,Math.floor(t/(10*SIMP.dt)));
x.clearRect(0,0,W,H);
SIMR.forEach((r,i)=>{const y0=i*lh,gy=y0+lh-14,sc=(lh-34)/14,cx=W*.55,tk=Math.min(k,r.tr.length-1),p=r.tr[tk]||r.tr[r.tr.length-1];
x.strokeStyle='#e3e3e6';x.lineWidth=1;x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke();x.setLineDash([5,5]);x.strokeStyle='#c9ced6';x.beginPath();x.moveTo(0,gy-SIMP.zt*sc);x.lineTo(W,gy-SIMP.zt*sc);x.stroke();x.setLineDash([]);
x.fillStyle='#6f7480';x.font='12px IBM Plex Sans,system-ui,sans-serif';x.fillText(`${MD[i].n} · ${CT[i].n}`,12,y0+20);x.fillText('target 10 m',W-86,gy-SIMP.zt*sc-6);
x.strokeStyle=MD[i].c;x.lineWidth=2;x.beginPath();for(let j=Math.max(0,tk-120);j<=tk&&j<r.tr.length;j++){const q=r.tr[j],px=cx+q[1]*60,py=gy-q[2]*sc;j===Math.max(0,tk-120)?x.moveTo(px,py):x.lineTo(px,py)}x.stroke();
if(!p)return;const px=cx+p[1]*60,py=gy-p[2]*sc,crashedNow=r.met.crashed&&tk>=r.tr.length-1;
x.save();x.translate(px,py);x.rotate(-p[3]);x.fillStyle=crashedNow?'#dc2626':'#0c0c0c';x.fillRect(-26,-4,52,8);x.fillStyle=MD[i].c;x.fillRect(-26,-9,14,5);x.fillRect(12,-9,14,5);if(!p[5]){x.fillStyle='#8a8f9b';x.fillRect(-6,4,12,10)}x.restore();
if(p[4]){x.strokeStyle='#f5a35c';x.lineWidth=2;x.beginPath();x.moveTo(px-70,py);x.lineTo(px-36,py);x.lineTo(px-44,py-5);x.moveTo(px-36,py);x.lineTo(px-44,py+5);x.stroke()}
if(crashedNow){x.fillStyle='#dc2626';x.fillText('crashed',px+34,py)}});}
(function loop(t){simDraw(t);requestAnimationFrame(loop)})(0);

(async()=>{await beDetect();await initShared();tagUp();if(page==='set')renderSet();if(page==='bld')renderBld();rr()})();
tagUp();ctUp();show('arena');

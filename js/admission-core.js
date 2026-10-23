/* ============================================================
   admission-core.js — ЕДИНОЕ ЯДРО ДВУХ ПОРТАЛОВ
   Кабинет абитуриента (cabinet.html) и панель приёмной комиссии
   (commission.html) работают с одной базой:
     • анкеты и статусы  -> Supabase (Postgres) + локальная копия (localStorage)
     • файлы документов  -> Supabase Storage + локальный кэш (IndexedDB)
     • мгновенное обновление -> Supabase Realtime / BroadcastChannel
   Без ключей в js/config.js всё работает локально в браузере.
   Требует: js/config.js, js/admission-data.js
   ============================================================ */

const ALLOWED = ['application/pdf','image/jpeg','image/png','image/webp',
  'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip','application/x-zip-compressed'];
const MAX_FILE = 15*1024*1024;               /* 15 МБ на файл */
function fsize(n){ return n<1024?n+' B':(n<1048576?(n/1024).toFixed(0)+' KB':(n/1048576).toFixed(1)+' MB') }

/* ================= ОБЛАЧНАЯ БАЗА (Supabase) =================
   Чтобы комиссия видела заявки со ВСЕХ устройств, кабинет абитуриента
   и панель комиссии подключаются к одному проекту Supabase.

   ⚙️ НАСТРОЙКА: адрес проекта и publishable-ключ — в файле js/config.js.
   Схема базы (таблицы, функция, права, хранилище файлов) — supabase/schema.sql.
   Пока ключи пустые — сайт работает в локальном режиме (данные только в этом браузере). */
const SB_ON = typeof SUPABASE_URL==='string' && !!SUPABASE_URL &&
              typeof SUPABASE_KEY==='string' && !!SUPABASE_KEY;
const SB_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
const SB_BUCKET = 'documents';

const CLOUD = (function(){
  let sb=null, state=SB_ON?'connecting':'off', listeners=[];
  let readyRes; const ready=new Promise(r=>readyRes=r);
  function setState(s){ state=s; listeners.forEach(f=>{ try{f(s)}catch(e){} }) }
  function load(src){ return new Promise((res,rej)=>{
    const sc=document.createElement('script'); sc.src=src; sc.onload=res; sc.onerror=()=>rej(new Error('load '+src));
    document.head.appendChild(sc);
  })}
  async function init(){
    if(!SB_ON){ readyRes(false); return }
    try{
      if(!(window.supabase&&window.supabase.createClient)) await load(SB_LIB);
      sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
      readyRes(true);
    }catch(e){ console.error('Supabase:',e); setState('error'); readyRes(false) }
  }
  init();
  return {
    ready(){ return ready },
    state(){ return state },
    setState,
    onState(f){ listeners.push(f) },
    sb(){ return sb }
  };
})();
/* Ответ supabase-js: {data,error} → data или исключение */
function sbData(r){ if(r&&r.error) throw r.error; return r?r.data:null }

/* ================= ХРАНИЛИЩЕ ФАЙЛОВ =================
   Локально: IndexedDB (кэш). В облаке: Supabase Storage (бакет «documents»)
   + таблица files с именем, типом и размером файла. */
const FILES = (function(){
  const DB='agz_files', ST='blobs';
  let dbp=null, memory=new Map(), ok=true;
  function open(){
    if(dbp)return dbp;
    dbp=new Promise((res,rej)=>{
      let r;
      try{ r=indexedDB.open(DB,1) }catch(e){ ok=false; return rej(e) }
      r.onupgradeneeded=e=>{ const d=e.target.result; if(!d.objectStoreNames.contains(ST))d.createObjectStore(ST) };
      r.onsuccess=e=>res(e.target.result);
      r.onerror=()=>{ ok=false; rej(r.error) };
    }).catch(e=>{ ok=false; return null });
    return dbp;
  }
  async function tx(mode,fn){
    const d=await open();
    if(!d) return null;
    return new Promise((res,rej)=>{
      const t=d.transaction(ST,mode), s=t.objectStore(ST); let out;
      out=fn(s); t.oncomplete=()=>res(out&&out.result!==undefined?out.result:out); t.onerror=()=>rej(t.error);
    });
  }
  async function localPut(id,rec){
    try{ const r=await tx('readwrite',s=>s.put(rec,id)); if(r!==null)return true }catch(e){}
    memory.set(id,rec); ok=false; return true;
  }
  async function localGet(id){
    try{ const r=await tx('readonly',s=>s.get(id)); if(r&&r.blob)return r }catch(e){}
    return memory.get(id)||null;
  }
  async function cloudPut(id,rec){
    const sb=CLOUD.sb(); if(!sb) return false;
    sbData(await sb.storage.from(SB_BUCKET).upload(id,rec.blob,{contentType:rec.type||'application/octet-stream',upsert:true}));
    sbData(await sb.from('files').upsert({id,name:rec.name,type:rec.type||'',size:rec.size,dt:rec.dt}));
    return true;
  }
  async function cloudGet(id){
    const sb=CLOUD.sb(); if(!sb) return null;
    const meta=sbData(await sb.from('files').select('*').eq('id',id).maybeSingle()); if(!meta) return null;
    const blob=sbData(await sb.storage.from(SB_BUCKET).download(id));
    return {name:meta.name,type:meta.type,size:meta.size,dt:meta.dt,blob};
  }
  async function cloudDel(id){
    const sb=CLOUD.sb(); if(!sb) return;
    try{
      sbData(await sb.storage.from(SB_BUCKET).remove([id]));
      sbData(await sb.from('files').delete().eq('id',id));
    }catch(e){ console.warn('file delete',e) }
  }
  return {
    ok(){ return ok },
    async put(id,file){
      const rec={name:file.name,type:file.type,size:file.size,blob:file,dt:Date.now()};
      await localPut(id,rec);
      if(await CLOUD.ready()) await cloudPut(id,rec);   /* ошибка сети -> исключение -> «не удалось сохранить» */
      return true;
    },
    async get(id){
      const l=await localGet(id); if(l) return l;
      if(await CLOUD.ready()){
        const r=await cloudGet(id);
        if(r){ localPut(id,r); return r }
      }
      return null;
    },
    async del(id){ try{ await tx('readwrite',s=>s.delete(id)) }catch(e){} memory.delete(id);
      if(await CLOUD.ready()) cloudDel(id) },
    async url(id){ const r=await this.get(id); return r?URL.createObjectURL(r.blob):null },
    _localGet: localGet, _cloudPut: cloudPut
  };
})();

/* ================= БАЗА АНКЕТ + СИНХРОНИЗАЦИЯ =================
   Локальная копия (localStorage) — для мгновенной работы страницы.
   Облако (Supabase): таблица applicants (анкета в поле data) и log (общий журнал).
   Изменения отправляются по полям (функция agz_patch), чтобы абитуриент
   и комиссия не затирали правки друг друга. Обновления приходят через Realtime. */
const EMPTY = { v:5, seq:100, log:[], applicants:[] };

const STORE = (function(){
  const KEY='agz_admission_v5', CH='agz_admission_sync', MIG='agz_cloud_migrated_sb1';
  let mem=null, local=true, chan=null, subs=[], silent=false, synced=!SB_ON;
  let syncRes; const syncP=new Promise(r=>syncRes=r); if(synced) syncRes(true);
  function clone(o){ return JSON.parse(JSON.stringify(o)) }
  function read(){
    if(!local){ if(!mem)mem=clone(EMPTY); return mem }
    try{
      const raw=localStorage.getItem(KEY);
      if(raw){ const d=JSON.parse(raw); if(d&&d.v===EMPTY.v)return d }
      const d=clone(EMPTY); localStorage.setItem(KEY,JSON.stringify(d)); return d;
    }catch(e){ local=false; if(!mem)mem=clone(EMPTY); return mem }
  }
  function write(db){
    if(!local){ mem=db; return }
    try{ localStorage.setItem(KEY,JSON.stringify(db)) }catch(e){ local=false; mem=db }
  }
  function notify(){
    try{ if(chan){ silent=true; chan.postMessage(Date.now()); silent=false } }catch(e){}
    subs.forEach(f=>{ try{f()}catch(e){ console.error(e) } });
  }
  try{ chan=new BroadcastChannel(CH); chan.onmessage=()=>{ if(!silent) subs.forEach(f=>f()) } }catch(e){ chan=null }
  try{ window.addEventListener('storage',e=>{ if(e.key===KEY) subs.forEach(f=>f()) }) }catch(e){}

  /* ---- облачная отправка изменений ---- */
  const SAFE=/^[A-Za-z_][A-Za-z0-9_]*$/;
  const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const T=()=>CLOUD.sb();
  function upsertFull(a){ return T().from('applicants').upsert({id:a.id,data:clone(a)}).then(sbData) }
  function pushApplicant(before,after){
    const sb=T(); if(!sb) return;
    if(!before){ const d=clone(after); if(!d._c)d._c=Date.now(); return upsertFull(d) }
    const set={}, unset=[];
    Object.keys(after).forEach(k=>{
      const a=before[k], b=after[k]; if(same(a,b)) return;
      if(isObj(a)&&isObj(b)&&SAFE.test(k)&&Object.keys(b).concat(Object.keys(a)).every(x=>SAFE.test(x))){
        Object.keys(b).forEach(s=>{ if(!same(a[s],b[s])){ if(b[s]===undefined) unset.push(k+'.'+s); else set[k+'.'+s]=clone(b[s]) } });
        Object.keys(a).forEach(s=>{ if(!(s in b)) unset.push(k+'.'+s) });
      } else if(b===undefined) unset.push(k); else set[k]=clone(b);
    });
    Object.keys(before).forEach(k=>{ if(!(k in after)) unset.push(k) });
    if(!Object.keys(set).length && !unset.length) return;
    return sb.rpc('agz_patch',{p_id:after.id,p_set:set,p_unset:unset}).then(sbData)
      .catch(e=>{ console.warn('patch→upsert',e); return upsertFull(after) });
  }
  function pushChanges(before,db){
    const sb=T(); if(!sb) return;
    const bm=new Map(before.applicants.map(a=>[a.id,a])), am=new Map(db.applicants.map(a=>[a.id,a]));
    const jobs=[];
    am.forEach((a,id)=>{ const b=bm.get(id); if(!b||!same(a,b)) jobs.push(pushApplicant(b,a)) });
    bm.forEach((b,id)=>{ if(!am.has(id)) jobs.push(sb.from('applicants').delete().eq('id',id).then(sbData)) });
    /* новые записи журнала добавляются в начало массива */
    const added=(db.log||[]).length-(before.log||[]).length;
    const rows=[]; for(let i=added-1;i>=0;i--) rows.push({ts:Date.now()+(added-i),entry:clone(db.log[i])});
    if(rows.length) jobs.push(sb.from('log').insert(rows).then(sbData));
    Promise.all(jobs.filter(Boolean)).catch(e=>{ console.error('Supabase write',e); CLOUD.setState('error') });
  }

  /* ---- перенос локальных заявок в облако (один раз для этого браузера) ---- */
  async function migrate(remoteIds,remoteIins){
    try{ if(localStorage.getItem(MIG)) return 0 }catch(e){ return 0 }
    const db=read(); let changed=false, sent=0;
    for(const a of db.applicants.slice()){
      if(remoteIins.has(a.iin)) continue;                       /* уже есть в облаке */
      if(remoteIds.has(a.id)){ a.id=newId(); changed=true }      /* номер занят другим абитуриентом */
      const d=clone(a); d._c=d._c||Date.now();
      await upsertFull(d); sent++;
      for(const v of Object.values(a.docs||{})){
        if(v&&v.fid){ const r=await FILES._localGet(v.fid); if(r) try{ await FILES._cloudPut(v.fid,r) }catch(e){} }
      }
    }
    if(changed) write(db);
    try{ localStorage.setItem(MIG,'1') }catch(e){}
    return sent;
  }

  function newId(){
    const t=Date.now().toString(36).toUpperCase().slice(-5), r=Math.random().toString(36).slice(2,4).toUpperCase();
    return 'A-'+new Date().getFullYear()+'-'+t+r;
  }

  /* ---- загрузка из облака и подписка на изменения ---- */
  async function loadApplicants(){
    const rows=sbData(await T().from('applicants').select('data').order('created_at',{ascending:true}));
    return (rows||[]).map(r=>r.data).sort((a,b)=>(a._c||0)-(b._c||0));
  }
  async function loadLog(){
    const rows=sbData(await T().from('log').select('entry').order('ts',{ascending:false}).limit(300));
    return (rows||[]).map(r=>r.entry);
  }
  CLOUD.ready().then(async ok=>{
    if(!ok){ if(!synced){ synced=true; syncRes(false) } return }
    try{
      let list=await loadApplicants();
      const sent=await migrate(new Set(list.map(a=>a.id)),new Set(list.map(a=>a.iin)));
      if(sent) list=await loadApplicants();
      const db=read(); db.applicants=list; db.log=await loadLog(); write(db);
      synced=true; syncRes(true); CLOUD.setState('on'); notify();
    }catch(e){
      console.error('Supabase:',e); CLOUD.setState('error');
      if(!synced){ synced=true; syncRes(false) }
      return;
    }
    let tA=null, tL=null;
    const refreshA=()=>{ clearTimeout(tA); tA=setTimeout(async()=>{
      try{ const list=await loadApplicants(); const db=read(); if(!same(db.applicants,list)){ db.applicants=list; write(db); notify() } }catch(e){ console.warn('applicants',e) }
    },300) };
    const refreshL=()=>{ clearTimeout(tL); tL=setTimeout(async()=>{
      try{ const log=await loadLog(); const db=read(); if(!same(db.log,log)){ db.log=log; write(db); notify() } }catch(e){ console.warn('log',e) }
    },300) };
    try{
      T().channel('agz-admission')
        .on('postgres_changes',{event:'*',schema:'public',table:'applicants'},refreshA)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'log'},refreshL)
        .subscribe(st=>{ if(st==='SUBSCRIBED') CLOUD.setState('on'); else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT') console.warn('Realtime:',st) });
    }catch(e){ console.warn('Realtime недоступен',e) }
    /* страховка, если Realtime выключен в проекте: сверка раз в 20 секунд и при возврате на вкладку */
    setInterval(()=>{ refreshA(); refreshL() },20000);
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden){ refreshA(); refreshL() } });
  });
  CLOUD.onState(()=>{ try{ if(typeof updateSyncNote==='function') updateSyncNote() }catch(e){} });

  return {
    online(){ return CLOUD.state()==='on' },
    cloud(){ return CLOUD.state() },            /* off | connecting | on | error */
    ready(){ return Promise.race([syncP, new Promise(r=>setTimeout(()=>r(false),10000))]) },
    db(){ return read() },
    all(){ return read().applicants },
    find(id){ return read().applicants.find(a=>a.id===id)||null },
    byIin(iin){ return read().applicants.find(a=>a.iin===iin)||null },
    mutate(fn){
      const db=read(), before=clone(db); const r=fn(db); write(db);
      pushChanges(before,db);
      notify();
      return r;
    },
    onChange(fn){ subs.push(fn) },
    nextId(){ return newId() },
    wipe(){
      try{ localStorage.removeItem(KEY) }catch(e){} mem=null;
      const sb=T();
      if(sb){
        sb.from('applicants').delete().neq('id','').then(sbData).catch(e=>console.warn('wipe applicants',e));
        sb.from('log').delete().gt('id',0).then(sbData).catch(e=>console.warn('wipe log',e));
        sb.from('files').select('id').then(sbData).then(rows=>{
          const ids=(rows||[]).map(r=>r.id); if(!ids.length) return;
          return sb.storage.from(SB_BUCKET).remove(ids).then(()=>sb.from('files').delete().in('id',ids).then(sbData));
        }).catch(e=>console.warn('wipe files',e));
      }
      const e=clone(EMPTY), db=read(); db.applicants=e.applicants; db.log=e.log; db.seq=e.seq; write(db); notify();
    }
  };
})();

/* Строка статуса связи в шапке (#syncNote) */
function updateSyncNote(){
  const sn=document.getElementById('syncNote'); if(!sn||typeof t!=='function') return;
  const st=STORE.cloud();
  const key = st==='on'?'sync_on' : st==='connecting'?'sync_wait' : st==='error'?'sync_err' : 'sync_off';
  sn.textContent=t(key); sn.className='sync '+(st==='on'?'on':'off');
}

/* ================= ХЕЛПЕРЫ ================= */
function docsOf(a){ return DOC_TYPES.map(d=>({t:d, v:a.docs[d.id]||{s:'none'}})) }
function analyze(a){
  const req=DOC_TYPES.filter(d=>d.req);
  let ok=0,review=0,fix=0,none=0;
  req.forEach(d=>{ const s=(a.docs[d.id]||{s:'none'}).s;
    if(s==='ok')ok++; else if(s==='review')review++; else if(s==='fix')fix++; else none++; });
  return {total:req.length, ok, review, fix, none,
    pct:Math.round(ok/req.length*100),
    complete: none===0 && fix===0 && review===0,
    filled:   none===0 && fix===0,
    missing: req.filter(d=>(a.docs[d.id]||{s:'none'}).s==='none'),
    broken:  req.filter(d=>(a.docs[d.id]||{s:'none'}).s==='fix')};
}
function stamp(){ return new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) }
function today(){ return new Date().toLocaleDateString('ru-RU') }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

/* --- Этапы отбора личного дела (s3..s7) --- */
function stagesOf(a){
  return STAGE_TYPES.map((s,i)=>({t:s, v:(a.stages&&a.stages[s.id])||{s:'none'}, idx:i}));
}
function stageAvailable(a,idx){
  if(idx===0) return analyze(a).complete;                 /* мед. осмотр — после полного комплекта документов */
  const prev=STAGE_TYPES[idx-1];
  const pv=(a.stages&&a.stages[prev.id])||{s:'none'};
  return pv.s==='ok';                                      /* следующий этап — после успеха предыдущего */
}
function L(o){ return o?(LANG==='kz'?o.kz:o.ru):'' }
function initials(s){ return String(s||'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('') }

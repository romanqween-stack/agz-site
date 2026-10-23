/* ============================================================
   sw.js — сервис-воркер: сайт как приложение, работа без сети
   Страницы: сначала сеть, при отсутствии сети — сохранённая копия.
   Стили, скрипты, картинки, шрифты: из кэша с фоновым обновлением.
   Запросы к API, Supabase и YouTube не кэшируются.
   При изменении файлов сайта увеличьте номер версии CACHE.
   ============================================================ */
const CACHE='agz-v2';
const CORE=[
  './','index.html','rules.html','info.html','programs.html','dchs.html','cabinet.html','commission.html',
  'manifest.webmanifest',
  'css/style.css','css/portal.css',
  'js/config.js','js/app.js','js/i18n.js','js/i18n-kz.js','js/effects.js','js/assistant.js','js/data.js',
  'js/admission-data.js','js/admission-core.js','js/cabinet.js','js/commission.js',
  'img/emblem-academy.png','img/emblem-tjm.png','img/gerb-kz.png','img/flag-kz.png',
  'img/icon-192.png','img/icon-512.png','img/apple-touch-icon.png',
  'img/building.jpg','img/cadets-parade.jpg','img/cadets-blue.jpg','img/cadets-green.jpg','img/cadets-navy.jpg',
  'img/graduation.jpg','img/work-fire.jpg','img/work-rescue.jpg','img/work-smoke.jpg','img/work-shtab.jpg','img/work-prevention.jpg'
];
const FONT_HOSTS=['fonts.googleapis.com','fonts.gstatic.com'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  const same=url.origin===self.location.origin;
  if(!same && !FONT_HOSTS.includes(url.hostname)) return;   /* YouTube, Supabase и пр. — напрямую */
  if(same && url.pathname.startsWith('/api/')) return;

  /* ключи Supabase и страницы — сначала из сети (чтобы правки применялись сразу) */
  if(req.mode==='navigate' || url.pathname.endsWith('/js/config.js')){
    e.respondWith(
      fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res })
        .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||(req.mode==='navigate'?caches.match('index.html'):r)))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(cached=>{
      const net=fetch(req).then(res=>{
        if(res&&(res.ok||res.type==='opaque')){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)) }
        return res;
      }).catch(()=>cached);
      return cached||net;
    })
  );
});

/* ============================================================
   app.js — общие элементы интерфейса (шапка, подвал, тосты)
   Дизайн: glassmorphism-шапка с символикой РК, градиентный подвал.
   ============================================================ */

function buildHeader(active){
  const L=(typeof SITE!=='undefined')?SITE.lang:'ru';
  return `
  <header class="header">
    <a href="index.html" class="brand">
      <img src="img/emblem-academy.png" alt="Эмблема Академии">
      <span class="b-text"><b>Академия гражданской защиты</b><span>имени Малика Габдуллина · МЧС РК</span></span>
    </a>
    <button class="burger" type="button" aria-label="Меню" aria-controls="mainNav" aria-expanded="false" onclick="toggleMenu()">☰</button>
    <nav class="nav" id="mainNav">
      <a href="index.html" class="${active==='home'?'active':''}">Главная</a>
      <a href="rules.html" class="${active==='rules'?'active':''}">Правила приёма</a>
      <a href="programs.html" class="${active==='programs'?'active':''}">Программы</a>
      <a href="info.html" class="${active==='info'?'active':''}">Поступление</a>
      <a href="dchs.html" class="${active==='dchs'?'active':''}">ДЧС регионов</a>
      <a href="cabinet.html" class="${active==='cabinet'?'active':''}">Личный кабинет</a>
      <a href="cabinet.html#docs" class="btn btn--sm">Подать заявку</a>
      <button type="button" class="nav-install" hidden onclick="installApp()">📲 Установить приложение</button>
    </nav>
    <div class="lang-switch hdr">
      <button data-lang="ru" class="${L==='ru'?'on':''}" onclick="SITE.set('ru')">РУС</button>
      <button data-lang="kz" class="${L==='kz'?'on':''}" onclick="SITE.set('kz')">ҚАЗ</button>
    </div>
    <div class="flags">
      <img class="flag" src="img/flag-kz.png" alt="Флаг РК" title="Қазақстан">
      <img class="gerb" src="img/gerb-kz.png" alt="Герб РК" title="Герб РК">
    </div>
  </header>`;
}

function buildFooter(){
  return `
  <footer class="footer">
    <div class="neon" style="width:300px;height:300px;top:-140px;left:8%;background:radial-gradient(circle,rgba(43,120,240,.4),transparent 70%)"></div>
    <div class="fgrid">
      <div class="f-brand">
        <div class="f-emblems">
          <img src="img/emblem-academy.png" style="width:46px;height:46px;object-fit:contain;border-radius:50%">
          <img src="img/emblem-tjm.png" style="width:46px;height:46px;object-fit:contain">
          <img src="img/gerb-kz.png" style="width:40px;height:40px;object-fit:contain">
          <img src="img/flag-kz.png" style="width:44px;height:29px;object-fit:cover;border-radius:5px">
        </div>
        <b>Академия гражданской защиты им. М. Габдуллина</b>
        <p style="font-size:13px;line-height:1.5">Министерство по чрезвычайным ситуациям Республики Казахстан.
          Бесплатное обучение, гарантированное трудоустройство.</p>
      </div>
      <div class="fcol">
        <h4>Навигация</h4>
        <a href="rules.html">Правила приёма</a>
        <a href="programs.html">Образовательные программы</a>
        <a href="info.html">Информация о поступлении</a>
        <a href="dchs.html">Приём документов по регионам</a>
        <a href="cabinet.html">Кабинет абитуриента</a>
        <a href="https://agz.edu.kz" target="_blank" rel="noopener">Официальный сайт agz.edu.kz</a>
        <a href="commission.html">Вход для сотрудников</a>
        <a href="#" class="f-install" hidden onclick="installApp();return false">📲 Установить приложение</a>
        <span class="f-ios" hidden>📲 iPhone: «Поделиться» → «На экран „Домой“»</span>
      </div>
      <div class="fcol">
        <h4>Контакты</h4>
        <div>020000, Акмолинская область, г. Кокшетау, ул. Ақан сері, 136</div>
        <div>Тел.: <a class="tel" href="tel:+77162251336">(87162) 25-13-36</a></div>
        <div>Приёмная: <a class="tel" href="tel:+77162255249">(87162) 25-52-49</a></div>
        <div>Отдел кадровой работы: <a class="tel" href="tel:+77162250401">(87162) 25-04-01</a></div>
        <div><a class="tel" href="mailto:academy@agz.emer.kz">academy@agz.emer.kz</a></div>
        <a href="https://t.me/ktikokshe" target="_blank">Telegram: @ktikokshe</a>
        <a href="https://instagram.com/agz_mchs_rk" target="_blank">Instagram: @agz_mchs_rk</a>
      </div>
    </div>
    <div class="fbot">
      <span>© 2026 Академия гражданской защиты имени Малика Габдуллина МЧС Республики Казахстан</span>
      <span>Миссия спасать — достоинство благородных</span>
    </div>
  </footer>`;
}

function mountChrome(active){
  const first = window.__chromeActive===undefined;
  window.__chromeActive=active;
  const h=document.getElementById('site-header');
  const f=document.getElementById('site-footer');
  if(h) h.innerHTML=buildHeader(active);
  if(f) f.innerHTML=buildFooter();
  if(first){ initVideos(); if(typeof SITE!=='undefined') SITE.applyAll() }
  refreshInstallUI();
}

/* toast */
let _toastT;
function toast(msg,type=''){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
  t.className='toast '+type;t.innerHTML=msg;
  requestAnimationFrame(()=>t.classList.add('show'));
  clearTimeout(_toastT);
  _toastT=setTimeout(()=>t.classList.remove('show'),3200);
}

function toggleAcc(el){el.parentElement.classList.toggle('open')}

/* ---------- Видео YouTube ----------
   Обложка с кнопкой воспроизведения. С сервера (http/https) видео
   запускается прямо на странице; при открытии сайта как файла
   YouTube не даёт встроить плеер, поэтому ролик открывается на YouTube. */
function initVideos(){
  document.querySelectorAll('.yt[data-yt]').forEach(box=>{
    if(box.dataset.ready) return; box.dataset.ready='1';
    const id=box.dataset.yt, title=box.dataset.title||'Видео';
    const url='https://www.youtube.com/watch?v='+id;
    box.innerHTML=`<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${title}" loading="lazy">
      <button class="yt-play" type="button" aria-label="Смотреть видео"><span>▶</span></button>
      ${box.dataset.cap?`<span class="yt-cap">${box.dataset.cap}</span>`:''}
      <a class="yt-link" href="${url}" target="_blank" rel="noopener">YouTube ↗</a>`;
    box.querySelector('.yt-play').addEventListener('click',()=>{
      if(location.protocol==='http:'||location.protocol==='https:'){
        box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${title}"
          allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      } else {
        window.open(url,'_blank','noopener');
      }
    });
  });
}
/* ============================================================
   МОБИЛЬНАЯ ВЕРСИЯ
   ============================================================ */

/* ---------- меню-«бургер» ---------- */
function toggleMenu(force){
  const nav=document.getElementById('mainNav'), btn=document.querySelector('.burger');
  if(!nav) return;
  const open = force===undefined ? !nav.classList.contains('open') : force;
  nav.classList.toggle('open',open);
  if(btn){ btn.setAttribute('aria-expanded',String(open)); btn.textContent=open?'✕':'☰' }
}
document.addEventListener('click',e=>{
  const nav=document.getElementById('mainNav'); if(!nav||!nav.classList.contains('open')) return;
  if(e.target.closest('.burger')) return;
  if(!e.target.closest('#mainNav') || e.target.closest('#mainNav a')) toggleMenu(false);
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') toggleMenu(false) });

/* ---------- вкладки с горизонтальной прокруткой: активная — в центре ---------- */
function centerTab(btn){
  const bar=btn&&btn.parentElement; if(!bar||bar.scrollWidth<=bar.clientWidth) return;
  bar.scrollTo({left:btn.offsetLeft-(bar.clientWidth-btn.offsetWidth)/2,behavior:'smooth'});
}

/* ---------- таблицы → карточки на телефоне ----------
   Каждой ячейке таблиц с классом .rt проставляется подпись из шапки
   таблицы (data-label); CSS на узком экране показывает строки карточками. */
function headLabels(t){
  const grid=[];
  [...t.querySelectorAll('thead tr')].forEach((tr,ri)=>{
    grid[ri]=grid[ri]||[]; let ci=0;
    [...tr.children].forEach(th=>{
      while(grid[ri][ci]!==undefined) ci++;
      const cs=th.colSpan||1, rs=th.rowSpan||1, txt=th.textContent.trim();
      for(let r=0;r<rs;r++) for(let c=0;c<cs;c++) (grid[ri+r]=grid[ri+r]||[])[ci+c]=txt;
      ci+=cs;
    });
  });
  const n=Math.max(0,...grid.map(r=>r.length)), out=[];
  for(let c=0;c<n;c++){ const parts=[]; grid.forEach(r=>{ const v=r[c]; if(v&&!parts.includes(v)) parts.push(v) }); out.push(parts.join(' · ')) }
  return out;
}
function labelTables(){
  document.querySelectorAll('table.rt').forEach(t=>{
    const L=headLabels(t);
    t.querySelectorAll('tbody tr').forEach(tr=>{
      [...tr.children].forEach((td,i)=>{
        const lbl=td.colSpan>1?'':(L[i]||'');
        if(td.dataset.label!==lbl) td.dataset.label=lbl;
        td.classList.toggle('na',td.textContent.trim()==='—');
      });
    });
  });
}
(function(){
  let pending=false;
  const run=()=>{ pending=false; labelTables() };
  const schedule=()=>{ if(!pending){ pending=true; requestAnimationFrame(run) } };
  const start=()=>{ labelTables(); new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true}) };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();

/* ---------- приложение на главный экран (PWA) ---------- */
let _installEvt=null;
const _isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const _isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
function refreshInstallUI(){
  const can=!!_installEvt && !_isStandalone();
  document.querySelectorAll('.nav-install,.f-install').forEach(el=>el.hidden=!can);
  document.querySelectorAll('.f-ios').forEach(el=>el.hidden=!(_isIOS()&&!_isStandalone()));
}
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); _installEvt=e; refreshInstallUI() });
window.addEventListener('appinstalled',()=>{ _installEvt=null; refreshInstallUI() });
async function installApp(){
  if(!_installEvt) return;
  _installEvt.prompt();
  try{ await _installEvt.userChoice }catch(e){}
  _installEvt=null; refreshInstallUI(); toggleMenu(false);
}
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  /* не ждём полной загрузки страницы: внешние картинки (YouTube) и шрифты могут грузиться долго */
  let _swDone=false;
  const regSW=()=>{ if(_swDone) return; _swDone=true; navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW:',e)) };
  if(document.readyState==='complete') regSW(); else { window.addEventListener('load',regSW); setTimeout(regSW,3000) }
}
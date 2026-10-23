/* ============================================================
   effects.js — интерактив из дизайна:
   reveal-on-scroll, count-up статистики, неоновый курсор.
   ============================================================ */
(function(){
  function initReveal(){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)} });
    },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
  }

  function initCount(){
    const cio=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){count(e.target);cio.unobserve(e.target)} });
    },{threshold:0.6});
    document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
  }
  function count(el){
    const target=parseFloat(el.getAttribute('data-count'));
    if(isNaN(target))return;
    const suffix=el.getAttribute('data-suffix')||'';
    const dur=1300,start=performance.now();
    const fmt=n=>Math.round(n).toLocaleString('ru-RU');
    const step=now=>{
      const t=Math.min(1,(now-start)/dur);
      const e=1-Math.pow(1-t,3);
      el.textContent=fmt(target*e)+suffix;
      if(t<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCursor(){
    if(!(window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches))return;
    const glow=document.createElement('div');glow.className='agz-cursor-glow';
    const ring=document.createElement('div');ring.className='agz-cursor-ring';
    document.body.appendChild(glow);document.body.appendChild(ring);
    let rx=-100,ry=0,tx=-100,ty=0,gx=-200,gy=0;
    window.addEventListener('mousemove',ev=>{tx=ev.clientX;ty=ev.clientY});
    (function tick(){
      rx+=(tx-rx)*.22;ry+=(ty-ry)*.22;gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;
      ring.style.left=rx+'px';ring.style.top=ry+'px';
      glow.style.left=gx+'px';glow.style.top=gy+'px';
      requestAnimationFrame(tick);
    })();
    document.addEventListener('mouseover',ev=>{ if(ev.target.closest('a,button,[data-hov],.card--hover,.num-card,.photo-tile')){
      ring.style.width='54px';ring.style.height='54px';ring.style.borderColor='#7BE3FF';
      ring.style.boxShadow='0 0 16px rgba(56,210,242,1),0 0 34px rgba(56,210,242,.7),inset 0 0 12px rgba(56,210,242,.5)';
    }});
    document.addEventListener('mouseout',ev=>{ if(ev.target.closest('a,button,[data-hov],.card--hover,.num-card,.photo-tile')){
      ring.style.width='30px';ring.style.height='30px';ring.style.borderColor='#38D2F2';
      ring.style.boxShadow='0 0 10px rgba(56,210,242,.9),0 0 22px rgba(56,210,242,.55),inset 0 0 8px rgba(56,210,242,.35)';
    }});
    window.addEventListener('mousedown',()=>ring.style.transform='translate(-50%,-50%) scale(.78)');
    window.addEventListener('mouseup',()=>ring.style.transform='translate(-50%,-50%) scale(1)');
  }

  function run(){initReveal();initCount();initCursor()}
  if(document.readyState!=='loading')run();
  else document.addEventListener('DOMContentLoaded',run);

  // экспортируем для динамически добавленного контента
  window.AGZeffects={reveal:initReveal,count:initCount};
})();

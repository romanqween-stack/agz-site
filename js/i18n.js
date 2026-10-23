/* ============================================================
   i18n.js — переключение языка сайта (РУС / ҚАЗ)
   Тексты страниц написаны на русском прямо в HTML. При выборе
   казахского текстовые узлы подменяются по словарю KZ
   (js/i18n-kz.js), при возврате — восстанавливаются.
   Выбор языка запоминается (localStorage 'agz_lang') и общий
   с кабинетом абитуриента и панелью комиссии.
   Не переводятся: элементы с [data-i18n] (у кабинета и комиссии
   свой перевод), с [data-noi18n], а также сообщения чата.
   ============================================================ */

const SITE = (function(){
  const KEY='agz_lang';
  let lang='ru';
  try{ if(localStorage.getItem(KEY)==='kz') lang='kz' }catch(e){}

  const origText=new WeakMap(), origAttr=new WeakMap(), origHtml=new WeakMap();
  const subs=[];
  const SKIP='script,style,textarea,[data-i18n],[data-noi18n],[data-t],.ai-body';
  const norm=s=>String(s).replace(/\s+/g,' ').trim();
  const dict=()=> (typeof KZ!=='undefined'?KZ:{});

  function tr(ru){
    if(lang!=='kz') return ru;
    const k=dict()[norm(ru)];
    if(k===undefined) return ru;
    return ru.match(/^\s*/)[0]+k+ru.match(/\s*$/)[0];
  }

  function apply(root){
    root=root||document.body; if(!root) return;
    const D=dict();
    /* элементы с data-t: перевод всего содержимого (для абзацев со вложенной разметкой) */
    root.querySelectorAll('[data-t]').forEach(el=>{
      if(!origHtml.has(el)) origHtml.set(el,el.innerHTML);
      const k=D['@'+el.dataset.t];
      el.innerHTML = (lang==='kz'&&k!==undefined) ? k : origHtml.get(el);
    });
    /* текстовые узлы */
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
      if(!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p=n.parentElement;
      if(!p||p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const list=[]; while(w.nextNode()) list.push(w.currentNode);
    list.forEach(n=>{
      if(!origText.has(n)) origText.set(n,n.nodeValue);
      const ru=origText.get(n), v=tr(ru);
      if(n.nodeValue!==v) n.nodeValue=v;
    });
    /* атрибуты */
    root.querySelectorAll('[placeholder],[title],[aria-label],img[alt]').forEach(el=>{
      if(el.closest('[data-i18n],[data-noi18n]')) return;
      let o=origAttr.get(el);
      if(!o){ o={}; ['placeholder','title','aria-label','alt'].forEach(a=>{ if(el.hasAttribute(a)) o[a]=el.getAttribute(a) }); origAttr.set(el,o) }
      Object.keys(o).forEach(a=>el.setAttribute(a,tr(o[a])));
    });
  }

  let origTitle=null;
  function applyAll(){
    document.documentElement.lang = lang==='kz'?'kk':'ru';
    if(origTitle===null) origTitle=document.title;
    document.title=tr(origTitle);
    apply(document.body);
    document.querySelectorAll('.lang-switch [data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===lang));
  }

  return {
    get lang(){ return lang },
    tr, apply, applyAll,
    /* переключение из шапки */
    set(l){
      lang=l==='kz'?'kz':'ru';
      try{ localStorage.setItem(KEY,lang) }catch(e){}
      if(typeof mountChrome==='function' && window.__chromeActive!==undefined) mountChrome(window.__chromeActive);
      applyAll();
      subs.forEach(f=>{ try{ f(lang) }catch(e){ console.error(e) } });
      /* у кабинета и панели комиссии собственный перевод */
      if(typeof setLang==='function') setLang(lang);
    },
    onChange(f){ subs.push(f) }
  };
})();

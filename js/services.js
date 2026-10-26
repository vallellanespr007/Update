(() => {
  const root=document.documentElement;
  // En el sitio publicado cada idioma tiene su URL (/ y /es/): <html data-lang data-alt> los pone tools/build_site.py.
  // En la página fuente (bilingüe) el botón EN/ES cambia el idioma en la misma página.
  const altURL=root.dataset.alt;
  let L=root.dataset.lang==='es'?'es':'en', stored=null;
  try{stored=localStorage.getItem('ug-lang');}catch(e){}
  if(altURL){ if((stored==='es'||stored==='en')&&stored!==L){location.replace(altURL+location.hash);return;} }
  else if(stored==='es'||stored==='en') L=stored;
  const goLang=l=>{ if(altURL&&l!==L){try{localStorage.setItem('ug-lang',l)}catch(e){} location.href=altURL+location.hash; return true;} return false; };
  function setLang(l){
    L=l; root.dataset.lang=l; root.lang=l;
    try{localStorage.setItem('ug-lang',l)}catch(e){}
    document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.set===l)));
    document.querySelectorAll('img[data-alt-en]').forEach(i=>i.alt=i.dataset[l==='en'?'altEn':'altEs']);
  }
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{ if(!goLang(b.dataset.set)) setLang(b.dataset.set); }));
  setLang(L);

  const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items=[...document.querySelectorAll('.sv')];
  if(motionOK && 'IntersectionObserver' in window){
    root.classList.add('js-motion');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{threshold:.18});
    items.forEach(el=>io.observe(el));
    // Parallax suave de las fotos (solo pantallas grandes)
    if(matchMedia('(min-width:901px)').matches){
      const imgs=[...document.querySelectorAll('.sv-frame img')];
      let ticking=false;
      const upd=()=>{imgs.forEach(img=>{const r=img.parentElement.getBoundingClientRect(); const c=(r.top+r.height/2-innerHeight/2)/innerHeight; img.style.setProperty('--py',(c*-40).toFixed(1)+'px');}); ticking=false;};
      addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(upd);ticking=true;}},{passive:true}); upd();
    }
  } else {
    items.forEach(el=>el.classList.add('is-in'));
  }
})();

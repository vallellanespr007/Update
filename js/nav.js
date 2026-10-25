// Menú para celular (≤960px): botón en .nav-r que abre un panel con los mismos enlaces del menú de arriba
(() => {
  const nav=document.querySelector('.nav'), links=nav&&nav.querySelector('.wrap > ul'), right=nav&&nav.querySelector('.nav-r');
  if(!links||!right) return;
  const btn=document.createElement('button');
  btn.type='button'; btn.className='nav-menu'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','mnav');
  btn.innerHTML='<svg class="i-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="i-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="vh en">Menu</span><span class="vh es">Menú</span>';
  const panel=document.createElement('nav');
  panel.id='mnav'; panel.className='mnav'; panel.hidden=true; panel.setAttribute('aria-label','Menu / Menú');
  panel.appendChild(links.cloneNode(true));
  right.appendChild(btn); nav.appendChild(panel);
  const isOpen=()=>btn.getAttribute('aria-expanded')==='true';
  function set(open,focusBtn){
    btn.setAttribute('aria-expanded',String(open)); panel.hidden=!open;
    if(!open&&focusBtn) btn.focus({preventScroll:true});
  }
  btn.addEventListener('click',()=>set(!isOpen(),true));
  panel.addEventListener('click',e=>{if(e.target.closest('a')) set(false,true);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen()){set(false,true);}});
  document.addEventListener('click',e=>{if(isOpen()&&!panel.contains(e.target)&&!btn.contains(e.target)) set(false,panel.contains(document.activeElement));});
  matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches&&isOpen()) set(false,false);});
})();

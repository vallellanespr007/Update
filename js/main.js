(() => {
  const root=document.documentElement, $=id=>document.getElementById(id);
  // Idioma: gana el que la persona escogió; si no, inglés solo si el navegador está en inglés
  let L=/^en/i.test(navigator.language||'')?'en':'es';
  try{const s=localStorage.getItem('ug-lang'); if(s==='es'||s==='en') L=s;}catch(e){}

  // ---- Language
  function setLang(l){
    L=l; root.dataset.lang=l; root.lang=l;
    try{localStorage.setItem('ug-lang',l)}catch(e){}
    document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.set===l)));
    document.querySelectorAll('[data-ph-en]').forEach(el=>el.placeholder=el.dataset[l==='en'?'phEn':'phEs']);
    if(active) fillDash();
    chatReset();
  }
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.set)));

  // ---- Chat demo
  const CHAT={
    en:[["in","Hi! How much is catering for 40 people?","11:52 PM"],["out","Hi! 👋 Our catering for 40 starts at our Classic menu. Is it for an office or a private event?","11:52 PM · AI"],["in","Office, next Friday","11:53 PM"],["out","Perfect. I can book a 10-minute call tomorrow at 9:00 AM to confirm the menu. Does that work?","11:53 PM · AI"],["in","Yes 🙌","11:54 PM"],["out","Done! ✅ Booked for tomorrow 9:00 AM. You’ll get a reminder here.","11:54 PM · AI"]],
    es:[["in","¡Hola! ¿Cuánto cuesta el catering para 40 personas?","11:52 PM"],["out","¡Hola! 👋 El catering para 40 empieza con nuestro menú Clásico. ¿Es para oficina o evento privado?","11:52 PM · AI"],["in","Oficina, el viernes que viene","11:53 PM"],["out","Perfecto. Puedo agendarte una llamada de 10 minutos mañana a las 9:00 AM para confirmar el menú. ¿Te funciona?","11:53 PM · AI"],["in","Sí 🙌","11:54 PM"],["out","¡Listo! ✅ Agendado para mañana 9:00 AM. Te llegará un recordatorio por aquí.","11:54 PM · AI"]]
  };
  const chat=$('chat'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let ci=0, timer;
  const bubble=([w,t,s])=>`<div class="msg ${w}">${esc(t)}<small>${esc(s)}</small></div>`;
  function chatReset(){
    clearInterval(timer);
    if(reduce){chat.innerHTML=CHAT[L].slice(-4).map(bubble).join('');return;}
    ci=3; chat.innerHTML=CHAT[L].slice(0,3).map(bubble).join('');
    timer=setInterval(()=>{
      const m=CHAT[L];
      if(ci>=m.length){ci=0;chat.innerHTML='';}
      chat.insertAdjacentHTML('beforeend',bubble(m[ci++]));
      while(chat.children.length>4) chat.firstElementChild.remove();
    },2600);
  }

  // ---- Formulario de contacto: lo envía el servidor (/api/contact) al Outlook de Update Group
  const formStart=Date.now();
  $('lead-form').addEventListener('submit',async e=>{
    e.preventDefault();
    const f=e.currentTarget, n=$('f-note'), btn=f.querySelector('button[type=submit]');
    const t=(en,es)=>L==='en'?en:es;
    const show=(msg,ok)=>{n.hidden=false;n.textContent=msg;n.classList.toggle('err-note',!ok);};
    const name=$('f-name').value.trim(), phone=$('f-phone').value.trim(), email=$('f-email').value.trim();
    if(!name||phone.replace(/\D/g,'').length<7){show(t('Enter your name and a valid phone number.','Escribe tu nombre y un teléfono válido.'),false);(!name?$('f-name'):$('f-phone')).focus();return;}
    if(email&&!$('f-email').checkValidity()){show(t('Check your email address.','Revisa tu email.'),false);$('f-email').focus();return;}
    btn.disabled=true; const label=btn.innerHTML; btn.innerHTML=t('Sending…','Enviando…');
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,business:$('f-biz').value.trim(),phone,email,message:$('f-msg').value.trim(),lang:L,website:$('f-website').value,t:formStart})});
      if(r.ok){f.reset();show(t("Thanks! We got your request and will contact you soon.","¡Gracias! Recibimos tu solicitud y te contactaremos pronto."),true);}
      else if(r.status===429){show(t('Too many requests. Please try again later or message us on WhatsApp.','Demasiados intentos. Intenta más tarde o escríbenos por WhatsApp.'),false);}
      else{throw new Error(r.status);}
    }catch(err){
      // Sin servidor (o falló): ofrecer el mismo mensaje por WhatsApp, ya escrito. Es un enlace y no window.open, porque los navegadores bloquean popups después de un fetch.
      const biz=$('f-biz').value.trim(), msg=$('f-msg').value.trim();
      const lines=[t("Hi Update Group! I'd like a proposal.","¡Hola Update Group! Quiero pedir una propuesta."),t('Name: ','Nombre: ')+name,biz&&t('Business: ','Negocio: ')+biz,t('Phone: ','Teléfono: ')+phone,email&&'Email: '+email,msg&&t('Message: ','Mensaje: ')+msg].filter(Boolean);
      show(t("We couldn't send your request from here. Send it by WhatsApp, your details are already filled in.","No pudimos enviar tu solicitud desde aquí. Envíala por WhatsApp, tus datos ya están escritos."),false);
      const a=document.createElement('a'); a.className='btn btn-grad wa-send'; a.href='https://wa.me/17879494781?text='+encodeURIComponent(lines.join('\n')); a.target='_blank'; a.rel='noopener'; a.textContent=t('Send by WhatsApp','Enviar por WhatsApp'); n.appendChild(a);
    }
    finally{btn.disabled=false;btn.innerHTML=label;}
  });

  // ---- Portal (prototype only: real access control happens in WordPress, on the server)
  const PROPOSALS={
    "UPDATE2026":{client:"Café Ejemplo PR",num:"UG-2026-014",date:{en:"Oct 18, 2026",es:"18 oct 2026"},pdf:"propuesta-ejemplo.pdf"}
  };
  let active=null, pdfDoc=null, scale=1.3;
  function route(){
    const portal=location.hash==='#portal';
    $('view-home').hidden=portal; $('view-portal').hidden=!portal;
    if(portal){ window.scrollTo(0,0); if(!active) setTimeout(()=>$('g-pass').focus(),50); }
  }
  addEventListener('hashchange',route);

  function fillDash(){
    $('d-client').textContent=(L==='en'?'Prepared for ':'Preparada para ')+active.client;
    $('d-num').textContent='#'+active.num; $('d-date').textContent=active.date[L];
    const wa=t=>'https://wa.me/17879494781?text='+encodeURIComponent(t);
    $('approve').href=wa(L==='en'?`Hi Update Group! I approve proposal #${active.num} for ${active.client}.`:`¡Hola Update Group! Apruebo la propuesta #${active.num} para ${active.client}.`);
    $('ask').href=wa(L==='en'?`Hi Update Group! I have questions about proposal #${active.num}.`:`¡Hola Update Group! Tengo preguntas sobre la propuesta #${active.num}.`);
  }
  async function render(){
    const box=$('pages'); box.innerHTML='';
    for(let i=1;i<=pdfDoc.numPages;i++){
      const page=await pdfDoc.getPage(i), vp=page.getViewport({scale:scale*(devicePixelRatio||1)});
      const cv=document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height;
      cv.style.width=(vp.width/(devicePixelRatio||1))+'px'; cv.setAttribute('aria-label','Page '+i);
      box.appendChild(cv); await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
    }
    $('pg-info').textContent=(L==='en'?'Pages: ':'Páginas: ')+pdfDoc.numPages+' · '+Math.round(scale/1.3*100)+'%';
  }
  // pdf.js (1.4 MB) solo se descarga cuando alguien abre una propuesta
  let pdfLoad=null;
  const loadPdf=()=>pdfLoad||(pdfLoad=new Promise((res,rej)=>{
    if(window.pdfjsLib) return res(window.pdfjsLib);
    const s=document.createElement('script'); s.src='vendor/pdfjs/pdf.min.js';
    s.addEventListener('load',()=>window.pdfjsLib?res(window.pdfjsLib):rej(new Error('pdfjs')));
    s.addEventListener('error',()=>{pdfLoad=null;s.remove();rej(new Error('pdfjs'));});
    document.head.appendChild(s);
  }).then(lib=>{lib.GlobalWorkerOptions.workerSrc='vendor/pdfjs/pdf.worker.min.js';return lib;}));
  async function open(p){
    active=p; $('gate').hidden=true; $('dash').hidden=false; fillDash();
    try{
      const lib=await loadPdf();
      pdfDoc=await lib.getDocument({url:p.pdf,isEvalSupported:false}).promise; await render();
    }catch(err){
      $('pages').innerHTML=`<p class="loading">${L==='en'?'The proposal could not load. Message us on WhatsApp and we’ll send it right away.':'No se pudo cargar la propuesta. Escríbenos por WhatsApp y te la enviamos enseguida.'}</p>`;
    }
  }
  $('gate-form').addEventListener('submit',e=>{
    e.preventDefault();
    const code=$('g-pass').value.trim().toUpperCase(), err=$('g-err');
    if(PROPOSALS[code]){err.hidden=true; $('g-pass').value=''; open(PROPOSALS[code]);}
    else{err.hidden=false; err.textContent= L==='en'?'That access code doesn’t match. Check the message we sent you or contact us on WhatsApp.':'Esa clave no coincide. Revisa el mensaje que te enviamos o escríbenos por WhatsApp.';}
  });
  $('logout').addEventListener('click',()=>{active=null;pdfDoc=null;$('dash').hidden=true;$('gate').hidden=false;$('pages').innerHTML='';$('g-pass').focus();});
  $('z-in').addEventListener('click',()=>{if(pdfDoc&&scale<2.6){scale+=.25;render();}});
  $('z-out').addEventListener('click',()=>{if(pdfDoc&&scale>.8){scale-=.25;render();}});


  // ---- Servicios en movimiento: entrada escalonada, inclinación y brillo que sigue el cursor
  const motionOK=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tiles=[...document.querySelectorAll('.svc-bento .tile')];
  // Elementos que entran al hacer scroll: [selector, variante, retraso escalonado]
  const RV=[['.intro h2','rv-left',0],['.intro-grid > div','rv-right',0],['#proceso .head','',0],['.proc li','',.14],['.portal-wide','rv-zoom',0],['#contacto .cta','',0],['.certs-head','',0],['.cert-grid li','rv-zoom',.1]];
  const extra=[];
  RV.forEach(([sel,v,step])=>document.querySelectorAll(sel).forEach((el,i)=>{el.classList.add('rv');if(v)el.classList.add(v);el.style.setProperty('--delay',(i*step)+'s');extra.push(el);}));
  const revealEls=[...tiles, document.querySelector('.band-title'), ...extra].filter(Boolean);
  tiles.forEach((t,i)=>{t.style.setProperty('--delay',(i*0.12)+'s');});
  if(motionOK && 'IntersectionObserver' in window){
    root.classList.add('js-motion');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}}),{threshold:.15});
    revealEls.forEach(el=>io.observe(el));
    if(matchMedia('(hover:hover)').matches){
      tiles.forEach(t=>{
        t.addEventListener('pointermove',ev=>{
          const r=t.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width, y=(ev.clientY-r.top)/r.height;
          t.style.setProperty('--mx',(x*100)+'%'); t.style.setProperty('--my',(y*100)+'%');
          t.style.setProperty('--ry',((x-.5)*7)+'deg'); t.style.setProperty('--rx',((.5-y)*7)+'deg');
        });
        t.addEventListener('pointerleave',()=>{t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg');});
      });
    }
  } else {
    revealEls.forEach(el=>el.classList.add('is-in'));
  }

  // ---- Celular: la burbuja de WhatsApp no tapa el hero; aparece al bajar
  const wa=document.querySelector('.wa'), hero=$('top');
  if(wa&&hero&&'IntersectionObserver' in window){
    const small=matchMedia('(max-width:860px)'); let heroIn=false;
    const upd=()=>wa.classList.toggle('wa-off',small.matches&&heroIn);
    new IntersectionObserver(es=>{heroIn=es[es.length-1].isIntersecting;upd();}).observe(hero);
    small.addEventListener('change',upd);
  }

  setLang(L); route();
})();

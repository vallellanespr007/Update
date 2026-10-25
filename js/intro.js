try{if(location.hash||sessionStorage.getItem('ug-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('pl-skip');}catch(e){}
// Idioma desde el <head> para que no se vea el otro idioma por un instante (misma regla que main.js y services.js)
(function(){var r=document.documentElement,l=/^en/i.test(navigator.language||'')?'en':'es';try{var s=localStorage.getItem('ug-lang');if(s==='es'||s==='en')l=s;}catch(e){}r.dataset.lang=l;r.lang=l;})();

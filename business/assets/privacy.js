(() => {
  const names={en:'EN · English',zh:'中文 · 简体','zh-tw':'繁體中文',km:'ខ្មែរ · Khmer',ja:'日本語',ko:'한국어',th:'ไทย · Thai',vi:'Tiếng Việt',id:'Bahasa Indonesia',fr:'Français',es:'Español',de:'Deutsch'};
  const picker=document.querySelector('.lang'),label=picker.querySelector('summary'),menu=picker.querySelector('.langmenu');
  function apply(code){const lang=names[code]?code:'en';document.documentElement.lang=lang;label.textContent=names[lang];try{localStorage.setItem('legmao-language',lang)}catch{}document.title=window.LEGMAOSiteCopy[lang].privacy+' — LEGMAO';}
  for(const [code,name] of Object.entries(names)){const a=document.createElement('a');a.href='?lang='+code;a.dataset.lang=code;a.textContent=name;menu.append(a)}
  menu.addEventListener('click',e=>{const a=e.target.closest('[data-lang]');if(!a)return;e.preventDefault();history.replaceState(null,'','?lang='+a.dataset.lang);apply(a.dataset.lang);picker.open=false});
  const toggle=document.querySelector('.menuToggle');toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('.navlinks').classList.toggle('is-open',open)});
  let stored='en';try{stored=localStorage.getItem('legmao-language')||'en'}catch{}
  apply(new URLSearchParams(location.search).get('lang')||stored);
})();

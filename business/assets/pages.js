(() => {
  'use strict';
  const data = window.LEGMAO_PAGE_DATA;
  if (!data) return;
  const names = {en:'EN · English',zh:'中文 · 简体','zh-tw':'繁體中文',km:'ខ្មែរ · Khmer',ja:'日本語',ko:'한국어',th:'ไทย · Thai',vi:'Tiếng Việt',id:'Bahasa Indonesia',fr:'Français',es:'Español',de:'Deutsch'};
  const extra = {
    en:{skipLabel:'Skip to content',footerBrand:'LEGMAO — THE BUSINESS CHALLENGER',illustrativeLabel:'ILLUSTRATIVE EXAMPLE'},
    zh:{skipLabel:'跳转到正文',footerBrand:'LEGMAO — 商业挑战者',illustrativeLabel:'示意案例'},
    'zh-tw':{skipLabel:'跳至正文',footerBrand:'LEGMAO — 商業挑戰者',illustrativeLabel:'示意案例'},
    km:{skipLabel:'រំលងទៅខ្លឹមសារ',footerBrand:'LEGMAO — អ្នកប្រកួតប្រជែងអាជីវកម្ម',illustrativeLabel:'ឧទាហរណ៍សម្រាប់បង្ហាញ'},
    ja:{skipLabel:'本文へ移動',footerBrand:'LEGMAO — ビジネス・チャレンジャー',illustrativeLabel:'説明用の例'},
    ko:{skipLabel:'본문으로 건너뛰기',footerBrand:'LEGMAO — 비즈니스 챌린저',illustrativeLabel:'예시 시나리오'},
    th:{skipLabel:'ข้ามไปยังเนื้อหา',footerBrand:'LEGMAO — ผู้ท้าทายธุรกิจ',illustrativeLabel:'ตัวอย่างประกอบ'},
    vi:{skipLabel:'Chuyển đến nội dung',footerBrand:'LEGMAO — NGƯỜI THÁCH THỨC DOANH NGHIỆP',illustrativeLabel:'VÍ DỤ MINH HỌA'},
    id:{skipLabel:'Lewati ke konten',footerBrand:'LEGMAO — BUSINESS CHALLENGER',illustrativeLabel:'CONTOH ILUSTRATIF'},
    fr:{skipLabel:'Aller au contenu',footerBrand:'LEGMAO — LE CHALLENGER DES ENTREPRISES',illustrativeLabel:'EXEMPLE ILLUSTRATIF'},
    es:{skipLabel:'Ir al contenido',footerBrand:'LEGMAO — EL RETADOR EMPRESARIAL',illustrativeLabel:'EJEMPLO ILUSTRATIVO'},
    de:{skipLabel:'Zum Inhalt springen',footerBrand:'LEGMAO — DER BUSINESS CHALLENGER',illustrativeLabel:'ILLUSTRATIVES BEISPIEL'}
  };
  const page = document.body.dataset.page;
  const langMenu = document.getElementById('pageLangMenu');
  const langLabel = document.getElementById('pageLangLabel');
  const picker = document.getElementById('pageLang');
  const nav = document.getElementById('pageNav');
  const menuButton = document.getElementById('pageMenuToggle');
  const pageNames = {solutions:'navPlatform',industries:'navIndustries',cases:'navIntelligence',company:'navCompany'};
  const pageLabel = pageNames[page] || 'navPlatform';
  const languageOptions = Object.entries(names);
  const key = 'legmao-language';
  let stored='en'; try{stored=localStorage.getItem(key)||'en';}catch{}
  let lang = new URLSearchParams(location.search).get('lang') || stored || 'en';
  if (!data.dictionary[lang]) lang = 'en';

  const closeMenu = () => { if (!menuButton || !nav) return; menuButton.setAttribute('aria-expanded','false'); nav.classList.remove('is-open'); };
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded',String(open)); nav.classList.toggle('is-open',open);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menuButton.focus(); } });
    window.addEventListener('resize', () => { if (innerWidth > 560) closeMenu(); });
  }
  langMenu.innerHTML = languageOptions.map(([code,label]) => `<a href="?lang=${encodeURIComponent(code)}" data-lang="${code}">${label}</a>`).join('');
  const renderPage = copy => {
    if (page === 'solutions') {
      document.getElementById('solutionsGrid').innerHTML = Array.from({length:6},(_,index) => {
        const n=index+1; return `<article class="pageCard"><span>0${n}</span><h2>${copy[`cap${n}Title`]}</h2><p>${copy[`cap${n}Copy`]}</p></article>`;
      }).join('');
    } else if (page === 'industries') {
      const source=data.industryI18n[lang]||data.industryI18n.en;
      document.getElementById('industryPageGrid').innerHTML=source.industries.map((industry,index)=>`<article class="industryPageCard"><span>0${index+1}</span><h2>${industry}</h2><p>${source.desc[index]}</p></article>`).join('');
    } else if (page === 'cases') {
      const pairs=[['scenarioSales','scenarioSalesCopy'],['scenarioOps','scenarioOpsCopy'],['scenarioManage','scenarioManageCopy'],['scenarioDecision','scenarioDecisionCopy']];
      document.getElementById('exampleGrid').innerHTML=pairs.map(([title,body],index)=>`<article class="exampleCard"><span class="exampleNumber">0${index+1}</span><span class="exampleLabel">${extra[lang].illustrativeLabel}</span><h2>${copy[title]}</h2><p>${copy[body]}</p></article>`).join('');
    } else if (page === 'company') {
      document.getElementById('principlesGrid').innerHTML=Array.from({length:4},(_,index)=>`<article class="principleCard"><span>0${index+1}</span><h2>${copy[`trust${index+1}Title`]}</h2><p>${copy[`trust${index+1}Copy`]}</p></article>`).join('');
    }
  };
  const applyLanguage = code => {
    lang=data.dictionary[code]?code:'en';
    const copy={...data.businessI18n.en,...(data.businessI18n[lang]||{}),...data.dictionary[lang],...extra[lang]};
    document.documentElement.lang=lang;
    langLabel.textContent=names[lang];
    document.querySelectorAll('[data-i18n]').forEach(node=>{if(copy[node.dataset.i18n])node.innerHTML=copy[node.dataset.i18n];});
    document.querySelectorAll('[data-copy]').forEach(node=>{if(copy[node.dataset.copy])node.innerHTML=copy[node.dataset.copy];});
    langMenu.querySelectorAll('[data-lang]').forEach(node=>{if(node.dataset.lang===lang)node.setAttribute('aria-current','true');else node.removeAttribute('aria-current');});
    document.title=`${copy[pageLabel]||'LEGMAO'} — LEGMAO`;
    const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=copy[page==='solutions'?'capLead':page==='industries'?'industryLead':page==='cases'?'demoLead':'platformLead']||copy.heroLead||'';
    try{localStorage.setItem(key,lang);}catch{}
    renderPage(copy);
  };
  langMenu.addEventListener('click',event=>{
    const link=event.target.closest('[data-lang]'); if(!link)return;
    event.preventDefault(); const code=link.dataset.lang;
    history.replaceState(null,'',code==='en'?location.pathname:`?lang=${encodeURIComponent(code)}`);
    applyLanguage(code); picker.open=false; langLabel.focus();
  });
  document.addEventListener('click',event=>{if(!picker.contains(event.target))picker.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')picker.open=false;});
  document.querySelectorAll('[data-year]').forEach(node=>node.textContent=new Date().getFullYear());
  if (matchMedia('(any-pointer:fine)').matches) {
    const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
    if(dot&&ring){let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;document.addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;document.body.classList.add('cursor-ready');},{passive:true});document.addEventListener('pointerover',e=>{if(e.target.closest('a,button,summary'))document.body.classList.add('cursor-hover');});document.addEventListener('pointerout',e=>{if(e.target.closest('a,button,summary'))document.body.classList.remove('cursor-hover');});const tick=()=>{rx+=(x-rx)*.85;ry+=(y-ry)*.85;dot.style.left=`${x}px`;dot.style.top=`${y}px`;ring.style.left=`${rx}px`;ring.style.top=`${ry}px`;requestAnimationFrame(tick);};tick();}
  }
  applyLanguage(lang);
})();

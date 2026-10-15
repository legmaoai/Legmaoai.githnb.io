(() => {
  const indexHeadings={en:'Start with your business.<br>Explore what comes next.',zh:'从业务出发，<br>探索下一种可能。','zh-tw':'從業務出發，<br>探索下一種可能。',km:'ចាប់ផ្តើមពីអាជីវកម្មរបស់អ្នក។<br>ស្វែងរកជំហានបន្ទាប់។',ja:'ビジネスを起点に。<br>次の可能性へ。',ko:'비즈니스에서 시작해<br>다음 가능성을 탐색하세요.',th:'เริ่มจากธุรกิจของคุณ<br>ค้นหาความเป็นไปได้ถัดไป',vi:'Bắt đầu từ doanh nghiệp.<br>Khám phá bước tiếp theo.',id:'Mulai dari bisnis Anda.<br>Jelajahi langkah berikutnya.',fr:'Partir de votre activité.<br>Explorer la suite.',es:'Empieza por tu negocio.<br>Explora lo que sigue.',de:'Ihr Geschäft als Ausgangspunkt.<br>Entdecken Sie den nächsten Schritt.'};
  const titles={en:{home:'Home',navPlatform:'Capabilities & platform',navIntelligence:'Work scenarios',navIndustries:'Industry solutions',navCompany:'About LEGMAO'},zh:{home:'首页',navPlatform:'能力与平台',navIntelligence:'工作场景',navIndustries:'行业方案',navCompany:'关于 LEGMAO'},'zh-tw':{home:'首頁',navPlatform:'能力與平台',navIntelligence:'工作情境',navIndustries:'產業方案',navCompany:'關於 LEGMAO'}};
  function sync(){
    const heading=document.querySelector('[data-hub-heading]');
    if(heading)heading.innerHTML=indexHeadings[document.documentElement.lang]||indexHeadings.en;
    const copy=titles[document.documentElement.lang];
    if(copy){document.querySelectorAll('.navlinks [data-i18n],.hubCard h2[data-i18n],.pageTrail [data-i18n]').forEach(el=>{if(copy[el.dataset.i18n])el.textContent=copy[el.dataset.i18n]});document.querySelectorAll('[data-hub-home]').forEach(el=>el.textContent=copy.home)}
    const key=document.body.dataset.pageTitle;
    if(key){const title=document.querySelector('.pageTrail [data-i18n]')?.textContent;document.title=(title||copy?.[key]||'LEGMAO')+' — LEGMAO';}
    document.querySelectorAll('.navlinks a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  }
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});sync();
  // Preserve old bookmarked homepage sections with their corresponding detail pages.
  if(location.pathname==='/'||location.pathname==='/index.html'){
    const redirects={'#platform':'/capabilities.html','#intelligence':'/workflows.html','#industries':'/sectors.html'};
    if(redirects[location.hash])location.replace(redirects[location.hash]+location.search+location.hash);
  }
})();

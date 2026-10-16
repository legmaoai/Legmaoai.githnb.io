/* Consistent shared labels for the existing twelve language codes. */
(() => {
 const rows={
 en:['Home','Capabilities & platform','Work scenarios','Industry solutions','About LEGMAO','Explore','Index','Capabilities','Applications','Industries','Our approach'],
 zh:['首页','能力与平台','工作场景','行业方案','关于 LEGMAO','探索','目录','能力','应用场景','行业','我们的方法'],
 'zh-tw':['首頁','能力與平台','工作情境','產業方案','關於 LEGMAO','探索','目錄','能力','應用情境','產業','我們的方法'],
 km:['ទំព័រដើម','សមត្ថភាព និងវេទិកា','សេណារីយ៉ូការងារ','ដំណោះស្រាយតាមវិស័យ','អំពី LEGMAO','ស្វែងយល់','បញ្ជី','សមត្ថភាព','ការអនុវត្ត','វិស័យ','វិធីសាស្ត្ររបស់យើង'],
 ja:['ホーム','機能とプラットフォーム','業務シナリオ','業界別ソリューション','LEGMAOについて','詳しく見る','目次','機能','活用シーン','業界','私たちの考え方'],
 ko:['홈','기능과 플랫폼','업무 시나리오','산업별 솔루션','LEGMAO 소개','둘러보기','목차','기능','활용 사례','산업','접근 방식'],
 th:['หน้าแรก','ความสามารถและแพลตฟอร์ม','สถานการณ์การทำงาน','โซลูชันตามอุตสาหกรรม','เกี่ยวกับ LEGMAO','สำรวจ','สารบัญ','ความสามารถ','การประยุกต์ใช้','อุตสาหกรรม','แนวทางของเรา'],
 vi:['Trang chủ','Năng lực và nền tảng','Tình huống công việc','Giải pháp theo ngành','Về LEGMAO','Khám phá','Mục lục','Năng lực','Ứng dụng','Ngành nghề','Cách tiếp cận'],
 id:['Beranda','Kemampuan dan platform','Skenario kerja','Solusi industri','Tentang LEGMAO','Jelajahi','Daftar isi','Kemampuan','Penerapan','Industri','Pendekatan kami'],
 fr:['Accueil','Capacités et plateforme','Situations de travail','Solutions sectorielles','À propos de LEGMAO','Explorer','Sommaire','Capacités','Applications','Secteurs','Notre approche'],
 es:['Inicio','Capacidades y plataforma','Escenarios de trabajo','Soluciones por sector','Acerca de LEGMAO','Explorar','Índice','Capacidades','Aplicaciones','Sectores','Nuestro enfoque'],
 de:['Startseite','Funktionen und Plattform','Arbeitsszenarien','Branchenlösungen','Über LEGMAO','Entdecken','Übersicht','Funktionen','Anwendungen','Branchen','Unser Ansatz']};
 const overrides={th:{cap1Title:'ข้อมูลเชิงลึกเกี่ยวกับลูกค้า',cap3Title:'ข้อมูลเชิงลึกเกี่ยวกับโอกาสทางธุรกิจ'},id:{cap1Title:'Wawasan pelanggan',cap3Title:'Wawasan peluang bisnis'}};
 const routes={'/':0,'/index.html':0,'/capabilities.html':1,'/workflows.html':2,'/sectors.html':3,'/business/company.html':4};
 function sync(){
  const lang=rows[document.documentElement.lang]?document.documentElement.lang:'en',c=rows[lang];
  document.querySelectorAll('.navlinks a,.footerlinks a,.hubCard h2[data-i18n]').forEach(node=>{
   const link=node.tagName==='A'?node:node.closest('a');if(!link)return;
   const key=routes[new URL(link.href,location.href).pathname];if(key!==undefined)node.textContent=c[key];
  });
  const trail=document.querySelector('.pageTrail [data-i18n]'),key=routes[location.pathname];
  if(trail&&key!==undefined)trail.textContent=c[key];
  if((document.body.dataset.pageTitle||location.pathname==='/business/company.html')&&key!==undefined)document.title=c[key]+' — LEGMAO';
  document.querySelectorAll('[data-hub-home]').forEach(e=>e.textContent=c[0]);
  document.querySelectorAll('.hubEyebrow').forEach(e=>e.textContent='LEGMAO / '+c[5]);
  document.querySelectorAll('.hubIndex').forEach(e=>e.textContent=c[6]+' 01 — 04');
  document.querySelectorAll('.hubCategory').forEach((e,i)=>e.textContent=c[7+i]);
  for(const [k,v]of Object.entries(overrides[lang]||{}))document.querySelectorAll('[data-i18n="'+k+'"]').forEach(e=>e.textContent=v);
  const steps=document.querySelector('.challengePath');if(steps)steps.setAttribute('aria-label',steps.textContent.trim().replace(/\s+/g,' '));
  const frame=document.querySelector('#glassFrame');if(frame)frame.title='LEGMAO — '+c[0];
  document.querySelector('.intelligenceFieldVisual')?.setAttribute('aria-label','LEGMAO — '+c[1]);
  document.querySelectorAll('.logo').forEach(e=>e.setAttribute('aria-label','LEGMAO — '+c[0]));
  const meta=document.querySelector('meta[name="description"]');
  const lead=document.querySelector('.fieldCopy .lead,.sectionHead .lead,.challengeLead');
  if(meta&&lead)meta.content=lead.textContent.trim();
  else if(meta&&document.body.classList.contains('homeEditorial'))meta.content=(window.LEGMAOSiteCopy?.[lang]?.brand||'LEGMAO')+' — '+document.querySelector('[data-hub-heading]').textContent.trim();
  // Include language in local page links so sharing does not depend on browser storage.
  document.querySelectorAll('a[href]').forEach(link=>{
   if(link.hasAttribute('data-lang')||link.closest('.langmenu'))return;
   const url=new URL(link.getAttribute('href'),location.href);
   if(url.origin!==location.origin||!['http:','https:'].includes(url.protocol)||(!url.pathname.endsWith('.html')&&url.pathname!=='/'))return;
   if(url.pathname===location.pathname&&url.hash)return;
   url.searchParams.set('lang',lang);link.setAttribute('href',url.pathname+url.search+url.hash);
  });
 }
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});sync();
})();

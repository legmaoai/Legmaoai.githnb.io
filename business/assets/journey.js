(() => {
  'use strict';
  const serviceKeys=['content','replies','operations'];
  const query=new URLSearchParams(location.search);
  const form=document.getElementById('business-challenge-form');
  function copy(){return window.LEGMAOJourneyCopy[document.documentElement.lang]||window.LEGMAOJourneyCopy.en;}
  function option(value,label){const el=document.createElement('option');el.value=value;el.textContent=label;return el;}
  function sync(){
    const c=copy(),names=window.LEGMAOIndustryNames[document.documentElement.lang]||window.LEGMAOIndustryNames.en;
    const services=document.querySelector('[data-journey-services]');
    if(services){
      services.replaceChildren();
      const h=document.createElement('h2');h.textContent=c[0];
      const intro=document.createElement('p');intro.className='lead';intro.textContent=c[1];services.append(h,intro);
      serviceKeys.forEach((key,i)=>{
        const row=document.createElement('article');row.className='journeyService';
        const n=document.createElement('span');n.className='journeyNo';n.textContent='0'+(i+1);
        const title=document.createElement('h3');title.textContent=c[2+i*2];
        const p=document.createElement('p');p.textContent=c[3+i*2];
        const a=document.createElement('a');a.textContent=c[8]+' ↗';
        const url=new URL('/business/challenge.html',location.origin);url.searchParams.set('service',key);url.searchParams.set('lang',document.documentElement.lang);a.href=url.pathname+url.search;
        row.append(n,title,p,a);services.append(row);
      });
    }
    if(form){
      for(const [field,labels] of [['industry',names.map((label,i)=>[String(i),label])],['service',serviceKeys.map((key,i)=>[key,c[2+i*2]])]]){
        const select=form.elements[field],current=select.dataset.initialized?select.value:query.get(field);
        select.replaceChildren(option('',c[11]),...labels.map(([key,label])=>option(key,label)));
        select.value=labels.some(([key])=>key===current)?current:'';select.dataset.initialized='true';
      }
      document.querySelector('[data-journey-label="industry"]').textContent=c[9];
      document.querySelector('[data-journey-label="service"]').textContent=c[10];
      document.querySelector('[data-journey-next-title]').textContent=c[12];
      document.querySelector('[data-journey-next-copy]').textContent=c[13];
    }
    syncIndustryLink();
  }
  function syncIndustryLink(){
    const a=document.querySelector('.industryCTA'),selected=document.querySelector('[data-industry][aria-selected="true"]'),need=document.querySelector('[data-need][aria-pressed="true"]');
    if(!a||!selected)return;
    const url=new URL('/business/challenge.html',location.origin);
    url.searchParams.set('industry',selected.dataset.industry);url.searchParams.set('lang',document.documentElement.lang);
    if(need)url.searchParams.set('need',need.dataset.need);
    a.href=url.pathname+url.search;
    document.querySelectorAll('.journeyService a').forEach(link=>{
      const serviceUrl=new URL(link.href);
      serviceUrl.searchParams.set('industry',selected.dataset.industry);
      if(need)serviceUrl.searchParams.set('need',need.dataset.need);else serviceUrl.searchParams.delete('need');
      link.href=serviceUrl.pathname+serviceUrl.search;
    });
  }
  sync();
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  const selector=document.querySelector('.industrySelector');
  if(selector)selector.addEventListener('click',syncIndustryLink);
  if(selector)selector.addEventListener('keyup',syncIndustryLink);
})();

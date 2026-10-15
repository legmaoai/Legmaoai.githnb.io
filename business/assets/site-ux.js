/* Localised additions; observing language only prevents mutation feedback loops. */
(() => {
  'use strict';
  const table = window.LEGMAOSiteCopy;
  const button = document.querySelector('.menuToggle');
  function sync() {
    const copy = table[document.documentElement.lang] || table.en;
    if (button) button.setAttribute('aria-label', button.getAttribute('aria-expanded') === 'true' ? copy.close : copy.open);
    document.querySelector('.nav')?.setAttribute('aria-label', copy.nav);
    document.querySelectorAll('.lang summary,.mobileLanguage').forEach(node => node.setAttribute('aria-label', copy.language));
    const skip = document.querySelector('.skip,.skipLink');
    if (skip) skip.textContent = copy.skip;
    document.querySelectorAll('[data-site-copy]').forEach(node => { if (copy[node.dataset.siteCopy]) node.textContent = copy[node.dataset.siteCopy]; });
    document.querySelector('.nextAction label')?.replaceChildren(document.createTextNode(copy.next));
    const brand=document.querySelector('.footer [data-i18n="footerBrand"]');if(brand)brand.textContent=copy.brand;
    document.querySelectorAll('.processMini>span').forEach((node,i)=>{node.textContent=copy.flow.split('|')[i]});
    document.querySelectorAll('.workScenarios .kicker>span').forEach(node=>{node.textContent=copy.atWork});
  }
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (button) new MutationObserver(sync).observe(button, { attributes: true, attributeFilter: ['aria-expanded'] });
  sync();
})();

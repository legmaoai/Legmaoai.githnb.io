/* Native language selection for touch browsers; existing page translators remain authoritative. */
(() => {
  'use strict';
  const picker = document.querySelector('.nav .lang');
  if (!picker) return;
  const links = [...picker.querySelectorAll('[data-lang]')];
  if (!links.length) return;
  const select = document.createElement('select');
  select.className = 'mobileLanguage';
  select.setAttribute('aria-label', 'Language / 语言');
  links.forEach(link => {
    const option = document.createElement('option');
    option.value = link.dataset.lang;
    option.textContent = link.textContent.trim();
    select.append(option);
  });
  picker.before(select);
  picker.parentElement.classList.add('mobile-language-ready');
  const closeNav = (restoreFocus = false) => {
    const button = document.querySelector('.menuToggle');
    if (button?.getAttribute('aria-expanded') === 'true') {button.click();if(restoreFocus)button.focus();}
  };
  const sync = () => {
    select.value = document.documentElement.lang;
    select.setAttribute('lang', document.documentElement.lang);
  };
  select.addEventListener('change', () => {
    const link = links.find(item => item.dataset.lang === select.value);
    if (link) link.click();
    picker.open = false;
    closeNav();
    sync();
  });
  document.querySelector('.menuToggle')?.addEventListener('click', () => { picker.open = false; });
  picker.querySelector('summary')?.addEventListener('click', () => {
    closeNav();
  });
  select.addEventListener('pointerdown', closeNav);
  document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeNav(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(true); });
  new MutationObserver(sync).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  sync();
})();

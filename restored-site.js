(() => {
  const frame=document.getElementById('glassFrame'),button=document.getElementById('siteMotion');
  if(!frame)return;
  const labels={en:['Enable animation','Pause animation'],zh:['启用动画','暂停动画'],'zh-tw':['啟用動畫','暫停動畫'],km:['បើកចលនា','ផ្អាកចលនា'],ja:['アニメーションを有効にする','アニメーションを一時停止'],ko:['애니메이션 켜기','애니메이션 일시 정지'],th:['เปิดภาพเคลื่อนไหว','พักภาพเคลื่อนไหว'],vi:['Bật chuyển động','Tạm dừng chuyển động'],id:['Aktifkan animasi','Jeda animasi'],fr:['Activer les animations','Mettre en pause'],es:['Activar animación','Pausar animación'],de:['Animation aktivieren','Animation pausieren']};
  let state={available:false,enabled:false},visible=false;
  function syncButton(){if(!button)return;const text=labels[document.documentElement.lang]||labels.en;button.textContent=text[state.enabled?1:0];button.disabled=!state.available;button.setAttribute('aria-pressed',String(state.enabled));}
  button?.addEventListener('click',()=>frame.contentWindow?.postMessage({type:'legmao-motion'},location.origin));
  const params=new URLSearchParams(location.search),childParams=new URLSearchParams();
  for(const key of ['qa','physical','no-webgl','motion'])if(params.has(key))childParams.set(key,params.get(key)||'');
  if(childParams.size)frame.src='glass.html?'+childParams;
  const sendVisibility=()=>frame.contentWindow?.postMessage({type:'legmao-visibility',visible:visible&&!document.hidden},location.origin);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sendVisibility();},{threshold:0}).observe(frame);
  document.addEventListener('visibilitychange',sendVisibility);frame.addEventListener('load',sendVisibility);
  const sync=()=>{const lang=document.documentElement.lang,copy=window.LEGMAOSiteCopy?.[lang]||window.LEGMAOSiteCopy?.en;document.title=copy?.brand||'LEGMAO — THE BUSINESS CHALLENGER';frame.contentWindow?.postMessage({type:'legmao-language',lang},location.origin);syncButton();};
  frame.addEventListener('load',sync);sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  addEventListener('message',e=>{
    if(e.origin!==location.origin||e.source!==frame.contentWindow||!['legmao-glass-state','legmao-pointer'].includes(e.data?.type))return;
    if(e.data.type==='legmao-pointer'){const r=frame.getBoundingClientRect();window.dispatchEvent(new PointerEvent('pointermove',{clientX:r.left+e.data.x,clientY:r.top+e.data.y,pointerType:'mouse'}));return;}
    state={available:Boolean(e.data.available),enabled:Boolean(e.data.enabled)};syncButton();sendVisibility();
    if(Number.isFinite(e.data.height))frame.style.height=Math.ceil(e.data.height+48)+'px';
  });
})();

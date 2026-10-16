(() => {
  const frame=document.getElementById('glassFrame');
  if(!frame)return;
  let visible=false;
  const params=new URLSearchParams(location.search),childParams=new URLSearchParams();
  for(const key of ['qa','physical','no-webgl'])if(params.has(key))childParams.set(key,params.get(key)||'');
  if(childParams.size)frame.src='glass.html?'+childParams;
  const sendVisibility=()=>frame.contentWindow?.postMessage({type:'legmao-visibility',visible:visible&&!document.hidden},location.origin);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sendVisibility();},{threshold:0}).observe(frame);
  document.addEventListener('visibilitychange',sendVisibility);frame.addEventListener('load',sendVisibility);
  const sync=()=>{const lang=document.documentElement.lang,copy=window.LEGMAOSiteCopy?.[lang]||window.LEGMAOSiteCopy?.en;document.title=copy?.brand||'LEGMAO — THE BUSINESS CHALLENGER';frame.contentWindow?.postMessage({type:'legmao-language',lang},location.origin);};
  frame.addEventListener('load',sync);sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  addEventListener('message',e=>{
    if(e.origin!==location.origin||e.source!==frame.contentWindow||!['legmao-glass-state','legmao-pointer'].includes(e.data?.type))return;
    if(e.data.type==='legmao-pointer'){const r=frame.getBoundingClientRect();window.dispatchEvent(new PointerEvent('pointermove',{clientX:r.left+e.data.x,clientY:r.top+e.data.y,pointerType:'mouse'}));return;}
    sendVisibility();
    if(Number.isFinite(e.data.height))frame.style.height=Math.ceil(e.data.height+48)+'px';
  });
})();

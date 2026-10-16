(() => {
  const frame=document.getElementById('glassFrame');
  if(!frame)return;
  // Opening the homepage starts at its hero, not a restored position from an old preview.
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  if(!location.hash||['#top','#platform','#intelligence','#industries'].includes(location.hash)){
    const showHome=()=>scrollTo({top:0,left:0,behavior:'instant'});
    showHome();addEventListener('load',showHome,{once:true});addEventListener('pageshow',showHome,{once:true});
  }
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
    if(Number.isFinite(e.data.height)&&e.data.height>0)frame.style.height=Math.ceil(Math.max(320,Math.min(1400,e.data.height+48)))+'px';
  });
})();

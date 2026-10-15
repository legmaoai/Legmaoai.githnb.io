import {businessCopy} from './config/businessCopy.js';
import {advanceMotion} from './three/MotionController.js';
import {contentPose} from './three/contentProjection.js';
import {installQA} from './qa.js';
import {panels,roundedPath} from './config/panelGeometry.js';
import {motionConfig as cfg} from './config/motionConfig.js';
const physicalMode=new URLSearchParams(location.search).has('physical');
const {createScene,poses}=await import(physicalMode?'./three/PhysicalScene.js':'./three/GlassScene.js');
document.body.classList.toggle('physical-phase',physicalMode);
const svg=document.querySelector('.glass'),hero=document.querySelector('.hero'),assembly=document.querySelector('.assembly');
const ns='http://www.w3.org/2000/svg';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const qaMode=new URLSearchParams(location.search).has('qa');let motionPreview=false,motionPaused=false;
// Explicit per-browser choice; system preference remains the default for other visitors.
try{const choice=new URLSearchParams(location.search).get('motion');if(choice==='on'||choice==='off')localStorage.setItem('legmao-motion-choice',choice);if(choice==='system')localStorage.removeItem('legmao-motion-choice');const stored=localStorage.getItem('legmao-motion-choice');motionPreview=stored==='on';motionPaused=stored==='off'}catch{}


const reduceMotion=()=>motionPaused||(reduced.matches&&!motionPreview);
const compactStatic=()=>false;
let mobile=compactStatic(),scene=null,generation=0,qaInputLock=false;
const mobilePanels=[[[2.5,2.5],[720,2.5],[995,145],[995,447.5],[2.5,447.5]],[[730,2.5],[997.5,2.5],[997.5,135]]];
let groups=[],target={x:0,y:0,active:0},state={x:0,y:0,vx:0,vy:0,active:0};let last=0,raf=0;let pointerActive=false;let frameVisible=parent===window;let animationFrames=0;
const canvas=document.createElement('canvas');canvas.className='glass-scene';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
const titleBacking=document.createElement('canvas');titleBacking.className='title-backing';titleBacking.setAttribute('aria-hidden','true');hero.prepend(titleBacking);
assembly.removeAttribute('aria-hidden');assembly.append(document.querySelector('.hero-content'),document.querySelector('.hero-foot'));
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();scene?.dispose();scene=null;document.body.classList.remove('optical-title');document.body.dataset.contextLosses=String(Number(document.body.dataset.contextLosses||0)+1);canvas.hidden=true;svg.style.opacity='1';document.body.dataset.renderer='static-context-lost';target={x:0,y:0,active:0};state={x:0,y:0,vx:0,vy:0,active:0};cancelAnimationFrame(raf);raf=0;last=0;draw()});
canvas.addEventListener('webglcontextrestored',()=>{document.body.dataset.contextRestores=String(Number(document.body.dataset.contextRestores||0)+1);setup()});
async function setup(){document.body.classList.toggle('compact-desktop',innerWidth<768);refreshMotionButton();const revision=++generation;scene?.dispose();scene=null;if(mobile){canvas.width=1;canvas.height=1;}svg.style.opacity='1';canvas.hidden=true;svg.querySelectorAll('.pane').forEach(p=>p.remove());groups=[];
 svg.setAttribute('preserveAspectRatio',mobile?'none':'xMidYMid meet');const shapes=mobile?mobilePanels:panels;
 shapes.forEach(poly=>{const g=document.createElementNS(ns,'g');g.setAttribute('class','pane');const path=roundedPath(poly,mobile?13:10);for(const cls of ['base','bevel','rim']){const p=document.createElementNS(ns,'path');p.setAttribute('d',path);p.setAttribute('class',cls);g.append(p)}svg.append(g);groups.push(g)});
 if(!mobile&&!new URLSearchParams(location.search).has('no-webgl'))try{const next=await createScene(canvas,shapes,mobile);if(revision!==generation){next.dispose();return}scene=next;canvas.hidden=false;svg.style.opacity='0';document.body.dataset.renderer='webgl-mesh'}catch(e){console.warn('Static glass fallback:',e.message);document.body.dataset.renderer='static'}else document.body.dataset.renderer='static';refreshMotionButton();resize();draw();wake();embeddedState();
}
function updateTitle(){

 const title=document.querySelector('#hero-title'),content=document.querySelector('.hero-content');
 if(innerWidth<768){const foot=document.querySelector('.hero-foot');hero.style.height=Math.ceil(Math.max(400,hero.clientWidth*.85,32+content.offsetHeight+foot.offsetHeight+48))+'px'}else hero.style.height='';
 title.style.fontSize='';const initial=getComputedStyle(title),measure=document.createElement('canvas').getContext('2d');measure.font=initial.fontWeight+' '+initial.fontSize+' '+initial.fontFamily;if('letterSpacing'in measure)measure.letterSpacing=initial.letterSpacing;const widest=Math.max(...title.innerText.split(/\n/).filter(Boolean).map(line=>measure.measureText(line).width));if(widest>title.clientWidth)title.style.fontSize=(parseFloat(initial.fontSize)*title.clientWidth/widest*.98)+'px';
 if(!scene||mobile){document.body.classList.remove('optical-title');titleBacking.width=1;titleBacking.height=1;return}
 const texture=document.createElement('canvas');texture.width=Math.min(4096,Math.max(2000,Math.ceil(hero.clientWidth*Math.min(devicePixelRatio||1,2))));texture.height=Math.round(texture.width*.45);const ctx=texture.getContext('2d');
 const style=getComputedStyle(title),scale=texture.width/hero.clientWidth;
 if(physicalMode){ctx.fillStyle='#0a0a0c';ctx.fillRect(0,0,texture.width,texture.height)}
 ctx.scale(scale,scale*hero.clientWidth*.45/hero.clientHeight);ctx.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;ctx.textBaseline='top';ctx.fillStyle=style.color;
 if('letterSpacing' in ctx)ctx.letterSpacing=style.letterSpacing;
 const x=content.offsetLeft+title.offsetLeft,y=content.offsetTop+title.offsetTop,font=parseFloat(style.fontSize),line=parseFloat(style.lineHeight);
 title.innerText.split(/\n/).filter(Boolean).forEach((text,i)=>ctx.fillText(text,x,y+i*line-font*.10));
 for(const element of [content.querySelector('.eyebrow'),content.querySelector('.description')]){
  const textStyle=getComputedStyle(element),textFont=parseFloat(textStyle.fontSize),textLine=parseFloat(textStyle.lineHeight)||textFont*1.2;
  ctx.font=`${textStyle.fontWeight} ${textStyle.fontSize} ${textStyle.fontFamily}`;ctx.fillStyle=textStyle.color;if('letterSpacing' in ctx)ctx.letterSpacing=textStyle.letterSpacing==='normal'?'0px':textStyle.letterSpacing;
  let row=0;for(const paragraph of element.innerText.split(/\n/)){let current='';const spaced=/\s/.test(paragraph),tokens=spaced?paragraph.split(/\s+/):Array.from(paragraph);for(const word of tokens){const next=current?current+(spaced?' ':'')+word:word;if(current&&ctx.measureText(next).width>element.clientWidth){ctx.fillText(current,content.offsetLeft+element.offsetLeft,content.offsetTop+element.offsetTop+row++*textLine-textFont*.1);current=word}else current=next}ctx.fillText(current,content.offsetLeft+element.offsetLeft,content.offsetTop+element.offsetTop+row++*textLine-textFont*.1)}
 }
 titleBacking.width=texture.width;titleBacking.height=texture.height;titleBacking.getContext('2d').drawImage(texture,0,0);scene.updateTitle(texture);document.body.classList.add('optical-title');
}
document.fonts.ready.then(()=>{updateTitle();draw()});
function resize(){const r=hero.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,cfg.maxDpr);scene?.resize(r.width,r.height,dpr);updateTitle();hero.style.perspective=String(cfg.cameraDistance*r.width/1000)+'px';draw()}
function draw(){
 // Geometry, visible lettering and action targets use the same frame transform.
 assembly.style.transform='none';
 const matrices=mobile?null:(scene?.poses?.(state)||poses(state)),content=document.querySelector('.hero-content'),header=document.querySelector('.header');
 if(mobile){content.style.transform='none';titleBacking.style.transform='none';header.style.transform='none'}else{
  const matrix=contentPose(state,matrices),scale=hero.clientWidth/1000;
  for(const i of [1,4,6,9,13])matrix[i]*=-1;for(const i of [12,13,14])matrix[i]*=scale;
  const css='matrix3d('+matrix.join(',')+')';
  content.style.transformOrigin=(hero.clientWidth/2-content.offsetLeft)+'px '+(hero.clientHeight/2-content.offsetTop)+'px';
  content.style.transform=css;titleBacking.style.transformOrigin='50% 50%';titleBacking.style.transform=css;
  const shellTop=document.querySelector('.shell').getBoundingClientRect().top;
  const maxAngle=Math.min(2.5,Math.atan(Math.max(0,shellTop-8)/header.clientWidth)*180/Math.PI);
  const angle=Math.max(-maxAngle,Math.min(maxAngle,state.x*cfg.headerRotateZ));
  const drop=Math.sin(Math.abs(angle)*Math.PI/180)*header.clientWidth/2;
  header.style.transform=`translateY(${-drop}px) perspective(2000px) rotateZ(${angle}deg) rotateY(${state.x*cfg.headerRotateY}deg)`;
 }
 scene?.draw(state,matrices);
 const metric=document.querySelector('#qa-metrics');
 if(metric){const gpu=scene?.gpuSamples||[],heap=performance.memory?.usedJSHeapSize;const median=gpu.length?[...gpu].sort((a,b)=>a-b)[Math.floor(gpu.length/2)].toFixed(2):'unavailable';metric.dataset.gpuMedianMs=median;metric.dataset.gpuSamples=String(gpu.length);metric.dataset.heapMb=heap?(heap/1048576).toFixed(2):'unavailable';metric.dataset.contexts=String(scene?1:0);metric.dataset.renderer=scene?.renderer||'static';metric.dataset.resources=String(scene?.resourceCount||0);metric.dataset.pose=JSON.stringify({x:state.x,y:state.y});metric.dataset.settled=String(!scene?.needsAnimation&&Math.abs(state.x-target.x)+Math.abs(state.y-target.y)+Math.abs(state.vx)+Math.abs(state.vy)<cfg.controllerStopThreshold);}
}
function tick(time){if(!frameVisible||document.hidden||reduceMotion()){stopAnimation();return}document.body.dataset.animationFrames=String(++animationFrames);if(!pointerActive&&!qaInputLock){target={x:Math.sin(time*.00045)*.34,y:Math.cos(time*.00035)*.24,active:.65}}advanceMotion(state,target,(time-last)/1000||1/60,cfg);last=time;draw();if((!pointerActive&&!qaInputLock)||scene?.needsAnimation||Math.abs(state.x-target.x)+Math.abs(state.y-target.y)+Math.abs(state.vx)+Math.abs(state.vy)+Math.abs(state.active-target.active)>cfg.controllerStopThreshold){raf=requestAnimationFrame(tick)}else{raf=0;last=0}}
function stopAnimation(){cancelAnimationFrame(raf);raf=0;last=0;document.body.dataset.motionStatus=reduceMotion()?"reduced":(!frameVisible?"offscreen":"hidden")}
function wake(){if(frameVisible&&!document.hidden&&!raf&&!reduceMotion()&&!mobile&&scene){document.body.dataset.motionStatus="animating";raf=requestAnimationFrame(tick)}else if(reduceMotion())document.body.dataset.motionStatus="reduced"}
hero.addEventListener('pointermove',e=>{if(reduceMotion()||mobile||!scene)return;pointerActive=true;qaInputLock=false;const r=hero.getBoundingClientRect();target.x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));target.y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));target.active=1;if(qaMode){const metric=document.querySelector('#qa-metrics');metric.dataset.inputSource='pointer';metric.dataset.lastPointer=JSON.stringify({x:target.x,y:target.y,type:e.pointerType});}wake()});
function reset(){if(qaInputLock)return;pointerActive=false;target={x:0,y:0,active:0};wake()}
hero.addEventListener('pointerleave',reset);hero.addEventListener('pointerup',e=>{if(e.pointerType==='touch')reset()});hero.addEventListener('pointercancel',reset);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0;stopAnimation();reset()}else wake()});
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const next=compactStatic();if(next!==mobile){mobile=next;target={x:0,y:0,active:0};state={x:0,y:0,vx:0,vy:0,active:0};setup()}else{document.body.classList.toggle('compact-desktop',innerWidth<768&&!mobile);refreshMotionButton();resize()}},150)});reduced.addEventListener('change',()=>{refreshMotionButton();if(reduceMotion()){cancelAnimationFrame(raf);raf=0;state={x:0,y:0,vx:0,vy:0,active:0};stopAnimation();draw()}else wake()});
document.querySelector('.menu').addEventListener('click',e=>{const nav=document.querySelector('#mobile-nav');nav.hidden=!nav.hidden;e.currentTarget.setAttribute('aria-expanded',String(!nav.hidden))});
if(qaMode){const controls=document.createElement('div');controls.className='qa-controls';const enable=document.createElement('button');enable.textContent='Enable motion preview';enable.onclick=()=>{motionPaused=false;motionPreview=true;refreshMotionButton();enable.textContent='Motion preview enabled';wake();document.body.classList.add('motion-preview')};controls.append(enable);const replay=document.createElement('button');replay.textContent='Replay interaction';replay.onclick=()=>{motionPaused=false;motionPreview=true;refreshMotionButton();document.body.classList.add('motion-preview');const steps=[[-.9,-.9],[.9,-.9],[0,0],[-.9,.9],[.9,.9],[0,0]];steps.forEach((v,i)=>setTimeout(()=>{target={x:v[0],y:v[1],active:i===5?0:1};wake()},i*1100))};controls.append(replay);const metrics=document.createElement('output');metrics.id='qa-metrics';metrics.textContent='Motion sampling ready';controls.append(metrics);document.body.append(controls);let intervals=[],prev=0;function sample(now){if(prev)intervals.push(now-prev);prev=now;if(intervals.length>180)intervals.shift();if(intervals.length===180){const sorted=[...intervals].sort((a,b)=>a-b);metrics.textContent=`RAF ${Math.round(1000/(intervals.reduce((a,b)=>a+b,0)/180))} fps / p95 ${sorted[171].toFixed(1)} ms · GPU ${metrics.dataset.gpuMedianMs || 'unavailable'} ms · heap ${metrics.dataset.heapMb || 'unavailable'} MB · ${scene ? 1 : 0} context`}requestAnimationFrame(sample)}requestAnimationFrame(sample)}
document.addEventListener('keydown',e=>{const nav=document.querySelector('#mobile-nav');if(e.key==='Escape'&&!nav.hidden){nav.hidden=true;const menu=document.querySelector('.menu');menu.setAttribute('aria-expanded','false');menu.focus();e.preventDefault()}});
if(qaMode)installQA({getScene:()=>scene,setTarget:(x,y,active=1)=>{qaInputLock=Boolean(active);target={x,y,active};document.querySelector('#qa-metrics').dataset.settled='false';wake()},enable:()=>{motionPaused=false;motionPreview=true;refreshMotionButton();document.body.classList.add('motion-preview')},draw});
let language='en';try{language=new URLSearchParams(location.search).get('lang')||localStorage.getItem('legmao-language')||'en'}catch{}
const translations=businessCopy;if(!translations[language])language="en";
function setLinkText(element,text){if(!element)return;const icon=element.querySelector('span');element.replaceChildren(document.createTextNode(text+' '));if(icon)element.append(icon)}
function refreshMotionButton(){const b=document.querySelector('.motion-toggle');if(!b)return;const text=typeof translations==='undefined'?null:translations[language];const enabled=Boolean(scene)&&!mobile&&!reduceMotion();b.textContent=text?(enabled?text.pause:text.enable):(enabled?'Pause motion':'Enable motion');b.setAttribute('aria-pressed',String(enabled));b.hidden=mobile}
function applyLanguage(){const t=translations[language];document.documentElement.lang=language;document.title=language==='zh'?'挑战你的业务 — LEGMAO AI':'Challenge Your Business — LEGMAO AI';
 const keys=['solutions','examples','industries','company','challenge'],files=['solutions.html','case-studies.html','industries.html','company.html','challenge.html'];
 document.querySelectorAll('[data-business]').forEach(a=>{const i=keys.indexOf(a.dataset.business);if(a.classList.contains('contact'))setLinkText(a,t.nav[i]);else a.textContent=t.nav[i];a.href='business/'+files[i]+'?lang='+language});
 setLinkText(document.querySelector('.menu'),t.menu);document.querySelector('.hero-content .eyebrow').textContent=t.eyebrow;
 const h=document.querySelector('#hero-title');h.replaceChildren(document.createTextNode(t.heading[0]),document.createElement('br'),document.createTextNode(t.heading[1]));
 document.querySelector('.description').textContent=t.description;document.querySelectorAll('[data-step]').forEach(s=>s.textContent=t.steps[Number(s.dataset.step)]);
 document.querySelectorAll('.hero-foot span').forEach((s,i)=>{if(i===1){const a=document.createElement('a');a.href='mailto:'+t.foot[i];a.textContent=t.foot[i];s.replaceChildren(a)}else s.textContent=t.foot[i]});document.querySelector('.business-path').setAttribute('aria-label',language==='zh'?'接下来的步骤':'The next steps');
 const b=document.querySelector('.language-toggle');b.textContent=language==='en'?'中文':'EN';b.setAttribute('aria-label',language==='en'?'Switch to Chinese':'切换至英文');refreshMotionButton();document.fonts.ready.then(()=>{updateTitle();draw()});
}
document.querySelector('.language-toggle').addEventListener('click',()=>{language=language==='en'?'zh':'en';try{localStorage.setItem('legmao-language',language)}catch{}applyLanguage()});
document.querySelector('.motion-toggle').addEventListener('click',()=>{const enable=reduceMotion();motionPaused=!enable;motionPreview=enable;try{localStorage.setItem('legmao-motion-choice',enable?'on':'off')}catch{}refreshMotionButton();if(enable)wake();else{cancelAnimationFrame(raf);raf=0;last=0;target={x:0,y:0,active:0};state={x:0,y:0,vx:0,vy:0,active:0};draw()}embeddedState()});
applyLanguage();setup();








function embeddedState(){parent.postMessage({type:'legmao-glass-state',enabled:Boolean(scene)&&!mobile&&!reduceMotion(),available:Boolean(scene)&&!mobile,height:document.querySelector('.shell').getBoundingClientRect().height},location.origin)}
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data.type==='legmao-visibility'){frameVisible=Boolean(e.data.visible);if(frameVisible)wake();else stopAnimation();return}if(e.data.type==='legmao-language'&&translations[e.data.lang]){language=e.data.lang;applyLanguage();embeddedState()}if(e.data.type==='legmao-motion'){document.querySelector('.motion-toggle').click();embeddedState()}});
addEventListener('storage',e=>{if(e.key==='legmao-language'&&translations[e.newValue]){language=e.newValue;applyLanguage()}});
new ResizeObserver(embeddedState).observe(document.querySelector('.shell'));setTimeout(embeddedState,500);
reduced.addEventListener('change',embeddedState);
document.querySelectorAll('[data-business]').forEach(a=>a.target='_top');

addEventListener('pointermove',e=>{if(e.pointerType==='mouse')parent.postMessage({type:'legmao-pointer',x:e.clientX,y:e.clientY},location.origin)},{passive:true});

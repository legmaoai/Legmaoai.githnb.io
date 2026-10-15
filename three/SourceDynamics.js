import {Delaunay} from '../vendor/d3-delaunay.js';
import {inset} from '../config/panelGeometry.js';
import {multiply,rotation,translate} from './math.js';
const height=8*Math.tan(35*Math.PI/360),width=height*16/9-.52,paneHeight=height-.52-.225;
const bounds=[-width/2,-paneHeight/2,width/2,paneHeight/2];
let seed=1;const random=()=>{seed=(seed+0x6d2b79f5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296};
let sites=Array.from({length:5},()=>[(random()-.5)*width,(random()-.5)*paneHeight]);
for(let pass=0;pass<4;pass++){const diagram=Delaunay.from(sites).voronoi(bounds);sites=sites.map((s,i)=>{const p=diagram.cellPolygon(i);return p.reduce((sum,v)=>[sum[0]+v[0]/p.length,sum[1]+v[1]/p.length],[0,0])})}
const base=Delaunay.from(sites),baseCells=base.voronoi(bounds),counts=sites.map((s,i)=>baseCells.cellPolygon(i).length);
function allowed(candidate){const diagram=Delaunay.from(candidate).voronoi(bounds);return candidate.every((s,i)=>{const p=diagram.cellPolygon(i);return p&&p.length===counts[i]&&p.slice(1).every((q,k)=>Math.hypot(q[0]-p[k][0],q[1]-p[k][1])>=.355)})}
export function sourceFrame(state,siteOverride=null){
 const cursor=[state.x*width/2,-state.y*paneHeight/2],inside=Math.abs(state.x)<=1&&Math.abs(state.y)<=1;
 const focused=inside&&state.active>.01?base.find(...cursor):-1;
 const neighbors=new Set(focused>=0?base.neighbors(focused):[]);
 let moved=sites.map((site,i)=>{
  let result=[...site];if(neighbors.has(i)){const vector=[site[0]-sites[focused][0],site[1]-sites[focused][1]],length=Math.hypot(...vector),distance=Math.hypot(site[0]-cursor[0],site[1]-cursor[1]);const push=1.04*Math.exp(-distance*distance/(2*1.95**2))*state.active;
   result=result.map((x,j)=>x+vector[j]/length*push);
  }
  return [Math.max(bounds[0]+.135,Math.min(bounds[2]-.135,result[0])),Math.max(bounds[1]+.135,Math.min(bounds[3]-.135,result[1]))];
 });
 if(!allowed(moved)){const target=moved;let low=0,high=1;for(let k=0;k<8;k++){const t=(low+high)/2,candidate=sites.map((s,i)=>s.map((x,j)=>x+(target[i][j]-x)*t));if(allowed(candidate))low=t;else high=t}moved=sites.map((s,i)=>s.map((x,j)=>x+(target[i][j]-x)*low))}
 if(siteOverride)moved=siteOverride.map(p=>[...p]);
 const diagram=Delaunay.from(moved).voronoi(bounds),polys=[],matrices=[];
 const common=multiply(rotation([1,0,0],state.y*.114),rotation([0,1,0],state.x*.1596));
 moved.forEach((site,i)=>{
  const polygon=diagram.cellPolygon(i).slice(0,-1).map(v=>[(v[0]/width+.5)*1000,(.5-v[1]/paneHeight)*450]);
  // Convert clockwise world winding to the screen-space inset convention.
  const area=polygon.reduce((s,p,j)=>{const q=polygon[(j+1)%polygon.length];return s+p[0]*q[1]-q[0]*p[1]},0);if(area<0)polygon.reverse();
  const poly=inset(polygon,.045/width*1000/2);polys.push(poly);
  const center=poly.reduce((s,p)=>[s[0]+(p[0]-500)/poly.length,s[1]+(225-p[1])/poly.length,0],[0,0,0]);
  const delta=[cursor[0]-site[0],cursor[1]-site[1]],distance=Math.hypot(...delta),falloff=Math.max(0,1-distance/1.95),amount=falloff*falloff*(3-2*falloff)*.36*state.active;
  const local=distance>1e-6?multiply(rotation([1,0,0],-delta[1]/distance*amount),rotation([0,1,0],delta[0]/distance*amount)):rotation([1,0,0],0);
  matrices.push(multiply(common,multiply(translate(...center),multiply(local,translate(...center.map(x=>-x))))));
 });
 return {polys,matrices,focused,sites:moved};
}
export const sourcePoses=state=>sourceFrame(state).matrices;
export function createSourceRig(){
 let current=sites.map(p=>[...p]),start=current,focused=-1,changed=0,animating=false;
 return {get animating(){return animating},update(state,now){
  const target=sourceFrame(state);
  if(target.focused!==focused){focused=target.focused;start=current.map(p=>[...p]);changed=now}
  const progress=Math.max(0,Math.min(1,(now-changed)/4)),ease=1-(1-progress)**3;
  current=start.map((p,i)=>p.map((x,j)=>x+(target.sites[i][j]-x)*ease));animating=progress<1&&Math.max(...current.flat().map((v,j)=>Math.abs(v-target.sites.flat()[j])))>1e-5;
  return sourceFrame(state,current);
 }};
}

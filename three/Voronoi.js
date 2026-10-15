// Convex half-plane construction; no dependency on the original site's bundles.
export function cells(seeds,bounds){
 return seeds.map((s,index)=>{
  let p=[[bounds[0],bounds[1]],[bounds[2],bounds[1]],[bounds[2],bounds[3]],[bounds[0],bounds[3]]];
  for(let j=0;j<seeds.length;j++)if(j!==index){
   const t=seeds[j],n=[t[0]-s[0],t[1]-s[1]],d=(t[0]*t[0]+t[1]*t[1]-s[0]*s[0]-s[1]*s[1])/2,next=[];
   for(let k=0;k<p.length;k++){
    const a=p[k],b=p[(k+1)%p.length],da=a[0]*n[0]+a[1]*n[1]-d,db=b[0]*n[0]+b[1]*n[1]-d;
    if(da<=1e-9)next.push(a);
    if((da<0)!==(db<0)){const q=da/(da-db);next.push([a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q])}
   }
   p=next;
  }
  return p;
 });
}
export function seededSites(width,height,seed=1){
 let state=seed|0;const random=()=>{state=(state+0x6d2b79f5)|0;let t=Math.imul(state^(state>>>15),1|state);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296};
 let seeds=Array.from({length:5},()=>[(random()-.5)*width,(random()-.5)*height]);
 for(let iteration=0;iteration<4;iteration++)seeds=cells(seeds,[-width/2,-height/2,width/2,height/2]).map(p=>{
  // The source's closed cell includes its first vertex twice in the mean.
  const closed=[...p,p[0]];return closed.reduce((s,v)=>[s[0]+v[0]/closed.length,s[1]+v[1]/closed.length],[0,0]);
 });
 return seeds;
}

// Neutral reconstruction estimates from the rotated t=3 s frame.
// Every adjoining polygon uses the same topology before insetting.
export const vertices={"tl": [0.0, 0.0], "a": [96.2355672795447, 0.0], "b": [453.86587994463304, 0.0], "c": [897.1181095898263, 0.0], "tr": [1000.0, 0.0], "j": [333.18912997772304, 339.96205197284416], "k": [479.08399647886495, 200.944918326823], "l": [732.0462885482086, 244.79918144089208], "d": [300.4672964432558, 450.0], "e": [792.9936732607011, 450.0], "bl": [0.0, 450.0], "br": [1000.0, 450.0]};
export const topology=[['tl','a','j','d','bl'],['a','b','k','j'],['b','c','l','k'],['j','k','l','e','d'],['c','tr','br','e','l']];
export const response=[.65,.9,.95,.75,1];
// Convex polygon offset: preserve shared cut directions, create a 4.2-unit gap.
export function inset(poly,amount=2.1){
 const lines=poly.map((p,i)=>{const q=poly[(i+1)%poly.length],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy);return {p:[p[0]-dy/len*amount,p[1]+dx/len*amount],v:[dx,dy]}});
 return lines.map((a,i)=>{const b=lines[(i+lines.length-1)%lines.length];const cross=a.v[0]*b.v[1]-a.v[1]*b.v[0];const d=[b.p[0]-a.p[0],b.p[1]-a.p[1]];const t=(d[0]*b.v[1]-d[1]*b.v[0])/cross;return [a.p[0]+t*a.v[0],a.p[1]+t*a.v[1]]});
}
export const panels=topology.map(ids=>inset(ids.map(id=>vertices[id])));
export function roundedPath(poly,r=8){const n=poly.length;const pair=poly.map((p,i)=>{const prev=poly[(i+n-1)%n],next=poly[(i+1)%n];const point=q=>{const len=Math.hypot(q[0]-p[0],q[1]-p[1]);const t=Math.min(r,len*.2)/len;return [p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]};return [point(prev),p,point(next)]});return pair.map(([a,p,b],i)=>`${i?'L':'M'}${a} Q${p} ${b}`).join(' ')+' Z'}


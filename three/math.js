export const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
export function multiply(a,b){const o=Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
export function translate(x,y,z){const m=identity();m[12]=x;m[13]=y;m[14]=z;return m}
export function rotation(axis,angle){const [x,y,z]=axis,c=Math.cos(angle),s=Math.sin(angle),t=1-c;return [t*x*x+c,t*x*y+s*z,t*x*z-s*y,0,t*x*y-s*z,t*y*y+c,t*y*z+s*x,0,t*x*z+s*y,t*y*z-s*x,t*z*z+c,0,0,0,0,1]}
export function around(anchor,axis,degrees){return multiply(translate(...anchor),multiply(rotation(axis,degrees*Math.PI/180),translate(...anchor.map(x=>-x))))}
export function transform(m,p){return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]]}

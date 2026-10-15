import {multiply,rotation,translate} from './math.js';
// A gentle shared content rig, driven by the same filtered pointer as the glass.
export function contentPose(state,panes){
 const rad=Math.PI/180;
 const rotationMatrix=multiply(rotation([0,0,1],-state.x*2*rad),multiply(rotation([0,1,0],state.x*5*rad),rotation([1,0,0],state.y*2*rad)));
 return multiply(translate(panes[0][12]*.3,panes[0][13]*.3,0),rotationMatrix);
}
// Inverse of an orthonormal rigid transform; used by the shared content plane.
export function inverseRigid(m){
 const result=[m[0],m[4],m[8],0,m[1],m[5],m[9],0,m[2],m[6],m[10],0,0,0,0,1];
 for(let row=0;row<3;row++)result[12+row]=-(result[row]*m[12]+result[4+row]*m[13]+result[8+row]*m[14]);
 return result;
}

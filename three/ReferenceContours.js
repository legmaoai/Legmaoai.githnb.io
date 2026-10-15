import {referencePoses} from '../config/referencePoses.js';
import {panels,inset} from '../config/panelGeometry.js';
import {motionConfig as config} from '../config/motionConfig.js';
import {inverseRigid} from './contentProjection.js';
import {transform} from './math.js';
const targets=[panels.map(p=>inset(p,config.bevel)),...referencePoses.map(row=>row.observedProxy.map(poly=>poly.map(p=>[(p[0]-262)/1.53,(p[1]-175)/1.53])))];
export function contourWeights(state){
 const controls=[[0,0],...referencePoses.map(row=>row.pointer)],distances=controls.map(p=>Math.hypot(state.x-p[0],state.y-p[1])),hit=distances.findIndex(d=>d<.0001);
 if(hit>=0)return controls.map((p,i)=>i===hit?1:0);
 const raw=distances.map(d=>1/Math.max(.000001,d**config.poseKernelPower)),sum=raw.reduce((a,b)=>a+b,0);return raw.map(v=>v/sum);
}
// Virtual front corners are manual observations, not recovered original geometry.
// Unproject the shared continuous screen contour into each pane's own plane.
export function referenceContours(state,matrices){
 const weights=contourWeights(state);
 return panels.map((poly,i)=>{
  const inverse=inverseRigid(matrices[i]),camera=transform(inverse,[0,0,config.cameraDistance]);
  const front=poly.map((p,k)=>{
   const target=[0,0];targets.forEach((row,j)=>{target[0]+=row[i][k][0]*weights[j];target[1]+=row[i][k][1]*weights[j]});
   const point=transform(inverse,[target[0]-500,225-target[1],0]),direction=point.map((v,j)=>v-camera[j]),t=(.6-camera[2])/direction[2];
   return [camera[0]+direction[0]*t+500,225-camera[1]-direction[1]*t];
  });
  return inset(front,-config.bevel);
 });
}

import {referenceContours} from './ReferenceContours.js';
import {inverseRigid,contentPose} from './contentProjection.js';
import {referencePoses} from '../config/referencePoses.js';
import {translate} from './math.js';
import {buildGlass} from './GlassGeometry.js';
import {identity,multiply,rotation,around} from './math.js';
import {motionConfig as config} from '../config/motionConfig.js';
import {panels,topology,vertices} from '../config/panelGeometry.js';
import {transform} from './math.js';
function projected(matrix,poly){return poly.map(p=>{const v=transform(matrix,[p[0]-500,225-p[1],0]),scale=config.cameraDistance/(config.cameraDistance-v[2]);return [v[0]*scale,-v[1]*scale]})}
function separation(a,b){let minimum=Infinity,best;for(const polygon of [a,b])for(let i=0;i<polygon.length;i++){const p=polygon[i],q=polygon[(i+1)%polygon.length],length=Math.hypot(q[0]-p[0],q[1]-p[1]),axis=[-(q[1]-p[1])/length,(q[0]-p[0])/length];const pa=a.map(v=>v[0]*axis[0]+v[1]*axis[1]),pb=b.map(v=>v[0]*axis[0]+v[1]*axis[1]);const overlap=Math.min(Math.max(...pa),Math.max(...pb))-Math.max(Math.min(...pa),Math.min(...pb));if(overlap<-config.minProjectionGap)return null;if(overlap<minimum){minimum=overlap;best=axis}}const center=p=>p.reduce((sum,v)=>[sum[0]+v[0]/p.length,sum[1]+v[1]/p.length],[0,0]);const ca=center(a),cb=center(b);if((cb[0]-ca[0])*best[0]+(cb[1]-ca[1])*best[1]<0)best=best.map(x=>-x);return {axis:best,distance:minimum+config.minProjectionGap+.1}}
// Preserve hinge angles; solve small rigid translations instead of suppressing motion.
function separate(matrices){for(let iteration=0;iteration<config.maxSeparationIterations;iteration++){let changed=false;for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const result=separation(projected(matrices[i],panels[i]),projected(matrices[j],panels[j]));if(!result)continue;changed=true;const [x,y]=result.axis,d=result.distance*.55;matrices[i][12]-=x*d;matrices[i][13]+=y*d;matrices[j][12]+=x*d;matrices[j][13]-=y*d}if(!changed)break}return matrices}
const seams=[];
for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){
 const shared=topology[i].filter(id=>topology[j].includes(id));if(shared.length!==2)continue;
 const [a,b]=shared.map(id=>vertices[id]),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);let normal=[-dy/length,dx/length];
 const center=k=>panels[k].reduce((sum,p)=>[sum[0]+p[0]/panels[k].length,sum[1]+p[1]/panels[k].length],[0,0]);const ci=center(i),cj=center(j);
 if((cj[0]-ci[0])*normal[0]+(cj[1]-ci[1])*normal[1]<0)normal=normal.map(v=>-v);
 const ends=k=>shared.map(id=>panels[k][topology[k].indexOf(id)]);
 const aEnds=ends(i),bEnds=ends(j);
 const neutral=aEnds.map((a,k)=>(bEnds[k][0]-a[0])*normal[0]+(bEnds[k][1]-a[1])*normal[1]);
 const targets=referencePoses.map(row=>shared.map(id=>{const a=row.observedProxy[i][topology[i].indexOf(id)],b=row.observedProxy[j][topology[j].indexOf(id)];return ((b[0]-a[0])*normal[0]+(b[1]-a[1])*normal[1])/1.53}));
 seams.push({i,j,normal,aEnds,bEnds,targets:[neutral,...targets]});
}
// Calibrate excessive normal separation without reducing the fitted hinge angles.
function compactSeams(matrices,weights){
 for(let iteration=0;iteration<config.seamIterations;iteration++)for(const seam of seams){
  const a=projected(matrices[seam.i],seam.aEnds),b=projected(matrices[seam.j],seam.bEnds),n=seam.normal;
  const errors=a.map((point,k)=>{const target=seam.targets.reduce((sum,profile,j)=>sum+profile[k]*weights[j],0);return (b[k][0]-point[0])*n[0]+(b[k][1]-point[1])*n[1]-target});
  const excess=(errors[0]+errors[1])/2;
  if(Math.abs(excess)<.15)continue;const amount=excess*config.seamRelaxation;
  matrices[seam.i][12]+=n[0]*amount;matrices[seam.i][13]-=n[1]*amount;
  matrices[seam.j][12]-=n[0]*amount;matrices[seam.j][13]+=n[1]*amount;
 }
 return matrices;
}
export function poses(state,mobile=false){
 if(mobile)return [identity(),identity()];
 const controls=[{pointer:[0,0],panes:referencePoses[0].panes.map(p=>({params:[0,0,0,0,0,0],center:p.center}))},...referencePoses];
 const distances=controls.map(c=>Math.hypot(state.x-c.pointer[0],state.y-c.pointer[1]));
 const hit=distances.findIndex(d=>d<.0001);let weights;
 if(hit>=0)weights=controls.map((_,i)=>i===hit?1:0);else{weights=distances.map(d=>1/Math.max(.000001,d**config.poseKernelPower));const sum=weights.reduce((a,b)=>a+b);weights=weights.map(w=>w/sum)}
 const matrices=panels.map((_,i)=>{const p=Array(6).fill(0);controls.forEach((c,j)=>c.panes[i].params.forEach((v,k)=>p[k]+=v*weights[j]));const center=referencePoses[0].panes[i].center;const rad=Math.PI/180;const r=multiply(rotation([0,0,1],p[2]*rad),multiply(rotation([0,1,0],p[1]*rad),rotation([1,0,0],p[0]*rad)));return multiply(translate(p[3],p[4],p[5]),multiply(translate(...center),multiply(r,translate(...center.map(x=>-x)))))});
 return separate(compactSeams(matrices,weights));
}
function compile(gl,type,text){const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(s);gl.deleteShader(s);throw Error(error)}return s}
export async function createScene(canvas,polys,mobile){const sources=await Promise.all(['glass.vert','glass.frag'].map(async f=>{const r=await fetch('shaders/'+f);if(!r.ok)throw Error('Shader fetch failed');return r.text()}));const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'high-performance'});if(!gl)throw Error('WebGL unavailable');const program=gl.createProgram();let vs,fs;try{vs=compile(gl,gl.VERTEX_SHADER,sources[0]);fs=compile(gl,gl.FRAGMENT_SHADER,sources[1]);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));}catch(error){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);gl.deleteProgram(program);throw error;}gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);const uniforms=Object.fromEntries(['model','cameraDistance','viewSize','pointer','pane','titleTexture','titleReady','titleInverse','matcapTexture'].map(n=>[n,gl.getUniformLocation(program,n)]));const titleTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,titleTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));let titleReady=false;
 const capImage=new Image();capImage.src='assets/reference-matcap.png';await capImage.decode();const matcapTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,matcapTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,capImage);
 const buffers=[];const meshes=polys.map(poly=>{const geometry=buildGlass(poly,config);const attrs=[['position',geometry.positions,3],['normal',geometry.normals,3],['surface',geometry.kinds,1]].map(([name,data,size])=>{const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return {buffer:b,size,name,index:gl.getAttribLocation(program,name)}});return {count:geometry.count,attrs}});const debug=gl.getExtension('WEBGL_debug_renderer_info');const renderer=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);const loss=gl.getExtension('WEBGL_lose_context');const timer=gl.getExtension('EXT_disjoint_timer_query');let pending=[],gpuSamples=[],disposed=false,lastShape='';
 return {contextCount:1,gpuSamples,renderer,loseContext:()=>loss?.loseContext(),restoreContext:()=>loss?.restoreContext(),get resourceCount(){return buffers.length+5},updateTitle(source){if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,titleTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);titleReady=true},resize(w,h,dpr){canvas.width=Math.round(w*1.1*dpr);canvas.height=Math.round(h*1.2*dpr);gl.viewport(0,0,canvas.width,canvas.height)},draw(state,sharedTransforms){if(disposed||gl.isContextLost())return;gl.useProgram(program);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,titleTexture);gl.uniform1i(uniforms.titleTexture,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,matcapTexture);gl.uniform1i(uniforms.matcapTexture,1);gl.uniform1f(uniforms.titleReady,titleReady?1:0);gl.uniform1f(uniforms.cameraDistance,config.cameraDistance);gl.uniform2f(uniforms.viewSize,1100,540);gl.uniform2f(uniforms.pointer,state.x,state.y);let q;if(timer&&pending.length<4){q=timer.createQueryEXT();timer.beginQueryEXT(timer.TIME_ELAPSED_EXT,q)}const transforms=sharedTransforms||poses(state,mobile);gl.uniformMatrix4fv(uniforms.titleInverse,false,new Float32Array(inverseRigid(contentPose(state,transforms))));const shapeKey=[state.x,state.y].map(v=>v.toFixed(6)).join(',');if(!mobile&&shapeKey!==lastShape){referenceContours(state,transforms).forEach((poly,i)=>{const geometry=buildGlass(poly,config),data={position:geometry.positions,normal:geometry.normals,surface:geometry.kinds};meshes[i].attrs.forEach(a=>{gl.bindBuffer(gl.ARRAY_BUFFER,a.buffer);gl.bufferData(gl.ARRAY_BUFFER,data[a.name],gl.DYNAMIC_DRAW)});meshes[i].count=geometry.count});lastShape=shapeKey}meshes.forEach((mesh,i)=>{for(const a of mesh.attrs){gl.bindBuffer(gl.ARRAY_BUFFER,a.buffer);gl.enableVertexAttribArray(a.index);gl.vertexAttribPointer(a.index,a.size,gl.FLOAT,false,0,0)}gl.uniformMatrix4fv(uniforms.model,false,new Float32Array(transforms[i]||identity()));gl.uniform1f(uniforms.pane,i);gl.drawArrays(gl.TRIANGLES,0,mesh.count)});if(q){timer.endQueryEXT(timer.TIME_ELAPSED_EXT);pending.push(q)}pending=pending.filter(query=>{if(!timer.getQueryObjectEXT(query,timer.QUERY_RESULT_AVAILABLE_EXT))return true;if(!gl.getParameter(timer.GPU_DISJOINT_EXT)){gpuSamples.push(timer.getQueryObjectEXT(query,timer.QUERY_RESULT_EXT)/1e6);if(gpuSamples.length>300)gpuSamples.shift()}timer.deleteQueryEXT(query);return false})},dispose(){if(disposed)return;disposed=true;if(timer)pending.forEach(q=>timer.deleteQueryEXT(q));pending=[];buffers.forEach(b=>gl.deleteBuffer(b));gl.deleteTexture(titleTexture);gl.deleteTexture(matcapTexture);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);/* Retain this single canvas context; GPU objects are freed above. */}};
}






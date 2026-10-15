import * as THREE from '../vendor/three.module.js';
import {sourceFrame,sourcePoses as poses,createSourceRig} from './SourceDynamics.js';
import {buildGlass} from './GlassGeometry.js';
import {motionConfig} from '../config/motionConfig.js';
export {poses};
// Public demo's material defaults, implemented independently with official Three.
// Its live HTML upload is experimental; this renderer uses a CanvasTexture instead.
export async function createScene(canvas,polys){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,premultipliedAlpha:false});
 renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;
 const scene=new THREE.Scene(),unit=350;
 const camera=new THREE.PerspectiveCamera(2*Math.atan(270/motionConfig.cameraDistance)*180/Math.PI,1100/540,.01,50);
 camera.position.z=motionConfig.cameraDistance/unit;
 scene.add(new THREE.AmbientLight(0xffffff,.6));
 const spot=new THREE.SpotLight(0xffffff,7,0,Math.PI/4,.5,1);spot.position.set(0,7.1,2);scene.add(spot);
 const point=new THREE.PointLight(0xccddff,4,0,1);point.position.set(0,-3,1);scene.add(point);
 const cap=await new THREE.TextureLoader().loadAsync('assets/reference-matcap.png');
 const filmCanvas=document.createElement('canvas');filmCanvas.width=256;filmCanvas.height=256;
 const ctx=filmCanvas.getContext('2d'),gradient=ctx.createLinearGradient(0,0,256,256);
 gradient.addColorStop(0,'#202020');gradient.addColorStop(.5,'#a0a0a0');gradient.addColorStop(1,'#f0f0f0');ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256);
 const radial=ctx.createRadialGradient(76.8,102.4,0,76.8,102.4,230.4);radial.addColorStop(0,'rgba(255,255,255,.4)');radial.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=radial;ctx.fillRect(0,0,256,256);
 const film=new THREE.CanvasTexture(filmCanvas);film.wrapS=film.wrapT=THREE.RepeatWrapping;film.channel=1;
 const initial=document.createElement('canvas');initial.width=initial.height=4;initial.getContext('2d').fillRect(0,0,4,4);
 const title=new THREE.CanvasTexture(initial);title.colorSpace=THREE.SRGBColorSpace;title.generateMipmaps=false;title.minFilter=title.magFilter=THREE.LinearFilter;
 const material=new THREE.MeshPhysicalMaterial({map:title,color:0xffffff,transmission:0,thickness:1.35,ior:2.14,dispersion:.415,roughness:.41,metalness:0,clearcoat:1,clearcoatRoughness:.59,specularIntensity:1,attenuationDistance:4.7,attenuationColor:0xffffff,envMapIntensity:0,iridescence:1,iridescenceIOR:2.34,iridescenceThicknessMap:film,iridescenceThicknessRange:[80,500],side:THREE.DoubleSide});
 const coating=new THREE.MeshMatcapMaterial({matcap:cap,transparent:true,opacity:.15,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
 const geometries=[],groups=[];
 function makeGeometry(poly){
  const raw=buildGlass(poly,{thickness:.04/3.964*1000,bevel:.01/3.964*1000});
  for(let start=0;start<raw.positions.length;start+=9)for(let axis=0;axis<3;axis++){
   const a=start+3+axis,b=start+6+axis;[raw.positions[a],raw.positions[b]]=[raw.positions[b],raw.positions[a]];
   [raw.normals[a],raw.normals[b]]=[raw.normals[b],raw.normals[a]];
  }
  const uv=[],uvFilm=[];for(let i=0;i<raw.positions.length;i+=3){uv.push(raw.positions[i]/1000+.5,raw.positions[i+1]/450+.5);uvFilm.push(raw.positions[i]/1000*3.964/4.484+.5,(raw.positions[i+1]/450*1.778-.1125)/2.522+.5)}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(raw.positions.map(x=>x/unit),3));geometry.setAttribute('normal',new THREE.BufferAttribute(raw.normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute('uv1',new THREE.Float32BufferAttribute(uvFilm,2));return geometry;
 }
 for(const poly of sourceFrame({x:0,y:0,active:0}).polys){const geometry=makeGeometry(poly),group=new THREE.Group();geometries.push(geometry);group.matrixAutoUpdate=false;group.add(new THREE.Mesh(geometry,material),new THREE.Mesh(geometry,coating));scene.add(group);groups.push(group)}
 let lastShape='',prepared=null;const rig=createSourceRig();
 let disposed=false;const loss=renderer.getContext().getExtension('WEBGL_lose_context');
 return {contextCount:1,gpuSamples:[],renderer:'Three physical + Matcap',get needsAnimation(){return rig.animating},poses(state){prepared=rig.update(state,performance.now()/1000);return prepared.matrices},get resourceCount(){return renderer.info.memory.geometries+renderer.info.memory.textures+renderer.info.programs.length},
  updateTitle(source){title.image=source;title.needsUpdate=true},
  resize(w,h,dpr){renderer.setPixelRatio(dpr);renderer.setSize(w*1.1,h*1.2,false)},
  draw(state,transforms){if(disposed)return;const frame=prepared||rig.update(state,performance.now()/1000);prepared=null;const matrices=frame.matrices,key=frame.sites.flat().map(x=>x.toFixed(5)).join(',');
   if(key!==lastShape){frame.polys.forEach((poly,i)=>{const next=makeGeometry(poly);groups[i].children.forEach(mesh=>mesh.geometry=next);geometries[i].dispose();geometries[i]=next});lastShape=key}
   groups.forEach((group,i)=>{const matrix=[...matrices[i]];matrix[12]/=unit;matrix[13]/=unit;matrix[14]/=unit;group.matrix.fromArray(matrix);group.matrixWorldNeedsUpdate=true});renderer.render(scene,camera)},
  loseContext(){loss?.loseContext()},restoreContext(){loss?.restoreContext()},
  dispose(){if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());material.dispose();coating.dispose();cap.dispose();film.dispose();title.dispose();renderer.dispose()}
 };
}

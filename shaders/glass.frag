precision highp float;
uniform vec2 pointer;
uniform float cameraDistance;
uniform float pane;
uniform sampler2D titleTexture;
uniform sampler2D matcapTexture;
uniform float titleReady;
uniform mat4 titleInverse;
varying vec3 worldPosition;
varying vec3 worldNormal;
varying float kind;
varying vec2 contentUV;
float rectLight(vec2 q,vec2 center,vec2 halfSize,float soft){vec2 d=abs(q-center)-halfSize;float edge=length(max(d,0.));return exp(-edge*edge/(soft*soft));}
vec3 environment(vec3 direction){
 vec2 q=direction.xy/max(.25,abs(direction.z))+worldPosition.xy/1000.;
 vec3 light=vec3(0.2050228,0.1948089,0.2514456);
 light+=vec3(1.2658475,1.0169982,0.9882735)*exp(-dot(q-vec2(-2.80000,1.20000),q-vec2(-2.80000,1.20000))/0.4225000);
 light+=vec3(0.5786632,0.7462829,0.7685779)*exp(-dot(q-vec2(0.00000,-1.20000),q-vec2(0.00000,-1.20000))/0.4225000);
 light+=vec3(0.1235443,0.2457214,0.1122765)*exp(-dot(q-vec2(0.28890,-0.21461),q-vec2(0.28890,-0.21461))/0.0625000);
 light+=vec3(1.8680126,1.3483425,1.5427697)*exp(-dot(q-vec2(1.40000,1.20000),q-vec2(1.40000,1.20000))/0.4225000);
 light+=vec3(0.1039456,0.1313426,0.0966439)*exp(-dot(q-vec2(0.00000,1.20000),q-vec2(0.00000,1.20000))/0.4225000);
 light+=vec3(0.1864033,0.0792826,0.2481770)*exp(-dot(q-vec2(1.40000,-1.20000),q-vec2(1.40000,-1.20000))/0.4225000);
 light+=vec3(0.0181755,0.0003259,0.0306106)*exp(-dot(q-vec2(0.00000,0.00000),q-vec2(0.00000,0.00000))/0.4225000);
 light+=vec3(2.0000000,2.0000000,2.0000000)*exp(-dot(q-vec2(2.80000,1.20000),q-vec2(2.80000,1.20000))/0.4225000);
 return light;
}
vec3 background(vec2 p){vec2 q=(p-vec2(-380.,250.))/vec2(560.,430.);return vec3(.019,.021,.027)+exp(-dot(q,q))*vec3(.014,.018,.014);}
void main(){
 vec3 N=normalize(worldNormal),V=normalize(vec3(0.,0.,cameraDistance)-worldPosition);
 if(dot(N,V)<0.)N=-N;
 float nv=max(dot(N,V),0.);
 float fresnel=.041+.959*pow(1.-nv,5.);
 vec3 reflected=reflect(-V,N);
 vec3 env=environment(reflected)*.5+environment(normalize(reflected+vec3(.035,.02,0.)))*.25+environment(normalize(reflected-vec3(.035,.02,0.)))*.25;
 vec3 transmitted=refract(-V,N,1./1.49);
 float travel=(-30.-worldPosition.z)/min(-.01,transmitted.z);
 vec3 behind=worldPosition+transmitted*travel;
 vec3 through=background(behind.xy)*vec3(.36,.32,.39);
 float vertical=worldPosition.y/450.+.5;
 vec3 smoked=vec3(.035,.034,.04)+vec3(.004,.006,.008)*(1.-vertical);
 smoked+=vec3(.0007,-.0002,.0005)*pane;
 // Broad transmitted studio illumination, independent of the reflected field.
 float upper=exp(-pow((worldPosition.y-230.)/62.,2.));
 float left=exp(-pow((worldPosition.x+450.)/180.,2.));
 vec3 face=smoked+through*.65+env*(.085+fresnel*.65);
 face+=upper*left*vec3(.014,.039,.017)+upper*(1.-left)*vec3(.014,.009,.011);
 vec3 localCamera=(titleInverse*vec4(0.,0.,cameraDistance,1.)).xyz;
 vec3 localSurface=(titleInverse*vec4(worldPosition,1.)).xyz;
 vec3 straight=localSurface-localCamera;
 float planeT=-localCamera.z/min(-.01,straight.z);
 vec3 basePoint=localCamera+straight*planeT;
 vec3 localRay=(titleInverse*vec4(transmitted,0.)).xyz;
 vec2 opticalPoint=(localSurface+localRay*(-localSurface.z/min(-.01,localRay.z))).xy;
 // The content plane follows pane A, with bounded optical displacement.
 vec2 lettering=basePoint.xy+clamp(opticalPoint-basePoint.xy,vec2(-1.5),vec2(1.5))*.25;
 // The legacy rigid fit overstates local rotation because it also absorbs cell
 // deformation. Bound decal displacement until the deforming physical rig fits.
 vec2 uv=mix(vec2(basePoint.x/1000.+.5,basePoint.y/450.+.5),contentUV,.25);
 vec4 text=texture2D(titleTexture,uv);
 float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.);
 float cutLight=max(dot(N,normalize(vec3(-.7,1.,1.2))),0.);
 vec3 edge=vec3(.055,.057,.065)+env*(.26+fresnel*.55)+cutLight*vec3(.20,.195,.215);
 // Clear polished edge catches the broad studio surround at grazing angles.
 float diagonalLight=max(dot(N,normalize(vec3(.75,-.9,.5))),0.);
 vec3 body=vec3(.022,.024,.030)+env*(.16+fresnel*.48)+vec3(.64,.64,.68)*fresnel+cutLight*vec3(.12,.12,.14)+diagonalLight*vec3(.36,.35,.38);
 vec3 material=kind<.5?face:(kind<1.5?edge:body);
 vec3 tangent=normalize(vec3(V.z,0.,-V.x));
 vec3 bitangent=cross(V,tangent);
 vec2 matcapUV=vec2(dot(tangent,N),dot(bitangent,N))*.495+.5;
 // Three's matcap shader samples its view-normal coordinates directly;
 // texture repeat/offset is not applied to this shader path.
 vec3 cap=texture2D(matcapTexture,matcapUV).rgb;
 // Polished side transmission shares the text plane; edges cannot cut glyphs black.
 material=mix(material,text.rgb*vec3(.94,.95,.98)+env*.015,text.a*inside*titleReady);
 material+=pow(cap,vec3(2.2))*.15;
 gl_FragColor=vec4(material,1.);
}



attribute vec3 position;
attribute vec3 normal;
attribute float surface;
uniform mat4 model;
uniform float cameraDistance;
uniform vec2 viewSize;
varying vec3 worldPosition;
varying vec3 worldNormal;
varying float kind;
varying vec2 contentUV;
void main(){
 vec4 w=model*vec4(position,1.);
 worldPosition=w.xyz;worldNormal=mat3(model)*normal;kind=surface;
 contentUV=vec2(position.x/1000.+.5,position.y/450.+.5);
 float z=cameraDistance-w.z;
 gl_Position=vec4(w.x*cameraDistance/(viewSize.x*.5),w.y*cameraDistance/(viewSize.y*.5),(z-cameraDistance)*z*.002,z);
}

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

// ESCENA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight,0.1,1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// LUZ
const lightPos = new THREE.Vector3(5,5,5);

// GEOMETRÍA
const geo = new THREE.SphereGeometry(1,64,64);

// =======================
// SHADER 1: PHONG
// =======================
const phongMat = new THREE.ShaderMaterial({
uniforms:{
 lightPos:{value:lightPos},
 viewPos:{value:camera.position},
},
vertexShader:`
varying vec3 vNormal;
varying vec3 vPos;
void main(){
 vNormal = normalMatrix * normal;
 vPos = (modelViewMatrix * vec4(position,1.0)).xyz;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`,
fragmentShader:`
uniform vec3 lightPos;
uniform vec3 viewPos;
varying vec3 vNormal;
varying vec3 vPos;

void main(){
 vec3 N = normalize(vNormal);
 vec3 L = normalize(lightPos - vPos);
 float diff = max(dot(N,L),0.0);

 vec3 V = normalize(viewPos - vPos);
 vec3 H = normalize(L+V);
 float spec = pow(max(dot(N,H),0.0),32.0);

 vec3 col = vec3(0.2) + diff*vec3(0.5) + spec*vec3(1.0);
 gl_FragColor = vec4(col,1.0);
}
`
});

// =======================
// SHADER 2: TOON
// =======================
const toonMat = new THREE.ShaderMaterial({
uniforms:{ lightPos:{value:lightPos} },
vertexShader:`
varying vec3 vNormal;
varying vec3 vPos;
void main(){
 vNormal = normalMatrix * normal;
 vPos = (modelViewMatrix * vec4(position,1.0)).xyz;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`,
fragmentShader:`
uniform vec3 lightPos;
varying vec3 vNormal;
varying vec3 vPos;

void main(){
 float diff = dot(normalize(vNormal), normalize(lightPos - vPos));

 if(diff > 0.75) diff = 1.0;
 else if(diff > 0.4) diff = 0.6;
 else diff = 0.2;

 gl_FragColor = vec4(vec3(diff),1.0);
}
`
});

// =======================
// SHADER 3: NORMAL MAP
// =======================
const normalTex = new THREE.TextureLoader().load(
 'https://threejs.org/examples/textures/brick_normal.jpg'
);

const normalMat = new THREE.ShaderMaterial({
uniforms:{
 normalMap:{value:normalTex},
 lightPos:{value:lightPos}
},
vertexShader:`
varying vec2 vUv;
varying vec3 vNormal;
void main(){
 vUv = uv;
 vNormal = normal;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`,
fragmentShader:`
uniform sampler2D normalMap;
uniform vec3 lightPos;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
 vec3 N = texture2D(normalMap, vUv).rgb;
 N = normalize(N * 2.0 - 1.0);

 float diff = max(dot(N, normalize(lightPos)),0.0);
 gl_FragColor = vec4(vec3(diff),1.0);
}
`
});

// =======================
// SHADER 4: WOBBLE
// =======================
const wobbleMat = new THREE.ShaderMaterial({
uniforms:{ time:{value:0} },
vertexShader:`
uniform float time;
varying vec3 vNormal;
void main(){
 vec3 pos = position;
 pos.y += sin(pos.x*5.0 + time)*0.2;

 vNormal = normal;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
`,
fragmentShader:`
varying vec3 vNormal;
void main(){
 gl_FragColor = vec4(abs(vNormal),1.0);
}
`
});

// =======================
// MESH
// =======================
let mesh = new THREE.Mesh(geo, phongMat);
scene.add(mesh);

// CAMBIO DE SHADER
window.addEventListener("keydown",e=>{
 if(e.key==="1") mesh.material = phongMat;
 if(e.key==="2") mesh.material = toonMat;
 if(e.key==="3") mesh.material = normalMat;
 if(e.key==="4") mesh.material = wobbleMat;
});

// =======================
// LOOP
// =======================
function animate(t){
 requestAnimationFrame(animate);

 wobbleMat.uniforms.time.value = t*0.001;

 mesh.rotation.y += 0.01;

 renderer.render(scene,camera);
}
animate();
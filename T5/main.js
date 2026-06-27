import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight,0.1,1000);
camera.position.set(0,10,25);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);


let last = performance.now(), frames=0;
function fps(){
  frames++;
  const now = performance.now();
  if(now-last>1000){
    document.getElementById("fps").innerText="FPS: "+frames;
    frames=0;
    last=now;
  }
}

const geometry = new THREE.BoxGeometry(1,1,1);
const vertexCount = geometry.attributes.position.count;


const framesCount = 32;

const data = new Float32Array(vertexCount * framesCount * 4);

for(let f=0; f<framesCount; f++){
  for(let v=0; v<vertexCount; v++){

    const i = (f * vertexCount + v) * 4;

    const x = geometry.attributes.position.getX(v);
    const y = geometry.attributes.position.getY(v);
    const z = geometry.attributes.position.getZ(v);

    const offset = Math.sin(f * 0.2 + x * 3.0) * 0.5;

    data[i+0] = x;
    data[i+1] = y + offset;
    data[i+2] = z;
    data[i+3] = 1.0;
  }
}

const vatTexture = new THREE.DataTexture(
  data,
  vertexCount,
  framesCount,
  THREE.RGBAFormat,
  THREE.FloatType
);

vatTexture.needsUpdate = true;

const material = new THREE.ShaderMaterial({

uniforms:{
  time: {value:0},
  vatTex: {value:vatTexture},
  frames: {value:framesCount}
},

vertexShader:`
uniform sampler2D vatTex;
uniform float time;
uniform float frames;

void main(){

  float frame = mod(time * 10.0, frames);
  float v = frame / frames;

  // índice de vértice
  float u = float(gl_VertexID) / float(${vertexCount});

  vec3 pos = texture2D(vatTex, vec2(u, v)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
`,

fragmentShader:`
void main(){
  gl_FragColor = vec4(0.1,0.8,1.0,1.0);
}
`
});


const COUNT = 500;

const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
scene.add(mesh);

const dummy = new THREE.Object3D();

const offsets = new Float32Array(COUNT);

for(let i=0;i<COUNT;i++){

  dummy.position.set(
    (Math.random()-0.5)*40,
    (Math.random()-0.5)*10,
    (Math.random()-0.5)*40
  );

  dummy.scale.setScalar(Math.random()+0.5);

  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);

  offsets[i] = Math.random()*100;
}

function animate(){
  requestAnimationFrame(animate);

  const t = performance.now()*0.001;

  material.uniforms.time.value = t;

  for(let i=0;i<COUNT;i++){

    mesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

    dummy.rotation.y += 0.01;

    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;

  renderer.render(scene,camera);

  fps();
}

animate();
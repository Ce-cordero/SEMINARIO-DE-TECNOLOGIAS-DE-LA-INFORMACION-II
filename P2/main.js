import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 15, 35);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let lastTime = performance.now();
let frames = 0;
function updateFPS(){

  frames++;

  const now = performance.now();

  if (now - lastTime >= 1000) {

    document.getElementById("fps").innerText = "FPS: " + frames;

    frames = 0;
    lastTime = now;
  }
}

scene.add(new THREE.GridHelper(50, 10));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 10);
scene.add(light);

const geometry = new THREE.ConeGeometry(1, 3, 8);

const material = new THREE.ShaderMaterial({

uniforms: {
  time: { value: 0 }
},

vertexShader: `
uniform float time;

void main() {

  vec3 pos = position;

  pos.x += sin(time + position.y * 5.0) * 0.3;

  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * mvPosition;
}
`,

fragmentShader: `
void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.8, 1.0);
}
`
});

const COUNT = 100;

const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
scene.add(mesh);

const dummy = new THREE.Object3D();
const velocities = [];

for (let i = 0; i < COUNT; i++) {

  dummy.position.set(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 30
  );

  dummy.scale.setScalar(1.5);

  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);

  velocities.push(new THREE.Vector3(
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4
  ));
}

function updateAgents() {

  for (let i = 0; i < COUNT; i++) {

    mesh.getMatrixAt(i, dummy.matrix);
    dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

    dummy.position.add(velocities[i]);

    // límites
    if (Math.abs(dummy.position.x) > 20) velocities[i].x *= -1;
    if (Math.abs(dummy.position.y) > 20) velocities[i].y *= -1;
    if (Math.abs(dummy.position.z) > 20) velocities[i].z *= -1;

    dummy.lookAt(dummy.position.clone().add(velocities[i]));

    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

function animate() {

  requestAnimationFrame(animate);

  material.uniforms.time.value = performance.now() * 0.001;

  updateAgents();

  renderer.render(scene, camera);
  updateFPS();
}

animate();
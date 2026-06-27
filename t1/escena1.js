import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js?module';

// =====================
// ESCENA
// =====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// =====================
// CÁMARA
// =====================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// =====================
// RENDER
// =====================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// =====================
// CONTROLES
// =====================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.update();

// =====================
// LUCES
// =====================
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);

// =====================
// SUELO
// =====================
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x808080 })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// =====================
// MATERIALES (2 tipos)
// =====================
const material1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const material2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

// =====================
// OBJETOS (4 geometrías)
// =====================

// CAJA
const box = new THREE.Mesh(new THREE.BoxGeometry(), material1);
box.position.set(-3, 1, 0);
box.castShadow = true;
scene.add(box);

// ESFERA
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  material2
);
sphere.position.set(0, 1, 0);
scene.add(sphere);

// CILINDRO
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 2, 32),
  material1
);
cylinder.position.set(3, 1, 0);
scene.add(cylinder);

// TORO
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 100),
  material2
);
torus.position.set(-6, 1, 0);
scene.add(torus);

// =====================
// DEBUG (opcional)
// =====================
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// =====================
// ANIMACIÓN
// =====================
function animate() {
  requestAnimationFrame(animate);

  box.rotation.y += 0.01;
  sphere.rotation.y += 0.01;
  cylinder.rotation.x += 0.01;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// =====================
// RESIZE
// =====================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
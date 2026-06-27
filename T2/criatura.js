

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js?module';

// ========================
// ESCENA
// ========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa); // fondo gris

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 3, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// ========================
// LUCES
// ========================
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// ========================
// JERARQUÍA DEL PEZ
// ========================

// nodo principal
const pez = new THREE.Object3D();
scene.add(pez);

// cuerpo (6 nodos mínimo)
const cuerpo1 = new THREE.Object3D();
const cuerpo2 = new THREE.Object3D();
const cuerpo3 = new THREE.Object3D();
const cola = new THREE.Object3D();
const aletaIzq = new THREE.Object3D();
const aletaDer = new THREE.Object3D();

pez.add(cuerpo1);
cuerpo1.add(cuerpo2);
cuerpo2.add(cuerpo3);
cuerpo3.add(cola);
cuerpo2.add(aletaIzq);
cuerpo2.add(aletaDer);

// ========================
// GEOMETRÍA
// ========================

const material = new THREE.MeshStandardMaterial({ color: 0x00ccff });

// cuerpo
function segmento(x) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    material
  );
  m.position.x = x;
  return m;
}

cuerpo1.add(segmento(0));
cuerpo2.add(segmento(1));
cuerpo3.add(segmento(1));

// cola
const colaMesh = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 1, 16),
  material
);
colaMesh.rotation.z = Math.PI;
colaMesh.position.x = 1;
cola.add(colaMesh);

// aletas
const aletaGeo = new THREE.BoxGeometry(0.1, 0.8, 0.4);

const aletaMesh1 = new THREE.Mesh(aletaGeo, material);
const aletaMesh2 = new THREE.Mesh(aletaGeo, material);

aletaMesh1.position.set(0, 0.3, 0.7);
aletaMesh2.position.set(0, 0.3, -0.7);

aletaIzq.add(aletaMesh1);
aletaDer.add(aletaMesh2);

// ========================
// POSICIONES BASE
// ========================

cuerpo2.position.x = 1;
cuerpo3.position.x = 1;
cola.position.x = 1;

// ========================
// ANIMACIÓN (NADO)
// ========================

let t = 0;

function animate() {
  requestAnimationFrame(animate);

  t += 0.05;

  // movimiento ondulatorio tipo pez
  cuerpo1.rotation.y = Math.sin(t) * 0.2;
  cuerpo2.rotation.y = Math.sin(t + 0.5) * 0.3;
  cuerpo3.rotation.y = Math.sin(t + 1) * 0.4;
  cola.rotation.y = Math.sin(t + 1.5) * 0.6;

  // aletas
  aletaIzq.rotation.z = Math.sin(t * 2) * 0.5;
  aletaDer.rotation.z = -Math.sin(t * 2) * 0.5;

  // avance automático
  pez.position.x += 0.02;
  if (pez.position.x > 10) pez.position.x = -10;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ========================
// RESPONSIVE
// ========================
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
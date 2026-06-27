
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js?module';

// =====================
// ESCENA
// =====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa); // 🔥 FONDO GRIS

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(6,6,12);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// =====================
// LUCES (MEJORADAS)
// =====================
const luz1 = new THREE.DirectionalLight(0xffffff, 1);
luz1.position.set(5,10,5);
scene.add(luz1);

const luz2 = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(luz2);

// =====================
// MATERIAL PRO
// =====================
const material = new THREE.MeshStandardMaterial({
  color: 0x00bcd4,
  metalness: 0.6,
  roughness: 0.4
});

// =====================
// JERARQUÍA
// =====================
const base = new THREE.Object3D();
scene.add(base);

const hombro = new THREE.Object3D();
base.add(hombro);

const codo = new THREE.Object3D();
hombro.add(codo);

const muneca = new THREE.Object3D();
codo.add(muneca);

const dedo1 = new THREE.Object3D();
const dedo2 = new THREE.Object3D();
muneca.add(dedo1);
muneca.add(dedo2);

// =====================
// GEOMETRÍA
// =====================
function crearParte(y){
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,2,1),
    material
  );
  mesh.position.y = y;
  return mesh;
}

// BASE MÁS GRANDE
const baseMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(1.5,1.5,1,32),
  material
);
base.add(baseMesh);

hombro.add(crearParte(1));
codo.add(crearParte(1));
muneca.add(crearParte(1));

// DEDOS
const dedoGeo = new THREE.BoxGeometry(0.3,1,0.3);

const meshD1 = new THREE.Mesh(dedoGeo, material);
const meshD2 = new THREE.Mesh(dedoGeo, material);

meshD1.position.y = 0.5;
meshD2.position.y = 0.5;

dedo1.add(meshD1);
dedo2.add(meshD2);

dedo1.position.x = 0.5;
dedo2.position.x = -0.5;

// POSICIONES (IMPORTANTE PARA ARTICULACIONES)
hombro.position.y = 1;
codo.position.y = 2;
muneca.position.y = 2;

// =====================
// CONTROLES TECLADO 🎮
// =====================
window.addEventListener('keydown', (e)=>{
  if(e.key === 'q') hombro.rotation.z += 0.1;
  if(e.key === 'a') hombro.rotation.z -= 0.1;

  if(e.key === 'w') codo.rotation.z += 0.1;
  if(e.key === 's') codo.rotation.z -= 0.1;

  if(e.key === 'e') muneca.rotation.z += 0.1;
  if(e.key === 'd') muneca.rotation.z -= 0.1;
});

// =====================
// ANIMACIÓN AUTOMÁTICA
// =====================
let t = 0;

function animate(){
  requestAnimationFrame(animate);

  t += 0.02;

  hombro.rotation.z = Math.sin(t)*0.5;
  codo.rotation.z = Math.sin(t+1)*0.5;
  muneca.rotation.z = Math.sin(t+2)*0.5;

  controls.update();
  renderer.render(scene,camera);
}

animate();
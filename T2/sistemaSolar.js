import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

// =====================
// ESCENA
// =====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa); // 🔥 fondo gris

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 5, 35);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// =====================
// LUZ (SOL)
// =====================
const luz = new THREE.PointLight(0xffffff, 2, 300);
scene.add(luz);

// =====================
// SOL
// =====================
const sol = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffcc00 })
);
scene.add(sol);

// =====================
// FUNCIÓN PLANETA
// =====================
function crearPlaneta(distancia, tamaño, color){
  const orbita = new THREE.Object3D();

  const planeta = new THREE.Mesh(
    new THREE.SphereGeometry(tamaño, 32, 32),
    new THREE.MeshStandardMaterial({ color })
  );

  planeta.position.x = distancia;

  orbita.add(planeta);
  scene.add(orbita);

  return { orbita, planeta };
}

// =====================
// PLANETAS
// =====================
const p1 = crearPlaneta(8, 1, 0x3399ff);
const p2 = crearPlaneta(12, 1.5, 0xff5533);
const p3 = crearPlaneta(17, 2, 0xffaa00);

// =====================
// FUNCIÓN LUNA
// =====================
function crearLuna(planeta, distancia, tamaño){
  const orbita = new THREE.Object3D();

  const luna = new THREE.Mesh(
    new THREE.SphereGeometry(tamaño, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
  );

  luna.position.x = distancia;

  orbita.add(luna);
  planeta.add(orbita);

  return orbita;
}

// =====================
// LUNAS
// =====================
const luna1 = crearLuna(p1.planeta, 2, 0.3);

const luna2a = crearLuna(p2.planeta, 2.5, 0.4);
const luna2b = crearLuna(p2.planeta, 4, 0.3);

const luna3 = crearLuna(p3.planeta, 3, 0.5);

// =====================
// CONTROL VELOCIDAD 🎛
// =====================
let velocidad = 1;

window.addEventListener('keydown', (e)=>{
  if(e.key === '+') velocidad += 0.2;
  if(e.key === '-') velocidad -= 0.2;
});

// =====================
// ANIMACIÓN
// =====================
function animate(){
  requestAnimationFrame(animate);

  // órbitas planetas
  p1.orbita.rotation.y += 0.02 * velocidad;
  p2.orbita.rotation.y += 0.015 * velocidad;
  p3.orbita.rotation.y += 0.01 * velocidad;

  // rotación propia
  p1.planeta.rotation.y += 0.02;
  p2.planeta.rotation.y += 0.015;
  p3.planeta.rotation.y += 0.01;

  // lunas
  luna1.rotation.y += 0.05 * velocidad;

  luna2a.rotation.y += 0.04 * velocidad;
  luna2b.rotation.y += 0.03 * velocidad;

  luna3.rotation.y += 0.02 * velocidad;

  renderer.render(scene, camera);
}

animate();
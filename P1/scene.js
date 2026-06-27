import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Cámara
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 20);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Luces tipo concierto 🎤
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xff00ff, 2);
    spotLight.position.set(0, 20, 10);
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0x00ffff, 2);
    spotLight2.position.set(10, 20, -10);
    scene.add(spotLight2);

    // Escenario (plataforma)
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    return { scene, camera, renderer };
}
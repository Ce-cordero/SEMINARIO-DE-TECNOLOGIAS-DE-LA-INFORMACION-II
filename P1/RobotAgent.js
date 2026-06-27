import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class RobotAgent {
    constructor() {
        this.group = new THREE.Group();

        // Cuerpo
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshStandardMaterial({ color: 0x00ffcc })
        );

        // Cabeza
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.8),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        head.position.y = 1.5;

        this.group.add(body);
        this.group.add(head);

        // Dirección aleatoria
        this.direction = new THREE.Vector3(
            Math.random() - 0.5,
            0,
            Math.random() - 0.5
        ).normalize();

        this.speed = 0.05;
    }

    update(bounds) {
        // Movimiento hacia adelante
        this.group.position.add(this.direction.clone().multiplyScalar(this.speed));

        // Rebote en límites
        if (this.group.position.x > bounds || this.group.position.x < -bounds) {
            this.direction.x *= -1;
        }

        if (this.group.position.z > bounds || this.group.position.z < -bounds) {
            this.direction.z *= -1;
        }

        // Orientación hacia donde va
        const angle = Math.atan2(this.direction.x, this.direction.z);
        this.group.rotation.y = angle;
    }
}
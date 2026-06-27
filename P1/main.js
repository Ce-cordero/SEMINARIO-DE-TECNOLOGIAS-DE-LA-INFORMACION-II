import { createScene } from './scene.js';
import { RobotAgent } from './RobotAgent.js';

const { scene, camera, renderer } = createScene();

const robots = [];
const NUM_ROBOTS = 5;
const BOUNDS = 20;

// Crear robots
for (let i = 0; i < NUM_ROBOTS; i++) {
    const robot = new RobotAgent();

    // Posición aleatoria
    robot.group.position.set(
        (Math.random() - 0.5) * 20,
        1,
        (Math.random() - 0.5) * 20
    );

    scene.add(robot.group);
    robots.push(robot);
}

function animate() {
    requestAnimationFrame(animate);

    robots.forEach(robot => {
        robot.update(BOUNDS);
    });

    renderer.render(scene, camera);
}

animate();
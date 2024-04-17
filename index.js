// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Bodies
const bodies = [{
    mass: 0,
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    color: 0xff0000 // red
},
{
    mass: 0,
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    color: 0x00ff00 // green
},
{
    mass: 0,
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    color: 0x0000ff // blue
}
];

// Create spheres
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const spheres = bodies.map(body => {
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: body.color
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(body.position);
    scene.add(sphere);
    return sphere;
});

// Update function
function update() {
    const G = parseFloat(document.getElementById('gravConst').value);
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        const force = new THREE.Vector3(0, 0, 0);

        // Calculate gravitational forces
        for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
                const otherBody = bodies[j];
                const direction = otherBody.position.clone().sub(body.position);
                const distanceSq = direction.lengthSq();
                const magnitude = G * body.mass * otherBody.mass / distanceSq;
                force.add(direction.normalize().multiplyScalar(magnitude));
            }
        }

        // Update velocity and position
        const acceleration = force.clone().divideScalar(body.mass);
        body.velocity.add(acceleration);
        body.position.add(body.velocity);

        // Update sphere position
        spheres[i].position.copy(body.position);
    }
}

// Start simulation
function startSimulation() {
    document.getElementById('control-panel').style.display = 'none';
    document.getElementById('hidden-panel').style.display = 'block';

    // Update initial positions, masses, and velocities from input fields
    for (let i = 0; i < bodies.length; i++) {
        const massInput = document.getElementById(`mass${i + 1}`);
        const xInput = document.getElementById(`x${i + 1}`);
        const yInput = document.getElementById(`y${i + 1}`);
        const zInput = document.getElementById(`z${i + 1}`);
        const vxInput = document.getElementById(`vx${i + 1}`);
        const vyInput = document.getElementById(`vy${i + 1}`);
        const vzInput = document.getElementById(`vz${i + 1}`);

        bodies[i].mass = parseFloat(massInput.value);
        bodies[i].position.set(parseFloat(xInput.value), parseFloat(yInput.value), parseFloat(zInput.value));
        bodies[i].velocity.set(parseFloat(vxInput.value), parseFloat(vyInput.value), parseFloat(vzInput.value));
    }

    // Start the animation loop
    animate();
}

// Randomize positions and velocities
function randomize() {
    for (let i = 0; i < bodies.length; i++) {
        const x = Math.random() * 100 - 50;
        const y = Math.random() * 100 - 50;
        const z = Math.random() * 100 - 50;
        const vx = Math.random() * 0.2 - 0.1;
        const vy = Math.random() * 0.2 - 0.1;
        const vz = Math.random() * 0.2 - 0.1;

        const xInput = document.getElementById(`x${i + 1}`);
        const yInput = document.getElementById(`y${i + 1}`);
        const zInput = document.getElementById(`z${i + 1}`);
        const vxInput = document.getElementById(`vx${i + 1}`);
        const vyInput = document.getElementById(`vy${i + 1}`);
        const vzInput = document.getElementById(`vz${i + 1}`);

        xInput.value = x.toFixed(2);
        yInput.value = y.toFixed(2);
        zInput.value = z.toFixed(2);
        vxInput.value = vx.toFixed(2);
        vyInput.value = vy.toFixed(2);
        vzInput.value = vz.toFixed(2);
    }
}

function showPanel() {
    document.getElementById('control-panel').style.display = 'block';
    document.getElementById('hidden-panel').style.display = 'none';
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

document.body.addEventListener('keypress', function (event) {
    if (event.key === 'n') {
        randomize();
        startSimulation();
    }
});

document.body.addEventListener('keypress', function (event) {
    if (event.key === 's') {
        startSimulation();
    }
});

document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        randomize();
        startSimulation();
    }
});

// Initial setup
camera.position.z = 100;

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222233);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8, 8, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0x404040, 0.7);
scene.add(ambient);

// Ground Plane
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.8 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Objects
const objects = [];
function addObject(geometry, color, position) {
    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.copy(position);
    mesh.castShadow = true;
    scene.add(mesh);
    objects.push(mesh);
}

// Add 5+ objects
addObject(new THREE.BoxGeometry(1, 1, 1), 0xff5555, new THREE.Vector3(-3, 0, 0));
addObject(new THREE.SphereGeometry(0.7, 32, 32), 0x55ff55, new THREE.Vector3(0, 0, 0));
addObject(new THREE.ConeGeometry(0.6, 1.5, 32), 0x5555ff, new THREE.Vector3(3, 0, 0));
addObject(new THREE.TorusGeometry(0.5, 0.2, 16, 100), 0xffff55, new THREE.Vector3(-1.5, 0, 2.5));
addObject(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32), 0xff55ff, new THREE.Vector3(2, 0, -2.5));

// Raycaster for picking
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selected = null;

// Stencil Outline Materials
const outlineColor = 0x00ffff;
const outlineMaterial = new THREE.MeshBasicMaterial({
    color: outlineColor,
    side: THREE.BackSide,
    depthTest: true,
    depthWrite: false,
    stencilWrite: true,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilRef: 1,
    stencilZPass: THREE.ReplaceStencilOp,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    transparent: true,
    opacity: 1.0,
});

// Mouse click event
window.addEventListener('pointerdown', (event) => {
    // Convert mouse to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        selected = intersects[0].object;
    } else {
        selected = null;
    }
});

// Outline mesh cache
let outlineMesh = null;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Remove previous outline mesh
    if (outlineMesh) {
        scene.remove(outlineMesh);
        outlineMesh.geometry.dispose();
        outlineMesh = null;
    }

    // If an object is selected, create outline mesh
    if (selected) {
        outlineMesh = selected.clone();
        outlineMesh.material = outlineMaterial;
        outlineMesh.scale.multiplyScalar(1.08);
        outlineMesh.position.copy(selected.position);
        outlineMesh.quaternion.copy(selected.quaternion);
        outlineMesh.renderOrder = 1; // Render after the original mesh
        scene.add(outlineMesh);
    }

    renderer.clear();

    // 1. Render outline mesh with stencil write
    if (outlineMesh) {
        renderer.state.buffers.stencil.setTest(true);
        renderer.state.buffers.stencil.setFunc(THREE.AlwaysStencilFunc, 1, 0xff);
        renderer.state.buffers.stencil.setOp(THREE.ReplaceStencilOp, THREE.ReplaceStencilOp, THREE.ReplaceStencilOp);
        renderer.render(outlineMesh, camera);
        renderer.state.buffers.stencil.setFunc(THREE.NotEqualStencilFunc, 1, 0xff);
        renderer.state.buffers.stencil.setOp(THREE.KeepStencilOp, THREE.KeepStencilOp, THREE.KeepStencilOp);
    } else {
        renderer.state.buffers.stencil.setTest(false);
    }

    // 2. Render scene normally
    renderer.render(scene, camera);

    // Reset stencil state
    renderer.state.buffers.stencil.setTest(false);
}

animate();

// Responsive resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
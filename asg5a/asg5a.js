import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    const scene = new THREE.Scene();

    // Lighting
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Texture Loader for Cube
    const loader = new THREE.TextureLoader();
    loader.load(
        'wall.jpg',
        function(texture) {
            const boxWidth = 1;
            const boxHeight = 1;
            const boxDepth = 1;
            const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
            const boxMaterial = new THREE.MeshPhongMaterial({ map: texture });
            const cube = new THREE.Mesh(boxGeometry, boxMaterial);
            cube.position.x = -2;
            scene.add(cube);
        },
        undefined,
        function(error) {
            console.error('An error occurred loading the texture:', error);
        }
    );

    // Sphere
    const sphereRadius = 0.5;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMaterial = new THREE.MeshPhongMaterial({color: 0x8844aa});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Cylinder
    const cylinderRadiusTop = 0.5;
    const cylinderRadiusBottom = 0.5;
    const cylinderHeight = 1;
    const cylinderRadialSegments = 32;
    const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, cylinderRadialSegments);
    const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0xaa8844});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.x = 2;
    scene.add(cylinder);

    // GLB Model Loader
    const glbLoader = new GLTFLoader();
    glbLoader.load(
        'Imposter.glb',
        function(gltf) {
            scene.add(gltf.scene);
            gltf.scene.position.set(0, 0, 0);
            gltf.scene.scale.set(1, 1, 1);
        },
        undefined,
        function(error) {
            console.error('An error happened with the GLB model:', error);
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

main();

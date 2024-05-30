import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { MTLLoader } from './lib/MTLLoader.js';
import { OBJLoader } from './lib/OBJLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();

  // CAMERA ----------------------------------------------------
  const fov = 80;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 12, 30);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 12, 0);
  controls.update();

  // LIGHTS ----------------------------------------------------
  {
    const color = 0xFFFFFF;
    const intensity = 0.3;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0.4;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  // GROUND PLANE ---------------------------------------------------------
  {
    const planeSize = 80;
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0x4F702B,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  // SKYBOX -------------------------------------------------------------
  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './background/wall1.png',  // right
      './background/wall3.png',  // left
      './background/ceiling.png',  // top (temporary replacement)
      './background/floor.png',  // bottom (temporary replacement)
      './background/wall4.png',  // back
      './background/wall2.png',  // front
    ], 
    (texture) => {
      console.log('Skybox textures loaded successfully.');
      scene.background = texture;
    },
    undefined,
    (err) => {
      console.error('An error happened while loading the skybox textures.', err);
    });
  }

  // FOG ----------------------------------------------------------------
  {
    const color = 0xFFEAD0;
    const near = 0;
    const far = 80;
    scene.fog = new THREE.Fog(color, near, far);
  }

  // LOAD BEAGLE MODEL ---------------------------------------------------
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('./Beagle/Mesh_Beagle.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('./Beagle/Mesh_Beagle.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            if (obj.material && obj.material.color) {
              obj.material.color.set(0xffffff);
            }
          }
        });
        root.scale.set(0.2, 0.2, 0.2);
        root.position.set(0, 8.2, -2);
        scene.add(root);
      }, undefined, (err) => {
        console.error('An error happened while loading the OBJ file.', err);
      });
    }, undefined, (err) => {
      console.error('An error happened while loading the MTL file.', err);
    });
  }

  // LOAD PUPPY MODEL ----------------------------------------------------
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('./Puppy/Mesh_Puppy.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('./Puppy/Mesh_Puppy.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            if (obj.material && obj.material.color) {
              obj.material.color.set(0xffffff);
            }
          }
        });
        root.scale.set(0.15, 0.15, 0.15); // Slightly smaller scale for the puppy
        root.position.set(10, 4.6, -2); // Position the puppy slightly to the side of the beagle
        scene.add(root);
      }, undefined, (err) => {
        console.error('An error happened while loading the OBJ file.', err);
      });
    }, undefined, (err) => {
      console.error('An error happened while loading the MTL file.', err);
    });
  }

  // LOAD PLANE MODEL ----------------------------------------------------
  let plane;
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('./Plane/materials.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('./Plane/model.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            if (obj.material && obj.material.color) {
              obj.material.color.set(0xffffff);
            }
          }
        });
        root.scale.set(15, 15, 15); // Scale the plane
        root.position.set(0, 30, 0); // Initial position of the plane
        scene.add(root);
        plane = root; // Store the plane object for animation
      }, undefined, (err) => {
        console.error('An error happened while loading the OBJ file.', err);
      });
    }, undefined, (err) => {
      console.error('An error happened while loading the MTL file.', err);
    });
  }

  // BALLS STACK --------------------------------------------------------
  {
    const radius = 2;  // Increased radius for larger balls
    const widthSegments = 32;
    const heightSegments = 32;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const colors = [
      0xFF0000, // Red
      0xFF7F00, // Orange
      0xFFFF00, // Yellow
      0x00FF00, // Green
      0x0000FF, // Blue
      0x4B0082, // Indigo
      0x8B00FF  // Violet
    ];

    const offsetX = -20;
    const offsetZ = -20;

    const positions = [
      // Bottom layer (3x3)
      [offsetX - 4, 2, offsetZ - 4], [offsetX, 2, offsetZ - 4], [offsetX + 4, 2, offsetZ - 4],
      [offsetX - 4, 2, offsetZ], [offsetX, 2, offsetZ], [offsetX + 4, 2, offsetZ],
      [offsetX - 4, 2, offsetZ + 4], [offsetX, 2, offsetZ + 4], [offsetX + 4, 2, offsetZ + 4],
      // Middle layer (2x2)
      [offsetX - 2, 5, offsetZ - 2], [offsetX + 2, 5, offsetZ - 2],
      [offsetX - 2, 5, offsetZ + 2], [offsetX + 2, 5, offsetZ + 2],
      // Top layer (1x1)
      [offsetX, 8, offsetZ],
    ];

    positions.forEach((position, index) => {
      const color = colors[index % colors.length];
      const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(...position);
      sphere.castShadow = true;
      scene.add(sphere);
    });
  }

  // SQUARES STACK --------------------------------------------------------
  {
    const squareSize = 6;  // Increased size of each square
    const squareGeometry = new THREE.BoxGeometry(squareSize, squareSize, squareSize);

    const colors = [
      0xFF0000, // Red
      0x00FF00, // Green
      0x0000FF  // Blue
    ];

    const baseHeight = squareSize / 2;
    const secondLayerHeight = baseHeight * 3;
    
    const positions = [
      // Bottom layer (2x1)
      [-2, baseHeight, 0], [8, baseHeight, 0],
      // Top layer (1x1)
      [3, secondLayerHeight, 0]
    ];

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./wall.jpg');

    positions.forEach((position, index) => {
      const color = colors[index % colors.length];
      const squareMaterial = new THREE.MeshPhongMaterial({ color: color });
      const square = new THREE.Mesh(squareGeometry, squareMaterial);
      if (index === 2) {
        square.material.map = texture; // Apply texture to the top block
        square.material.needsUpdate = true;
      }
      square.position.set(...position);
      square.castShadow = true;
      square.rotation.y = Math.PI / 4; // Rotate the squares by 45 degrees
      square.position.x += 30; // Move to the corner (adjust as needed)
      square.position.z += 30; // Move to the corner (adjust as needed)
      scene.add(square);
    });
  }

  // LIGHT CYLINDERS --------------------------------------------------------
  {
    const cylinderHeight = 20;
    const cylinderRadius = 1;
    const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);

    const lightColors = [0xFFD700, 0xFF69B4, 0x1E90FF];
    const lightPositions = [
      [-30, cylinderHeight / 2, -30], // Bottom-left corner
      [30, cylinderHeight / 2, -30],  // Bottom-right corner
      [-30, cylinderHeight / 2, 30]   // Top-left corner
    ];

    lightPositions.forEach((position, index) => {
      const cylinderMaterial = new THREE.MeshPhongMaterial({ color: lightColors[index] });
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      cylinder.position.set(...position);
      scene.add(cylinder);

      // Add light sources
      if (index === 0) {
        // Directional Light
        const light = new THREE.DirectionalLight(lightColors[index], 0.5);
        light.position.set(...position);
        scene.add(light);
      } else if (index === 1) {
        // Point Light
        const light = new THREE.PointLight(lightColors[index], 1, 50);
        light.position.set(...position);
        scene.add(light);
      } else if (index === 2) {
        // Spot Light
        const light = new THREE.SpotLight(lightColors[index], 1);
        light.position.set(...position);
        light.angle = Math.PI / 6;
        light.penumbra = 0.2;
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
      }
    });
  }

  // RESIZE RENDER ---------------------------------------------------------
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // RENDER ---------------------------------------------------------
  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (plane) {
      const radius = 20; // Radius of the circular path
      const speed = 1; // Speed of the plane
      plane.position.x = radius * Math.cos(-time * speed);
      plane.position.z = radius * Math.sin(-time * speed);
      plane.rotation.y = time * speed + Math.PI / 2; // Rotate the plane to follow its path and add 90 degrees to the right
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

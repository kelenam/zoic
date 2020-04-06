import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/loaders/OBJLoader2.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 25;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 520;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(15, 0, 10);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 1, 1);
  controls.autoRotate = true; 
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  /* SCENE MESH/"FLOOR" IMAGE/TEXT */
  {
    const planeSize = 50;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('zoic.png'); 

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  /* SCENE LIGHTING  */
  {
    const skyColor = 0xffffcc; 
    const groundColor = 0xB97A20;   
    const intensity = 0.5;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = .5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }
  
  /* OBJ LOADER FOR SKULL MODEL */
  {
    const objLoader = new OBJLoader2();
    objLoader.load('baboon-skull-opt.obj', (root) => {
      const loading = document.querySelector('.lds-dual-ring');
      const text = document.querySelector('.text');

      // Handle pre-loading animation
      loading.classList.add('hide');
      text.classList.remove('hide');
      scene.add(root);
    });
  }

  /* SCENE RENDER SIZING */ 
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

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
 
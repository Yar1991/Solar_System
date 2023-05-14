import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import bg from "./assets/stars.jpg";
import sunImg from "./assets/planets/sun.jpg";
import mercuryImg from "./assets/planets/mercury.jpg";
import venusImg from "./assets/planets/venus.jpg";
import earthImg from "./assets/planets/earth.jpg";
import marsImg from "./assets/planets/mars.jpg";
import jupyterImg from "./assets/planets/jupyter.jpg";
import saturnImg from "./assets/planets/saturn.jpg";
import saturnRingImg from "./assets/planets/saturn ring.png";
import uranusImg from "./assets/planets/uranus.jpg";
import uranusRingImg from "./assets/planets/uranus ring.png";
import neptuneImg from "./assets/planets/neptune.jpg";

const appCanvas = document.getElementById("app-canvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
const orbitControls = new OrbitControls(camera, appCanvas as HTMLCanvasElement);

camera.position.set(-90, 140, 140);
orbitControls.update();

const bgTextureLoader = new THREE.CubeTextureLoader();
scene.background = bgTextureLoader.load([bg, bg, bg, bg, bg, bg]);

const renderer = new THREE.WebGLRenderer({
  canvas: appCanvas as HTMLCanvasElement,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.pixelRatio = 2;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

// sun
const sunGeo = new THREE.SphereGeometry(40, 70, 70);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunImg),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 3, 1300);
scene.add(pointLight);

type Ring = {
  innerRadius: number;
  outerRadius: number;
  texture: string;
  angle: number;
};

function createPlanet(
  size: number,
  texture: string,
  position: number,
  ring: Ring | undefined = undefined
) {
  // Creates a planet mesh and adds it to the scene. If a ring is provided, it is added to the planet as well.
  //
  // @param size - The size of the planet (radius ).
  // @param texture - The file path of the texture to be used for the planet.
  // @param position - The x position of the planet.
  // @param ring - Optional ring object to be added to the planet.
  // @returns An object containing the planet mesh and its parent object.

  const planetGeo = new THREE.SphereGeometry(size, 70, 70);
  const planetMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  const centerObj = new THREE.Object3D();
  centerObj.add(planet);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      70
    );
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    centerObj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -ring.angle * Math.PI;
  }
  scene.add(centerObj);
  planet.position.x = position;
  return { planet, centerObj };
}

// planets

const mercury = createPlanet(6, mercuryImg, 150);
const venus = createPlanet(10, venusImg, 300);
const earth = createPlanet(9, earthImg, 450);
const mars = createPlanet(7, marsImg, 600);
const jupyter = createPlanet(19, jupyterImg, 750);
const saturn = createPlanet(17, saturnImg, 900, {
  innerRadius: 20,
  outerRadius: 33,
  texture: saturnRingImg,
  angle: 0.6,
});
const uranus = createPlanet(15, uranusImg, 1050, {
  innerRadius: 17,
  outerRadius: 27,
  texture: uranusRingImg,
  angle: -0.8,
});
const neptune = createPlanet(14, neptuneImg, 1200);

function loop(time: number) {
  // Rotates the planets and center objects in the solar system simulation and updates the scene.
  // @return {void}

  // rotate planets
  sun.rotateY(0.001);
  mercury.planet.rotateY(0.007);
  venus.planet.rotateY(0.006);
  earth.planet.rotateY(0.003);
  mars.planet.rotateY(0.004);
  jupyter.planet.rotateY(0.003);
  saturn.planet.rotateY(0.004);
  uranus.planet.rotateY(0.003);
  neptune.planet.rotateY(0.004);

  // rotate the center objects
  // mercury.centerObj.rotateY(0.008);
  mercury.centerObj.rotateY(0.008 / time + 0.008 / 2);
  venus.centerObj.rotateY(0.007 / time + 0.007 / 2);
  earth.centerObj.rotateY(0.006 / time + 0.006 / 2);
  mars.centerObj.rotateY(0.005 / time + 0.005 / 2);
  jupyter.centerObj.rotateY(0.004 / time + 0.004 / 2);
  saturn.centerObj.rotateY(0.003 / time + 0.003 / 2);
  uranus.centerObj.rotateY(0.002 / time + 0.002 / 2);
  neptune.centerObj.rotateY(0.001 / time + 0.001 / 2);

  orbitControls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(loop);

window.addEventListener("resize", () => {
  // adjusts the scene when the screen is resized
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

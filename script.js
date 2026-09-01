import * as THREE from "https://esm.sh/three@0.180.0";
import { OrbitControls } from "https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("#model-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181b20);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(6, 4.3, 7.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 13;
controls.target.set(0, 0.2, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x242a35, 2.1));
const keyLight = new THREE.DirectionalLight(0xffffff, 5);
keyLight.position.set(5, 7, 5);
keyLight.castShadow = true;
scene.add(keyLight);
const limeLight = new THREE.PointLight(0xcaff3f, 18, 10);
limeLight.position.set(-4, 1, 3);
scene.add(limeLight);

const assembly = new THREE.Group();
assembly.rotation.set(-0.18, 0.55, 0.08);
scene.add(assembly);

const dark = new THREE.MeshStandardMaterial({ color: 0x313740, metalness: 0.82, roughness: 0.24 });
const light = new THREE.MeshStandardMaterial({ color: 0xb9c1c7, metalness: 0.9, roughness: 0.18 });
const orange = new THREE.MeshStandardMaterial({ color: 0xff6846, metalness: 0.2, roughness: 0.36 });
const lime = new THREE.MeshStandardMaterial({ color: 0xcaff3f, metalness: 0.1, roughness: 0.3 });

const base = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.75, 3.3), dark);
base.castShadow = base.receiveShadow = true;
assembly.add(base);

const topPlate = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.22, 2.45), light);
topPlate.position.y = 0.52;
topPlate.castShadow = true;
assembly.add(topPlate);

const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.9, 1.5, 48), orange);
hub.rotation.x = Math.PI / 2;
hub.position.set(0.5, 1.05, 0);
hub.castShadow = true;
assembly.add(hub);

const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 1.56, 40), dark);
bore.rotation.x = Math.PI / 2;
bore.position.copy(hub.position);
assembly.add(bore);

[-1, 1].forEach((x) => [-1, 1].forEach((z) => {
  const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.32, 24), lime);
  bolt.position.set(x * 1.35, 0.77, z * 0.83);
  bolt.castShadow = true;
  assembly.add(bolt);
}));

const arm = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.48, 0.72), dark);
arm.position.set(-1.55, 1.35, 0);
arm.rotation.z = 0.18;
arm.castShadow = true;
assembly.add(arm);

const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshStandardMaterial({ color: 0x20242a, roughness: 1 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.35;
floor.receiveShadow = true;
scene.add(floor);

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

function animate() {
  resize();
  assembly.rotation.y += 0.0015;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

document.querySelector("#year").textContent = new Date().getFullYear();
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));

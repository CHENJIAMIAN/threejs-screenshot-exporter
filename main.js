import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ScreenshotManager } from './ScreenshotManager.js';

// --- 1. 初始化场景 ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
// 添加一些雾效，增加场景深度感
scene.fog = new THREE.Fog(0x111111, 20, 100);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 10, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // 开启阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- 2. 添加场景内容 ---

// 地面
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.8,
    metalness: 0.2
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// 随机生成一些立方体
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
for (let i = 0; i < 50; i++) {
    const material = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xffffff,
        roughness: 0.1,
        metalness: 0.5
    });
    const mesh = new THREE.Mesh(boxGeometry, material);

    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.z = (Math.random() - 0.5) * 40;
    mesh.position.y = 1 + Math.random() * 2;

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    const scale = 0.5 + Math.random();
    mesh.scale.set(scale, scale, scale);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
}

// 灯光
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 100;
dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
scene.add(dirLight);

// --- 3. 动画循环 ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// 窗口大小调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. 截图功能集成 ---

// 初始化管理器
const screenshotManager = new ScreenshotManager();

/**
 * 核心导出函数，供 Vue 组件调用
 * @param {Object} config 导出配置
 * @returns {Promise<Blob>}
 */
export async function captureScene(config) {
    const { width, height, format, watermark, watermarkImage, onProgress } = config;

    // 构建水印配置对象
    let watermarkConfig = null;
    if (watermark) {
        watermarkConfig = {
            text: watermark,
            fontSize: Math.floor(width * 0.025), // 动态字体大小
            color: 'rgba(255, 255, 255, 0.8)',
            position: 'bottom-right'
        };

        // 如果用户提供了水印图片，则添加图片水印
        if (watermarkImage) {
            watermarkConfig.image = watermarkImage;
            watermarkConfig.scale = 0.1; // 图片占宽度的 10%
        }
    }

    return await screenshotManager.capture(renderer, scene, camera, {
        width,
        height,
        format,
        quality: 0.95,
        watermark: watermarkConfig,
        onProgress
    });
}


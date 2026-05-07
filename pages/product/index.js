import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {ToastComponent} from "../../components/toast/index.js";
import {MainPage} from "../main/index.js";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Utils from "../../utils/cashbackUtils.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData(id) {
        const cashbackData = [
            { id: 1, title: 'Рестораны и кафе', percent: 10, src: 'assets/cafe.png', text: 'Кешбэк за каждый обед и кофе.', details: 'Получайте 10% бонусами за покупки в любых заведениях питания. Акция действует весь апрель.' },
            { id: 2, title: 'Такси и транспорт', percent: 15, src: 'assets/taxi.png', text: 'Поездки по городу с выгодой.', details: 'Сбер возвращает 15% за Ваши поездки на такси и общественном транспорте. Доступно для владельцев прайм.' },
            { id: 3, title: 'Супермаркеты', percent: 5, src: 'assets/supermarket.png', text: 'Выгода на продукты каждый день.', details: 'Покупайте продукты в любимых магазинах и возвращайте 5% от суммы чека бонусами СберСпасибо.' },
            { id: 4, title: 'Одежда и обувь', percent: 20, src: 'assets/fashion.png', text: 'Обновляйте гардероб выгодно.', details: 'Максимальный кешбэк 20% на категорию мода в партнерских магазинах SberID.' }
        ];

        return cashbackData.find(item => item.id === parseInt(id));
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div class="p-4 p-md-5">
                <div id="product-page"></div>
            </div>
        `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    clickActivate(e, id) {
        const btn = e.target;
        const percentInput = document.getElementById('percent-input');
        const newPercent = parseInt(percentInput.value);

        if (isNaN(newPercent) || newPercent < 0 || newPercent > 100) {
            const toastContainer = document.getElementById('toast-container');
            const toast = new ToastComponent(toastContainer);
            toast.show('Введите корректный процент (0–100)');
            return;
        }

        // --- Task requirement: do...while loop (post-condition) ---
        Utils.simulateProcessing(3); 

        const saved = JSON.parse(localStorage.getItem('cashbackPercents') || '{}');
        saved[id] = newPercent;
        localStorage.setItem('cashbackPercents', JSON.stringify(saved));

        const percentDisplay = document.getElementById('percent-display');
        if (percentDisplay) {
            percentDisplay.textContent = newPercent + '%';
        }

        btn.innerText = 'Активировано';
        btn.classList.add('active');

        const toastContainer = document.getElementById('toast-container');
        const toast = new ToastComponent(toastContainer);
        toast.show('Категория успешно активирована!');
    }

    init3DModel() {
        const container = document.getElementById('product-3d-canvas');
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf2f3f5);

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Task Part 2: Load .glb model
        // Using a gold coin as a fallback/default object
        const loader = new GLTFLoader();
        
        // --- Coin Model (Cylinder) ---
        const coinGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
        const coinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffd700, // Gold
            metalness: 0.9, 
            roughness: 0.1 
        });
        const coin = new THREE.Mesh(coinGeometry, coinMaterial);
        coin.rotation.x = Math.PI / 2; // Flat position
        scene.add(coin);

        // Try loading a real model (even if it's missing, we show the coin)
        loader.load(
            'assets/models/cashback_coin.glb', 
            (gltf) => {
                scene.remove(coin); // Remove fallback
                scene.add(gltf.scene);
                gltf.scene.position.set(0, 0, 0);
            },
            undefined,
            (error) => {
                console.warn('Could not load .glb model, using fallback coin.', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            // Spinning coin animation
            coin.rotation.z += 0.02; 
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData(this.id);
        const product = new ProductComponent(this.pageRoot);
        product.render(data, this.clickActivate.bind(this));

        // --- Demonstrate Part 1 Functions ---
        // Все входные данные собираются у пользователя через prompt() в консоли.
        const {
            streakStr,
            transactions,
            defaultConfig,
            userConfig,
            historyCount,
            historyValue,
        } = Utils.readCashbackInputsFromConsole();

        // Task 2.3: Streak
        const maxStreak = Utils.getMaxCashbackStreak(streakStr);
        document.getElementById('streak-display').textContent = maxStreak;

        // Task 1.4: Stats
        const stats = Utils.calculateTransactionStats(transactions);
        document.getElementById('stats-display').innerHTML = `
            <div>Обороты за неделю: ${stats.sum} ₽</div>
            <div>Индекс лояльности: ${stats.mult.toExponential(2)}</div>
        `;

        // Task 3.1: Merge
        const finalConfig = Utils.mergeAccountConfigs(defaultConfig, userConfig);
        console.log('Merged Config:', finalConfig);

        // Task 1.9: Fill
        const history = Utils.initCashbackHistory(historyCount, historyValue);
        console.log('Initial History:', history);

        // Initialize 3D
        this.init3DModel();
    }
}

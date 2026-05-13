# Лабораторная работа №4 — База для 3D-галереи (Three.js)

> **Тема:** «Подготовка SPA к интеграции с Three.js, GLB-моделями и
> интерактивной 3D-сценой».
> **Курс:** «Программирование сетевых приложений» (БМСТУ).

📖 **Методичка преподавателя:** [iu5git/JavaScript — tutorials/threejs](https://github.com/iu5git/JavaScript/blob/main/tutorials/threejs/README.md)

---

## 📌 Что было сделано

В этой ветке закреплён **базовый каркас приложения**, на который позже
накладывается интеграция с **Three.js** (полная реализация — на ветке
`hw1`). Здесь хранится «чистая» компонентная архитектура без
3D-логики, чтобы при необходимости можно было откатиться к стабильному
состоянию SPA.

| Возможность                                | Статус на этой ветке |
| ------------------------------------------ | -------------------- |
| Главная: сетка кешбэк-карточек             | ✅                   |
| Детальная страница                         | ✅                   |
| Toast-уведомления                          | ✅                   |
| Кнопка «Назад»                             | ✅                   |
| **3D-сцена с моделью**                     | 🧪 готово на `hw1`    |
| **OrbitControls (вращение)**               | 🧪 готово на `hw1`    |
| **GLTFLoader для .glb**                    | 🧪 готово на `hw1`    |

---

## 🪙 Теория Three.js

### Минимальный сетап сцены

Любая сцена Three.js собирается из трёх объектов:

| Сущность                     | За что отвечает                                  |
| ---------------------------- | ------------------------------------------------ |
| `THREE.Scene`                | Контейнер всех объектов и источников света       |
| `THREE.PerspectiveCamera`    | Точка зрения, FOV, near/far plane                |
| `THREE.WebGLRenderer`        | Рисует кадр в `<canvas>` через WebGL             |

```js
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(w, h);
container.appendChild(renderer.domElement);
```

### Что добавляется поверх

| Аддон               | Назначение                                         |
| ------------------- | -------------------------------------------------- |
| `OrbitControls`     | Вращение/зум мышью или пальцем                     |
| `GLTFLoader`        | Загрузка `.glb` / `.gltf` моделей                  |
| `AmbientLight`      | Равномерная фоновая засветка                       |
| `DirectionalLight`  | Направленный «солнечный» свет                      |

### Цикл рендера

```js
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

---

## 🧱 Компонентная архитектура (как в `cards-layout`)

```
components/
├── product-card/index.js   — карточка категории
├── product/index.js        — детальная панель
├── back-button/index.js    — кнопка «← Назад»
└── toast/index.js          — уведомление

pages/
├── main/index.js           — список категорий
└── product/index.js        — деталка (сюда будет вставлен <canvas> 3D)
```

Подключение Three.js будет через **importmap**:

```html
<script type="importmap">
  { "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  } }
</script>
```

---

## 🗂 Структура проекта

```
.
├── index.html                # точка входа SPA
├── main.js                   # монтирование MainPage
├── style.css                 # стили
│
├── pages/
│   ├── main/index.js
│   └── product/index.js      # сюда добавится init3DModel()
│
└── components/
    ├── product-card/
    ├── product/
    ├── back-button/
    └── toast/
```

---

## ▶️ Запуск

```bash
npm install
npx serve .
```

Открыть `http://localhost:5500`.

---

## 🧪 Сценарий проверки (на этой ветке)

| #  | Действие                            | Ожидание                          |
| -- | ----------------------------------- | --------------------------------- |
| 1  | Открыть главную                     | 4 карточки кешбэка                |
| 2  | Кликнуть карточку                   | Открывается деталка               |
| 3  | Нажать «Активировать»               | Toast «Категория активирована»    |
| 4  | Кликнуть «← Назад»                  | Возврат на главную                |

Полное 3D-поведение (вращение монеты, GLB-модель, освещение) — см. `hw1`.

---

## 📚 Связанные ветки

| Ветка                   | Содержание                                    |
| ----------------------- | --------------------------------------------- |
| `cards-layout`          | Чистая SPA-вёрстка                            |
| **`three-js-gallery`** *(эта)* | База, готовая к 3D-интеграции          |
| `hw1`                   | Финальная версия с Three.js + GLTFLoader      |

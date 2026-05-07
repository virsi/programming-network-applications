# Программирование сетевых приложений (БМСТУ)

> Репозиторий с лабораторными работами курса «Программирование сетевых
> приложений». Каждая ЛР живёт в **отдельной git-ветке** — это
> позволяет легко переключаться между готовыми этапами проекта.
>
> Сквозной кейс — система кешбэка «Sber Cashback»: от статической
> вёрстки калькулятора до full-stack SPA с Express-бэкендом.

---

## 🗺 Карта веток

| #  | Ветка                | Тема                                 | Стек                                 |
| -- | -------------------- | ------------------------------------ | ------------------------------------ |
| 1  | `calculator-layout`  | HTML/CSS-вёрстка калькулятора        | HTML5, CSS Grid, light/dark themes   |
| 2  | `calc-implementation`| JS-логика калькулятора               | Vanilla JS, машина состояний         |
| 3  | `cards-layout`       | SPA с кешбэк-карточками              | Vanilla JS + Bootstrap 5             |
| 4  | `three-js-gallery`   | База для 3D-галереи                  | подготовка к Three.js                |
| 5  | `cors-lab`           | XMLHttpRequest и CORS                | XHR + live-server proxy              |
| 6  | `fetch-lab`          | Fetch API + CRUD                     | `fetch`, async/await, Vite           |
| 7  | `express-js-cards`   | REST-бэкенд                          | Node.js, Express 5, JSON-storage     |
| 8  | `hw1`                | ДЗ: алгоритмы JS + интеграция в UI   | Vanilla JS, Three.js, prompt-ввод    |

---

## 🧭 Как переключаться между лабами

```bash
git fetch --all
git switch calculator-layout    # ЛР 1: вёрстка
git switch calc-implementation  # ЛР 2: логика
git switch cards-layout         # ЛР 3: SPA
# и т.д.
```

В каждой ветке лежит свой `README.md` с подробным отчётом:
теория, диаграммы, таблицы, сценарии проверки.

---

## 🎯 Сквозная история проекта

```
calculator-layout
       │
       ▼
calc-implementation        ← логика калькулятора
       │
       ▼
cards-layout               ← переключение на SPA-витрину кешбэка
       │
       ├──► three-js-gallery
       │           │
       │           ▼
       │         hw1       ← алгоритмические задачи + 3D
       │
       ├──► cors-lab        ← XHR
       │           │
       │           ▼
       │         fetch-lab  ← fetch + Vite
       │
       └──► express-js-cards (backend)
```

Все «сетевые» ветки (`cors-lab`, `fetch-lab`) ходят за данными в
бэкенд из `express-js-cards`.

---

## 📊 Краткая таблица технологий

| Категория       | Использовано                                            |
| --------------- | ------------------------------------------------------- |
| Разметка        | HTML5, семантические теги                               |
| Стили           | CSS Variables, CSS Grid, Flexbox, Bootstrap 5           |
| Скрипты         | Vanilla ES Modules, без фреймворков                     |
| Сетевое         | `XMLHttpRequest`, `fetch`, dev-proxy                    |
| 3D              | Three.js 0.160 + GLTFLoader + OrbitControls             |
| Backend         | Node.js, Express 5, файловое хранилище JSON             |
| Сборка          | Vite 8                                                  |
| Хранение клиента| `localStorage`                                          |
| Шрифты          | Google Fonts: Inter                                     |

---

## ▶️ Быстрый старт

```bash
# Backend (если ветка ему нужен)
git switch express-js-cards
npm install
npm run dev                 # http://localhost:3000

# Frontend (в другой консоли)
git switch fetch-lab        # или любая фронтовая ветка
npm install
npm run dev                 # http://localhost:5173
```

---

## 📝 Лицензия

Учебный проект для курса БМСТУ.

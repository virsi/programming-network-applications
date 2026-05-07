# Лабораторная работа №5 (часть 1) — XMLHttpRequest и проблема CORS

> **Тема:** «Сетевое взаимодействие через XHR. Same-Origin Policy и CORS»
> **Курс:** «Программирование сетевых приложений» (БМСТУ).
> **База:** ветка `cards-layout` + Express-бэкенд.

---

## 📌 Что было сделано

В этой ветке впервые подключается **внешний бэкенд**. Фронт перестаёт
быть статикой с хардкодом и начинает ходить за данными в API.
Используется ещё «классический» транспорт — `XMLHttpRequest` — чтобы
прочувствовать, насколько чище становится `fetch` в следующей ЛР.

| Что внедрено                                | Файл                             |
| ------------------------------------------- | -------------------------------- |
| XHR-обёртка (`get/post/patch/delete`)       | `modules/ajax.js`                |
| Билдер URL-ов API                           | `modules/categoriesUrls.js`     |
| Поиск категорий по `?title=`                | `components/filter/`             |
| Форма редактирования / добавления           | `components/edit-form/`          |
| Страница `EditPage`                         | `pages/edit/`                    |
| Прокси `/api → :3000` через live-server     | `package.json` script `start`    |

---

## 🌐 Теория: Same-Origin Policy и CORS

Браузер по умолчанию **запрещает** скрипту с одного origin'а ходить
на другой origin. Origin = `(scheme, host, port)`. Это и есть **SOP**
(Same-Origin Policy) — главный механизм защиты в вебе.

### Когда возникает CORS

```
Front: http://localhost:5501       ┐
Back:  http://localhost:3000       ┘  ← разные порты = разные origin
```

Браузер блокирует ответ, если сервер не вернул правильные заголовки:

| Заголовок                           | Что делает                                  |
| ----------------------------------- | ------------------------------------------- |
| `Access-Control-Allow-Origin`       | Какой origin может читать ответ             |
| `Access-Control-Allow-Methods`      | Какие методы разрешены (`GET`, `POST`, ...) |
| `Access-Control-Allow-Headers`      | Какие custom-заголовки разрешены            |
| `Access-Control-Allow-Credentials`  | Можно ли отправлять cookies                 |

### Простой vs preflight запрос

```
GET / простой POST (form-data) → летит сразу
                                        │
                                        ▼
                            проверка ответа браузером
```

```
PATCH / DELETE / JSON-POST    → preflight: OPTIONS …
                                        │
                                        ▼
                            если 200 + Allow-* → летит основной
```

### Способы обхода в этой ЛР

В нашем проекте **не настраиваем CORS на сервере**, а используем
**proxy в dev-режиме** через `live-server`:

```json
"start": "npx live-server --port=5501 --proxy=/api:http://localhost:3000/api"
```

Браузер думает, что `/api` — это тот же origin, что и страница.
Никаких CORS-заголовков сервер слать не обязан.

> 💡 В продакшене proxy обычно делает nginx, в dev — Vite/webpack/live-server.

---

## 🔄 Жизненный цикл XHR

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/categories');
xhr.send();

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {            // 4 = DONE
        callback(JSON.parse(xhr.responseText), xhr.status);
    }
};
```

| `readyState` | Имя              | Что произошло                          |
| ------------ | ---------------- | -------------------------------------- |
| 0            | UNSENT           | `open()` ещё не вызван                 |
| 1            | OPENED           | `open()` вызван, `send()` ещё нет      |
| 2            | HEADERS_RECEIVED | Получены заголовки ответа              |
| 3            | LOADING          | Идёт скачивание тела                   |
| 4            | DONE             | Готово (успех или ошибка)              |

---

## 🧱 Слой `modules/ajax.js`

Класс с 4 методами, каждый принимает callback вместо промиса:

```js
get(url, callback)               { /* xhr GET     */ }
post(url, data, callback)        { /* xhr POST    */ }
patch(url, data, callback)       { /* xhr PATCH   */ }
delete(url, callback)            { /* xhr DELETE  */ }

_handleResponse(xhr, callback) {
    const isJson = (xhr.getResponseHeader('Content-Type') || '').includes('application/json');
    if (!xhr.responseText || !isJson) return callback(null, xhr.status);
    try   { callback(JSON.parse(xhr.responseText), xhr.status); }
    catch { callback(null, xhr.status); }
}
```

**Минусы такого API** *(ради контраста с fetch в `fetch-lab`)*:

- 🔴 Колбэки → быстро превращаются в callback hell.
- 🔴 Нет нативной отмены (`AbortController` появился позже).
- 🔴 Нет встроенных промисов — обёртки приходится писать руками.

---

## 🆕 Новые компоненты

| Компонент            | Назначение                                       |
| -------------------- | ------------------------------------------------ |
| `FilterComponent`    | Поиск с дебаунсом, дёргает `GET /api/categories?title=…` |
| `EditFormComponent`  | Форма с полями `title / percent / src / details` |
| `EditPage`           | Создание (`POST`) или редактирование (`PATCH`)   |

---

## 🗂 Структура проекта

```
.
├── index.html
├── main.js
├── package.json                # ★ live-server proxy
├── tutorial.md                 # методичка по ЛР
│
├── modules/
│   ├── ajax.js                 # ★ XMLHttpRequest-обёртка
│   └── categoriesUrls.js       # билдер URL
│
├── pages/
│   ├── main/index.js           # GET список
│   ├── product/index.js        # GET / DELETE
│   └── edit/index.js           # POST / PATCH
│
└── components/
    ├── product-card/
    ├── product/
    ├── back-button/
    ├── filter/                 # ★ новый
    ├── edit-form/              # ★ новый
    └── toast/
```

---

## ▶️ Запуск

```bash
# 1) Backend
cd ../express-js-cards && npm i && npm run dev    # :3000

# 2) Frontend (эта ветка) — стартует с прокси /api → :3000
npm install
npm start                                          # :5501
```

Открыть `http://localhost:5501`.

---

## 🧪 Сценарий проверки

| #  | Действие                                | Ожидание                              |
| -- | --------------------------------------- | ------------------------------------- |
| 1  | Открыть DevTools → Network              | XHR-запрос на `/api/categories`       |
| 2  | Выключить proxy → попробовать `:3000`   | CORS-ошибка в консоли                 |
| 3  | Включить proxy → перезагрузить          | Запрос проходит                       |
| 4  | Удалить категорию                       | Предварительный `OPTIONS` (preflight) |
| 5  | Открыть Response → `Content-Type`       | `application/json`                    |

---

## 📚 Связанные ветки

| Ветка                  | Содержание                                       |
| ---------------------- | ------------------------------------------------ |
| `cards-layout`         | Хардкод данных                                   |
| **`cors-lab`** *(эта)* | XHR + CORS + dev-proxy                           |
| `fetch-lab`            | Тот же CRUD, но через `fetch` + Vite + async/await |
| `express-js-cards`     | Backend, к которому ходят запросы                |

# Лабораторная работа №5 — AJAX и `fetch` API

> **Тема:** «Асинхронное взаимодействие с сервером без перезагрузки страницы»
> **Курс:** «Программирование сетевых приложений» (БМСТУ).
> **База:** ветка `cards-layout` + Express-бэкенд из `express-js-cards`.

---

## 📌 Что было сделано

Хардкод данных категорий заменён на **полноценный CRUD через REST API**.
Все операции — `GET`, `POST`, `PATCH`, `DELETE` — выполняются через
браузерный `fetch` и обёрнуты в централизованный класс `Ajax`.

| Возможность                          | Метод       | URL                       |
| ------------------------------------ | ----------- | ------------------------- |
| Получить список категорий            | `GET`       | `/api/categories`         |
| Поиск по названию                    | `GET`       | `/api/categories?title=…` |
| Получить категорию                   | `GET`       | `/api/categories/:id`     |
| Создать новую                        | `POST`      | `/api/categories`         |
| Обновить                             | `PATCH`     | `/api/categories/:id`     |
| Удалить                              | `DELETE`    | `/api/categories/:id`     |

Бэкенд для всего этого собран на **Express.js** (см. ветку
[`express-js-cards`](#связанные-ветки)).

---

## 🌐 Теория

### Что такое AJAX

**AJAX** *(Asynchronous JavaScript And XML)* — подход, при котором
страница обновляется без полной перезагрузки. Данные подгружаются с
сервера в фоне и подставляются в DOM.

| Транспорт                          | Особенность                                    |
| ---------------------------------- | ---------------------------------------------- |
| `XMLHttpRequest` *(legacy)*        | Колбэки, многословный API                      |
| **`fetch` API** *(используется)*   | Промисы, чистый async/await, идеоматичный JSON |

### Жизненный цикл `fetch`

```
fetch(url, opts)
   │
   ├── network → сервер → ответ
   │
   ▼
Promise<Response>     ← статус, заголовки, .text()/.json()
   │
   ▼
.json() / .text()     ← ещё один Promise — тело
   │
   ▼
полезная нагрузка
```

### HTTP-методы и идемпотентность

| Метод    | Назначение            | Идемпотентен? | Тело запроса |
| -------- | --------------------- | ------------- | ------------ |
| `GET`    | Чтение                | ✅            | ❌           |
| `POST`   | Создание              | ❌            | ✅           |
| `PATCH`  | Частичное обновление  | ❌*           | ✅           |
| `PUT`    | Полная замена         | ✅            | ✅           |
| `DELETE` | Удаление              | ✅            | ❌           |

\* `PATCH` неидемпотентен в общем случае, но обычно реализуется идемпотентно.

---

## 🧱 Слой `modules/ajax.js`

Все сетевые вызовы централизованы в одном классе. Это даёт:

- ✅ единое место для логирования и обработки ошибок;
- ✅ возможность подменить транспорт (например, на XHR) одним рефакторингом;
- ✅ единый формат ответа `{data, status}`.

```js
class Ajax {
    async get(url)            { /* fetch GET  */ }
    async post(url, data)     { /* fetch POST */ }
    async patch(url, data)    { /* fetch PATCH */ }
    async delete(url)         { /* fetch DELETE */ }

    async _handleResponse(response) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        return { data, status: response.status };
    }
}
export const ajax = new Ajax();
```

---

## 🗺 Слой `modules/categoriesUrls.js`

Чтобы URL-ы не были разбросаны по страницам, есть отдельный билдер:

```js
class CategoriesUrls {
    constructor() { this.baseUrl = '/api'; }

    getCategories(title)        { return title ? `${this.baseUrl}/categories?title=${encodeURIComponent(title)}` : `${this.baseUrl}/categories`; }
    getCategoryById(id)         { return `${this.baseUrl}/categories/${id}`; }
    createCategory()            { return `${this.baseUrl}/categories`; }
    updateCategoryById(id)      { return `${this.baseUrl}/categories/${id}`; }
    removeCategoryById(id)      { return `${this.baseUrl}/categories/${id}`; }
}
```

Если URL поменяется, переписать нужно ровно одно место.

---

## ⚡ Vite + dev-proxy

Вместо CORS-сложностей фронт ходит в `/api/*`, а Vite проксирует на
backend, который слушает `:3000`:

```js
// vite.config.js
export default {
    server: {
        proxy: { '/api': 'http://localhost:3000' },
    },
};
```

Это позволяет фронту и бэку выглядеть как одно приложение для браузера.

---

## 🆕 Новые компоненты

| Компонент            | Назначение                                  |
| -------------------- | ------------------------------------------- |
| `FilterComponent`    | Поиск категорий по названию (`debounce`)    |
| `EditFormComponent`  | Форма создания/редактирования категории     |
| `EditPage`           | Страница `/edit/:id?` (новая или существующая) |

---

## 🗂 Структура проекта

```
.
├── index.html
├── main.js
├── vite.config.js              # ★ dev-proxy на /api
├── package.json                # scripts: dev, build, preview
│
├── modules/
│   ├── ajax.js                 # ★ обёртка над fetch
│   └── categoriesUrls.js       # ★ билдер URL-ов
│
├── pages/
│   ├── main/index.js           # GET /api/categories
│   ├── product/index.js        # GET / DELETE /api/categories/:id
│   └── edit/index.js           # POST / PATCH /api/categories[/:id]
│
└── components/
    ├── product-card/
    ├── product/
    ├── back-button/
    ├── filter/                 # ★ поиск
    ├── edit-form/              # ★ форма
    └── toast/
```

---

## ▶️ Запуск

```bash
# 1) Поднимаем backend (см. ветку express-js-cards)
cd ../express-js-cards && npm i && npm run dev   # :3000

# 2) В этой ветке
npm install
npm run dev                                       # :5173
```

Открыть `http://localhost:5173`.

---

## 🧪 Сценарий проверки

| #  | Действие                                  | Ожидание                          |
| -- | ----------------------------------------- | --------------------------------- |
| 1  | Открыть главную                           | Категории подгружаются с бэкенда  |
| 2  | Ввести в поиск «такси»                    | Список фильтруется по `?title=`   |
| 3  | Нажать «+ Добавить категорию»             | Открывается форма создания        |
| 4  | Заполнить и сохранить                     | `POST /api/categories` → toast    |
| 5  | Открыть карточку → «Редактировать»        | Форма с предзаполненными полями   |
| 6  | «Удалить» → подтвердить                   | `DELETE /:id` → toast «удалена»   |
| 7  | Положить бэкенд (Ctrl+C)                  | Toast «Не удалось получить…»      |

---

## 📚 Связанные ветки

| Ветка                  | Содержание                                           |
| ---------------------- | ---------------------------------------------------- |
| `cards-layout`         | Исходный SPA с хардкодом                             |
| `three-js-gallery`     | Параллельная ветка с подготовкой к 3D                |
| **`fetch-lab`** *(эта)* | AJAX/Fetch + CRUD                                   |
| `cors-lab`             | Подкручиваем CORS-заголовки                          |
| `express-js-cards`     | Backend (Express) к которому ходит этот фронт        |

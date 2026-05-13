# Лабораторная работа №6 — REST API на Express.js

> **Тема:** «Backend-сервис на Node.js. CRUD, маршрутизация, middleware,
> файловое хранилище».
> **Курс:** «Программирование сетевых приложений» (БМСТУ).
> **Применение:** API, который кушают фронт-ветки `cors-lab` и `fetch-lab`.

📖 **Методичка преподавателя:** [iu5git/JavaScript — tutorials/backend/example-expressjs](https://github.com/iu5git/JavaScript/blob/main/tutorials/backend/example-expressjs/README.md)

---

## 📌 Что было сделано

Реализован минималистичный, но полнофункциональный REST API для системы
кешбэк-категорий «СберСпасибо». Хранилище — JSON-файл на диске; этого
достаточно для демонстрации **слоистой архитектуры** Controller → Service → Repository.

| Возможность                         | Метод   | URL                        | HTTP коды           |
| ----------------------------------- | ------- | -------------------------- | ------------------- |
| Список всех категорий               | `GET`   | `/categories`              | 200                 |
| Поиск по `title`                    | `GET`   | `/categories?title=кафе`   | 200                 |
| Поиск по `text` (отдельный эндпоинт)| `GET`   | `/search?text=…`           | 200, 400            |
| Получить одну                       | `GET`   | `/categories/:id`          | 200, 404            |
| Создать                             | `POST`  | `/categories`              | 201, 400            |
| Обновить (частично)                 | `PATCH` | `/categories/:id`          | 200, 404            |
| Удалить                             | `DELETE`| `/categories/:id`          | 204, 404            |
| Любой неизвестный URL               | —       | `*`                        | 404                 |
| Внутренняя ошибка                   | —       | —                          | 500                 |

---

## 🏛 Архитектура: 3 слоя

```
HTTP запрос
      │
      ▼
┌─────────────────┐
│   Routes        │  src/routes/categories.js   — связывают URL и контроллеры
└────────┬────────┘
         ▼
┌─────────────────┐
│  Controllers    │  src/controllers/...        — валидация, маппинг req↔res
└────────┬────────┘
         ▼
┌─────────────────┐
│   Services      │  src/services/cashbackService.js — бизнес-логика
└────────┬────────┘
         ▼
┌─────────────────┐
│ FileService     │  src/services/fileService.js — чтение/запись JSON
└─────────────────┘
         ▼
   src/data/cashback.json
```

### Зачем такое разделение

| Слой         | За что отвечает                                    | Пример                            |
| ------------ | -------------------------------------------------- | --------------------------------- |
| Routes       | Mapping URL → controller                           | `router.post('/', createCategory)` |
| Controllers  | Парсинг `req`, валидация, формирование `res`       | `if (!title) return res.status(400)…` |
| Services     | Бизнес-правила, неосведомлённые об HTTP            | `findAll`, `create`, `update`      |
| FileService  | Низкоуровневые операции (`fs.readFileSync` и т.п.) | `readData`, `writeData`            |

При желании заменить файл на PostgreSQL — придётся переписать только
`fileService.js`. Контроллеры и сервисы не пострадают.

---

## 🧱 Express middleware

```js
app.use(express.json());                   // парсинг тела JSON

app.use((req, res, next) => {              // логирование
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/categories', categoriesRouter);  // подмонтировка роутера

app.use((req, res) => {                    // 404 fallback
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {         // глобальный error handler
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});
```

| Тип middleware              | Что делает                                |
| --------------------------- | ----------------------------------------- |
| `express.json()`            | `req.body` ← из JSON                      |
| Кастомный логгер            | Дату + метод + URL в консоль              |
| 404-fallback                | Срабатывает, если ни один роут не подошёл |
| Error handler (4 аргумента) | Перехватывает любые `next(err)`           |

---

## 📦 Модель данных

```json
{
    "id": 1,
    "title": "Рестораны и кафе",
    "percent": 10,
    "src": "assets/cafe.png",
    "text": "Поездки по городу с выгодой."
}
```

| Поле       | Тип       | Источник           |
| ---------- | --------- | ------------------ |
| `id`       | `number`  | автоинкремент в `create` (`max(id) + 1`) |
| `title`    | `string`  | от клиента         |
| `percent`  | `number`  | от клиента         |
| `src`      | `string`  | путь к иконке      |
| `text`     | `string`  | описание           |

Хранится в `src/data/cashback.json` — обычный массив.

---

## 🔁 Жизненный цикл `POST /categories`

```
1. Клиент шлёт POST /categories с JSON-телом
2. express.json() парсит body → req.body
3. categoriesRouter сопоставляет POST '/' → createCategory
4. createCategory валидирует обязательные поля
5. cashbackService.create:
       a. fileService.readData() читает JSON
       b. вычисляет новый id (max + 1)
       c. push в массив
       d. fileService.writeData() пишет на диск
6. Контроллер отвечает 201 + полным объектом
```

---

## 🆔 Автоинкремент id

```js
const newId = categories.length > 0
    ? Math.max(...categories.map(c => c.id)) + 1
    : 1;
```

Простое решение: берём максимум из существующих + 1. Подходит для
учебного проекта; в проде нужны UUID или sequence в БД.

---

## 🧪 Postman-коллекция

В корне репозитория лежит `Sber_Cashback_API.postman_collection.json` —
готовый набор запросов для импорта в Postman/Insomnia. Можно сразу
проверить все 5 эндпоинтов одним кликом.

---

## 🗂 Структура проекта

```
.
├── src/
│   ├── index.js                    # ★ Express app: middleware, listen
│   ├── routes/
│   │   └── categories.js           # router /categories/*
│   ├── controllers/
│   │   └── cashbackController.js   # 6 контроллеров (CRUD + search)
│   ├── services/
│   │   ├── cashbackService.js      # бизнес-логика
│   │   └── fileService.js          # fs.readFileSync / writeFileSync
│   └── data/
│       └── cashback.json           # «БД» категорий
│
├── package.json                    # express + nodemon
└── Sber_Cashback_API.postman_collection.json
```

---

## ▶️ Запуск

```bash
npm install
npm run dev          # nodemon — авто-перезапуск
# или
npm start            # обычный node
```

Сервер слушает `http://localhost:3000`.

---

## 🧪 Сценарий проверки (curl)

```bash
# 1. Получить все категории
curl http://localhost:3000/categories

# 2. Поиск по title
curl "http://localhost:3000/categories?title=кафе"

# 3. Получить одну
curl http://localhost:3000/categories/1

# 4. Создать
curl -X POST http://localhost:3000/categories \
     -H "Content-Type: application/json" \
     -d '{"title":"Развлечения","percent":7,"src":"assets/fun.png","text":"Кино, театры"}'

# 5. Обновить
curl -X PATCH http://localhost:3000/categories/5 \
     -H "Content-Type: application/json" \
     -d '{"percent":9}'

# 6. Удалить
curl -X DELETE http://localhost:3000/categories/5
```

---

## 📚 Связанные ветки

| Ветка                       | Содержание                                      |
| --------------------------- | ----------------------------------------------- |
| `cors-lab`                  | Frontend, ходит сюда через XHR + dev-proxy      |
| `fetch-lab`                 | Frontend, ходит сюда через `fetch` + Vite-proxy |
| **`express-js-cards`** *(эта)* | Backend на Express.js                        |

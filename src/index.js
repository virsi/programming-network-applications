const express = require('express');
const path = require('path');
const categoriesRouter = require('./routes/categories');
const cashbackController = require('./controllers/cashbackController');
const cashbackService = require('./services/cashbackService');

const app = express();
const PORT = 3000;

// Определяем путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/cashback.json');

// Инициализируем сервис
cashbackService.init(DATA_FILE_PATH);

app.use(express.json());

// Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Раздача собранного фронтенда как статики
app.use(express.static(path.join(__dirname, '..', 'public')));

// Подключение маршрутов
app.get('/api/search', cashbackController.searchCategories);
app.use('/api/categories', categoriesRouter);

// Обработка 404 для API
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Sber Cashback API запущен по адресу http://localhost:${PORT}`);
});

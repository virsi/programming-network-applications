const cashbackService = require('../services/cashbackService');

const getAllCategories = (req, res) => {
    const { title } = req.query;
    const categories = cashbackService.findAll(title);
    res.json(categories);
};

const searchCategories = (req, res) => {
    const { text } = req.query;

    if (!text) {
        return res.status(400).json({ error: 'Параметр text обязателен' });
    }

    const categories = cashbackService.search(text);
    res.json(categories);
};

const getCategoryById = (req, res) => {
    const id = parseInt(req.params.id);
    const category = cashbackService.findOne(id);

    if (!category) {
        return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.json(category);
};

const createCategory = (req, res) => {
    const { src, title, text, percent } = req.body;

    if (!src || !title || !text || percent === undefined) {
        return res.status(400).json({ error: 'Не все поля заполнены (src, title, text, percent)' });
    }

    const newCategory = cashbackService.create({ src, title, text, percent });
    res.status(201).json(newCategory);
};

const updateCategory = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedCategory = cashbackService.update(id, req.body);

    if (!updatedCategory) {
        return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.json(updatedCategory);
};

const deleteCategory = (req, res) => {
    const id = parseInt(req.params.id);
    const success = cashbackService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Категория не найдена' });
    }

    res.status(204).send();
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
};

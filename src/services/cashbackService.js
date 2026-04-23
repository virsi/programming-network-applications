const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title) => {
    const categories = fileService.readData(dataFilePath);
    if (title) {
        return categories.filter(category =>
            category.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return categories;
};

const findOne = (id) => {
    const categories = fileService.readData(dataFilePath);
    return categories.find(category => category.id === id);
};

const search = (text) => {
    const categories = fileService.readData(dataFilePath);
    return categories.filter(category =>
        category.text.toLowerCase().includes(text.toLowerCase())
    );
};

const create = (categoryData) => {
    const categories = fileService.readData(dataFilePath);

    const newId = categories.length > 0
        ? Math.max(...categories.map(c => c.id)) + 1
        : 1;

    const newCategory = { id: newId, ...categoryData };
    categories.push(newCategory);
    fileService.writeData(dataFilePath, categories);

    return newCategory;
};

const update = (id, categoryData) => {
    const categories = fileService.readData(dataFilePath);
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) return null;

    categories[index] = { ...categories[index], ...categoryData };
    fileService.writeData(dataFilePath, categories);

    return categories[index];
};

const remove = (id) => {
    const categories = fileService.readData(dataFilePath);
    const filteredCategories = categories.filter(c => c.id !== id);

    if (filteredCategories.length === categories.length) {
        return false;
    }

    fileService.writeData(dataFilePath, filteredCategories);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove, search };

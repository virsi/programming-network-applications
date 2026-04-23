class CategoriesUrls {
    constructor() {
        this.baseUrl = '/api';
    }

    getCategories(title) {
        const url = `${this.baseUrl}/categories`;
        if (title) {
            return `${url}?title=${encodeURIComponent(title)}`;
        }
        return url;
    }

    getCategoryById(id) {
        return `${this.baseUrl}/categories/${id}`;
    }

    createCategory() {
        return `${this.baseUrl}/categories`;
    }

    updateCategoryById(id) {
        return `${this.baseUrl}/categories/${id}`;
    }

    removeCategoryById(id) {
        return `${this.baseUrl}/categories/${id}`;
    }
}

export const categoriesUrls = new CategoriesUrls();

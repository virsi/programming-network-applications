import {ProductCardComponent} from "../../components/product-card/index.js";
import {FilterComponent} from "../../components/filter/index.js";
import {ToastComponent} from "../../components/toast/index.js";
import {ProductPage} from "../product/index.js";
import {EditPage} from "../edit/index.js";
import {ajax} from "../../modules/ajax.js";
import {categoriesUrls} from "../../modules/categoriesUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filter = '';
    }

    get pageRoot() {
        return document.getElementById('dashboard-grid');
    }

    getHTML() {
        return `
            <div class="p-4 p-md-5">
                <div class="sber-logo-placeholder mb-4">
                    <div class="logo-circle"></div>
                    <span class="nav-title">Sber<span style="color: var(--primary-color);">Cashback</span></span>
                </div>
                <h1 class="nav-title mb-2">Выберите категории</h1>
                <p class="description mb-4">Активируйте до 4-х категорий повышенного кешбэка в этом месяце</p>

                <div class="main-toolbar">
                    <div id="filter-slot" class="filter-slot"></div>
                    <button id="add-category-btn" class="btn-primary">+ Добавить категорию</button>
                </div>

                <div id="dashboard-grid" class="dashboard-grid">
                    <!-- Cards will be rendered here -->
                </div>
            </div>
        `;
    }

    async getData() {
        try {
            const {data, status} = await ajax.get(categoriesUrls.getCategories(this.filter));
            if (status >= 200 && status < 300 && Array.isArray(data)) {
                this.renderData(data);
                return;
            }
            this.showError('Не удалось получить категории');
        } catch (e) {
            console.error(e);
            this.showError('Не удалось получить категории');
        }
    }

    renderData(items) {
        this.pageRoot.innerHTML = '';
        if (items.length === 0) {
            this.pageRoot.insertAdjacentHTML('beforeend', '<p class="description">Ничего не найдено.</p>');
            return;
        }
        items.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });
    }

    showError(message) {
        const toastContainer = document.getElementById('toast-container');
        const toast = new ToastComponent(toastContainer);
        toast.show(message);
    }

    clickCard(id) {
        const productPage = new ProductPage(this.parent, id);
        productPage.render();
    }

    clickAdd() {
        const editPage = new EditPage(this.parent, null);
        editPage.render();
    }

    applyFilter(value) {
        this.filter = value;
        this.getData();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const filterSlot = document.getElementById('filter-slot');
        const filter = new FilterComponent(filterSlot);
        filter.render(this.applyFilter.bind(this));

        document
            .getElementById('add-category-btn')
            .addEventListener('click', this.clickAdd.bind(this));

        this.getData();
    }
}

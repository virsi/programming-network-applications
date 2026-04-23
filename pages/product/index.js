import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {ToastComponent} from "../../components/toast/index.js";
import {MainPage} from "../main/index.js";
import {EditPage} from "../edit/index.js";
import {ajax} from "../../modules/ajax.js";
import {categoriesUrls} from "../../modules/categoriesUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div class="p-4 p-md-5">
                <div id="product-page"></div>
            </div>
        `;
    }

    async getData() {
        try {
            const {data, status} = await ajax.get(categoriesUrls.getCategoryById(this.id));
            if (status >= 200 && status < 300 && data) {
                this.renderData(data);
                return;
            }
            this.showToast('Не удалось получить категорию');
        } catch (e) {
            console.error(e);
            this.showToast('Не удалось получить категорию');
        }
    }

    renderData(data) {
        const product = new ProductComponent(this.pageRoot);
        product.render(data, {
            onActivate: this.clickActivate.bind(this),
            onEdit: this.clickEdit.bind(this, data.id),
            onDelete: this.clickDelete.bind(this, data.id),
        });
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    clickEdit(id) {
        const editPage = new EditPage(this.parent, id);
        editPage.render();
    }

    async clickDelete(id) {
        try {
            const {status} = await ajax.delete(categoriesUrls.removeCategoryById(id));
            if (status >= 200 && status < 300) {
                this.showToast('Категория удалена');
                this.clickBack();
                return;
            }
            this.showToast('Не удалось удалить категорию');
        } catch (e) {
            console.error(e);
            this.showToast('Не удалось удалить категорию');
        }
    }

    clickActivate(e, id) {
        const btn = e.target;
        const percentInput = document.getElementById('percent-input');
        const newPercent = parseInt(percentInput.value);

        if (isNaN(newPercent) || newPercent < 0 || newPercent > 100) {
            this.showToast('Введите корректный процент (0–100)');
            return;
        }

        const saved = JSON.parse(localStorage.getItem('cashbackPercents') || '{}');
        saved[id] = newPercent;
        localStorage.setItem('cashbackPercents', JSON.stringify(saved));

        const percentDisplay = document.getElementById('percent-display');
        if (percentDisplay) {
            percentDisplay.textContent = newPercent + '%';
        }

        btn.innerText = 'Активировано';
        btn.classList.add('active');

        this.showToast('Категория успешно активирована!');
    }

    showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        const toast = new ToastComponent(toastContainer);
        toast.show(message);
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}

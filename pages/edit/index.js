import {BackButtonComponent} from "../../components/back-button/index.js";
import {EditFormComponent} from "../../components/edit-form/index.js";
import {ToastComponent} from "../../components/toast/index.js";
import {MainPage} from "../main/index.js";
import {ProductPage} from "../product/index.js";
import {ajax} from "../../modules/ajax.js";
import {categoriesUrls} from "../../modules/categoriesUrls.js";

export class EditPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.mode = id ? 'edit' : 'create';
    }

    get pageRoot() {
        return document.getElementById('edit-page');
    }

    getHTML() {
        return `
            <div class="p-4 p-md-5">
                <div id="edit-page"></div>
            </div>
        `;
    }

    loadData(callback) {
        if (this.mode !== 'edit') {
            callback(null);
            return;
        }
        ajax.get(categoriesUrls.getCategoryById(this.id), (data, status) => {
            if (status >= 200 && status < 300 && data) {
                callback(data);
                return;
            }
            this.showToast('Не удалось загрузить категорию');
            callback(null);
        });
    }

    validate(payload) {
        if (!payload.title || !payload.src || !payload.text) {
            return 'Заполните все поля';
        }
        if (Number.isNaN(payload.percent) || payload.percent < 0 || payload.percent > 100) {
            return 'Процент должен быть от 0 до 100';
        }
        return null;
    }

    submit(payload) {
        const error = this.validate(payload);
        if (error) {
            this.showToast(error);
            return;
        }

        if (this.mode === 'edit') {
            ajax.patch(categoriesUrls.updateCategoryById(this.id), payload, (data, status) => {
                if (status >= 200 && status < 300) {
                    this.showToast('Категория обновлена');
                    new ProductPage(this.parent, this.id).render();
                    return;
                }
                this.showToast('Не удалось обновить категорию');
            });
            return;
        }

        ajax.post(categoriesUrls.createCategory(), payload, (data, status) => {
            if (status >= 200 && status < 300 && data) {
                this.showToast('Категория создана');
                new MainPage(this.parent).render();
                return;
            }
            this.showToast('Не удалось создать категорию');
        });
    }

    cancel() {
        if (this.mode === 'edit') {
            new ProductPage(this.parent, this.id).render();
        } else {
            new MainPage(this.parent).render();
        }
    }

    clickBack() {
        new MainPage(this.parent).render();
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

        this.loadData((data) => {
            const form = new EditFormComponent(this.pageRoot);
            form.render(data, this.mode, {
                onSubmit: this.submit.bind(this),
                onCancel: this.cancel.bind(this),
            });
        });
    }
}

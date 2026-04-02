import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {ToastComponent} from "../../components/toast/index.js";
import {MainPage} from "../main/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData(id) {
        const cashbackData = [
            { id: 1, title: 'Рестораны и кафе', percent: 10, src: 'assets/cafe.png', text: 'Кешбэк за каждый обед и кофе.', details: 'Получайте 10% бонусами за покупки в любых заведениях питания. Акция действует весь апрель.' },
            { id: 2, title: 'Такси и транспорт', percent: 15, src: 'assets/taxi.png', text: 'Поездки по городу с выгодой.', details: 'Сбер возвращает 15% за Ваши поездки на такси и общественном транспорте. Доступно для владельцев прайм.' },
            { id: 3, title: 'Супермаркеты', percent: 5, src: 'assets/supermarket.png', text: 'Выгода на продукты каждый день.', details: 'Покупайте продукты в любимых магазинах и возвращайте 5% от суммы чека бонусами СберСпасибо.' },
            { id: 4, title: 'Одежда и обувь', percent: 20, src: 'assets/fashion.png', text: 'Обновляйте гардероб выгодно.', details: 'Максимальный кешбэк 20% на категорию мода в партнерских магазинах SberID.' }
        ];

        return cashbackData.find(item => item.id === parseInt(id));
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

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    clickActivate(e, id) {
        const btn = e.target;
        btn.innerText = 'Активировано';
        btn.classList.add('active');
        
        // Variant 6: Toast Notification
        const toastContainer = document.getElementById('toast-container');
        const toast = new ToastComponent(toastContainer);
        toast.show('Категория успешно активирована!');
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const data = this.getData(this.id);
        const product = new ProductComponent(this.pageRoot);
        product.render(data, this.clickActivate.bind(this));
    }
}

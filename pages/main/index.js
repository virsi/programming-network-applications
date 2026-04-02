import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            { id: 1, title: 'Рестораны и кафе', percent: 10, src: 'assets/cafe.png', text: 'Кешбэк за каждый обед и кофе.' },
            { id: 2, title: 'Такси и транспорт', percent: 15, src: 'assets/taxi.png', text: 'Поездки по городу с выгодой.' },
            { id: 3, title: 'Супермаркеты', percent: 5, src: 'assets/supermarket.png', text: 'Выгода на продукты каждый день.' },
            { id: 4, title: 'Одежда и обувь', percent: 20, src: 'assets/fashion.png', text: 'Обновляйте гардероб выгодно.' }
        ];
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
                
                <div id="dashboard-grid" class="dashboard-grid">
                    <!-- Cards will be rendered here -->
                </div>
            </div>
        `;
    }

    clickCard(id) {
        const productPage = new ProductPage(this.parent, id);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();
        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });
    }
}

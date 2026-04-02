export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="product-detail-view">
                <div class="product-layout">
                    <div class="product-image-container shadow-sm">
                        <img src="${data.src}" class="product-image-large" alt="${data.title}">
                    </div>
                    
                    <div class="product-info-block">
                        <div>
                            <h1 class="nav-title mb-2" style="font-size: 2rem;">${data.title}</h1>
                            <p class="description mb-4">${data.details}</p>
                        </div>
                        
                        <div class="conditions-card">
                            <h5 class="mb-3" style="font-weight: 700;">Условия кешбэка</h5>
                            <div class="detail-row"><span class="detail-label">Процент:</span> <span class="detail-value text-success">${data.percent}%</span></div>
                            <div class="detail-row"><span class="detail-label">Сумма макс:</span> <span class="detail-value">3000 бонусов</span></div>
                            <div class="detail-row"><span class="detail-label">Период:</span> <span class="detail-value">01.04 - 30.04</span></div>
                        </div>
                        
                        <button id="activate-btn" class="btn-activate" data-id="${data.id}">Активировать</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        document
            .getElementById('activate-btn')
            .addEventListener("click", (e) => listener(e, data.id));
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}

export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getSavedPercent(data) {
        const saved = JSON.parse(localStorage.getItem('cashbackPercents') || '{}');
        return saved[data.id] !== undefined ? saved[data.id] : data.percent;
    }

    getHTML(data) {
        const percent = this.getSavedPercent(data);
        return `
            <div class="product-detail-view">
                <div class="product-layout">
                    <div class="product-image-container shadow-sm">
                        <img src="${data.src}" class="product-image-large" alt="${data.title}">
                    </div>

                    <div class="product-info-block">
                        <div>
                            <h1 class="nav-title mb-2" style="font-size: 2rem;">${data.title}</h1>
                            <p class="description mb-4">${data.text}</p>
                        </div>

                        <div class="conditions-card">
                            <h5 class="mb-3" style="font-weight: 700;">Условия кешбэка</h5>
                            <div class="detail-row"><span class="detail-label">Процент:</span> <span id="percent-display" class="detail-value text-success">${percent}%</span></div>
                            <div class="detail-row"><span class="detail-label">Сумма макс:</span> <span class="detail-value">3000 бонусов</span></div>
                            <div class="detail-row"><span class="detail-label">Период:</span> <span class="detail-value">01.04 - 30.04</span></div>
                        </div>

                        <div class="percent-input-group">
                            <label for="percent-input" class="percent-label">Ваш процент кешбэка:</label>
                            <input id="percent-input" type="number" class="percent-input" min="0" max="100" value="${percent}" />
                        </div>

                        <button id="activate-btn" class="btn-activate" data-id="${data.id}">Активировать</button>

                        <div class="product-actions">
                            <button id="edit-btn" class="btn-secondary" data-id="${data.id}">Редактировать</button>
                            <button id="delete-btn" class="btn-danger" data-id="${data.id}">Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, handlers) {
        document
            .getElementById('activate-btn')
            .addEventListener('click', (e) => handlers.onActivate(e, data.id));
        document
            .getElementById('edit-btn')
            .addEventListener('click', handlers.onEdit);
        document
            .getElementById('delete-btn')
            .addEventListener('click', () => {
                if (confirm('Удалить категорию?')) {
                    handlers.onDelete();
                }
            });
    }

    render(data, handlers) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, handlers);
    }
}

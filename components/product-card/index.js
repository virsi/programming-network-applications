export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getPercent(data) {
        const saved = JSON.parse(localStorage.getItem('cashbackPercents') || '{}');
        return saved[data.id] !== undefined ? saved[data.id] : data.percent;
    }

    getHTML(data) {
        const percent = this.getPercent(data);
        return `
            <div class="card cashback-card" id="card-${data.id}" data-id="${data.id}">
                <div class="cashback-badge">${percent}%</div>
                <div class="card-image-wrapper">
                    <img src="${data.src}" class="cashback-card-img" alt="${data.title}">
                </div>
                <div class="card-body p-0">
                    <h5 class="cashback-title">${data.title}</h5>
                    <p class="cashback-description">${data.text}</p>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        document
            .getElementById(`card-${data.id}`)
            .addEventListener("click", () => listener(data.id));
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}

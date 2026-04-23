export class FilterComponent {
    constructor(parent) {
        this.parent = parent;
        this.debounceId = null;
    }

    getHTML() {
        return `
            <div class="filter-block">
                <input
                    id="filter-input"
                    type="text"
                    class="filter-input"
                    placeholder="Поиск по названию категории..."
                    autocomplete="off"
                />
            </div>
        `;
    }

    addListeners(listener) {
        const input = document.getElementById('filter-input');
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (this.debounceId) {
                clearTimeout(this.debounceId);
            }
            this.debounceId = setTimeout(() => listener(value), 300);
        });
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}

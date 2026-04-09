export class ToastComponent {
    constructor(parent) {
        this.parent = parent;
        this.timeoutId = null;
    }

    getHTML(message) {
        return `
            <div class="sber-toast">
                <div class="toast-icon">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 5L5 8.5L12.5 1" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="toast-message">${message}</div>
            </div>
        `;
    }

    show(message) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.parent.innerHTML = '';
        this.parent.classList.remove('show');

        const html = this.getHTML(message);
        this.parent.insertAdjacentHTML('beforeend', html);

        setTimeout(() => {
            this.parent.classList.add('show');
        }, 10);

        this.timeoutId = setTimeout(() => {
            this.hide();
        }, 3000);
    }

    hide() {
        this.parent.classList.remove('show');
        setTimeout(() => {
            if (!this.parent.classList.contains('show')) {
                this.parent.innerHTML = '';
            }
        }, 500);
    }
}

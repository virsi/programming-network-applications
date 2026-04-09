export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        document
            .getElementById("back-button")
            .addEventListener("click", listener);
    }

    getHTML() {
        return `
            <div id="back-button" class="sber-logo-placeholder sber-logo-clickable mb-4">
                <div class="logo-circle"></div>
                <span class="nav-title">Sber<span style="color: var(--primary-color);">Cashback</span></span>
            </div>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}

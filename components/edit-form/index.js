export class EditFormComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data, mode) {
        const title = data?.title ?? '';
        const percent = data?.percent ?? '';
        const src = data?.src ?? '';
        const text = data?.text ?? '';
        const heading = mode === 'edit' ? 'Редактировать категорию' : 'Новая категория';
        const submitLabel = mode === 'edit' ? 'Сохранить' : 'Создать';

        return `
            <div class="edit-form-wrapper">
                <h1 class="nav-title mb-2" style="font-size: 2rem;">${heading}</h1>
                <form id="edit-form" class="edit-form" novalidate>
                    <div class="form-field">
                        <label class="form-label" for="form-title">Название</label>
                        <input id="form-title" name="title" class="form-input" type="text" value="${title}" required />
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="form-percent">Процент кешбэка</label>
                        <input id="form-percent" name="percent" class="form-input" type="number" min="0" max="100" value="${percent}" required />
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="form-src">Путь к изображению</label>
                        <input id="form-src" name="src" class="form-input" type="text" value="${src}" placeholder="assets/cafe.png" required />
                    </div>
                    <div class="form-field">
                        <label class="form-label" for="form-text">Описание</label>
                        <textarea id="form-text" name="text" class="form-input form-textarea" rows="3" required>${text}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" id="form-cancel" class="btn-secondary">Отмена</button>
                        <button type="submit" id="form-submit" class="btn-activate">${submitLabel}</button>
                    </div>
                </form>
            </div>
        `;
    }

    readPayload() {
        const form = document.getElementById('edit-form');
        const fd = new FormData(form);
        return {
            title: String(fd.get('title') || '').trim(),
            percent: Number(fd.get('percent')),
            src: String(fd.get('src') || '').trim(),
            text: String(fd.get('text') || '').trim(),
        };
    }

    addListeners({onSubmit, onCancel}) {
        document.getElementById('edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            onSubmit(this.readPayload());
        });
        document.getElementById('form-cancel').addEventListener('click', onCancel);
    }

    render(data, mode, handlers) {
        const html = this.getHTML(data, mode);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(handlers);
    }
}

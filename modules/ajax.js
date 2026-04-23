class Ajax {
    async get(url) {
        const response = await fetch(url);
        return this._handleResponse(response);
    }

    async post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        return this._handleResponse(response);
    }

    async patch(url, data) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        return this._handleResponse(response);
    }

    async delete(url) {
        const response = await fetch(url, {method: 'DELETE'});
        return this._handleResponse(response);
    }

    async _handleResponse(response) {
        const text = await response.text();
        let data = null;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Ошибка парсинга JSON:', e);
            }
        }
        return {data, status: response.status};
    }
}

export const ajax = new Ajax();

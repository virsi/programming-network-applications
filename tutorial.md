# ЛР №5. Добаление AJAX запросов к API.

**Цель** данной лабораторной работы - взаимодействие с внешним API через XMLHttpRequest. В ходе выполнения работы, вам предстоит ознакомиться с кодом реализации простого взаимодействия с внешним API, получение данных и вывод их в интерфейс пользователя, и затем выполнить задания по варианту.

## План лабораторной работы.

1. Инструменты для работы.
2. Что такое XMLHttpRequest.
3. Работа с API.
4. API главной страницы с карточками.
5. API страницы карточки.
6. Страница добавления/редактирования и удаление.
7. Дополнительные материалы

## 1. Инструменты для работы.

Для работы будем использовать инструменты из предыдущих лабораторной работы: [VS Code](https://code.visualstudio.com/) + [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

## 2. Что такое XMLHttpRequest.

[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) (или XHR) позволяет делать HTTP-запросы к серверу из браузера без перезагрузки страницы.
Несмотря на наличие слова "XML" в названии, с помощью XHR можно работать с любыми типами данных, а не только с XML.
С помощью XML можно загружать/скачивать файл, отслеживать прогрусс и многое другое.

## 3. Работа с API.

Перед началом работы с API разберемся с тем, как мы это будем делать в нашем проекте.
Первое с чего стоит начать - создадим еще один слой, где будем держать все методы работы с API.

Сейчас структура проекта выглядит так

```bash
├── pages
├── components
├── index.html
├── main.js
```

Добавим еще один слой `modules`

```bash
├── pages
├── components
├── modules
├── index.html
├── main.js
```

### 3.1. Работа с урлами.

Для работы нам понадобятся эндпоинты API, разработанные в предыдущей ЛР. Запустим сервер с помощью `npm run start` и убедимся, что он заработал и готов слушать запросы. Сервер запустится и будет доступен по адресу `http://localhost:3000`.

![Start server](assets/start-server.png)

Объявим нужные эндпоинты для категорий в отдельном файле, чтобы можно было переиспользовать в нескольких местах сразу и в случае чего, поменять базовый URL.

Базовый URL - `http://localhost:3000`, каждый запрос за категориями будет выполняться по `/categories`. Для фильтрации по названию к GET-запросу списка подставляется query-параметр `?title=...`.

-   Создаем файл `modules/categoriesUrls.js`

```js
class CategoriesUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getCategories(title) {
        const url = `${this.baseUrl}/categories`;
        if (title) {
            return `${url}?title=${encodeURIComponent(title)}`;
        }
        return url;
    }

    getCategoryById(id) {
        return `${this.baseUrl}/categories/${id}`;
    }

    createCategory() {
        return `${this.baseUrl}/categories`;
    }

    updateCategoryById(id) {
        return `${this.baseUrl}/categories/${id}`;
    }

    removeCategoryById(id) {
        return `${this.baseUrl}/categories/${id}`;
    }
}

export const categoriesUrls = new CategoriesUrls();
```

Теперь, если нам нужно получить урл, то просто импортируем файл и получаем нужный нам урл.

```js
import { categoriesUrls } from './categoriesUrls.js';

categoriesUrls.getCategories();
categoriesUrls.getCategories('кафе'); // -> .../categories?title=%D0%BA%D0%B0%D1%84%D0%B5
```

### 3.2. Работа с API.

Мы будем работать с API через XHR. Для удобства создадим класс, в котором опишем методы для работы с API.

-   Создаем файл `modules/ajax.js`

```js
class Ajax {
    /**
     * GET запрос
     * @param {string} url - Адрес запроса
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * POST запрос
     * @param {string} url - Адрес запроса
     * @param {object} data - Данные для отправки
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    post(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * PATCH запрос
     * @param {string} url - Адрес запроса
     * @param {object} data - Данные для обновления
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    patch(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * DELETE запрос
     * @param {string} url - Адрес запроса
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    delete(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * Обработчик ответа (приватный метод)
     * @param {XMLHttpRequest} xhr - Объект запроса
     * @param {function} callback - Функция обратного вызова
     */
    _handleResponse(xhr, callback) {
        try {
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            callback(data, xhr.status);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            callback(null, xhr.status);
        }
    }
}

export const ajax = new Ajax();
```

У нас есть готовый класс, через который мы можем выполнять запросы. Тут уже происходит вся нужная обработка и формирование JSON объекта из данных и вызов коллбека.

```js
import { ajax } from './ajax.js';

// GET пример
ajax.get('https://api.example.com/data', (data, status) => {
    console.log(status, data);
});

// POST пример
ajax.post('https://api.example.com/create', { name: 'John' }, (data, status) => {
    console.log(status, data);
});

// PATCH пример
ajax.patch(
    'https://api.example.com/update/1',
    { name: 'Updated' },
    (data, status) => {
        console.log(status, data);
    }
);

// DELETE пример
ajax.delete('https://api.example.com/delete/1', (data, status) => {
    console.log(status, data);
});
```

## 4. API главной страницы с карточками.

Переведем нашу главную страницу на работу с API.
Сделаем так, чтобы на главной странице выводились карточки, полученные по API, а в тулбаре появился компонент фильтрации по названию и кнопка «+ Добавить категорию».

Первое с чего нужно начать - модифицировать получение данных.
Сейчас мы рисуем карточки на основе объекта в коде.
Нам нужно поменять на получение данных из API и отрисовку карточек.

-   Изменяем функцию получения данных

```js
import {ajax} from "../../modules/ajax.js";
import {categoriesUrls} from "../../modules/categoriesUrls.js";


getData() {
    ajax.get(categoriesUrls.getCategories(this.filter), (data, status) => {
        if (status >= 200 && status < 300 && Array.isArray(data)) {
            this.renderData(data);
        }
    });
}
```

-   Добавляем функцию отрисовки карточек по данным

```js
renderData(items) {
    this.pageRoot.innerHTML = '';
    items.forEach((item) => {
        const productCard = new ProductCardComponent(this.pageRoot);
        productCard.render(item, this.clickCard.bind(this));
    });
}
```

-   Модифицируем функцию отрисовки страницы — подключаем фильтр и кнопку добавления

```js
render() {
    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    const filterSlot = document.getElementById('filter-slot');
    const filter = new FilterComponent(filterSlot);
    filter.render((value) => {
        this.filter = value;
        this.getData();
    });

    document
        .getElementById('add-category-btn')
        .addEventListener('click', this.clickAdd.bind(this));

    this.getData();
}
```

Компонент `FilterComponent` просто рендерит `<input>` и через `debounce` вызывает переданный колбэк. При каждом изменении значение приклеивается к урлу запросом `?title=...`.

---

Если вы все еще видите пустую страницу, то проверьте консоль разработчика - возможно, там будет ошибка:
`Access to XMLHttpRequest at 'http://localhost:3000/categories' from origin 'http://127.0.0.1:5501' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

![Cors error](assets/cors-error.png)

При попытке выполнить XHR-запрос браузер может заблокировать запрос не с того же домена, на котором находится запрашиваемый ресурс. Такая политика ограничений называется [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

Есть несколько способов обойти это:

1. Сделать так, чтобы главная страница index.html располагалась на том же домене и порту, что и серверная часть приложения, к которой будут выполняться запросы.
2. Настроить CORS заголовки на сервере, чтобы они принимали запросы с конкретных или произвольных доменов.
3. Использовать расширение [CORS Unblock](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino), которое позволить обойти ограничения. Принцип работы расширения таков: оно перехватывает запрос и подменяет заголовки, убеждая браузер, что ответ пришел с разрешенного источника. CORS Unblock полезен для разработки, но не стоит использовать его в продакшене, так как он обходит встроенную защиту браузера. Лучший вариант — правильно настроить CORS на сервере.

Воспользуемся CORS Unblock, как самым быстрым и простым решением. После установки и включения расширения ошибка должна исчезнуть. Если этого не произошло, убедитесь, что все сделали правильно.

**Примечание**:
Расширение по умолчанию может не работать для сложных POST запросов. CORS запросы делятся на простые и сложные: для простых не требуется пердварительный запрос OPTIONS - запрос сразу улетает на сервер.
К простым запросам относятся: методы GET/POST/HEAD c Content-Type text/plain, application/x-www-form-urlencoded, multipart/form-data.

POST-запрос с Content-Type: application/json относится к сложным запросам, для него отправляется предварительный **preflight** OPTIONS-запрос, который расширение по умолчанию не перехватывает.

Чтобы это обойти, нужно включить следующие пункты  в настройках расширения и нажать Start (Restart):
- Overwrite 4xx status codes with 200
- Access-Control-Request-Headers

В случае, если какие-то еще запросы не будут работать, можно поэкспериментировать с настройками расширения и попробовать включить остальные пункты (либо вообще все) - это может помочь.

![Cors unblock settings](assets/cors-unblock-settings.png)

-------

Теперь, на главной странице у нас отображаются все карточки, получаемые с бэкенда по API. Результаты запросов можно отследить в **DevTools** во вкладке **Network**.

![Get categories](assets/get-stocks.png)

![Get categories network](assets/get-stocks-network.png)

Перейдем к модификации второй страницы.

## 5. API страницы карточки.

Модифицируем страницу так, чтобы отображать данные карточки, на которую нажали, а также добавим на нее кнопки «Редактировать» и «Удалить».

-   Изменяем функцию получения данных

```js
 getData() {
    ajax.get(categoriesUrls.getCategoryById(this.id), (data, status) => {
        if (status >= 200 && status < 300 && data) {
            this.renderData(data);
        }
    });
}
```

-   Отрисовываем карточку и пробрасываем обработчики кнопок

```js
renderData(data) {
    const product = new ProductComponent(this.pageRoot);
    product.render(data, {
        onActivate: this.clickActivate.bind(this),
        onEdit: () => new EditPage(this.parent, data.id).render(),
        onDelete: () => this.clickDelete(data.id),
    });
}
```

-   Кнопка удаления дергает DELETE и возвращает пользователя на главную

```js
clickDelete(id) {
    ajax.delete(categoriesUrls.removeCategoryById(id), (_data, status) => {
        if (status >= 200 && status < 300) {
            this.clickBack();
        }
    });
}
```

Теперь при переходе на страницу какой-то карточки ее данные будут приходить через API по сети, а кнопки «Редактировать» и «Удалить» будут выполнять PATCH/DELETE. Убедимся в этом, посмотрев вкладку **Network**.

![Get category by id](assets/get-stock-by-id.png)

## 6. Страница добавления/редактирования.

Вся работа с POST и PATCH вынесена на отдельную страницу `pages/edit/index.js`. Она обслуживает два сценария:

- создание новой карточки (`mode === 'create'`) — открывается по кнопке «+ Добавить категорию» с главной;
- редактирование существующей (`mode === 'edit'`) — открывается по кнопке «Редактировать» с карточки, в этом случае форма предзаполняется через `GET /categories/:id`.

Компонент формы `components/edit-form/index.js` рендерит поля `title`, `percent`, `src`, `text` и собирает `FormData` при сабмите.

Отправка:

```js
submit(payload) {
    if (this.mode === 'edit') {
        ajax.patch(categoriesUrls.updateCategoryById(this.id), payload, (data, status) => {
            if (status >= 200 && status < 300) {
                new ProductPage(this.parent, this.id).render();
            }
        });
        return;
    }

    ajax.post(categoriesUrls.createCategory(), payload, (data, status) => {
        if (status >= 200 && status < 300) {
            new MainPage(this.parent).render();
        }
    });
}
```

Поскольку `Content-Type: application/json` делает POST/PATCH «сложными» запросами, браузер предварительно отправляет `OPTIONS` (preflight). В расширении `CORS Unblock` нужно включить пункты из раздела про CORS выше, иначе preflight упадет и сам `POST/PATCH` до сервера не долетит.

## Порядок показа

1. Запустить сервер ЛР4 на `:3000` и `live-server` для фронта на другом порту (например, `:5501`) в одном Chrome.
2. Открыть **DevTools → Network → XHR**.
3. С выключенным `CORS Unblock` ввести что-то в поле фильтра — в Network будет красный запрос `GET /categories?title=...` с ошибкой CORS.
4. Включить `CORS Unblock`, повторить фильтрацию — запрос должен вернуть `200`, в заголовках будет `title=...`.
5. В Postman через `POST /categories` добавить новую запись. Обновить фронт — карточка появилась в списке. Ввести ее `title` в поле фильтра — в Network виден запрос с этим параметром, на странице остается только эта карточка.
6. Открыть созданную карточку, нажать «Редактировать» — форма показывает текущие значения, после «Сохранить» уходит `PATCH /categories/:id`. Нажать «Удалить» — уходит `DELETE /categories/:id`, карточка исчезает из списка.

## 7. Дополнительные материалы

#### 1 вариант.

1. Главная страница - получаем и отображаем список карточек
   Необходимо сделать компонент для фильтрации карточек по названию (title) с помощью передачи query-параметра в GET-запрос.

2. Вторая страница - отображение конкретной карточки по ID. Добавить кнопку удаления карточки и выполнять удаление при клике на нее через DELETE-запрос к API.

#### 2 вариант.

1. Главная страница - получаем и отображаем список карточек.

2. Вторая страница - добавить страницу с формой создания карточки и выполнять ее создание через POST-запрос.

#### 3 вариант.

1. Главная страница - получаем и отображаем список карточек.

2. Вторая страница - отображение конкретной карточки по ID. Добавить поля для обновления карточки и обновлять их с помощью PATCH-запроса.

#### 4 вариант.

1. Главная страница - получаем и отображаем список карточек.
   Необходимо сделать компонент для фильтрации карточек по названию (title) с помощью передачи query-параметра в GET-запрос.

2. Добавить поле для ввода числа, которое будет ограничивать максимальное количество карточек, отображаемых на странице - простенькая пагинация на клиенсткой части. При изменении этого числа, количество карточек должно меняться.

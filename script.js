//Переключение темы через класс на body
const themeSelect = document.getElementById('theme-select');
const savedTheme = localStorage.getItem('theme') || 'light';

//Инициализация темы
document.body.classList.add(savedTheme + '-theme');

if (themeSelect) {
    themeSelect.value = savedTheme;

    //Обработчик изменений
    themeSelect.addEventListener('change', function() {
        const newTheme = this.value;
        document.body.className = ''; // Сброс классов
        document.body.classList.add(newTheme + '-theme');
        localStorage.setItem('theme', newTheme);
    });
}

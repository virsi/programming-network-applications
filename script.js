// ==============================
// ЛОГИКА ТЕМЫ (ДЛЯ ВСЕХ СТРАНИЦ)
// ==============================
const themeSelect = document.getElementById('theme-select');
const savedTheme = localStorage.getItem('theme') || 'light';

// Инициализация темы
document.body.classList.add(savedTheme + '-theme');

if (themeSelect) {
    themeSelect.value = savedTheme;

    // Обработчик изменений
    themeSelect.addEventListener('change', function () {
        const newTheme = this.value;
        document.body.className = ''; // Сброс классов
        document.body.classList.add(newTheme + '-theme');
        localStorage.setItem('theme', newTheme);
    });
}

// ==============================
// ЛОГИКА КАЛЬКУЛЯТОРА
// ==============================
const display = document.getElementById('result');

if (display) {
    let displayValue = '0';
    let firstOperand = null;
    let waitingForSecondOperand = false;
    let operator = null;

    function updateDisplay() {
        // Ограничиваем длину вывода, чтобы не вылезало за пределы экрана
        let output = String(displayValue);
        if (output.length > 12) {
            output = output.substring(0, 12);
        }
        display.innerText = output;
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            displayValue = digit;
            waitingForSecondOperand = false;
        } else {
            displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        if (waitingForSecondOperand) {
            displayValue = '0.';
            waitingForSecondOperand = false;
            return;
        }
        if (!displayValue.includes(dot)) {
            displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            // Выполняем предыдущее вычисление
            const result = calculate(firstOperand, inputValue, operator);
            displayValue = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function calculate(first, second, currentOperator) {
        if (currentOperator === '+') {
            return first + second;
        } else if (currentOperator === '−') {
            return first - second;
        } else if (currentOperator === '×') {
            return first * second;
        } else if (currentOperator === '÷') {
            return first / second;
        }
        return second;
    }

    function resetCalculator() {
        displayValue = '0';
        firstOperand = null;
        waitingForSecondOperand = false;
        operator = null;
    }

    function handleSign() {
        if (displayValue !== '0') {
            displayValue = (parseFloat(displayValue) * -1).toString();
        }
    }

    function handlePercent() {
        // Простой расчет процента относительно текущего значения
        if (firstOperand !== null && operator && !waitingForSecondOperand) {
            const percentage = (firstOperand * parseFloat(displayValue)) / 100;
            displayValue = String(percentage);
        } else {
            // Если нет операции, то просто делим на 100
            displayValue = (parseFloat(displayValue) / 100).toString();
        }
    }

    // Привязываем обработчики событий
    const keyboard = document.querySelector('.keyboard');

    if (keyboard) {
        keyboard.addEventListener('click', (event) => {
            const target = event.target;

            // Если клик не по кнопке - игнорируем
            if (!target.matches('button')) {
                return;
            }

            // Обработка специальных кнопок
            switch (target.id) {
                case 'btn_op_clear':
                    resetCalculator();
                    break;
                case 'btn_op_sign':
                    handleSign();
                    break;
                case 'btn_op_percent':
                    handlePercent();
                    break;
                case 'btn_digit_dot':
                    inputDecimal('.');
                    break;
                case 'btn_op_equal':
                    if (operator) {
                        const inputValue = parseFloat(displayValue);
                        const result = calculate(firstOperand, inputValue, operator);
                        displayValue = `${parseFloat(result.toFixed(7))}`;
                        firstOperand = null;
                        operator = null;
                        waitingForSecondOperand = true;
                    }
                    break;
                default:
                    // Обработка цифр и операций
                    if (target.classList.contains('digit')) {
                        inputDigit(target.innerText);
                    } else if (target.classList.contains('primary')) {
                        handleOperator(target.innerText);
                    }
            }

            updateDisplay();
        });
    }
}

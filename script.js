const themeSelect = document.getElementById('theme-select');
const savedTheme = localStorage.getItem('theme') || 'light';

document.body.classList.add(savedTheme + '-theme');

if (themeSelect) {
    themeSelect.value = savedTheme;

    themeSelect.addEventListener('change', function () {
        const newTheme = this.value;
        document.body.className = '';
        document.body.classList.add(newTheme + '-theme');
        localStorage.setItem('theme', newTheme);
    });
}

const display = document.getElementById('result');

if (display) {
    let displayValue = '0';
    let firstOperand = null;
    let waitingForSecondOperand = false;
    let operator = null;

    const MAX_DIGITS = 10;

    function formatNumber(numStr) {
        const num = parseFloat(numStr);
        if (isNaN(num)) return 'Ошибка';
        if (!isFinite(num)) return 'Ошибка';

        const str = String(num);

        if (str.length <= MAX_DIGITS) {
            return str;
        }

        const expStr = num.toExponential(4);
        if (expStr.length <= MAX_DIGITS) {
            return expStr;
        }
        return num.toExponential(2);
    }

    function updateDisplay() {
        let output = formatNumber(displayValue);
        display.innerText = output;
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            displayValue = digit;
            waitingForSecondOperand = false;
        } else {
            if (displayValue.replace(/[^0-9]/g, '').length >= MAX_DIGITS) {
                return;
            }
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
        if (firstOperand !== null && operator && !waitingForSecondOperand) {
            const percentage = (firstOperand * parseFloat(displayValue)) / 100;
            displayValue = String(percentage);
        } else {
            displayValue = (parseFloat(displayValue) / 100).toString();
        }
    }

    const keyboard = document.querySelector('.keyboard');

    if (keyboard) {
        keyboard.addEventListener('click', (event) => {
            const target = event.target;

            if (!target.matches('button')) {
                return;
            }

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
                    if (target.classList.contains('digit')) {
                        inputDigit(target.innerText);
                    } else if (target.classList.contains('primary')) {
                        handleOperator(target.innerText);
                    }
            }

            updateDisplay();
        });
    }

    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Цифры 0-9
        if (key >= '0' && key <= '9') {
            event.preventDefault();
            inputDigit(key);
            updateDisplay();
            return;
        }

        switch (key) {
            case '+':
                event.preventDefault();
                handleOperator('+');
                break;
            case '-':
                event.preventDefault();
                handleOperator('−');
                break;
            case '*':
                event.preventDefault();
                handleOperator('×');
                break;
            case '/':
                event.preventDefault();
                handleOperator('÷');
                break;
            case '%':
                event.preventDefault();
                handlePercent();
                break;
            case '.':
            case ',':
                event.preventDefault();
                inputDecimal('.');
                break;
            case 'Enter':
            case '=':
                event.preventDefault();
                if (operator) {
                    const inputValue = parseFloat(displayValue);
                    const result = calculate(firstOperand, inputValue, operator);
                    displayValue = `${parseFloat(result.toFixed(7))}`;
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = true;
                }
                break;
            case 'Escape':
            case 'Delete':
            case 'c':
            case 'C':
            case 'с': // русская С
            case 'С': // русская С заглавная
                event.preventDefault();
                resetCalculator();
                break;
            case 'Backspace':
                event.preventDefault();
                if (!waitingForSecondOperand && displayValue.length > 1) {
                    displayValue = displayValue.slice(0, -1);
                } else {
                    displayValue = '0';
                }
                break;
            default:
                return;
        }

        updateDisplay();
    });
}

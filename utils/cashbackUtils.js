/**
 * Task 1.4: Сумма и произведение значений массива.
 * @param {number[]} amounts
 * @returns {{sum: number, mult: number}}
 */
export function calculateTransactionStats(amounts) {
    if (!amounts || amounts.length === 0) return { sum: 0, mult: 0 };
    let sum = 0;
    let mult = 1;
    for (const val of amounts) {
        sum += val;
        mult *= val;
    }
    return { sum, mult };
}

/**
 * Task 1.9: Заполнение нового массива данными.
 * @param {number} count
 * @param {any} data
 * @returns {any[]}
 */
export function initCashbackHistory(count, data) {
    const arr = new Array(count);
    for (let i = 0; i < count; i++) {
        arr[i] = data;
    }
    return arr;
}

/**
 * Task 2.3: Максимальная последовательность единиц (активных дней кешбэка).
 * @param {string} streakStr - строка из '0' и '1'
 * @returns {number}
 */
export function getMaxCashbackStreak(streakStr) {
    let maxStreak = 0;
    let currentStreak = 0;
    for (const char of streakStr) {
        if (char === '1') {
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
            currentStreak = 0;
        }
    }
    return maxStreak;
}

/**
 * Task 3.1: Слияние объектов.
 * Сохраняет первое вхождение ключа.
 * @param {...Object} configs
 * @returns {Object}
 */
export function mergeAccountConfigs(...configs) {
    const result = {};
    for (const config of configs) {
        for (const key in config) {
            if (result[key] === undefined) {
                result[key] = config[key];
            }
        }
    }
    return result;
}

/**
 * Вспомогательная функция с циклом do...while (пост-условие).
 * Имитирует ожидание обработки транзакций.
 */
export function simulateProcessing(limit) {
    let processed = 0;
    do {
        processed++;
        console.log(`Обработка транзакции ${processed}...`);
    } while (processed < limit);
    return processed;
}

/* -------------------------------------------------------------------------- */
/*                  Получение данных из консоли (prompt)                      */
/* -------------------------------------------------------------------------- */

/**
 * Запрашивает у пользователя строку, при отмене возвращает значение по умолчанию.
 * @param {string} message
 * @param {string} fallback
 * @returns {string}
 */
function askString(message, fallback) {
    const value = window.prompt(message, fallback);
    return value === null || value === '' ? fallback : value;
}

/**
 * Запрашивает у пользователя массив чисел через запятую.
 * @param {string} message
 * @param {number[]} fallback
 * @returns {number[]}
 */
function askNumberArray(message, fallback) {
    const raw = window.prompt(message, fallback.join(', '));
    if (raw === null || raw.trim() === '') return fallback;
    const parsed = raw
        .split(/[,\s]+/)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));
    return parsed.length > 0 ? parsed : fallback;
}

/**
 * Запрашивает у пользователя целое число.
 * @param {string} message
 * @param {number} fallback
 * @returns {number}
 */
function askInteger(message, fallback) {
    const raw = window.prompt(message, String(fallback));
    if (raw === null || raw.trim() === '') return fallback;
    const parsed = parseInt(raw, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * Запрашивает у пользователя JSON-объект (вида {"key": "value"}).
 * @param {string} message
 * @param {Object} fallback
 * @returns {Object}
 */
function askJSON(message, fallback) {
    const raw = window.prompt(message, JSON.stringify(fallback));
    if (raw === null || raw.trim() === '') return fallback;
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'object' && parsed !== null ? parsed : fallback;
    } catch {
        console.warn('Невалидный JSON, использую значение по умолчанию');
        return fallback;
    }
}

/**
 * Собирает все входные данные у пользователя через консоль (prompt).
 * Если пользователь нажимает «Отмена» — берётся значение по умолчанию.
 * @returns {{
 *   streakStr: string,
 *   transactions: number[],
 *   defaultConfig: Object,
 *   userConfig: Object,
 *   historyCount: number,
 *   historyValue: string
 * }}
 */
export function readCashbackInputsFromConsole() {
    const streakStr = askString(
        'Task 2.3 — строка из 0 и 1 (активные дни кешбэка):',
        '1110110111101'
    );
    const transactions = askNumberArray(
        'Task 1.4 — суммы транзакций через запятую:',
        [100, 200, 150, 300]
    );
    const defaultConfig = askJSON(
        'Task 3.1 — конфиг по умолчанию (JSON):',
        { theme: 'light', notifications: true }
    );
    const userConfig = askJSON(
        'Task 3.1 — пользовательский конфиг (JSON):',
        { notifications: false, region: 'RU' }
    );
    const historyCount = askInteger(
        'Task 1.9 — длина истории кешбэка (число):',
        5
    );
    const historyValue = askString(
        'Task 1.9 — значение для заполнения истории:',
        'Pending'
    );

    return { streakStr, transactions, defaultConfig, userConfig, historyCount, historyValue };
}

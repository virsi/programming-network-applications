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

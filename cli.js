import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import {
    calculateTransactionStats,
    initCashbackHistory,
    getMaxCashbackStreak,
    mergeAccountConfigs,
    simulateProcessing,
} from './utils/cashbackUtils.js';

const isInteractive = stdin.isTTY;

let askLine;
let close;

if (isInteractive) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    askLine = (q) => rl.question(q);
    close = () => rl.close();
} else {
    let buffered = '';
    for await (const chunk of stdin) buffered += chunk;
    const lines = buffered.split(/\r?\n/);
    let idx = 0;
    askLine = async (q) => {
        stdout.write(q);
        const line = lines[idx++] ?? '';
        stdout.write(line + '\n');
        return line;
    };
    close = () => {};
}

function parseNumberArray(raw, fallback) {
    if (!raw.trim()) return fallback;
    const parsed = raw
        .split(/[,\s]+/)
        .map((s) => Number(s))
        .filter((n) => !Number.isNaN(n));
    return parsed.length > 0 ? parsed : fallback;
}

function parseInteger(raw, fallback) {
    if (!raw.trim()) return fallback;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? fallback : n;
}

function parseJSON(raw, fallback) {
    if (!raw.trim()) return fallback;
    try {
        const v = JSON.parse(raw);
        return typeof v === 'object' && v !== null ? v : fallback;
    } catch {
        console.warn('  ⚠️  Невалидный JSON, использую значение по умолчанию');
        return fallback;
    }
}

function header(title) {
    console.log(`\n=== ${title} ===`);
}

async function main() {
    console.log('┌───────────────────────────────────────────────┐');
    console.log('│  Sber Cashback — алгоритмические задачи (CLI) │');
    console.log('│  Подсказка: Enter с пустой строкой = дефолт   │');
    console.log('└───────────────────────────────────────────────┘');

    header('Task 2.3 — максимальная серия активных дней');
    const streakRaw = await askLine('Строка из 0 и 1 [1110110111101]: ');
    const streakStr = streakRaw.trim() || '1110110111101';
    console.log(`  → max streak = ${getMaxCashbackStreak(streakStr)}`);

    header('Task 1.4 — сумма и произведение транзакций');
    const txRaw = await askLine('Суммы через запятую [100, 200, 150, 300]: ');
    const transactions = parseNumberArray(txRaw, [100, 200, 150, 300]);
    const stats = calculateTransactionStats(transactions);
    console.log(`  → sum  = ${stats.sum}`);
    console.log(`  → mult = ${stats.mult}`);

    header('Task 3.1 — слияние конфигов');
    const cfg1Raw = await askLine('Первый конфиг JSON [{"theme":"light","notifications":true}]: ');
    const cfg2Raw = await askLine('Второй конфиг JSON [{"notifications":false,"region":"RU"}]: ');
    const c1 = parseJSON(cfg1Raw, { theme: 'light', notifications: true });
    const c2 = parseJSON(cfg2Raw, { notifications: false, region: 'RU' });
    console.log('  → merged =', mergeAccountConfigs(c1, c2));

    header('Task 1.9 — заполнение истории');
    const countRaw = await askLine('Длина истории [5]: ');
    const valueRaw = await askLine('Значение для заполнения [Pending]: ');
    const count = parseInteger(countRaw, 5);
    const value = valueRaw.trim() || 'Pending';
    console.log('  → history =', initCashbackHistory(count, value));

    header('Бонус — do…while: имитация обработки');
    const limitRaw = await askLine('Сколько транзакций обработать [3]: ');
    simulateProcessing(parseInteger(limitRaw, 3));

    close();
}

main().catch((err) => {
    console.error(err);
    close();
    process.exit(1);
});

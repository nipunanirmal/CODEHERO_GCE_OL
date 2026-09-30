// Coverage matrix for the pseudo executor (block-game dialect).
// Grammar: BEGIN/END, INPUT x, OUTPUT expr|"s",x, IF c THEN/ELSE/ENDIF,
//          WHILE c DO/ENDWHILE, FOR k = a TO b/NEXT k, REPEAT/UNTIL c, x = expr
// Run: node security-tests/pseudocode-coverage.mjs
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '../src/utils/pseudoExecutor.js'), 'utf8');
fs.writeFileSync(path.join(here, '_pseudo.mjs'),
    src.replace("from './PascalASTInterpreter'", "from '../src/utils/PascalASTInterpreter.js'"));
const { executePseudoCode } = await import('./_pseudo.mjs');

let pass = 0, fail = 0;
const rows = [];

async function run(code, inputs = {}) {
    const steps = await executePseudoCode(code.split('\n').map(t => ({ text: t })), inputs);
    const last = steps[steps.length - 1] || { logs: [] };
    return { logs: last.logs.join('\n'), steps };
}
async function chk(name, code, inputs, expected) {
    const { logs } = await run(code, inputs);
    const ok = logs === expected;
    ok ? pass++ : fail++;
    rows.push(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(44)} ${JSON.stringify(logs).slice(0, 80)}`);
}

// ── Basics ──────────────────────────────────────────────────────
await chk('OUTPUT literal', `BEGIN\nOUTPUT "Hi"\nEND`, {}, 'Hi');
await chk('assign + OUTPUT', `BEGIN\nx = 5\nOUTPUT x\nEND`, {}, '5');
await chk('arith precedence', `BEGIN\nx = 2 + 3 * 4\nOUTPUT x\nEND`, {}, '14');
await chk('parens', `BEGIN\nx = (2 + 3) * 4\nOUTPUT x\nEND`, {}, '20');
await chk('MOD', `BEGIN\nx = 10 MOD 3\nOUTPUT x\nEND`, {}, '1');
await chk('DIV', `BEGIN\nx = 10 DIV 3\nOUTPUT x\nEND`, {}, '3');
await chk('slash', `BEGIN\nx = 10 / 4\nOUTPUT x\nEND`, {}, '2.5');
await chk('unary minus', `BEGIN\nx = -3 + 5\nOUTPUT x\nEND`, {}, '2');
await chk('string literal', `BEGIN\nx = "abc"\nOUTPUT x\nEND`, {}, 'abc');
await chk('string concat +', `BEGIN\nn = "Sam"\nx = n + " Silva"\nOUTPUT x\nEND`, {}, 'Sam Silva');
await chk('multi OUTPUT args', `BEGIN\na = 1\nb = 2\nOUTPUT a, " + ", b\nEND`, {}, '1 + 2');
await chk('INPUT context', `BEGIN\nINPUT n\nOUTPUT n * 2\nEND`, { n: 21 }, '42');

// ── Conditions ──────────────────────────────────────────────────
await chk('IF true', `BEGIN\nage = 20\nIF age >= 18 THEN\nOUTPUT "Adult"\nENDIF\nEND`, {}, 'Adult');
await chk('IF false skips', `BEGIN\nage = 5\nIF age >= 18 THEN\nOUTPUT "Adult"\nENDIF\nOUTPUT "done"\nEND`, {}, 'done');
await chk('IF/ELSE', `BEGIN\nage = 5\nIF age >= 18 THEN\nOUTPUT "Adult"\nELSE\nOUTPUT "Minor"\nENDIF\nEND`, {}, 'Minor');
await chk('single = in cond', `BEGIN\nx = 7\nIF x = 7 THEN\nOUTPUT "eq"\nENDIF\nEND`, {}, 'eq');
await chk('AND', `BEGIN\nIF 1 = 1 AND 2 = 2 THEN\nOUTPUT "both"\nENDIF\nEND`, {}, 'both');
await chk('OR', `BEGIN\nIF 1 = 2 OR 2 = 2 THEN\nOUTPUT "either"\nENDIF\nEND`, {}, 'either');
await chk('NOT', `BEGIN\nIF NOT (1 = 2) THEN\nOUTPUT "yes"\nENDIF\nEND`, {}, 'yes');
await chk('nested IF', `BEGIN\nx = 5\nIF x > 0 THEN\nIF x > 10 THEN\nOUTPUT "big"\nELSE\nOUTPUT "small"\nENDIF\nENDIF\nEND`, {}, 'small');
await chk('<> not-eq', `BEGIN\nIF 1 <> 2 THEN\nOUTPUT "neq"\nENDIF\nEND`, {}, 'neq');
await chk('>= not mangled to >==', `BEGIN\nIF 5 >= 5 THEN\nOUTPUT "ok"\nENDIF\nEND`, {}, 'ok');
await chk('<= works', `BEGIN\nIF 4 <= 5 THEN\nOUTPUT "ok"\nENDIF\nEND`, {}, 'ok');
await chk('string cond', `BEGIN\np = "123"\nIF p = "123" THEN\nOUTPUT "in"\nENDIF\nEND`, {}, 'in');

// ── Loops ───────────────────────────────────────────────────────
await chk('WHILE DO', `BEGIN\ni = 0\nWHILE i < 3 DO\ni = i + 1\nOUTPUT i\nENDWHILE\nEND`, {}, '1\n2\n3');
await chk('FOR k = 1 TO 5', `BEGIN\nFOR k = 1 TO 5\nOUTPUT k\nNEXT k\nEND`, {}, '1\n2\n3\n4\n5');
await chk('FOR with STEP? (n/a)', `BEGIN\nFOR k = 1 TO 3\nOUTPUT k * 10\nNEXT k\nEND`, {}, '10\n20\n30');
await chk('REPEAT UNTIL', `BEGIN\ni = 0\nREPEAT\ni = i + 1\nOUTPUT i\nUNTIL i >= 3\nEND`, {}, '1\n2\n3');
await chk('REPEAT until eq', `BEGIN\nINPUT p\nREPEAT\nINPUT p\nUNTIL p == "123"\nOUTPUT "Access Granted"\nEND`, { p: ['999', '123'] }, 'Access Granted');
await chk('nested WHILE', `BEGIN\ni = 1\nWHILE i <= 2 DO\nj = 1\nWHILE j <= 2 DO\nOUTPUT i * 10 + j\nj = j + 1\nENDWHILE\ni = i + 1\nENDWHILE\nEND`, {}, '11\n12\n21\n22');
await chk('infinite WHILE stopped', `BEGIN\nWHILE 1 = 1 DO\nx = x + 1\nENDWHILE\nOUTPUT "done"\nEND`, {}, ''); // 1000-step cap truncates the run — no hang, no 'done'

// ── Injection resistance ────────────────────────────────────────
// Injection payloads — every one must fail closed (eval error → false), never execute.
const PWNED = { val: 0 };
globalThis.__pseudoPwn = PWNED;
const injChecks = [
    ['semicolon stmt', `BEGIN\nx = 1; __pseudoPwn.val = 1\nOUTPUT x\nEND`],
    ['comma/assign', `BEGIN\nx = (__pseudoPwn.val = 1)\nOUTPUT x\nEND`],
    ['method call', `BEGIN\nx = n.toString()\nOUTPUT x\nEND`],
    ['property access', `BEGIN\nx = n.length\nOUTPUT x\nEND`],
    ['globalThis', `BEGIN\nx = globalThis\nOUTPUT x\nEND`],
    ['constructor escape', `BEGIN\nx = n.constructor\nOUTPUT x\nEND`],
    ['IF-inject', `BEGIN\nIF 1 = 1, __pseudoPwn.val = 1 THEN\nOUTPUT "ran"\nENDIF\nOUTPUT "done"\nEND`],
];
for (const [name, code] of injChecks) {
    const { logs } = await run(code, { n: 5 });
    const ok = PWNED.val === 0 && logs.length > 0; // payload didn't run, executor didn't crash
    ok ? pass++ : fail++;
    rows.push(`${ok ? 'PASS' : 'FAIL'}  injection safe: ${name.padEnd(30)} ${JSON.stringify(logs).slice(0, 60)}`);
}
rows.push(`${PWNED.val === 0 ? 'PASS' : 'FAIL'}  side-effect marker untouched            ${PWNED.val}`);
console.log('\n===== PSEUDOCODE EXECUTOR COVERAGE =====\n');
for (const r of rows) console.log(r);
console.log(`\n${pass} passed, ${fail} failed out of ${rows.length}`);

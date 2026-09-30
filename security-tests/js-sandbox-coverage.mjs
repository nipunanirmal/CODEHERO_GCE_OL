// JS preview sandbox coverage + security matrix.
// Run: node security-tests/js-sandbox-coverage.mjs
import { addLoopGuards, buildSandboxedDocument } from '../src/components/HTMLIDE/previewSandbox.js';

let pass = 0, fail = 0;
const results = [];

function guarded(name, code, shouldGuard = true) {
    const out = addLoopGuards(code);
    const has = out.includes('__cgLoop');
    const ok = has === shouldGuard;
    ok ? pass++ : fail++;
    results.push({ name, status: ok ? 'PASS' : 'FAIL', out: JSON.stringify(out).slice(0, 100) });
}

function syntaxOk(code) {
    try { new Function(addLoopGuards(code).replace(/__cgLoop/g, '(()=>{})')); return true; }
    catch (e) { return 'SYNTAX: ' + e.message; }
}

// ── Every loop form ─────────────────────────────────────────────
guarded('while{}', 'while (c) { x(); }');
guarded('while ;', 'while (c);');
guarded('while stmt;', 'while (c) x++;');
guarded('while if-stmt', 'while (c) if (y) z();');
guarded('for{}', 'for (let i=0;i<n;i++) { x(); }');
guarded('for ;', 'for (;;) ;');
guarded('for stmt;', 'for (;;) x++;');
guarded('for-in {}', 'for (k in o) { x(); }');
guarded('for-of {}', 'for (const k of a) { x(); }');
guarded('do{}while', 'do { x(); } while (c);');
guarded('do ;while', 'do ; while (c);');
guarded('do stmt while', 'do x++; while (c);');
guarded('nested', 'while (a) { for (;;) { y(); } }');
guarded('label loop', 'outer: for (;;) { break outer; }');
guarded('while in string', "let s = 'while(1){}';", false);
guarded('while in comment', '// while(1){}\nx();', false);
guarded('while in block-comment', '/* while(1){} */\nx();', false);
guarded('template literal', 'let s = `while(1){}`;', false);
guarded('while in regex', 'let r = /while\\(1\\)/;', false);
guarded('dowhile in ident', 'mywhile(1);', false);
guarded('forEach (not a loop kw)', 'a.forEach(x => x());', false);
guarded('cond in parens w/ strings', 'while (s === ")") { x(); }');
guarded('labeled nested', 'outer: while(a) { inner: while(b) { break outer; } }');

// syntax validity of all transformations
console.log('=== addLoopGuards coverage ===');
for (const r of results) console.log(`${r.status.padEnd(5)} ${r.name.padEnd(30)} ${r.out}`);

console.log('\n=== syntax check of guarded output ===');
const syntaxCases = [
    'while (c) { x(); }', 'while (c);', 'while (c) x++;', 'for (;;) ;',
    'do ; while (c);', 'do x++; while (c);', 'while (c) if (y) z();',
    'outer: for (;;) { break outer; }', 'for (const k of a) { x(); }',
];
for (const c of syntaxCases) {
    const r = syntaxOk(c);
    console.log((r === true ? 'OK  ' : 'FAIL') + ' ' + c + (r === true ? '' : ' -> ' + r));
}

// ── Bridge-security probes (static analysis of generated doc) ───
console.log('\n=== bridge security probes ===');
const doc = buildSandboxedDocument('<body><script>/* student */</script>', 'TOKEN123');
const m = doc.match(/__cgLoop[^=]*=[^;]*;/);
console.log('1. __cgLoop is writable?', doc.includes('window.__cgLoop=function') ? 'YES — student code can overwrite it: `__cgLoop=function(){}` neutralizes the time guard' : 'no');
console.log('2. token in DOM?', doc.includes('TOKEN123') ? 'YES — student JS can read it via document.scripts → forge parent postMessage' : 'no');
console.log('3. eval/Function in student code?', doc.includes("unsafe-eval") ? 'ALLOWED' : 'BLOCKED by CSP (no unsafe-eval)');
console.log('4. <iframe src> allowed?', doc.includes('frame-src https:') ? 'YES https: — nested frames inherit sandbox flags' : 'no');

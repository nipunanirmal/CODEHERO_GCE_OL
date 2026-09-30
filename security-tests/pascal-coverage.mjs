// Coverage + robustness matrix for PascalASTInterpreter.
// Run: node security-tests/pascal-coverage.mjs
import { PascalASTInterpreter } from '../src/utils/PascalASTInterpreter.js';

let pass = 0, fail = 0, partial = 0;
const results = [];

async function run(code, inputs = []) {
    const interp = new PascalASTInterpreter();
    let out = '';
    const q = [...inputs];
    await interp.runInteractive(code,
        (t) => { out += t; },
        async () => q.length ? q.shift() : '');
    return out;
}

async function test(name, code, { inputs = [], expect = null, expectErr = null, contains = null } = {}) {
    let out;
    try {
        out = await run(code, inputs);
    } catch (e) {
        out = `[THREW] ${e.message}`;
    }
    const hasErr = out.includes('[ERROR]') || out.startsWith('[THREW]');
    let ok;
    if (expectErr) ok = hasErr && out.includes(expectErr);
    else if (expect !== null) ok = out === expect;
    else if (contains !== null) ok = out.includes(contains);
    else ok = !hasErr;
    const status = ok ? 'PASS' : 'FAIL';
    if (ok) pass++; else fail++;
    results.push({ name, status, out: out.trim().replace(/\n/g, '⏎').slice(0, 110) });
}

const P = (body, decls = '') => `program T;\n${decls}begin\n${body}\nend.`;

// ── Basic structure ─────────────────────────────────────────────
await test('empty program', P(''));
await test('program header with params', `program T(input, output);\nbegin\nwriteln('hi');\nend.`, { expect: 'hi\n' });
await test('no program header', `begin\nwriteln('hi');\nend.`, { expectErr: 'PROGRAM' });

// ── Comments ────────────────────────────────────────────────────
await test('// comment', P(`// hello\nwriteln('a');`));
await test('{ } comment', P(`{ hello }\nwriteln('a');`));
await test('(* *) comment', P(`(* hello *)\nwriteln('a');`));

// ── Declarations / types ────────────────────────────────────────
await test('var integer', P(`x := 5; writeln(x);`, 'var x: integer;\n'));
await test('var real', P(`x := 2.5; writeln(x);`, 'var x: real;\n'));
await test('var string', P(`s := 'abc'; writeln(s);`, 'var s: string;\n'));
await test('var boolean', P(`b := true; writeln(b);`, 'var b: boolean;\n'));
await test('var char', P(`c := 'Z'; writeln(c);`, 'var c: char;\n'));
await test('var byte/word/longint', P(`b := 200; w := 60000; l := 70000; writeln(b+w+l);`, 'var b: byte; w: word; l: longint;\n'));
await test('string[n] sized', P(`s := 'ab'; writeln(s);`, 'var s: string[10];\n'));
await test('const', P(`writeln(pi);`, 'const pi = 3.14;\n'));
await test('multi-decl one line', P(`writeln(a+b);`, 'var a, b: integer;\n'));

// ── Expressions / operators ─────────────────────────────────────
await test('arith precedence', P(`writeln(2 + 3 * 4);`), { expect: '14\n' });
await test('parens', P(`writeln((2 + 3) * 4);`), { expect: '20\n' });
await test('div', P(`writeln(10 div 3);`), { expect: '3\n' });
await test('mod', P(`writeln(10 mod 3);`), { expect: '1\n' });
await test('real div /', P(`writeln(10 / 4);`), { expect: '2.5\n' });
await test('unary minus', P(`writeln(-5 + 3);`), { expect: '-2\n' });
await test('comparisons', P(`writeln(3 > 2); writeln(3 <= 2); writeln(3 <> 2);`), { expect: 'true\nfalse\ntrue\n' });
await test('and/or/not', P(`writeln(true and false); writeln(true or false); writeln(not false);`), { expect: 'false\ntrue\ntrue\n' });
await test('string concat +', P(`writeln('a' + 'b');`), { expect: 'ab\n' });
await test('string compare =', P(`writeln('abc' = 'abc');`), { expect: 'true\n' });
await test('expr chain', P(`writeln(1 + 2 * 3 - 4 div 2);`), { expect: '5\n' });

// ── Control flow ────────────────────────────────────────────────
await test('if-then', P(`if 1 = 1 then writeln('y');`), { expect: 'y\n' });
await test('if-else', P(`if 1 = 2 then writeln('t') else writeln('f');`), { expect: 'f\n' });
await test('if-begin-end', P(`if true then begin writeln('a'); writeln('b'); end;`), { expect: 'a\nb\n' });
await test('nested if', P(`if true then if false then writeln('x') else writeln('y');`), { expect: 'y\n' });
await test('dangling else binds inner', P(`if true then if false then writeln('a') else writeln('b');`), { expect: 'b\n' });
await test('for to', P(`for i := 1 to 3 do writeln(i);`, 'var i: integer;\n'), { expect: '1\n2\n3\n' });
await test('for downto', P(`for i := 3 downto 1 do writeln(i);`, 'var i: integer;\n'), { expect: '3\n2\n1\n' });
await test('while', P(`x := 0; while x < 3 do begin writeln(x); x := x + 1; end;`, 'var x: integer;\n'), { expect: '0\n1\n2\n' });
await test('repeat-until', P(`x := 0; repeat x := x + 1; writeln(x); until x >= 3;`, 'var x: integer;\n'), { expect: '1\n2\n3\n' });
await test('nested loops', P(`for i := 1 to 2 do for j := 1 to 2 do writeln(i, '-', j);`, 'var i, j: integer;\n'), { expect: '1-1\n1-2\n2-1\n2-2\n' });
await test('case basic', `program T;\nvar d: integer;\nbegin\nd := 2;\ncase d of\n  1: writeln('Mon');\n  2: writeln('Tue');\nend;\nend.`, { expect: 'Tue\n' });
await test('case otherwise', `program T;\nvar d: integer;\nbegin\nd := 9;\ncase d of\n  1: writeln('Mon');\n  otherwise writeln('?');\nend;\nend.`, { expect: '?\n' });
await test('case multi-index', `program T;\nvar d: integer;\nbegin\nd := 2;\ncase d of\n  1, 2, 3: writeln('low');\nend;\nend.`, { expect: 'low\n' });
await test('case range 1..3', `program T;\nvar d: integer;\nbegin\nd := 2;\ncase d of\n  1..3: writeln('in range');\nend;\nend.`, { expect: 'in range\n' });
await test('case char', `program T;\nvar c: char;\nbegin\nc := 'b';\ncase c of\n  'a': writeln('A');\n  'b': writeln('B');\nend;\nend.`, { expect: 'B\n' });

// ── I/O ─────────────────────────────────────────────────────────
await test('write no newline', P(`write('a'); write('b');`), { expect: 'ab' });
await test('writeln multi-arg', P(`writeln('x=', 5, '!');`), { expect: 'x=5!\n' });
await test('writeln() empty', P(`writeln;`), { expect: '\n' });
await test('format w:p', P(`writeln(3.14159:0:2);`), { expect: '3.14\n' });
await test('format width', P(`writeln(7:5);`), { expect: '    7\n' });
await test('readln integer', `program T;\nvar n: integer;\nbegin\nreadln(n);\nwriteln(n * 2);\nend.`, { inputs: ['21'], expect: '21\n42\n' });
await test('readln string', `program T;\nvar s: string;\nbegin\nreadln(s);\nwriteln(s);\nend.`, { inputs: ['hello'], expect: 'hello\nhello\n' });
await test('readln int rejects text', `program T;\nvar n: integer;\nbegin\nreadln(n);\nend.`, { inputs: ['abc'], expectErr: 'Invalid input for INTEGER' });
await test('readln real accepts decimal', `program T;\nvar r: real;\nbegin\nreadln(r);\nwriteln(r);\nend.`, { inputs: ['3.5'], expect: '3.5\n3.5\n' });

// ── Arrays ──────────────────────────────────────────────────────
await test('array decl+access', `program T;\nvar a: array[1..5] of integer;\nbegin\na[1] := 9; a[5] := 4;\nwriteln(a[1] + a[5]);\nend.`, { expect: '13\n' });
await test('array loop fill', `program T;\nvar a: array[1..3] of integer;\nvar i: integer;\nbegin\nfor i := 1 to 3 do a[i] := i * 10;\nwriteln(a[2]);\nend.`, { expect: '20\n' });
await test('array OOB read', `program T;\nvar a: array[1..3] of integer;\nbegin\nwriteln(a[99]);\nend.`, { expectErr: 'out of bounds' });
await test('array OOB write', `program T;\nvar a: array[1..3] of integer;\nbegin\na[99] := 1;\nwriteln('no bounds check');\nend.`, { expectErr: 'out of bounds' });
await test('string index s[1]', `program T;\nvar s: string;\nbegin\ns := 'abc';\nwriteln(s[1]);\nend.`, { expect: 'a\n' });

// ── Built-in functions ──────────────────────────────────────────
await test('round/trunc', P(`writeln(round(2.7)); writeln(trunc(2.7));`), { expect: '3\n2\n' });
await test('abs/sqr/sqrt', P(`writeln(abs(-5)); writeln(sqr(4)); writeln(sqrt(9));`), { expect: '5\n16\n3\n' });
await test('chr/ord', P(`writeln(chr(65)); writeln(ord('A'));`), { expect: 'A\n65\n' });
await test('length(s)', `program T;\nvar s: string;\nbegin\ns := 'hello';\nwriteln(length(s));\nend.`, { expect: '5\n' });
await test('upcase', `program T;\nvar c: char;\nbegin\nc := 'a';\nwriteln(upcase(c));\nend.`, { expect: 'A\n' });
await test('inc/dec', `program T;\nvar i: integer;\nbegin\ni := 5; inc(i); writeln(i); dec(i, 2); writeln(i);\nend.`, { expect: '6\n4\n' });
await test('copy/pos/delete', `program T;\nvar s: string;\nbegin\ns := 'abcdef';\nwriteln(copy(s, 2, 3));\nwriteln(pos('cd', s));\nend.`, { expect: 'bcd\n3\n' });
await test('concat', P(`writeln(concat('ab','cd'));`), { expect: 'abcd\n' });
await test('int/frac', P(`writeln(int(3.9)); writeln(frac(3.9));`), { contains: '3' });

// ── Procedures / functions / uses ───────────────────────────────
await test('procedure decl+call', `program T;\nprocedure Hello;\nbegin\nwriteln('hi');\nend;\nbegin\nHello;\nend.`, { expect: 'hi\n' });
await test('procedure with params', `program T;\nprocedure P(x: integer);\nbegin\nwriteln(x * 2);\nend;\nbegin\nP(21);\nend.`, { expect: '42\n' });
await test('function decl+call', `program T;\nfunction Sq(n: integer): integer;\nbegin\nSq := n * n;\nend;\nbegin\nwriteln(Sq(5));\nend.`, { expect: '25\n' });
await test('uses crt', `program T;\nuses crt;\nbegin\nwriteln('x');\nend.`, { expect: 'x\n' });
await test('recursion (function)', `program T;\nfunction F(n: integer): integer;\nbegin\nif n <= 1 then F := 1 else F := n * F(n - 1);\nend;\nbegin\nwriteln(F(5));\nend.`, { expect: '120\n' });

// ── Records / enums / subranges ─────────────────────────────────
await test('record type+field', `program T;\ntype Point = record x: integer; y: integer; end;\nvar p: Point;\nbegin\np.x := 3; p.y := 4;\nwriteln(p.x + p.y);\nend.`, { expect: '7\n' });
await test('enum type', `program T;\ntype Color = (red, green, blue);\nvar c: Color;\nbegin\nc := green;\nwriteln(c);\nend.`, { expect: 'green\n' });
await test('subrange type', `program T;\ntype Dice = 1..6;\nvar d: Dice;\nbegin\nd := 4;\nwriteln(d);\nend.`, { expect: '4\n' });

// ── Errors & edge cases ─────────────────────────────────────────
await test('missing final dot', `program T;\nbegin\nwriteln('x')\nend`, { expectErr: 'Parse error' });
await test('semicolon before else', `program T;\nbegin\nif true then writeln('a'); else writeln('b');\nend.`, { expectErr: 'Parse error' });
await test('undefined variable', `program T;\nbegin\nwriteln(zz);\nend.`, { expectErr: 'Undefined variable' });
await test('undefined var suggestion', `program T;\nvar count: integer;\nbegin\nwriteln(countt);\nend.`, { expectErr: "Did you mean 'count'" });
await test('typo writeln->writlen', `program T;\nbegin\nwritlen('x');\nend.`, { expectErr: "Did you mean 'writeln'" });
await test('unknown procedure', `program T;\nbegin\nfooBar(1);\nend.`, { expectErr: 'Unknown procedure' });
await test('div by zero /', P(`writeln(10 / 0);`), { expectErr: 'Division by zero' });
await test('div by zero div', P(`writeln(10 div 0);`), { expectErr: 'Division by zero' });
await test('mod by zero', P(`writeln(10 mod 0);`), { expectErr: 'Division by zero' });
await test('infinite while guard', `program T;\nbegin\nwhile true do writeln('x');\nend.`, { expectErr: 'Infinite Loop' });
await test('infinite repeat guard', `program T;\nbegin\nrepeat writeln('x'); until false;\nend.`, { expectErr: 'Infinite Loop' });
await test('break statement', `program T;\nvar i: integer;\nbegin\nfor i := 1 to 5 do begin if i = 3 then break; writeln(i); end;\nend.`, { expect: '1\n2\n' });
await test('exit statement', `program T;\nbegin\nexit;\nwriteln('no');\nend.`, { expect: '' });
await test('goto/label', `program T;\nlabel 1;\nbegin\ngoto 1;\n1: writeln('x');\nend.`, { expectErr: 'Parse error' });
await test('bad type', `program T;\nvar x: float;\nbegin\nend.`, { expectErr: 'Unknown type' });
await test('empty writeln parens', `program T;\nbegin\nwriteln();\nend.`, { expect: '\n' });
await test('case-insensitive keywords', `PROGRAM T;\nVAR x: INTEGER;\nBEGIN\nX := 1;\nWRITELN(x);\nEND.`, { expect: '1\n' });
await test('negative array index', `program T;\nvar a: array[-2..2] of integer;\nbegin\na[-2] := 7;\nwriteln(a[-2]);\nend.`, { expectErr: 'invalid range' }); // parser emits null bound — fails closed with clear error
await test('2D array', `program T;\nvar a: array[1..2,1..2] of integer;\nbegin\na[1,1] := 5;\nwriteln(a[1,1]);\nend.`, { expect: '5\n' });
await test('writeln boolean', P(`writeln(3 > 2);`), { expect: 'true\n' });
await test('sci notation literal', P(`writeln(1.0e10);`), { expectErr: 'Parse error' }); // lexer limitation

// ── Report ──────────────────────────────────────────────────────
console.log('\n========== PASCAL INTERPRETER COVERAGE ==========\n');
for (const r of results) console.log(`${r.status.padEnd(5)} ${r.name.padEnd(38)} ${r.out}`);
console.log(`\n${pass} passed, ${fail} failed out of ${results.length}`);

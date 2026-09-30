import { PascalASTInterpreter } from '../src/utils/PascalASTInterpreter.js';

/**
 * Executes Pseudo Code / Pascal blocks using the unified AST Interpreter.
 * Now returns a Promise resolving to the execution trace.
 * 
 * @param {Array} blocks - Array of block objects { id, text }
 * @param {Object} inputContext - Map of variables or inputs
 * @returns {Promise<Array>} - Execution steps
 */
// --- Regex-Based Pseudo Code Interpreter (Legacy Style) ---

const runPseudoTrace = async (code, inputContext = {}) => {
    const lines = code.split('\n');
    const steps = [];
    const variables = {};
    const logs = [];

    // Initialize input queues
    const inputQueues = {};
    for (const k in inputContext) {
        if (Array.isArray(inputContext[k])) {
            inputQueues[k] = [...inputContext[k]]; // Clone array
        } else {
            inputQueues[k] = [inputContext[k]]; // Wrap single value
        }
        variables[k] = ""; // Default empty string safely
    }

    let currentLine = 0;
    let stepLimit = 0;

    // Helper to evaluate simple expressions: "age >= 18", "a + b", "num MOD 2", "password == '123'"
    // Safe recursive-descent evaluator — never compiles code (no Function()/eval),
    // so INPUT values and block text can never execute as JavaScript.
    const tokenizeExpr = (src) => {
        const tokens = [];
        let i = 0;
        while (i < src.length) {
            const c = src[i];
            if (/\s/.test(c)) { i++; continue; }
            if (c === "'" || c === '"') {
                let j = i + 1, out = '';
                while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; out += src[j]; j++; }
                tokens.push({ t: 'str', v: out });
                i = j + 1;
                continue;
            }
            if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
                const m = src.slice(i).match(/^\d*\.?\d+/);
                tokens.push({ t: 'num', v: parseFloat(m[0]) });
                i += m[0].length;
                continue;
            }
            if (/[A-Za-z_]/.test(c)) {
                const m = src.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
                const word = m[0].toUpperCase();
                if (['AND', 'OR', 'NOT', 'MOD', 'DIV', 'TRUE', 'FALSE'].includes(word)) {
                    tokens.push({ t: 'op', v: word });
                } else {
                    tokens.push({ t: 'id', v: m[0] });
                }
                i += m[0].length;
                continue;
            }
            const two = src.slice(i, i + 2);
            if (['<=', '>=', '<>', '!=', '==', '&&', '||'].includes(two)) {
                tokens.push({ t: 'op', v: two });
                i += 2;
                continue;
            }
            if ('+-*/%()<>=!,'.includes(c)) {
                tokens.push({ t: 'op', v: c });
                i++;
                continue;
            }
            i++; // skip unknown characters
        }
        return tokens;
    };

    const evaluateExpr = (expr) => {
        const toNum = (v) => {
            if (typeof v === 'number') return v;
            if (typeof v === 'boolean') return v ? 1 : 0;
            const n = Number(v);
            return Number.isNaN(n) ? NaN : n;
        };
        const truthy = (v) => (typeof v === 'string' ? v !== '' : Boolean(v));
        const looseEq = (a, b) => {
            if (typeof a === typeof b) return a === b;
            const na = toNum(a), nb = toNum(b);
            return !Number.isNaN(na) && !Number.isNaN(nb) ? na === nb : String(a) === String(b);
        };
        const relCmp = (a, b, cmp) => {
            const na = toNum(a), nb = toNum(b);
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return cmp(na, nb);
            return cmp(String(a), String(b));
        };

        const tokens = tokenizeExpr(String(expr));
        let pos = 0;
        const peek = () => tokens[pos];
        const isOp = (...ops) => peek()?.t === 'op' && ops.includes(peek().v);

        // precedence: or < and < equality < relational < additive < multiplicative < unary < primary
        const parseOr = () => {
            let l = parseAnd();
            while (isOp('OR', '||')) { pos++; const r = parseAnd(); l = truthy(l) || truthy(r); }
            return l;
        };
        const parseAnd = () => {
            let l = parseEq();
            while (isOp('AND', '&&')) { pos++; const r = parseEq(); l = truthy(l) && truthy(r); }
            return l;
        };
        const parseEq = () => {
            let l = parseRel();
            while (isOp('=', '==', '<>', '!=')) {
                const op = tokens[pos++].v;
                const r = parseRel();
                l = (op === '<>' || op === '!=') ? !looseEq(l, r) : looseEq(l, r);
            }
            return l;
        };
        const parseRel = () => {
            let l = parseAdd();
            while (isOp('<', '<=', '>', '>=')) {
                const op = tokens[pos++].v;
                const r = parseAdd();
                l = relCmp(l, r, { '<': (a, b) => a < b, '<=': (a, b) => a <= b, '>': (a, b) => a > b, '>=': (a, b) => a >= b }[op]);
            }
            return l;
        };
        const parseAdd = () => {
            let l = parseMul();
            while (isOp('+', '-')) {
                const op = tokens[pos++].v;
                const r = parseMul();
                if (op === '+' && (typeof l === 'string' || typeof r === 'string')) l = String(l) + String(r);
                else l = op === '+' ? toNum(l) + toNum(r) : toNum(l) - toNum(r);
            }
            return l;
        };
        const parseMul = () => {
            let l = parseUnary();
            while (isOp('*', '/', '%', 'MOD', 'DIV')) {
                const op = tokens[pos++].v;
                const r = parseUnary();
                const a = toNum(l), b = toNum(r);
                l = op === '*' ? a * b
                    : op === '/' ? a / b
                    : op === 'DIV' ? Math.trunc(a / b)
                    : a % b; // '%' and 'MOD'
            }
            return l;
        };
        const parseUnary = () => {
            if (isOp('NOT', '!')) { pos++; return !truthy(parseUnary()); }
            if (isOp('-')) { pos++; return -toNum(parseUnary()); }
            if (isOp('+')) { pos++; return toNum(parseUnary()); }
            return parsePrimary();
        };
        const parsePrimary = () => {
            const tk = tokens[pos++];
            if (!tk) throw new Error('unexpected end of expression');
            if (tk.t === 'num' || tk.t === 'str') return tk.v;
            if (tk.t === 'id') {
                if (tk.v in variables) return variables[tk.v];
                // Pascal/pseudo code is case-insensitive
                const lower = tk.v.toLowerCase();
                const hit = Object.keys(variables).find((k) => k.toLowerCase() === lower);
                if (hit !== undefined) return variables[hit];
                return tk.v; // bare word used as text (e.g. OUTPUT Hello)
            }
            if (tk.v === '(') {
                const v = parseOr();
                if (tokens[pos]?.v !== ')') throw new Error('missing )');
                pos++;
                return v;
            }
            if (tk.v === 'TRUE') return true;
            if (tk.v === 'FALSE') return false;
            throw new Error('unexpected token ' + tk.v);
        };

        try {
            const v = parseOr();
            if (pos < tokens.length) throw new Error('trailing tokens');
            return v;
        } catch (e) {
            console.warn("Eval error:", expr, e);
            return false;
        }
    };

    while (currentLine < lines.length && stepLimit < 1000) {
        stepLimit++;
        const rawLine = lines[currentLine];
        const line = rawLine.trim();

        // Record STEP START
        // Deep copy vars
        steps.push({
            lineIndex: currentLine,
            text: "",
            logs: [...logs],
            variables: { ...variables }
        });

        if (!line || line.toUpperCase() === 'BEGIN' || line.toUpperCase() === 'END' || line.toUpperCase() === 'ENDIF') {
            currentLine++;
            continue;
        }

        // Logic
        if (/^INPUT\s+/i.test(line)) {
            const varName = line.replace(/^INPUT\s+/i, '').trim();

            // Consume from queue
            let val = "";
            if (inputQueues[varName] && inputQueues[varName].length > 0) {
                val = inputQueues[varName].shift();
            } else if (inputQueues[Object.keys(inputQueues)[0]] && inputQueues[Object.keys(inputQueues)[0]].length > 0) {
                // Fallback: if varName usage mismatch, try using first available input queue?
                // Some levels might have mismatch.
                val = inputQueues[Object.keys(inputQueues)[0]].shift();
            }

            variables[varName] = val;
            // Update step variables so UI shows the new value immediately
            steps[steps.length - 1].variables = { ...variables };
            currentLine++;
        }
        else if (/^OUTPUT\s+/i.test(line)) {
            const content = line.replace(/^OUTPUT\s+/i, '').trim();
            // content could be var or string literal
            // OUTPUT "Pass" -> Pass
            // OUTPUT grade -> A
            // OUTPUT "Hello", name -> ?

            // Simple split by comma not robust for quotes.
            // Just eval it?
            let output = evaluateExpr(content);
            // If eval fails (e.g. multiple args not valid JS expr), try ad-hoc
            if (content.includes(',')) {
                // Split parts
                const parts = content.split(',').map(p => p.trim());
                output = parts.map(p => {
                    if (p.startsWith('"') || p.startsWith("'")) return p.slice(1, -1);
                    return variables[p] ?? p;
                }).join(''); // literal fidelity — spaces come from the quoted parts
            }

            logs.push(String(output));
            steps[steps.length - 1].logs = [...logs]; // Update current step logs
            currentLine++;
        }
        else if (/^IF\s+(.+?)\s+THEN/i.test(line)) {
            const match = line.match(/^IF\s+(.+?)\s+THEN/i);
            const condition = match[1];
            // Handle single = as == in condition
            // Single `=` -> `==`, but leave `>=`, `<=`, `!=`, `<>` alone.
            const jsCond = condition.replace(/([^=<>!])=(?!=)/g, '$1==');

            if (evaluateExpr(jsCond)) {
                currentLine++; // Enter block
            } else {
                // Skip to ELSE or ENDIF
                // Scan forward balancing IF/ENDIF? 
                // Simple version: scan for matching indentation or keywords?
                // Robust: match ENDIF/ELSE at same nesting level.
                let depth = 0;
                let found = false;
                for (let i = currentLine + 1; i < lines.length; i++) {
                    const l = lines[i].trim().toUpperCase();
                    if (l.startsWith('IF ')) depth++;
                    if (l === 'ENDIF') {
                        if (depth === 0) {
                            currentLine = i; // Go to ENDIF (will advance next loop)
                            found = true;
                            break;
                        }
                        depth--;
                    }
                    if (l === 'ELSE' && depth === 0) {
                        currentLine = i + 1; // Enter ELSE block
                        found = true;
                        break;
                    }
                }
                if (!found) currentLine++; // Fallback
            }
        }
        else if (/^ELSE/i.test(line)) {
            // If we hit ELSE, it means we just finished TRUE block (or fell through).
            // Skip to ENDIF.
            let depth = 0;
            for (let i = currentLine + 1; i < lines.length; i++) {
                const l = lines[i].trim().toUpperCase();
                if (l.startsWith('IF ')) depth++;
                if (l === 'ENDIF') {
                    if (depth === 0) {
                        currentLine = i;
                        break;
                    }
                    depth--;
                }
            }
        }
        else if (/^WHILE\s+(.+?)\s+DO/i.test(line)) {
            const match = line.match(/^WHILE\s+(.+?)\s+DO/i);
            const condition = match[1];
            // Single `=` -> `==`, but leave `>=`, `<=`, `!=`, `<>` alone.
            const jsCond = condition.replace(/([^=<>!])=(?!=)/g, '$1==');

            if (evaluateExpr(jsCond)) {
                currentLine++; // Enter loop
            } else {
                // Skip to ENDWHILE
                let depth = 0;
                for (let i = currentLine + 1; i < lines.length; i++) {
                    const l = lines[i].trim().toUpperCase();
                    if (l.startsWith('WHILE ')) depth++;
                    if (l === 'ENDWHILE') {
                        if (depth === 0) {
                            currentLine = i + 1; // Skip ENDWHILE
                            break;
                        }
                        depth--;
                    }
                }
            }
        }
        else if (/^ENDWHILE/i.test(line)) {
            // Find corresponding WHILE to loop back
            let depth = 0;
            for (let i = currentLine - 1; i >= 0; i--) {
                const l = lines[i].trim().toUpperCase();
                if (l === 'ENDWHILE') depth++;
                if (l.startsWith('WHILE') && l.endsWith('DO')) {
                    if (depth === 0) {
                        currentLine = i; // Jump back to WHILE check
                        break;
                    }
                    depth--;
                }
            }
        }
        else if (/^FOR\s+(\w+)\s*=\s*(.+?)\s+TO\s+(.+)$/i.test(line)) {
            // FOR k = 1 TO 5 ... NEXT k
            const m = line.match(/^FOR\s+(\w+)\s*=\s*(.+?)\s+TO\s+(.+)$/i);
            const varName = m[1];
            const end = evaluateExpr(m[3]);
            if (!(varName in variables)) variables[varName] = evaluateExpr(m[2]);

            if (variables[varName] <= end) {
                currentLine++; // Enter loop
            } else {
                // Skip to matching NEXT
                let depth = 0;
                for (let i = currentLine + 1; i < lines.length; i++) {
                    const l = lines[i].trim().toUpperCase();
                    if (l.startsWith('FOR ')) depth++;
                    if (l.startsWith('NEXT')) {
                        if (depth === 0) { currentLine = i + 1; break; }
                        depth--;
                    }
                }
            }
        }
        else if (/^NEXT\b/i.test(line)) {
            // Jump back to the matching FOR and increment the counter
            const m = line.match(/^NEXT\s+(\w+)?/i);
            let depth = 0;
            for (let i = currentLine - 1; i >= 0; i--) {
                const l = lines[i].trim().toUpperCase();
                if (l.startsWith('NEXT')) depth++;
                if (l.startsWith('FOR ')) {
                    if (depth === 0) {
                        const fm = lines[i].trim().match(/^FOR\s+(\w+)\s*=\s*(.+?)\s+TO\s+(.+)$/i);
                        const varName = (m[1] || fm[1]).trim();
                        const end = evaluateExpr(fm[3]);
                        variables[varName] = (Number(variables[varName]) || 0) + 1;
                        if (variables[varName] <= end) {
                            currentLine = i + 1; // loop body again
                        } else {
                            currentLine++; // done
                        }
                        break;
                    }
                    depth--;
                }
            }
        }
        else if (/^REPEAT/i.test(line)) {
            currentLine++; // marker — body starts on the next line
        }
        else if (/^UNTIL\s+/i.test(line)) {
            // UNTIL cond — if false, jump back to the matching REPEAT
            const cond = line.replace(/^UNTIL\s+/i, '').trim();
            const jsCond = cond.replace(/([^=<>!])=(?!=)/g, '$1==');
            if (!evaluateExpr(jsCond)) {
                for (let i = currentLine - 1; i >= 0; i--) {
                    const l = lines[i].trim().toUpperCase();
                    if (l === 'REPEAT') { currentLine = i + 1; break; }
                }
            } else {
                currentLine++;
            }
        }
        else if (line.includes('=')) {
            // Assignment: variable = expr
            // Avoid ==
            if (!line.includes('==') && !line.startsWith('IF') && !line.startsWith('WHILE') && !line.startsWith('UNTIL')) {
                const parts = line.split('=');
                const target = parts[0].trim();
                const expr = parts.slice(1).join('=').trim();
                const val = evaluateExpr(expr);
                variables[target] = val;
                steps[steps.length - 1].variables = { ...variables }; // Update curr vars
                currentLine++;
            } else {
                currentLine++;
            }
        } else {
            currentLine++;
        }

    }

    return steps;
};

export const executePseudoCode = async (blocks, inputContext = {}) => {
    let code = blocks.map(b => b.text).join('\n');
    console.log("Executor Input Code:", code); // DEBUG

    // Routing Logic
    // If Pseudo Code (no PROGRAM, has INPUT/OUTPUT/IF-THEN without ;) -> Use Regex Interpreter
    // If Pascal (has PROGRAM) -> Use AST Interpreter

    const isPascal = /^\s*program\b/i.test(code);

    if (isPascal) {
        const interpreter = new PascalASTInterpreter();
        try {
            return await interpreter.runTrace(code, inputContext);
        } catch (e) {
            console.error("Execution Error:", e);
            return [{
                lineIndex: 0,
                text: "ERROR",
                logs: [`[ERROR]: ${e.message}`],
                variables: {}
            }];
        }
    } else {
        // Use Pseudo Interpreter
        console.log("Using Regex Pseudo Executor...");
        try {
            return await runPseudoTrace(code, inputContext);
        } catch (e) {
            console.error("Pseudo Execution Error:", e);
            return [{
                lineIndex: 0,
                text: "ERROR",
                logs: [`[ERROR]: ${e.message}`],
                variables: {}
            }];
        }
    }
};

// Legacy Executor removed/commented out as per plan.
// If fallback needed, we could keep it, but we want to force unification.

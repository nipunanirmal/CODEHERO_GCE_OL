import { PascalASTInterpreter } from './PascalASTInterpreter';

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
    const evaluateExpr = (expr) => {
        try {
            // Replace variables with values
            let evalStr = expr;
            // Sort keys by length desc to avoid partial replacements (e.g. replacing 'a' inside 'apple')
            const keys = Object.keys(variables).sort((a, b) => b.length - a.length);
            for (const key of keys) {
                const val = variables[key];
                // Use regex with word boundary
                const regex = new RegExp(`\\b${key}\\b`, 'g');
                // Quote strings if needed? value is raw.
                if (typeof val === 'string') {
                    evalStr = evalStr.replace(regex, `'${val}'`);
                } else {
                    evalStr = evalStr.replace(regex, val);
                }
            }

            // Helper for Pseudo operators
            evalStr = evalStr.replace(/MOD/gi, '%');
            evalStr = evalStr.replace(/AND/gi, '&&');
            evalStr = evalStr.replace(/OR/gi, '||');
            evalStr = evalStr.replace(/NOT/gi, '!');
            evalStr = evalStr.replace(/==/g, '==='); // Strict
            evalStr = evalStr.replace(/<>/g, '!=='); // Not Equal
            // Single = is tricky. In condition? Assume caller handles it or user used ==.
            // If user used =, replace with === for comparison logic? 
            // Better not to mess too much unless we know it's a condition.

            // Evaluate safely? Function constructor is unsafe but valid for this context.
            // Using a safer parser would be better but "Regex" implies simple Eval.
            // Handling strings: inputs might be double quoted in code.

            // Convert "Kamal" to 'Kamal' for JS?
            // "OUTPUT 'Hello'" -> string literal

            return Function('"use strict";return (' + evalStr + ')')();
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

        if (!line || line.toUpperCase() === 'BEGIN' || line.toUpperCase() === 'END' || line.toUpperCase() === 'ENDIF' || line.toUpperCase() === 'ENDWHILE') {
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
                }).join(' ');
            }

            logs.push(String(output));
            steps[steps.length - 1].logs = [...logs]; // Update current step logs
            currentLine++;
        }
        else if (/^IF\s+(.+?)\s+THEN/i.test(line)) {
            const match = line.match(/^IF\s+(.+?)\s+THEN/i);
            const condition = match[1];
            // Handle single = as == in condition
            const jsCond = condition.replace(/([^=])=([^=])/g, '$1==$2');

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
            const jsCond = condition.replace(/([^=])=([^=])/g, '$1==$2');

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

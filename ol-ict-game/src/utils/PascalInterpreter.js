/**
 * Simple Pascal Interpreter for O/L ICT Level
 * Supports: 
 * - Output: write, writeln
 * - Input: readln (async via callback)
 * - Types: integer, string, boolean, real
 * - Logic: if/then/else, boolean operators (and, or, not)
 * - Loops: for, while, repeat
 * - Math: +, -, *, /, div, mod
 */

export class PascalInterpreter {
    constructor() {
        this.outputBuffer = [];
        this.variables = {};
        this.inputCallback = null;
        this.isRunning = false;
        this.isWaitingForInput = false;
    }

    reset() {
        this.outputBuffer = [];
        this.variables = {};
        this.isRunning = false;
        this.isWaitingForInput = false;
    }

    async run(code, onOutput, onInputRequest) {
        this.reset();
        this.isRunning = true;
        this.onOutput = onOutput;
        this.onInputRequest = onInputRequest;

        try {
            const tokens = this.tokenize(code);
            
            // Pass 1: Syntax Check (Dry Run)
            // skips logic/IO, checks structure and tokens
            await this.parseAndExecute(tokens, true); 

            // Pass 2: Execution
            // Reset state just in case (though dry run shouldn't mutate)
            this.reset(); 
            this.isRunning = true;
            this.onOutput = onOutput;
            this.onInputRequest = onInputRequest; // Re-bind callbacks
            
            await this.parseAndExecute(tokens, false);
            
        } catch (err) {
            this.handleError(err);
        } finally {
            this.isRunning = false;
        }
    }

    handleError(err) {
        this.onOutput(`\n[ERROR]: ${err.message}`);
    }

    // --- TOKENIZER ---
    tokenize(code) {
        // Simple regex based tokenizer
        // Matches: strings, symbols, numbers, words
        const tokenRegex = /'[^']*'|<>|<=|>=|:=|[(){}[\],;.]|\+|-|\*|\/|[a-zA-Z_]\w*|\d+(\.\d+)?/g;
        let match;
        const tokens = [];
        
        // Remove comments (* *) and { }
        code = code.replace(/\(\*[\s\S]*?\*\)/g, '').replace(/\{[\s\S]*?\}/g, '');

        while ((match = tokenRegex.exec(code)) !== null) {
            let val = match[0];
            let type = 'UNKNOWN';

            if (val.startsWith("'")) {
                type = 'STRING';
                val = val.slice(1, -1); // Remove quotes
            } else if (!isNaN(val)) {
                type = val.includes('.') ? 'REAL' : 'INTEGER';
                val = parseFloat(val);
            } else if (['program', 'var', 'begin', 'end', 'if', 'then', 'else', 'for', 'to', 'do', 'downto', 'while', 'repeat', 'until', 'write', 'writeln', 'readln', 'integer', 'string', 'real', 'boolean', 'div', 'mod', 'and', 'or', 'not'].includes(val.toLowerCase())) {
                type = 'KEYWORD';
                val = val.toLowerCase();
            } else if (/^[a-zA-Z_]\w*$/.test(val)) {
                type = 'IDENTIFIER'; // Variable name
            } else {
                type = 'SYMBOL';
            }

            tokens.push({ type, value: val, index: match.index });
        }
        return tokens;
    }

    // --- PARSER & EXECUTION UTILS ---
    async parseAndExecute(tokens, isDryRun = false) {
        let pos = 0;

        const peek = () => tokens[pos];
        const consume = (expectedVal = null) => {
            if (pos >= tokens.length) return null;
            const token = tokens[pos];
            if (expectedVal && token.value !== expectedVal && token.type !== expectedVal) {
                // If expected is generic type like 'IDENTIFIER'
                if (expectedVal === 'IDENTIFIER' && token.type === 'IDENTIFIER') {
                    pos++;
                    return token;
                }
                throw new Error(`Expected '${expectedVal}' but found '${token.value}'`);
            }
            pos++;
            return token;
        };

        const evaluateExpression = (exprTokens) => {
            // Shunting-yard or simple eval for this scope. 
            // For simplicity/speed in this demo, we'll map Pascal operators to JS and use Function constructor carefully,
            // OR build a proper recursive descent evaluator. Let's do recursive descent for safety.
            return this.evalLogic(exprTokens);
        };

        // --- EXPRESSION PARSER (Recursive Descent) ---
        // Hierarchy: Logic (OR) -> Logic (AND) -> Logic (NOT) -> Relational (=, <, >) -> Additive (+, -) -> Multiplicative (*, /, div, mod) -> Factor
        
        // Helper to extract expression tokens until a terminator (;, then, do, etc.)
        const getExpressionTokens = (terminators) => {
            const expr = [];
            let parenBalance = 0;
            while (pos < tokens.length) {
                const t = tokens[pos];
                if (parenBalance === 0 && terminators.includes(t.value)) break;
                
                if (t.value === '(') parenBalance++;
                if (t.value === ')') parenBalance--;
                
                expr.push(consume());
            }
            return expr;
        };

        // --- BLOCK EXECUTOR ---
        const executeBlock = async (shouldExec = true, isMain = false) => {
            // block is usually start with 'begin' output 'end'
            // We assume we are inside a statement list
            while (pos < tokens.length) {
                const t = peek();
                if (!t) break;

                if (t.value === 'end') {
                    break;
                } else if (t.value === 'begin') {
                    consume('begin');
                    await executeBlock(shouldExec, false); // recurse for body
                    consume('end');
                    
                    if (isMain) {
                        // Main program MUST end with '.'
                        const next = peek();
                        if (!next || next.value !== '.') {
                            throw new Error("Main program must end with '.'");
                        }
                        consume('.');
                    } else {
                        consumeSeparator();
                    }
                } 
                else if (t.value === ';') {
                    consume();
                }
                else {
                    await executeStatement(shouldExec);
                }
            }
        };

        const consumeSeparator = () => {
             const next = peek();
             if (!next) return; // Allow EOF for internal checks, but Main block catches strictness
             if (next.value === ';') {
                 consume(';');
             } else if (next.value === 'else' || next.value === 'end' || next.value === 'until' || next.value === '.') {
                 // Semicolon is optional/forbidden here in strict Pascal, so we treat it as valid separator
                 return;
             } else {
                 // For any other token, we expect a semicolon separator
                 throw new Error(`Expected ';' but found '${next.value}'`);
             }
        };

        const executeStatement = async (shouldExec = true) => {
            const t = peek();
            if (!t) return;

            // I/O
            if (t.value === 'writeln' || t.value === 'write') {
                const isLine = t.value === 'writeln';
                consume(); // Eat write/writeln
                consume('(');
                let outputStr = '';
                
                // Handle arguments: strings, variables, expressions
                while(true) {
                     // Extract expression until comma or paren
                     let expr = [];
                     let paren = 0;
                     while(pos < tokens.length) {
                         const n = peek();
                         if (paren === 0 && (n.value === ',' || n.value === ')')) break;
                         if (n.value === '(') paren++;
                         if (n.value === ')') paren--;
                         expr.push(consume());
                     }
                     
                     if (shouldExec) {
                        outputStr += this.evalLogic(expr);
                     }

                     if (peek().value === ',') {
                         consume(',');
                     } else {
                         break;
                     }
                }
                consume(')');
                consumeSeparator();
                
                if (shouldExec) {
                    this.onOutput(outputStr + (isLine ? '\n' : ''));
                }
            }
            else if (t.value === 'readln') {
                consume('readln');
                // Check if variable is provided
                if (peek().value === '(') {
                    consume('(');
                    const varToken = consume('IDENTIFIER');
                    const varName = varToken.value;
                    consume(')');
                    consumeSeparator();

                    if (shouldExec) {
                        // ASYNC INPUT
                        const inputVal = await this.onInputRequest();
                        
                        // Basic type inference or storage
                        if (inputVal !== null && inputVal !== undefined) {
                            if (!isNaN(inputVal) && inputVal.trim() !== '') {
                                this.variables[varName] = Number(inputVal);
                            } else if (inputVal.toLowerCase() === 'true' || inputVal.toLowerCase() === 'false') {
                                this.variables[varName] = inputVal.toLowerCase() === 'true';
                            } else {
                                this.variables[varName] = inputVal;
                            }
                        }
                        // Echo input for realism
                        this.onOutput(inputVal + '\n');
                    }
                } else {
                    consumeSeparator();
                     // Just wait for enter
                    if (shouldExec) {
                        await this.onInputRequest();
                    }
                }
            }
            // IF
            else if (t.value === 'if') {
                consume('if');
                let conditionExpr = [];
                while(peek().value !== 'then') {
                    conditionExpr.push(consume());
                }
                
                let condition = false;
                if (shouldExec) {
                    condition = this.evalLogic(conditionExpr);
                }
                
                consume('then');
                
                // Then block
                // Determine enablement: Parent must be exec, AND condition must be true
                await executeStatement(shouldExec && condition); 
                
                // check else
                if (peek() && peek().value === 'else') {
                    consume('else');
                    // Else block
                    // Determine enablement: Parent must be exec, AND condition must be FALSE
                    await executeStatement(shouldExec && !condition);
                }
            }
            // FOR LOOP
            else if (t.value === 'for') {
                consume('for');
                const varName = consume('IDENTIFIER').value;
                consume(':=');
                // Start Val expr
                let startExpr = [];
                while(peek().value !== 'to' && peek().value !== 'downto') {
                    startExpr.push(consume());
                }
                
                const type = consume().value; // to or downto
                
                let endExpr = [];
                while(peek().value !== 'do') {
                     endExpr.push(consume());
                }
                consume('do');
                
                // Loop body position
                const bodyStartPos = pos;
                
                if (shouldExec) {
                    const startVal = this.evalLogic(startExpr);
                    const endVal = this.evalLogic(endExpr);
                    this.variables[varName] = startVal;
                    
                    while(true) {
                         // Check condition
                         if (type === 'to' && this.variables[varName] > endVal) break;
                         if (type === 'downto' && this.variables[varName] < endVal) break;
                         
                         // Run body
                         pos = bodyStartPos;
                         await executeStatement(true); 

                         // Increment/Decrement
                         if (type === 'to') this.variables[varName]++;
                         else this.variables[varName]--;
                    }
                     // After loop finishes, we need to leave 'pos' AFTER the body.
                     // The last iteration of executeStatement(true) moved pos past body.
                     // BUT, if loop didn't run at all? or after loop ends, we have re-run body one last time?
                     // NO. 
                     // We need to advance pos past body properly.
                     // Since we reset pos, we end up at end of body.
                     // But wait, if we break, we are at START of body.
                     // So we must executeStatement(false) once to skip body tokens.
                     pos = bodyStartPos;
                     await executeStatement(false);
                } else {
                    // Just skip body
                     await executeStatement(false);
                }
            }
            // ASSIGNMENT (Var := Val)
            else if (t.type === 'IDENTIFIER' && tokens[pos+1] && tokens[pos+1].value === ':=') {
                const varName = consume('IDENTIFIER').value;
                consume(':=');
                let expr = [];
                while(peek().value !== ';' && peek().value !== 'end' && peek().value !== 'else' && peek().value !== 'until') {
                    expr.push(consume());
                }
                
                if (shouldExec) {
                    this.variables[varName] = this.evalLogic(expr);
                }
                consumeSeparator();
            }
             else if (t.value === 'program') {
                // consume until ;
                while(peek().value !== ';') consume();
                consume(';');
            } else if (t.value === 'var') {
                consume('var');
                // var a, b: integer;
                while (peek().value !== 'begin') {
                     // Eat decls
                     // For this simple interpreter, we ignore types mostly, just let vars execute.
                     consume(); 
                }
            } else if (t.value === 'begin') {
                 // Should be handled by ExecuteBlock but if encountered nested
                 consume('begin');
                 await executeBlock(shouldExec);
                 consume('end');
                 consumeSeparator();
            }
            else {
                // Skip unknown or extra
                consume();
            }
        };

        // Start 
        await executeBlock(!isDryRun, true);
    }

    // --- EVALUATOR ---
    evalLogic(tokens) {
        if (tokens.length === 0) return null;
        
        // 1. Shunting Yard Algorithm to parse expression with precedence
        // Precedence: ( ) -> NOT -> * / DIV MOD AND -> + - OR -> = <> < > <= >=
        const precedence = {
            'not': 4,
            '*': 3, '/': 3, 'div': 3, 'mod': 3, 'and': 3,
            '+': 2, '-': 2, 'or': 2,
            '=': 1, '<>': 1, '<': 1, '>': 1, '<=': 1, '>=': 1,
            '(': 0 
        };

        const outputQueue = [];
        const opStack = [];

        tokens.forEach(t => {
            if (t.type === 'INTEGER' || t.type === 'REAL' || t.type === 'STRING' || t.type === 'BOOLEAN') {
                outputQueue.push(t.value);
            } else if (t.type === 'IDENTIFIER') {
                 // Resolve variable
                 const val = this.variables[t.value];
                 if (val === undefined) throw new Error(`Unknown variable: ${t.value}`);
                 outputQueue.push(val);
            } else if (t.type === 'SYMBOL' || t.type === 'KEYWORD') { // Op
                 if (t.value === '(') {
                     opStack.push(t.value);
                 } else if (t.value === ')') {
                     while (opStack.length && opStack[opStack.length-1] !== '(') {
                         outputQueue.push(opStack.pop());
                     }
                     opStack.pop(); // Pop (
                 } else {
                     // Operator
                     const myPrec = precedence[t.value] || 0;
                     while (opStack.length && (precedence[opStack[opStack.length-1]] || 0) >= myPrec) {
                          outputQueue.push(opStack.pop());
                     }
                     opStack.push(t.value);
                 }
            }
        });
        while (opStack.length) outputQueue.push(opStack.pop());

        // 2. RPN Evaluator
        const stack = [];
        outputQueue.forEach(token => {
            if (typeof token === 'number' || typeof token === 'string' || typeof token === 'boolean') {
                stack.push(token);
            } else {
                // Op
                // Handle Unary NOT
                if (token === 'not') {
                    const a = stack.pop();
                    stack.push(!a);
                } else {
                    const b = stack.pop();
                    const a = stack.pop();
                    switch(token) {
                        case '+': stack.push(a + b); break;
                        case '-': stack.push(a - b); break;
                        case '*': stack.push(a * b); break;
                        case '/': stack.push(a / b); break;
                        case 'div': stack.push(Math.floor(a / b)); break;
                        case 'mod': stack.push(a % b); break;
                        case 'and': stack.push(a && b); break;
                        case 'or': stack.push(a || b); break;
                        case '=': stack.push(a === b); break;
                        case '<>': stack.push(a !== b); break;
                        case '<': stack.push(a < b); break;
                        case '>': stack.push(a > b); break;
                        case '<=': stack.push(a <= b); break;
                        case '>=': stack.push(a >= b); break;
                    }
                }
            }
        });
        return stack[0];
    }
}

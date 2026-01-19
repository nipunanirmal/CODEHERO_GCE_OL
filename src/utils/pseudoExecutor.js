
export const executePseudoCode = (blocks, inputContext = {}) => {
    const steps = [];
    const logs = [];
    const variables = {}; // Current state of variables
    let pc = 0; // Program Counter
    let finished = false;
    let iterations = 0;
    const MAX_ITERATIONS = 1000; // Safety break
    let isNewLine = true; // Track if we are on a new line or appending

    // Pre-scan labels/jumps if needed (not needed for simple line-by-line unless we have GOTOs, but we have structured loops)
    // We'll interpret linearly but handle jumps for loops/ifs.

    // Copy input context to variables
    Object.assign(variables, inputContext);

    while (pc < blocks.length && !finished && iterations < MAX_ITERATIONS) {
        iterations++;
        const block = blocks[pc];
        const text = block.text.trim();
        const step = {
            lineIndex: pc,
            text: text,
            logs: [...logs],
            variables: { ...variables }
        };

        let jumped = false;

        try {
            // --- PARSING BLOCKS ---

            // 1. BEGIN / END / PROGRAM / VAR (Pas options)
            if (/^BEGIN/i.test(text) || /^START/i.test(text) || /^PROGRAM/i.test(text) || /^VAR/i.test(text)) {
                // no-op for structure lines
            } else if (/^END(\.|;)?$/i.test(text) || /^STOP/i.test(text)) {
                if (text.trim().toUpperCase() === 'END.') {
                    finished = true;
                } else {
                    // Check for Loop Closure (match matching BEGIN)
                    let depth = 1;
                    let lookback = pc - 1;
                    let foundBegin = -1;

                    while (lookback >= 0) {
                        const t = blocks[lookback].text.trim();
                        if (/^END(;|.)?$/i.test(t) && t.toUpperCase() !== 'END.') depth++;
                        else if (/^BEGIN$/i.test(t)) {
                            depth--;
                            if (depth === 0) {
                                foundBegin = lookback;
                                break;
                            }
                        }
                        lookback--;
                    }

                    if (foundBegin !== -1 && foundBegin > 0) {
                        const headerLine = blocks[foundBegin - 1].text.trim();

                        // FOR Loop Closure
                        if (/^FOR\s+/i.test(headerLine)) {
                            const match = headerLine.match(/^FOR\s+(.+?)\s*(:=|=)/i);
                            const varName = match[1].trim();
                            const limit = variables[`_for_limit_${varName}`];
                            const direction = variables[`_for_dir_${varName}`] || 'TO';

                            if (direction === 'TO') variables[varName] = (variables[varName] || 0) + 1;
                            else variables[varName] = (variables[varName] || 0) - 1;

                            let shouldLoop = (direction === 'TO') ? (variables[varName] <= limit) : (variables[varName] >= limit);

                            if (shouldLoop) {
                                pc = foundBegin - 1;
                                jumped = true;
                            } else {
                                delete variables[`_for_init_${foundBegin - 1}`];
                            }
                        }
                        // WHILE Loop Closure
                        else if (/^WHILE\s+/i.test(headerLine)) {
                            pc = foundBegin - 1;
                            jumped = true;
                        }
                    }
                }
            }

            // 2. INPUT (READ/READLN)
            else if (/^(INPUT|READ|READLN)(\s*\(.*\)|.*)/i.test(text)) {
                let vars = [];
                if (/^INPUT\s+/i.test(text)) {
                    vars = text.match(/^INPUT\s+(.+)/i)[1].split(',').map(s => s.trim());
                } else {
                    // Handle READLN(x, y) or READLN
                    const match = text.match(/^(READ|READLN)\s*\((.+)\)/i);
                    if (match) {
                        vars = match[2].split(',').map(s => s.trim());
                    }
                }

                vars.forEach(v => {
                    if (!variables._streams) variables._streams = {};
                    if (Array.isArray(variables[v]) && !variables._streams[v]) {
                        variables._streams[v] = [...variables[v]];
                        variables[v] = undefined;
                    }
                    if (variables._streams && variables._streams[v] && variables._streams[v].length > 0) {
                        variables[v] = variables._streams[v].shift();
                    } else {
                        if (variables[v] === undefined) variables[v] = "?";
                    }
                });
            }

            // 3. OUTPUT (PRINT/OUTPUT/WRITE/WRITELN)
            else if (/^(WRITELN|WRITE|OUTPUT|PRINT)\s*(.+)?/i.test(text)) {
                // Parsing arguments: WRITELN('Hello ', name)
                const match = text.match(/^(WRITELN|WRITE|OUTPUT|PRINT)\s*(.*)/i);
                const cmd = match[1].toUpperCase();
                let rawArgs = match[2] || '';

                // Remove trailing semicolon if present (common in Pascal)
                if (rawArgs.trim().endsWith(';')) {
                    rawArgs = rawArgs.trim().slice(0, -1);
                }

                // Remove outer parens if Pascal style
                if (rawArgs.trim().startsWith('(') && rawArgs.trim().endsWith(')') && /^(WRITELN|WRITE)/i.test(cmd)) {
                    rawArgs = rawArgs.trim().slice(1, -1);
                }

                let outputStr = "";
                if (rawArgs) {
                    // Split by comma BUT ignore commas in quotes. 
                    const args = [];
                    let current = '';
                    let inQuote = false;
                    for (let i = 0; i < rawArgs.length; i++) {
                        const char = rawArgs[i];
                        // Toggle quote state
                        if (char === "'" || char === '"') inQuote = !inQuote;

                        // If comma and NOT in quote, push arg
                        if (char === ',' && !inQuote) {
                            args.push(current.trim());
                            current = '';
                            continue;
                        }
                        current += char;
                    }
                    if (current) args.push(current.trim());

                    const vals = args.map(p => {
                        // Check if string literal
                        if ((p.startsWith("'") && p.endsWith("'")) || (p.startsWith('"') && p.endsWith('"'))) {
                            return p.slice(1, -1);
                        }
                        // Else evaluate expression
                        return evaluateExpression(p, variables);
                    });

                    outputStr = vals.join('');
                } else {
                    // Empty WRITELN() -> outputStr is ""
                }

                // Handling WRITE vs WRITELN
                // If isNewLine is currently True, we start a new line.
                // If isNewLine is False, we append to the last line.

                if (isNewLine) {
                    logs.push(outputStr);
                } else {
                    if (logs.length > 0) {
                        logs[logs.length - 1] += outputStr;
                    } else {
                        logs.push(outputStr);
                    }
                }

                // If command is WRITE, next is NOT new line.
                // If command is WRITELN, next IS new line.
                if (cmd === 'WRITE') {
                    isNewLine = false;
                } else {
                    isNewLine = true;
                }
            }

            // 4. CONST declarations (CONST pi = 3.14;)
            else if (/^CONST\s+(.+?)\s*=\s*(.+)$/i.test(text)) {
                const match = text.match(/^CONST\s+(.+?)\s*=\s*(.+)$/i);
                const varName = match[1].trim();
                let expr = match[2].trim();
                // Strip trailing semicolon
                if (expr.endsWith(';')) expr = expr.slice(0, -1);
                variables[varName] = evaluateExpression(expr, variables);
            }

            // 5. ASSIGNMENT (x = y   OR   x := y)
            else if (/^(.+?)\s*(:=|=)\s*(.+)$/.test(text) && !/^FOR/i.test(text) && !/^IF/i.test(text) && !/^CONST/i.test(text) && !/^UNTIL/i.test(text) && !/^WHILE/i.test(text)) {
                // Handle multiple assignments on one line: a:=1; b:=2;
                const statements = [];
                let current = '';
                let inQuote = false;
                for (let i = 0; i < text.length; i++) {
                    const char = text[i];
                    if (char === "'" || char === '"') inQuote = !inQuote;
                    if (char === ';' && !inQuote) {
                        if (current.trim()) statements.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                if (current.trim()) statements.push(current.trim());

                statements.forEach(stmt => {
                    const match = stmt.match(/^(.+?)\s*(:=|=)\s*(.+)$/);
                    if (match) {
                        const varName = match[1].trim();
                        const expr = match[3].trim();
                        variables[varName] = evaluateExpression(expr, variables);
                    }
                });
            }

            // 5. IF ... THEN
            else if (/^IF\s+(.+?)\s+THEN/i.test(text)) {
                const condStr = text.match(/^IF\s+(.+?)\s+THEN/i)[1];
                const condition = evaluateCondition(condStr, variables);

                if (!condition) {
                    // Skip to ELSE or Ends
                    let depth = 0;
                    let lookahead = pc + 1;

                    // Check if the IF block starts with BEGIN (Pascal)
                    let isPascalBlock = false;
                    if (lookahead < blocks.length && /^BEGIN/i.test(blocks[lookahead].text.trim())) {
                        isPascalBlock = true;
                        depth = 1;
                        lookahead++; // Enter block
                    }

                    while (lookahead < blocks.length) {
                        const t = blocks[lookahead].text.trim();

                        // If Pascal Block mode
                        if (isPascalBlock) {
                            if (/^BEGIN/i.test(t)) depth++;
                            else if (/^END(;|.)?$/i.test(t) && t.toUpperCase() !== 'END.') {
                                depth--;
                                if (depth === 0) {
                                    lookahead++; // Move past END
                                    break;
                                }
                            }
                        }
                        // Pseudo Mode (ENDIF/ELSE)
                        else {
                            if (/^IF\s/i.test(t)) depth++;
                            else if (/^ENDIF/i.test(t)) {
                                if (depth === 0) break; // Found end
                                depth--;
                            }
                            else if (/^ELSE/i.test(t) && depth === 0) {
                                // Found ELSE at this level
                                break;
                            }
                        }
                        lookahead++;
                    }

                    // If we stopped at ELSE, jump there (execute ELSE next).
                    if (lookahead < blocks.length && /^ELSE/i.test(blocks[lookahead].text.trim())) {
                        variables._exec_else = true;
                    }
                    pc = lookahead;
                    jumped = true;
                }
            }

            // ... (keep structure, just ensure regexes cover Pascal if needed)

            // 10. FOR (Pseudo: FOR k=1 TO 5, Pascal: FOR k := 1 TO 5 DO)
            else if (/^FOR\s+(.+?)\s*(:=|=)\s*(.+?)\s+(TO|DOWNTO)\s+(.+?)(\s+DO)?$/i.test(text)) {
                const match = text.match(/^FOR\s+(.+?)\s*(:=|=)\s*(.+?)\s+(TO|DOWNTO)\s+(.+?)(\s+DO)?$/i);
                const varName = match[1].trim();
                const startExpr = match[3];
                const direction = match[4].toUpperCase(); // TO or DOWNTO
                const endExpr = match[5].split(/\s+DO/i)[0]; // Clean DO if captured

                const startVal = evaluateExpression(startExpr, variables);
                const endVal = evaluateExpression(endExpr, variables);

                if (variables[`_for_init_${pc}`] === undefined) {
                    variables[varName] = startVal;
                    variables[`_for_limit_${varName}`] = endVal;
                    variables[`_for_dir_${varName}`] = direction;
                    variables[`_for_init_${pc}`] = true;
                }
            }

            // 11. NEXT k  OR Pascal logic?
            // Pascal uses blocks BEGIN...END.
            // Our logic handles structured loops via "jumps" at keyword lines.
            // Pascal: 
            // FOR ... DO
            //    STMT; 
            // 
            // If we have BEGIN/END block, we need to detect "END" as end of loop?
            // Or just "NEXT"? Pascal doesn't use NEXT.
            // It relies on blocks.
            // 
            // CRITICAL MISMATCH:
            // Pseudo-code uses explicit `NEXT k` or `ENDWHILE`. 
            // Pascal uses `begin ... end;` blocks which are generic.
            // 
            // To support Pascal loops in this simple line-by-line executor without specific AST:
            // We assume the user provides a "Block" structure or we treat "END;" as generic end?
            // But which "END" matches which "FOR"?
            // 
            // IF we rely on indentation or matching `END`s?
            // "END" matches nearest open structure (IF, WHILE, FOR).
            // 
            // Let's genericize the "End of Block" handling?
            // 
            // Currently:
            // - IF ends with ENDIF (or ELSE implicit)
            // - WHILE ends with ENDWHILE
            // - FOR ends with NEXT
            // 
            // Pascal:
            // - IF .. THEN BEGIN .. END
            // - WHILE .. DO BEGIN .. END
            // - FOR .. DO BEGIN .. END
            // 
            // Modification:
            // Detect "generic" END (or `end;`) and try to match the active control structure.
            // We need a stack of active structures.
            // 
            // Stack: [{ type: 'FOR', line: 10, var: 'i' }, { type: 'WHILE', line: 5 }]
            // 
            // When we hit `END` or `END;`:
            // Pop stack. 
            // If FOR: increment and jump back if needed.
            // If WHILE: jump back.
            // 
            // BUT existing logic relies on regex scanning for `ENDWHILE`.
            // 
            // COMPROMISE for this task:
            // Since we define the "Correct Order" blocks, we can cheat slightly?
            // Or can we add `NEXT` logic to `END`?
            // 
            // Let's add logic: If `END` or `END;` is encountered:
            // Check if we are in a loop (using variable tracking? No).
            // 
            // Better: Scan back to find the opening statement for *this* block.
            // Counting `BEGIN`s and `END`s?
            // 
            // `END;` matches the nearest unmatched `BEGIN`.
            // And that `BEGIN` belongs to a statement before it? 
            // `FOR ... DO BEGIN`.
            // 
            // So: 
            // 1. Find matching BEGIN.
            // 2. Check line before BEGIN? 
            //    If `FOR ... DO` -> It is a FOR loop end.
            //    If `WHILE ... DO` -> It is a WHILE loop end.

            // (Previous block end)

            // 6. ELSE
            else if (/^ELSE(\s+IF.+)?/i.test(text)) {
                // Check if we are forced to execute (jumped from False IF)
                if (variables._exec_else) {
                    delete variables._exec_else;

                    // Check ELSE IF
                    const ifMatch = text.match(/^ELSE\s+(IF\s+.+)/i);
                    if (ifMatch) {
                        const ifPart = ifMatch[1];
                        if (/^IF\s+(.+?)\s+THEN/i.test(ifPart)) {
                            const condStr = ifPart.match(/^IF\s+(.+?)\s+THEN/i)[1];
                            const condition = evaluateCondition(condStr, variables);
                            if (condition) {
                                // True -> Enter -> Don't skip
                                // But we need to pretend we processed the IF... implies NO further skipping?
                                // Yes, just return ensures we fall through to next line (body).
                                return;
                            }
                        }
                        // If False or parse fail -> Fall through to Skip logic below
                    } else {
                        // Simple ELSE -> Enter -> Don't skip
                        return;
                    }
                }

                // If we hit ELSE, it means we finished the IF (True) block.
                // We must skip the ELSE block.

                // Check if ELSE has a formatted block "BEGIN...END"
                let depth = 0;
                let lookahead = pc + 1;
                let isPascalBlock = false;

                if (lookahead < blocks.length && /^BEGIN/i.test(blocks[lookahead].text.trim())) {
                    isPascalBlock = true;
                    depth = 1;
                    lookahead++;
                }

                while (lookahead < blocks.length) {
                    const t = blocks[lookahead].text.trim();
                    if (isPascalBlock) {
                        if (/^BEGIN/i.test(t)) depth++;
                        else if (/^END(;|.)?$/i.test(t) && t.toUpperCase() !== 'END.') {
                            depth--;
                            if (depth === 0) {
                                lookahead++;
                                break;
                            }
                        }
                    } else {
                        // Pseudo: ends at ENDIF?
                        if (/^IF\s/i.test(t)) depth++;
                        else if (/^ENDIF/i.test(t)) {
                            if (depth === 0) break;
                            depth--;
                        }
                    }
                    lookahead++;
                }
                pc = lookahead;
                jumped = true;
            }

            // 7. ENDIF
            else if (/^ENDIF/i.test(text)) {
                // No-op
            }

            // 8. WHILE ... DO
            else if (/^WHILE\s+(.+?)\s+DO/i.test(text)) {
                const condStr = text.match(/^WHILE\s+(.+?)\s+DO/i)[1];
                const condition = evaluateCondition(condStr, variables);

                if (!condition) {
                    // Skip to ENDWHILE or matching Pascal Block END
                    let depth = 0;
                    let lookahead = pc + 1;
                    let isPascalBlock = false;

                    // Check if the loop start with BEGIN (Pascal)
                    if (lookahead < blocks.length && /^BEGIN/i.test(blocks[lookahead].text.trim())) {
                        isPascalBlock = true;
                        depth = 1;
                        lookahead++; // Enter block
                    } else {
                        // Standard Pseudo-code: Assume depth 1 searching for ENDWHILE
                        depth = 1;
                    }

                    while (lookahead < blocks.length) {
                        const t = blocks[lookahead].text.trim();

                        if (isPascalBlock) {
                            if (/^BEGIN/i.test(t)) depth++;
                            else if (/^END(;|.)?$/i.test(t) && t.toUpperCase() !== 'END.') {
                                depth--;
                                if (depth === 0) {
                                    lookahead++; // Skip the END line itself
                                    break;
                                }
                            }
                        } else {
                            if (/^WHILE\s/i.test(t)) depth++;
                            else if (/^ENDWHILE/i.test(t)) {
                                depth--;
                                if (depth === 0) {
                                    lookahead++; // Skip the ENDWHILE line itself
                                    break;
                                }
                            }
                        }
                        lookahead++;
                    }

                    // Jump to the line AFTER the block
                    pc = lookahead;
                    jumped = true;
                } else {
                    // Continue (Enter loop)
                }
            }

            // 9. ENDWHILE
            else if (/^ENDWHILE/i.test(text)) {
                // Find matching WHILE backwards
                let depth = 1;
                let lookback = pc - 1;
                while (lookback >= 0) {
                    const t = blocks[lookback].text.trim();
                    if (/^ENDWHILE/i.test(t)) depth++;
                    else if (/^WHILE\s/i.test(t)) {
                        depth--;
                        if (depth === 0) {
                            pc = lookback; // Jump back to WHILE to re-evaluate
                            jumped = true;
                            break;
                        }
                    }
                    lookback--;
                }
                // Note: IF we jump back to WHILE, next iteration parses WHILE. 
                // If condition false, it jumps to ENDWHILE (here).
                // Then we execute ENDWHILE again? And jump back? Infinite loop?
                // FIX in WHILE logic: 
                // If False, skip to ENDWHILE... AND THEN +1?
                // Yes, if I set pc = lookahead (ENDWHILE), next iter is ENDWHILE.
                // ENDWHILE jumps back. Infinite loop of False checking.

                // CORRECTION in WHILE (False) logic:
                // Jump to line *after* ENDWHILE? Or just ensure we don't re-execute ENDWHILE logic?
                // Usually we jump to `lookahead` (the ENDWHILE line). The loop continues (pc unchanged logic at bottom).
            }

            // 10. FOR k = 1 TO 5
            else if (/^FOR\s+(.+?)\s*=\s*(.+?)\s+TO\s+(.+)/i.test(text)) {
                const match = text.match(/^FOR\s+(.+?)\s*=\s*(.+?)\s+TO\s+(.+)/i);
                const varName = match[1].trim();
                const startExpr = match[2];
                const endExpr = match[3];

                const startVal = evaluateExpression(startExpr, variables);
                const endVal = evaluateExpression(endExpr, variables);

                // Check if this is "first entry" or "re-entry"? 
                // A primitive interpreter re-executing this line resets the variable!
                // We need to know if we are looping.
                // Usually FOR loops init once.

                // TRICKY with naive line-by-line.
                // "FOR k = 1 TO 5" 
                // If we treat it as: k = 1. If k > 5 jump to NEXT+1.
                // At NEXT k: k++. Jump to FOR? 
                // If we jump to FOR, we reset k=1. Infinite loop 1.

                // SOLUTION:
                // Treat "FOR" as header.
                // We need state to know if we are "in loop".
                // OR: Jump back to line *after* FOR?
                // And "NEXT" handles the increment and check.

                // Let's implement that:
                // FOR line: k = start.
                // NEXT line: k++. If k <= end, jump to (FOR + 1).

                // But we need to know the limit at NEXT.
                // We can store a metadata "_limit_k" in variables?
                if (variables[`_for_init_${pc}`] === undefined) {
                    variables[varName] = startVal;
                    variables[`_for_limit_${varName}`] = endVal;
                    variables[`_for_init_${pc}`] = true; // Mark as initialized for this trace? 
                    // Problem: if we run this executor freshly, it's fine.
                } else {
                    // We came back to FOR line? No, we should jump to AFTER for line.
                }
            }

            // 11. NEXT k
            else if (/^NEXT\s+(.+)/i.test(text)) {
                const varName = text.match(/^NEXT\s+(.+)/i)[1].trim();
                const limit = variables[`_for_limit_${varName}`];

                variables[varName] = (variables[varName] || 0) + 1;

                if (variables[varName] <= limit) {
                    // Jump back to AFTER the FOR line
                    // Find the FOR line
                    let lookback = pc - 1;
                    while (lookback >= 0) {
                        const t = blocks[lookback].text.trim();
                        // Naive matching for var name
                        if (new RegExp(`^FOR\\s+${varName}\\s*=`, 'i').test(t)) {
                            pc = lookback; // Actually lookback + 1?
                            // No, if we jump to lookback (FOR), simple logic resets it.
                            // BUT we added a check `if (variables['_for_init_${pc}'])`.
                            // So if we jump to FOR, it sees it is initialized... wait.
                            // Validating logical consistency:
                            // Re-executing "FOR k=1..." with check:
                            // If we skip init, we fall through to next line.
                            // Correct.
                            pc = lookback;
                            jumped = true;
                            break;
                        }
                        lookback--;
                    }
                } else {
                    // Cleanup
                    delete variables[`_for_init_${pc}`]; // Actually, we don't know the ID of FOR line here easily.
                    // Just proceed.
                }
            }

            // 12. REPEAT ... UNTIL
            else if (/^REPEAT/i.test(text)) {
                // Mark start of loop. No-op.
            }

            else if (/^UNTIL\s+(.+)/i.test(text)) {
                const condStr = text.match(/^UNTIL\s+(.+)/i)[1];
                const condition = evaluateCondition(condStr, variables);

                if (!condition) {
                    // Loop back to REPEAT
                    let depth = 1;
                    let lookback = pc - 1;
                    while (lookback >= 0) {
                        const t = blocks[lookback].text.trim();
                        if (/^UNTIL/i.test(t)) depth++;
                        else if (/^REPEAT/i.test(t)) {
                            depth--;
                            if (depth === 0) {
                                pc = lookback;
                                jumped = true;
                                break;
                            }
                        }
                        lookback--;
                    }
                }
            }


        } catch (e) {
            logs.push(`Error: ${e.message}`);
            finished = true;
        }

        step.logs = [...logs];
        // clean internal vars
        const cleanVars = { ...variables };
        Object.keys(cleanVars).forEach(k => { if (k.startsWith('_')) delete cleanVars[k]; });
        step.variables = cleanVars;

        steps.push(step);

        if (!jumped) {
            pc++;
        }

        // Safety for infinite loops without jumps (e.g. valid logic but infinite)
        if (iterations > MAX_ITERATIONS) {
            logs.push("Error: Endless loop detected / Too many steps");
            finished = true;
        }
    }

    return steps;
};


// Helper Functions

function evaluateExpression(expr, context) {
    // Simple evaluation: replaces variable names with values and evals
    // SECURITY WARNING: internal tool use only. User input is sandboxed by these regexes mostly.

    let evalStr = expr;
    // Replace known variables (longest first to avoid substring replacement issues?)
    const sortedVars = Object.keys(context).sort((a, b) => b.length - a.length);

    for (const v of sortedVars) {
        // Regex to replace whole words only
        // e.g. "sum" shouldn't replace "summary"
        const regex = new RegExp(`\\b${v}\\b`, 'g');
        let val = context[v];
        if (typeof val === 'string') val = `"${val}"`; // quote strings
        evalStr = evalStr.replace(regex, val);
    }

    // Replace pseudo-code operators
    evalStr = evalStr.replace(/MOD/gi, '%');
    evalStr = evalStr.replace(/AND/gi, '&&');
    evalStr = evalStr.replace(/OR/gi, '||');
    evalStr = evalStr.replace(/NOT/gi, '!');
    evalStr = evalStr.replace(/==/g, '===');
    evalStr = evalStr.replace(/<>/g, '!==');

    // Handle Pascal single = for equality (excluding >=, <=, :=, !=)
    evalStr = evalStr.replace(/([^:<>!])=(?=[^=]|$)/g, '$1===');

    try {
        // Use Function constructor for safer eval than direct eval() (still has access to globals but strict mode helps)
        return new Function('return ' + evalStr)();
    } catch (e) {
        return expr; // Return raw string if eval fails (e.g. "Hot Tea")
    }
}

function evaluateCondition(expr, context) {
    return !!evaluateExpression(expr, context);
}

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Trash2, Terminal, Code2, Save, SaveAll, Loader2 } from 'lucide-react';
import { PascalInterpreter } from '../../utils/PascalInterpreter';

const INITIAL_CODE = `program MyFirstCode;
var
    name: string;
age: integer;
begin
writeln('Welcome to Pascal IDE!');
write('Enter your name: ');
readln(name);

write('Enter your age: ');
readln(age);

writeln('----------------');
writeln('Hello ', name);

if age >= 18 then
writeln('Status: Adult')
  else
writeln('Status: Minor');

writeln('----------------');
end.`;

export default function PascalIDE() {
    const [code, setCode] = useState(INITIAL_CODE);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isWaitingInput, setIsWaitingInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputResolverRef = useRef(null);
    const interpreterRef = useRef(new PascalInterpreter());

    // Simple Syntax Highlighting (rendering overlay)
    const renderHighlightedCode = (rawCode) => {
        // 1. Escape HTML first to prevent injection and make it renderable
        let safeCode = rawCode
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // 2. Regexes (Applied on escaped code)
        const keywordPattern = '\\b(program|var|begin|end|if|then|else|for|to|do|while|repeat|until|write|writeln|readln|integer|string|real|boolean|and|or|not|div|mod)\\b';

        const combinedRegex = new RegExp(`('[^']* ')|(${keywordPattern})|(\\b\\d+\\b)`, 'gi');

        const html = safeCode.replace(combinedRegex, (match, str, kw, num) => {
            if (str) return `<span class="text-emerald-500">${match}</span>`;
            if (kw) return `<span class="text-amber-600 font-bold">${match}</span>`;
            if (num) return `<span class="text-blue-500">${match}</span>`;
            return match;
        });

        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    };

    const handleRun = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setOutput([]); // Clear previous

        const interpreter = interpreterRef.current;

        await interpreter.run(
            code,
            (text) => {
                setOutput(prev => [...prev, text]);
            },
            () => {
                // Input Request
                setIsWaitingInput(true);
                return new Promise(resolve => {
                    inputResolverRef.current = resolve;
                });
            }
        );

        setIsRunning(false);
    };

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (inputResolverRef.current) {
            inputResolverRef.current(inputValue);
            setInputValue('');
            setIsWaitingInput(false);
            inputResolverRef.current = null;
        }
    };

    // Handle Tab key for indentation
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const spaces = '    '; // 4 spaces indentation

            const newCode = code.substring(0, start) + spaces + code.substring(end);
            setCode(newCode);

            // Move cursor forward
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
                }
            }, 0);
        }
    };

    const textareaRef = useRef(null);
    const highlightRef = useRef(null);

    const syncScroll = () => {
        if (textareaRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop;
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    return (
        <div className="flex h-full bg-slate-50 relative overflow-hidden">
            {/* Editor Side */}
            <div className="flex-1 flex flex-col border-r border-slate-200">
                {/* Toolbar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Code2 size={20} className="text-amber-500" />
                        <span>Editor.pas</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCode(INITIAL_CODE)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Reset Code"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 relative font-mono text-sm sm:text-base group">
                    {/* Line Numbers (Simple) */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-100 border-r border-slate-200 text-slate-400 text-right pr-2 pt-4 select-none pointer-events-none z-10 font-mono text-xs leading-6">
                        {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>

                    {/* Wrapper for Overlap */}
                    <div className="absolute inset-0 left-10 overflow-hidden bg-white">
                        {/* Highlights (Background layer) */}
                        <div
                            ref={highlightRef}
                            className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words leading-6"
                            style={{ fontFamily: 'monospace' }}
                        >
                            {renderHighlightedCode(code)}
                        </div>

                        {/* Input Area (Foreground layer, transparent text) */}
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onScroll={syncScroll}
                            onKeyDown={handleKeyDown}
                            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-slate-900 resize-none outline-none whitespace-pre-wrap break-words leading-6 z-20 selection:bg-amber-100 selection:text-transparent"
                            style={{ fontFamily: 'monospace' }}
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>

            {/* Terminal Side */}
            <div className="w-[40%] bg-slate-950 flex flex-col shadow-2xl z-20">
                {/* Toolbar */}
                <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-sm uppercase tracking-wider">
                        <Terminal size={18} className="text-emerald-500" />
                        Terminal
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOutput([])}
                            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Clear Console"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button
                            onClick={handleRun}
                            disabled={isRunning || isWaitingInput}
                            className={`
                                flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm transition-all
                                ${isRunning || isWaitingInput
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
                                }
                            `}
                        >
                            {isRunning && !isWaitingInput ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                            {isRunning ? 'Running...' : 'Run'}
                        </button>
                    </div>
                </div>

                {/* Output Area */}

                <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300 relative" onClick={() => document.getElementById('terminal-input')?.focus()}>
                    {output.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap break-all mb-1 font-medium">
                            {line.startsWith('[ERROR]') ? <span className="text-rose-500">{line}</span> : line}
                        </div>
                    ))}

                    {/* Inline Input Field */}
                    {isWaitingInput && (
                        <form onSubmit={handleInputSubmit} className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-left-2">
                            <span className="text-amber-500 font-bold">{'>'}</span>
                            <input
                                id="terminal-input"
                                autoFocus
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-bold placeholder-slate-700"
                                placeholder="Type input..."
                                autoComplete="off"
                            />
                        </form>
                    )}

                    {output.length === 0 && !isRunning && !isWaitingInput && (
                        <div className="text-slate-600 italic mt-4 opacity-50">
                            Result will appear here...
                        </div>
                    )}

                    {/* Fake Cursor when running but not waiting input */}
                    {isRunning && !isWaitingInput && <span className="inline-block w-2 h-4 bg-emerald-500 animate-pulse align-middle ml-1 mt-1">_</span>}
                </div>
            </div>
        </div>
    );
}

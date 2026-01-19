import React, { useState, useEffect } from 'react';
import { CheckCircle2, Lightbulb, Play, RotateCcw, Pause, SkipBack, SkipForward, Terminal, Gauge } from 'lucide-react';
import { executePseudoCode } from '../../utils/pseudoExecutor';
import { motion } from 'framer-motion';

export default function SequenceLevel({ levelData, onComplete, isCompleted, theme = 'sky' }) {
    const [order, setOrder] = useState([]);
    const [feedback, setFeedback] = useState(null);

    // Execution State
    const [trace, setTrace] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(800);


    // Theme configuration
    const themes = {
        sky: {
            bg: 'bg-sky-100',
            text: 'text-sky-600',
            borderHover: 'hover:border-sky-400',
            shadow: 'shadow-sky-200',
            hoverShadow: 'hover:shadow-sky-300',
            btn: 'bg-sky-500 hover:bg-sky-600',
            groupHoverBg: 'group-hover:bg-sky-100',
            groupHoverText: 'group-hover:text-sky-600'
        },
        amber: {
            bg: 'bg-amber-100',
            text: 'text-amber-600',
            borderHover: 'hover:border-amber-400',
            shadow: 'shadow-amber-200',
            hoverShadow: 'hover:shadow-amber-300',
            btn: 'bg-amber-500 hover:bg-amber-600',
            groupHoverBg: 'group-hover:bg-amber-100',
            groupHoverText: 'group-hover:text-amber-600'
        }
    };
    const t = themes[theme] || themes.sky;

    useEffect(() => {
        if (levelData && levelData.availableBlocks) {
            setOrder([...levelData.availableBlocks].sort(() => Math.random() - 0.5));
            setTrace(null); // Reset trace on load
        }
    }, [levelData]);

    // Playback Engine
    useEffect(() => {
        let timer;
        if (isPlaying && trace) {
            timer = setInterval(() => {
                setCurrentStep(prev => {
                    const next = prev + 1;
                    if (next >= trace.steps.length) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return next;
                });
            }, playbackSpeed);
        }
        return () => clearInterval(timer);
    }, [isPlaying, trace, playbackSpeed]);

    const runCode = () => {
        setFeedback(null);
        // Prepare input context from levelData if available, matching Flowchart logic
        // For now, we mock numeric inputs. Logic could be improved.
        const inputContext = { ...levelData.inputs };
        const result = executePseudoCode(order, inputContext);
        setTrace({ steps: result });
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const handleReset = () => {
        setTrace(null);
        setIsPlaying(false);
        setCurrentStep(0);
        if (levelData && levelData.availableBlocks) {
            setOrder([...levelData.availableBlocks].sort(() => Math.random() - 0.5));
        }
    };


    const checkOrder = () => {
        // Normalize: trim each line and join. This ignores indentation differences.
        const normalize = (arr) => arr.map(s => s.trim()).join(',');

        const currentString = normalize(order.map(o => o.text));
        const correctString = normalize(levelData.correctOrder);

        let isValid = currentString === correctString;

        if (!isValid && levelData.alternateOrders) {
            isValid = levelData.alternateOrders.some(alt => normalize(alt) === currentString);
        }

        if (isValid) {
            setFeedback({ type: 'success', msg: 'නිවැරදියි! (Correct!)' });
            if (!isCompleted) onComplete();
        } else {
            const attempts = feedback?.attempts ? feedback.attempts + 1 : 1;
            setFeedback({
                type: 'error',
                msg: 'පියවරවල අනුපිළිවෙල වැරදියි. නැවත උත්සාහ කරන්න. (Incorrect Order)',
                attempts
            });
        }
    };

    const moveItem = (from, to) => {
        const newOrder = [...order];
        const [moved] = newOrder.splice(from, 1);
        newOrder.splice(to, 0, moved);
        setOrder(newOrder);
        setFeedback(null);
    };

    if (!levelData) return <div>Loading...</div>;

    return (
        <div className="p-8 pb-12 w-full">
            <div className="mb-8">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl ${t.bg} ${t.text} flex items-center justify-center text-lg shadow-sm`}>?</span>
                    {levelData.instruction}
                </h3>
                <p className="text-slate-400 font-bold ml-14 text-sm mt-1">
                    Drag and drop the blocks to arrange them.
                    (පෙට්ටි ඇදගෙන ගොස් නිවැරදි තැනින් තබන්න)
                </p>
            </div>

            {/* Main Grid: Split if output needed or running */}
            <div className={`grid ${true ? 'grid-cols-1 lg:grid-cols-2 gap-12' : 'grid-cols-1'} max-w-6xl mx-auto mb-10`}>

                {/* Left Side: Blocks */}
                <div className="space-y-3">
                    {order.map((block, index) => {
                        const isActive = trace && trace.steps[currentStep]?.lineIndex === index;
                        return (
                            <div
                                key={block.id}
                                className={`bg-white border-2 p-4 rounded-2xl font-mono font-bold text-slate-700 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all flex items-center gap-4 group relative z-10 
                            ${isActive ? 'border-emerald-500 shadow-emerald-200 scale-[1.02] ring-4 ring-emerald-500/20' : 'border-slate-200 hover:border-sky-400'}
                            `}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('index', index);
                                    e.currentTarget.classList.add('opacity-50');
                                }}
                                onDragEnd={(e) => {
                                    e.currentTarget.classList.remove('opacity-50');
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const fromIndex = parseInt(e.dataTransfer.getData('index'));
                                    moveItem(fromIndex, index);
                                }}
                            >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black select-none transition-colors
                                ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-600'}
                                `}>
                                    {isActive ? <Play size={12} className="fill-white" /> : index + 1}
                                </span>
                                <span className="text-base sm:text-lg tracking-tight">{block.text}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: Output Terminal (Only if output exists) */}
                {/* Right Side: Output Terminal (Dynamic) */}
                <div className="flex flex-col relative">
                    {/* Controls */}
                    <div className="mb-4 flex gap-2 justify-end">
                        {trace ? (
                            <div className="bg-slate-900/90 text-white p-2 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-right-5 fade-in">
                                <button onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.max(0, s - 1)); }} disabled={currentStep === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30">
                                    <SkipBack size={18} className="fill-white" />
                                </button>
                                <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg active:scale-95 transition-all">
                                    {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white" />}
                                </button>
                                <button onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.min(trace.steps.length - 1, s + 1)); }} disabled={currentStep >= trace.steps.length - 1} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30">
                                    <SkipForward size={18} className="fill-white" />
                                </button>
                                <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>
                                <button onClick={() => setPlaybackSpeed(s => s === 800 ? 400 : (s === 400 ? 100 : 800))} className="flex items-center gap-1 text-xs font-bold font-mono px-2 py-1.5 hover:bg-slate-700 rounded-lg">
                                    <Gauge size={14} />
                                    <span>{playbackSpeed === 800 ? '1x' : (playbackSpeed === 400 ? '2x' : 'MAX')}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={runCode} className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2 font-bold px-6">
                                    <Play size={20} className="fill-white" /> Run Code
                                </button>
                                <button onClick={handleReset} className="bg-white hover:bg-slate-50 text-slate-400 p-3 rounded-xl shadow-md border border-slate-200 transition-all active:scale-95">
                                    <RotateCcw size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Console UI */}
                    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[300px]">
                        <div className="bg-slate-800 flex border-b border-slate-700">
                            <div className="px-4 py-2 flex items-center gap-2 border-r border-slate-700 bg-slate-800/50">
                                <Terminal size={14} className="text-emerald-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Console</span>
                            </div>
                            <div className="flex-1 flex items-center justify-end px-4 text-[10px] font-mono text-slate-500">
                                {trace ? `STEP ${currentStep + 1} / ${trace.steps.length}` : 'READY'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 flex-1 overflow-hidden">
                            {/* Logs */}
                            <div className="border-r border-slate-700 flex flex-col bg-slate-950/50">
                                <div className="bg-slate-950/30 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Output</div>
                                <div className="p-3 font-mono text-xs overflow-y-auto flex-1 flex flex-col gap-1 text-slate-300">
                                    {!trace && <span className="text-slate-600 italic">Click Run to see output...</span>}
                                    {trace && trace.steps[currentStep]?.logs.length === 0 && <span className="text-slate-700 italic">No output</span>}
                                    {trace && trace.steps[currentStep]?.logs.map((log, i) => (
                                        <div key={i} className="text-emerald-400 border-l-2 border-emerald-900 pl-2 animate-in fade-in duration-300">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Variables */}
                            <div className="flex flex-col bg-slate-900/30">
                                <div className="bg-slate-950/30 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Variables</div>
                                <div className="p-3 font-mono text-xs overflow-y-auto flex-1 flex flex-col gap-2">
                                    {!trace && <span className="text-slate-600 italic">...</span>}
                                    {trace && Object.entries(trace.steps[currentStep]?.variables || {}).map(([key, val]) => (
                                        !['logs'].includes(key) && (
                                            <div key={key} className="flex justify-between items-center border-b border-slate-800 pb-1 animate-in slide-in-from-right-2 duration-300">
                                                <span className="text-purple-400">{key}</span>
                                                <span className="text-slate-200 font-bold">{val}</span>
                                            </div>
                                        )
                                    ))}
                                    {trace && Object.keys(trace.steps[currentStep]?.variables || {}).filter(k => !['logs'].includes(k)).length === 0 && (
                                        <span className="text-slate-700 italic">No variables</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {feedback && (
                    <div className={`mb-4 font-bold text-lg animate-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {feedback.msg}
                    </div>
                )}

                {!isCompleted ? (
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={checkOrder}
                            className={`${t.btn} text-white text-lg px-10 py-4 rounded-2xl font-black ${t.shadow} ${t.hoverShadow} hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2`}
                        >
                            <CheckCircle2 size={24} />
                            Check Answer
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-white hover:bg-slate-50 text-slate-500 text-lg px-6 py-4 rounded-2xl font-bold border-2 border-slate-200 hover:border-slate-300 transition-all active:scale-95 flex items-center gap-2"
                            title="Reset Code"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-300">
                        <div className="flex items-center justify-center gap-3 text-emerald-600 font-black text-xl bg-emerald-100/50 py-4 px-8 rounded-2xl border border-emerald-200 inline-flex">
                            <CheckCircle2 size={28} className="fill-emerald-500 text-white" />
                            Excellent Work!
                        </div>

                        {levelData.explanation && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-6 rounded-2xl max-w-2xl text-left flex gap-4">
                                <div className="bg-amber-100 p-2 rounded-lg h-fit text-amber-600">
                                    <Lightbulb size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-amber-700 mb-1">Explanation (විස්තරය)</h4>
                                    <p className="font-medium leading-relaxed opacity-90">{levelData.explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

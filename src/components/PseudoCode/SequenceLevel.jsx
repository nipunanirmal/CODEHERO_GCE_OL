import React, { useState, useEffect } from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';

export default function SequenceLevel({ levelData, onComplete, isCompleted, theme = 'sky' }) {
    const [order, setOrder] = useState([]);
    const [feedback, setFeedback] = useState(null);

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
        }
    }, [levelData]);

    const checkOrder = () => {
        const currentString = order.map(o => o.text).join(',');
        const correctString = levelData.correctOrder.join(',');

        if (currentString === correctString) {
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

            {/* Main Grid: Split if output exists */}
            <div className={`grid ${levelData.output ? 'grid-cols-1 lg:grid-cols-2 gap-12' : 'grid-cols-1'} max-w-6xl mx-auto mb-10`}>

                {/* Left Side: Blocks */}
                <div className="space-y-3">
                    {order.map((block, index) => (
                        <div
                            key={block.id}
                            className={`bg-white border-2 border-slate-200 p-4 rounded-2xl font-mono font-bold text-slate-700 cursor-grab active:cursor-grabbing ${t.borderHover} hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-4 group relative z-10`}
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
                            <span className={`w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-black select-none ${t.groupHoverBg} ${t.groupHoverText} transition-colors`}>
                                {index + 1}
                            </span>
                            <span className="text-base sm:text-lg tracking-tight">{block.text}</span>
                        </div>
                    ))}
                </div>

                {/* Right Side: Output Terminal (Only if output exists) */}
                {levelData.output && (
                    <div className="flex flex-col">
                        <div className="bg-slate-900 rounded-t-2xl p-4 flex items-center gap-2 border-b border-slate-800">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <span className="text-slate-400 text-xs font-mono ml-2 font-bold">Terminal Output</span>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-b-2xl font-mono text-emerald-400 text-sm sm:text-base leading-relaxed h-full min-h-[200px] shadow-2xl relative overflow-hidden">

                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none bg-[length:100%_4px]" />

                            <div className="relative z-10 whitespace-pre-wrap">
                                <span className="text-slate-500 select-none">$ run program</span>
                                <br />
                                {feedback?.type === 'success' ? (
                                    <span className="animate-in fade-in duration-1000">{levelData.output}</span>
                                ) : (
                                    <span className="text-slate-600 italic">
                                        ... Waiting for correct code ...
                                        <br />
                                        <span className="opacity-50 text-xs mt-2 block">(Complete the code on the left to see output)</span>
                                    </span>
                                )}
                                {feedback?.type === 'success' && (
                                    <div className="mt-4 text-slate-500 select-none animate-pulse">_</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {feedback && (
                    <div className={`mb-4 font-bold text-lg animate-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {feedback.msg}
                    </div>
                )}

                {!isCompleted ? (
                    <button
                        onClick={checkOrder}
                        className={`${t.btn} text-white text-lg px-10 py-4 rounded-2xl font-black ${t.shadow} ${t.hoverShadow} hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 mx-auto`}
                    >
                        <CheckCircle2 size={24} />
                        Check Answer
                    </button>
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

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, RefreshCw, Lightbulb } from 'lucide-react';

export default function ConceptLevel({ levelData, onComplete, isCompleted, theme = 'sky' }) {
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [matches, setMatches] = useState({});
    const [disabled, setDisabled] = useState(isCompleted);

    // Theme configuration
    const themes = {
        sky: {
            iconBg: 'bg-indigo-100',
            iconText: 'text-indigo-600',
            selectedBg: 'bg-indigo-50',
            selectedBorder: 'border-indigo-500',
            selectedText: 'text-indigo-700',
            hoverBorder: 'hover:border-indigo-300',
            hoverBg: 'hover:bg-white',
            hoverShadow: 'hover:shadow-md'
        },
        amber: {
            iconBg: 'bg-amber-100',
            iconText: 'text-amber-600',
            selectedBg: 'bg-amber-50',
            selectedBorder: 'border-amber-500',
            selectedText: 'text-amber-700',
            hoverBorder: 'hover:border-amber-300',
            hoverBg: 'hover:bg-amber-50/50',
            hoverShadow: 'hover:shadow-md'
        }
    };
    const t = themes[theme] || themes.sky;

    useEffect(() => {
        if (isCompleted) {
            const allMatches = {};
            levelData.pairs.forEach(p => allMatches[p.real] = p.code);
            setMatches(allMatches);
            setDisabled(true);
        } else {
            setMatches({});
            setDisabled(false);
            setSelectedLeft(null);
        }
    }, [levelData, isCompleted]);

    const handleLeftClick = (real) => {
        if (disabled || matches[real]) return;
        setSelectedLeft(real);
    };

    const handleRightClick = (code) => {
        if (disabled || !selectedLeft) return;

        // Check validity
        const pair = levelData.pairs.find(p => p.real === selectedLeft);
        if (pair && pair.code === code) {
            const newMatches = { ...matches, [selectedLeft]: code };
            setMatches(newMatches);
            setSelectedLeft(null);

            // Check if all matched
            if (Object.keys(newMatches).length === levelData.pairs.length) {
                setTimeout(() => onComplete(), 500);
            }
        } else {
            // Shake or error effect 
            const el = document.getElementById(`btn-${code}`);
            if (el) {
                el.classList.add('animate-shake');
                setTimeout(() => el.classList.remove('animate-shake'), 500);
            }
            setSelectedLeft(null);
        }
    };

    const isMatched = (real) => !!matches[real];
    const isRightMatched = (code) => Object.values(matches).includes(code);

    return (
        <div className="p-8 h-full flex flex-col items-center justify-center">

            <h3 className="text-lg font-bold text-slate-700 mb-8 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${t.iconBg} ${t.iconText} flex items-center justify-center text-sm font-black`}>?</div>
                {levelData.instruction}
            </h3>

            <div className="flex w-full max-w-4xl gap-12 items-center justify-center">

                {/* LEFT COLUMN (Real World) */}
                <div className="flex flex-col gap-4 w-1/3">
                    {levelData.pairs.map((pair, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleLeftClick(pair.real)}
                            disabled={disabled || isMatched(pair.real)}
                            className={`p-4 rounded-xl font-bold text-left transition-all border-2
                                ${isMatched(pair.real)
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 opacity-50'
                                    : selectedLeft === pair.real
                                        ? `${t.selectedBg} ${t.selectedBorder} ${t.selectedText} scale-105 shadow-lg`
                                        : `bg-white border-slate-200 text-slate-600 ${t.hoverBorder} ${t.hoverShadow}`
                                }
                            `}
                        >
                            {pair.real}
                        </button>
                    ))}
                </div>

                {/* CONNECTOR AREA */}
                <div className="flex flex-col gap-2 items-center justify-center text-slate-300">
                    <ArrowRight size={32} />
                </div>

                {/* RIGHT COLUMN (Pseudo Code) */}
                <div className="flex flex-col gap-4 w-1/3">
                    {/* Shuffle right side for challenge */}
                    {levelData.pairs
                        // Naive shuffle for rendering, or keep static order. Let's start with static, maybe shuffle later.
                        // Actually, mapping over the same array means answers are aligned. We should shuffle visually.
                        // For simplicity in this `map` let's use a sorted version or keep it as is if defined shuffled in data.
                        // In `pseudoLevels.js` I defined them in aligned pairs. Let's shuffle them in render.
                        // Using a Memo to keep shuffle consistent? 
                        // For this iteration, let's just reverse it distinct from left to show mapping.
                        .slice().reverse()
                        .map((pair, idx) => (
                            <button
                                id={`btn-${pair.code}`}
                                key={idx}
                                onClick={() => handleRightClick(pair.code)}
                                disabled={disabled || isRightMatched(pair.code)}
                                className={`p-4 rounded-xl font-mono font-bold text-center transition-all border-2 border-dashed
                                ${isRightMatched(pair.code)
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 opacity-50'
                                        : `bg-slate-50 border-slate-300 text-slate-700 ${t.hoverBg} ${t.hoverBorder} ${t.hoverShadow}`
                                    }
                            `}
                            >
                                {pair.code}
                            </button>
                        ))}
                </div>
            </div>

            {isCompleted && (
                <div className="mt-12 animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-6">
                    <div className="text-emerald-500 font-black text-2xl flex items-center gap-3">
                        <CheckCircle2 size={32} />
                        Excellent!
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
    );
}

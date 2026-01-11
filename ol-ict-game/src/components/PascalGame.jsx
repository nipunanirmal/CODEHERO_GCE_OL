import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Trophy, Code } from 'lucide-react';
import { pascalLevels } from '../data/pascalLevels';
import ConceptLevel from './PseudoCode/ConceptLevel'; // We can reuse this!
import SequenceLevel from './PseudoCode/SequenceLevel'; // We can reuse this for Syntax ordering!
// We might need a specific Wrapper if we want "Pascal" specific styling or logic, but reusing is smart.

export default function PascalGame({ xp, addXP, levelIndex, setLevelIndex, completedLevels, setCompletedLevels }) {

    const currentLevel = pascalLevels[levelIndex] || pascalLevels[0];

    const handleSuccess = () => {
        addXP(50);
        const newCompleted = new Set(completedLevels);
        newCompleted.add(currentLevel.id);
        setCompletedLevels(newCompleted);
    };

    const nextLevel = () => {
        if (levelIndex < pascalLevels.length - 1) {
            setLevelIndex(levelIndex + 1);
        }
    };

    return (
        <div className="flex flex-col h-full bg-amber-50/30">
            {/* Header */}
            <div className="bg-white border-b border-amber-100 p-6 flex justify-between items-center z-10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">PASCAL {levelIndex + 1}</span>
                        {currentLevel.title}
                    </h2>
                    <p className="text-sm font-bold text-slate-400 mt-1 pl-1">{currentLevel.description}</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500" /> {xp} XP
                    </div>
                    {completedLevels.has(currentLevel.id) && levelIndex < pascalLevels.length - 1 && (
                        <button
                            onClick={nextLevel}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-200"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 overflow-auto p-8 pb-20">
                <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-amber-100/50 border border-white relative overflow-hidden">

                    {/* Decorative Background blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10">
                        {currentLevel.type === 'concept' && (
                            <ConceptLevel
                                levelData={currentLevel}
                                onComplete={handleSuccess}
                                isCompleted={completedLevels.has(currentLevel.id)}
                                theme="amber"
                            />
                        )}

                        {(currentLevel.type === 'syntax' || currentLevel.type === 'coding') && (
                            <SequenceLevel
                                levelData={currentLevel}
                                onComplete={handleSuccess}
                                isCompleted={completedLevels.has(currentLevel.id)}
                                theme="amber"
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

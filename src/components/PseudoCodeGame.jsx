
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import { pseudoLevels } from '../data/pseudoLevels';
import ConceptLevel from './PseudoCode/ConceptLevel';
import SequenceLevel from './PseudoCode/SequenceLevel';
import TranslationLevel from './PseudoCode/TranslationLevel';

export default function PseudoCodeGame({ xp, addXP, levelIndex, setLevelIndex, completedLevels, setCompletedLevels }) {

    // Safety check
    const currentLevel = pseudoLevels[levelIndex] || pseudoLevels[0];

    const handleSuccess = () => {
        addXP(50);
        const newCompleted = new Set(completedLevels);
        newCompleted.add(currentLevel.id);
        setCompletedLevels(newCompleted);
    };

    const nextLevel = () => {
        if (levelIndex < pseudoLevels.length - 1) {
            setLevelIndex(levelIndex + 1);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <span className="text-sky-500">LEVEL {levelIndex + 1}:</span>
                        {currentLevel.title}
                    </h2>
                    <p className="text-sm font-bold text-slate-400">{currentLevel.description}</p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="bg-amber-100 text-amber-600 px-4 py-2 rounded-xl font-black flex items-center gap-2">
                        <Trophy size={18} /> {xp} XP
                    </div>
                    {completedLevels.has(currentLevel.id) && levelIndex < pseudoLevels.length - 1 && (
                        <button
                            onClick={nextLevel}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 overflow-auto p-8 pb-20">
                <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 relative">

                    {currentLevel.type === 'concept' && (
                        <ConceptLevel
                            levelData={currentLevel}
                            onComplete={handleSuccess}
                            isCompleted={completedLevels.has(currentLevel.id)}
                        />
                    )}

                    {currentLevel.type === 'sequence' && (
                        <SequenceLevel
                            levelData={currentLevel}
                            onComplete={handleSuccess}
                            isCompleted={completedLevels.has(currentLevel.id)}
                        />
                    )}

                    {currentLevel.type === 'translation' && (
                        <TranslationLevel
                            levelData={currentLevel}
                            onComplete={handleSuccess}
                            isCompleted={completedLevels.has(currentLevel.id)}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}

// Temporary internal component for Sequence until we separate it
// Actually let's make a simple one here to avoid errors


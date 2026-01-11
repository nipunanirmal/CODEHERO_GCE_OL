import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export default function Sidebar({
    availableBlocks,
    missionTitle,
    missionDescription
}) {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const DraggableNode = ({ type, label, color }) => (
        <div
            className={`p-3 mb-2 rounded-xl cursor-grab shadow-sm border-l-4 bg-white hover:shadow-md transition-all flex items-center gap-2 ${color}`}
            onDragStart={(event) => onDragStart(event, type, label)}
            draggable
        >
            <div className={`w-3 h-3 rounded-full ${color.replace('border-', 'bg-')}`} />
            <span className="text-sm font-bold text-slate-700">{label}</span>
        </div>
    );

    return (
        <aside className="w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-inner select-none relative z-20">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-white">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <LayoutDashboard size={14} />
                    මෙවලම් පෙට්ටිය (Toolkit)
                </h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Mission Card (Optional Context) */}
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                    <h4 className="font-bold text-indigo-900 text-sm mb-1">{missionTitle || 'Mission'}</h4>
                    <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                        {missionDescription || 'Complete the flowchart.'}
                    </p>
                </div>

                {/* Logic Blocks */}
                {(!availableBlocks || availableBlocks.some(b => ['terminator', 'decision'].includes(b.type))) && (
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 mb-2 tracking-widest">Logic</p>
                        {availableBlocks ? (
                            availableBlocks.filter(b => ['terminator', 'decision'].includes(b.type)).map((b, i) => (
                                <DraggableNode key={i} type={b.type} label={b.label} color={b.type === 'terminator' ? 'border-emerald-500' : 'border-amber-500'} />
                            ))
                        ) : null}
                    </div>
                )}

                {/* Action Blocks */}
                {(!availableBlocks || availableBlocks.some(b => ['process', 'io'].includes(b.type))) && (
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase ml-1 mb-2 tracking-widest">Actions</p>
                        {availableBlocks ? (
                            availableBlocks.filter(b => ['process', 'io'].includes(b.type)).map((b, i) => (
                                <DraggableNode
                                    key={i}
                                    type={b.type}
                                    label={b.label}
                                    color={b.type === 'process' ? 'border-sky-500' : 'border-purple-500'}
                                />
                            ))
                        ) : null}
                    </div>
                )}
            </div>
        </aside>
    );
}

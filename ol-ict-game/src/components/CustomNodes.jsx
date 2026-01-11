import React from 'react';
import { Handle, Position } from '@xyflow/react';

export const TerminatorNode = ({ data }) => (
    <div className="px-5 py-3 bg-emerald-50 border-2 border-emerald-500 rounded-[24px] shadow-sm font-bold text-slate-800 text-xs tracking-tight min-w-[120px] text-center group relative">
        <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-5 !h-5 !-top-3 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />
        <div>{data.label}</div>
        <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-5 !h-5 !-bottom-3 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />
    </div>
);

export const ProcessNode = ({ data }) => (
    <div className="px-5 py-3 bg-sky-50 border-2 border-sky-500 rounded-xl shadow-sm font-bold text-slate-800 text-xs tracking-tight min-w-[140px] text-center group relative">
        <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-5 !h-5 !-top-3 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />
        <div>{data.label}</div>
        <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-5 !h-5 !-bottom-3 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />
    </div>
);

export const DecisionNode = ({ data }) => (
    <div className="w-[110px] h-[110px] relative flex items-center justify-center group">
        <div className="absolute inset-0 bg-amber-50 border-2 border-amber-500 rotate-45 rounded-xl shadow-sm" />
        <div className="relative z-10 font-bold text-slate-800 text-xs text-center px-2 leading-tight tracking-tight">{data.label}</div>

        <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-5 !h-5 !-top-3 !left-1/2 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />

        {/* Yes Handle (Right) */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1 rounded">ඔව්</span>
            <Handle
                type="source"
                position={Position.Right}
                id="yes"
                className="!relative !transform-none !bg-emerald-500 !w-5 !h-5 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform"
            />
        </div>

        {/* No Handle (Bottom) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <Handle
                type="source"
                position={Position.Bottom}
                id="no"
                className="!relative !transform-none !bg-rose-500 !w-5 !h-5 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform"
            />
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1 rounded">නැත</span>
        </div>
    </div>
);

export const IONode = ({ data }) => (
    <div className="px-8 py-3 relative group min-w-[140px] text-center">
        {/* Parallelogram background */}
        <div className="absolute inset-0 bg-purple-50 border-2 border-purple-500 shadow-sm transform -skew-x-[20deg]" />
        <div className="relative z-10 font-bold text-slate-800 text-xs tracking-tight">{data.label}</div>

        {/* Handles positioned outside the skew to be stable */}
        <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-5 !h-5 !-top-3 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />
        <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-5 !h-5 !-bottom-3 !border-4 !border-white shadow-lg hover:!scale-125 transition-transform" />
    </div>
);

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

// Common handle style
const handleStyle = { width: 8, height: 8, background: '#64748b' };

const ParallelogramNode = memo(({ data, isConnectable }) => {
    return (
        <div className="relative w-[150px] h-[60px] flex justify-center items-center">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={handleStyle} />

            <svg className="absolute inset-0 w-full h-full drop-shadow-sm" viewBox="0 0 150 60" preserveAspectRatio="none">
                <path d="M 20 2 L 148 2 L 130 58 L 2 58 Z" fill={data.bg || "#eff6ff"} stroke={data.border || "#60a5fa"} strokeWidth="2" />
            </svg>

            <div className="relative z-10 text-xs font-bold text-slate-700 text-center px-4 w-full">
                {data.label}
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={handleStyle} />
        </div>
    );
});

const DiamondNode = memo(({ data, isConnectable }) => {
    return (
        <div className="relative w-[120px] h-[80px] flex justify-center items-center">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ ...handleStyle, top: -4 }} />

            <svg className="absolute inset-0 w-full h-full drop-shadow-sm" viewBox="0 0 120 80" preserveAspectRatio="none">
                <path d="M 60 2 L 118 40 L 60 78 L 2 40 Z" fill={data.bg || "#fff1f2"} stroke={data.border || "#f43f5e"} strokeWidth="2" />
            </svg>

            <div className="relative z-10 text-[10px] font-bold text-slate-700 text-center px-6 leading-tight">
                {data.label}
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ ...handleStyle, bottom: -4 }} />
            <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} style={{ ...handleStyle, right: -4 }} />
            <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} style={{ ...handleStyle, left: -4 }} />

            {/* Labels for branches */}
            <div className="absolute right-[-20px] top-[40%] text-[9px] font-bold text-slate-400">No</div>
            <div className="absolute bottom-[-15px] left-[50%] text-[9px] font-bold text-emerald-500">Yes</div>
        </div>
    );
});

const TerminalNode = memo(({ data, isConnectable }) => {
    return (
        <div className="relative w-[120px] h-[50px] flex justify-center items-center">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={handleStyle} />

            <svg className="absolute inset-0 w-full h-full drop-shadow-sm" viewBox="0 0 120 50" preserveAspectRatio="none">
                <rect x="2" y="2" width="116" height="46" rx="23" ry="23" fill={data.bg || "#ecfdf5"} stroke={data.border || "#34d399"} strokeWidth="2" />
            </svg>

            <div className="relative z-10 text-xs font-bold text-slate-700 text-center px-2">
                {data.label}
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={handleStyle} />
        </div>
    );
});

const ProcessNode = memo(({ data, isConnectable }) => {
    return (
        <div className="relative w-[140px] h-[60px] flex justify-center items-center">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={handleStyle} />

            <svg className="absolute inset-0 w-full h-full drop-shadow-sm" viewBox="0 0 140 60" preserveAspectRatio="none">
                <rect x="2" y="2" width="136" height="56" rx="4" ry="4" fill={data.bg || "#fff7ed"} stroke={data.border || "#fb923c"} strokeWidth="2" />
            </svg>

            <div className="relative z-10 text-xs font-bold text-slate-700 text-center px-2">
                {data.label}
            </div>

            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={handleStyle} />
        </div>
    );
});

export const nodeTypes = {
    parallelogram: ParallelogramNode,
    diamond: DiamondNode,
    terminal: TerminalNode,
    process: ProcessNode,
};

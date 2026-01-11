import React, { useMemo } from 'react'; // Added React import
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SequenceLevel from './SequenceLevel';
import { nodeTypes } from './FlowchartNodes';

export default function TranslationLevel({ levelData, onComplete, isCompleted }) {

    // Memoize nodes and edges to prevent unnecessary re-renders
    const nodes = useMemo(() => levelData.flowchartNodes || [], [levelData]);
    const edges = useMemo(() => levelData.flowchartEdges || [], [levelData]);

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 p-6">

            {/* Left Panel: Static Flowchart Viewer */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-inner relative">
                <div className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-lg backdrop-blur-sm shadow-sm">
                    <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Reference Flowchart
                    </h4>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    nodesDraggable={false}
                    nodesConnectable={false}
                    zoomOnScroll={false}
                    panOnScroll={true}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background color="#cbd5e1" gap={20} size={1} />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>

            {/* Right Panel: Sequence Builder */}
            <div className="w-full lg:w-1/2 flex flex-col">
                <SequenceLevel
                    levelData={levelData}
                    onComplete={onComplete}
                    isCompleted={isCompleted}
                />
            </div>

        </div>
    );
}

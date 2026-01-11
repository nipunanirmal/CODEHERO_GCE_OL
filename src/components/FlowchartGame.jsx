import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    addEdge,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    MarkerType,
    getOutgoers,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import { Play, RotateCcw, ChevronRight, Trophy, CheckCircle2 } from 'lucide-react';
import { TerminatorNode, ProcessNode, DecisionNode, IONode } from './CustomNodes';
import { levels } from '../data/levels';

let id = 0;
const getId = () => `node_${id++}`;

const FlowchartGame = ({ xp, addXP, levelIndex, setLevelIndex, completedLevels, setCompletedLevels }) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const currentLevel = levels[levelIndex];

    // Load Level Data
    useEffect(() => {
        if (currentLevel) {
            setNodes(currentLevel.initialNodes || []);
            setEdges([]);
            setFeedback(null);
            id = 0; // Reset ID counter
        }
    }, [currentLevel, setNodes, setEdges]);

    const nodeTypes = useMemo(() => ({
        terminator: TerminatorNode,
        process: ProcessNode,
        decision: DecisionNode,
        io: IONode,
    }), []);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
            style: { strokeWidth: 2, stroke: '#64748b' }
        }, eds)),
        [],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (!type || !reactFlowInstance) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            position.x -= 75;
            position.y -= 25;

            const newNode = {
                id: getId(),
                type: type,
                position: position,
                data: { label: label },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );

    const checkSolution = () => {
        const { expectedPath, requiredConnections } = currentLevel;

        // --- SEQUENCE VALIDATION ---
        if (expectedPath) {
            const startNode = nodes.find(n => n.data.label === 'ආරම්භය');
            if (!startNode) {
                setFeedback({ type: 'error', msg: 'ආරම්භක පියවරක් සොයාගත නොහැක.' });
                return;
            }

            let currentNode = startNode;
            let path = [currentNode.data.label];
            let steps = 0;
            const maxSteps = 20;

            while (steps < maxSteps) {
                const outgoers = getOutgoers(currentNode, nodes, edges);
                if (outgoers.length === 0) break;

                if (outgoers.length > 1) {
                    setFeedback({ type: 'error', msg: 'මෙම අභියෝගය සඳහා තීරණ (branching) අවශ්‍ය නොවේ.' });
                    return;
                }

                currentNode = outgoers[0];
                path.push(currentNode.data.label);
                steps++;
            }

            const isValid = path.length === expectedPath.length && path.every((val, index) => val === expectedPath[index]);

            if (isValid) {
                handleSuccess();
            } else {
                setFeedback({ type: 'error', msg: 'පියවර නිවැරදිව සම්බන්ධ වී නොමැත. නැවත උත්සාහ කරන්න.' });
            }
        }

        // --- SELECTION / ITERATION VALIDATION ---
        else if (requiredConnections) {
            let allFound = true;
            for (let [srcLabel, tgtLabel, requiredHandleId] of requiredConnections) {
                const srcNodes = nodes.filter(n => n.data.label === srcLabel);
                let connectionFound = false;

                for (let s of srcNodes) {
                    const connectedEdges = edges.filter(e => e.source === s.id);
                    const match = connectedEdges.find(e => {
                        const targetNode = nodes.find(n => n.id === e.target);
                        if (!targetNode || targetNode.data.label !== tgtLabel) return false;
                        if (requiredHandleId && e.sourceHandle !== requiredHandleId) return false;
                        return true;
                    });

                    if (match) {
                        connectionFound = true;
                        break;
                    }
                }

                if (!connectionFound) {
                    setFeedback({ type: 'error', msg: `'${srcLabel}' සහ '${tgtLabel}' අතර සම්බන්ධය ${requiredHandleId ? '(' + (requiredHandleId === 'yes' ? 'ඔව්' : 'නැත') + ') ' : ''}සොයාගත නොහැක.` });
                    allFound = false;
                    break;
                }
            }

            if (allFound) {
                handleSuccess();
            }
        }
    };

    const handleSuccess = () => {
        setFeedback({ type: 'success', msg: 'නියමයි! පිළිතුර නිවැරදියි.' });
        addXP(100);

        const newCompleted = new Set(completedLevels);
        newCompleted.add(currentLevel.id);
        setCompletedLevels(newCompleted);
    };

    const handleReset = () => {
        setNodes(currentLevel.initialNodes || []);
        setEdges([]);
        setFeedback(null);
        id = 0;
    };

    const nextLevel = () => {
        if (levelIndex < levels.length - 1) {
            setLevelIndex(levelIndex + 1);
        }
    };

    return (
        <ReactFlowProvider>
            <div className="flex h-full w-full">
                {/* GAME AREA */}
                <div className="flex-1 h-full relative bg-slate-50" ref={reactFlowWrapper}>

                    {/* Header Overlay */}
                    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                        <div className="bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-2xl shadow-sm pointer-events-auto max-w-lg">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <span className="text-primary">LEVEL {levelIndex + 1}:</span>
                                {currentLevel?.title}
                            </h2>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{currentLevel?.category} • {currentLevel?.description}</div>
                        </div>

                        <div className="flex items-center gap-2 pointer-events-auto">
                            <div className="bg-white/90 backdrop-blur border border-slate-200 px-4 py-2 rounded-xl shadow-sm font-black text-amber-500 flex items-center gap-2">
                                <Trophy size={18} />
                                <span>{xp} XP</span>
                            </div>
                        </div>
                    </div>

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        onInit={setReactFlowInstance}
                        fitView
                        className="bg-slate-50"
                    >
                        <Background color="#94a3b8" gap={20} size={1} />
                        <Controls className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden text-slate-500" />
                    </ReactFlow>

                    {/* FEEDBACK OVERLAY */}
                    {feedback && (
                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl border-2 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 flex items-center gap-4 ${feedback.type === 'success' ? 'bg-emerald-500 border-white text-white' : 'bg-white border-red-500 text-red-600'}`}>
                            {feedback.type === 'success' ? <CheckCircle2 size={24} /> : <div className="font-black text-xl">!</div>}
                            <div>
                                <div className="font-bold text-lg">{feedback.type === 'success' ? 'ජයග්‍රහණයක්!' : 'පොඩි වැරැද්දක්...'}</div>
                                <div className="text-sm font-medium opacity-90">{feedback.msg}</div>
                            </div>

                            {feedback.type === 'success' && (
                                <button
                                    onClick={nextLevel}
                                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg ml-2 transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto mt-16">
                        <button
                            onClick={checkSolution}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center group"
                            title="Run Code"
                        >
                            <Play size={24} className="fill-white group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-white hover:bg-slate-50 text-slate-400 p-3 rounded-xl shadow-md border border-slate-200 transition-all active:scale-95"
                            title="Reset Level"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (TOOLKIT ONLY) */}
                <Sidebar
                    availableBlocks={currentLevel?.availableBlocks}
                    missionTitle={`Mission ${levelIndex + 1}`}
                    missionDescription={currentLevel?.description}
                />
            </div>
        </ReactFlowProvider>
    );
};

export default FlowchartGame;

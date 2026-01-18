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
import { Play, Pause, RotateCcw, ChevronRight, Trophy, CheckCircle2, Terminal, SkipBack, SkipForward, Gauge } from 'lucide-react';
import { TerminatorNode, ProcessNode, DecisionNode, IONode } from './CustomNodes';
import { levels } from '../data/levels';

let id = 0;
const getId = () => `node_${id++}`;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const FlowchartGame = ({ xp, addXP, levelIndex, setLevelIndex, completedLevels, setCompletedLevels }) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Debugger State
    const [trace, setTrace] = useState(null); // { steps: [], success: bool, error: string }
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(800); // ms delay

    const currentLevel = levels[levelIndex];

    // Load Level Data
    useEffect(() => {
        if (currentLevel) {
            setNodes(currentLevel.initialNodes || []);
            setEdges([]);
            setFeedback(null);
            setTrace(null);
            setCurrentStep(0);
            setIsPlaying(false);
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

    // --- PLAYBACK ENGINE ---
    useEffect(() => {
        let timer;
        if (isPlaying && trace) {
            timer = setInterval(() => {
                setCurrentStep(prev => {
                    const next = prev + 1;
                    if (next >= trace.steps.length) {
                        setIsPlaying(false); // Stop at end
                        // Show feedback at end
                        if (trace.success) {
                            handleSuccess();
                        } else if (trace.error) {
                            setFeedback({ type: 'error', msg: trace.error });
                        }
                        return prev;
                    }
                    return next;
                });
            }, playbackSpeed);
        }
        return () => clearInterval(timer);
    }, [isPlaying, trace, playbackSpeed]);

    // Highlight Active Node based on CURRENT STEP
    useEffect(() => {
        if (!trace || !trace.steps[currentStep]) {
            // Reset styles if no trace
            setNodes((nds) => nds.map(n => ({ ...n, style: { ...n.style, boxShadow: undefined, transform: undefined } })));
            return;
        }

        const activeId = trace.steps[currentStep].nodeId;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === activeId) {
                    return {
                        ...node,
                        style: {
                            ...node.style,
                            boxShadow: '0 0 0 4px #10b981', // Emerald glow
                            transform: 'scale(1.05)',
                            transition: 'all 0.3s ease'
                        },
                    };
                }
                const { boxShadow, transform, transition, ...restStyle } = node.style || {};
                return { ...node, style: restStyle };
            })
        );
    }, [currentStep, trace, setNodes]);


    const checkSolution = () => {
        const { expectedPath, requiredConnections, execution } = currentLevel;
        setFeedback(null);
        setTrace(null);
        setCurrentStep(0);

        // --- TRACE-BASED SIMULATION ---
        if (execution) {
            const startNode = nodes.find(n => n.data.label === 'ආරම්භය');
            if (!startNode) {
                setFeedback({ type: 'error', msg: 'ආරම්භක පියවරක් සොයාගත නොහැක.' });
                return;
            }

            // 1. Build Adjacency
            const adj = {};
            for (const edge of edges) {
                if (!adj[edge.source]) adj[edge.source] = {};
                const handle = edge.sourceHandle || 'default';
                adj[edge.source][handle] = edge.target;
            }

            // 2. Pre-calculate Trace
            const steps = [];
            let ctx = { x: undefined, sum: undefined, water: undefined, time: undefined, finished: false, logs: [], steps: 0 };
            let currentNode = startNode;
            let error = null;

            while (ctx.steps < execution.maxSteps) {
                const prevCtx = { ...ctx, logs: [...ctx.logs] }; // Snapshot previous state

                let executeFn = currentNode.data.execute;
                if (!executeFn) {
                    const def = [...(currentLevel.availableBlocks || []), ...(currentLevel.initialNodes || [])]
                        .find(b => b.label === currentNode.data.label);
                    if (def && def.execute) executeFn = def.execute;
                }

                let result = undefined;
                if (executeFn) {
                    result = executeFn(ctx);
                }

                // Calculate Diff
                const diff = {
                    logs: ctx.logs.slice(prevCtx.logs.length),
                    vars: {}
                };

                // Compare vars (excluding internal props)
                // Actually easier to just check all keys that aren't 'logs', 'steps', 'finished'
                for (const key in ctx) {
                    if (['logs', 'steps', 'finished'].includes(key)) continue;
                    if (ctx[key] !== prevCtx[key]) {
                        diff.vars[key] = ctx[key];
                    }
                }

                // Record Step
                steps.push({
                    nodeId: currentNode.id,
                    logs: [...ctx.logs],
                    variables: { ...ctx },
                    diff, // Store what changed
                    result // Store decision result if any
                });

                if (ctx.finished) break;
                ctx.steps++;

                // Next Node Logic
                const connections = adj[currentNode.id];
                if (!connections) {
                    error = `ගමන අතරමග නැවතුණා: '${currentNode.data.label}' ට පසුව මාර්ගයක් නැත.`;
                    break;
                }

                let nextNodeId = undefined;
                if (currentNode.type === 'decision') {
                    if (result === true) nextNodeId = connections['yes'];
                    else nextNodeId = connections['no'];
                    if (!nextNodeId) {
                        error = `'${currentNode.data.label}' තීරණයට '${result ? "ඔව්" : "නැත"}' මාර්ගයක් සම්බන්ධ කර නැත.`;
                        break;
                    }
                } else {
                    nextNodeId = Object.values(connections)[0];
                }

                if (!nextNodeId) {
                    error = 'ඊළඟ පියවර සොයාගත නොහැක.';
                    break;
                }

                const nextNode = nodes.find(n => n.id === nextNodeId);
                if (!nextNode) {
                    error = 'සම්බන්ධිත පියවර සොයාගත නොහැක.';
                    break;
                }
                currentNode = nextNode;
            }

            // Check Infinite Loop
            if (ctx.steps >= execution.maxSteps && !error) { // Only set infinite loop error if no other error occurred
                error = 'අනන්ත ලූපයක් (Infinite Loop) හඳුනා ගැනුණි.';
            }

            // Check Result
            let success = false;
            if (!error) {
                success = ctx.logs.length === execution.expectedLogs.length &&
                    ctx.logs.every((l, i) => l === execution.expectedLogs[i]);

                if (!success) {
                    error = `පිළිතුර වැරදියි. බලාපොරොත්තු වූයේ: ${execution.expectedLogs.join(', ')}. ලැබුණේ: ${ctx.logs.join(', ')}`;
                }
            }

            // Set Trace and Start Playing
            setTrace({ steps, success, error });
            setIsPlaying(true);
            return;
        }

        // --- OLD VALIDATION (Sync) ---
        // ... (Keep existing logic for non-execution levels) ... 
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
        setTrace(null);
        setCurrentStep(0);
        setIsPlaying(false);
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

                        {/* IN-PLACE FEEDBACK OVERLAY */}
                        {trace && trace.steps[currentStep] && (
                            (() => {
                                const step = trace.steps[currentStep];
                                const activeNode = nodes.find(n => n.id === step.nodeId);
                                if (!activeNode) return null;

                                // We render a foreign object or just an absolute div on top?
                                // ReactFlow nodes are positioned absolutely. We can just use the node's position relative to viewport?
                                // Actually, ReactFlow handles zoom/pan. Standard absolute div won't work well unless we use <NodeToolbar> or custom overlays.
                                // BUT, we can use the `nodes` state which has `position`. We just need to map that to screen space OR put this inside ReactFlow as a custom layer?
                                // Simplest: Use an absolute div inside the ReactFlow wrapper, but we need to handle zoom/pan. 
                                // Better: Use the `Panel` component from ReactFlow or just render nodes with updated data?
                                // No, let's use a "Panel" but positioned manually? No that's for UI.
                                // Let's use standard absolute positioning using the node's x/y, but we need to account for viewport.
                                // Actually, simpler hack: Render a customized node style? No.

                                // Let's use the React Flow `ViewportPortal` or just render it *inside* ReactFlow children, it moves with the canvas?
                                // Yes, children of <ReactFlow> move with the view if they are Nodes.
                                // But we want a temporary overlay.

                                // Alternative: Update the Active Node's `data` to include the `diff` and have the Custom Node render the badge?
                                // That requires touching CustomNodes.jsx. simpler.
                                // Let's try rendering a simple <div> overlay using `reactFlowInstance.flowToScreenPosition`?
                                // No, because that changes on pan/zoom.

                                // BEST APPROACH: Just update the `activeNode` label for a second? No.
                                // Let's render a "Portal" node that is always at the active node position?
                                // Let's stick to the simplest visual: A Floating Badge centered on the screen? No, user said "in place".

                                // Let's use an absolute div, but we transform it using the viewport?
                                // We can access viewport via `useViewport` hook if we were a child component.
                                // Since we are in the parent, we can read `reactFlowInstance.getViewport()`.

                                const { x, y, zoom } = reactFlowInstance ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 };

                                // Node position is relative to flow (0,0).
                                // Screen Pos = NodePos * zoom + viewportPos
                                const screenX = activeNode.position.x * zoom + x;
                                const screenY = activeNode.position.y * zoom + y;
                                const width = (activeNode.width || 150) * zoom; // Approx

                                const { diff, result } = step;
                                const hasOutput = diff.logs.length > 0;
                                const hasVarChange = Object.keys(diff.vars).length > 0;
                                const isDecision = typeof result === 'boolean';

                                if (!hasOutput && !hasVarChange && !isDecision) return null;

                                return (
                                    <div
                                        className="absolute z-50 pointer-events-none flex flex-col items-center gap-1 animate-in zoom-in-50 slide-in-from-bottom-2 duration-300"
                                        style={{
                                            left: screenX + width / 2,
                                            top: screenY - 20,
                                            transform: 'translate(-50%, -100%)'
                                        }}
                                    >
                                        {hasOutput && (
                                            <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                                                <span>🖨️</span>
                                                <span>{diff.logs.join(', ')}</span>
                                            </div>
                                        )}
                                        {Object.entries(diff.vars).map(([k, v]) => (
                                            <div key={k} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                                                <span>📝</span>
                                                <span>{k} = {v}</span>
                                            </div>
                                        ))}
                                        {isDecision && (
                                            <div className={`${result ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap`}>
                                                <span>{result ? '✅ Yes' : '❌ No'}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        )}
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

                    {/* ACTION BUTTONS & PLAYBACK CONTROLS */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto mt-16">

                        {/* Playback Controls (Visible only when trace exists) */}
                        {trace && (
                            <div className="bg-slate-900/90 text-white p-2 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-right-5 fade-in">
                                <button
                                    onClick={() => {
                                        setIsPlaying(false);
                                        setCurrentStep(s => Math.max(0, s - 1));
                                    }}
                                    disabled={currentStep === 0}
                                    className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"
                                >
                                    <SkipBack size={18} className="fill-white" />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg active:scale-95 transition-all"
                                >
                                    {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white" />}
                                </button>

                                <button
                                    onClick={() => {
                                        setIsPlaying(false);
                                        setCurrentStep(s => Math.min(trace.steps.length - 1, s + 1));
                                    }}
                                    disabled={currentStep >= trace.steps.length - 1}
                                    className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"
                                >
                                    <SkipForward size={18} className="fill-white" />
                                </button>

                                <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                                <button
                                    onClick={() => setPlaybackSpeed(s => s === 800 ? 400 : (s === 400 ? 100 : 800))}
                                    className="flex items-center gap-1 text-xs font-bold font-mono px-2 py-1.5 hover:bg-slate-700 rounded-lg"
                                >
                                    <Gauge size={14} />
                                    <span>{playbackSpeed === 800 ? '1x' : (playbackSpeed === 400 ? '2x' : 'MAX')}</span>
                                </button>
                            </div>
                        )}

                        {/* Main Tools */}
                        <div className="flex gap-2">
                            {!trace && (
                                <button
                                    onClick={checkSolution}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center group"
                                    title="Run Code"
                                >
                                    <Play size={24} className="fill-white group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                            <button
                                onClick={handleReset}
                                className="bg-white hover:bg-slate-50 text-slate-400 p-3 rounded-xl shadow-md border border-slate-200 transition-all active:scale-95"
                                title="Reset Level"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>
                    </div>

                    {/* ADVANCED LIVE CONSOLE */}
                    <div className={`absolute bottom-4 right-4 w-80 bg-slate-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${trace ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                        {/* Tabs/Header */}
                        <div className="bg-slate-800 flex border-b border-slate-700">
                            <div className="px-4 py-2 flex items-center gap-2 border-r border-slate-700 bg-slate-800/50">
                                <Terminal size={14} className="text-emerald-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Console</span>
                            </div>
                            <div className="flex-1 flex items-center justify-end px-4 text-[10px] font-mono text-slate-500">
                                {trace && `STEP ${currentStep + 1} / ${trace.steps.length}`}
                            </div>
                        </div>

                        {/* Output Area */}
                        <div className="grid grid-cols-2 h-48">
                            {/* Logs */}
                            <div className="border-r border-slate-700 flex flex-col">
                                <div className="bg-slate-950/30 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Output</div>
                                <div className="p-3 font-mono text-xs overflow-y-auto flex-1 flex flex-col gap-1 text-slate-300">
                                    {trace && trace.steps[currentStep]?.logs.length === 0 && <span className="text-slate-700 italic">No output</span>}
                                    {trace && trace.steps[currentStep]?.logs.map((log, i) => (
                                        <div key={i} className="text-emerald-400 border-l-2 border-emerald-900 pl-2">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Variables */}
                            <div className="flex flex-col bg-slate-900/50">
                                <div className="bg-slate-950/30 px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">Variables</div>
                                <div className="p-3 font-mono text-xs overflow-y-auto flex-1 flex flex-col gap-2">
                                    {trace && Object.entries(trace.steps[currentStep]?.variables || {}).map(([key, val]) => (
                                        !['logs', 'steps', 'finished'].includes(key) && (
                                            <div key={key} className="flex justify-between items-center border-b border-slate-800 pb-1">
                                                <span className="text-purple-400">{key}</span>
                                                <span className="text-slate-200 font-bold">{val}</span>
                                            </div>
                                        )
                                    ))}
                                    {trace && Object.keys(trace.steps[currentStep]?.variables || {}).filter(k => !['logs', 'steps', 'finished'].includes(k)).length === 0 && (
                                        <span className="text-slate-700 italic">No variables</span>
                                    )}
                                </div>
                            </div>
                        </div>
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

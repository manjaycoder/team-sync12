import { useMemo } from 'react';
import ReactFlow, { Background, Controls, type Node, type Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { Sparkles, Layers, CheckCircle2, UserCheck, Zap } from 'lucide-react';

export const TSWorkflowDiagram = () => {
  const initialNodes: Node[] = useMemo(
    () => [
      {
        id: '1',
        type: 'input',
        data: {
          label: (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09090b] border border-white/20 shadow-xl text-left">
              <div className="p-2 rounded-xl bg-white/10 text-white border border-white/10">
                <Layers size={16} />
              </div>
              <div>
                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                  Phase 01
                </div>
                <div className="text-xs font-bold text-white font-display">Sprint Specification</div>
                <div className="text-[10px] text-neutral-400 font-sans">Scope &amp; milestones</div>
              </div>
            </div>
          ),
        },
        position: { x: 40, y: 120 },
      },
      {
        id: '2',
        data: {
          label: (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09090b] border border-white/20 shadow-xl text-left">
              <div className="p-2 rounded-xl bg-white/10 text-white border border-white/10">
                <UserCheck size={16} />
              </div>
              <div>
                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                  Phase 02
                </div>
                <div className="text-xs font-bold text-white font-display">Capacity Matching</div>
                <div className="text-[10px] text-neutral-400 font-sans">Cross-department sync</div>
              </div>
            </div>
          ),
        },
        position: { x: 280, y: 40 },
      },
      {
        id: '3',
        data: {
          label: (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0e0e12] border border-white/35 shadow-2xl text-left">
              <div className="p-2 rounded-xl bg-white text-black font-bold">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-[9px] font-mono text-white uppercase tracking-widest font-bold">
                  AI Copilot
                </div>
                <div className="text-xs font-bold text-white font-display">Gemini Autonomous Sync</div>
                <div className="text-[10px] text-neutral-300 font-sans">Automated verification</div>
              </div>
            </div>
          ),
        },
        position: { x: 280, y: 200 },
      },
      {
        id: '4',
        data: {
          label: (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#09090b] border border-white/20 shadow-xl text-left">
              <div className="p-2 rounded-xl bg-white/10 text-white border border-white/10">
                <Zap size={16} />
              </div>
              <div>
                <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                  Phase 03
                </div>
                <div className="text-xs font-bold text-white font-display">Kanban Pipeline</div>
                <div className="text-[10px] text-neutral-400 font-sans">Execution &amp; review</div>
              </div>
            </div>
          ),
        },
        position: { x: 540, y: 120 },
      },
      {
        id: '5',
        type: 'output',
        data: {
          label: (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white text-black shadow-2xl text-left">
              <div className="p-2 rounded-xl bg-black text-white">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest font-bold">
                  Delivered
                </div>
                <div className="text-xs font-bold text-black font-display">Production Release</div>
                <div className="text-[10px] text-neutral-700 font-sans">Zero blockers</div>
              </div>
            </div>
          ),
        },
        position: { x: 770, y: 120 },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ffffff' },
      },
      {
        id: 'e1-3',
        source: '1',
        target: '3',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.8)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ffffff' },
      },
      {
        id: 'e2-4',
        source: '2',
        target: '4',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ffffff' },
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.8)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ffffff' },
      },
      {
        id: 'e4-5',
        source: '4',
        target: '5',
        animated: true,
        style: { stroke: '#ffffff', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ffffff' },
      },
    ],
    []
  );

  return (
    <section id="workflow" className="relative py-28 sm:py-36 scroll-mt-20 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium block mb-3">
            Autonomous Pipeline
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            How initiatives advance <span className="aw-text-gradient">from spec to release</span>.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Drag the interactive nodes below to inspect how Team-Sync orchestrates task state machines
            and autonomous Gemini verification in real time.
          </p>
        </div>

        <div className="h-[430px] rounded-3xl border border-white/15 bg-[#050507] overflow-hidden shadow-2xl relative">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/80 backdrop-blur px-3.5 py-1.5 border border-white/10 text-[10px] font-mono text-neutral-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span>INTERACTIVE FLOW GRAPH</span>
          </div>

          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            fitView
            attributionPosition="bottom-right"
            nodesDraggable={true}
            nodesConnectable={false}
            zoomOnScroll={false}
            panOnDrag={true}
          >
            <Background color="#ffffff" gap={24} size={1} />
            <Controls className="!bg-[#0c0c0e] !border-white/15 !fill-white" />
          </ReactFlow>
        </div>
      </div>
    </section>
  );
};

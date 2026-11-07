import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Box,
  Bot,
} from 'lucide-react';
import { TS3DCard } from './TS3DCard';

const WorkspaceModel3D = lazy(() =>
  import('./3d/WorkspaceModel').then((m) => ({ default: m.WorkspaceModel3D }))
);

type DemoTab = 'kanban' | 'copilot' | 'spatial';

interface DemoTask {
  id: string;
  title: string;
  dept: string;
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignee: string;
  avatar: string;
}

const INITIAL_DEMO_TASKS: DemoTask[] = [
  {
    id: 'TS-401',
    title: 'Migrate Core Authentication to Clerk v5 SSO',
    dept: 'Security',
    priority: 'Urgent',
    status: 'IN_PROGRESS',
    assignee: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'TS-402',
    title: 'Deploy 3D Spatial Canvas with Three.js & Fiber',
    dept: 'Frontend',
    priority: 'High',
    status: 'TODO',
    assignee: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'TS-403',
    title: 'Autonomous Daily Standup Synthesizer Engine',
    dept: 'AI Lab',
    priority: 'Normal',
    status: 'DONE',
    assignee: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'TS-404',
    title: 'Real-Time WebSocket Telemetry Metric Stream',
    dept: 'Platform',
    priority: 'High',
    status: 'IN_PROGRESS',
    assignee: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
];

export const TSInteractiveDemo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DemoTab>('kanban');
  const [tasks, setTasks] = useState<DemoTask[]>(INITIAL_DEMO_TASKS);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiOutput, setAiOutput] = useState(
    'Workforce operates at 96% synchronization across all divisions. Engineering moved TS-401 into active review with zero blockers.'
  );

  const cycleStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = t.status === 'TODO' ? 'IN_PROGRESS' : t.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
        return { ...t, status: next };
      })
    );
  };

  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const velocityScore = Math.round(((completedCount * 1.0 + inProgressCount * 0.5) / tasks.length) * 100);

  const triggerPrompt = (promptText: string) => {
    setAiPrompt(promptText);
    setAiThinking(true);
    setAiOutput('Analyzing active workspace graph and cross-department telemetry...');

    setTimeout(() => {
      setAiThinking(false);
      if (promptText.includes('velocity')) {
        setAiOutput(
          `Current velocity calculated at ${velocityScore}%. Completed ${completedCount} deliverables, ${inProgressCount} in motion. Pacing 18% ahead of milestone.`
        );
      } else if (promptText.includes('blocker')) {
        setAiOutput(
          'Zero critical architectural blockers detected across Security, Frontend, and Platform divisions.'
        );
      } else {
        setAiOutput(
          'Standup synthesized: All 4 team leads report optimal capacity. Hand-offs between Design & Engineering are synchronized.'
        );
      }
    }, 700);
  };

  return (
    <section id="demo" className="relative py-28 sm:py-36 scroll-mt-20 bg-black text-white">
      {/* Background illumination */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[850px] rounded-full bg-white/[0.03] blur-[150px]" />
        <div className="absolute inset-0 bg-grid-white opacity-25" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-300 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Live Product Simulator
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Test drive Team-Sync <span className="aw-text-gradient">in real time</span>.
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400 font-sans leading-relaxed">
            Click tasks to cycle through Kanban states, query the Gemini AI copilot, or rotate the 3D
            spatial workspace directly inside this interactive viewport.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="inline-flex rounded-full p-1 bg-white/5 border border-white/10 backdrop-blur-md">
            {[
              { id: 'kanban', label: 'Interactive Kanban', icon: Layers },
              { id: 'copilot', label: 'Gemini Copilot AI', icon: Bot },
              { id: 'spatial', label: '3D Spatial Canvas', icon: Box },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as DemoTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow-lg shadow-white/20'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Real-Time Live Status Pill */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-neutral-400">Velocity:</span>
            <span className="px-2.5 py-1 rounded-full bg-white text-black font-bold text-[11px]">
              {velocityScore}% Score
            </span>
          </div>
        </div>

        {/* 3D Perspective Demo Card */}
        <TS3DCard depth={10} glare={true} className="p-6 sm:p-9 border-white/20 !bg-[#09090b]">
          {/* TAB 1: INTERACTIVE KANBAN SIMULATOR */}
          {activeTab === 'kanban' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white text-black font-bold">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Active Sprint Execution Pipeline
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans">
                      Click any task card below to advance its status and trigger instant telemetry updates.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTasks(INITIAL_DEMO_TASKS)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-neutral-400 hover:text-white transition"
                  title="Reset tasks"
                >
                  <RefreshCw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              {/* 3 Kanban State Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'TODO',
                    label: 'Backlog & To Do',
                    items: tasks.filter((t) => t.status === 'TODO'),
                    color: 'text-neutral-400',
                    dot: 'bg-neutral-500',
                  },
                  {
                    id: 'IN_PROGRESS',
                    label: 'In Motion',
                    items: tasks.filter((t) => t.status === 'IN_PROGRESS'),
                    color: 'text-white',
                    dot: 'bg-white',
                  },
                  {
                    id: 'DONE',
                    label: 'Completed / Shipped',
                    items: tasks.filter((t) => t.status === 'DONE'),
                    color: 'text-neutral-300',
                    dot: 'bg-white',
                  },
                ].map((col) => (
                  <div
                    key={col.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between min-h-[300px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                            {col.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                          {col.items.length}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {col.items.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => cycleStatus(task.id)}
                            className="p-3.5 rounded-xl bg-black border border-white/10 hover:border-white/35 transition cursor-pointer group"
                            title="Click to cycle status"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] font-mono text-neutral-400">{task.id}</span>
                              <span
                                className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                                  task.priority === 'Urgent'
                                    ? 'bg-white/15 text-white border-white/30 font-bold'
                                    : 'bg-white/5 text-neutral-300 border-white/10'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <h4 className="text-xs font-semibold text-white group-hover:text-neutral-200 transition leading-snug">
                              {task.title}
                            </h4>

                            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400">
                              <span className="font-mono">{task.dept}</span>
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={task.avatar}
                                  alt={task.assignee}
                                  className="h-4 w-4 rounded-full object-cover ring-1 ring-white/20"
                                />
                                <span>{task.assignee}</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {col.items.length === 0 && (
                          <div className="py-8 text-center text-[11px] font-mono text-neutral-600 border border-dashed border-white/5 rounded-xl">
                            Empty column
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-[10px] font-mono text-neutral-500 text-center">
                      Click ticket to cycle state
                    </div>
                  </div>
                ))}
              </div>

              {/* Status bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-white" />
                  <span>Interactive Kanban synchronized with simulated WebSockets</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/sign-up')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
                >
                  Deploy live in your workspace <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI COPILOT SIMULATOR */}
          {activeTab === 'copilot' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white text-black font-bold">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Gemini Copilot Autonomous Intelligence
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans">
                      Select sample queries to simulate autonomous executive briefs and workload resolution.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                  GEMINI 1.5 PRO ACTIVE
                </span>
              </div>

              {/* Query Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Synthesize morning executive sync',
                  'Calculate sprint velocity score',
                  'Audit active architectural blockers',
                  'Summarize Engineering division deliverables',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => triggerPrompt(q)}
                    disabled={aiThinking}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      aiPrompt === q
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* AI Output Terminal Box */}
              <div className="p-5 rounded-2xl bg-black border border-white/15 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-2 border-b border-white/10">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    MODEL OUTPUT: GEMINI INTELLIGENCE
                  </span>
                  <span>LATENCY: 42MS</span>
                </div>

                <div className="text-neutral-200 leading-relaxed min-h-[70px]">
                  {aiThinking ? (
                    <div className="flex items-center gap-2 text-white animate-pulse">
                      <Sparkles size={14} className="animate-spin" />
                      <span>Synthesizing organizational knowledge graph...</span>
                    </div>
                  ) : (
                    aiOutput
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
                <span>Natural language context-aware reasoning on real workspace data</span>
                <button
                  type="button"
                  onClick={() => navigate('/sign-up')}
                  className="aw-btn-white !py-2 !px-4 !text-xs"
                >
                  Start using Copilot free <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: 3D SPATIAL CANVAS */}
          {activeTab === 'spatial' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white text-black font-bold">
                    <Box size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Spatial 3D Isometric Board
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans">
                      Rotate and explore the volumetric representation of tasks, columns, and mobile devices.
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  THREE.JS FIBER
                </span>
              </div>

              <div className="h-[360px] w-full rounded-2xl bg-black border border-white/10 overflow-hidden relative">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-xl border border-white/20 animate-spin" />
                    </div>
                  }
                >
                  <WorkspaceModel3D />
                </Suspense>

                <div className="absolute bottom-3 right-3 text-[10px] font-mono bg-black/80 px-2.5 py-1 rounded border border-white/10 text-neutral-400">
                  CLICK &amp; DRAG TO ORBIT
                </div>
              </div>
            </div>
          )}
        </TS3DCard>
      </div>
    </section>
  );
};

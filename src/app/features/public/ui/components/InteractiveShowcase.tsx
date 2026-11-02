import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiCpu,
  FiGrid,
  FiTrendingUp,
  FiRefreshCw,
} from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

type ActiveTab = 'copilot' | 'kanban' | 'telemetry';

interface KanbanTask {
  id: string;
  title: string;
  department: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignee: string;
  avatar: string;
}

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: 'TS-101',
    title: 'Architect Real-Time WebSocket Sync Gateway',
    department: 'Engineering',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignee: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'TS-102',
    title: 'Conduct Multi-Department Q3 Sprint Retrospective',
    department: 'Product Core',
    priority: 'MEDIUM',
    status: 'TODO',
    assignee: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'TS-103',
    title: 'Deploy Gemini AI Workspace Briefing Synthesizer',
    department: 'AI Ops',
    priority: 'HIGH',
    status: 'DONE',
    assignee: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'TS-104',
    title: 'Design Obsidian Dark Mode Component Library',
    department: 'Design System',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    assignee: 'Liam Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
];

export const InteractiveShowcase = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('copilot');
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string>(
    'Good morning! All 4 sprint initiatives are progressing cleanly. Engineering has moved TS-101 to active review. No blockers flagged in the last 12 hours.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentCardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleTaskStatusCycle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextStatus =
          t.status === 'TODO' ? 'IN_PROGRESS' : t.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleSimulateAiPrompt = (promptText: string) => {
    setAiPrompt(promptText);
    setIsSynthesizing(true);
    setAiResponse('Analyzing workspace graph and department state...');

    setTimeout(() => {
      setIsSynthesizing(false);
      if (promptText.includes('velocity')) {
        setAiResponse(
          'Sprint velocity is 94.8% (+18.4% WoW). Engineering resolved 14 issues, Design completed 8 tokens, and Operations cleared all handoff bottlenecks.'
        );
      } else if (promptText.includes('blocker')) {
        setAiResponse(
          'Zero critical blockers detected. 1 moderate advisory: TS-102 (Sprint Retrospective) is scheduled for Thursday and awaiting department head sign-off.'
        );
      } else {
        setAiResponse(
          'Workspace alignment matrix is 98% synchronized across Engineering, Product, and Design. Team-Sync Copilot generated recommendations for upcoming Q4 targets.'
        );
      }
    }, 850);
  };

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative scroll-mt-24 py-24 sm:py-36 bg-[#070a12] text-white overflow-hidden"
    >
      {/* Background illumination */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute top-1/2 right-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-grid-white opacity-25" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 backdrop-blur-md">
            <FiCpu className="text-cyan-400" />
            <span>INTERACTIVE WORKSPACE SIMULATOR</span>
          </div>

          <h2 className="mt-6 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Experience Team-Sync in Action.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-sans">
            Test the real interactive capabilities right here. Switch tabs to explore the Gemini AI
            Copilot, agile Kanban flow, and cross-department telemetry.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 shadow-2xl backdrop-blur-xl">
            {[
              { id: 'copilot' as ActiveTab, label: 'Gemini AI Copilot', icon: FiCpu },
              { id: 'kanban' as ActiveTab, label: 'Interactive Kanban', icon: FiGrid },
              { id: 'telemetry' as ActiveTab, label: 'Org Telemetry', icon: FiTrendingUp },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-cursor="pointer"
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30 scale-100'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Stage */}
        <div
          ref={contentCardRef}
          className="mt-8 rounded-3xl border border-white/15 bg-slate-950/80 p-5 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl"
        >
          {/* TAB 1: GEMINI AI COPILOT */}
          {activeTab === 'copilot' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <FiCpu size={18} />
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">
                      Executive Morning AI Briefing &amp; Query Engine
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-sans">
                    Context-aware intelligence connected to your projects, tasks, and team activity.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    GEMINI ENGINE CONNECTED
                  </span>
                </div>
              </div>

              {/* Sample Prompts Pills */}
              <div>
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
                  Try a simulated executive prompt:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Summarize sprint velocity & deliverables',
                    'Spot blocked tasks across departments',
                    'Check Q3 engineering readiness',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSimulateAiPrompt(prompt)}
                      data-cursor="pointer"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-white transition-all"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Briefing Display Box */}
              <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-slate-900/60 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
                    <FiRefreshCw className={`text-indigo-400 ${isSynthesizing ? 'animate-spin' : ''}`} />
                    <span>SYNTHESIZED EXECUTIVE BRIEFING</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">TIMESTAMP: JUST NOW</span>
                </div>

                <div className="min-h-[70px] flex flex-col justify-center">
                  {aiPrompt && (
                    <p className="text-xs font-mono text-cyan-400 mb-1">
                      Query: &ldquo;{aiPrompt}&rdquo;
                    </p>
                  )}
                  <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-sans">
                    {aiResponse}
                  </p>
                </div>

                {/* Velocity & Dept Health Pills */}
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                    <p className="text-[10px] font-mono text-slate-400">ORGANIZATION VELOCITY</p>
                    <p className="text-base font-bold text-indigo-300 mt-0.5">94 / 100 Optimal</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                    <p className="text-[10px] font-mono text-slate-400">ENGINEERING HEALTH</p>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">100% On-Track</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                    <p className="text-[10px] font-mono text-slate-400">BLOCKER RESOLUTION</p>
                    <p className="text-base font-bold text-cyan-300 mt-0.5">Avg. 1.4 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE KANBAN BOARD */}
          {activeTab === 'kanban' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Live Sprint Execution Kanban
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Click any task card to transition its stage (To Do &rarr; In Progress &rarr; Done).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    {tasks.filter((t) => t.status === 'DONE').length} of {tasks.length} Completed
                  </span>
                </div>
              </div>

              {/* 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    status: 'TODO' as const,
                    title: 'To Do',
                    tone: 'text-amber-400 border-amber-500/30',
                    dot: 'bg-amber-400',
                  },
                  {
                    status: 'IN_PROGRESS' as const,
                    title: 'In Progress',
                    tone: 'text-indigo-400 border-indigo-500/30',
                    dot: 'bg-indigo-400',
                  },
                  {
                    status: 'DONE' as const,
                    title: 'Completed',
                    tone: 'text-emerald-400 border-emerald-500/30',
                    dot: 'bg-emerald-400',
                  },
                ].map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col.status);
                  return (
                    <div
                      key={col.status}
                      className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 min-h-[280px] flex flex-col"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            {col.title}
                          </span>
                        </div>
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                          {colTasks.length}
                        </span>
                      </div>

                      {/* Task Cards in this Column */}
                      <div className="space-y-3 flex-1">
                        {colTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleTaskStatusCycle(task.id)}
                            data-cursor="pointer"
                            className="group rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-indigo-400/50 hover:bg-white/[0.06] transition-all cursor-pointer shadow-md select-none"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                {task.id}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${task.priority === 'HIGH'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-white leading-snug">
                              {task.title}
                            </p>

                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
                              <span className="font-mono">{task.department}</span>
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={task.avatar}
                                  alt={task.assignee}
                                  className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                                />
                                <span className="hidden sm:inline">{task.assignee}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ORG TELEMETRY & ALIGNMENT */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Cross-Department Velocity &amp; Workload Matrix
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Real-time synchronization metrics across teams and initiatives.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400">Live Telemetry Graph</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    dept: 'Engineering & Core Tech',
                    tasksActive: 18,
                    velocity: '98%',
                    status: 'Optimal',
                    color: 'from-indigo-500 to-indigo-700',
                  },
                  {
                    dept: 'Product & Architecture',
                    tasksActive: 12,
                    velocity: '92%',
                    status: 'Optimal',
                    color: 'from-cyan-500 to-cyan-700',
                  },
                  {
                    dept: 'Design Systems & UI',
                    tasksActive: 9,
                    velocity: '89%',
                    status: 'In Sync',
                    color: 'from-violet-500 to-violet-700',
                  },
                ].map((item) => (
                  <div
                    key={item.dept}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-sans">{item.dept}</span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400">ACTIVE INITIATIVES</p>
                        <p className="text-2xl font-display font-extrabold text-white mt-1">
                          {item.tasksActive}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-400">VELOCITY RATE</p>
                        <p className="text-2xl font-mono font-bold text-indigo-400 mt-1">
                          {item.velocity}
                        </p>
                      </div>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        style={{ width: item.velocity }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

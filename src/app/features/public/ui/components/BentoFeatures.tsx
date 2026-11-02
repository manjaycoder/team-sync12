import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiCpu,
  FiCheck,
} from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

export const BentoFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Interactive Checklist Demo State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm sprint release scope with Engineering', done: true },
    { id: 2, text: 'Synchronize Design token library updates', done: true },
    { id: 3, text: 'Conduct executive AI velocity review', done: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: idx * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative scroll-mt-24 py-24 sm:py-36 bg-[#090d16] text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            ENGINEERED FOR EVERYDAY TEAMWORK
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Everything your team needs to keep work moving.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            A cohesive suite designed for planning delivery, coordinating people, and staying
            informed from kickoff to completion.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 (Span 2): Projects and task boards */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 shadow-xl"
            data-cursor="view"
            data-cursor-text="BOARDS"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <FiGrid size={22} />
              </span>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 font-mono text-xs font-semibold text-indigo-300 border border-indigo-500/20">
                MULTI-VIEW ENGINE
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white">
              Projects and Task Boards
            </h3>
            <p className="mt-2 text-sm text-slate-300 font-sans max-w-xl">
              Plan work by project and move tasks through Kanban, list, and calendar views. Set
              owners, priorities, and due dates so the next step is always clear.
            </p>

            {/* Interactive Visual Element: View Selector Preview */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-600 px-2 py-0.5 text-white font-bold">KANBAN</span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-slate-400">LIST</span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-slate-400">TIMELINE</span>
                </div>
                <span>4 ACTIVE TASKS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
                {[
                  { name: 'Core API Integration', priority: 'HIGH', stage: 'IN PROGRESS' },
                  { name: 'Design Sprint Assets', priority: 'MEDIUM', stage: 'REVIEW' },
                  { name: 'Deploy Prod Ingress', priority: 'HIGH', stage: 'DONE' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
                      <span>{item.priority}</span>
                      <span className="text-indigo-300">{item.stage}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 (Span 1): AI Workspace Copilot */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/80 shadow-xl flex flex-col justify-between"
            data-cursor="view"
            data-cursor-text="AI"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FiCpu size={22} />
                </span>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-300 border border-cyan-500/20">
                  GEMINI ACTIVE
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">AI Workspace Copilot</h3>
              <p className="mt-2 text-sm text-slate-300 font-sans">
                Ask questions about workspace activity and receive automated synthesis, task planning
                assistance, and morning briefings.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-black/50 p-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>COPILOT INTELLIGENCE</span>
              </div>
              <p className="text-xs text-slate-200 italic font-sans leading-relaxed">
                &ldquo;Engineering sprint velocity increased +18.4%. No unassigned tasks
                detected.&rdquo;
              </p>
            </div>
          </div>

          {/* Card 3 (Span 1): People and departments */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 shadow-xl"
            data-cursor="view"
            data-cursor-text="TEAMS"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <FiUsers size={22} />
              </span>
              <span className="text-xs font-mono text-slate-400">ORG MATRIX</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white">People &amp; Departments</h3>
            <p className="mt-2 text-sm text-slate-300 font-sans">
              Keep employee profiles and department information organized. See who is responsible
              for work across your teams without chasing status.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces',
                ].map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt="Team member"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-900"
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-slate-400">+28 Across 5 Teams</span>
            </div>
          </div>

          {/* Card 4 (Span 1): Progress at a glance */}
          <div
            ref={(el) => { cardsRef.current[3] = el; }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 shadow-xl"
            data-cursor="view"
            data-cursor-text="KPIs"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FiCalendar size={22} />
              </span>
              <span className="text-xs font-mono text-emerald-400">98% ON-TIME</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white">Progress at a Glance</h3>
            <p className="mt-2 text-sm text-slate-300 font-sans">
              Use the unified overview to review task velocity, upcoming deadlines, department
              throughput, and work that needs priority attention.
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Sprint Goal Completion</span>
                <span className="text-emerald-400 font-bold">92%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-[92%]" />
              </div>
            </div>
          </div>

          {/* Card 5 (Span 1): Collaboration in context */}
          <div
            ref={(el) => { cardsRef.current[4] = el; }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 shadow-xl"
            data-cursor="view"
            data-cursor-text="SYNC"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                <FiMessageSquare size={22} />
              </span>
              <span className="text-xs font-mono text-slate-400">INTERACTIVE CHECKLIST</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white">Collaboration in Context</h3>
            <p className="mt-2 text-sm text-slate-300 font-sans">
              Keep comments, replies, and task checklists directly alongside project work, making
              handoffs seamless.
            </p>

            {/* Interactive Checklist simulation */}
            <div className="mt-5 space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  data-cursor="pointer"
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2 hover:bg-white/[0.05] cursor-pointer transition-colors"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs transition-colors ${
                      item.done
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <FiCheck size={12} />
                  </span>
                  <span
                    className={`text-xs font-sans transition-colors ${
                      item.done ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

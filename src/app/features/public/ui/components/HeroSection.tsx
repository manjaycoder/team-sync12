import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiArrowRight,
  FiArrowDown,
  FiShield,
  FiZap,
  FiCpu,
  FiTrendingUp,
  FiCheckCircle,
  FiLayers,
} from 'react-icons/fi';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const floatingPill1 = useRef<HTMLDivElement>(null);
  const floatingPill2 = useRef<HTMLDivElement>(null);

  const primaryBtnRef = useMagnetic<HTMLButtonElement>({ strength: 0.3 });
  const secondaryBtnRef = useMagnetic<HTMLAnchorElement>({ strength: 0.3 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Entrance Timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.7'
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          mockupRef.current,
          { opacity: 0, y: 60, scale: 0.95, rotateX: 12 },
          { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.2, ease: 'power3.out' },
          '-=0.8'
        );

      // Floating chips gentle float animation
      if (floatingPill1.current && floatingPill2.current) {
        gsap.to(floatingPill1.current, {
          y: -14,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to(floatingPill2.current, {
          y: 12,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }

      // Parallax scroll on hero preview mockup
      if (mockupRef.current) {
        gsap.to(mockupRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: 120,
          scale: 0.96,
          opacity: 0.85,
        });
      }
    }, heroRef);

    // Mouse tilt effect on hero mockup
    const handleMouseMove = (e: MouseEvent) => {
      if (!mockupRef.current || window.innerWidth < 1024) return;
      const rect = mockupRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(mockupRef.current, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.8,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-32 bg-[#090d16] text-white"
    >
      {/* Aurora mesh gradients and noise background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-tr from-indigo-600/25 via-violet-600/15 to-cyan-500/20 blur-[130px] opacity-70" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute inset-0 bg-grid-white opacity-40" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-indigo-300 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            <span>NEXT-GEN WORKSPACE OPERATING SYSTEM</span>
          </div>

          {/* Master Headline */}
          <h1
            ref={headlineRef}
            className="mt-8 max-w-5xl font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04]"
          >
            Less chasing updates.{' '}
            <span className="text-gradient-aurora block sm:inline">
              More meaningful progress.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-sans"
          >
            Team-Sync brings projects, tasks, departments, and Gemini AI copilot intelligence into
            one fluid interface. Experience unified clarity from roadmaps to daily delivery.
          </p>

          {/* CTA Button Row */}
          <div
            ref={ctaGroupRef}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              ref={primaryBtnRef}
              type="button"
              onClick={() => navigate('/register')}
              data-cursor="pointer"
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-105"
            >
              <span>Create your workspace</span>
              <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>

            <a
              ref={secondaryBtnRef}
              href="#showcase"
              data-cursor="pointer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white shadow-lg backdrop-blur-lg transition-all duration-300 hover:bg-white/[0.12] hover:border-white/30"
            >
              <span>Live Interactive Simulator</span>
              <FiArrowDown className="text-base text-cyan-400 animate-bounce" />
            </a>
          </div>

          {/* Trust reassurance */}
          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-slate-400">
            <FiShield className="text-emerald-400" />
            <span>Enterprise-Grade Encryption • Private Workspace Isolation</span>
          </div>
        </div>

        {/* 3D Perspective Live Product Window Showcase */}
        <div className="relative mt-16 sm:mt-24 mx-auto max-w-5xl">
          {/* Ambient rim glow behind the window */}
          <div className="absolute -inset-4 sm:-inset-8 rounded-[2.5rem] bg-gradient-to-b from-indigo-500/30 via-cyan-500/10 to-transparent blur-2xl -z-10" />

          {/* Floating Telemetry Pill 1: AI Velocity */}
          <div
            ref={floatingPill1}
            className="absolute -top-6 -left-4 sm:-left-12 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
            data-cursor="view"
            data-cursor-text="VELOCITY"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <FiTrendingUp size={20} />
            </div>
            <div className="text-left font-mono">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Sprint Velocity</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>94.8%</span>
                <span className="text-[10px] text-emerald-400 font-semibold">+18.4%</span>
              </p>
            </div>
          </div>

          {/* Floating Telemetry Pill 2: AI Copilot */}
          <div
            ref={floatingPill2}
            className="absolute -bottom-6 -right-4 sm:-right-10 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl"
            data-cursor="view"
            data-cursor-text="GEMINI"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <FiCpu size={20} />
            </div>
            <div className="text-left font-mono">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">AI Executive Briefing</p>
              <p className="text-xs font-semibold text-cyan-300">Synchronized 2m ago</p>
            </div>
          </div>

          {/* Main App Mockup Frame */}
          <div
            ref={mockupRef}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-950/90 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Window Title Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 hidden sm:inline-block font-mono text-[11px] text-slate-400">
                  team-sync.enterprise/workspace/overview
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE WORKSPACE
                </span>
              </div>
            </div>

            {/* Mockup Dashboard Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Executive Morning Briefing Preview Card */}
              <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-slate-950/70 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                      <FiZap size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">Executive Morning AI Briefing</h4>
                        <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-mono text-indigo-300">
                          GEMINI 2.5
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        &quot;Cross-department handoffs between Design &amp; Engineering are pacing 18% ahead of schedule with zero critical blockers.&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-indigo-300">
                      94/100 VELOCITY
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Interactive KPI Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    title: 'Active Projects',
                    stat: '12 Roadmap Initiatives',
                    accent: 'border-indigo-500/40',
                    dot: 'bg-indigo-400',
                  },
                  {
                    title: 'Kanban Tasks in Motion',
                    stat: '48 Tasks On-Track',
                    accent: 'border-cyan-500/40',
                    dot: 'bg-cyan-400',
                  },
                  {
                    title: 'Department Sync',
                    stat: '100% Team Alignment',
                    accent: 'border-emerald-500/40',
                    dot: 'bg-emerald-400',
                  },
                ].map((col) => (
                  <div
                    key={col.title}
                    className={`rounded-2xl border ${col.accent} bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.04]`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                      <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                        {col.title}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">{col.stat}</p>
                  </div>
                ))}
              </div>

              {/* Kanban Task Pipeline Mini-Stream */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-2">
                    <FiLayers className="text-indigo-400" />
                    SPRINT PIPELINE
                  </span>
                  <span>3 / 3 STAGES COMPLETED</span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {[
                    {
                      name: 'Deploy Real-Time Department Telemetry Engine',
                      dept: 'Engineering',
                      status: 'COMPLETED',
                      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                    },
                    {
                      name: 'Coordinate High-Priority Q3 Milestone Deliverables',
                      dept: 'Product Core',
                      status: 'IN PROGRESS',
                      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
                    },
                    {
                      name: 'Review Executive Copilot Morning Summary Protocols',
                      dept: 'Operations',
                      status: 'OPTIMIZED',
                      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
                    },
                  ].map((task) => (
                    <div
                      key={task.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FiCheckCircle className="text-indigo-400 shrink-0" />
                        <span className="text-xs font-medium text-slate-200">{task.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">{task.dept}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-semibold border ${task.color}`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

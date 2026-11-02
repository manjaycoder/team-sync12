import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCheckCircle, FiCompass, FiActivity, FiZap } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const workflowSteps = [
  {
    number: '01',
    title: 'Plan together',
    description:
      'Organize projects and break high-level roadmap goals into clear, assignable tasks with deadlines, owners, and tags.',
    icon: FiCompass,
    detail: 'Automated milestone decomposition & role allocation',
    badge: 'PHASE 01: ROADMAP',
    accent: 'from-indigo-500 to-indigo-700',
  },
  {
    number: '02',
    title: 'Stay aligned',
    description:
      'See progress across departments in real time. Keep files, context, decisions, and discussions directly on the work.',
    icon: FiActivity,
    detail: 'Zero fragmented Slack threads or lost handoffs',
    badge: 'PHASE 02: SYNC',
    accent: 'from-cyan-500 to-cyan-700',
  },
  {
    number: '03',
    title: 'Deliver with focus',
    description:
      'Update work dynamically as it moves through Kanban stages. Leverage the Gemini AI Copilot to spot blockers before delays occur.',
    icon: FiZap,
    detail: '3.8x faster delivery cycles with AI oversight',
    badge: 'PHASE 03: SHIP',
    accent: 'from-violet-500 to-violet-700',
  },
];

export const WorkflowTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Line scroll fill effect
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      // Staggered step reveals
      stepsRef.current.forEach((step, idx) => {
        if (!step) return;
        gsap.fromTo(
          step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: idx * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
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
      id="how-it-works"
      ref={containerRef}
      className="relative scroll-mt-24 py-24 sm:py-36 bg-[#070a12] text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
            A SIMPLE RHYTHM
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            From scattered work to shared momentum.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Eliminate communication fragmentation. Move teams in complete unison from kickoff
            through final release.
          </p>
        </div>

        {/* Animated Connecting Line (Desktop) */}
        <div className="relative mt-20 hidden md:block">
          <div className="h-[2px] w-full bg-white/10" />
          <div
            ref={lineRef}
            className="absolute top-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500 shadow-lg shadow-indigo-500/50"
          />
        </div>

        {/* 3 Step Cards */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                ref={(el) => { stepsRef.current[idx] = el; }}
                className="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/70 shadow-xl flex flex-col justify-between"
                data-cursor="view"
                data-cursor-text={step.number}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-black text-4xl text-white/20 group-hover:text-indigo-400/80 transition-colors">
                      {step.number}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] text-slate-400 border border-white/10">
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white">{step.title}</h3>
                  </div>

                  <p className="text-sm text-slate-300 font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <FiCheckCircle className="text-cyan-400 shrink-0" />
                  <span>{step.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

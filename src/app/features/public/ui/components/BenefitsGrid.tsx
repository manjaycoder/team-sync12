import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiTarget, FiUsers, FiZap, FiCheckCircle } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: FiTarget,
    title: 'Make priorities visible',
    description:
      'Keep projects, tasks, owners, and deadlines together so everyone knows what matters next without ambiguity.',
    stat: '100% Clarity',
    metric: 'Zero orphaned initiatives across teams',
    accent: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
  },
  {
    icon: FiUsers,
    title: 'Bring teams into sync',
    description:
      'Connect people and departments around shared work instead of scattered updates in separate siloed tools.',
    stat: '3.8x Handoffs',
    metric: 'Faster cross-department coordination',
    accent: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  },
  {
    icon: FiZap,
    title: 'Move work forward',
    description:
      'Track work through clear stages, spot blockers early, and use Gemini AI assistance when you need a strategic starting point.',
    stat: '94% Velocity',
    metric: 'Average sprint resolution rate',
    accent: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  },
];

export const BenefitsGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
            delay: idx * 0.15,
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
      id="platform"
      ref={containerRef}
      className="relative scroll-mt-24 py-24 sm:py-36 bg-[#090d16] text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400">
              THE VALUE OF ALIGNMENT
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              The context to do your best work.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            When teams share a clear view of goals and ownership, collaboration gets simpler.
            Team-Sync gives the work a home from kickoff through delivery.
          </p>
        </div>

        {/* 3 Asymmetric Benefit Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                ref={(el) => { cardsRef.current[idx] = el; }}
                className="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-slate-900/70 shadow-xl flex flex-col justify-between"
                data-cursor="view"
                data-cursor-text="VALUE"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${benefit.accent}`}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="font-mono text-xl font-bold text-white tracking-tight">
                      {benefit.stat}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm text-slate-300 font-sans leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <FiCheckCircle className="text-indigo-400 shrink-0" />
                  <span>{benefit.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

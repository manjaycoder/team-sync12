import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Users, Layers, Zap, Brain, BarChart3, Shield, ArrowRight
} from 'lucide-react';
import { TS3DCard } from './TS3DCard';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Layers,
    title: 'Dynamic Kanban Pipeline',
    description: 'Track deliverables across sprint stages with live drag-and-drop state machines, automated stage triggers, and SLA tracking.',
    tags: ['Kanban', 'Sprint Workflows', 'Milestones'],
  },
  {
    icon: Users,
    title: 'Enterprise Org Matrix',
    description: 'Map cross-department capacity, identify personnel bottlenecks, and synchronize roles with role-based access control.',
    tags: ['Workforce', 'Capacity Map', 'Audit Trail'],
  },
  {
    icon: Brain,
    title: 'Gemini Autonomous AI',
    description: 'Integrated intelligence that synthesizes daily standup briefs, evaluates sprint workload distribution, and auto-resolves tasks.',
    tags: ['AI Briefs', 'Smart Auto-Solve', 'Copilot'],
    highlight: true,
  },
  {
    icon: BarChart3,
    title: 'Velocity Telemetry Matrix',
    description: 'Real-time throughput metrics, burndown projections, and completion accuracy tracking across all engineering divisions.',
    tags: ['Throughput', 'Accuracy', 'Telemetry'],
  },
  {
    icon: Zap,
    title: 'Instant Event Synchronization',
    description: 'Sub-millisecond state updates powered by real-time WebSockets. Every ticket transition is broadcast to the entire team.',
    tags: ['Real-Time', 'Low Latency', 'WebSockets'],
  },
  {
    icon: Shield,
    title: 'SOC2 & Clerk Governance',
    description: 'Enterprise authentication with Clerk v5, Multi-Factor Authentication (MFA), hardware security keys, and tamper-proof logs.',
    tags: ['Clerk Identity', 'SSO / MFA', 'SOC2 Compliant'],
  },
];

export const TSFeatures = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            delay: (i % 3) * 0.08,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 sm:py-36 scroll-mt-24 bg-black text-white overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-white/[0.02] blur-[150px]" />
        <div className="absolute inset-0 bg-grid-white opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium block mb-3">
              Platform Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Engineered for teams that{' '}
              <span className="aw-text-gradient">ship without pause</span>.
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400 font-sans leading-relaxed">
            Every feature is purpose-built to eliminate coordination overhead. Experience a frictionless
            blend of precision project tooling and autonomous AI.
          </p>
        </div>

        {/* 3D Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
              >
                <TS3DCard
                  depth={12}
                  className={`p-7 h-full flex flex-col justify-between group hover:border-white/30 transition-all ${
                    feature.highlight ? 'border-white/25 bg-[#0e0e12]' : ''
                  }`}
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/15 text-white group-hover:bg-white group-hover:text-black transition-all">
                        <Icon size={20} />
                      </div>
                      {feature.highlight && (
                        <span className="text-[9px] font-mono uppercase tracking-widest bg-white text-black font-extrabold px-2.5 py-1 rounded-full">
                          AI CORE
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-lg font-bold text-white mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans mb-6">
                      {feature.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full text-[10px] font-mono px-2.5 py-0.5 border border-white/10 bg-white/5 text-neutral-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TS3DCard>
              </div>
            );
          })}
        </div>

        {/* Closing Action Pill */}
        <div className="mt-14 rounded-3xl border border-white/15 bg-white/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div>
            <h4 className="text-base font-bold text-white font-display">
              Ready to explore live capabilities?
            </h4>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Test drive the interactive Kanban pipeline and AI Copilot simulator directly below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="aw-btn-white text-xs px-6 py-2.5 shrink-0"
          >
            <span>Launch Live Demo</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

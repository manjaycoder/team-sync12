import { useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight, Play, Users, Zap, Shield, TrendingUp } from 'lucide-react';
import { TS3DCard } from './TS3DCard';

const CollaborationNetwork3D = lazy(() =>
  import('./3d/CollaborationNetwork').then((m) => ({ default: m.CollaborationNetwork3D }))
);

const stats = [
  { label: 'Teams Synchronized', value: '10,000+', icon: Users },
  { label: 'Tasks Shipped Daily', value: '250K+', icon: Zap },
  { label: 'System SLA Uptime', value: '99.99%', icon: Shield },
  { label: 'Velocity Multiplier', value: '3.8×', icon: TrendingUp },
];

export const TSHero = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(
        headRef.current,
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }
      )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-36 flex flex-col justify-center bg-black text-white"
    >
      {/* Editorial background lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle white radial lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-white/[0.04] blur-[140px]" />
        <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-white/[0.025] blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-white/[0.03] blur-[120px]" />

        {/* Minimalist fine grid */}
        <div className="absolute inset-0 bg-grid-white opacity-40" />

        {/* Noise grain texture */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Minimalist Eyebrow */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-300 font-medium">
                Autonomous Team Synchronization
              </span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headRef}
              className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[0.98]"
            >
              Workflows{' '}
              <span className="aw-text-gradient">reimagined</span>.
              <br />
              Zero friction.
            </h1>

            {/* Subheading */}
            <p
              ref={subRef}
              className="mt-6 text-base sm:text-lg text-neutral-400 font-sans leading-relaxed max-w-xl"
            >
              Team-Sync unifies your engineering deliverables, departments, and Gemini AI copilot into
              one high-velocity spatial ecosystem. No fragmented apps.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/sign-up')}
                className="aw-btn-white text-sm px-7 py-3.5"
              >
                <span>Deploy workspace</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="aw-btn-ghost text-sm px-6 py-3.5"
              >
                <Play size={13} className="text-white" />
                <span>Live Interactive Demo</span>
              </button>
            </div>

            {/* Trust Proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&auto=format&fit=crop&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-black object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="text-xs text-neutral-400 font-sans">
                <span className="text-white font-semibold">10,000+ teams</span> synchronized daily
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Perspective Card with Three.js Collaboration Graph */}
          <div className="lg:col-span-5 relative w-full h-[420px] sm:h-[480px]">
            <TS3DCard depth={18} glare={true} className="h-full w-full !bg-[#08080a] border-white/15">
              <div className="relative h-full w-full flex flex-col justify-between p-6">
                {/* 3D Header chip */}
                <div className="flex items-center justify-between z-20">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-mono font-semibold text-white tracking-wider uppercase backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    3D Neural Network
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    INTERACTIVE 3D
                  </span>
                </div>

                {/* Embedded 3D Canvas */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border border-white/20 animate-spin" />
                      </div>
                    }
                  >
                    <CollaborationNetwork3D />
                  </Suspense>
                </div>

                {/* 3D Footer status */}
                <div className="z-20 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>ORBIT &amp; TILT MOUSE</span>
                  <span className="text-white font-bold">100% ALIGNED</span>
                </div>
              </div>
            </TS3DCard>
          </div>
        </div>

        {/* Minimalist Monochromatic Metric Strip */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="aw-card-3d !p-5 flex flex-col justify-between group hover:border-white/30 transition-all"
              >
                <div className="flex items-center justify-between text-neutral-400 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider">{stat.label}</span>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon size={14} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-display tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            onComplete,
          });
        },
      });

      // Animate SVG Logo stroke
      if (logoPathRef.current) {
        const length = logoPathRef.current.getTotalLength() || 200;
        gsap.set(logoPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        tl.to(logoPathRef.current, {
          strokeDashoffset: 0,
          duration: 1.0,
          ease: 'power2.inOut',
        }, 0.1);
      }

      // Staggered text entrance
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        0.2
      );

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0.4
      );

      // Percentage counter animation (0 to 100)
      const counterObj = { value: 0 };
      tl.to(
        counterObj,
        {
          value: 100,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            const currentVal = Math.round(counterObj.value);
            setPercent(currentVal);
          },
        },
        0.1
      );

      // Progress bar line
      if (progressBarRef.current) {
        tl.to(
          progressBarRef.current,
          {
            width: '100%',
            duration: 1.3,
            ease: 'power2.out',
          },
          0.1
        );
      }

      // Brief hold before curtain exit
      tl.to({}, { duration: 0.2 });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#070a12] p-8 text-white select-none overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[120px] animate-pulse-ring" />
        <div className="h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Top Header info */}
      <div className="w-full max-w-6xl flex items-center justify-between text-xs font-mono tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          <span>TEAM-SYNC SYSTEM INITIALIZATION</span>
        </div>
        <div className="hidden sm:block">EST. 2026 // ENTERPRISE AI SUITE</div>
      </div>

      {/* Center Brand Monogram & Title */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl">
          <svg className="h-full w-full" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="url(#preloader-grad)" fillOpacity="0.15" />
            <path
              ref={logoPathRef}
              d="M14 16H34M24 16V36M16 32L32 32"
              stroke="#6366f1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="preloader-grad" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-md -z-10" />
        </div>

        <h1
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
        >
          Team-Sync
        </h1>
        <p
          ref={subtitleRef}
          className="mt-2 text-sm sm:text-base font-sans tracking-wide text-slate-400"
        >
          Synchronizing Workspace Intelligence & Execution
        </p>
      </div>

      {/* Bottom Progress Counter & Bar */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="flex items-baseline justify-between font-mono text-xs text-slate-400">
          <span className="tracking-widest uppercase">Booting Core Engine</span>
          <span ref={counterRef} className="text-sm font-semibold text-indigo-400">
            {percent.toString().padStart(2, '0')}%
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-0 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-300"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>AI COPILOT: READY</span>
          <span>KANBAN FLOW: SYNCD</span>
        </div>
      </div>
    </div>
  );
};


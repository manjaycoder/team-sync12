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
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black p-8 text-white select-none overflow-hidden selection:bg-white selection:text-black"
      style={{ willChange: 'transform' }}
    >
      {/* Ambient background glow & grid matching landing page */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-[140px]" />
        <div className="absolute inset-0 bg-grid-white opacity-35" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Top Header info */}
      <div className="w-full max-w-6xl flex items-center justify-between text-xs font-mono tracking-wider text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-ping" />
          <span>TEAM-SYNC SYSTEM INITIALIZATION</span>
        </div>
        <div className="hidden sm:block">EST. 2026 // ENTERPRISE AI SUITE</div>
      </div>

      {/* Center Brand Monogram & Title */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
          <svg className="h-full w-full" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#ffffff" fillOpacity="0.08" />
            <path
              ref={logoPathRef}
              d="M14 16H34M24 16V36M16 32L32 32"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute -inset-1 rounded-2xl bg-white/10 blur-md -z-10" />
        </div>

        <h1
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
        >
          Team-Sync
        </h1>
        <p
          ref={subtitleRef}
          className="mt-2 text-sm sm:text-base font-sans tracking-wide text-neutral-400"
        >
          Synchronizing Workspace Intelligence & Execution
        </p>
      </div>

      {/* Bottom Progress Counter & Bar */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="flex items-baseline justify-between font-mono text-xs text-neutral-400">
          <span className="tracking-widest uppercase">Booting Core Engine</span>
          <span ref={counterRef} className="text-sm font-semibold text-white">
            {percent.toString().padStart(2, '0')}%
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            ref={progressBarRef}
            className="h-full w-0 bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-neutral-500">
          <span>AI COPILOT: READY</span>
          <span>KANBAN FLOW: SYNCD</span>
        </div>
      </div>
    </div>
  );
};


import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

export const CTASection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const registerBtnRef = useMagnetic<HTMLButtonElement>({ strength: 0.3 });
  const signinBtnRef = useMagnetic<HTMLButtonElement>({ strength: 0.25 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-team-sync"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24 sm:py-36 bg-[#090d16] text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070a12] p-8 sm:p-16 lg:p-20 text-center shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl"
        >
          {/* Ambient Concentric Aurora Rings */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-indigo-500/20 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-20" />

          <div className="relative mx-auto max-w-3xl">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>MAKE ROOM FOR MEANINGFUL PROGRESS</span>
            </div>

            {/* Headline */}
            <h2 className="mt-8 font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Give good work a{' '}
              <span className="text-gradient-aurora block sm:inline">better way forward.</span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Bring your projects and people together in a workspace built for clarity,
              coordination, and focused delivery. Start in seconds with your team.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                ref={registerBtnRef}
                type="button"
                onClick={() => navigate('/register')}
                data-cursor="pointer"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 px-9 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
              >
                <span>Get started free</span>
                <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                ref={signinBtnRef}
                type="button"
                onClick={() => navigate('/login')}
                data-cursor="pointer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-md"
              >
                <span>Sign in to Workspace</span>
              </button>
            </div>

            {/* Footer reassurance */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-400" /> Free 14-day enterprise trial
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <FiShield className="text-indigo-400" /> Private cloud deployment
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


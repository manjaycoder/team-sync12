import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const TSCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-black text-white">
      {/* Background radial spotlight */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[900px] rounded-full bg-white/[0.04] blur-[150px]" />
        <div className="absolute inset-0 bg-grid-white opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-white/20 p-8 sm:p-16 backdrop-blur-2xl relative overflow-hidden bg-[#09090b]">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 mb-7">
            <Zap size={14} className="text-white" />
            <span className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-widest">
              Instant Workspace Initialization
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Ready to bring your organization into{' '}
            <span className="aw-text-gradient">complete synchronization</span>?
          </h2>

          <p className="mt-6 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Deploy an enterprise workspace in under 60 seconds. Experience live Kanban pipelines,
            Gemini AI autonomous standups, and Clerk SSO authentication with zero friction.
          </p>

          {/* Action buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/sign-up')}
              className="aw-btn-white text-sm px-9 py-4 w-full sm:w-auto text-black font-extrabold"
            >
              <span>Get started free</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="aw-btn-ghost text-sm px-8 py-4 w-full sm:w-auto"
            >
              <span>Sign in to Workspace</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-sans">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-white" />
              <span>100% Free &bull; No payment required</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-white" />
              <span>SOC2 Type II &bull; Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-white" />
              <span>Instant Clerk OAuth setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

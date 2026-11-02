import { useNavigate } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';

export const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#05070d] text-white border-t border-white/10 pt-16 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section with Brand & Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand Col (Span 2) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-display font-extrabold text-sm shadow-md">
                TS
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Team-Sync
              </span>
            </div>

            <p className="max-w-sm text-sm text-slate-400 font-sans leading-relaxed">
              One shared workspace. More room to make progress. Built for fast-moving engineering,
              design, and product organizations.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-mono text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Product
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li>
                <a href="#showcase" className="hover:text-white transition-colors">
                  AI Copilot
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Kanban Boards
                </a>
              </li>
              <li>
                <a href="#platform" className="hover:text-white transition-colors">
                  Department Matrix
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="hover:text-white transition-colors text-left"
                >
                  Workspace Sign-In
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Solutions
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Engineering Sprints
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Product Roadmaps
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Design Systems
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Executive Reporting
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Security &amp; Legal
            </p>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  SOC-2 Compliance
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Security Whitepaper
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Monogram Typography */}
        <div className="my-10 select-none overflow-hidden text-center opacity-10 pointer-events-none">
          <span className="font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-white">
            TEAM-SYNC
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Team-Sync Enterprise. All rights reserved.
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            data-cursor="pointer"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-slate-400 hover:text-white hover:border-white/30 transition-all"
          >
            <span>Back to top</span>
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

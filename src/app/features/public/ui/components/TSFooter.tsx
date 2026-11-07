import { Activity } from 'lucide-react';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export const TSFooter = () => {
  return (
    <footer className="border-t border-white/10 text-neutral-400 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm shadow-md">
                TS
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-display">
                Team-Sync
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-6 font-sans">
              The enterprise workspace platform unifying sprint management, cross-department
              orchestration, and autonomous Gemini AI acceleration.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/manjaycoder/team-sync12"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all"
                aria-label="GitHub"
              >
                <FiGithub size={15} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all"
                aria-label="Twitter"
              >
                <FiTwitter size={15} />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={15} />
              </a>
            </div>
          </div>

          {/* Column: Capabilities */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Kanban Pipelines
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white transition-colors">
                  Workflow Architecture
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Live Interactive Demo
                </a>
              </li>
              <li>
                <a href="#analytics" className="hover:text-white transition-colors">
                  Telemetry Matrix
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition-colors">
                  Gemini Copilot
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Architecture */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <span className="text-neutral-300">Three.js Spatial R3F</span>
              </li>
              <li>
                <span className="text-neutral-300">Clerk v5 Identity &amp; RBAC</span>
              </li>
              <li>
                <span className="text-neutral-300">React Flow State Graph</span>
              </li>
              <li>
                <span className="text-neutral-300">Recharts Telemetry</span>
              </li>
              <li>
                <span className="text-neutral-300">Google Gemini 1.5 Flash</span>
              </li>
            </ul>
          </div>

          {/* Column: Governance */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Governance
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <span className="text-neutral-300">Security Whitepaper</span>
              </li>
              <li>
                <span className="text-neutral-300">SOC2 Type II</span>
              </li>
              <li>
                <span className="text-neutral-300">Privacy Notice</span>
              </li>
              <li>
                <span className="text-neutral-300">Open Enterprise Access</span>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white">
                  <Activity size={11} />
                  <span>Systems Optimal</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <p>© {new Date().getFullYear()} Team-Sync Inc. Free Open Enterprise Workspace.</p>
          <p className="font-mono text-[11px] text-neutral-500">
            Awwwards-Grade Engineering • React 19 • Vite • Three.js • Clerk
          </p>
        </div>
      </div>
    </footer>
  );
};

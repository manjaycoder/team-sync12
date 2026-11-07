import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import { useMagnetic } from '../hooks/useMagnetic';

export const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const ctaBtnRef = useMagnetic<HTMLButtonElement>({ strength: 0.25 });
  const signinBtnRef = useMagnetic<HTMLButtonElement>({ strength: 0.25 });

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      setScrolled(isScrolled);

      // Track current section for active indicator
      const sections = ['platform', 'showcase', 'features', 'how-it-works'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 200) setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className={`mx-auto flex items-center justify-between transition-all duration-500 rounded-2xl px-4 py-2.5 sm:px-6 sm:py-3 ${
              scrolled
                ? 'border border-white/10 bg-slate-950/80 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl'
                : 'border border-slate-200/50 bg-white/70 shadow-sm backdrop-blur-md'
            }`}
            aria-label="Primary Navigation"
          >
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-3 group"
              aria-label="Team-Sync Home"
              data-cursor="pointer"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white font-display font-extrabold text-sm shadow-md shadow-indigo-600/30 transition-transform duration-300 group-hover:scale-105">
                TS
                <div className="absolute -inset-1 rounded-xl bg-indigo-500/30 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-display font-bold text-base tracking-tight transition-colors duration-300 ${
                      scrolled ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    Team-Sync
                  </span>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-indigo-400 border border-indigo-500/20">
                    PRO
                  </span>
                </div>
                <span
                  className={`text-[10px] font-sans font-medium transition-colors duration-300 ${
                    scrolled ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Work, in sync.
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {[
                { label: 'Platform', href: '#platform', id: 'platform' },
                { label: 'Live Demo', href: '#showcase', id: 'showcase' },
                { label: 'Features', href: '#features', id: 'features' },
                { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
              ].map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    data-cursor="pointer"
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      scrolled
                        ? isActive
                          ? 'text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                        : isActive
                        ? 'text-indigo-600 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* System Status + Auth CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Telemetry Indicator */}
              <div
                className={`hidden xl:flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-mono border transition-colors ${
                  scrolled
                    ? 'border-white/10 bg-white/5 text-slate-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>SYSTEMS OK</span>
              </div>

              {/* Sign In Button */}
              <button
                ref={signinBtnRef}
                type="button"
                onClick={() => navigate('/sign-in')}
                data-cursor="pointer"
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  scrolled
                    ? 'text-slate-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                Sign in
              </button>

              {/* Primary Get Started Button */}
              <button
                ref={ctaBtnRef}
                type="button"
                onClick={() => navigate('/sign-up')}
                data-cursor="pointer"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
              >
                <span>Get started</span>
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl md:hidden transition-colors ${
                  scrolled ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-30 md:hidden bg-slate-950/95 backdrop-blur-2xl transition-all duration-400 flex flex-col justify-between p-6 pt-24 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">Navigation</p>
          {[
            { label: 'Why Team-Sync', href: '#platform' },
            { label: 'Interactive Demo', href: '#showcase' },
            { label: 'Features & Capabilities', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-display font-bold text-white hover:text-indigo-400 transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 pb-8">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/sign-up');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30"
          >
            Create Free Account
            <FiArrowRight />
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/sign-in');
            }}
            className="w-full rounded-xl border border-white/20 py-3.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            Sign in to Workspace
          </button>
        </div>
      </div>
    </>
  );
};

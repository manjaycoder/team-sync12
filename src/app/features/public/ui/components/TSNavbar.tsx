import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

export const TSNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ['features', 'workflow', 'demo', 'analytics'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 160) setActiveSection('hero');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Capabilities', href: '#features', id: 'features' },
    { label: 'Architecture', href: '#workflow', id: 'workflow' },
    { label: 'Live Demo', href: '#demo', id: 'demo' },
    { label: 'Telemetry', href: '#analytics', id: 'analytics' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'pt-3 pb-3' : 'pt-5 pb-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
              scrolled
                ? 'bg-black/90 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80'
                : 'bg-black/40 backdrop-blur-md border border-white/10'
            }`}
          >
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group" aria-label="Team-Sync">
              <div className="relative h-8 w-8 flex items-center justify-center rounded-xl bg-white text-black font-black text-sm shadow-md transition-transform duration-300 group-hover:scale-105">
                <span>TS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white font-display">
                  Team-Sync
                </span>
                <span className="text-[9px] font-mono tracking-widest text-neutral-400 border border-white/15 rounded-full px-2 py-0.5 uppercase">
                  v2.0
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeSection === link.id
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-3 rounded-full bg-white" />
                  )}
                </a>
              ))}
            </div>

            {/* Right CTAs */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 rounded-full px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                TELEMETRY ACTIVE
              </div>

              <button
                type="button"
                onClick={() => navigate('/sign-in')}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => navigate('/sign-up')}
                className="aw-btn-white !py-1.5 !px-4 !text-xs !shadow-none"
              >
                <span>Get started</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.98)', backdropFilter: 'blur(24px)' }}
      >
        <div className="flex flex-col h-full pt-28 px-6 pb-12 justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
              Navigation
            </span>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold font-display text-white hover:text-neutral-400 transition-colors py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate('/sign-up');
              }}
              className="aw-btn-white w-full justify-center py-3.5 text-sm"
            >
              Get started free <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate('/sign-in');
              }}
              className="aw-btn-ghost w-full justify-center py-3.5 text-sm"
            >
              Sign in to Workspace
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import {
  FiGrid,
  FiUsers,
  FiLayers,
  FiCheckSquare,
  FiCpu,
  FiGlobe,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiArrowRight,
  FiCommand,
} from 'react-icons/fi';
import { Sparkles, Bot, CheckCircle2 } from 'lucide-react';

const DashboardLayout = () => {
  const { employee, handleLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Overview', to: '/home', icon: FiGrid, end: true, badge: 'Live' },
    { label: 'AI Copilot', to: '/home/ai-copilot', icon: FiCpu, end: false, badge: 'Gemini' },
    { label: 'Projects & Tasks', to: '/home/projects', icon: FiCheckSquare, end: false, badge: 'AI Solved' },
    { label: 'Employees', to: '/home/employees', icon: FiUsers, end: false },
    { label: 'Departments', to: '/home/departments', icon: FiLayers, end: false },
    { label: 'Public Showcase', to: '/portal', icon: FiGlobe, end: false, external: true },
    { label: 'Settings', to: '/home/settings', icon: FiSettings, end: false },
  ];

  const quickCommands = [
    { label: 'Go to Projects & Task Hub', path: '/home/projects', icon: FiCheckSquare, desc: 'Kanban board & Gemini AI task solving' },
    { label: 'Open Gemini AI Copilot', path: '/home/ai-copilot', icon: FiCpu, desc: 'Real-time organizational intelligence' },
    { label: 'View Employee Directory', path: '/home/employees', icon: FiUsers, desc: 'Browse synchronized team members' },
    { label: 'View Department Matrix', path: '/home/departments', icon: FiLayers, desc: 'Agile standups and departmental leads' },
    { label: 'View Executive Overview', path: '/home', icon: FiGrid, desc: 'Workforce velocity & sync telemetry' },
    { label: 'Launch Public Landing Website', path: '/portal', icon: FiGlobe, desc: 'Public portal & live demo' },
  ];

  const filteredCommands = quickCommands.filter(
    (c) =>
      c.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const getCurrentTitle = () => {
    const current = navItems.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
    );
    return current ? current.label : 'Enterprise Workspace';
  };

  return (
    <div className="dashboard-theme min-h-screen bg-[#030609] text-gray-100 flex flex-col md:flex-row relative selection:bg-cyan-600/30 selection:text-white">
      <div className="fixed top-0 left-64 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-[#050a10]/95 border-b border-cyan-500/15 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-sky-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-cyan-500/30 border border-cyan-400/25">
            TS
          </div>
          <div>
            <span className="font-display font-bold text-white tracking-tight text-base block leading-none">
              Team-Sync
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-cyan-400 uppercase">
              Enterprise
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition border border-white/5"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#050a10]/95 border-r border-cyan-500/[0.12] flex flex-col z-40 transition-transform duration-300 backdrop-blur-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Banner */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/[0.06]">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/home')}
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-sky-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-cyan-600/35 border border-cyan-400/25 group-hover:scale-105 transition-transform duration-300">
                TS
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 ring-2 ring-[#050a10]" />
              </span>
            </div>
            <div>
              <div className="font-display font-black text-white tracking-tight text-lg leading-tight flex items-center gap-1.5">
                Team-Sync
                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                  2.0
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-cyan-300 transition">
                Autonomous Workforce
              </span>
            </div>
          </div>
        </div>

        {/* Quick Command Trigger Pill */}
        <div className="px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={() => setIsCommandMenuOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 text-gray-400 hover:text-white transition group shadow-sm"
          >
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <FiCommand className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Quick Actions...</span>
            </div>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 group-hover:border-cyan-500/20">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
            Workspace Hub
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-white font-semibold border border-cyan-500/40 shadow-md shadow-cyan-600/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-base shrink-0 group-hover:text-cyan-400 transition-colors" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      item.badge === 'Gemini'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30'
                        : item.badge === 'AI Solved'
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/5 text-gray-400 border-white/5'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Gemini Engine Telemetry Badge */}
        <div className="p-4 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#071521] to-[#06101a] border border-cyan-500/25 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/15 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-1 relative z-10">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Gemini 1.5 Flash</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug relative z-10">
            Autonomous task execution engine active across 5 divisions.
          </p>
        </div>

        {/* User Profile Card & Signout */}
        <div className="p-3.5 border-t border-white/[0.06] bg-[#040a10]/90">
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1 group"
              onClick={() => navigate('/home/settings')}
              title="Open Profile Settings"
            >
              <img
                src={
                  employee?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={employee?.name || 'User'}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-cyan-500/40 group-hover:ring-cyan-400 transition shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                  {employee?.name || 'Alex Morgan'}
                </div>
                <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                  <span>{employee?.role || 'Lead Coordinator'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/20 transition shrink-0"
              title="Sign Out"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 px-6 md:px-8 bg-[#050a10]/85 border-b border-cyan-500/[0.12] backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Section Breadcrumbs & Quick Search */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span>Workspace</span>
              <span className="text-gray-600">/</span>
              <span className="text-white font-bold">{getCurrentTitle()}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsCommandMenuOpen(true)}
              className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs text-gray-400 hover:text-white transition w-64 cursor-pointer"
            >
              <FiSearch className="text-gray-400 text-xs" />
              <span className="truncate">Search tasks, employees, AI...</span>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 ml-auto">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Direct AI Copilot Quick Jump */}
            <button
              type="button"
              onClick={() => navigate('/home/ai-copilot')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition shadow-sm cursor-pointer shadow-cyan-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Copilot</span>
            </button>

            {/* Operational Health Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetry 99.9%</span>
            </div>

            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white transition relative cursor-pointer"
                aria-label="Notifications"
              >
                <FiBell size={16} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-[#050a10]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-84 rounded-2xl bg-[#06101a] border border-cyan-500/30 shadow-2xl p-4 z-50 animate-fadeIn backdrop-blur-2xl shadow-cyan-500/10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">Live Activity Stream</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Live
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-2.5 mt-3 text-xs max-h-72 overflow-y-auto">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                        <span>✨ Google Gemini AI</span>
                        <span className="text-[9px] text-gray-400">Just now</span>
                      </div>
                      <p className="text-gray-200 text-[11px]">
                        Autonomous task execution verified and synchronized with project velocity.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                        <span>🚀 Sprint Telemetry</span>
                        <span className="text-[9px] text-gray-400">12m ago</span>
                      </div>
                      <p className="text-gray-200 text-[11px]">
                        Engineering and Cloud Operations operating at 100% velocity cadence.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                        <span>👥 Cross-Sync Completed</span>
                        <span className="text-[9px] text-gray-400">1h ago</span>
                      </div>
                      <p className="text-gray-200 text-[11px]">
                        All 5 core divisions synchronized with zero architectural blockers.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* GLOBAL COMMAND PALETTE (CTRL + K) */}
      {isCommandMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#06101a] border border-cyan-500/40 rounded-3xl w-full max-w-xl shadow-2xl shadow-cyan-500/20 overflow-hidden relative">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <FiSearch className="text-cyan-400 text-base" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or jump to workspace section..."
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsCommandMenuOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Navigation & Shortcuts
              </div>
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-xs">
                  No matching shortcuts found.
                </div>
              ) : (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.path}
                      type="button"
                      onClick={() => {
                        navigate(cmd.path);
                        setIsCommandMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left hover:bg-white/[0.06] transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white transition">
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-100 group-hover:text-white">
                            {cmd.label}
                          </div>
                          <div className="text-[11px] text-gray-400">{cmd.desc}</div>
                        </div>
                      </div>
                      <FiArrowRight className="text-gray-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-black/50 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 px-4">
              <div className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Team-Sync Autonomous Platform</span>
              </div>
              <span>Press ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
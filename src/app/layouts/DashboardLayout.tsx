import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  FiCheckCircle,
} from 'react-icons/fi';

const DashboardLayout = () => {
  const { employee, handleLogout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', to: '/home', icon: FiGrid, end: true },
    { label: 'AI Copilot', to: '/home/ai-copilot', icon: FiCpu, end: false },
    { label: 'Projects & Tasks', to: '/home/projects', icon: FiCheckSquare, end: false },
    { label: 'Employees', to: '/home/employees', icon: FiUsers, end: false },
    { label: 'Departments', to: '/home/departments', icon: FiLayers, end: false },
    { label: 'Public Portal', to: '/portal', icon: FiGlobe, end: false },
    { label: 'Settings', to: '/home/settings', icon: FiSettings, end: false },
  ];

  return (
    <div className="min-h-screen bg-[#090611] text-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#110e1c] border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/30">
            TS
          </div>
          <span className="font-bold text-white tracking-tight">Team-Sync</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0e0c18] border-r border-white/5 flex flex-col z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Banner */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-violet-600/30">
            TS
          </div>
          <div>
            <div className="font-bold text-white tracking-tight leading-none text-base">
              Team-Sync
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-violet-400">
              Enterprise Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Workspace
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
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="text-lg shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sync Status Pill */}
        <div className="px-4 py-3 mx-3 mb-4 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs">
          <div className="flex items-center gap-2 text-violet-300 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Sync Engine Active</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Next sync in 4 mins</p>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-white/5 bg-[#0b0914]">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 overflow-hidden cursor-pointer"
              onClick={() => navigate('/home/settings')}
            >
              <img
                src={
                  employee?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={employee?.name || 'User'}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/40 shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {employee?.name || 'Alex Morgan'}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {employee?.role || 'Admin'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition"
              title="Sign Out"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 px-6 bg-[#0c0a17]/90 border-b border-white/5 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          {/* Quick Search */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search employees, teams, documents..."
                className="w-full bg-[#151322] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Operational Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <FiCheckCircle size={13} />
              <span>Operational</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-[#151322] border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition relative"
                aria-label="Notifications"
              >
                <FiBell size={16} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-[#0c0a17]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#151322] border border-white/10 shadow-2xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <span className="text-[10px] text-violet-400 font-medium">Mark all read</span>
                  </div>
                  <div className="space-y-3 mt-3 text-xs">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-gray-200 font-medium">Workforce Sync Completed</p>
                      <span className="text-[10px] text-gray-400">All 5 departments updated • 10m ago</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-gray-200 font-medium">New Employee Added</p>
                      <span className="text-[10px] text-gray-400">Marcus Chen joined UX Team • 1h ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
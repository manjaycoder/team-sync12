import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useUser, useClerk, UserButton } from '@clerk/clerk-react';
import type { RootState, AppDispatch } from '../routes/store';
import { createTaskApi } from '../features/projects/state/taskSlice';
import { createEmployeeApi } from '../features/employee/state/employeeSlice';
import { addDepartmentRecord } from '../features/departments/state/departmentSlice';
import ContextAIDrawer from '../features/ai/ui/ContextAIDrawer';
import {
  FiGrid,
  FiBriefcase,
  FiLayers,
  FiUsers,
  FiCheckSquare,
  FiCalendar,
  FiCpu,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiArrowRight,
  FiCheck,
  FiUserCheck,
} from 'react-icons/fi';
import { Sparkles, Bot } from 'lucide-react';

export const DashboardLayout = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Map Clerk user to the shape the rest of the layout expects
  const employee = user
    ? {
        name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: (user.publicMetadata?.role as string) || 'Team Member',
        avatar: user.imageUrl || '',
      }
    : null;

  const handleLogout = () => signOut(() => navigate('/'));

  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<'task' | 'employee' | 'department' | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Quick Create Forms state
  const [quickTaskForm, setQuickTaskForm] = useState({
    title: '',
    projectName: '',
    department: 'Engineering',
    assigneeName: employee?.name || 'Alex Morgan',
    assigneeEmail: employee?.email || '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: 'Nov 20, 2026',
  });

  const [quickEmpForm, setQuickEmpForm] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'active' as 'active' | 'remote' | 'on_leave',
  });

  const [quickDeptForm, setQuickDeptForm] = useState({
    name: '',
    leadName: employee?.name || '',
    budget: '$250,000',
  });

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandMenuOpen(false);
        setIsQuickCreateOpen(false);
        setQuickCreateType(null);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Dashboard', to: '/home', icon: FiGrid, end: true },
    {
      label: 'Companies',
      to: '#company',
      icon: FiBriefcase,
      onClick: () => setIsCompanyModalOpen(true),
    },
    { label: 'Departments', to: '/home/departments', icon: FiLayers },
    { label: 'Employees', to: '/home/employees', icon: FiUsers },
    { label: 'Tasks', to: '/home/projects', icon: FiCheckSquare },
    {
      label: 'Team',
      to: '/home/employees?view=team',
      icon: FiUserCheck,
    },
    {
      label: 'Calendar',
      to: '/home/projects?view=calendar',
      icon: FiCalendar,
    },
    {
      label: 'AI Assistant',
      to: '/home/ai-copilot',
      icon: FiCpu,
      badge: 'Gemini',
    },
    {
      label: 'Reports',
      to: '#reports',
      icon: FiBarChart2,
      onClick: () => setIsReportsModalOpen(true),
    },
    { label: 'Settings', to: '/home/settings', icon: FiSettings },
  ];

  const quickCommands = [
    { label: 'Create New Task', action: () => setQuickCreateType('task'), icon: FiPlus, desc: 'Add deliverables across departments' },
    { label: 'Add Team Member', action: () => setQuickCreateType('employee'), icon: FiUsers, desc: 'Invite or register staff' },
    { label: 'Create Department', action: () => setQuickCreateType('department'), icon: FiLayers, desc: 'Establish new organizational unit' },
    { label: 'Open AI Assistant Drawer', action: () => setIsAIDrawerOpen(true), icon: FiCpu, desc: 'Ask context-aware questions' },
    { label: 'View Tasks & Kanban Board', path: '/home/projects', icon: FiCheckSquare, desc: 'Browse board, list & calendar' },
    { label: 'View Department Matrix', path: '/home/departments', icon: FiLayers, desc: 'Standup agendas & allocations' },
    { label: 'View Employee Directory', path: '/home/employees', icon: FiUsers, desc: 'Directory, roles & workloads' },
    { label: 'View Executive Command Center', path: '/home', icon: FiGrid, desc: 'Company overview & health' },
  ];

  const filteredCommands = quickCommands.filter(
    (c) =>
      c.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const getCurrentTitle = () => {
    if (location.pathname === '/home') return 'Command Center Overview';
    if (location.pathname.startsWith('/home/projects')) return 'Tasks & Kanban Workspace';
    if (location.pathname.startsWith('/home/employees')) return 'Employee Directory & Workloads';
    if (location.pathname.startsWith('/home/departments')) return 'Departments & Organization';
    if (location.pathname.startsWith('/home/ai-copilot')) return 'Gemini AI Copilot';
    if (location.pathname.startsWith('/home/settings')) return 'Workspace Settings';
    return 'Work Management';
  };

  const handleCreateQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskForm.title.trim()) return;
    await dispatch(
      createTaskApi({
        title: quickTaskForm.title,
        description: 'Quick sprint deliverable.',
        projectName: quickTaskForm.projectName || (projects[0]?.name || 'Core Platform'),
        department: quickTaskForm.department,
        assigneeName: quickTaskForm.assigneeName,
        assigneeEmail: quickTaskForm.assigneeEmail,
        assigneeAvatar:
          employees.find((e) => e.name === quickTaskForm.assigneeName)?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        priority: quickTaskForm.priority,
        dueDate: quickTaskForm.dueDate,
        status: 'todo',
      })
    );
    setQuickTaskForm({
      title: '',
      projectName: '',
      department: 'Engineering',
      assigneeName: employee?.name || 'Alex Morgan',
      assigneeEmail: employee?.email || '',
      priority: 'medium',
      dueDate: 'Nov 20, 2026',
    });
    setQuickCreateType(null);
  };

  const handleCreateQuickEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmpForm.name.trim() || !quickEmpForm.email.trim()) return;
    await dispatch(
      createEmployeeApi({
        name: quickEmpForm.name,
        email: quickEmpForm.email,
        role: quickEmpForm.role || 'Software Engineer',
        department: quickEmpForm.department,
        status: quickEmpForm.status,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avatar: `https://images.unsplash.com/photo-${
          1500000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
        location: 'Remote',
      })
    );
    setQuickEmpForm({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      status: 'active',
    });
    setQuickCreateType(null);
  };

  const handleCreateQuickDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDeptForm.name.trim()) return;
    dispatch(
      addDepartmentRecord({
        name: quickDeptForm.name,
        leadName: quickDeptForm.leadName,
        leadAvatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        budget: quickDeptForm.budget,
        memberCount: 5,
        activeProjects: 2,
        color: 'from-indigo-600 to-blue-600',
        description: 'New organizational division aligned with business goals.',
      })
    );
    setQuickDeptForm({
      name: '',
      leadName: employee?.name || 'Alex Morgan',
      budget: '$250,000',
    });
    setQuickCreateType(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans selection:bg-white selection:text-black relative">
      {/* Editorial ambient background grid and lighting matching landing page */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-white/[0.03] blur-[150px]" />
        <div className="absolute inset-0 bg-grid-white opacity-25" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center font-display font-black text-xs shadow-md shadow-white/20">
            TS
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm block leading-none">
              Team-Sync
            </span>
            <span className="text-[10px] font-mono text-neutral-400">ENTERPRISE PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAIDrawerOpen(true)}
            className="p-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
            aria-label="Open AI Assistant"
          >
            <Sparkles size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white border border-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Monochromatic Enterprise Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#08080a]/95 border-r border-white/10 flex flex-col z-40 transition-transform duration-300 backdrop-blur-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Workspace Brand / Company Switcher */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <button
            type="button"
            onClick={() => setIsCompanyModalOpen(true)}
            className="flex items-center gap-3 text-left w-full p-2 rounded-xl hover:bg-white/5 transition group border border-transparent hover:border-white/10"
            title="Switch or view company details"
          >
            <div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center font-display font-black text-xs shadow-md shadow-white/20 shrink-0">
              TS
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight">
                <span>Acme Corp</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <FiChevronDown size={12} className="text-neutral-400 group-hover:text-white transition ml-auto" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Enterprise Workspace</span>
            </div>
          </button>
        </div>

        {/* Global Search Shortcut Pill (Ctrl+K) */}
        <div className="px-3 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setIsCommandMenuOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition text-xs group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FiSearch size={13} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Search workspace...</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick!();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-slate-400 group-hover:text-indigo-400 transition" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            }
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2563EB]/25 via-[#2563EB]/10 to-transparent text-white font-semibold border-l-2 border-[#2563EB] shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className="shrink-0 text-slate-400 group-hover:text-[#38BDF8] transition"
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Context AI Callout Box */}
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-[#08080a] border border-white/15 shadow-md shadow-black/80">
          <div className="flex items-center justify-between text-xs font-semibold text-white mb-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="font-display font-bold">Gemini Copilot</span>
            </div>
            <span className="text-[9px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-2.5 leading-relaxed font-sans">
            Real-time context on sprint velocity, teams, and deliverables.
          </p>
          <button
            type="button"
            onClick={() => setIsAIDrawerOpen(true)}
            className="w-full py-1.5 text-center text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-xl transition shadow-sm font-mono uppercase tracking-wider text-[11px]"
          >
            Ask Workspace AI
          </button>
        </div>

        {/* User Profile Card — powered by Clerk UserButton */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-1 py-1 rounded-xl hover:bg-white/[0.04] transition group">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8 ring-2 ring-white/30 rounded-xl',
                  userButtonPopoverCard:
                    'bg-[#08080a] border border-white/15 shadow-2xl backdrop-blur-xl',
                  userButtonPopoverActionButton:
                    'text-neutral-200 hover:bg-white/[0.08] hover:text-white',
                  userButtonPopoverActionButtonText: 'text-neutral-200',
                  userPreviewMainIdentifier: 'text-white font-semibold',
                  userPreviewSecondaryIdentifier: 'text-neutral-400',
                },
              }}
              afterSignOutUrl="/"
              userProfileMode="modal"
            />
            <div className="truncate flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-[#60A5FA] transition truncate">
                {employee?.name || 'Team Member'}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {employee?.email || ''}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
              title="Sign Out"
            >
              <FiLogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 px-4 md:px-8 bg-slate-950/70 border-b border-white/10 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          {/* Breadcrumb & Global Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Acme Corp</span>
              <span className="text-white/20">/</span>
              <span className="text-white font-semibold">{getCurrentTitle()}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsCommandMenuOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-400 hover:text-white transition ml-4 cursor-pointer"
            >
              <FiSearch size={12} className="text-slate-400" />
              <span>Search (Ctrl+K)</span>
            </button>
          </div>

          {/* Right Topbar Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Quick Create Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                className="group inline-flex items-center gap-1.5 rounded-xl bg-white text-black px-3.5 py-1.5 text-xs font-bold shadow-md shadow-white/20 transition hover:bg-neutral-200 active:scale-95"
              >
                <FiPlus size={14} />
                <span>New</span>
                <FiChevronDown size={12} />
              </button>

              {isQuickCreateOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#08080a]/95 border border-white/15 shadow-2xl p-2 z-50 text-xs backdrop-blur-2xl animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateType('task');
                      setIsQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white flex items-center gap-2.5 font-medium transition"
                  >
                    <FiCheckSquare className="text-white" />
                    <span>Create Deliverable Task</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateType('employee');
                      setIsQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white flex items-center gap-2.5 font-medium transition"
                  >
                    <FiUsers className="text-white" />
                    <span>Add Team Member</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateType('department');
                      setIsQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-neutral-200 hover:text-white flex items-center gap-2.5 font-medium transition"
                  >
                    <FiLayers className="text-white" />
                    <span>New Department</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI Assistant Shortcut Button */}
            <button
              type="button"
              onClick={() => setIsAIDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition cursor-pointer"
              title="Open Context-Aware AI Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white transition relative"
                aria-label="Notifications"
              >
                <FiBell size={15} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-black" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#08080a]/95 border border-white/15 shadow-2xl p-4 z-50 backdrop-blur-2xl animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-white font-display">Notifications</span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white text-xs font-mono"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2.5 mt-3 text-xs max-h-72 overflow-y-auto">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                      <div className="flex items-center justify-between text-indigo-300 font-semibold text-[11px]">
                        <span>✨ Gemini AI Sync</span>
                        <span className="text-[10px] font-mono text-slate-400">Just now</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-sans">
                        Autonomous task verification synchronized across departments.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center justify-between text-emerald-400 font-semibold text-[11px]">
                        <span>🚀 Sprint Velocity 96%</span>
                        <span className="text-[10px] font-mono text-slate-400">15m ago</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-sans">
                        Engineering completed 4 high priority deliverables today.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* GLOBAL CONTEXT-AWARE AI DRAWER */}
      <ContextAIDrawer isOpen={isAIDrawerOpen} onClose={() => setIsAIDrawerOpen(false)} />

      {/* GLOBAL COMMAND PALETTE (CTRL + K) */}
      {isCommandMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden backdrop-blur-2xl">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <FiSearch className="text-slate-400 text-base" />
              <input
                type="text"
                autoFocus
                placeholder="Search actions, tasks, pages..."
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-sans"
              />
              <button
                type="button"
                onClick={() => setIsCommandMenuOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10 text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2.5 space-y-1 text-xs">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-400 font-mono">No matching commands.</div>
              ) : (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      type="button"
                      onClick={() => {
                        if (cmd.path) navigate(cmd.path);
                        if (cmd.action) cmd.action();
                        setIsCommandMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-slate-300 group-hover:bg-[#2563EB]/20 group-hover:text-[#60A5FA] transition">
                          <Icon size={15} />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{cmd.label}</div>
                          <div className="text-[11px] text-slate-400 font-sans">{cmd.desc}</div>
                        </div>
                      </div>
                      <FiArrowRight size={13} className="text-slate-500 group-hover:text-[#60A5FA] transition" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 px-4">
              <span className="flex items-center gap-1.5">
                <Bot size={13} className="text-[#60A5FA]" />
                <span>Team-Sync Command Center</span>
              </span>
              <span>Press ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}

      {/* QUICK CREATE MODAL */}
      {quickCreateType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-md shadow-2xl p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <FiPlus size={16} />
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {quickCreateType === 'task' && 'Quick Create Deliverable'}
                  {quickCreateType === 'employee' && 'Quick Add Team Member'}
                  {quickCreateType === 'department' && 'Quick Create Department'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickCreateType(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            {quickCreateType === 'task' && (
              <form onSubmit={handleCreateQuickTask} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement OAuth single sign-on"
                    value={quickTaskForm.title}
                    onChange={(e) => setQuickTaskForm({ ...quickTaskForm, title: e.target.value })}
                    className="ts-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Department</label>
                    <select
                      value={quickTaskForm.department}
                      onChange={(e) => setQuickTaskForm({ ...quickTaskForm, department: e.target.value })}
                      className="ts-input w-full"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name} className="bg-slate-900">
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Priority</label>
                    <select
                      value={quickTaskForm.priority}
                      onChange={(e) =>
                        setQuickTaskForm({
                          ...quickTaskForm,
                          priority: e.target.value as any,
                        })
                      }
                      className="ts-input w-full"
                    >
                      <option value="low" className="bg-slate-900">Low</option>
                      <option value="medium" className="bg-slate-900">Medium</option>
                      <option value="high" className="bg-slate-900">High</option>
                      <option value="urgent" className="bg-slate-900">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Assignee</label>
                  <select
                    value={quickTaskForm.assigneeName}
                    onChange={(e) => {
                      const emp = employees.find((em) => em.name === e.target.value);
                      setQuickTaskForm({
                        ...quickTaskForm,
                        assigneeName: e.target.value,
                        assigneeEmail: emp?.email || employee?.email || '',
                      });
                    }}
                    className="ts-input w-full"
                  >
                    {employees.map((em) => (
                      <option key={em.id} value={em.name} className="bg-slate-900">
                        {em.name} ({em.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setQuickCreateType(null)}
                    className="ts-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ts-btn-primary text-xs">
                    Create Task
                  </button>
                </div>
              </form>
            )}

            {quickCreateType === 'employee' && (
              <form onSubmit={handleCreateQuickEmp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={quickEmpForm.name}
                    onChange={(e) => setQuickEmpForm({ ...quickEmpForm, name: e.target.value })}
                    className="ts-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@acme.space"
                    value={quickEmpForm.email}
                    onChange={(e) => setQuickEmpForm({ ...quickEmpForm, email: e.target.value })}
                    className="ts-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Dev"
                      value={quickEmpForm.role}
                      onChange={(e) => setQuickEmpForm({ ...quickEmpForm, role: e.target.value })}
                      className="ts-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Department</label>
                    <select
                      value={quickEmpForm.department}
                      onChange={(e) => setQuickEmpForm({ ...quickEmpForm, department: e.target.value })}
                      className="ts-input w-full"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name} className="bg-slate-900">
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setQuickCreateType(null)}
                    className="ts-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ts-btn-primary text-xs">
                    Add Member
                  </button>
                </div>
              </form>
            )}

            {quickCreateType === 'department' && (
              <form onSubmit={handleCreateQuickDept} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Security & Compliance"
                    value={quickDeptForm.name}
                    onChange={(e) => setQuickDeptForm({ ...quickDeptForm, name: e.target.value })}
                    className="ts-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Department Lead</label>
                    <input
                      type="text"
                      value={quickDeptForm.leadName}
                      onChange={(e) => setQuickDeptForm({ ...quickDeptForm, leadName: e.target.value })}
                      className="ts-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Annual Budget</label>
                    <input
                      type="text"
                      value={quickDeptForm.budget}
                      onChange={(e) => setQuickDeptForm({ ...quickDeptForm, budget: e.target.value })}
                      className="ts-input w-full"
                    />
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setQuickCreateType(null)}
                    className="ts-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ts-btn-primary text-xs">
                    Create Department
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* COMPANY MANAGEMENT MODAL */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08080a]/95 border border-white/15 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center font-display font-black text-base shadow-lg shadow-white/20">
                  AC
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Acme Technologies Inc.</h3>
                  <span className="text-xs font-mono text-neutral-400">
                    Enterprise Cloud &amp; AI SaaS &bull; ID: ACME-SYNC-2026
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Employees</div>
                <div className="text-2xl font-display font-bold text-white mt-1">{employees.length}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Departments</div>
                <div className="text-2xl font-display font-bold text-white mt-1">{departments.length}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Active Tasks</div>
                <div className="text-2xl font-display font-bold text-white mt-1">{tasks.length}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">Status</div>
                <div className="text-sm font-bold text-emerald-300 mt-1 flex items-center gap-1 font-mono">
                  <FiCheck size={14} /> ACTIVE
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 font-sans">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <div className="font-semibold text-white">Company Overview</div>
                <p className="text-neutral-400 leading-relaxed">
                  Acme Technologies is an autonomous cloud enterprise with integrated Gemini AI
                  workforce copilot. Cross-department tasks, sprints, and velocity metrics are
                  synchronized across all business units.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">
                Tier: Enterprise Ultimate (Unlimited Users)
              </span>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="ts-btn-primary text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE REPORTS MODAL */}
      {isReportsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#08080a]/95 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
                  <FiBarChart2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Organizational Reports &amp; Analytics
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Real-time organizational telemetry
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">Sprint Delivery Velocity</span>
                  <span className="font-mono font-bold text-white text-sm">96%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full"
                    style={{ width: '96%' }}
                  />
                </div>
                <span className="text-[10px] font-mono text-neutral-400 mt-2 block">
                  Optimal velocity across {departments.length} active departments.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">Task Completion Rate</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {Math.round(
                      (tasks.filter((t) => t.status === 'completed').length / (tasks.length || 1)) * 100
                    )}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                    style={{
                      width: `${Math.round(
                        (tasks.filter((t) => t.status === 'completed').length / (tasks.length || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                  {tasks.filter((t) => t.status === 'completed').length} of {tasks.length} tasks completed.
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsReportsModalOpen(false)}
                className="ts-btn-primary text-xs"
              >
                Close Reports
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

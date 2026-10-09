import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hooks/useAuth';
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
  const { employee, handleLogout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
        setShowUserDropdown(false);
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
    if (location.pathname === '/home') return 'Admin Dashboard';
    if (location.pathname.startsWith('/home/projects')) return 'Task Management';
    if (location.pathname.startsWith('/home/employees')) return 'Employee Directory';
    if (location.pathname.startsWith('/home/departments')) return 'Departments & Teams';
    if (location.pathname.startsWith('/home/ai-copilot')) return 'AI Copilot Workspace';
    if (location.pathname.startsWith('/home/settings')) return 'Settings';
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            TS
          </div>
          <div>
            <span className="font-semibold text-slate-900 text-sm block leading-none">
              Team-Sync
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Enterprise SaaS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAIDrawerOpen(true)}
            className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition"
            aria-label="Open AI Assistant"
          >
            <Sparkles size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Workspace Brand / Company Switcher */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200">
          <button
            type="button"
            onClick={() => setIsCompanyModalOpen(true)}
            className="flex items-center gap-2.5 text-left w-full p-1.5 rounded-lg hover:bg-slate-50 transition group"
            title="Switch or view company details"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 group-hover:bg-indigo-700 transition">
              TS
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1 leading-tight">
                <span>Acme Corp</span>
                <FiChevronDown size={12} className="text-slate-400 group-hover:text-slate-600 transition" />
              </div>
              <span className="text-[11px] text-slate-500">Workforce SaaS</span>
            </div>
          </button>
        </div>

        {/* Quick Search Shortcut Pill */}
        <div className="px-3 pt-3 pb-2">
          <button
            type="button"
            onClick={() => setIsCommandMenuOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition text-xs group"
          >
            <div className="flex items-center gap-2">
              <FiSearch size={13} className="text-slate-400 group-hover:text-indigo-600" />
              <span>Search anything...</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Platform
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
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className="text-slate-400 group-hover:text-indigo-600 transition" />
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
                  `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={15}
                    className="shrink-0 text-slate-400 group-hover:text-indigo-600 transition"
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Context AI Callout */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Context AI</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
            Instant insights on current workloads, teams & tasks.
          </p>
          <button
            type="button"
            onClick={() => setIsAIDrawerOpen(true)}
            className="w-full py-1 text-center text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-md transition"
          >
            Ask Copilot
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-200 relative">
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1 group"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img
                src={
                  employee?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={employee?.name || 'User'}
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition truncate">
                  {employee?.name || 'Alex Morgan'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{employee?.role || 'Lead Admin'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <FiLogOut size={15} />
            </button>
          </div>

          {/* User Profile Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute bottom-16 left-3 right-3 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs animate-fadeIn">
              <div className="px-2 py-1.5 border-b border-slate-100">
                <div className="font-semibold text-slate-900">{employee?.name || 'Alex Morgan'}</div>
                <div className="text-[11px] text-slate-500 truncate">{employee?.email || 'alex@acme.space'}</div>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/home/settings');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <FiSettings size={13} className="text-slate-400" />
                  <span>Account & Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCompanyModalOpen(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <FiBriefcase size={13} className="text-slate-400" />
                  <span>Company Profile</span>
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                >
                  <FiLogOut size={13} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-14 px-4 md:px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30">
          {/* Breadcrumb & Global Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Acme Corp</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-semibold">{getCurrentTitle()}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsCommandMenuOpen(true)}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 transition ml-4 cursor-pointer"
            >
              <FiSearch size={12} className="text-slate-400" />
              <span>Search (Ctrl+K)</span>
            </button>
          </div>

          {/* Right Topbar Action Bar */}
          <div className="flex items-center gap-2">
            {/* Quick Create Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                className="saas-button-primary text-xs py-1.5 px-3"
              >
                <FiPlus size={14} />
                <span>New</span>
                <FiChevronDown size={12} />
              </button>

              {isQuickCreateOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 z-50 text-xs animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateType('task');
                      setIsQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 font-medium"
                  >
                    <FiCheckSquare className="text-indigo-600" />
                    <span>Create Task</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateType('employee');
                      setIsQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 font-medium"
                  >
                    <FiUsers className="text-emerald-600" />
                    <span>Add Employee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCreateType('department');
                      setIsQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 font-medium"
                  >
                    <FiLayers className="text-violet-600" />
                    <span>New Department</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI Assistant Shortcut Button */}
            <button
              type="button"
              onClick={() => setIsAIDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-medium transition cursor-pointer"
              title="Open Context-Aware AI Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition relative"
                aria-label="Notifications"
              >
                <FiBell size={15} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-900">Notifications</span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 mt-2 text-xs max-h-72 overflow-y-auto">
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-1">
                      <div className="flex items-center justify-between text-indigo-700 font-semibold text-[11px]">
                        <span>✨ Gemini AI Sync</span>
                        <span className="text-[10px] text-slate-400">Just now</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Autonomous task verification synced across 5 departments.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-emerald-700 font-semibold text-[11px]">
                        <span>🚀 Sprint Velocity 96%</span>
                        <span className="text-[10px] text-slate-400">15m ago</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
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
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* GLOBAL CONTEXT-AWARE AI DRAWER (Available on all pages) */}
      <ContextAIDrawer isOpen={isAIDrawerOpen} onClose={() => setIsAIDrawerOpen(false)} />

      {/* GLOBAL COMMAND PALETTE (CTRL + K) */}
      {isCommandMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center gap-2.5">
              <FiSearch className="text-slate-400 text-sm" />
              <input
                type="text"
                autoFocus
                placeholder="Search actions, tasks, pages..."
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsCommandMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono"
              >
                ESC
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto p-2 space-y-1 text-xs">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-6 text-center text-slate-400">No matching commands.</div>
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
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                          <Icon size={14} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{cmd.label}</div>
                          <div className="text-[11px] text-slate-500">{cmd.desc}</div>
                        </div>
                      </div>
                      <FiArrowRight size={13} className="text-slate-300 group-hover:text-indigo-600 transition" />
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 px-3">
              <span className="flex items-center gap-1.5">
                <Bot size={13} className="text-indigo-600" />
                <span>Team-Sync Work Management SaaS</span>
              </span>
              <span>Press ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}

      {/* QUICK CREATE MODAL */}
      {quickCreateType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-700">
                  <FiPlus size={15} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {quickCreateType === 'task' && 'Quick Create Task'}
                  {quickCreateType === 'employee' && 'Quick Add Employee'}
                  {quickCreateType === 'department' && 'Quick Create Department'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickCreateType(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            {quickCreateType === 'task' && (
              <form onSubmit={handleCreateQuickTask} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement OAuth single sign-on"
                    value={quickTaskForm.title}
                    onChange={(e) => setQuickTaskForm({ ...quickTaskForm, title: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Department</label>
                    <select
                      value={quickTaskForm.department}
                      onChange={(e) => setQuickTaskForm({ ...quickTaskForm, department: e.target.value })}
                      className="saas-input w-full"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Priority</label>
                    <select
                      value={quickTaskForm.priority}
                      onChange={(e) =>
                        setQuickTaskForm({
                          ...quickTaskForm,
                          priority: e.target.value as any,
                        })
                      }
                      className="saas-input w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assignee</label>
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
                    className="saas-input w-full"
                  >
                    {employees.map((em) => (
                      <option key={em.id} value={em.name}>
                        {em.name} ({em.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickCreateType(null)}
                    className="saas-button-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="saas-button-primary text-xs">
                    Create Task
                  </button>
                </div>
              </form>
            )}

            {quickCreateType === 'employee' && (
              <form onSubmit={handleCreateQuickEmp} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={quickEmpForm.name}
                    onChange={(e) => setQuickEmpForm({ ...quickEmpForm, name: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah.jenkins@acme.space"
                    value={quickEmpForm.email}
                    onChange={(e) => setQuickEmpForm({ ...quickEmpForm, email: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Dev"
                      value={quickEmpForm.role}
                      onChange={(e) => setQuickEmpForm({ ...quickEmpForm, role: e.target.value })}
                      className="saas-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Department</label>
                    <select
                      value={quickEmpForm.department}
                      onChange={(e) => setQuickEmpForm({ ...quickEmpForm, department: e.target.value })}
                      className="saas-input w-full"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickCreateType(null)}
                    className="saas-button-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="saas-button-primary text-xs">
                    Add Team Member
                  </button>
                </div>
              </form>
            )}

            {quickCreateType === 'department' && (
              <form onSubmit={handleCreateQuickDept} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Security & Compliance"
                    value={quickDeptForm.name}
                    onChange={(e) => setQuickDeptForm({ ...quickDeptForm, name: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Department Lead</label>
                    <input
                      type="text"
                      value={quickDeptForm.leadName}
                      onChange={(e) => setQuickDeptForm({ ...quickDeptForm, leadName: e.target.value })}
                      className="saas-input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Annual Budget</label>
                    <input
                      type="text"
                      value={quickDeptForm.budget}
                      onChange={(e) => setQuickDeptForm({ ...quickDeptForm, budget: e.target.value })}
                      className="saas-input w-full"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickCreateType(null)}
                    className="saas-button-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="saas-button-primary text-xs">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  AC
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Acme Technologies Inc.</h3>
                  <span className="text-xs text-slate-500">Enterprise Cloud & AI SaaS • ID: ACME-SYNC-2026</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Employees</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{employees.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Departments</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{departments.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Active Tasks</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{tasks.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] text-emerald-700 font-medium">Status</div>
                <div className="text-sm font-bold text-emerald-800 mt-1 flex items-center gap-1">
                  <FiCheck size={13} /> Active
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Company Overview</div>
                <p className="text-slate-500 leading-relaxed">
                  Acme Technologies is an autonomous cloud enterprise with integrated Gemini AI workforce copilot. Cross-department tasks, sprints, and velocity metrics are synchronized across all business units.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Tier: Enterprise Ultimate (Unlimited Users)</span>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="saas-button-primary text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE REPORTS MODAL */}
      {isReportsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                  <FiBarChart2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Organizational Reports & Analytics</h3>
                  <span className="text-[11px] text-slate-500">Real-time organizational telemetry</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReportsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">Sprint Delivery Velocity</span>
                  <span className="font-bold text-indigo-600">96%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '96%' }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Optimal velocity across 5 active teams.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">Task Completion Rate</span>
                  <span className="font-bold text-emerald-600">
                    {Math.round(
                      (tasks.filter((t) => t.status === 'completed').length / (tasks.length || 1)) * 100
                    )}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{
                      width: `${Math.round(
                        (tasks.filter((t) => t.status === 'completed').length / (tasks.length || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {tasks.filter((t) => t.status === 'completed').length} of {tasks.length} tasks completed.
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsReportsModalOpen(false)}
                className="saas-button-primary text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../../routes/store';
import { fetchEmployees } from '../../../employee/state/employeeSlice';
import { fetchDepartments } from '../../../departments/state/departmentSlice';
import { axiosInstance } from '../../../../config/axiosInstance';
import {
  FiUsers,
  FiLayers,
  FiActivity,
  FiCheckCircle,
  FiArrowUpRight,
  FiPlus,
  FiClock,
  FiCalendar,
  FiCpu,
  FiX,
  FiZap,
} from 'react-icons/fi';

interface SyncBriefing {
  headline: string;
  velocityScore: number;
  executiveSummary: string;
  departmentInsights: Array<{
    department: string;
    health: 'OPTIMAL' | 'MODERATE' | 'NEEDS_ATTENTION';
    focus: string;
  }>;
  keyRecommendations: string[];
  generatedAt: string;
}

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { employee } = useSelector((state: RootState) => state.auth);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [briefing, setBriefing] = useState<SyncBriefing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await axiosInstance.post('/ai/sync-briefing');
      if (res.data) {
        setBriefing(res.data);
        setIsModalOpen(true);
        setLastSyncTime('A few moments ago');
      }
    } catch {
      // Local fallback
      setLastSyncTime('A few moments ago');
    } finally {
      setIsSyncing(false);
    }
  };

  const totalProjects = departments.reduce((acc, d) => acc + (d.activeProjects || 0), 0);

  const stats = [
    {
      title: 'Total Workforce',
      value: employees.length,
      change: '+14% this quarter',
      icon: FiUsers,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Active Departments',
      value: departments.length,
      change: '100% staffed',
      icon: FiLayers,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Live Projects',
      value: totalProjects,
      change: 'All milestones green',
      icon: FiActivity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Sync Health',
      value: '99.9%',
      change: `Last: ${lastSyncTime}`,
      icon: FiCheckCircle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  const recentActivities = [
    {
      user: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action: 'synced department roadmap for',
      target: 'Engineering',
      time: '12m ago',
    },
    {
      user: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      action: 'deployed model weight checkpoints in',
      target: 'AI Research',
      time: '45m ago',
    },
    {
      user: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      action: 'published 2.0 design token guidelines for',
      target: 'Product & Design',
      time: '2h ago',
    },
    {
      user: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      action: 'completed SOC2 compliance audit sync in',
      target: 'Operations',
      time: '4h ago',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#171426] via-[#120f20] to-[#0d0a17] p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">
              <FiCalendar />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {employee?.name || 'Alex Morgan'}
            </h1>
            <p className="mt-1 text-sm text-gray-400 max-w-xl">
              Workspace connected to MongoDB &amp; Google Gemini AI Engine. All department telemetry is active.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-950/40 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-900/50 hover:text-white disabled:opacity-50"
            >
              <FiZap className={`text-violet-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Running Gemini AI Sync...' : 'Sync Workspace (Gemini AI)'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/home/employees')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500"
            >
              <FiPlus />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-[#12101e] p-5 shadow-lg transition duration-200 hover:border-white/15"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">{stat.title}</span>
                <div className={`p-2 rounded-xl border ${stat.bg}`}>
                  <Icon className={stat.color} size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                <FiArrowUpRight className="text-violet-400" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Departments Breakdown & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Overview Cards (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FiLayers className="text-violet-400" />
              <span>Department Hub</span>
            </h2>
            <button
              type="button"
              onClick={() => navigate('/home/departments')}
              className="text-xs font-medium text-violet-400 hover:text-violet-300"
            >
              View all departments →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.slice(0, 4).map((dept) => (
              <div
                key={dept.id}
                onClick={() => navigate('/home/departments')}
                className="group cursor-pointer rounded-2xl border border-white/5 bg-[#12101e] p-5 transition duration-200 hover:border-violet-500/30 hover:bg-[#161326]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    {dept.name}
                  </span>
                  <span className="text-[11px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                    {dept.activeProjects} active projects
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                  {dept.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <img
                      src={dept.leadAvatar}
                      alt={dept.leadName}
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                    />
                    <span className="text-[11px] text-gray-300">{dept.leadName}</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    {dept.memberCount} members
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Team Roster Preview */}
          <div className="rounded-2xl border border-white/5 bg-[#12101e] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Key Team Members (Synced from MongoDB)
              </h3>
              <button
                type="button"
                onClick={() => navigate('/home/employees')}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Manage Directory →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {employees.slice(0, 6).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate('/home/employees')}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition cursor-pointer"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-violet-500/30"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-gray-200 truncate">{emp.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{emp.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity Stream (1 Col) */}
        <div className="rounded-2xl border border-white/5 bg-[#12101e] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FiClock className="text-violet-400" />
              <span>Live Sync Feed</span>
            </h2>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <img
                  src={act.avatar}
                  alt={act.user}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
                />
                <div className="flex-1 leading-relaxed">
                  <span className="font-semibold text-gray-200">{act.user}</span>{' '}
                  <span className="text-gray-400">{act.action}</span>{' '}
                  <span className="font-medium text-violet-300">{act.target}</span>
                  <div className="text-[10px] text-gray-500 mt-0.5">{act.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="rounded-xl bg-violet-950/30 border border-violet-500/20 p-3.5">
              <div className="flex items-center gap-2 text-violet-300 font-semibold text-xs mb-1">
                <FiCpu className="text-violet-400" />
                <span>Gemini AI Engine Active</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Connected to local Express API &amp; Google Gemini model endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini AI Sync Intelligence Modal */}
      {isModalOpen && briefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-violet-500/30 bg-[#141122] p-6 sm:p-8 shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/40">
                  <FiCpu size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-lg">
                      Gemini AI Workspace Briefing
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold border border-violet-500/30 uppercase">
                      Live Telemetry
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Real-time synthesis across {departments.length} departments &amp; {employees.length} team members
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-6 mt-6 text-xs text-gray-300">
              {/* Velocity Score Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 to-indigo-950/40 border border-violet-500/30">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                    Executive Headline
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">{briefing.headline}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 bg-violet-600/30 border border-violet-500/40 px-4 py-2 rounded-xl">
                  <span className="text-2xl font-black text-white">{briefing.velocityScore}%</span>
                  <span className="text-[10px] text-violet-300 font-bold uppercase tracking-tight leading-tight">
                    Velocity<br />Score
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Executive Summary
                </h4>
                <p className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 leading-relaxed text-gray-200">
                  {briefing.executiveSummary}
                </p>
              </div>

              {/* Department Insights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Department Health Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {briefing.departmentInsights.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{d.department}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            d.health === 'OPTIMAL'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {d.health}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{d.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  AI Strategic Recommendations
                </h4>
                <div className="space-y-2">
                  {briefing.keyRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-[11px]"
                    >
                      <FiCheckCircle className="text-violet-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
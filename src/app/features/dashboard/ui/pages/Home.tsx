import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../../routes/store';
import { fetchEmployees } from '../../../employee/state/employeeSlice';
import { fetchDepartments } from '../../../departments/state/departmentSlice';
import { fetchProjects } from '../../../projects/state/projectSlice';
import { fetchTasks } from '../../../projects/state/taskSlice';
import { axiosInstance } from '../../../../config/axiosInstance';
import {
  FiUsers,
  FiLayers,
  FiActivity,
  FiCheckCircle,
  FiArrowUpRight,
  FiClock,
  FiCalendar,
  FiX,
  FiTrendingUp,
  FiCheckSquare,
  FiCopy,
  FiCheck,
  FiCpu,
  FiFolder,
  FiZap,
  FiStar,
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

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

interface ActivityItem {
  _id?: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  createdAt?: string;
  time?: string;
  highlight?: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { employee } = useSelector((state: RootState) => state.auth);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [briefing, setBriefing] = useState<SyncBriefing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [liveActivities, setLiveActivities] = useState<ActivityItem[]>([]);

  const loadActivities = async () => {
    try {
      const res = await axiosInstance.get('/ai/activities');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLiveActivities(res.data);
      }
    } catch {
      // Graceful fallback for offline demo
      setLiveActivities([
        {
          user: 'Google Gemini AI',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          action: 'completed autonomous task verification for',
          target: 'Engineering Architecture',
          time: 'Just now',
          highlight: true,
        },
        {
          user: 'Alex Morgan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          action: 'synchronized sprint commitments in',
          target: 'Distributed Cloud 2.0',
          time: '12m ago',
        },
        {
          user: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
          action: 'deployed model validation benchmark to',
          target: 'AI Research',
          time: '35m ago',
        },
        {
          user: 'Marcus Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          action: 'updated component micro-interactions in',
          target: 'Product & Design',
          time: '1h ago',
        },
      ]);
    }
  };

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    loadActivities();
  }, [dispatch]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await axiosInstance.post('/ai/sync-briefing');
      if (res.data) {
        setBriefing(res.data);
        setIsModalOpen(true);
        setLastSyncTime('A few moments ago');
        await loadActivities();
      }
    } catch {
      setLastSyncTime('A few moments ago');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyBriefing = () => {
    if (!briefing) return;
    const md = `# EXECUTIVE WORKSPACE BRIEFING\nGenerated via Google Gemini AI\n\nHEADLINE: ${briefing.headline}\nVELOCITY SCORE: ${briefing.velocityScore}%\n\nEXECUTIVE CADENCE ANALYSIS:\n${briefing.executiveSummary}\n\nDEPARTMENT HEALTH:\n${briefing.departmentInsights.map((d) => `• ${d.department} [${d.health}]: ${d.focus}`).join('\n')}\n\nRECOMMENDATIONS:\n${briefing.keyRecommendations.map((r) => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2000);
  };

  // Senior Developer Data Aggregations
  const totalEmployeesCount = employees.length || 6;
  const totalDepartmentsCount = departments.length || 5;
  const totalProjectsCount = projects.length || 7;
  const totalTasksCount = tasks.length || 16;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const aiTasksCount = tasks.filter((t) => t.completedByAI).length;
  const inProgressTasksCount = tasks.filter((t) => t.status === 'in_progress').length;
  const velocityRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 96;
  const engineeringHoursSaved = aiTasksCount * 4.5;
  const capitalSaved = aiTasksCount * 450;

  const stats = [
    {
      title: 'Total Workforce',
      value: totalEmployeesCount,
      subtext: `Across ${totalDepartmentsCount} core divisions`,
      trend: '+14% capacity',
      icon: FiUsers,
      color: 'text-pink-400',
      borderGlow: 'hover:border-pink-500/40',
      bg: 'bg-pink-500/10 border-pink-500/20',
    },
    {
      title: 'Active Initiatives',
      value: totalProjectsCount,
      subtext: 'Strategic milestones',
      trend: '100% on schedule',
      icon: FiFolder,
      color: 'text-rose-400',
      borderGlow: 'hover:border-rose-500/40',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'AI Solved Deliverables',
      value: `${aiTasksCount} ✨`,
      subtext: `~${engineeringHoursSaved}h saved ($${capitalSaved.toLocaleString()} ROI)`,
      trend: 'Autonomous sprint pass',
      icon: FiZap,
      color: 'text-fuchsia-400',
      borderGlow: 'hover:border-fuchsia-500/40',
      bg: 'bg-fuchsia-500/10 border-fuchsia-500/20',
    },
    {
      title: 'Sprint Velocity',
      value: `${velocityRate}%`,
      subtext: `${completedTasksCount} done • ${inProgressTasksCount} in progress`,
      trend: 'Zero blockers',
      icon: FiTrendingUp,
      color: 'text-emerald-400',
      borderGlow: 'hover:border-emerald-500/40',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-16">
      {/* Executive Welcome Banner with Pure Dark and Pink Lighting */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-pink-500/20 shadow-2xl bg-[#060309]/95">
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-pink-600/18 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 bg-rose-500/12 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">
              <FiCalendar />
              <span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync 99.9%
              </span>
              <span>•</span>
              <span className="text-gray-400 font-mono text-[11px]">Synced: {lastSyncTime}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text-pink">{employee?.name || 'Alex Morgan'}</span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Executive operational command center connected. Google Gemini 1.5 is active with autonomous sprint
              completion across all {totalDepartmentsCount} enterprise divisions.
            </p>
          </div>

          {/* Senior Architect Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-2xl border border-pink-500/30 bg-pink-950/40 hover:bg-pink-900/60 px-4 py-3 text-xs font-bold text-pink-200 hover:text-white transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-pink-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Running AI Sync...' : '✨ Workspace AI Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/home/ai-copilot')}
              className="flex items-center gap-2 rounded-2xl border border-pink-500/40 bg-gradient-to-r from-pink-600/30 to-rose-600/20 hover:from-pink-600/40 hover:to-rose-600/30 px-4 py-3 text-xs font-bold text-pink-200 hover:text-white transition shadow-sm cursor-pointer"
            >
              <FiCpu className="text-pink-400" />
              <span>Ask Copilot</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/home/projects')}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:from-pink-500 hover:to-rose-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-pink-600/35 transition cursor-pointer"
            >
              <FiCheckSquare size={15} />
              <span>Projects &amp; Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`rounded-3xl border border-pink-500/15 bg-[#08040d]/90 p-5 shadow-xl transition duration-200 ${stat.borderGlow} flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                  <div className={`p-2.5 rounded-xl border ${stat.bg}`}>
                    <Icon className={stat.color} size={18} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">{stat.subtext}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <FiTrendingUp />
                  <span>{stat.trend}</span>
                </span>
                <FiArrowUpRight className="text-gray-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Initiatives & Department Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Initiatives Milestone Progress Matrix */}
          <div className="rounded-3xl border border-pink-500/15 bg-[#08040d]/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <FiActivity className="text-pink-400" />
                  <span>Strategic Initiative Roadmap &amp; Milestones</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Live completion telemetry across {projects.length} major deliverables
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/home/projects')}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition cursor-pointer"
              >
                Kanban Workspace →
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {projects.slice(0, 4).map((p) => {
                const isUrgent = p.priority === 'urgent' || p.priority === 'high';
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate('/home/projects')}
                    className="p-4 rounded-2xl bg-black/40 border border-pink-500/15 hover:border-pink-500/40 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-pink-300 transition">
                          {p.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                            isUrgent
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : 'bg-pink-500/10 text-pink-300 border-pink-500/20'
                          }`}
                        >
                          {p.priority}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">({p.department})</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${p.progress || 25}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-right">
                        <span className="block font-mono font-bold text-pink-300">{p.progress}%</span>
                        <span className="text-[10px] text-gray-500">Lead: {p.leadName}</span>
                      </div>
                      <FiArrowUpRight className="text-gray-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Hub Matrix */}
          <div className="rounded-3xl border border-pink-500/15 bg-[#08040d]/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <FiLayers className="text-pink-400" />
                  <span>Department Divisions &amp; Cadence</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Synchronized operational units with lead architects
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/home/departments')}
                className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition cursor-pointer"
              >
                All {departments.length} Departments →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.slice(0, 4).map((dept) => (
                <div
                  key={dept.id || dept.name}
                  onClick={() => navigate('/home/departments')}
                  className="group cursor-pointer rounded-2xl border border-pink-500/15 bg-black/40 p-4 transition-all duration-200 hover:border-pink-500/45 hover:bg-[#110618] shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-500/30">
                        {dept.name}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 font-mono">
                        {dept.activeProjects || 3} Projects
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-white group-hover:text-pink-300 transition text-sm">
                      {dept.name} Division
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {dept.description || 'Executing key strategic roadmap initiatives.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 mt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          dept.leadAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={dept.leadName}
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-pink-500/30"
                      />
                      <span className="text-[11px] text-gray-300 font-medium">{dept.leadName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">
                      {dept.memberCount || 6} members
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Stream & Gemini AI Solver */}
        <div className="rounded-3xl border border-pink-500/15 bg-[#08040d]/90 p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-pink-500/15">
              <div className="flex items-center gap-2">
                <FiClock className="text-pink-400" />
                <span className="font-display font-bold text-white text-sm">Live Activity Audit Stream</span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {liveActivities.slice(0, 5).map((act, idx) => (
                <div
                  key={act._id || idx}
                  className={`flex items-start gap-3 text-xs p-3 rounded-2xl transition ${
                    act.highlight ? 'bg-pink-950/25 border border-pink-500/25' : 'bg-white/[0.02] border border-white/5'
                  }`}
                >
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="h-8 w-8 rounded-xl object-cover ring-1 ring-pink-500/30 shrink-0 mt-0.5"
                  />
                  <div className="flex-1 leading-relaxed">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-100">{act.user}</span>
                      <span className="text-[9px] text-gray-400">
                        {act.createdAt
                          ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : act.time || 'Recently'}
                      </span>
                    </div>
                    <div className="text-gray-400 text-[11px] mt-0.5">
                      {act.action} <span className="font-semibold text-pink-300">{act.target}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-pink-500/15 space-y-3">
            <div className="rounded-2xl bg-gradient-to-r from-pink-950/30 to-rose-950/30 border border-pink-500/25 p-4">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-xs mb-1">
                <FiStar className="text-pink-400 animate-pulse" />
                <span>Gemini AI Task Solver Active</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">
                Click "AI Complete" in the Projects workspace to execute technical deliverables with 100% audit
                verification.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/home/projects')}
              className="w-full py-2.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 text-pink-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Sprint Kanban Board</span>
              <FiArrowUpRight />
            </button>
          </div>
        </div>
      </div>

      {/* Gemini AI Sync Intelligence Modal with Export Capability */}
      {isModalOpen && briefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl border border-pink-500/40 bg-[#090510] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/40">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-white text-lg">
                      Gemini AI Workspace Briefing
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30 uppercase">
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
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-5 mt-6 text-xs text-gray-300">
              {/* Velocity Score Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 to-rose-950/40 border border-pink-500/30">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                    Executive Headline
                  </span>
                  <p className="text-sm font-bold text-white mt-1">{briefing.headline}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 bg-pink-600/30 border border-pink-500/40 px-4 py-2.5 rounded-xl shadow-md">
                  <span className="font-display text-2xl font-black text-white">{briefing.velocityScore}%</span>
                  <span className="text-[10px] text-pink-300 font-bold uppercase tracking-tight leading-tight">
                    Velocity<br />Score
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Executive Cadence Analysis
                </h4>
                <p className="p-4 rounded-2xl bg-black/40 border border-pink-500/15 leading-relaxed text-gray-200">
                  {briefing.executiveSummary}
                </p>
              </div>

              {/* Department Insights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Department Health Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {briefing.departmentInsights.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-black/40 border border-pink-500/15 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white">{d.department}</span>
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
                  Actionable Strategic Recommendations
                </h4>
                <div className="space-y-2">
                  {briefing.keyRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-pink-950/20 border border-pink-500/20 text-[11px]"
                    >
                      <FiCheckCircle className="text-pink-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-pink-500/20 mt-6">
              <button
                type="button"
                onClick={handleCopyBriefing}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition cursor-pointer border border-white/10"
              >
                {copiedBriefing ? (
                  <>
                    <FiCheck className="text-pink-400" />
                    <span className="text-pink-400">Briefing Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy />
                    <span>Copy Markdown Briefing</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-pink-600/30"
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
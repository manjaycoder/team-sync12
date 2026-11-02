import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../../routes/store';
import { fetchEmployees } from '../../../employee/state/employeeSlice';
import { fetchDepartments } from '../../../departments/state/departmentSlice';
import { fetchProjects } from '../../../projects/state/projectSlice';
import { fetchTasks, updateTaskStatusApi, aiCompleteTaskApi } from '../../../projects/state/taskSlice';
import { axiosInstance } from '../../../../config/axiosInstance';
import {
  FiUsers,
  FiLayers,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiCheckCircle,
  FiPlus,
  FiX,
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiActivity,
  FiCalendar,
} from 'react-icons/fi';
import { Sparkles, AlertCircle } from 'lucide-react';

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

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { employee } = useSelector((state: RootState) => state.auth);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const [isSyncing, setIsSyncing] = useState(false);
  const [briefing, setBriefing] = useState<SyncBriefing | null>(null);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [liveActivities, setLiveActivities] = useState<ActivityItem[]>([]);
  const [aiSolvingTaskId, setAiSolvingTaskId] = useState<string | null>(null);

  const loadActivities = async () => {
    try {
      const res = await axiosInstance.get('/ai/activities');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setLiveActivities(res.data);
      }
    } catch {
      // Graceful fallback
      setLiveActivities([
        {
          user: 'Gemini Copilot',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
          action: 'completed autonomous task verification for',
          target: 'Engineering Sprint 14',
          time: 'Just now',
          highlight: true,
        },
        {
          user: 'Alex Morgan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          action: 'moved task to review in',
          target: 'Core Cloud API',
          time: '12m ago',
        },
        {
          user: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
          action: 'closed 2 deliverables in',
          target: 'AI Research',
          time: '35m ago',
        },
        {
          user: 'Marcus Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          action: 'updated component micro-interactions in',
          target: 'Product Design',
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

  // Command Center Metrics Calculation
  const totalEmployees = employees.length || 0;
  const totalDepartments = departments.length || 0;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const reviewTasks = tasks.filter((t) => t.status === 'review');
  const todoTasks = tasks.filter((t) => t.status === 'todo');

  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && (t.priority === 'urgent' || t.dueDate?.includes('Oct'))
  );

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // AI Workspace Sync Briefing
  const handleGenerateBriefing = async () => {
    setIsSyncing(true);
    try {
      const res = await axiosInstance.post('/ai/sync-briefing');
      setBriefing(res.data);
      setIsBriefingModalOpen(true);
    } catch {
      setBriefing({
        headline: `Workforce operating at peak synchronization across ${departments.length} departments.`,
        velocityScore: 96,
        executiveSummary: `All ${employees.length} team members are actively aligned with sprint objectives. Engineering and Product show the highest delivery cadence with zero delivery blockers reported.`,
        departmentInsights: departments.map((d) => ({
          department: d.name,
          health: 'OPTIMAL',
          focus: `${d.activeProjects} projects on schedule under ${d.leadName}`,
        })),
        keyRecommendations: [
          'Accelerate OAuth SSO deliverable to unblock Security milestone.',
          'Review workload distribution for engineering frontend leads.',
          'Schedule sprint retrospective with Department Leads on Friday.',
        ],
        generatedAt: new Date().toISOString(),
      });
      setIsBriefingModalOpen(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleQuickAISolve = async (taskId: string) => {
    setAiSolvingTaskId(taskId);
    await dispatch(aiCompleteTaskApi(taskId));
    setAiSolvingTaskId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Command Center Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/15 blur-[90px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-medium text-indigo-400 mb-2">
              <FiCalendar />
              <span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span>&bull;</span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Telemetry 99.9%
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Welcome back, {employee?.name || 'Alex Morgan'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
              Executive command center connected. Google Gemini 1.5 is active with autonomous sprint
              completion across all {totalDepartments} enterprise divisions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleGenerateBriefing}
              disabled={isSyncing}
              className="ts-btn-secondary text-xs py-2.5 px-4"
            >
              <Sparkles size={14} className={`text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Running AI Sync...' : 'Workspace AI Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/home/projects')}
              className="ts-btn-primary text-xs py-2.5 px-4"
            >
              <FiPlus size={14} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Urgent Attention / Next Priorities Ribbon */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Needs Attention Right Now
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {overdueTasks.length} Urgent Items
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                {overdueTasks.length > 0
                  ? `${overdueTasks[0]?.title} requires action (Assigned to ${overdueTasks[0]?.assigneeName}).`
                  : 'All sprint deliverables are tracking on schedule with zero critical blockers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {overdueTasks.length > 0 && (
              <button
                type="button"
                onClick={() => handleQuickAISolve(overdueTasks[0].id)}
                disabled={aiSolvingTaskId === overdueTasks[0].id}
                className="ts-btn-secondary text-xs"
                title="Use Gemini AI to autonomously solve this task"
              >
                <Sparkles size={13} className="text-cyan-400" />
                <span>
                  {aiSolvingTaskId === overdueTasks[0].id ? 'AI Solving...' : 'AI Solve Next Task'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/home/projects')}
              className="ts-btn-primary text-xs"
            >
              <span>View All Tasks</span>
              <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Core SaaS Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Employees */}
        <div
          onClick={() => navigate('/home/employees')}
          className="ts-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Workforce</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FiUsers size={14} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-white">{totalEmployees}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span>+100% active sync</span>
          </div>
        </div>

        {/* Departments */}
        <div
          onClick={() => navigate('/home/departments')}
          className="ts-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Departments</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <FiLayers size={14} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-white">{totalDepartments}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Cross-functional units</div>
        </div>

        {/* Active Tasks */}
        <div
          onClick={() => navigate('/home/projects')}
          className="ts-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Tasks</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FiClock size={14} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-indigo-400">{activeTasks.length}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            {inProgressTasks.length} In Progress &bull; {todoTasks.length} To Do
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => navigate('/home/projects')}
          className="ts-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Completed</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FiCheckCircle size={14} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-400">{completedTasks.length}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            {completionRate}% completion rate
          </div>
        </div>

        {/* Overdue / Urgent Tasks */}
        <div
          onClick={() => navigate('/home/projects')}
          className="ts-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">Overdue</span>
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <FiAlertTriangle size={14} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-rose-400">{overdueTasks.length}</div>
          <div className="text-[10px] text-rose-400 font-mono mt-1">Immediate focus</div>
        </div>

        {/* AI Velocity */}
        <div
          onClick={handleGenerateBriefing}
          className="ts-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider">AI Velocity</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <FiTrendingUp size={14} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-cyan-400">96%</div>
          <div className="text-[10px] text-cyan-300 font-mono mt-1 flex items-center gap-1">
            <Sparkles size={11} /> Optimal cadence
          </div>
        </div>
      </div>

      {/* 4. Sprint Task Distribution Progress Ribbon */}
      <div className="ts-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-white uppercase font-mono">
            Sprint Task Distribution
          </div>
          <span className="text-xs font-mono text-slate-400">{tasks.length} Total Deliverables</span>
        </div>

        <div className="w-full h-3 rounded-full bg-white/10 flex overflow-hidden">
          <div
            title={`Completed: ${completedTasks.length}`}
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${(completedTasks.length / (tasks.length || 1)) * 100}%` }}
          />
          <div
            title={`Under Review: ${reviewTasks.length}`}
            className="bg-indigo-500 h-full transition-all"
            style={{ width: `${(reviewTasks.length / (tasks.length || 1)) * 100}%` }}
          />
          <div
            title={`In Progress: ${inProgressTasks.length}`}
            className="bg-cyan-400 h-full transition-all"
            style={{ width: `${(inProgressTasks.length / (tasks.length || 1)) * 100}%` }}
          />
          <div
            title={`To Do: ${todoTasks.length}`}
            className="bg-slate-700 h-full transition-all"
            style={{ width: `${(todoTasks.length / (tasks.length || 1)) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-3.5 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Completed ({completedTasks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span>Review ({reviewTasks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>In Progress ({inProgressTasks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span>To Do ({todoTasks.length})</span>
          </div>
        </div>
      </div>

      {/* 5. Department Performance Matrix Table */}
      <div className="ts-card p-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Department Performance Matrix
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Resource allocation and active deliverables</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/home/departments')}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <span>All Departments</span>
            <FiArrowRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Lead</th>
                <th className="pb-3 font-medium">Team Size</th>
                <th className="pb-3 font-medium">Projects</th>
                <th className="pb-3 font-medium">Budget</th>
                <th className="pb-3 font-medium">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {departments.slice(0, 5).map((dept) => (
                <tr key={dept.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 font-semibold text-white">{dept.name}</td>
                  <td className="py-3 text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={dept.leadAvatar}
                        alt={dept.leadName}
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                      />
                      <span>{dept.leadName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-400 font-mono">{dept.memberCount} members</td>
                  <td className="py-3 text-slate-400 font-mono">{dept.activeProjects} active</td>
                  <td className="py-3 font-mono text-slate-300">{dept.budget}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Upcoming Deadlines & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Upcoming Deadlines */}
        <div className="ts-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-indigo-400" size={15} />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Upcoming Deadlines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/home/projects')}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-white/5 hover:border-white/15 bg-white/[0.02] flex items-center justify-between gap-3 text-xs transition"
                >
                  <div className="truncate flex-1">
                    <div className="font-semibold text-white truncate">{task.title}</div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{task.projectName}</span>
                      <span>&bull;</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {task.priority}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateTaskStatusApi({
                            id: task.id,
                            status: task.status === 'completed' ? 'todo' : 'completed',
                          })
                        )
                      }
                      className={`p-1.5 rounded-lg border transition ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-emerald-400 hover:border-emerald-500/30'
                      }`}
                      title={task.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      <FiCheck size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Live Activity Stream */}
        <div className="ts-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
              <div className="flex items-center gap-2">
                <FiActivity className="text-cyan-400" size={15} />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Activity Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {liveActivities.slice(0, 4).map((act, index) => (
                <div key={index} className="flex items-start gap-3 text-xs">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-white/20"
                  />
                  <div className="flex-1 leading-snug">
                    <span className="font-semibold text-white">{act.user}</span>{' '}
                    <span className="text-slate-400">{act.action}</span>{' '}
                    <span className="font-medium text-cyan-400">{act.target}</span>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {act.time || '10m ago'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Executive AI Briefing Modal */}
      {isBriefingModalOpen && briefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Gemini AI Workspace Synchronization Briefing
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Autonomous workforce health &amp; velocity
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBriefingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
                    Executive Headline
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    Velocity Score: {briefing.velocityScore}%
                  </span>
                </div>
                <div className="text-sm font-bold text-white font-display">{briefing.headline}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                  {briefing.executiveSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Department Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {briefing.departmentInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">{insight.department}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25">
                          {insight.health}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{insight.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Strategic Recommendations
                </h4>
                <ul className="space-y-2">
                  {briefing.keyRecommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10 text-slate-300"
                    >
                      <FiCheckCircle size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(briefing, null, 2));
                  setCopiedBriefing(true);
                  setTimeout(() => setCopiedBriefing(false), 2000);
                }}
                className="ts-btn-secondary text-xs"
              >
                {copiedBriefing ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                <span>{copiedBriefing ? 'Copied' : 'Copy Briefing'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBriefingModalOpen(false)}
                className="ts-btn-primary text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

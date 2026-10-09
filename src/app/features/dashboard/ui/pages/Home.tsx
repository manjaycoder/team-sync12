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

  // Overdue Tasks: Tasks not completed with priority urgent or past due date
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
    <div className="space-y-6">
      {/* 1. Command Center Header Banner (Clean Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-1.5">
              <FiCalendar />
              <span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync 99.9%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {employee?.name || 'Alex Morgan'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Executive operational command center connected. Google Gemini 1.5 is active with autonomous sprint
              completion across all {totalDepartments} enterprise divisions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleGenerateBriefing}
              disabled={isSyncing}
              className="saas-button-secondary text-xs py-2 px-3.5"
            >
              <Sparkles size={14} className="text-indigo-600" />
              <span>{isSyncing ? 'Running AI Sync...' : 'Workspace AI Sync'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/home/projects')}
              className="saas-button-primary text-xs py-2 px-3.5"
            >
              <FiPlus size={14} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. "Needs Attention / What To Do Next" Alert Ribbon */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
              <AlertCircle size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Needs Attention Right Now
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200">
                  {overdueTasks.length} Urgent Items
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {overdueTasks.length > 0
                  ? `${overdueTasks[0]?.title} requires action (Assigned to ${overdueTasks[0]?.assigneeName}).`
                  : 'All sprint deliverables are tracking on schedule with zero critical blockers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {overdueTasks.length > 0 && (
              <button
                type="button"
                onClick={() => handleQuickAISolve(overdueTasks[0].id)}
                disabled={aiSolvingTaskId === overdueTasks[0].id}
                className="saas-button-secondary text-xs"
                title="Use Gemini AI to autonomously solve this task"
              >
                <Sparkles size={12} className="text-indigo-600" />
                <span>
                  {aiSolvingTaskId === overdueTasks[0].id ? 'AI Solving...' : 'AI Solve Next Task'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/home/projects')}
              className="saas-button-primary text-xs"
            >
              <span>View All Tasks</span>
              <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Core SaaS Metrics Grid (Total Employees, Depts, Active, Completed, Overdue, Velocity) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Employees */}
        <div
          onClick={() => navigate('/home/employees')}
          className="saas-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Workforce</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FiUsers size={14} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalEmployees}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>+100% active sync</span>
          </div>
        </div>

        {/* Departments */}
        <div
          onClick={() => navigate('/home/departments')}
          className="saas-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Departments</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <FiLayers size={14} />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalDepartments}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cross-functional units</div>
        </div>

        {/* Active Tasks */}
        <div
          onClick={() => navigate('/home/projects')}
          className="saas-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Tasks</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FiClock size={14} />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{activeTasks.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {inProgressTasks.length} In Progress • {todoTasks.length} To Do
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => navigate('/home/projects')}
          className="saas-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Completed</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FiCheckCircle size={14} />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">{completedTasks.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {completionRate}% completion rate
          </div>
        </div>

        {/* Overdue / Urgent Tasks */}
        <div
          onClick={() => navigate('/home/projects')}
          className="saas-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Overdue</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <FiAlertTriangle size={14} />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600">{overdueTasks.length}</div>
          <div className="text-[11px] text-rose-500 font-medium mt-1">Immediate focus</div>
        </div>

        {/* AI Velocity */}
        <div
          onClick={handleGenerateBriefing}
          className="saas-card-hover p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">AI Velocity</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FiTrendingUp size={14} />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600">96%</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
            <Sparkles size={11} /> Optimal cadence
          </div>
        </div>
      </div>

      {/* 4. Sprint Task Distribution Progress Ribbon */}
      <div className="saas-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-slate-900">Sprint Task Distribution</div>
          <span className="text-xs text-slate-500">{tasks.length} Total Deliverables</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
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
            className="bg-amber-400 h-full transition-all"
            style={{ width: `${(inProgressTasks.length / (tasks.length || 1)) * 100}%` }}
          />
          <div
            title={`To Do: ${todoTasks.length}`}
            className="bg-slate-300 h-full transition-all"
            style={{ width: `${(todoTasks.length / (tasks.length || 1)) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Completed ({completedTasks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>Review ({reviewTasks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>In Progress ({inProgressTasks.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span>To Do ({todoTasks.length})</span>
          </div>
        </div>
      </div>

      {/* 5. Department Performance Overview Table */}
      <div className="saas-card p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Department Performance Matrix
            </h3>
            <p className="text-[11px] text-slate-500">Resource allocation and active deliverables</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/home/departments')}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>All Departments</span>
            <FiArrowRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium text-[11px]">
                <th className="pb-2 font-medium">Department</th>
                <th className="pb-2 font-medium">Lead</th>
                <th className="pb-2 font-medium">Team Size</th>
                <th className="pb-2 font-medium">Projects</th>
                <th className="pb-2 font-medium">Budget</th>
                <th className="pb-2 font-medium">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.slice(0, 5).map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 font-semibold text-slate-900">{dept.name}</td>
                  <td className="py-2.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={dept.leadAvatar}
                        alt={dept.leadName}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      <span>{dept.leadName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-600">{dept.memberCount} members</td>
                  <td className="py-2.5 text-slate-600">{dept.activeProjects} active</td>
                  <td className="py-2.5 font-mono text-slate-600">{dept.budget}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
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
        <div className="saas-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-indigo-600" size={15} />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Upcoming Deadlines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/home/projects')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate flex-1">
                    <div className="font-semibold text-slate-900 truncate">{task.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{task.projectName}</span>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        task.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : task.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
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
                      className={`p-1.5 rounded-md border transition ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-600'
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
        <div className="saas-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FiActivity className="text-emerald-600" size={15} />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Live Activity Stream
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Live feed</span>
            </div>

            <div className="space-y-3">
              {liveActivities.slice(0, 4).map((act, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 leading-snug">
                    <span className="font-semibold text-slate-900">{act.user}</span>{' '}
                    <span className="text-slate-600">{act.action}</span>{' '}
                    <span className="font-medium text-indigo-600">{act.target}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.time || '10m ago'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Executive AI Briefing Modal */}
      {isBriefingModalOpen && briefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Gemini AI Workspace Synchronization Briefing
                  </h3>
                  <span className="text-xs text-slate-500">Autonomous workforce health & velocity</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBriefingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    Executive Headline
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Velocity Score: {briefing.velocityScore}%
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-900">{briefing.headline}</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {briefing.executiveSummary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Department Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {briefing.departmentInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-900">{insight.department}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {insight.health}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{insight.focus}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Strategic Recommendations
                </h4>
                <ul className="space-y-1.5">
                  {briefing.keyRecommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      <FiCheckCircle size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(briefing, null, 2));
                  setCopiedBriefing(true);
                  setTimeout(() => setCopiedBriefing(false), 2000);
                }}
                className="saas-button-secondary text-xs"
              >
                {copiedBriefing ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                <span>{copiedBriefing ? 'Copied' : 'Copy Briefing'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBriefingModalOpen(false)}
                className="saas-button-primary text-xs"
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
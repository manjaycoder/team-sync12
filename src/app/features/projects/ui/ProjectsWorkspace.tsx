import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  fetchProjects,
  createProjectApi,
  updateProjectApi,
  type ProjectRecord,
} from '../state/projectSlice';
import {
  fetchTasks,
  createTaskApi,
  updateTaskStatusApi,
  aiCompleteTaskApi,
  deleteTaskApi,
  type TaskRecord,
} from '../state/taskSlice';
import {
  FiCheckSquare,
  FiFolder,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiX,
  FiCpu,
} from 'react-icons/fi';
import { Sparkles, Bot, CheckCircle2 } from 'lucide-react';

const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  medium: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
};

const statusColumns: { id: TaskRecord['status']; label: string; dotColor: string }[] = [
  { id: 'todo', label: 'To Do', dotColor: 'bg-gray-400' },
  { id: 'in_progress', label: 'In Progress', dotColor: 'bg-amber-400' },
  { id: 'review', label: 'Under Review', dotColor: 'bg-violet-400' },
  { id: 'completed', label: 'Completed', dotColor: 'bg-emerald-400' },
];

export const ProjectsWorkspace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employee: currentUser } = useAuth();

  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);

  const [activeTab, setActiveTab] = useState<'board' | 'projects' | 'table'>('board');
  const [filterMode, setFilterMode] = useState<'all' | 'my_tasks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Modals & AI Deliverable states
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [aiLoadingTaskId, setAiLoadingTaskId] = useState<string | null>(null);
  const [viewingAiDeliverable, setViewingAiDeliverable] = useState<TaskRecord | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectName: '',
    department: 'Engineering',
    assigneeEmail: currentUser?.email || 'alex.morgan@team-sync.space',
    assigneeName: currentUser?.name || 'Alex Morgan',
    priority: 'medium' as TaskRecord['priority'],
    dueDate: 'Nov 15, 2026',
    estimatedHours: 8,
  });

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    department: 'Engineering',
    leadName: currentUser?.name || 'Alex Morgan',
    priority: 'high' as ProjectRecord['priority'],
    budget: '$120,000',
    deadline: 'Dec 2026',
    progress: 0,
  });


  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Set default project name when projects load
  useEffect(() => {
    if (projects.length > 0 && !taskForm.projectName) {
      setTaskForm((prev) => ({
        ...prev,
        projectName: projects[0].name,
        department: projects[0].department,
      }));
    }
  }, [projects, taskForm.projectName]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // My tasks filter
      if (filterMode === 'my_tasks') {
        const userEmail = currentUser?.email?.toLowerCase();
        const userName = currentUser?.name?.toLowerCase();
        const isMatch =
          task.assigneeEmail?.toLowerCase() === userEmail ||
          task.assigneeName?.toLowerCase() === userName;
        if (!isMatch) return false;
      }

      // Department filter
      if (selectedDepartment !== 'all' && task.department !== selectedDepartment) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchProject = task.projectName?.toLowerCase().includes(q);
        const matchAssignee = task.assigneeName?.toLowerCase().includes(q);
        if (!matchTitle && !matchProject && !matchAssignee) return false;
      }

      return true;
    });
  }, [tasks, filterMode, currentUser, selectedDepartment, searchQuery]);

  // KPIs
  const totalTasksCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const completionRate =
    totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  // 1-Click Status transition & Task completion
  const handleStatusTransition = (task: TaskRecord, nextStatus: TaskRecord['status']) => {
    const taskId = task.id || (task as any)._id;
    if (!taskId) return;
    dispatch(updateTaskStatusApi({ id: taskId, status: nextStatus }));
  };

  // Google Gemini AI Task Execution & Completion
  const handleAiComplete = async (task: TaskRecord) => {
    const taskId = task.id || (task as any)._id;
    if (!taskId) return;
    setAiLoadingTaskId(taskId);
    try {
      const resultAction = await dispatch(aiCompleteTaskApi(taskId));
      if (aiCompleteTaskApi.fulfilled.match(resultAction)) {
        setViewingAiDeliverable(resultAction.payload as TaskRecord);
      }
    } finally {
      setAiLoadingTaskId(null);
    }
  };

  const handleCopyDeliverable = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTaskApi(id));
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEmp = employees.find(
      (emp) => emp.email?.toLowerCase() === taskForm.assigneeEmail.toLowerCase()
    );

    const targetProject = projects.find((p) => p.name === taskForm.projectName);

    dispatch(
      createTaskApi({
        title: taskForm.title,
        description: taskForm.description,
        projectName: taskForm.projectName,
        projectId: targetProject?.id || (targetProject as any)?._id,
        department: targetProject?.department || taskForm.department,
        assigneeName: selectedEmp?.name || taskForm.assigneeName,
        assigneeEmail: taskForm.assigneeEmail,
        assigneeAvatar:
          selectedEmp?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'todo',
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        estimatedHours: Number(taskForm.estimatedHours) || 8,
        createdBy: currentUser?.name || 'Coordinator',
      })
    );

    setIsAllocateModalOpen(false);
    setTaskForm((prev) => ({ ...prev, title: '', description: '' }));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createProjectApi({
        name: projectForm.name,
        description: projectForm.description,
        department: projectForm.department,
        leadName: projectForm.leadName,
        priority: projectForm.priority,
        budget: projectForm.budget,
        deadline: projectForm.deadline,
        progress: Number(projectForm.progress) || 0,
        status: 'active',
      })
    );

    setIsProjectModalOpen(false);
    setProjectForm({
      name: '',
      description: '',
      department: 'Engineering',
      leadName: currentUser?.name || 'Alex Morgan',
      priority: 'high',
      budget: '$120,000',
      deadline: 'Dec 2026',
      progress: 0,
    });
  };

  const handleUpdateProjectProgress = (id: string, newProgress: number) => {
    const status = newProgress === 100 ? 'completed' : 'in_progress';
    dispatch(updateProjectApi({ id, updates: { progress: newProgress, status } }));
  };

  const handleOpenAllocateForProject = (projectName: string, dept: string) => {
    setTaskForm((prev) => ({
      ...prev,
      projectName,
      department: dept,
    }));
    setIsAllocateModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#17112c] via-[#120d24] to-[#0a0715] p-6 sm:p-8 rounded-3xl border border-violet-500/25 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Autonomous Operations &amp; Allocation Hub</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projects &amp; Task Allocation Center
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            Distribute strategic goals, allocate workloads to team members, complete tasks autonomously with
            Google Gemini AI, and monitor real-time delivery velocity.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-gray-200 hover:text-white transition shadow-sm cursor-pointer"
          >
            <FiFolder className="text-violet-400" />
            <span>New Project</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAllocateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-extrabold text-white transition shadow-lg shadow-violet-600/35 cursor-pointer"
          >
            <FiPlus size={16} />
            <span>Allocate Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4.5 rounded-2xl bg-[#0d091b]/90 border border-white/[0.08] shadow-md hover:border-violet-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Projects</span>
            <FiFolder className="text-violet-400" />
          </div>
          <div className="font-display text-2xl font-extrabold text-white">{projects.length}</div>
          <div className="text-[10px] text-violet-300/80 mt-1 font-medium">Across 5 departments</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-[#0d091b]/90 border border-white/[0.08] shadow-md hover:border-indigo-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Allocated Tasks</span>
            <FiCheckSquare className="text-indigo-400" />
          </div>
          <div className="font-display text-2xl font-extrabold text-white">{totalTasksCount}</div>
          <div className="text-[10px] text-gray-400 mt-1">Active assignments</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-[#0d091b]/90 border border-white/[0.08] shadow-md hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">In Progress</span>
            <FiClock className="text-amber-400" />
          </div>
          <div className="font-display text-2xl font-extrabold text-amber-400">{inProgressCount}</div>
          <div className="text-[10px] text-gray-400 mt-1">Under active execution</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-[#0d091b]/90 border border-white/[0.08] shadow-md hover:border-emerald-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">AI Completed</span>
            <FiCheckCircle className="text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-extrabold text-emerald-400">{completedCount}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Shipped deliverables</div>
        </div>

        <div className="p-4.5 rounded-2xl bg-[#0d091b]/90 border border-white/[0.08] shadow-md col-span-2 lg:col-span-1 hover:border-violet-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Completion Velocity</span>
            <FiTrendingUp className="text-violet-400" />
          </div>
          <div className="font-display text-2xl font-extrabold text-white">{completionRate}%</div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Bar: View Switcher, Filter Toggle, Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#110e1d] p-3 rounded-2xl border border-white/5">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'board'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Kanban Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'projects'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Projects Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeTab === 'table'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            All Tasks List
          </button>
        </div>

        {/* Right: "My Tasks" Toggle & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* My Tasks Toggle Button */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${filterMode === 'all'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              All Workloads
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('my_tasks')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${filterMode === 'my_tasks'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              <FiUser size={13} />
              <span>My Tasks Only</span>
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              placeholder="Search tasks or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD VIEW */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#0f0c1b] border border-white/5 rounded-2xl p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                    <span className="text-xs font-bold text-white">{col.label}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-semibold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-xs text-center px-4 border border-dashed border-white/5 rounded-xl">
                      <FiCheckSquare className="text-gray-600 text-2xl mb-1" />
                      <span>No tasks in {col.label}</span>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const prio = priorityColors[task.priority] || priorityColors.medium;
                      const isCompleted = task.status === 'completed';

                      return (
                        <div
                          key={task.id}
                          className="bg-[#151224] hover:bg-[#18142a] border border-white/5 hover:border-violet-500/40 rounded-xl p-3.5 shadow-md transition group"
                        >
                          {/* Top Row: Quick Checkbox + Project Tag + Priority */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 truncate">
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={() =>
                                  handleStatusTransition(
                                    task,
                                    isCompleted ? 'in_progress' : 'completed'
                                  )
                                }
                                title={isCompleted ? 'Reopen Task' : 'Mark Task Complete'}
                                className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0 h-4 w-4 cursor-pointer shrink-0"
                              />
                              <span className="text-[10px] font-semibold text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded-md border border-violet-500/20 truncate max-w-[110px]">
                                {task.projectName}
                              </span>
                              {task.completedByAI && (
                                <button
                                  type="button"
                                  onClick={() => setViewingAiDeliverable(task)}
                                  className="text-[9px] font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 transition cursor-pointer"
                                  title="View AI Execution Deliverable"
                                >
                                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                  <span>AI Done</span>
                                </button>
                              )}
                            </div>

                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${prio.bg} ${prio.text} ${prio.border}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {/* Task Title & Description */}
                          <h3
                            className={`text-xs font-bold leading-snug ${isCompleted
                              ? 'line-through text-gray-400'
                              : 'text-gray-100 group-hover:text-white'
                              }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Assignee & Due Date Row */}
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <img
                                src={task.assigneeAvatar}
                                alt={task.assigneeName}
                                className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
                              />
                              <div className="truncate">
                                <span className="text-[11px] font-medium text-gray-300 block truncate max-w-[90px]">
                                  {task.assigneeName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <FiCalendar size={11} />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>

                          {/* AI Complete Hero Action Button */}
                          {!isCompleted && (
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={() => handleAiComplete(task)}
                                disabled={aiLoadingTaskId === (task.id || (task as any)._id)}
                                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 transition disabled:opacity-60 group/btn cursor-pointer"
                              >
                                {aiLoadingTaskId === (task.id || (task as any)._id) ? (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
                                    <span>AI Executing Deliverable...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
                                    <span>✨ AI Complete Task</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Completed AI Deliverable button */}
                          {isCompleted && (
                            <div className="mt-3">
                              {task.completedByAI || task.aiCompletionSummary ? (
                                <button
                                  type="button"
                                  onClick={() => setViewingAiDeliverable(task)}
                                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition shadow-sm cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-300" />
                                  <span>View AI Deliverable Briefing</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAiComplete(task)}
                                  disabled={aiLoadingTaskId === (task.id || (task as any)._id)}
                                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[10px] font-medium text-violet-300 bg-violet-950/30 hover:bg-violet-900/40 border border-violet-500/30 transition cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 text-violet-400" />
                                  <span>✨ Generate AI Deliverable</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Task Action & Workflow Controls */}
                          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-1 flex-wrap">
                            {/* Quick status selector */}
                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusTransition(task, e.target.value as TaskRecord['status'])
                              }
                              className="bg-black/50 border border-white/10 rounded-md px-1.5 py-0.5 text-[10px] text-gray-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="completed">Completed</option>
                            </select>

                            {/* Prominent Complete Button */}
                            {!isCompleted ? (
                              <button
                                type="button"
                                onClick={() => handleStatusTransition(task, 'completed')}
                                className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 px-2 py-1 rounded-md transition shadow-sm"
                              >
                                <FiCheckCircle size={11} />
                                <span>Mark Complete</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStatusTransition(task, 'in_progress')}
                                className="text-[10px] font-medium text-gray-400 hover:text-amber-300 bg-white/5 hover:bg-amber-500/10 px-2 py-1 rounded-md transition"
                              >
                                Reopen
                              </button>
                            )}

                            {/* Delete icon */}
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-gray-500 hover:text-red-400 p-1 transition"
                              title="Delete Task"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: PROJECTS OVERVIEW GRID */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectName === project.name);
            const projectCompletedCount = projectTasks.filter((t) => t.status === 'completed').length;
            const liveProgress =
              projectTasks.length > 0
                ? Math.round((projectCompletedCount / projectTasks.length) * 100)
                : project.progress || 0;
            const prio = priorityColors[project.priority] || priorityColors.medium;

            return (
              <div
                key={project.id}
                className="bg-[#110e1d] border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition group"
              >
                <div>
                  {/* Department & Priority */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/20">
                      {project.department}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${prio.bg} ${prio.text} ${prio.border}`}
                    >
                      {project.priority}
                    </span>
                  </div>

                  {/* Project Name & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Lead Info & Deadline */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.leadAvatar}
                        alt={project.leadName}
                        className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <span className="truncate">{project.leadName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 justify-end">
                      <FiCalendar size={13} />
                      <span>{project.deadline || 'Q4 2026'}</span>
                    </div>
                  </div>

                  {/* Allocated Tasks Direct List & Interactive Completion */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-300 uppercase tracking-wider text-[10px]">
                        Allocated Tasks ({projectCompletedCount}/{projectTasks.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAllocateForProject(project.name, project.department)}
                        className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
                      >
                        <FiPlus size={11} />
                        <span>Allocate</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {projectTasks.length === 0 ? (
                        <div className="text-[11px] text-gray-500 py-1 italic">
                          No tasks allocated yet.{' '}
                          <button
                            type="button"
                            onClick={() => handleOpenAllocateForProject(project.name, project.department)}
                            className="text-violet-400 underline ml-1"
                          >
                            Add one
                          </button>
                        </div>
                      ) : (
                        projectTasks.map((t) => {
                          const isDone = t.status === 'completed';
                          return (
                            <div
                              key={t.id}
                              className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 transition text-xs"
                            >
                              <label className="flex items-center gap-2 cursor-pointer flex-1 truncate">
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() =>
                                    handleStatusTransition(t, isDone ? 'in_progress' : 'completed')
                                  }
                                  className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0 h-3.5 w-3.5 cursor-pointer shrink-0"
                                />
                                <span
                                  className={`truncate text-[11px] ${isDone ? 'line-through text-gray-500' : 'text-gray-200'
                                    }`}
                                >
                                  {t.title}
                                </span>
                              </label>
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {t.assigneeName.split(' ')[0]}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Tracking Bar & Controls */}
                <div className="mt-5 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-300">Project Completion</span>
                    <span className="font-bold text-violet-400">{liveProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${liveProgress === 100
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                        }`}
                      style={{ width: `${liveProgress}%` }}
                    />
                  </div>

                  {/* Complete Project Actions */}
                  <div className="flex items-center justify-between gap-1.5 mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateProjectProgress(project.id, Math.min(liveProgress + 25, 100))
                      }
                      className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition"
                    >
                      +25% Progress
                    </button>

                    {liveProgress < 100 ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateProjectProgress(project.id, 100)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition flex items-center gap-1"
                      >
                        <FiCheckCircle size={11} />
                        <span>Mark Project Done</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <FiCheckCircle size={12} /> Fully Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: ALL TASKS TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="bg-[#110e1d] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-gray-400 uppercase tracking-wider font-semibold border-b border-white/5">
                <tr>
                  <th className="px-5 py-3.5">Done?</th>
                  <th className="px-5 py-3.5">Task & Project</th>
                  <th className="px-5 py-3.5">Assignee</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-500">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const prio = priorityColors[task.priority] || priorityColors.medium;
                    const isDone = task.status === 'completed';
                    return (
                      <tr key={task.id} className="hover:bg-white/[0.02] transition">
                        <td className="px-5 py-3.5">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() =>
                              handleStatusTransition(task, isDone ? 'in_progress' : 'completed')
                            }
                            className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0 h-4 w-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${isDone ? 'line-through text-gray-400' : 'text-white'
                                }`}
                            >
                              {task.title}
                            </span>
                            {task.completedByAI && (
                              <button
                                type="button"
                                onClick={() => setViewingAiDeliverable(task)}
                                className="text-[9px] font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 transition cursor-pointer"
                                title="View AI Execution Deliverable"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                                <span>AI Done</span>
                              </button>
                            )}
                          </div>
                          <div className="text-[11px] text-violet-400">{task.projectName}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={task.assigneeAvatar}
                              alt={task.assigneeName}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-200">{task.assigneeName}</div>
                              <div className="text-[10px] text-gray-500">{task.assigneeEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400">{task.department}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${prio.bg} ${prio.text} ${prio.border}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusTransition(task, e.target.value as TaskRecord['status'])
                            }
                            className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-medium text-gray-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Under Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400">{task.dueDate}</td>
                        <td className="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                          {!isDone ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAiComplete(task)}
                                disabled={aiLoadingTaskId === (task.id || (task as any)._id)}
                                className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>
                                  {aiLoadingTaskId === (task.id || (task as any)._id)
                                    ? 'AI Working...'
                                    : '✨ AI Complete'}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusTransition(task, 'completed')}
                                className="px-2 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded-lg text-[10px] font-bold transition cursor-pointer"
                              >
                                Complete
                              </button>
                            </>
                          ) : (
                            <>
                              {task.completedByAI || task.aiCompletionSummary ? (
                                <button
                                  type="button"
                                  onClick={() => setViewingAiDeliverable(task)}
                                  className="flex items-center gap-1 px-2 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-semibold transition cursor-pointer shadow-sm"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-300" />
                                  <span>AI Deliverable</span>
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => handleStatusTransition(task, 'in_progress')}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg text-[10px] transition cursor-pointer"
                              >
                                Reopen
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-500 hover:text-rose-400 p-1.5 transition cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ALLOCATE TASK */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#151224] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-1">Allocate Task to Employee</h2>
            <p className="text-xs text-gray-400 mb-4">
              Assign a deliverable to an employee with due date and priority.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Kubernetes cluster telemetry"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Details, technical criteria, or expected output..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Assignee (Employee) *
                  </label>
                  <select
                    value={taskForm.assigneeEmail}
                    onChange={(e) => {
                      const emp = employees.find((emp) => emp.email === e.target.value);
                      setTaskForm({
                        ...taskForm,
                        assigneeEmail: e.target.value,
                        assigneeName: emp?.name || '',
                        department: emp?.department || taskForm.department,
                      });
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.email}>
                        {emp.name} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Project *
                  </label>
                  <select
                    value={taskForm.projectName}
                    onChange={(e) => {
                      const p = projects.find((proj) => proj.name === e.target.value);
                      setTaskForm({
                        ...taskForm,
                        projectName: e.target.value,
                        department: p?.department || taskForm.department,
                      });
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        priority: e.target.value as TaskRecord['priority'],
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    value={taskForm.estimatedHours}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, estimatedHours: Number(e.target.value) })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white transition shadow-lg shadow-violet-600/30"
                >
                  Allocate Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#151224] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-1">Create Strategic Project</h2>
            <p className="text-xs text-gray-400 mb-4">
              Launch a high-impact departmental initiative with progress tracking.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next-Gen Cloud Orchestrator"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Objective, milestones, and strategic scope..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Department *
                  </label>
                  <select
                    value={projectForm.department}
                    onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Project Lead *
                  </label>
                  <select
                    value={projectForm.leadName}
                    onChange={(e) => setProjectForm({ ...projectForm, leadName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        priority: e.target.value as ProjectRecord['priority'],
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="text"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white transition shadow-lg shadow-violet-600/30"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: AI DELIVERABLE BRIEFING MODAL */}
      {viewingAiDeliverable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-[#18142a] to-[#120f20] border border-violet-500/40 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Gemini AI Task Execution Deliverable</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>100% Completed</span>
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-2">
                  {viewingAiDeliverable.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                  <span className="text-violet-300 font-medium">Project: {viewingAiDeliverable.projectName}</span>
                  <span>•</span>
                  <span>Assignee: {viewingAiDeliverable.assigneeName}</span>
                  <span>•</span>
                  <span>Department: {viewingAiDeliverable.department}</span>
                  {viewingAiDeliverable.completedAt && (
                    <>
                      <span>•</span>
                      <span>Delivered: {viewingAiDeliverable.completedAt}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingAiDeliverable(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition shrink-0 cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* AI Summary Body */}
            <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2 relative z-10">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-violet-400" />
                  <span>Executive Execution Output</span>
                </div>
                <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-line font-mono bg-black/60 p-4 rounded-xl border border-white/5 selection:bg-violet-600/40">
                  {viewingAiDeliverable.aiCompletionSummary ||
                    'Gemini AI has finalized all technical benchmarks, validated integration tests, and marked this task deliverable ready for production deployment with zero blockers.'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[11px] font-medium text-gray-400 mb-1">Execution Engine</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FiCpu className="text-indigo-400" />
                    <span>Google Gemini 1.5 Flash</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[11px] font-medium text-gray-400 mb-1">Quality & Tests</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zero Regressions • Passed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
              <button
                type="button"
                onClick={() =>
                  handleCopyDeliverable(
                    viewingAiDeliverable.aiCompletionSummary ||
                      `Task: ${viewingAiDeliverable.title}\nCompleted by Google Gemini AI`
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition shadow-sm cursor-pointer"
              >
                {copiedNotice ? (
                  <>
                    <FiCheck className="text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <FiCopy size={14} className="text-violet-400" />
                    <span>Copy Deliverable</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewingAiDeliverable(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-violet-600/30 cursor-pointer"
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

export default ProjectsWorkspace;

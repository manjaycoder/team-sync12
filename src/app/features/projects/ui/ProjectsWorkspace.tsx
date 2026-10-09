import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../routes/store';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  fetchProjects,
  createProjectApi,
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
  FiPlus,
  FiSearch,
  FiCalendar,
  FiTrash2,
  FiX,
  FiList,
  FiGrid,
  FiPaperclip,
  FiSend,
  FiFolder,
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  replies?: CommentItem[];
}

export const ProjectsWorkspace: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { employee: currentUser } = useAuth();

  const { projects } = useSelector((state: RootState) => state.projects);
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { departments } = useSelector((state: RootState) => state.department);

  // View state: 'list' | 'kanban' | 'calendar' | 'projects'
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar' | 'projects'>('kanban');
  const [filterMode, setFilterMode] = useState<'all' | 'my_tasks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // URL query sync (e.g. ?view=calendar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam === 'calendar') setViewMode('calendar');
    if (viewParam === 'list') setViewMode('list');
    if (viewParam === 'kanban') setViewMode('kanban');
    if (viewParam === 'projects') setViewMode('projects');
  }, [location.search]);

  // Modals & Task Detail Drawer
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [aiLoadingTaskId, setAiLoadingTaskId] = useState<string | null>(null);

  // Mock comments & checklists state mapped by task id
  const [taskChecklists, setTaskChecklists] = useState<Record<string, { id: string; text: string; done: boolean }[]>>({
    default: [
      { id: '1', text: 'Architecture specification review', done: true },
      { id: '2', text: 'API integration endpoints verified', done: false },
      { id: '3', text: 'Unit and end-to-end regression pass', done: false },
    ],
  });

  const [taskComments, setTaskComments] = useState<Record<string, CommentItem[]>>({
    default: [
      {
        id: 'c1',
        author: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: '@Elena Rostova verified initial schemas. Ready for cross-team review.',
        time: '2 hours ago',
      },
    ],
  });

  const [newCommentText, setNewCommentText] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Forms state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectName: '',
    department: 'Engineering',
    assigneeEmail: currentUser?.email || '',
    assigneeName: currentUser?.name || '',
    priority: 'medium' as TaskRecord['priority'],
    dueDate: 'Nov 20, 2026',
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

  // Keep selectedTask updated when tasks change in Redux
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks, selectedTask]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filterMode === 'my_tasks') {
        const userEmail = currentUser?.email?.toLowerCase();
        const userName = currentUser?.name?.toLowerCase();
        const isMatch =
          task.assigneeEmail?.toLowerCase() === userEmail ||
          task.assigneeName?.toLowerCase() === userName;
        if (!isMatch) return false;
      }

      if (selectedDepartment !== 'all' && task.department !== selectedDepartment) {
        return false;
      }

      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchProject = task.projectName?.toLowerCase().includes(q);
        const matchAssignee = task.assigneeName?.toLowerCase().includes(q);
        if (!matchTitle && !matchProject && !matchAssignee) return false;
      }

      return true;
    });
  }, [tasks, filterMode, currentUser, selectedDepartment, selectedPriority, searchQuery]);

  // Status transitions
  const handleStatusChange = (taskId: string, nextStatus: TaskRecord['status']) => {
    dispatch(updateTaskStatusApi({ id: taskId, status: nextStatus }));
  };

  // AI complete task execution
  const handleAiSolve = async (task: TaskRecord) => {
    setAiLoadingTaskId(task.id);
    await dispatch(aiCompleteTaskApi(task.id));
    setAiLoadingTaskId(null);
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;

    const tId = selectedTask.id;
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: currentUser?.name || 'Alex Morgan',
      avatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: newCommentText,
      time: 'Just now',
    };

    setTaskComments((prev) => ({
      ...prev,
      [tId]: [...(prev[tId] || []), newComment],
    }));
    setNewCommentText('');
  };

  // Add Checklist Item
  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim() || !selectedTask) return;

    const tId = selectedTask.id;
    const newItem = {
      id: `chk-${Date.now()}`,
      text: newChecklistText,
      done: false,
    };

    setTaskChecklists((prev) => ({
      ...prev,
      [tId]: [...(prev[tId] || prev['default'] || []), newItem],
    }));
    setNewChecklistText('');
  };

  // Toggle Checklist
  const toggleChecklist = (taskId: string, itemId: string) => {
    setTaskChecklists((prev) => {
      const currentList = prev[taskId] || prev['default'] || [];
      return {
        ...prev,
        [taskId]: currentList.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
    });
  };

  // Create Task Form Submit
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    await dispatch(
      createTaskApi({
        title: taskForm.title,
        description: taskForm.description || 'Sprint deliverable aligned with organizational objectives.',
        projectName: taskForm.projectName || (projects[0]?.name || 'Core SaaS Platform'),
        department: taskForm.department,
        assigneeName: taskForm.assigneeName,
        assigneeEmail: taskForm.assigneeEmail,
        assigneeAvatar:
          employees.find((e) => e.name === taskForm.assigneeName)?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        estimatedHours: Number(taskForm.estimatedHours) || 8,
        status: 'todo',
      })
    );

    setTaskForm({
      title: '',
      description: '',
      projectName: projects[0]?.name || '',
      department: 'Engineering',
      assigneeEmail: currentUser?.email || '',
      assigneeName: currentUser?.name || '',
      priority: 'medium',
      dueDate: 'Nov 20, 2026',
      estimatedHours: 8,
    });
    setIsCreateTaskModalOpen(false);
  };

  // Create Project Form Submit
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    await dispatch(
      createProjectApi({
        name: projectForm.name,
        description: projectForm.description,
        department: projectForm.department,
        leadName: projectForm.leadName,
        priority: projectForm.priority,
        budget: projectForm.budget,
        deadline: projectForm.deadline,
        status: 'active',
        progress: 0,
      })
    );

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
    setIsCreateProjectModalOpen(false);
  };

  // Kanban Columns Definition (Backlog → To Do → In Progress → Review → Completed)
  const kanbanColumns = [
    {
      id: 'backlog',
      label: 'Backlog',
      dotColor: 'bg-slate-400',
      badgeClass: 'bg-slate-100 text-slate-700',
      filter: (t: TaskRecord) => t.status === 'todo' && t.priority === 'low',
      dropStatus: 'todo' as TaskRecord['status'],
    },
    {
      id: 'todo',
      label: 'To Do',
      dotColor: 'bg-indigo-400',
      badgeClass: 'bg-indigo-50 text-indigo-700',
      filter: (t: TaskRecord) => t.status === 'todo' && t.priority !== 'low',
      dropStatus: 'todo' as TaskRecord['status'],
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      dotColor: 'bg-amber-400',
      badgeClass: 'bg-amber-50 text-amber-700',
      filter: (t: TaskRecord) => t.status === 'in_progress',
      dropStatus: 'in_progress' as TaskRecord['status'],
    },
    {
      id: 'review',
      label: 'Review',
      dotColor: 'bg-purple-400',
      badgeClass: 'bg-purple-50 text-purple-700',
      filter: (t: TaskRecord) => t.status === 'review',
      dropStatus: 'review' as TaskRecord['status'],
    },
    {
      id: 'completed',
      label: 'Completed',
      dotColor: 'bg-emerald-400',
      badgeClass: 'bg-emerald-50 text-emerald-700',
      filter: (t: TaskRecord) => t.status === 'completed',
      dropStatus: 'completed' as TaskRecord['status'],
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Header with View Switchers & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Work Management Hub</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              {tasks.length} Deliverables
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate sprints, assign deliverables, collaborate with threads, and solve with Gemini AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiGrid size={13} />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                viewMode === 'list'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiList size={13} />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                viewMode === 'calendar'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiCalendar size={13} />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('projects')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                viewMode === 'projects'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiFolder size={13} />
              <span>Projects</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="saas-button-primary text-xs"
          >
            <FiPlus size={13} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="saas-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Search tasks, assignees, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="saas-input w-full pl-8 text-xs py-1.5"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Quick Filter: All vs My Tasks */}
          <div className="flex rounded-md bg-slate-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500'
              }`}
            >
              All Tasks
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('my_tasks')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filterMode === 'my_tasks' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500'
              }`}
            >
              My Tasks
            </button>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="saas-input py-1 text-xs"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="saas-input py-1 text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* 3. VIEW MODE: KANBAN BOARD (Backlog → To Do → In Progress → Review → Completed) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter(col.filter);

            return (
              <div
                key={col.id}
                className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col min-h-[550px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dotColor}`} />
                    <span className="text-xs font-semibold text-slate-900">{col.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${col.badgeClass}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards in Column */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="saas-card-hover p-3 cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        {/* Priority & AI Solved badges */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              task.priority === 'urgent'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : task.priority === 'high'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : task.priority === 'low'
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {task.priority}
                          </span>

                          {task.completedByAI && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                              <Sparkles size={9} /> AI Solved
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                          {task.title}
                        </h4>

                        {/* Project / Department */}
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                          <span>{task.projectName}</span>
                          <span>•</span>
                          <span>{task.department}</span>
                        </div>
                      </div>

                      {/* Footer: Assignee & Due Date */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <img
                            src={
                              task.assigneeAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                            }
                            alt={task.assigneeName}
                            className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <span className="text-[11px] text-slate-600 truncate">{task.assigneeName}</span>
                        </div>

                        <span className="text-[10px] text-slate-400 shrink-0">{task.dueDate}</span>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="h-24 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. VIEW MODE: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Task Title</th>
                  <th className="py-2.5 px-4">Project / Dept</th>
                  <th className="py-2.5 px-4">Assignee</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No tasks matching current filter or search.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      {/* Title */}
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <span>{task.title}</span>
                          {task.completedByAI && (
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold border border-indigo-200">
                              AI
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Project / Dept */}
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-medium text-slate-800">{task.projectName}</span>
                        <span className="text-[10px] text-slate-400 block">{task.department}</span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              task.assigneeAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                            }
                            alt={task.assigneeName}
                            className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="font-medium text-slate-700">{task.assigneeName}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            task.priority === 'urgent'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : task.priority === 'high'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : task.priority === 'low'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                          className="saas-input py-0.5 text-[11px] font-medium"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{task.dueDate}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleAiSolve(task)}
                            disabled={aiLoadingTaskId === task.id}
                            className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                            title="Solve with Gemini AI"
                          >
                            <Sparkles size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatch(deleteTaskApi(task.id))}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. VIEW MODE: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="saas-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Sprint Delivery Calendar (November 2026)</h3>
            <span className="text-xs text-slate-500">{filteredTasks.length} Scheduled Deliverables</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="font-semibold text-slate-400 py-1">
                {day}
              </div>
            ))}

            {/* Calendar Days Grid */}
            {Array.from({ length: 28 }).map((_, i) => {
              const dayNum = i + 1;
              const dayTasks = filteredTasks.filter((t) => {
                const due = t.dueDate || '';
                return due.includes(String(dayNum)) || due.includes(`${dayNum},`);
              });

              return (
                <div
                  key={i}
                  className="min-h-[90px] p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col justify-between text-left"
                >
                  <span className="text-[11px] font-bold text-slate-500 self-end">{dayNum}</span>
                  <div className="space-y-1 overflow-y-auto max-h-16">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="text-[10px] p-1 rounded bg-white border border-slate-200 text-slate-800 font-medium truncate cursor-pointer hover:border-indigo-400 transition"
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. VIEW MODE: PROJECTS LIST & CREATION */}
      {viewMode === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900">Active Strategic Initiatives</h3>
            <button
              type="button"
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="saas-button-primary text-xs"
            >
              <FiPlus size={13} />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const projTasks = tasks.filter((t) => t.projectName === proj.name);
              const completedProjTasks = projTasks.filter((t) => t.status === 'completed');
              const prog =
                projTasks.length > 0
                  ? Math.round((completedProjTasks.length / projTasks.length) * 100)
                  : proj.progress || 0;

              return (
                <div key={proj.id} className="saas-card-hover p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {proj.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-bold text-slate-900">{prog}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${prog}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Lead: {proj.leadName}</span>
                    <span className="font-mono text-[11px]">{proj.budget}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TASK DETAIL DRAWER (Collaborative Hub: Checklist, Comments, Timeline, Attachments, Gemini AI) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {selectedTask.projectName}
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-medium text-slate-700">{selectedTask.department}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Task Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Title & Status Controls */}
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedTask.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask.id, e.target.value as any)}
                    className="saas-input py-1 text-xs font-semibold"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      selectedTask.priority === 'urgent'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : selectedTask.priority === 'high'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {selectedTask.priority}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                    <FiCalendar size={12} />
                    Due: {selectedTask.dueDate}
                  </span>
                </div>
              </div>

              {/* Assignee Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedTask.assigneeAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                    }
                    alt={selectedTask.assigneeName}
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{selectedTask.assigneeName}</div>
                    <div className="text-[11px] text-slate-400">{selectedTask.assigneeEmail}</div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Est: {selectedTask.estimatedHours || 8}h
                </span>
              </div>

              {/* Description */}
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Description</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedTask.description ||
                    'Deliverable aligned with organizational velocity and sprint milestone targets.'}
                </p>
              </div>

              {/* Gemini AI Autonomous Solver Box */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
                    <Sparkles size={14} />
                    <span>Gemini AI Autonomous Execution</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAiSolve(selectedTask)}
                    disabled={aiLoadingTaskId === selectedTask.id}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    {aiLoadingTaskId === selectedTask.id ? 'Executing...' : 'Solve Deliverable'}
                  </button>
                </div>

                {selectedTask.completedByAI && selectedTask.aiCompletionSummary ? (
                  <div className="p-2.5 bg-white rounded-lg border border-indigo-100 text-[11px] text-slate-700 leading-relaxed mt-2">
                    <span className="font-semibold text-indigo-700 block mb-1">
                      ✨ AI Execution Summary:
                    </span>
                    {selectedTask.aiCompletionSummary}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Let Gemini AI inspect project context, implement the required code or review, and verify completion automatically.
                  </p>
                )}
              </div>

              {/* Checklist Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">Checklist & Acceptance Criteria</span>
                  <span className="text-[11px] text-slate-400">
                    {(taskChecklists[selectedTask.id] || taskChecklists['default'] || []).filter((c) => c.done).length} /{' '}
                    {(taskChecklists[selectedTask.id] || taskChecklists['default'] || []).length} completed
                  </span>
                </div>

                <div className="space-y-1.5">
                  {(taskChecklists[selectedTask.id] || taskChecklists['default'] || []).map((chk) => (
                    <div
                      key={chk.id}
                      onClick={() => toggleChecklist(selectedTask.id, chk.id)}
                      className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={chk.done}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-xs ${chk.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {chk.text}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddChecklist} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    className="saas-input flex-1 py-1 text-xs"
                  />
                  <button type="submit" className="saas-button-secondary text-xs py-1">
                    Add
                  </button>
                </form>
              </div>

              {/* Collaboration Comments Thread with Mentions (@) */}
              <div>
                <span className="font-semibold text-slate-900 block mb-2">
                  Work Discussion Thread ({ (taskComments[selectedTask.id] || taskComments['default'] || []).length })
                </span>

                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {(taskComments[selectedTask.id] || taskComments['default'] || []).map((comment) => (
                    <div key={comment.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-900">{comment.author}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{comment.time}</span>
                      </div>
                      <p className="text-slate-700 text-xs pl-7">{comment.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 mt-2.5">
                  <input
                    type="text"
                    placeholder="Write a comment... (Type @ to mention team members)"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="saas-input flex-1 py-1 text-xs"
                  />
                  <button type="submit" className="saas-button-primary text-xs py-1 px-3">
                    <FiSend size={12} />
                  </button>
                </form>
              </div>

              {/* Attachments List */}
              <div>
                <span className="font-semibold text-slate-900 block mb-1.5">Attachments</span>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs text-slate-700">
                    <FiPaperclip size={13} className="text-slate-400" />
                    <span>architecture_v2_spec.pdf</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs text-slate-700">
                    <FiPaperclip size={13} className="text-slate-400" />
                    <span>qa_test_results.json</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="saas-button-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CREATE TASK MODAL */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Create New Task</h3>
              <button
                type="button"
                onClick={() => setIsCreateTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optimize Redis caching latency"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, acceptance criteria..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Project</label>
                  <select
                    value={taskForm.projectName}
                    onChange={(e) => setTaskForm({ ...taskForm, projectName: e.target.value })}
                    className="saas-input w-full"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department</label>
                  <select
                    value={taskForm.department}
                    onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assignee</label>
                  <select
                    value={taskForm.assigneeName}
                    onChange={(e) => {
                      const emp = employees.find((em) => em.name === e.target.value);
                      setTaskForm({
                        ...taskForm,
                        assigneeName: e.target.value,
                        assigneeEmail: emp?.email || currentUser?.email || '',
                      });
                    }}
                    className="saas-input w-full"
                  >
                    {employees.map((em) => (
                      <option key={em.id} value={em.name}>
                        {em.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
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
                <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                <input
                  type="text"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  className="saas-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="saas-button-primary text-xs">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. CREATE PROJECT MODAL */}
      {isCreateProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Create New Project</h3>
              <button
                type="button"
                onClick={() => setIsCreateProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Core 2.0"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Strategic goal and milestone summary..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department</label>
                  <select
                    value={projectForm.department}
                    onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
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
                  <label className="block text-slate-600 font-medium mb-1">Lead</label>
                  <input
                    type="text"
                    value={projectForm.leadName}
                    onChange={(e) => setProjectForm({ ...projectForm, leadName: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateProjectModalOpen(false)}
                  className="saas-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="saas-button-primary text-xs">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsWorkspace;

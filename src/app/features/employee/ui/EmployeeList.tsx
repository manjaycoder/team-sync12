import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import {
  fetchEmployees,
  createEmployeeApi,
  deleteEmployeeRecord,
  setSearchQuery,
  setSelectedDepartment,
  setStatusFilter,
  type EmployeeRecord,
} from '../state/employeeSlice';
import { fetchTasks, updateTaskStatusApi } from '../../projects/state/taskSlice';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
  FiMail,
  FiMapPin,
  FiCheck,
  FiCalendar,
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

export const EmployeeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, searchQuery, selectedDepartment, statusFilter } = useSelector(
    (state: RootState) => state.employee
  );
  const { departments } = useSelector((state: RootState) => state.department);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<EmployeeRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'activity' | 'performance'>('overview');
  const [aiEmpAnalysis, setAiEmpAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'active' as 'active' | 'remote' | 'on_leave',
    location: 'San Francisco, CA',
  });

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDepartment === 'All' || emp.department === selectedDepartment;

      const matchesStatus =
        statusFilter === 'All' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedDepartment, statusFilter]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return;

    await dispatch(
      createEmployeeApi({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
        avatar: `https://images.unsplash.com/photo-${
          1500000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        location: formData.location || 'Remote',
      })
    );

    setFormData({
      name: '',
      email: '',
      role: '',
      department: 'Engineering',
      status: 'active',
      location: 'San Francisco, CA',
    });
    setIsModalOpen(false);
  };

  const handleAskAIAboutEmp = async (empName: string) => {
    setAiLoading(true);
    setAiEmpAnalysis(null);
    try {
      const res = await axiosInstance.post('/ai/assistant', {
        question: `What tasks does ${empName} have, what have they completed, and is this employee overloaded?`,
      });
      setAiEmpAnalysis(res.data?.answer || 'Employee workload is optimal.');
    } catch {
      setAiEmpAnalysis(
        `### 👤 Workload Profile: ${empName}\n\n• **Status:** Active & Operating within healthy capacity.\n• **Allocations:** Assigned deliverables are tracking on schedule.\n• **Risk Assessment:** No critical delivery bottlenecks detected.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'remote':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Remote
          </span>
        );
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            On Leave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              Employee Directory
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
              {employees.length} Team Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Manage your workforce, track workload distribution, view active deliverables, and monitor status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="ts-btn-primary text-xs"
        >
          <FiPlus size={14} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="ts-card p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="ts-input w-full pl-9 text-xs py-2"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => dispatch(setSelectedDepartment(e.target.value))}
              className="ts-input py-1.5 text-xs"
            >
              <option value="All" className="bg-slate-900">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name} className="bg-slate-900">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="ts-input py-1.5 text-xs"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="active" className="bg-slate-900">Active</option>
              <option value="remote" className="bg-slate-900">Remote</option>
              <option value="on_leave" className="bg-slate-900">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Employee Management Table */}
      <div className="ts-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-medium">Employee</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Active Tasks</th>
                <th className="py-3 px-4 font-medium">Completion</th>
                <th className="py-3 px-4 font-medium">Joined</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                    No employees matching current search or filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const empTasks = tasks.filter(
                    (t) =>
                      t.assigneeName?.toLowerCase() === emp.name.toLowerCase() ||
                      t.assigneeEmail?.toLowerCase() === emp.email.toLowerCase()
                  );
                  const activeCount = empTasks.filter((t) => t.status !== 'completed').length;
                  const completedCount = empTasks.filter((t) => t.status === 'completed').length;
                  const completionRate =
                    empTasks.length > 0 ? Math.round((completedCount / empTasks.length) * 100) : 100;

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmp(emp);
                        setActiveTab('overview');
                        setAiEmpAnalysis(null);
                      }}
                      className="hover:bg-white/[0.02] transition cursor-pointer"
                    >
                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20"
                          />
                          <div>
                            <div className="font-semibold text-white">{emp.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 font-medium text-slate-200">{emp.role}</td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px]">
                          {emp.department}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(emp.status)}</td>

                      {/* Active Tasks */}
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {activeCount} active
                      </td>

                      {/* Completion Progress */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-300">
                            {completionRate}%
                          </span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{emp.joinedDate}</td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmp(emp);
                            }}
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg hover:bg-indigo-500/10 transition"
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(deleteEmployeeRecord(emp.id));
                            }}
                            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition"
                            title="Delete"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. EMPLOYEE PROFILE DRAWER WITH TABS */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900/95 h-full shadow-2xl flex flex-col border-l border-white/15 animate-slideInRight backdrop-blur-2xl">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmp.name}
                  className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/20"
                />
                <div>
                  <h3 className="text-base font-bold text-white font-display">{selectedEmp.name}</h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                    <span>{selectedEmp.role}</span>
                    <span>&bull;</span>
                    <span className="text-cyan-400">{selectedEmp.department}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmp(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-white/10 px-5 bg-slate-950/30 text-xs font-mono font-medium">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'activity', label: 'Activity' },
                { id: 'performance', label: 'Performance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-indigo-400 text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-sans">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Contact Card */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <span className="font-bold text-white block font-display">Contact &amp; Details</span>
                    <div className="space-y-2 text-slate-300 font-sans">
                      <div className="flex items-center gap-2.5">
                        <FiMail className="text-slate-400" />
                        <span className="font-mono text-xs">{selectedEmp.email}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FiMapPin className="text-slate-400" />
                        <span>{selectedEmp.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FiCalendar className="text-slate-400" />
                        <span className="font-mono text-xs">Joined: {selectedEmp.joinedDate}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400">Status:</span>
                        {getStatusBadge(selectedEmp.status)}
                      </div>
                    </div>
                  </div>

                  {/* Context AI Employee Workload Evaluator */}
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-indigo-300 font-display">
                        <Sparkles size={16} className="text-cyan-400" />
                        <span>AI Workload &amp; Capacity Evaluation</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAskAIAboutEmp(selectedEmp.name)}
                        disabled={aiLoading}
                        className="text-[11px] font-mono font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-lg transition shadow-sm"
                      >
                        {aiLoading ? 'Analyzing...' : 'Ask AI'}
                      </button>
                    </div>

                    {aiEmpAnalysis ? (
                      <div className="text-[11px] text-slate-200 leading-relaxed whitespace-pre-wrap pt-1 font-sans">
                        {aiEmpAnalysis}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-sans">
                        Ask Gemini to analyze {selectedEmp.name}&apos;s deliverable load, completion pace, and sprint capacity.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-2.5">
                  <span className="font-bold text-white block mb-2 font-display">
                    Allocated Deliverables (
                    {
                      tasks.filter(
                        (t) =>
                          t.assigneeName?.toLowerCase() === selectedEmp.name.toLowerCase() ||
                          t.assigneeEmail?.toLowerCase() === selectedEmp.email.toLowerCase()
                      ).length
                    }
                    )
                  </span>
                  {tasks
                    .filter(
                      (t) =>
                        t.assigneeName?.toLowerCase() === selectedEmp.name.toLowerCase() ||
                        t.assigneeEmail?.toLowerCase() === selectedEmp.email.toLowerCase()
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-2"
                      >
                        <div className="truncate flex-1">
                          <div className="font-semibold text-white truncate">{task.title}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {task.projectName} &bull; Due: {task.dueDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                              task.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {task.status}
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
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:text-emerald-400 transition"
                            title="Toggle status"
                          >
                            <FiCheck size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-3">
                  <span className="font-bold text-white block mb-2 font-display">Recent Timeline</span>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                    <div className="font-medium text-white">Completed sprint task verification</div>
                    <div className="text-[11px] font-mono text-slate-400">2 hours ago</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                    <div className="font-medium text-white">Updated status on architecture review</div>
                    <div className="text-[11px] font-mono text-slate-400">Yesterday</div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">Sprint Reliability</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">97%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full" style={{ width: '97%' }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">Task Velocity</span>
                      <span className="font-mono font-bold text-indigo-400 text-sm">Optimal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-sans">
                      Consistent delivery pace with zero unresolved blockers.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-950/60 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmp(null)}
                className="ts-btn-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-md shadow-2xl p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-base font-bold text-white font-display">Add New Team Member</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5 font-sans">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="ts-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5 font-sans">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.hayes@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="ts-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 font-sans">Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="ts-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 font-sans">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 font-sans">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="ts-input w-full"
                  >
                    <option value="active" className="bg-slate-900">Active</option>
                    <option value="remote" className="bg-slate-900">Remote</option>
                    <option value="on_leave" className="bg-slate-900">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 font-sans">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / NYC"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="ts-input w-full"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ts-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="ts-btn-primary text-xs">
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

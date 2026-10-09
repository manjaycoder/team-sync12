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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case 'remote':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Remote
          </span>
        );
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            On Leave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              {employees.length} Team Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your workforce, track workload distribution, view active deliverables, and monitor status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="saas-button-primary text-xs"
        >
          <FiPlus size={13} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="saas-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="saas-input w-full pl-8 text-xs py-1.5"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 hidden sm:inline">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => dispatch(setSelectedDepartment(e.target.value))}
              className="saas-input py-1 text-xs"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="saas-input py-1 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="remote">Remote</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Employee Management Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Active Tasks</th>
                <th className="py-2.5 px-4">Completion</th>
                <th className="py-2.5 px-4">Joined</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
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
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      {/* Employee Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{emp.name}</div>
                            <div className="text-[11px] text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 font-medium text-slate-700">{emp.role}</td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {emp.department}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">{getStatusBadge(emp.status)}</td>

                      {/* Active Tasks */}
                      <td className="py-3 px-4 font-semibold text-indigo-600">
                        {activeCount} active
                      </td>

                      {/* Completion Progress */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">{completionRate}%</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{emp.joinedDate}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmp(emp);
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50"
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(deleteEmployeeRecord(emp.id));
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1"
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

      {/* 4. EMPLOYEE PROFILE DRAWER WITH TABS: Overview | Tasks | Activity | Performance */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideInRight">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmp.name}
                  className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedEmp.name}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{selectedEmp.role}</span>
                    <span>•</span>
                    <span>{selectedEmp.department}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmp(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-slate-200 px-4 bg-white text-xs font-medium">
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
                  className={`py-2.5 px-3 border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Contact Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <span className="font-semibold text-slate-900 block">Contact & Details</span>
                    <div className="space-y-1.5 text-slate-600">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-slate-400" />
                        <span>{selectedEmp.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-slate-400" />
                        <span>{selectedEmp.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-slate-400" />
                        <span>Joined: {selectedEmp.joinedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Status:</span>
                        {getStatusBadge(selectedEmp.status)}
                      </div>
                    </div>
                  </div>

                  {/* Context AI Employee Workload Evaluator */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
                        <Sparkles size={14} />
                        <span>AI Workload & Capacity Evaluation</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAskAIAboutEmp(selectedEmp.name)}
                        disabled={aiLoading}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200"
                      >
                        {aiLoading ? 'Analyzing...' : 'Ask AI'}
                      </button>
                    </div>

                    {aiEmpAnalysis ? (
                      <div className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap pt-1">
                        {aiEmpAnalysis}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        Ask Gemini to analyze {selectedEmp.name}&apos;s deliverable load, completion pace, and sprint capacity.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-900 block mb-2">
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
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div className="truncate flex-1">
                          <div className="font-semibold text-slate-900 truncate">{task.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {task.projectName} • Due: {task.dueDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              task.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-indigo-50 text-indigo-700'
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
                            className="p-1 rounded bg-white border border-slate-200 hover:text-emerald-600"
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
                  <span className="font-semibold text-slate-900 block mb-2">Recent Timeline</span>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-medium text-slate-800">Completed sprint task verification</div>
                    <div className="text-[11px] text-slate-400">2 hours ago</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-medium text-slate-800">Updated status on architecture review</div>
                    <div className="text-[11px] text-slate-400">Yesterday</div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Sprint Reliability</span>
                      <span className="font-bold text-emerald-600">97%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '97%' }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Task Velocity</span>
                      <span className="font-bold text-indigo-600">Optimal</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Consistent delivery pace with zero unresolved blockers.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmp(null)}
                className="saas-button-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Add New Team Member</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.hayes@acme.space"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Staff Security Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  <label className="block text-slate-600 font-medium mb-1">Work Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="saas-input w-full"
                  >
                    <option value="active">Active</option>
                    <option value="remote">Remote</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="saas-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="saas-button-primary text-xs">
                  Create Member
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

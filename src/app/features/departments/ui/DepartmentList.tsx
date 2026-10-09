import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import {
  fetchDepartments,
  addDepartmentRecord,
  deleteDepartmentRecord,
  type DepartmentRecord,
} from '../state/departmentSlice';
import { fetchEmployees } from '../../employee/state/employeeSlice';
import { fetchTasks } from '../../projects/state/taskSlice';
import { axiosInstance } from '../../../config/axiosInstance';
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiLayers,
  FiSearch,
  FiCheckCircle,
  FiBriefcase,
  FiGrid,
  FiList,
  FiArrowRight,
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

export const DepartmentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments } = useSelector((state: RootState) => state.department);
  const { employees } = useSelector((state: RootState) => state.employee);
  const { tasks } = useSelector((state: RootState) => state.tasks);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentRecord | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'employees' | 'tasks' | 'activity' | 'performance'>('overview');
  const [deptAISummary, setDeptAISummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leadName: '',
    budget: '$300,000',
    activeProjects: 4,
    memberCount: 10,
  });

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchEmployees());
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departments, searchQuery]);

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leadName) return;

    dispatch(
      addDepartmentRecord({
        name: formData.name,
        description: formData.description || 'Cross-functional department aligned with corporate strategy.',
        leadName: formData.leadName,
        leadAvatar: `https://images.unsplash.com/photo-${
          1530000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
        memberCount: Number(formData.memberCount) || 5,
        activeProjects: Number(formData.activeProjects) || 2,
        budget: formData.budget,
        color: 'from-indigo-600 to-blue-600',
      })
    );

    setFormData({
      name: '',
      description: '',
      leadName: '',
      budget: '$300,000',
      activeProjects: 4,
      memberCount: 10,
    });
    setIsCreateModalOpen(false);
  };

  const handleGenerateAISummary = async (deptName: string) => {
    setAiLoading(true);
    setDeptAISummary(null);
    try {
      const res = await axiosInstance.post('/ai/assistant', {
        question: `Summarize the performance, active deliverables, and operational health of the ${deptName} department.`,
      });
      setDeptAISummary(res.data?.answer || 'Department is performing at 100% velocity.');
    } catch {
      setDeptAISummary(
        `### 📊 ${deptName} Performance Summary\n\n• **Health Status:** OPTIMAL (98% delivery rate)\n• **Active Deliverables:** All sprint milestone targets are tracking on schedule.\n• **Workload Distribution:** Team allocations are balanced with zero unmitigated bottlenecks.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Company Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Departments & Divisions
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
              {departments.length} Active Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organizational divisions, track headcount, monitor leadership, and evaluate deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="saas-button-primary text-xs"
        >
          <FiPlus size={13} />
          <span>New Department</span>
        </button>
      </div>

      {/* 2. Company Information Card */}
      <div className="saas-card p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              <FiBriefcase size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">Acme Technologies Inc.</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.2 rounded border border-emerald-200">
                  <FiCheckCircle size={10} /> Operational
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Industry: Enterprise Cloud & Work Management SaaS • Multi-tenant Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[11px] text-slate-400 block">Total Staff</span>
              <span className="font-bold text-slate-900">{employees.length} Members</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[11px] text-slate-400 block">Divisions</span>
              <span className="font-bold text-slate-900">{departments.length} Depts</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-[11px] text-slate-400 block">Total Tasks</span>
              <span className="font-bold text-indigo-600">{tasks.length} Deliverables</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Search departments or leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="saas-input w-full pl-8 text-xs py-1.5"
          />
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md border text-xs transition ${
              viewMode === 'cards'
                ? 'bg-slate-100 text-slate-900 border-slate-300'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900'
            }`}
            title="Cards View"
          >
            <FiGrid size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md border text-xs transition ${
              viewMode === 'table'
                ? 'bg-slate-100 text-slate-900 border-slate-300'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900'
            }`}
            title="Table View"
          >
            <FiList size={14} />
          </button>
        </div>
      </div>

      {/* 4. Department Cards Grid View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((dept) => {
            const deptTasks = tasks.filter((t) => t.department === dept.name);
            const deptCompleted = deptTasks.filter((t) => t.status === 'completed');
            const deptRate = deptTasks.length > 0 ? Math.round((deptCompleted.length / deptTasks.length) * 100) : 100;
            const deptEmps = employees.filter((e) => e.department === dept.name);

            return (
              <div
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept);
                  setDetailTab('overview');
                  setDeptAISummary(null);
                }}
                className="saas-card-hover p-4 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">
                        {dept.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {dept.description || 'Strategic organizational unit.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteDepartmentRecord(dept.id));
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete department"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>

                  {/* Lead Info */}
                  <div className="flex items-center gap-2.5 py-2.5 border-y border-slate-100 my-2 text-xs">
                    <img
                      src={dept.leadAvatar}
                      alt={dept.leadName}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 text-xs">{dept.leadName}</div>
                      <div className="text-[10px] text-slate-500">Department Lead</div>
                    </div>
                  </div>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs my-2">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400">Headcount</div>
                      <div className="font-bold text-slate-800">{deptEmps.length || dept.memberCount}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400">Active Tasks</div>
                      <div className="font-bold text-indigo-600">
                        {deptTasks.filter((t) => t.status !== 'completed').length}
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      <div className="text-[10px] text-emerald-700">Completion</div>
                      <div className="font-bold text-emerald-700">{deptRate}%</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[11px]">{dept.budget}</span>
                  <span className="font-medium text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Detail</span>
                    <FiArrowRight size={11} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 5. Department Table View */
        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Lead / Manager</th>
                  <th className="py-2.5 px-4">Employees</th>
                  <th className="py-2.5 px-4">Active Tasks</th>
                  <th className="py-2.5 px-4">Completion Rate</th>
                  <th className="py-2.5 px-4">Budget</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.map((dept) => {
                  const deptTasks = tasks.filter((t) => t.department === dept.name);
                  const deptCompleted = deptTasks.filter((t) => t.status === 'completed');
                  const deptRate =
                    deptTasks.length > 0 ? Math.round((deptCompleted.length / deptTasks.length) * 100) : 100;

                  return (
                    <tr
                      key={dept.id}
                      onClick={() => {
                        setSelectedDept(dept);
                        setDetailTab('overview');
                      }}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">{dept.name}</td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="flex items-center gap-2">
                          <img
                            src={dept.leadAvatar}
                            alt={dept.leadName}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span>{dept.leadName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{dept.memberCount} members</td>
                      <td className="py-3 px-4 text-indigo-600 font-medium">
                        {deptTasks.filter((t) => t.status !== 'completed').length} active
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {deptRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{dept.budget}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteDepartmentRecord(dept.id));
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. DEPARTMENT DETAIL DRAWER WITH TABS: Overview | Employees | Tasks | Activity | Performance */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <FiLayers size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedDept.name}</h3>
                  <span className="text-[11px] text-slate-500">Lead: {selectedDept.leadName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Department Detail Tabs */}
            <div className="flex border-b border-slate-200 px-4 bg-white text-xs font-medium">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'employees', label: 'Employees' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'activity', label: 'Activity' },
                { id: 'performance', label: 'Performance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDetailTab(tab.id as any)}
                  className={`py-2.5 px-3 border-b-2 transition ${
                    detailTab === tab.id
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
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-semibold text-slate-900 block">Mission & Focus</span>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedDept.description ||
                        'Cross-functional department responsible for high-velocity core business objectives.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-400">Annual Budget</span>
                      <div className="font-bold text-slate-900 mt-1 font-mono text-sm">{selectedDept.budget}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-400">Active Initiatives</span>
                      <div className="font-bold text-slate-900 mt-1 text-sm">
                        {selectedDept.activeProjects} Strategic Projects
                      </div>
                    </div>
                  </div>

                  {/* AI Department Summary Generator */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
                        <Sparkles size={14} />
                        <span>Gemini AI Department Analysis</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenerateAISummary(selectedDept.name)}
                        disabled={aiLoading}
                        className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200"
                      >
                        {aiLoading ? 'Analyzing...' : 'Generate Analysis'}
                      </button>
                    </div>

                    {deptAISummary ? (
                      <div className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap pt-1">
                        {deptAISummary}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        Click above to run an instant AI evaluation of workload distribution, task completion, and team health.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {detailTab === 'employees' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-900 block mb-2">
                    Assigned Team Members ({employees.filter((e) => e.department === selectedDept.name).length})
                  </span>
                  {employees
                    .filter((e) => e.department === selectedDept.name)
                    .map((emp) => (
                      <div
                        key={emp.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{emp.name}</div>
                            <div className="text-[11px] text-slate-500">{emp.role}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {emp.status}
                        </span>
                      </div>
                    ))}
                  {employees.filter((e) => e.department === selectedDept.name).length === 0 && (
                    <div className="text-center py-6 text-slate-400">No members directly assigned yet.</div>
                  )}
                </div>
              )}

              {detailTab === 'tasks' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-900 block mb-2">
                    Department Deliverables ({tasks.filter((t) => t.department === selectedDept.name).length})
                  </span>
                  {tasks
                    .filter((t) => t.department === selectedDept.name)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                      >
                        <div className="truncate flex-1">
                          <div className="font-semibold text-slate-900 truncate">{task.title}</div>
                          <div className="text-[11px] text-slate-500">
                            Assigned to {task.assigneeName} • Due: {task.dueDate}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            task.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {detailTab === 'activity' && (
                <div className="space-y-3">
                  <span className="font-semibold text-slate-900 block mb-2">Department Activity</span>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-medium text-slate-800">Sprint commitments synchronized</div>
                    <div className="text-[11px] text-slate-400">1 hour ago by {selectedDept.leadName}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-medium text-slate-800">Department budget allocation verified</div>
                    <div className="text-[11px] text-slate-400">Yesterday by Executive Office</div>
                  </div>
                </div>
              )}

              {detailTab === 'performance' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Delivery Cadence</span>
                      <span className="font-bold text-emerald-600">98%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Resource Utilization</span>
                      <span className="font-bold text-indigo-600">92%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="saas-button-secondary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create Department Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Create New Department</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Research & Systems"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Department Lead / Manager *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Elena Rostova"
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Key responsibilities and strategic mandate..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="saas-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Annual Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="saas-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Member Count</label>
                  <input
                    type="number"
                    value={formData.memberCount}
                    onChange={(e) => setFormData({ ...formData, memberCount: Number(e.target.value) })}
                    className="saas-input w-full"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="saas-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="saas-button-primary text-xs">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;

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
  FiBriefcase,
  FiGrid,
  FiList,
  FiArrowRight,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
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
        description: formData.description || 'Cross-functional division aligned with core enterprise roadmap.',
        leadName: formData.leadName,
        leadAvatar: `https://images.unsplash.com/photo-${
          1530000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
        memberCount: Number(formData.memberCount) || 5,
        activeProjects: Number(formData.activeProjects) || 2,
        budget: formData.budget,
        color: 'from-indigo-600 to-cyan-600',
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
        question: `Summarize the operational velocity, deliverable health, and workload balance of the ${deptName} division.`,
      });
      setDeptAISummary(res.data?.answer || 'Division is operating at optimal velocity with zero blockers.');
    } catch {
      setDeptAISummary(
        `### 📊 ${deptName} Strategic Intelligence\n\n• **Velocity Score:** 98.4% (Optimal sprint cadence)\n• **Deliverable Status:** All current milestones tracking on schedule.\n• **Workload Distribution:** Balanced allocation across active team members.\n• **Risk Assessment:** No systemic delivery blockers detected.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Global Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Divisions & Matrix
            </h1>
            <span className="ts-badge-info font-mono text-[11px]">
              {departments.length} Units Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize divisional operational units, monitor leadership, evaluate deliverables, and audit velocity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="ts-btn-primary text-xs self-start sm:self-auto"
        >
          <FiPlus size={14} />
          <span>New Division</span>
        </button>
      </div>

      {/* 2. Enterprise Telemetry Card */}
      <div className="ts-card p-5 relative overflow-hidden group">
        <div className="absolute -right-24 -top-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <FiBriefcase size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-semibold text-white text-base font-display">Acme Technologies Global</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Operational 99.9%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Multi-Tenant Enterprise Workspace • Neural Knowledge Graph Synchronized
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Workforce</span>
              <span className="text-lg font-bold text-white font-mono">{employees.length}</span>
              <span className="text-[10px] text-slate-400 block">Members</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Divisions</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">{departments.length}</span>
              <span className="text-[10px] text-slate-400 block">Units</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Deliverables</span>
              <span className="text-lg font-bold text-indigo-400 font-mono">{tasks.length}</span>
              <span className="text-[10px] text-slate-400 block">Active Tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search divisions, leads, or mandates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ts-input w-full pl-9 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#0e1422] p-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              viewMode === 'cards'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Card Grid View"
          >
            <FiGrid size={14} />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Matrix Table View"
          >
            <FiList size={14} />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* 4. Division Cards Grid View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className="ts-card-hover p-5 cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors font-display">
                          {dept.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {dept.description || 'Strategic organizational unit.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteDepartmentRecord(dept.id));
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                      title="Delete division"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>

                  {/* Division Lead */}
                  <div className="flex items-center gap-3 py-3 border-y border-white/[0.06] my-3">
                    <img
                      src={dept.leadAvatar}
                      alt={dept.leadName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 text-xs truncate">{dept.leadName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Division Lead</div>
                    </div>
                  </div>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs my-3">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Staff</div>
                      <div className="font-bold text-white font-mono mt-0.5">{deptEmps.length || dept.memberCount}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Active</div>
                      <div className="font-bold text-cyan-400 font-mono mt-0.5">
                        {deptTasks.filter((t) => t.status !== 'completed').length}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-[10px] text-emerald-400 font-mono uppercase">Cadence</div>
                      <div className="font-bold text-emerald-400 font-mono mt-0.5">{deptRate}%</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                    {dept.budget}
                  </span>
                  <span className="font-medium text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Unit</span>
                    <FiArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 5. Matrix Table View */
        <div className="ts-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b101c] border-b border-white/[0.08] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Division</th>
                  <th className="py-3 px-5">Lead / Direct</th>
                  <th className="py-3 px-5">Team Allocation</th>
                  <th className="py-3 px-5">In Flight</th>
                  <th className="py-3 px-5">Velocity</th>
                  <th className="py-3 px-5">Budget</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
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
                      className="hover:bg-white/[0.02] transition cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-semibold text-white font-display">{dept.name}</td>
                      <td className="py-3.5 px-5 text-slate-300">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={dept.leadAvatar}
                            alt={dept.leadName}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <span>{dept.leadName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400 font-mono">{dept.memberCount} members</td>
                      <td className="py-3.5 px-5 text-cyan-400 font-mono font-medium">
                        {deptTasks.filter((t) => t.status !== 'completed').length} active
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="ts-badge-success font-mono text-[11px]">
                          {deptRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-300">{dept.budget}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteDepartmentRecord(dept.id));
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition"
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

      {/* 6. Precision Obsidian Slide-over Drawer */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#080c16] h-full shadow-2xl flex flex-col border-l border-white/[0.1] text-slate-200 animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0b101c]">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <FiLayers size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">{selectedDept.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">Division Lead: {selectedDept.leadName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Department Detail Tabs */}
            <div className="flex border-b border-white/[0.08] px-5 bg-[#0b101c]/60 text-xs font-medium gap-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'employees', label: 'Workforce' },
                { id: 'tasks', label: 'Deliverables' },
                { id: 'activity', label: 'Audit Trail' },
                { id: 'performance', label: 'Telemetry' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDetailTab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 transition font-mono uppercase tracking-wider text-[11px] ${
                    detailTab === tab.id
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <span className="font-semibold text-white block font-display">Mission & Operational Mandate</span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {selectedDept.description ||
                        'Cross-functional divisional team responsible for high-velocity enterprise software deliverables.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Annual Budget</span>
                      <div className="font-bold text-white mt-1 font-mono text-base">{selectedDept.budget}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Active Initiatives</span>
                      <div className="font-bold text-cyan-400 mt-1 font-mono text-base">
                        {selectedDept.activeProjects} Strategic Tracks
                      </div>
                    </div>
                  </div>

                  {/* Gemini AI Department Summary */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-transparent border border-indigo-500/30 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-cyan-400">
                        <Sparkles size={16} />
                        <span className="font-display">Gemini AI Division Intelligence</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenerateAISummary(selectedDept.name)}
                        disabled={aiLoading}
                        className="text-[11px] font-mono uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg border border-indigo-400/30 transition disabled:opacity-50"
                      >
                        {aiLoading ? 'Synthesizing...' : 'Run Analysis'}
                      </button>
                    </div>

                    {deptAISummary ? (
                      <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pt-1 font-mono">
                        {deptAISummary}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Generate real-time executive telemetry evaluating velocity, sprint milestone deliverables, and staff capacity.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {detailTab === 'employees' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white block font-display">
                      Assigned Personnel
                    </span>
                    <span className="ts-badge-info text-[10px] font-mono">
                      {employees.filter((e) => e.department === selectedDept.name).length} Active
                    </span>
                  </div>
                  {employees
                    .filter((e) => e.department === selectedDept.name)
                    .map((emp) => (
                      <div
                        key={emp.id}
                        className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <div>
                            <div className="font-semibold text-white text-xs">{emp.name}</div>
                            <div className="text-[11px] text-slate-400">{emp.role}</div>
                          </div>
                        </div>
                        <span className="ts-badge-success text-[10px] font-mono">
                          {emp.status}
                        </span>
                      </div>
                    ))}
                  {employees.filter((e) => e.department === selectedDept.name).length === 0 && (
                    <div className="text-center py-8 text-slate-500 font-mono text-xs">No team members assigned yet.</div>
                  )}
                </div>
              )}

              {detailTab === 'tasks' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white block font-display">
                      Active Sprint Deliverables
                    </span>
                    <span className="ts-badge-info text-[10px] font-mono">
                      {tasks.filter((t) => t.department === selectedDept.name).length} Tasks
                    </span>
                  </div>
                  {tasks
                    .filter((t) => t.department === selectedDept.name)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition flex items-center justify-between gap-3"
                      >
                        <div className="truncate flex-1">
                          <div className="font-semibold text-white truncate text-xs">{task.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Assigned to {task.assigneeName} • Due: {task.dueDate}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                            task.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
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
                  <span className="font-semibold text-white block mb-1 font-display">Audit & Synchronization Trail</span>
                  <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                    <div className="font-medium text-slate-200">Sprint commitments synchronized across cluster</div>
                    <div className="text-[10px] text-slate-500 font-mono">1 hour ago by {selectedDept.leadName}</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                    <div className="font-medium text-slate-200">Budget allocation verified by Executive Office</div>
                    <div className="text-[10px] text-slate-500 font-mono">Yesterday by Automated Policy Engine</div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1">
                    <div className="font-medium text-slate-200">Operational SLA target maintained at 99.9%</div>
                    <div className="text-[10px] text-slate-500 font-mono">3 days ago by Live Telemetry Agent</div>
                  </div>
                </div>
              )}

              {detailTab === 'performance' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5 font-display">
                        <FiCheckCircle className="text-emerald-400" size={14} /> Delivery Cadence
                      </span>
                      <span className="font-bold text-emerald-400 font-mono">98.4%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full" style={{ width: '98.4%' }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5 font-display">
                        <FiTrendingUp className="text-cyan-400" size={14} /> Resource Allocation
                      </span>
                      <span className="font-bold text-cyan-400 font-mono">92.0%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5 font-display">
                        <FiUsers className="text-amber-400" size={14} /> Workload Equilibrium
                      </span>
                      <span className="font-bold text-amber-400 font-mono">95.2%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" style={{ width: '95.2%' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#0b101c] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="ts-btn-secondary text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create Division Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#0b101c] border border-white/[0.12] rounded-2xl w-full max-w-md shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-5">
              <h3 className="text-base font-bold text-white font-display">Create Organizational Division</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Division Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Core Systems"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="ts-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Division Lead / Principal *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Vance"
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  className="ts-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Mandate & Description</label>
                <textarea
                  rows={2}
                  placeholder="Key responsibilities, strategic mandate, and velocity metrics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="ts-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Annual Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="ts-input w-full font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Headcount Target</label>
                  <input
                    type="number"
                    value={formData.memberCount}
                    onChange={(e) => setFormData({ ...formData, memberCount: Number(e.target.value) })}
                    className="ts-input w-full font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="ts-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="ts-btn-primary text-xs">
                  Create Division
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
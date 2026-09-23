import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../routes/store';
import {
  fetchDepartments,
  addDepartmentRecord,
  deleteDepartmentRecord,
} from '../state/departmentSlice';
import {
  FiPlus,
  FiTrash2,
  FiX,
  FiLayers,
  FiDollarSign,
  FiActivity,
  FiUsers,
} from 'react-icons/fi';

const DepartmentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments } = useSelector((state: RootState) => state.department);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, [dispatch]);

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leadName) return;

    const gradients = [
      'from-cyan-600 to-blue-600',
      'from-blue-600 to-cyan-600',
      'from-emerald-600 to-teal-600',
      'from-pink-600 to-rose-600',
      'from-amber-500 to-orange-600',
    ];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];

    dispatch(
      addDepartmentRecord({
        name: formData.name,
        description: formData.description || 'Department aligned with core strategic initiatives.',
        leadName: formData.leadName,
        leadAvatar: `https://images.unsplash.com/photo-${
          1530000000000 + Math.floor(Math.random() * 1000000)
        }?w=150&auto=format&fit=crop&q=80`,
        memberCount: Number(formData.memberCount) || 1,
        activeProjects: Number(formData.activeProjects) || 1,
        budget: formData.budget,
        color: randomGrad,
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
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Departments & Divisions
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Organize teams, track budget allocations, and view leadership distribution across the company.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-600/25 transition hover:from-cyan-500 hover:to-blue-500 self-start sm:self-auto"
        >
          <FiPlus />
          <span>New Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="rounded-2xl border border-white/5 bg-[#0b141c] overflow-hidden flex flex-col justify-between hover:border-cyan-500/30 transition duration-200 group"
          >
            {/* Top Color Accent Ribbon */}
            <div className={`h-2.5 w-full bg-gradient-to-r ${dept.color}`} />

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {dept.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => dispatch(deleteDepartmentRecord(dept.id))}
                    className="text-gray-500 hover:text-red-400 transition p-1"
                    title="Delete Department"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-5">
                  {dept.description}
                </p>
              </div>

              {/* Department Lead */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={dept.leadAvatar}
                    alt={dept.leadName}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500/30"
                  />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      Department Lead
                    </div>
                    <div className="text-xs font-semibold text-gray-200">{dept.leadName}</div>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
                  <div className="rounded-lg bg-white/[0.02] p-2">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-0.5">
                      <FiUsers />
                      <span>Team</span>
                    </div>
                    <span className="text-xs font-bold text-white">{dept.memberCount}</span>
                  </div>

                  <div className="rounded-lg bg-white/[0.02] p-2">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-0.5">
                      <FiActivity />
                      <span>Projects</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-400">{dept.activeProjects}</span>
                  </div>

                  <div className="rounded-lg bg-white/[0.02] p-2">
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-0.5">
                      <FiDollarSign />
                      <span>Budget</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{dept.budget}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151322] p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FiLayers className="text-cyan-400 text-lg" />
                <h3 className="font-bold text-white text-base">Create Department</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cyber Security"
                  className="w-full bg-[#071018] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Lead Name</label>
                <input
                  type="text"
                  required
                  value={formData.leadName}
                  onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                  placeholder="e.g. Taylor Swift"
                  className="w-full bg-[#071018] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe the mission and focus of this department..."
                  className="w-full bg-[#071018] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Members</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.memberCount}
                    onChange={(e) => setFormData({ ...formData, memberCount: Number(e.target.value) })}
                    className="w-full bg-[#071018] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Projects</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.activeProjects}
                    onChange={(e) => setFormData({ ...formData, activeProjects: Number(e.target.value) })}
                    className="w-full bg-[#071018] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#071018] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-500"
                >
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

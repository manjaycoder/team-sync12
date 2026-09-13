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
} from '../state/employeeSlice';
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
  FiUserPlus,
  FiMapPin,
  FiMail,
  FiBriefcase,
} from 'react-icons/fi';

const EmployeeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, searchQuery, selectedDepartment, statusFilter } = useSelector(
    (state: RootState) => state.employee
  );
  const { departments } = useSelector((state: RootState) => state.department);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'active' as 'active' | 'remote' | 'on_leave',
    location: '',
  });

  useEffect(() => {
    dispatch(fetchEmployees());
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
      location: '',
    });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case 'remote':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Remote
          </span>
        );
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            On Leave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Employee Directory
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your synchronized team members, roles, and departmental access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-500 hover:to-indigo-500 self-start sm:self-auto"
        >
          <FiPlus />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-[#12101e] p-3.5 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by name, email, or role..."
            className="w-full bg-[#171426] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div className="flex gap-2">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => dispatch(setSelectedDepartment(e.target.value))}
            className="bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-violet-500 transition"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-violet-500 transition"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="remote">Remote</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Employee List Table / Grid */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#12101e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#161324] text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role & Dept</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No employees found matching the filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-violet-500/30"
                        />
                        <div>
                          <div className="font-semibold text-white">{emp.name}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <FiMail className="text-[10px]" />
                            <span>{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-200">{emp.role}</div>
                      <div className="text-[11px] text-violet-400 flex items-center gap-1">
                        <FiBriefcase className="text-[10px]" />
                        <span>{emp.department}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(emp.status)}</td>

                    <td className="py-3.5 px-4 text-gray-400">
                      <div className="flex items-center gap-1 text-[11px]">
                        <FiMapPin className="text-gray-500" />
                        <span>{emp.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">{emp.joinedDate}</td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => dispatch(deleteEmployeeRecord(emp.id))}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition"
                        title="Remove member"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151322] p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FiUserPlus className="text-violet-400 text-lg" />
                <h3 className="font-bold text-white text-base">Add New Team Member</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  className="w-full bg-[#0d0b17] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan@team-sync.space"
                  className="w-full bg-[#0d0b17] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Role / Title</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-[#0d0b17] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#0d0b17] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'remote' | 'on_leave',
                      })
                    }
                    className="w-full bg-[#0d0b17] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
                  >
                    <option value="active">Active</option>
                    <option value="remote">Remote</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. New York, USA"
                  className="w-full bg-[#0d0b17] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500"
                >
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

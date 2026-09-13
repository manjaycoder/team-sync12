import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../routes/store';
import { addEmployee } from '../../../auth/state/auth/authSlice';
import { API_BASE_URL } from '../../../../config/axiosInstance';
import {
  FiUser,
  FiServer,
  FiCheck,
  FiShield,
  FiSave,
} from 'react-icons/fi';

const Settings = () => {
  const dispatch = useDispatch();
  const { employee } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(employee?.name || 'Alex Morgan');
  const [email, setEmail] = useState(employee?.email || 'alex.morgan@team-sync.space');
  const [role, setRole] = useState(employee?.role || 'Lead Systems Architect');
  const [department, setDepartment] = useState(employee?.department || 'Engineering');
  const [avatar, setAvatar] = useState(
    employee?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addEmployee({
        id: employee?.id || 1,
        name,
        email,
        role,
        department,
        avatar,
      })
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Workspace Settings & Profile
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure your user identity, synchronization engine settings, and API preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-300 animate-fadeIn">
          <FiCheck className="text-emerald-400" />
          <span>Profile preferences updated and synchronized successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="rounded-2xl border border-white/5 bg-[#12101e] p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
          <div className="p-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
            <FiUser size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Personal Profile</h2>
            <p className="text-[11px] text-gray-400">
              Update your publicly visible workforce card details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex items-center gap-5">
            <img
              src={avatar}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover ring-2 ring-violet-500/40"
            />
            <div className="flex-1">
              <label className="block text-gray-300 font-semibold mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#171426] border border-white/10 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500 transition"
            >
              <FiSave size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backend & API Settings Card */}
      <div className="rounded-2xl border border-white/5 bg-[#12101e] p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="p-2 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400">
            <FiServer size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">API Gateway & Synchronization</h2>
            <p className="text-[11px] text-gray-400">
              Active backend endpoint configured for workforce queries.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-400 font-medium mb-1">Connected Base URL</label>
            <div className="p-3 rounded-xl bg-[#171426] border border-white/10 font-mono text-violet-300 text-xs flex items-center justify-between">
              <span>{API_BASE_URL}</span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-sans">
                Configured
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-[11px] text-gray-300 leading-relaxed">
            <p className="font-semibold text-violet-300 mb-1">Developer Tip:</p>
            You can override this in your root <code className="text-white bg-black/40 px-1 py-0.5 rounded">.env</code> file by defining{' '}
            <code className="text-violet-300 bg-black/40 px-1 py-0.5 rounded">VITE_API_URL=http://localhost:5000/api</code> for local development or staging servers.
          </div>
        </div>
      </div>

      {/* Security & System Info */}
      <div className="rounded-2xl border border-white/5 bg-[#12101e] p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="p-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
            <FiShield size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Security & Audit Status</h2>
            <p className="text-[11px] text-gray-400">Enterprise authentication session credentials.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-gray-500 block text-[10px] uppercase font-bold">Session Mode</span>
            <span className="font-medium text-white">HttpOnly Cookie + Redux Sync</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-gray-500 block text-[10px] uppercase font-bold">Audit Standard</span>
            <span className="font-medium text-emerald-400">SOC2 Type II Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

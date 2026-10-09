import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../routes/store';
import { updateEmployee } from '../../../auth/state/auth/authSlice';
import { API_BASE_URL } from '../../../../config/axiosInstance';
import {
  FiUser,
  FiServer,
  FiCheck,
  FiSave,
} from 'react-icons/fi';

export const Settings = () => {
  const dispatch = useDispatch();
  const { employee } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [role, setRole] = useState(employee?.role || 'Team Member');
  const [department, setDepartment] = useState(employee?.department || 'Engineering');
  const [avatar, setAvatar] = useState(
    employee?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateEmployee({
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Workspace Settings & Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure your user identity, synchronization preferences, and connected workspace endpoints.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 animate-fadeIn">
          <FiCheck className="text-emerald-500" />
          <span>Profile preferences updated and synchronized successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="saas-card p-5 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <FiUser size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Personal Profile</h2>
            <p className="text-[11px] text-slate-500">
              Update your publicly visible team member details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt="Avatar preview"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex-1">
              <label className="block text-slate-700 font-medium mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="saas-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="saas-input w-full"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="saas-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="saas-input w-full"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="saas-input w-full"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="saas-button-primary text-xs">
              <FiSave size={13} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Workspace System & API Info */}
      <div className="saas-card p-5 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
            <FiServer size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Telemetry & Connected APIs</h2>
            <p className="text-[11px] text-slate-500">Live service configuration and connectivity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-400 font-medium">Backend API Target</div>
            <div className="font-mono text-xs text-slate-800 font-semibold mt-1 truncate">
              {API_BASE_URL}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">Connected & Synchronized</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] text-slate-400 font-medium">AI Intelligence Engine</div>
            <div className="font-semibold text-slate-800 mt-1">Google Gemini 1.5 Flash</div>
            <div className="text-[10px] text-indigo-600 font-medium mt-1">Active with Local Fallback</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

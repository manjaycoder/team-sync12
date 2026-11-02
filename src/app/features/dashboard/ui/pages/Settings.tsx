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
  FiShield,
  FiCpu,
  FiActivity,
} from 'react-icons/fi';

export const Settings = () => {
  const dispatch = useDispatch();
  const { employee } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(employee?.name || 'Administrator');
  const [email, setEmail] = useState(employee?.email || 'admin@teamsync.io');
  const [role, setRole] = useState(employee?.role || 'Lead Architect');
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
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Workspace Configuration
          </h1>
          <span className="ts-badge-info font-mono text-[10px]">
            Node 01-PROD
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage your neural identity, cluster synchronization preferences, and connected AI telemetry endpoints.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 animate-fadeIn font-mono">
          <FiCheck className="text-emerald-400" size={16} />
          <span>Profile preferences updated and synchronized across all cluster nodes successfully.</span>
        </div>
      )}

      {/* 2. Personal Profile Card */}
      <div className="ts-card p-6 space-y-6 relative overflow-hidden">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <FiUser size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Operator Identity & Profile</h2>
            <p className="text-xs text-slate-400">
              Configure your executive identity visible across the Team-Sync workspace.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <img
              src={avatar}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover ring-2 ring-indigo-500/40 shadow-lg"
            />
            <div className="flex-1">
              <label className="block text-slate-300 font-medium mb-1.5">Avatar Resource URI</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="ts-input w-full font-mono text-xs"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ts-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ts-input w-full font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Organizational Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="ts-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Assigned Division</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="ts-input w-full"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="ts-btn-primary text-xs">
              <FiSave size={14} />
              <span>Save & Synchronize</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Workspace System & API Info */}
      <div className="ts-card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
            <FiServer size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Telemetry & Cluster Architecture</h2>
            <p className="text-xs text-slate-400">Live service configuration, neural engine status, and encryption telemetry.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">API Endpoint Target</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="font-mono text-xs text-white font-semibold truncate">
              {API_BASE_URL}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Latency: 12ms • REST / WebSocket
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">AI Intelligence Core</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                <FiCpu size={11} /> Active
              </span>
            </div>
            <div className="font-semibold text-white text-xs font-display">
              Google Gemini 1.5 Flash
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Local Heuristic Redundancy Enabled
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Cluster Security</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-400">
                <FiShield size={11} /> 256-Bit
              </span>
            </div>
            <div className="font-semibold text-white text-xs font-display">
              End-to-End Enterprise Vault
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              JWT Bearer Authentication Active
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Uptime SLA</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <FiActivity size={11} /> 99.98%
              </span>
            </div>
            <div className="font-semibold text-white text-xs font-display">
              High Availability Multi-Region
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Zero Unscheduled Downtime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
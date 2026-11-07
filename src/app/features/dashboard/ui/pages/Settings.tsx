import { useState } from 'react';
import { useUser, UserProfile } from '@clerk/clerk-react';
import {
  FiUser,
  FiServer,
  FiCheck,
  FiCpu,
  FiShield,
  FiActivity,
  FiExternalLink,
} from 'react-icons/fi';
import { API_BASE_URL } from '../../../../config/axiosInstance';

export const Settings = () => {
  const { user, isLoaded } = useUser();
  const [showClerkProfile, setShowClerkProfile] = useState(false);
  const [savedSuccess] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
      </div>
    );
  }

  const displayName = user?.fullName || user?.username || 'Team Member';
  const displayEmail = user?.primaryEmailAddress?.emailAddress || '';
  const displayAvatar = user?.imageUrl || '';
  const displayRole = (user?.publicMetadata?.role as string) || 'Team Member';
  const displayDept = (user?.publicMetadata?.department as string) || 'Engineering';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Workspace Configuration
          </h1>
          <span className="ts-badge-info font-mono text-[10px]">Node 01-PROD</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage your identity, cluster preferences, and connected AI telemetry endpoints.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 animate-fadeIn font-mono">
          <FiCheck className="text-emerald-400" size={16} />
          <span>Profile synchronized successfully across all workspace nodes.</span>
        </div>
      )}

      {/* 2. Clerk Identity Card */}
      <div className="ts-card p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-56 h-56 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 pb-5 border-b border-white/[0.08]">
          <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center shadow-md shadow-white/20">
            <FiUser size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Operator Identity</h2>
            <p className="text-xs text-neutral-400">Managed by Clerk Enterprise Authentication</p>
          </div>
          <button
            type="button"
            onClick={() => setShowClerkProfile(true)}
            className="ml-auto ts-btn-secondary text-xs flex items-center gap-1.5"
          >
            <FiExternalLink size={13} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Identity Display */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 pt-5">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/30 shadow-xl shrink-0"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-bold font-display shrink-0 shadow-xl shadow-white/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-3 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Full Name
                </span>
                <span className="font-semibold text-white">{displayName}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Primary Email
                </span>
                <span className="font-mono text-cyan-300 text-xs truncate block">{displayEmail}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Organizational Role
                </span>
                <span className="font-semibold text-white">{displayRole}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                  Assigned Division
                </span>
                <span className="font-semibold text-white">{displayDept}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified by Clerk Enterprise • MFA Available • SOC 2 Compliant
            </div>
          </div>
        </div>

        {/* Open Full Clerk Profile Modal */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setShowClerkProfile(true)}
            className="ts-btn-primary text-xs"
          >
            <FiUser size={14} />
            <span>Open Full Profile Manager</span>
          </button>
          <p className="text-[11px] text-slate-500 mt-2 font-mono">
            Change name, avatar, email, passwords, MFA, and connected OAuth accounts via Clerk's secure profile portal.
          </p>
        </div>
      </div>

      {/* 3. Workspace System & API Info */}
      <div className="ts-card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
            <FiServer size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Telemetry & Cluster Architecture</h2>
            <p className="text-xs text-slate-400">
              Live service configuration, neural engine status, and security telemetry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                API Endpoint Target
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <div className="font-mono text-xs text-white font-semibold truncate">{API_BASE_URL}</div>
            <div className="text-[11px] text-slate-400 font-mono">Latency: 12ms • REST / WebSocket</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                AI Intelligence Core
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                <FiCpu size={11} /> Active
              </span>
            </div>
            <div className="font-semibold text-white text-xs font-display">Google Gemini 1.5 Flash</div>
            <div className="text-[11px] text-slate-400 font-mono">Local Heuristic Redundancy Enabled</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Authentication Provider
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#60A5FA]">
                <FiShield size={11} /> Clerk
              </span>
            </div>
            <div className="font-semibold text-white text-xs font-display">Clerk Enterprise Auth</div>
            <div className="text-[11px] text-slate-400 font-mono">JWT + OAuth 2.0 • MFA • SSO Ready</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Uptime SLA
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <FiActivity size={11} /> 99.98%
              </span>
            </div>
            <div className="font-semibold text-white text-xs font-display">
              High Availability Multi-Region
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Zero Unscheduled Downtime</div>
          </div>
        </div>
      </div>

      {/* 4. Clerk UserProfile Modal */}
      {showClerkProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClerkProfile(false);
          }}
        >
          <div className="relative bg-transparent max-h-[90vh] overflow-y-auto rounded-2xl w-full max-w-3xl">
            <button
              type="button"
              onClick={() => setShowClerkProfile(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-[#0b101c] border border-white/[0.1] text-slate-400 hover:text-white transition"
              aria-label="Close profile"
            >
              ✕
            </button>
            <UserProfile
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-[#08080a] border border-white/15 shadow-2xl rounded-2xl',
                  headerTitle: 'text-white font-display font-bold',
                  headerSubtitle: 'text-neutral-400',
                  profileSectionTitle: 'text-white font-display',
                  profileSectionTitleText: 'text-white',
                  profileSectionContent: 'text-neutral-300',
                  formFieldLabel: 'text-neutral-300',
                  formFieldInput:
                    'bg-[#111114] border border-white/15 text-white placeholder:text-neutral-500 focus:border-white rounded-xl',
                  formButtonPrimary:
                    'bg-white hover:bg-neutral-200 text-black font-bold uppercase font-mono tracking-wider text-xs rounded-xl py-2.5 shadow-md shadow-white/10',
                  navbar: 'bg-[#08080a] border-r border-white/15',
                  navbarButton: 'text-neutral-400 hover:text-white hover:bg-white/[0.06]',
                  badge: 'bg-white/10 text-white border border-white/20',
                  accordionTriggerButton: 'text-neutral-200 hover:bg-white/[0.04]',
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

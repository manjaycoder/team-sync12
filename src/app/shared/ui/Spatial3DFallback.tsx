import React from 'react';
import {
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  RefreshCw,
  Box,
  TrendingUp,
} from 'lucide-react';

interface Spatial3DFallbackProps {
  type?: 'workspace' | 'network' | 'analytics';
  onRetry?: () => void;
  height?: string | number;
}

export const Spatial3DFallback: React.FC<Spatial3DFallbackProps> = ({
  type = 'workspace',
  onRetry,
  height = '100%',
}) => {
  return (
    <div
      className="w-full rounded-2xl bg-gradient-to-b from-[#0B132B]/90 via-[#0A0F1D]/90 to-[#070A12]/95 border border-blue-900/40 p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-xl select-none"
      style={{ height: typeof height === 'number' ? `${height}px` : height, minHeight: 340 }}
    >
      {/* Ambient Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
            {type === 'workspace' && <Box className="w-4 h-4" />}
            {type === 'network' && <Users className="w-4 h-4" />}
            {type === 'analytics' && <TrendingUp className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight font-display flex items-center gap-1.5">
              {type === 'workspace' && 'TeamSync Spatial Workspace'}
              {type === 'network' && 'Global Collaboration Network'}
              {type === 'analytics' && 'Sprint Velocity Metrics'}
              <span className="text-[9px] font-mono uppercase bg-blue-500/15 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                2D Fallback
              </span>
            </h4>
            <p className="text-[10px] text-neutral-400 font-sans">
              High-performance interactive layout active
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all active:scale-95"
            title="Reload 3D WebGL Canvas"
          >
            <RefreshCw className="w-3 h-3" />
            Retry 3D
          </button>
        )}
      </div>

      {/* Middle Interactive Simulation */}
      {type === 'workspace' && (
        <div className="relative z-10 grid grid-cols-3 gap-3 my-3 flex-1 items-center">
          {/* Column 1: Backlog */}
          <div className="bg-[#0D1527]/80 rounded-xl border border-white/5 p-3 flex flex-col gap-2 h-full justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>BACKLOG</span>
              <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center text-neutral-300">3</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/30 text-[11px] text-neutral-200">
              <p className="font-semibold text-white truncate">Clerk v5 SSO Integration</p>
              <div className="flex items-center gap-1 text-[9px] text-blue-400 mt-1">
                <Clock className="w-2.5 h-2.5" /> High Priority
              </div>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-neutral-400" /> Alex M. assigned
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-[#0F1B38]/90 rounded-xl border border-blue-500/20 p-3 flex flex-col gap-2 h-full justify-between shadow-lg shadow-blue-950/30">
            <div className="flex items-center justify-between text-[11px] font-mono text-blue-300">
              <span>IN PROGRESS</span>
              <span className="w-4 h-4 rounded-full bg-blue-900/60 text-[10px] flex items-center justify-center text-blue-200">4</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-900/40 border border-blue-500/40 text-[11px] text-neutral-200">
              <p className="font-semibold text-white truncate">Spring Boot 3 REST APIs</p>
              <div className="flex items-center gap-1 text-[9px] text-cyan-400 mt-1">
                <Sparkles className="w-2.5 h-2.5" /> Active Review
              </div>
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" /> Sarah C. assigned
            </div>
          </div>

          {/* Column 3: Done */}
          <div className="bg-[#0B1724]/80 rounded-xl border border-emerald-500/20 p-3 flex flex-col gap-2 h-full justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>SHIPPED</span>
              <span className="w-4 h-4 rounded-full bg-emerald-950 text-[10px] flex items-center justify-center text-emerald-300">12</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-neutral-200">
              <p className="font-semibold text-white truncate">MongoDB Atlas Replica</p>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 mt-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Production Deployed
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Verified
            </div>
          </div>
        </div>
      )}

      {type !== 'workspace' && (
        <div className="relative z-10 my-4 flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-bold text-white font-mono">99.98%</p>
              <p className="text-[10px] text-neutral-400">Cluster Uptime</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-bold text-blue-400 font-mono">14ms</p>
              <p className="text-[10px] text-neutral-400">P99 Latency</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-bold text-emerald-400 font-mono">3.8x</p>
              <p className="text-[10px] text-neutral-400">Sprint Multiplier</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xl font-bold text-purple-400 font-mono">250k+</p>
              <p className="text-[10px] text-neutral-400">Tasks Synced</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Ribbon */}
      <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
        <span className="flex items-center gap-1.5 text-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Enterprise Node Cluster Synchronized
        </span>
        <span className="text-neutral-500">WebGL Optimized</span>
      </div>
    </div>
  );
};

export default Spatial3DFallback;

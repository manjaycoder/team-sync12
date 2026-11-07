import React from 'react';

interface AwwwardsLoaderProps {
  label?: string;
  sublabel?: string;
  fullScreen?: boolean;
}

export const AwwwardsLoader: React.FC<AwwwardsLoaderProps> = ({
  label = 'Synchronizing Workspace',
  sublabel = 'Autonomous System Handshake',
  fullScreen = true,
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-black text-white flex flex-col items-center justify-center select-none ${
        fullScreen ? 'fixed inset-0 z-50 min-h-screen w-screen' : 'min-h-[400px] w-full py-16'
      }`}
    >
      {/* Ambient background grid & glow matching landing page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-30" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Concentric Rings & Monogram */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer glowing pulsing ring */}
          <div className="absolute h-24 w-24 rounded-full border border-white/10 animate-ping opacity-25" />
          
          {/* Rotating dashed ring */}
          <div className="h-20 w-20 rounded-full border border-white/20 border-t-white border-r-white/40 animate-spin [animation-duration:1.4s]" />

          {/* Inner counter-rotating ring */}
          <div className="absolute h-14 w-14 rounded-full border border-white/15 border-b-white animate-spin [animation-duration:2.2s] [animation-direction:reverse]" />

          {/* Central Logo Monogram */}
          <div className="absolute h-10 w-10 rounded-xl bg-white text-black font-display font-black text-sm flex items-center justify-center shadow-lg shadow-white/20">
            TS
          </div>
        </div>

        {/* Brand Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 mb-3 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
            {sublabel}
          </span>
        </div>

        {/* Primary Monospace Label */}
        <h3 className="font-display text-base font-bold tracking-tight text-white mb-2">
          {label}
        </h3>

        {/* Shimmering Progress Bar */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative mt-3">
          <div className="absolute inset-y-0 left-0 bg-white w-1/3 rounded-full animate-[progress_1.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default AwwwardsLoader;


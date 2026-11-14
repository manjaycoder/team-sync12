import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertOctagon, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export const RouteErrorElement: React.FC = () => {
  const error = useRouteError() as any;

  let title = 'Unexpected Application Error';
  let message = 'An unexpected error occurred while navigating the application.';
  let isDynamicImport = false;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || 'The requested page could not be loaded.';
  } else if (error instanceof Error) {
    const errText = error.message.toLowerCase();
    if (
      errText.includes('dynamically imported') ||
      errText.includes('failed to fetch') ||
      errText.includes('chunk')
    ) {
      isDynamicImport = true;
      title = 'New System Update Available';
      message =
        'A new version of TeamSync has been deployed. Reload to get the latest workspace updates.';
    } else {
      message = error.message;
    }
  }

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col justify-between overflow-x-hidden selection:bg-white selection:text-black">
      {/* Background Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-blue-600/[0.06] blur-[150px]" />
        <div className="absolute inset-0 bg-grid-white opacity-30" />
      </div>

      {/* Header */}
      <header className="relative z-20 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-white text-black font-display font-black text-sm flex items-center justify-center shadow-lg shadow-white/20 transition-transform group-hover:scale-105">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm text-white tracking-tight">Team-Sync</span>
              <span className="text-[9px] font-mono uppercase text-neutral-400">Precision OS</span>
            </div>
          </Link>

          <button
            onClick={handleReload}
            className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/30 transition-all bg-white/[0.03]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload App
          </button>
        </div>
      </header>

      {/* Center Error Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-3xl bg-[#090D1A]/90 border border-white/15 p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-5 shadow-lg shadow-blue-950/50">
            {isDynamicImport ? <RefreshCw className="w-8 h-8" /> : <AlertOctagon className="w-8 h-8 text-red-400" />}
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display mb-2">
            {title}
          </h1>

          <p className="text-sm text-neutral-400 font-sans leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleReload}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>

            <Link
              to="/home"
              className="px-5 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold text-xs flex items-center gap-2 hover:bg-blue-600/30 transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Link>

            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-white/5 text-neutral-300 border border-white/10 font-semibold text-xs flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-4 text-center text-xs font-mono text-neutral-500">
        TeamSync High-Availability Recovery System · Active
      </footer>
    </div>
  );
};

export default RouteErrorElement;

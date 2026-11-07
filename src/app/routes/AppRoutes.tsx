import { createBrowserRouter, RouterProvider, Navigate, Link } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../features/dashboard/ui/pages/Home';
import EmployeeList from '../features/employee/ui/EmployeeList';
import DepartmentList from '../features/departments/ui/DepartmentList';
import ProjectsWorkspace from '../features/projects/ui/ProjectsWorkspace';
import AICopilotPage from '../features/ai/ui/AICopilotPage';
import Settings from '../features/dashboard/ui/pages/Settings';
import PublicWebsite from '../features/public/ui/PublicWebsite';
import AwwwardsLoader from '../shared/ui/AwwwardsLoader';
import { ArrowLeft, ShieldCheck, Zap, Bot, Users, CheckCircle2 } from 'lucide-react';

// ─── Protected: redirect to Clerk's sign-in if not authenticated ─────────────
const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <AwwwardsLoader label="Authenticating Session..." sublabel="Secure Handshake" />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
};

// ─── Public-only: redirect to dashboard if already signed in ─────────────────
const PublicOnlyRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <AwwwardsLoader label="Verifying Credentials..." sublabel="Zero-Trust Verification" />;
  if (isSignedIn) return <Navigate to="/home" replace />;

  return <>{children}</>;
};

const router = createBrowserRouter([
  // ── Public marketing page ───────────────────────────────────────────────────
  {
    path: '/',
    element: (
      <PublicOnlyRoutes>
        <PublicWebsite />
      </PublicOnlyRoutes>
    ),
  },

  // ── Clerk-hosted auth pages (Clerk handles these automatically) ──────────────
  // /sign-in and /sign-up are served by Clerk's hosted UI.
  // They redirect back to /home after success.
  {
    path: '/sign-in',
    element: (
      <PublicOnlyRoutes>
        <ClerkSignInPage />
      </PublicOnlyRoutes>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <PublicOnlyRoutes>
        <ClerkSignUpPage />
      </PublicOnlyRoutes>
    ),
  },

  // ── Authenticated dashboard ─────────────────────────────────────────────────
  {
    path: '/home',
    element: (
      <ProtectedRoutes>
        <DashboardLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <ProjectsWorkspace /> },
      { path: 'employees', element: <EmployeeList /> },
      { path: 'departments', element: <DepartmentList /> },
      { path: 'ai-copilot', element: <AICopilotPage /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // ── Legacy route redirects ──────────────────────────────────────────────────
  { path: '/login', element: <Navigate to="/sign-in" replace /> },
  { path: '/register', element: <Navigate to="/sign-up" replace /> },

  // ── Fallback ────────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;

// ─── Precision Monochromatic Awwwards Auth Shell ─────────────────────────────
interface AuthLayoutShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayoutShell = ({ title, subtitle, children }: AuthLayoutShellProps) => {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col justify-between overflow-x-hidden selection:bg-white selection:text-black">
      {/* Ambient background lighting matching landing page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-white/[0.04] blur-[150px]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/[0.025] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.03] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-40" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="h-8 w-8 rounded-lg bg-white text-black font-display font-black text-sm flex items-center justify-center shadow-lg shadow-white/20 transition-transform group-hover:scale-105">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm text-white tracking-tight">Team-Sync</span>
              <span className="text-[9px] font-mono uppercase text-neutral-400">Precision OS</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM 100% OPERATIONAL
            </span>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-white/15 hover:bg-white/5"
            >
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dual-Panel Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Bold Editorial Presentation */}
          <div className="lg:col-span-6 hidden lg:flex flex-col items-start pr-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 mb-6 backdrop-blur-md">
              <ShieldCheck size={12} className="text-white" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                Enterprise Zero-Trust Authentication
              </span>
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.08]">
              The Operating System for{' '}
              <span className="aw-text-gradient">modern teams</span>.
            </h1>

            <p className="mt-5 text-neutral-400 font-sans text-sm leading-relaxed max-w-md">
              Synchronize your engineering roadmaps, department personnel, and autonomous Gemini AI copilots inside one continuous spatial workflow.
            </p>

            {/* Editorial Feature Highlights */}
            <div className="mt-8 space-y-3 w-full max-w-md">
              {[
                {
                  icon: Zap,
                  title: 'Real-Time Neural Workspace',
                  desc: 'Instant state propagation across tasks and Kanban boards.',
                },
                {
                  icon: Bot,
                  title: 'Gemini Context AI Copilot',
                  desc: 'Autonomous sprint summarization and automated drafting.',
                },
                {
                  icon: Users,
                  title: 'Cryptographic Role Governance',
                  desc: 'Enterprise RBAC, audit trails, and multi-tenant security.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-start gap-3.5 hover:border-white/25 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 mt-0.5">
                      <Icon size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-display">{item.title}</h4>
                      <p className="text-[11px] text-neutral-400 font-sans mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Proof Strip */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4 w-full">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-7 w-7 rounded-full border-2 border-black object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="text-xs text-neutral-400 font-sans">
                <span className="text-white font-bold">10,000+ teams</span> synchronized worldwide
              </div>
            </div>
          </div>

          {/* Right Column: Precision Framed Auth Form */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-[440px] flex flex-col items-center">
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-xl bg-white text-black font-display font-black text-sm mb-3 shadow-lg shadow-white/20">
                  TS
                </div>
                <h2 className="text-2xl font-black font-display text-white tracking-tight">{title}</h2>
                <p className="text-xs text-neutral-400 mt-1 font-sans">{subtitle}</p>
              </div>

              {/* Clerk Auth Component Wrapper */}
              <div className="w-full flex justify-center">
                {children}
              </div>

              {/* Security Compliance Micro-Label */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center">
                <CheckCircle2 size={12} className="text-neutral-400" />
                <span>256-bit TLS • SOC2 Type II Certified • Zero Telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 py-4 px-4 text-center text-[11px] font-mono text-neutral-500">
        Team-Sync &copy; {new Date().getFullYear()} Precision Software Technologies. All rights reserved.
      </footer>
    </div>
  );
};

function ClerkSignInPage() {
  return (
    <AuthLayoutShell
      title="Welcome Back"
      subtitle="Access your synchronized workspace and active sprints"
    >
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/home"
        signUpUrl="/sign-up"
      />
    </AuthLayoutShell>
  );
}

function ClerkSignUpPage() {
  return (
    <AuthLayoutShell
      title="Create Workspace"
      subtitle="Start deploying team projects and AI workflows in seconds"
    >
      <SignUp
        routing="hash"
        fallbackRedirectUrl="/home"
        signInUrl="/sign-in"
      />
    </AuthLayoutShell>
  );
}

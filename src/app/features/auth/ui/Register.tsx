import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiShield,
  FiArrowLeft,
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiCpu,
  FiActivity,
} from 'react-icons/fi';

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (!pw) return { label: 'Too short', percent: 0, color: 'bg-slate-700' };
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  const percent = (score / 4) * 100;
  const label = score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';
  const color =
    score <= 1
      ? 'bg-rose-500'
      : score === 2
      ? 'bg-amber-400'
      : score === 3
      ? 'bg-indigo-500'
      : 'bg-emerald-400';
  return { label, percent, color };
};

export const Register: React.FC = () => {
  const {
    registerRegister,
    registerHandleSubmit,
    registerErrors,
    registerWatch,
    onRegisterSubmit,
    isLoading,
    error,
    clearAuthError,
  } = useAuth();

  const navigate = useNavigate();
  const password = registerWatch('password') || '';
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  return (
    <div className="min-h-screen flex bg-[#070a12] text-white relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white opacity-20" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Left Feature Showcase Banner (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 border-r border-white/10 relative z-10 bg-slate-950/40 backdrop-blur-xl">
        <div>
          {/* Brand Mark */}
          <div className="flex items-center gap-3 mb-16">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white font-display font-extrabold text-base shadow-lg shadow-indigo-500/30">
              TS
              <div className="absolute -inset-1 rounded-2xl bg-indigo-500/30 blur-sm -z-10" />
            </div>
            <div>
              <span className="text-xl font-display font-bold tracking-tight text-white block">
                Team-Sync
              </span>
              <span className="text-[11px] font-mono text-indigo-400">ENTERPRISE CLOUD</span>
            </div>
          </div>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono text-indigo-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>THE INTELLIGENCE OPERATING SYSTEM</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight leading-tight mb-4 text-white">
              Unify teams, roadmaps, and delivery in one shared workspace.
            </h2>
            <p className="text-slate-400 text-sm font-sans leading-relaxed mb-10">
              Real-time synchronization for engineering, product, and cross-functional teams powered
              by Google Gemini AI.
            </p>

            <div className="space-y-5 text-sm font-sans">
              <div className="flex items-start gap-3.5 text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <FiCheckCircle size={14} />
                </span>
                <span>Automated department capacity tracking &amp; cross-team Kanban sync</span>
              </div>
              <div className="flex items-start gap-3.5 text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <FiActivity size={14} />
                </span>
                <span>Interactive employee directory, workloads, and real-time velocity metrics</span>
              </div>
              <div className="flex items-start gap-3.5 text-slate-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  <FiCpu size={14} />
                </span>
                <span>Context-aware Gemini AI copilot for immediate organizational answers</span>
              </div>
            </div>
          </div>
        </div>

        {/* System telemetry footer */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>&copy; 2026 Team-Sync Cloud</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <FiShield className="text-emerald-400" /> SOC2 Verified
            </span>
            <span>&bull;</span>
            <span className="text-cyan-400">99.99% Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO TEAM-SYNC HOME</span>
          </button>

          {/* Form Card */}
          <div className="w-full rounded-3xl border border-white/15 bg-slate-900/70 p-8 sm:p-10 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl">
            <div className="mb-6">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Create your account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
                Join your organization on Team-Sync today.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 leading-relaxed">
                {typeof error === 'string' ? error : String(error)}
              </div>
            )}

            <form onSubmit={registerHandleSubmit(onRegisterSubmit)} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-medium text-slate-300 mb-1.5 font-sans">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    {...registerRegister('fullName', { required: 'Full name is required' })}
                    className={`ts-input w-full pl-10 ${registerErrors.fullName ? '!border-rose-500' : ''}`}
                    placeholder="Sarah Jenkins"
                  />
                </div>
                {registerErrors.fullName && (
                  <p className="text-rose-400 text-xs mt-1.5 font-mono">
                    {registerErrors.fullName.message}
                  </p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label className="block font-medium text-slate-300 mb-1.5 font-sans">
                  Work Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    {...registerRegister('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      },
                    })}
                    className={`ts-input w-full pl-10 ${registerErrors.email ? '!border-rose-500' : ''}`}
                    placeholder="sarah.jenkins@company.com"
                    type="email"
                  />
                </div>
                {registerErrors.email && (
                  <p className="text-rose-400 text-xs mt-1.5 font-mono">
                    {registerErrors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block font-medium text-slate-300 mb-1.5 font-sans">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    {...registerRegister('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    className={`ts-input w-full pl-10 ${registerErrors.password ? '!border-rose-500' : ''}`}
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                {registerErrors.password && (
                  <p className="text-rose-400 text-xs mt-1.5 font-mono">
                    {registerErrors.password.message}
                  </p>
                )}

                {/* Password strength meter */}
                {password && (
                  <div className="mt-2.5">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1.5 flex justify-between">
                      <span>Strength: {strength.label}</span>
                      <span>{strength.percent}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center pt-2">
                <input
                  {...registerRegister('terms', { required: 'You must agree to the terms' })}
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="terms" className="ml-2.5 text-xs text-slate-300 cursor-pointer font-sans">
                  I agree to the{' '}
                  <span className="text-indigo-400 underline hover:text-indigo-300">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-indigo-400 underline hover:text-indigo-300">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>
              {registerErrors.terms && (
                <p className="text-rose-400 text-xs font-mono">{registerErrors.terms.message}</p>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 mt-4"
              >
                <span>{isLoading ? 'Creating account...' : 'Complete Registration'}</span>
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="text-center text-xs text-slate-400 pt-5 border-t border-white/10 mt-6 font-sans">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

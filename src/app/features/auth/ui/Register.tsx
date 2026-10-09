import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShield } from 'react-icons/fi';

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (!pw) return { label: 'Too short', percent: 0, color: 'bg-slate-300' };
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
      : 'bg-emerald-500';
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
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Left Feature Showcase Banner */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-white p-12 border-r border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs">
              TS
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Team-Sync Enterprise</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight leading-tight mb-4 text-slate-900">
              Unify your teams, departments, and deliverables in one workspace.
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed mb-8">
              Real-time synchronization for engineering, operations, and cross-functional teams with Google Gemini AI intelligence.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-700">
                <FiCheckCircle className="text-indigo-600 text-base shrink-0" />
                <span>Automated department capacity tracking & project sync</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiCheckCircle className="text-indigo-600 text-base shrink-0" />
                <span>Interactive employee directory, workloads, and role matrices</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FiShield className="text-indigo-600 text-base shrink-0" />
                <span>Context-aware AI copilot for immediate organizational answers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div>© 2026 Team-Sync Cloud</div>
          <div className="flex gap-4">
            <span>SOC2 Ready</span>
            <span>•</span>
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-xs text-slate-500">Join your company on Team-Sync today.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {typeof error === 'string' ? error : String(error)}
            </div>
          )}

          <form onSubmit={registerHandleSubmit(onRegisterSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                {...registerRegister('fullName', { required: 'Full name is required' })}
                className={`saas-input w-full ${registerErrors.fullName ? 'border-rose-500' : ''}`}
                placeholder="Sarah Jenkins"
              />
              {registerErrors.fullName && (
                <p className="text-rose-600 text-xs mt-1">{registerErrors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Work Email
              </label>
              <input
                {...registerRegister('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                })}
                className={`saas-input w-full ${registerErrors.email ? 'border-rose-500' : ''}`}
                placeholder="sarah.jenkins@company.com"
                type="email"
              />
              {registerErrors.email && (
                <p className="text-rose-600 text-xs mt-1">{registerErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                {...registerRegister('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className={`saas-input w-full ${registerErrors.password ? 'border-rose-500' : ''}`}
                placeholder="••••••••"
                type="password"
              />
              {registerErrors.password && (
                <p className="text-rose-600 text-xs mt-1">{registerErrors.password.message}</p>
              )}

              {/* Password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                    <span>Strength: {strength.label}</span>
                    <span>{strength.percent}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center pt-1">
              <input
                {...registerRegister('terms', { required: 'You must agree to the terms' })}
                id="terms"
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-600 cursor-pointer">
                I agree to the <span className="text-indigo-600 underline">Terms of Service</span> and <span className="text-indigo-600 underline">Privacy Policy</span>.
              </label>
            </div>
            {registerErrors.terms && (
              <p className="text-rose-600 text-xs">{registerErrors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="saas-button-primary w-full justify-center py-2.5 text-xs font-semibold disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating account...' : 'Complete Registration'}
            </button>

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 mt-5">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold ml-1"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
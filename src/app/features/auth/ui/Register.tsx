import React, { useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiUsers } from 'react-icons/fi';

const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (!pw) return { label: 'Too short', percent: 0, color: 'bg-gray-600' };
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  const percent = (score / 4) * 100;
  const label = score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';
  const color =
    score <= 1
      ? 'bg-red-500'
      : score === 2
      ? 'bg-yellow-400'
      : score === 3
      ? 'bg-indigo-400'
      : 'bg-emerald-400';
  return { label, percent, color };
};

const Register: React.FC = () => {
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
    <div className="min-h-screen flex bg-[#090611] text-gray-100">
      {/* Left Feature Showcase Banner */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-[#120f24] via-[#0d0a1a] to-[#090611] p-12 border-r border-white/5 relative overflow-hidden">
        <div
          className="pointer-events-none absolute rounded-full bg-violet-600/10 blur-[140px]"
          style={{ left: '-10%', top: '20%', height: '450px', width: '450px' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-md shadow-violet-500/30">
              <FiUsers className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Team-Sync</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              Unify your workforce, departments & projects in one hub.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Real-time synchronization for agile engineering, design, and operations teams. Built for modern high-performance organizations.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FiCheckCircle className="text-violet-400 text-lg shrink-0" />
                <span>Automated department capacity tracking & project sync</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FiCheckCircle className="text-violet-400 text-lg shrink-0" />
                <span>Interactive workforce directory and role management</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FiShield className="text-violet-400 text-lg shrink-0" />
                <span>Enterprise grade role-based access & session security</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
          <div>© 2026 Team-Sync Cloud</div>
          <div className="flex gap-4">
            <span>SOC2 Type II</span>
            <span>•</span>
            <span>99.99% Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-2">Create your account</h1>
            <p className="text-sm text-gray-400">Join your team on Team-Sync today.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
              {typeof error === 'string' ? error : String(error)}
            </div>
          )}

          <form onSubmit={registerHandleSubmit(onRegisterSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                {...registerRegister('fullName', { required: 'Full name is required' })}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#14121d] border ${
                  registerErrors.fullName ? 'border-red-500' : 'border-white/10'
                } text-sm text-gray-100 placeholder-gray-500 focus:border-violet-500 focus:outline-none transition`}
                placeholder="Sarah Connor"
              />
              {registerErrors.fullName && (
                <p className="text-red-400 text-xs mt-1">{registerErrors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Work Email
              </label>
              <input
                {...registerRegister('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#14121d] border ${
                  registerErrors.email ? 'border-red-500' : 'border-white/10'
                } text-sm text-gray-100 placeholder-gray-500 focus:border-violet-500 focus:outline-none transition`}
                placeholder="sarah@company.com"
                type="email"
              />
              {registerErrors.email && (
                <p className="text-red-400 text-xs mt-1">{registerErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <input
                {...registerRegister('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-[#14121d] border ${
                  registerErrors.password ? 'border-red-500' : 'border-white/10'
                } text-sm text-gray-100 placeholder-gray-500 focus:border-violet-500 focus:outline-none transition`}
                placeholder="••••••••"
                type="password"
              />
              {registerErrors.password && (
                <p className="text-red-400 text-xs mt-1">{registerErrors.password.message}</p>
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
                  <div className="text-[11px] text-gray-400 mt-1 flex justify-between">
                    <span>Password Strength: {strength.label}</span>
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
                className="h-4 w-4 rounded bg-[#14121d] border-white/20 text-violet-600 focus:ring-violet-500 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-300 cursor-pointer">
                I agree to the <span className="text-violet-400 underline">Terms of Service</span> and <span className="text-violet-400 underline">Privacy Policy</span>.
              </label>
            </div>
            {registerErrors.terms && (
              <p className="text-red-400 text-xs">{registerErrors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition duration-200 disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating account...' : 'Complete Registration'}
            </button>

            <div className="text-center text-xs text-gray-400 pt-4 border-t border-white/10 mt-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-violet-400 hover:text-violet-300 font-semibold ml-1"
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
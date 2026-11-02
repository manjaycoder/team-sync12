import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { FiAlertCircle, FiArrowLeft, FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const {
    loginRegister,
    loginHandleSubmit,
    loginErrors,
    onLoginSubmit,
    isLoading,
    error,
    clearAuthError,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  return (
    <div className="min-h-screen bg-[#070a12] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-cyan-500/20 blur-[130px]" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute inset-0 bg-grid-white opacity-20" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          <span>BACK TO TEAM-SYNC HOME</span>
        </button>

        {/* Elevated Glass Card */}
        <div className="w-full rounded-3xl border border-white/15 bg-slate-900/70 p-8 sm:p-10 shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 text-white font-display font-extrabold text-xl shadow-lg shadow-indigo-500/30">
              TS
              <div className="absolute -inset-1 rounded-2xl bg-indigo-500/30 blur-md -z-10" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-sans">
              Sign in to your Team-Sync enterprise workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 backdrop-blur-md">
              <FiAlertCircle className="mt-0.5 shrink-0 text-rose-400 text-sm" />
              <div className="flex-1 leading-relaxed">
                {typeof error === "string" ? error : String(error)}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={loginHandleSubmit(onLoginSubmit)} className="space-y-5 text-xs">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block font-medium text-slate-300 font-sans text-xs">
                Work Email Address
              </label>

              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={`ts-input w-full pl-10 ${loginErrors.email ? "!border-rose-500" : ""}`}
                  {...loginRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
              </div>

              {loginErrors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-mono">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5 flex justify-between items-center">
                <label className="font-medium text-slate-300 font-sans text-xs">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your email.")}
                  className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`ts-input w-full pl-10 ${loginErrors.password ? "!border-rose-500" : ""}`}
                  {...loginRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>

              {loginErrors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-mono">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              <span>{isLoading ? "Signing In..." : "Sign In to Workspace"}</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 border-t border-white/10 pt-5 text-center">
            <p className="text-xs text-slate-400 font-sans">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-mono text-slate-500">
          <p>© 2026 Team-Sync. Enterprise SaaS Platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

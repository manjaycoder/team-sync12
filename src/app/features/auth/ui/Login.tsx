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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.04] blur-[140px]" />
        <div className="absolute inset-0 bg-grid-white opacity-35" />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group mb-6 inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          <span>BACK TO TEAM-SYNC HOME</span>
        </button>

        {/* Elevated Glass Card */}
        <div className="w-full rounded-3xl border border-white/15 bg-[#08080a] p-8 sm:p-10 shadow-2xl shadow-black/90 backdrop-blur-2xl">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black font-display font-black text-xl shadow-lg shadow-white/20">
              TS
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-sans">
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
              className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-white text-black py-3.5 text-sm font-bold shadow-xl shadow-white/20 transition-all duration-300 hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isLoading ? "Signing In..." : "Sign In to Workspace"}</span>
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 border-t border-white/10 pt-5 text-center">
            <p className="text-xs text-neutral-400 font-sans">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-white hover:underline transition-colors ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-mono text-neutral-500">
          <p>© {new Date().getFullYear()} Team-Sync. Enterprise SaaS Platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

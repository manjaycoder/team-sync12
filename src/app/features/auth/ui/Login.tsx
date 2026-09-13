import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { FiAlertCircle, FiArrowRight, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    loginRegister,
    loginHandleSubmit,
    loginErrors,
    onLoginSubmit,
    isLoading,
    error,
    loginWithDemo,
    clearAuthError,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // Clear any residual error on initial mount
    clearAuthError();
  }, [clearAuthError]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090611] text-white flex items-center justify-center px-4 py-8">
      {/* Background Glows */}
      <div
        className="pointer-events-none absolute rounded-full bg-violet-600/15 blur-[160px]"
        style={{ left: "-180px", top: "30%", height: "550px", width: "550px" }}
      />
      <div
        className="pointer-events-none absolute rounded-full bg-indigo-500/15 blur-[180px]"
        style={{ right: "-150px", top: "10%", height: "450px", width: "450px" }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="w-full rounded-2xl border border-white/10 bg-[#15131d]/90 p-8 shadow-2xl backdrop-blur-2xl">
          {/* Logo & Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/30">
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="2" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" />
              </svg>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-violet-300 bg-clip-text text-transparent">
              Team-Sync
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Enterprise Collaboration & Workforce Platform
            </p>
          </div>

          {/* Quick Demo Login Pill */}
          <button
            type="button"
            onClick={loginWithDemo}
            className="group mb-5 flex w-full items-center justify-between rounded-xl border border-violet-500/30 bg-violet-950/40 px-4 py-2.5 text-xs font-medium text-violet-300 transition-all duration-200 hover:border-violet-500/60 hover:bg-violet-900/40 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <FiZap className="text-violet-400 group-hover:scale-110 transition-transform" />
              Quick Explore: <strong>Instant Demo Access</strong>
            </span>
            <FiArrowRight className="text-violet-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
              <FiAlertCircle className="mt-0.5 shrink-0 text-red-400" />
              <div className="flex-1">{typeof error === "string" ? error : String(error)}</div>
            </div>
          )}

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={loginWithDemo}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#211e2b] py-2.5 text-xs font-semibold text-gray-200 transition hover:bg-[#2c283a] hover:border-white/20"
            >
              <FaGoogle className="text-red-400" />
              GOOGLE
            </button>

            <button
              type="button"
              onClick={loginWithDemo}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#211e2b] py-2.5 text-xs font-semibold text-gray-200 transition hover:bg-[#2c283a] hover:border-white/20"
            >
              <FaGithub />
              GITHUB
            </button>
          </div>

          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
              or sign in with email
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={loginHandleSubmit(onLoginSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-gray-300 uppercase">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@company.com"
                className={`w-full rounded-xl border bg-[#090611] px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition ${
                  loginErrors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-violet-500"
                }`}
                {...loginRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />

              {loginErrors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex justify-between items-center">
                <label className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your email.")}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-[#090611] px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition ${
                  loginErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-violet-500"
                }`}
                {...loginRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              {loginErrors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold shadow-lg shadow-violet-600/30 transition duration-200 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing In...
                </>
              ) : (
                <>Sign In to Workspace</>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <p className="text-xs text-gray-400">
              Don&apos;t have an account?
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="ml-2 font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2026 Team-Sync. Enterprise Intelligence Platforms.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
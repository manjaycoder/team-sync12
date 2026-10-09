import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { FiAlertCircle } from "react-icons/fi";
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Logo & Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-xs">
              TS
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Sign in to your Team-Sync enterprise workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <FiAlertCircle className="mt-0.5 shrink-0 text-rose-500" />
              <div className="flex-1">{typeof error === "string" ? error : String(error)}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={loginHandleSubmit(onLoginSubmit)} className="space-y-4 text-xs">
            {/* Email */}
            <div>
              <label className="mb-1 block font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@company.com"
                className={`saas-input w-full ${loginErrors.email ? "border-rose-500" : ""}`}
                {...loginRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />

              {loginErrors.email && (
                <p className="mt-1 text-xs text-rose-600">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1 flex justify-between items-center">
                <label className="font-medium text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your email.")}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                placeholder="••••••••"
                className={`saas-input w-full ${loginErrors.password ? "border-rose-500" : ""}`}
                {...loginRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              {loginErrors.password && (
                <p className="mt-1 text-xs text-rose-600">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="saas-button-primary w-full justify-center py-2.5 text-xs font-semibold disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In to Workspace"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="ml-1.5 font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-slate-400">
          <p>© 2026 Team-Sync. Enterprise SaaS Platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
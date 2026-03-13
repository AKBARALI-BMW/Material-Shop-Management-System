import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-indigo-700 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M10 2v12M3 6l7 4 7-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-800">
            Shop<span className="text-indigo-600">Flow</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue</p>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3.5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Password</label>
                <a href="/forgot-password" className="text-xs text-indigo-600 font-medium hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="7" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="8" cy="11" r="1.2" fill="currentColor"/>
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-all duration-150"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Create one
            </Link>
             </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
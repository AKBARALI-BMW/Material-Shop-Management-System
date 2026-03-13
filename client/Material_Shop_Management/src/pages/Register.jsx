import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { Link } from "react-router-dom";


function Register() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [strength, setStrength] = useState(0);

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    if (e.target.name === "password") {
      let score = 0;
      const v = e.target.value;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      setStrength(score);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const strengthColor = strength <= 1 ? "#E24B4A" : strength <= 2 ? "#EF9F27" : "#3B6D11";
  const strengthLabel = strength === 0 ? "" : strength <= 1 ? "Weak" : strength <= 2 ? "Fair" : strength <= 3 ? "Good" : "Strong";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

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
          <h2 className="text-xl font-semibold text-slate-800 mb-1">Create your account</h2>
          <p className="text-sm text-slate-500 mb-6">Set up your shop management system</p>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Registration successful! You can now sign in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Shop Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Shop name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M2 6.5L3 2h10l1 4.5v.5a2.5 2.5 0 01-5 0 2.5 2.5 0 01-5 0v-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      <path d="M2 14V8.5A2.5 2.5 0 004.5 9a2.5 2.5 0 002.5-1.5A2.5 2.5 0 009 9a2.5 2.5 0 002.5-1.5A2.5 2.5 0 0014 9V14H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="shopName"
                    placeholder="My Shop"
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

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

            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Mobile number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
                  </svg>
                </span>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="+1 234 567 8900"
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Password</label>
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
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              {/* Strength bar */}
              {formData.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "#e2e8f0" }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Confirm password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="2.5" y="7" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <path d="M6 11l1.5 1.5L11 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
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
                  Creating account...
                </span>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
          Sign in
         </Link>
           </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
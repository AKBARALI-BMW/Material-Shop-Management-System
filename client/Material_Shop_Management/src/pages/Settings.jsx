import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, saveSettings, resetSaved } from "../redux/settingsSlice";
import Layout from "./Layout";

function Settings() {
  const dispatch = useDispatch();
  const { data, loading, saving, saved, error } = useSelector((state) => state.settings);

  const logoInputRef = useRef(null);
  const [logoImage, setLogoImage] = useState(null);

  const [formData, setFormData] = useState({
    ownerName:   "",
    shopName:    "",
    shopAddress: "",
    city:        "",
    country:     "",
    phone:       "",
    email:       "",
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data && data.ownerName !== undefined) {
      setFormData({
        ownerName:   data.ownerName   || "",
        shopName:    data.shopName    || "",
        shopAddress: data.shopAddress || "",
        city:        data.city        || "",
        country:     data.country     || "",
        phone:       data.phone       || "",
        email:       data.email       || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => dispatch(resetSaved()), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveSettings(formData));
  };

  return (
    <Layout>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your profile and shop information.
        </p>
      </div>

      {loading && (
        <div className="text-sm text-slate-500 mb-4">Loading settings...</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 w-full">

      
        {/* Shop Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-800 ">Shop Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Shop Logo */}
<div className="p-2">
  <h3 className="text-sm font-semibold text-slate-800 mb-4">Shop Logo</h3>
  <div className="flex items-center gap-3">
    
    {/* Clickable logo preview box */}
    <div
      onClick={() => logoInputRef.current.click()}
      className="w-30 h-15 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 flex items-center justify-center cursor-pointer transition overflow-hidden flex-shrink-0"
    >
      {logoImage ? (
        <img src={logoImage} alt="logo" className="w-full h-full object-contain p-1" />
      ) : (
        <svg className="w-6 h-6 text-slate-400" viewBox="0 0 16 16" fill="none">
          <path d="M2 6.5L3 2h10l1 4.5v.5a2.5 2.5 0 01-5 0 2.5 2.5 0 01-5 0v-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M2 14V8.5A2.5 2.5 0 004.5 9a2.5 2.5 0 002.5-1.5A2.5 2.5 0 009 9a2.5 2.5 0 002.5-1.5A2.5 2.5 0 0014 9V14H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        </svg>
      )}
    </div>

    {/* Text + button */}
    <div className="flex flex-col gap-1 min-w-0">
      <button
        type="button"
        onClick={() => logoInputRef.current.click()}
        className="mt-1 text-xs text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition w-fit"
      >
        Upload Logo
      </button>
    </div>

    <input
      ref={logoInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleLogoChange}
    />
  </div>
</div>


            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Owner Name</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange}
                placeholder="e.g. Akbar Khan"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Shop Name</label>
              <input type="text" name="shopName" value={formData.shopName} onChange={handleChange}
                placeholder="e.g. Akbar Hardware Store"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Shop Address</label>
              <input type="text" name="shopAddress" value={formData.shopAddress} onChange={handleChange}
                placeholder="e.g. Main Bazar, Near Masjid"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange}
                placeholder="e.g. Mardan"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange}
                placeholder="e.g. Pakistan"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
                  </svg>
                </span>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="03001234567"
                  className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3.5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="akbar@shop.com"
                  className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
            </div>

          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Save Button Row */}
        <div className="flex items-center justify-between gap-4 py-1">
          {saved ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Settings saved successfully!
            </div>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="ml-auto h-10 px-8 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14V9h12v5H2zM4 2h6l2 3H2l2-3zM6 11v2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                Save Settings
              </>
            )}
          </button>
        </div>

      </form>
    </Layout>
  );
}

export default Settings;
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


const pageTitles = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/products":  "Products",
  "/orders":    "Orders",
  "/reports":   "Reports",
  "/inventory": "Inventory",
  "/settings":  "Settings",
};

function Navbar({ user, onMenuClick }) {
  const location = useLocation();
  const title    = pageTitles[location.pathname] || "Dashboard";

  // ✅ Pull settings data from Redux
  const { data: settings } = useSelector((state) => state.settings);

  // Shop name: prefer settings, fallback to auth user
  const shopName = settings?.shopName || user?.shopName || "My Shop";

  // Owner name: prefer settings, fallback to auth user
  const ownerName = settings?.ownerName || user?.name || "";

  // Initials fallback if no profile image
  const initials = ownerName
    ? ownerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "OW";

  // Profile image from settings
  const profileImage = settings?.profileImage || null;

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">

      {/* Left — Hamburger (mobile only) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
      </div>

      {/* Right — Shop name + Owner avatar */}
      <div className="flex items-center gap-3">

        {/* Shop name — hidden on very small screens */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-medium text-slate-700 leading-tight">
            {shopName}
          </span>
          {ownerName && (
            <span className="text-xs text-slate-400 leading-tight">
              {ownerName}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Avatar — shows profile image or initials */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={ownerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-indigo-700">
              {initials}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;
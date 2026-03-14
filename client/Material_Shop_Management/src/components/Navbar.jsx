import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard":  "Dashboard",
  "/customers":  "Customers",
  "/products":   "Products",
  "/orders":     "Orders",
  "/reports":    "Reports",
  "/inventory":  "Inventory",
  "/settings":   "Settings",
};

function Navbar({ user }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AU";

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left - Page Title */}
      <h1 className="text-sm font-semibold text-slate-800">{title}</h1>

      {/* Right - Shop name + Avatar */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500">{user?.shopName || "My Shop"}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 border border-slate-200">
          {initials}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
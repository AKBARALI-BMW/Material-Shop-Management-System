import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

/**
 * Layout wraps every protected page.
 * - Dark sidebar (fixed, 256px)
 * - White top navbar (sticky)
 * - Main content area with padding
 *
 * Use <Outlet /> here so React Router renders the correct page inside.
 */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content: offset by sidebar width ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
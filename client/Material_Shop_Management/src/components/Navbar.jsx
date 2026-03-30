import { useState, useRef, useEffect } from "react";
import { useLocation }                  from "react-router-dom";
import { useSelector, useDispatch }     from "react-redux";
import { markAsRead, markAllRead, deleteNotification, timeAgo } from "../redux/notificationSlice";
import WhatsAppReminder from "./WhatsAppReminder";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/products":  "Products",
  "/orders":    "Orders",
  "/reports":   "Reports",
  "/inventory": "Inventory",
  "/settings":  "Settings",
};

// ── Notification icon by type ──────────────────────────────────────
function NotifIcon({ type }) {
  if (type === "order") return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h10l1 4H2L3 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    </div>
  );
  if (type === "payment") return (
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none">
        <path d="M8 1v14M5 4h4.5a2.5 2.5 0 010 5H5m0 0h5a2.5 2.5 0 010 5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </div>
  );
  if (type === "stock") return (
    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-amber-600" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L1.5 13h13L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </div>
  );
  if (type === "overdue") return (
    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-4 h-4 text-red-600" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </div>
  );
  return null;
}

function Navbar({ user, onMenuClick }) {
  const location  = useLocation();
  const dispatch  = useDispatch();
  const title     = pageTitles[location.pathname] || "Dashboard";

  const { data: settings }  = useSelector((state) => state.settings);
  const { items: notifs }   = useSelector((state) => state.notifications);

  const [open, setOpen] = useState(false);
  const dropRef         = useRef(null);

  // shop name + owner
  const shopName  = settings?.shopName  || user?.shopName || "My Shop";
  const ownerName = settings?.ownerName || user?.name     || "";
  const initials  = ownerName
    ? ownerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "OW";
  const profileImage = settings?.profileImage || null;

  // unread count
  const unreadCount = notifs.filter((n) => !n.read).length;

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">

      {/* Left — Hamburger + Page Title */}
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

      {/* Right — Bell + Shop + Avatar */}
      <div className="flex items-center gap-3">

        {/* ── Bell Icon + Dropdown ── */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={handleOpen}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M8 16a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <svg className="w-8 h-8 mb-2 opacity-40" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                    <p className="text-xs">No notifications yet</p>
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition border-b border-slate-50 last:border-0
                        ${!n.read ? "bg-indigo-50/30" : ""}`}
                    >
                      {/* Icon */}
                      <NotifIcon type={n.type} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold ${!n.read ? "text-slate-800" : "text-slate-600"}`}>
                            {n.title}
                          </p>
                          <button
                            onClick={(e) => handleDelete(e, n.id)}
                            className="text-slate-300 hover:text-slate-500 flex-shrink-0 transition"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs text-slate-400">{timeAgo(n.time)}</span>
                          {/* WhatsApp button for overdue and payment notifications */}
                                              
                      {(n.type === "order" || n.type === "payment" || n.type === "overdue") && n.customerName && (
                        <WhatsAppReminder
                          messageType={n.type}
                          customerName={n.customerName}
                          customerPhone={n.customerPhone || ""}
                          orderNumber={n.orderNumber || ""}
                          items={n.items || []}
                          totalAmount={n.totalAmount || 0}
                          paidAmount={n.paidAmount || 0}
                          paymentAmount={n.paymentAmount || 0}
                          totalPaidSoFar={n.totalPaidSoFar || 0}
                          dueAmount={n.dueAmount || 0}
                          dueDate={n.dueDate || null}
                        />
                      )}
                        </div>
                        {/* Unread dot */}
                        {!n.read && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifs.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <button
                    onClick={() => dispatch({ type: "notifications/clearAll" })}
                    className="text-xs text-slate-400 hover:text-red-500 transition"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Shop name + owner */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-medium text-slate-700 leading-tight">{shopName}</span>
          {ownerName && (
            <span className="text-xs text-slate-400 leading-tight">{ownerName}</span>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={ownerName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-indigo-700">{initials}</span>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;

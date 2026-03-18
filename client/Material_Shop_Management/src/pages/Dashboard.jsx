import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../redux/dashboardSlice";
import Layout from "./Layout";



const statusBadge = {
  "Paid":    "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Pending": "bg-red-100 text-red-700",
  "Clear":   "bg-green-100 text-green-700",
};

const statusDot = {
  "Low Stock": "bg-amber-500",
  "Out Stock": "bg-red-500",
};

// ── Bar Chart ──────────────────────────────────────────────────────
function BarChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.length) return;

    const load = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels:   data.map((d) => d.month),
          datasets: [{
            label:           "Revenue",
            data:            data.map((d) => d.revenue),
            backgroundColor: "rgba(99,102,241,0.85)",
            borderRadius:    6,
            borderSkipped:   false,
          }],
        },
        options: {
          responsive:          true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Rs ${Number(ctx.raw).toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              grid:  { display: false },
              ticks: { color: "#94a3b8", font: { size: 11 } },
            },
            y: {
              grid:  { color: "#f1f5f9" },
              ticks: {
                color:    "#94a3b8",
                font:     { size: 11 },
                callback: (v) => `${v / 1000}k`,
              },
            },
          },
        },
      });
    };

    load();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

// ── Donut Chart ────────────────────────────────────────────────────
function DonutChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const load = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels:   ["Paid", "Partial", "Pending"],
          datasets: [{
            data:            [data.paid || 0, data.partial || 0, data.pending || 0],
            backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
            borderWidth:     0,
            hoverOffset:     4,
          }],
        },
        options: {
          responsive:          true,
          maintainAspectRatio: false,
          cutout:              "70%",
          plugins: {
            legend: {
              position: "bottom",
              labels:   { color: "#64748b", font: { size: 11 }, padding: 16 },
            },
          },
        },
      });
    };

    load();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

// ── Loading Skeleton ───────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div className={`bg-slate-100 rounded-lg animate-pulse ${className}`} />
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const stats          = data?.stats          || { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalDue: 0 };
  const orderStatus    = data?.orderStatus    || { paid: 0, partial: 0, pending: 0 };
  const monthlyRevenue = data?.monthlyRevenue || [];
  const recentOrders   = Array.isArray(data?.recentOrders)  ? data.recentOrders  : [];
  const lowStock       = Array.isArray(data?.lowStock)       ? data.lowStock       : [];
  const topCustomers   = Array.isArray(data?.topCustomers)   ? data.topCustomers   : [];

  return (
    <Layout>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome back! Here is your shop overview.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* ── Section 1 — Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-7 w-32" />
            </div>
          ))
        ) : (
          [
            {
              label: "Total Revenue",
              value: `Rs ${stats.totalRevenue.toLocaleString()}`,
              color: "text-slate-800",
              bg:    "bg-indigo-50",
              icon: (
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v14M5 4h4.5a2.5 2.5 0 010 5H5m0 0h5a2.5 2.5 0 010 5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              label: "Total Orders",
              value: stats.totalOrders,
              color: "text-slate-800",
              bg:    "bg-blue-50",
              icon: (
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2h10l1 4H2L3 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M6 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              label: "Total Customers",
              value: stats.totalCustomers,
              color: "text-slate-800",
              bg:    "bg-green-50",
              icon: (
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 16 16" fill="none">
                  <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M12 7c1.1 0 2 .9 2 2s-.9 2-2 2M14 14c0-1.1-.9-2-2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              label: "Total Due",
              value: `Rs ${stats.totalDue.toLocaleString()}`,
              color: "text-red-600",
              bg:    "bg-red-50",
              icon: (
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              ),
            },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500">{s.label}</p>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  {s.icon}
                </div>
              </div>
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))
        )}
      </div>

      {/* ── Section 2 — Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Monthly Revenue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
            {!loading && (
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Rs {monthlyRevenue.reduce((s, m) => s + m.revenue, 0).toLocaleString()} total
              </span>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <div className="h-52">
              <BarChart data={monthlyRevenue} />
            </div>
          )}
        </div>

        {/* Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Order Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">All time breakdown</p>
          </div>
          {loading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <div className="h-52">
              <DonutChart data={orderStatus} />
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3 — Recent Orders + Low Stock ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Recent Orders</h3>
            <span className="text-xs text-slate-400">Last 5 orders</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Order</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Customer</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Due</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((o) => (
                      <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                        <td className="py-2.5 pr-4">
                          <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {o.orderNumber}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-slate-800 text-xs font-medium whitespace-nowrap">
                          {o.customer?.name || "—"}
                        </td>
                        <td className="py-2.5 pr-4 text-slate-800 text-xs font-medium whitespace-nowrap">
                          Rs {(o.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-2.5 pr-4 text-xs whitespace-nowrap">
                          <span className={(o.dueAmount || 0) > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                            Rs {(o.dueAmount || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[o.status] || statusBadge["Pending"]}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Stock Alert</h3>
            {lowStock.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
                {lowStock.length} items
              </span>
            )}
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 rounded-lg p-3">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All products well stocked
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStock.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[item.status] || "bg-slate-300"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.stock} {item.unit} left</p>
                    </div>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${
                    item.status === "Out Stock"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 4 — Top Customers ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Top Customers</h3>
          <span className="text-xs text-slate-400">By total purchase</span>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">#</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Customer</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Orders</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total Spent</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Balance Due</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                      No customers yet.
                    </td>
                  </tr>
                ) : (
                  topCustomers.map((c, index) => {
                    const due = (c.totalAmount || 0) - (c.paidAmount || 0);
                    return (
                      <tr key={c._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-bold ${
                            index === 0 ? "text-amber-500"
                            : index === 1 ? "text-slate-400"
                            : index === 2 ? "text-orange-400"
                            : "text-slate-300"
                          }`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 flex-shrink-0">
                              {c.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <span className="text-slate-800 font-medium whitespace-nowrap text-xs">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-800 text-xs">{c.totalOrders || 0}</td>
                        <td className="py-3 pr-4 text-slate-800 font-medium text-xs whitespace-nowrap">
                          Rs {(c.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 pr-4 text-xs whitespace-nowrap">
                          <span className={due > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                            Rs {due.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[c.status] || statusBadge["Clear"]}`}>
                            {c.status || "Clear"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </Layout>
  );
}

export default Dashboard;


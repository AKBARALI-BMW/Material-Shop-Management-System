import { useEffect, useRef } from "react";
import Layout from "./Layout";

// ── Dummy Data (replaced by Redux + API later) ─────────────────────
const dummyStats = {
  totalRevenue:   250000,
  totalOrders:    48,
  totalCustomers: 12,
  totalDue:       34000,
};

const dummyMonthlyRevenue = [
  { month: "Oct", revenue: 50000  },
  { month: "Nov", revenue: 80000  },
  { month: "Dec", revenue: 60000  },
  { month: "Jan", revenue: 90000  },
  { month: "Feb", revenue: 75000  },
  { month: "Mar", revenue: 120000 },
];

const dummyOrderStatus = {
  paid:    32,
  partial: 10,
  pending: 6,
};

const dummyRecentOrders = [
  { _id: "1", orderNumber: "ORD-0001", customer: { name: "Ali Khan"     }, totalAmount: 13500, paidAmount: 13500, dueAmount: 0,    status: "Paid",    createdAt: "2026-03-01" },
  { _id: "2", orderNumber: "ORD-0002", customer: { name: "Umar Farooq"  }, totalAmount: 22000, paidAmount: 10000, dueAmount: 12000,status: "Partial", createdAt: "2026-03-05" },
  { _id: "3", orderNumber: "ORD-0003", customer: { name: "Bilal Ahmed"  }, totalAmount: 24000, paidAmount: 0,     dueAmount: 24000,status: "Pending", createdAt: "2026-03-10" },
  { _id: "4", orderNumber: "ORD-0004", customer: { name: "Zara Malik"   }, totalAmount: 15000, paidAmount: 15000, dueAmount: 0,    status: "Paid",    createdAt: "2026-03-12" },
  { _id: "5", orderNumber: "ORD-0005", customer: { name: "Hamid Shah"   }, totalAmount: 18000, paidAmount: 10000, dueAmount: 8000, status: "Partial", createdAt: "2026-03-14" },
];

const dummyLowStock = [
  { _id: "1", name: "Red Bricks",     category: "Bricks",  stock: 8,  minStock: 50,  unit: "Piece",  status: "Low Stock" },
  { _id: "2", name: "PVC Pipe 1inch", category: "Pipes",   stock: 0,  minStock: 20,  unit: "Piece",  status: "Out Stock" },
  { _id: "3", name: "Paint White",    category: "Paint",   stock: 3,  minStock: 10,  unit: "Tin",    status: "Low Stock" },
];

const dummyTopCustomers = [
  { _id: "1", name: "Bilal Ahmed",  totalOrders: 7, totalAmount: 78000, paidAmount: 54000, status: "Partial" },
  { _id: "2", name: "Hamid Shah",   totalOrders: 5, totalAmount: 55000, paidAmount: 30000, status: "Partial" },
  { _id: "3", name: "Ali Khan",     totalOrders: 5, totalAmount: 45000, paidAmount: 45000, status: "Clear"   },
  { _id: "4", name: "Umar Farooq",  totalOrders: 3, totalAmount: 32000, paidAmount: 26000, status: "Partial" },
];

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

// ── Bar Chart Component ────────────────────────────────────────────
function BarChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels:   data.map((d) => d.month),
          datasets: [{
            label:           "Revenue",
            data:            data.map((d) => d.revenue),
            backgroundColor: "rgba(99, 102, 241, 0.85)",
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
              grid: { display: false },
              ticks: { color: "#94a3b8", font: { size: 11 } },
            },
            y: {
              grid:  { color: "#f1f5f9" },
              ticks: {
                color: "#94a3b8",
                font:  { size: 11 },
                callback: (v) => `${v / 1000}k`,
              },
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

// ── Donut Chart Component ──────────────────────────────────────────
function DonutChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const loadChart = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels:   ["Paid", "Partial", "Pending"],
          datasets: [{
            data:            [data.paid, data.partial, data.pending],
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

    loadChart();

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}

// ── Main Dashboard Component ───────────────────────────────────────
function Dashboard() {
  const stats          = dummyStats;
  const monthlyRevenue = dummyMonthlyRevenue;
  const orderStatus    = dummyOrderStatus;
  const recentOrders   = dummyRecentOrders;
  const lowStock       = dummyLowStock;
  const topCustomers   = dummyTopCustomers;

  return (
    <Layout>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here is your shop overview.</p>
      </div>

      {/* ── Section 1 — Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
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
        ))}
      </div>

      {/* ── Section 2 — Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* Bar Chart — Monthly Revenue */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Monthly Revenue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
          </div>
          <div className="h-52">
            <BarChart data={monthlyRevenue} />
          </div>
        </div>

        {/* Donut Chart — Order Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Order Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">All time breakdown</p>
          </div>
          <div className="h-52">
            <DonutChart data={orderStatus} />
          </div>
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
                {recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                    <td className="py-2.5 pr-4">
                      <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {o.orderNumber}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-800 text-xs font-medium whitespace-nowrap">
                      {o.customer?.name}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-800 text-xs whitespace-nowrap font-medium">
                      Rs {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-xs whitespace-nowrap">
                      <span className={o.dueAmount > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                        Rs {o.dueAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Stock Alert</h3>
            <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
              {lowStock.length} items
            </span>
          </div>
          <div className="space-y-3">
            {lowStock.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600 text-xs">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All products well stocked
              </div>
            ) : (
              lowStock.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Section 4 — Top Customers ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Top Customers</h3>
          <span className="text-xs text-slate-400">By total purchase</span>
        </div>
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
              {topCustomers.map((c, index) => {
                const due = c.totalAmount - c.paidAmount;
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
                          {c.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-slate-800 font-medium whitespace-nowrap text-xs">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-800 text-xs">{c.totalOrders}</td>
                    <td className="py-3 pr-4 text-slate-800 font-medium text-xs whitespace-nowrap">
                      Rs {c.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-xs whitespace-nowrap">
                      <span className={due > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                        Rs {due.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </Layout>
  );
}

export default Dashboard;

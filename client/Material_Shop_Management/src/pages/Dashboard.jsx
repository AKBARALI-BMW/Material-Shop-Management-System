import Layout from "./Layout";

function Dashboard() {
  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">Welcome back!</h2>
        <p className="text-sm text-slate-500 mt-0.5">Here is your shop overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Total Customers</p>
          <p className="text-2xl font-semibold text-slate-800">48</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Monthly Revenue</p>
          <p className="text-2xl font-semibold text-slate-800">Rs 1.2L</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-1">Pending Payments</p>
          <p className="text-2xl font-semibold text-slate-800">Rs 34,000</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Recent Orders</h3>
          <button className="text-xs text-indigo-600 hover:underline">View all</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Customer</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Items</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Total</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Ali Khan",     items: "Cement x10, Bricks x100", total: "Rs 13,500", status: "Paid",    badge: "bg-green-100 text-green-700" },
              { name: "Umar Farooq", items: "Steel x5, Pipe x3",        total: "Rs 22,000", status: "Partial", badge: "bg-amber-100 text-amber-700" },
              { name: "Bilal Ahmed", items: "Cement x20",               total: "Rs 24,000", status: "Pending", badge: "bg-red-100 text-red-700"   },
            ].map((row) => (
              <tr key={row.name} className="border-b border-slate-50 last:border-0">
                <td className="py-3 text-slate-800">{row.name}</td>
                <td className="py-3 text-slate-500">{row.items}</td>
                <td className="py-3 text-slate-800">{row.total}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.badge}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Dashboard;
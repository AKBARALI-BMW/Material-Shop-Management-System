import Layout from "./Layout";

const customers = [
  { name: "Ali Khan",     phone: "0300-1234567", orders: 5, due: "Rs 0",      status: "Clear",   badge: "bg-green-100 text-green-700" },
  { name: "Umar Farooq", phone: "0311-9876543", orders: 3, due: "Rs 6,000",  status: "Partial", badge: "bg-amber-100 text-amber-700" },
  { name: "Bilal Ahmed", phone: "0321-4567890", orders: 7, due: "Rs 24,000", status: "Pending", badge: "bg-red-100 text-red-700"   },
  { name: "Zara Malik",  phone: "0333-1112233", orders: 2, due: "Rs 0",      status: "Clear",   badge: "bg-green-100 text-green-700" },
];

function Customers() {
  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">Customers</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage all your shop customers.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">All Customers</h3>
          <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors">
            + Add Customer
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Name</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Phone</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Total Orders</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Balance Due</th>
              <th className="text-left text-xs text-slate-500 font-medium pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.name} className="border-b border-slate-50 last:border-0">
                <td className="py-3 text-slate-800 font-medium">{c.name}</td>
                <td className="py-3 text-slate-500">{c.phone}</td>
                <td className="py-3 text-slate-800">{c.orders}</td>
                <td className="py-3 text-slate-800">{c.due}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                    {c.status}
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

export default Customers;
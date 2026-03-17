const statusBadge = {
  "Paid":    "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Pending": "bg-red-100 text-red-700",
};

function ViewOrderModal({ order, onClose }) {
  const due = (order.totalAmount || 0) - (order.paidAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {order.orderNumber}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[order.status] || statusBadge["Pending"]}`}>
              {order.status}
            </span>
          </div>
          <button onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Customer Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Customer</p>
          <p className="text-sm font-semibold text-slate-800">{order.customer?.name || "—"}</p>
          <p className="text-xs text-slate-500 mt-0.5">{order.customer?.phone || ""}</p>
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
            Order Items
          </p>
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs text-slate-500 font-medium px-3 py-2">Product</th>
                  <th className="text-center text-xs text-slate-500 font-medium px-3 py-2">Qty</th>
                  <th className="text-right text-xs text-slate-500 font-medium px-3 py-2">Price</th>
                  <th className="text-right text-xs text-slate-500 font-medium px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="px-3 py-2.5 text-slate-800 font-medium">{item.name}</td>
                    <td className="px-3 py-2.5 text-center text-slate-500">{item.qty}</td>
                    <td className="px-3 py-2.5 text-right text-slate-500">Rs {Number(item.price).toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-slate-800 font-medium">
                      Rs {(item.qty * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Total</p>
            <p className="text-sm font-semibold text-slate-800">
              Rs {(order.totalAmount || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Paid</p>
            <p className="text-sm font-semibold text-green-600">
              Rs {(order.paidAmount || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Due</p>
            <p className="text-sm font-semibold text-red-600">
              Rs {Math.max(0, due).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Due Date + Created */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {order.dueDate && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Due Date</p>
              <p className="text-sm font-medium text-slate-800">{order.dueDate}</p>
            </div>
          )}
          {order.createdAt && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Order Date</p>
              <p className="text-sm font-medium text-slate-800">{order.createdAt}</p>
            </div>
          )}
        </div>

        <button onClick={onClose}
          className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
          Close
        </button>
      </div>
    </div>
  );
}

export default ViewOrderModal;
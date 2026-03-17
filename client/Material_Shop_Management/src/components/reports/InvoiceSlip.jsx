function InvoiceSlip({ data, onClose }) {
  const { shop, order } = data;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">

        {/* Action buttons */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 print:hidden">
          <h3 className="text-sm font-semibold text-slate-800">Sale Invoice</h3>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M4 6V2h8v4M4 12H2V7h12v5h-2M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
              Print
            </button>
            <button onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-5">

          {/* Shop Header */}
          <div className="text-center mb-4 pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-800">
              {shop?.shopName || "Shop Name"}
            </h2>
            {shop?.shopAddress && (
              <p className="text-xs text-slate-500 mt-0.5">
                {[shop.shopAddress, shop.city, shop.country].filter(Boolean).join(", ")}
              </p>
            )}
            {shop?.phone && (
              <p className="text-xs text-slate-500">Contact: {shop.phone}</p>
            )}
            {shop?.phone2 && (
              <p className="text-xs text-slate-500">Contact: {shop.phone2}</p>
            )}
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              Invoice# {order?.orderNumber}
            </p>
          </div>

          {/* Customer + Date */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <p className="text-slate-500">Customer:</p>
              <p className="font-semibold text-slate-800">{order?.customer?.name}</p>
              <p className="text-slate-500">{order?.customer?.phone}</p>
              {order?.customer?.address && (
                <p className="text-slate-500">{order.customer.address}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-slate-500">Date:</p>
              <p className="font-semibold text-slate-800">
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "2-digit", month: "short", year: "numeric"
                }) : "—"}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="bg-slate-50 border border-slate-200">
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600">#</th>
                <th className="text-left px-2 py-1.5 font-semibold text-slate-600">Item</th>
                <th className="text-center px-2 py-1.5 font-semibold text-slate-600">Qty</th>
                <th className="text-right px-2 py-1.5 font-semibold text-slate-600">Price</th>
                <th className="text-right px-2 py-1.5 font-semibold text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(order?.items || []).map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-2 py-1.5 text-slate-500">{i + 1}</td>
                  <td className="px-2 py-1.5 text-slate-800 font-medium">{item.name}</td>
                  <td className="px-2 py-1.5 text-center text-slate-600">{item.qty}</td>
                  <td className="px-2 py-1.5 text-right text-slate-600">{Number(item.price).toLocaleString()}</td>
                  <td className="px-2 py-1.5 text-right font-semibold text-slate-800">
                    {(item.qty * item.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">ٹوٹل بل</span>
              <span className="font-semibold text-slate-800">
                {(order?.totalAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ادا شدہ</span>
              <span className="font-semibold text-green-600">
                {(order?.paidAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5">
              <span className="text-slate-600 font-semibold">بقایا</span>
              <span className="font-bold text-red-600 text-sm">
                {(order?.dueAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Due date */}
          {order?.dueDate && (
            <p className="text-xs text-slate-500 mt-3">
              Due Date: {new Date(order.dueDate).toLocaleDateString()}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default InvoiceSlip;

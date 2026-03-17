function InvoiceSlip({ data, onClose }) {
  const { shop, order } = data;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">

        {/* Action Buttons */}
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

          {/* ── HEADER ── Logo left | Shop info center ── */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-slate-800">

            {/* Logo */}
            <div className="flex-shrink-0">
              {shop?.logoImage ? (
                <img
                  src={shop.logoImage}
                  alt="Shop Logo"
                  className="w-14 h-14 object-contain rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200">
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 20 20" fill="none">
                    <path d="M2 6.5L3 2h14l1 4.5v.5a3 3 0 01-6 0 3 3 0 01-6 0v-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M2 17V9.5A3 3 0 005 10a3 3 0 003-1.5A3 3 0 0011 10a3 3 0 003-1.5A3 3 0 0017 10V17H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Shop Info — center */}
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold text-slate-800 tracking-wide">
                {shop?.shopName || "Shop Name"}
              </h2>
              {(shop?.shopAddress || shop?.city) && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {[shop?.shopAddress, shop?.city, shop?.country].filter(Boolean).join(", ")}
                </p>
              )}
              <div className="flex items-center justify-center gap-3 mt-1 flex-wrap">
                {shop?.phone && (
                  <span className="text-xs text-slate-600">
                    📞 {shop.phone}
                  </span>
                )}
                {shop?.email && (
                  <span className="text-xs text-slate-600">
                    ✉ {shop.email}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* ── BODY — Customer left | Invoice# right ── */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-200">

            {/* Customer Info — left */}
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Customer:</span>
                <span className="font-semibold text-slate-800">
                  {order?.customer?.name || "—"}
                </span>
              </div>
              {order?.customer?.phone && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="text-slate-700">{order.customer.phone}</span>
                </div>
              )}
              {(order?.customer?.address || order?.customer?.city) && (
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-medium mt-0.5">Address:</span>
                  <span className="text-slate-700">
                    {[order?.customer?.address, order?.customer?.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Invoice# + Date — right */}
            <div className="text-xs text-right space-y-0.5 flex-shrink-0 ml-4">
              <div>
                <span className="text-slate-500 font-medium">Invoice#</span>
                <span className="ml-1.5 font-bold text-indigo-600">
                  {order?.orderNumber || "—"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="ml-1.5 text-slate-700">
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric"
                      })
                    : "—"}
                </span>
              </div>
            </div>

          </div>

          {/* ── ITEMS TABLE ── */}
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left px-2 py-2 rounded-tl-md">#</th>
                <th className="text-left px-2 py-2">Item</th>
                <th className="text-center px-2 py-2">Qty</th>
                <th className="text-right px-2 py-2">Price</th>
                <th className="text-right px-2 py-2 rounded-tr-md">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(order?.items || []).map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-2 py-1.5 text-slate-500">{i + 1}</td>
                  <td className="px-2 py-1.5 text-slate-800 font-medium">{item.name}</td>
                  <td className="px-2 py-1.5 text-center text-slate-600">{item.qty}</td>
                  <td className="px-2 py-1.5 text-right text-slate-600">
                    {Number(item.price).toLocaleString()}
                  </td>
                  <td className="px-2 py-1.5 text-right font-semibold text-slate-800">
                    {(item.qty * item.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── TOTALS ── */}
          <div className="border-t-2 border-slate-800 pt-3 space-y-1.5 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">ٹوٹل بل (Total Bill)</span>
              <span className="font-semibold text-slate-800">
                Rs {(order?.totalAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ادا شدہ (Paid)</span>
              <span className="font-semibold text-green-600">
                Rs {(order?.paidAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between bg-red-50 px-2 py-1.5 rounded-lg border border-red-100">
              <span className="font-bold text-red-700">بقایا (Balance Due)</span>
              <span className="font-bold text-red-700 text-sm">
                Rs {(order?.dueAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Due date */}
          {order?.dueDate && (
            <p className="text-xs text-slate-500 mb-4">
              Due Date: {new Date(order.dueDate).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric"
              })}
            </p>
          )}

          {/* ── FOOTER MESSAGE ── */}
          <div className="border-t border-dashed border-slate-300 pt-3 text-center">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Thank you for your business!
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              We are committed to providing you with the finest quality
              construction materials. Your trust and satisfaction are our
              greatest achievement. We look forward to serving you again.
            </p>
            {shop?.shopName && (
              <p className="text-xs font-bold text-indigo-600 mt-2">
                — {shop.shopName} —
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default InvoiceSlip;


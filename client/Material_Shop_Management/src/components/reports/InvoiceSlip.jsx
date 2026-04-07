import ShopLogo from "../../assets/InvoiceLogo (2).jpg";

function InvoiceSlip({ data, onClose }) {
  const { shop, order, allCustomerOrders } = data;

  // ✅ If allCustomerOrders provided, use those; otherwise use single order
  const orders = allCustomerOrders ? Array.isArray(allCustomerOrders) ? allCustomerOrders : [allCustomerOrders] : [order];
  const primaryOrder = orders[0];
  
  // ✅ Calculate aggregated totals across all orders
  const totalItems = orders.reduce((sum, o) => sum + (o.items?.length || 0), 0);
  const totalBill = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalPaid = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
  const totalDue = orders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);
  
  // ✅ Flatten all items from all orders
  const allItems = orders.flatMap((o, orderIdx) =>
    (o.items || []).map(item => ({
      ...item,
      orderNumber: o.orderNumber,
      orderIndex: orderIdx
    }))
  );

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">

        {/* Action Buttons */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 print:hidden">
          <h3 className="text-sm font-semibold text-slate-800">
            {orders.length > 1 ? "Customer Invoice (All Orders)" : "Sale Invoice"}
          </h3>
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
                  className="w-18 h-14 object-contain rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-25 h-12 rounded-lg  flex items-center justify-center ">
                  <img src={ShopLogo} className="w-28 h-20 object-cover rounded-full"  alt="Shop Logo" />
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
                  {primaryOrder?.customer?.name || "—"}
                </span>
              </div>
              {primaryOrder?.customer?.phone && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="text-slate-700">{primaryOrder.customer.phone}</span>
                </div>
              )}
              {(primaryOrder?.customer?.address || primaryOrder?.customer?.city) && (
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-medium mt-0.5">Address:</span>
                  <span className="text-slate-700">
                    {[primaryOrder?.customer?.address, primaryOrder?.customer?.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Invoice# + Date — right */}
            <div className="text-xs text-right space-y-0.5 flex-shrink-0 ml-4">
              {orders.length === 1 ? (
                <>
                  <div>
                    <span className="text-slate-500 font-medium">Invoice#</span>
                    <span className="ml-1.5 font-bold text-indigo-600">
                      {primaryOrder?.orderNumber || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Date:</span>
                    <span className="ml-1.5 text-slate-700">
                      {primaryOrder?.createdAt
                        ? new Date(primaryOrder.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "—"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-slate-500 font-medium">Orders:</span>
                    <span className="ml-1.5 font-bold text-indigo-600">
                      {orders.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Period:</span>
                    <span className="ml-1.5 text-slate-700 text-xs block whitespace-nowrap">
                      {orders[0]?.createdAt
                        ? new Date(orders[0].createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short"
                          })
                        : "—"}
                      {" to "}
                      {orders[orders.length-1]?.createdAt
                        ? new Date(orders[orders.length-1].createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric"
                          })
                        : "—"}
                    </span>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* ── ORDERS HEADER (if multiple orders) ── */}
          {orders.length > 1 && (
            <div className="mb-3 pb-2 border-b border-slate-300">
              <p className="text-xs font-medium text-slate-600 bg-blue-50 px-2 py-1 rounded">
                📋 Multiple Orders ({orders.length}) - Combined Invoice
              </p>
            </div>
          )}

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
              {allItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-2 text-center text-slate-400">No items</td>
                </tr>
              ) : (
                allItems.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-2 py-1.5 text-slate-500">{i + 1}</td>
                    <td className="px-2 py-1.5 text-slate-800 font-medium">
                      <div>{item.name}</div>
                      {orders.length > 1 && (
                        <span className="text-xs text-slate-400">({item.orderNumber})</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-center text-slate-600">{item.qty}</td>
                    <td className="px-2 py-1.5 text-right text-slate-600">
                      {Number(item.price).toLocaleString()}
                    </td>
                    <td className="px-2 py-1.5 text-right font-semibold text-slate-800">
                      {(item.qty * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── TOTALS (Aggregated) ── */}
          <div className="border-t-2 border-slate-800 pt-3 space-y-1.5 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-slate-500">کل مصنوعات (Total Products)</span>
              <span className="font-semibold text-slate-800">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ٹوٹل بل (Total Bill)</span>
              <span className="font-semibold text-slate-800">
                Rs {totalBill.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ادا شدہ (Paid)</span>
              <span className="font-semibold text-green-600">
                Rs {totalPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between bg-red-50 px-2 py-1.5 rounded-lg border border-red-100">
              <span className="font-bold text-red-700">بقایا (Balance Due)</span>
              <span className="font-bold text-red-700 text-sm">
                Rs {totalDue.toLocaleString()}
              </span>
            </div>
          </div>

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


function ReceiptSlip({ data, onClose }) {
  const { shop, customer, orderNumber, previousBalance, cashReceived, currentBalance, date } = data;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm z-10">

        {/* Action buttons */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 print:hidden">
          <h3 className="text-sm font-semibold text-slate-800">Cash Receipt</h3>
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

        {/* Receipt Content */}
        <div className="p-5">

          {/* Shop Header */}
          <div className="text-center mb-4 pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-800">
              {shop?.shopName || "Shop Name"}
            </h2>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">
              {shop?.shopAddress || ""}
            </p>
            <div className="mt-2 inline-block border border-slate-300 px-4 py-0.5 rounded">
              <p className="text-xs font-semibold text-slate-700">Cash Receipt</p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2 text-xs mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="text-slate-500">
                {date ? new Date(date).toLocaleString("en-PK") : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-800">{customer?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                <rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="8" cy="12.5" r="0.8" fill="currentColor"/>
              </svg>
              <span className="text-slate-500">{shop?.phone || ""}</span>
              {customer?.phone && (
                <span className="text-slate-500 ml-auto">{customer.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Order:</span>
              <span className="font-mono font-semibold text-indigo-600">{orderNumber}</span>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Previous Balance</span>
              <span className="font-semibold text-slate-800">
                {Number(previousBalance || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cash Received</span>
              <span className="font-semibold text-green-600">
                {Number(cashReceived || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2">
              <span className="font-semibold text-slate-700">Current Balance</span>
              <span className={`font-bold text-base ${currentBalance <= 0 ? "text-green-600" : "text-red-600"}`}>
                {Number(currentBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {currentBalance <= 0 && (
            <div className="mt-3 text-center">
              <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                ✓ Payment Complete
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceiptSlip;


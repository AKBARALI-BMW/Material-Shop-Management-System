import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePayment } from "../../redux/orderSlice";

function PaymentModal({ order, onClose }) {
  const dispatch = useDispatch();
  const [amount,   setAmount]   = useState("");
  const [note,     setNote]     = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const due = (order.totalAmount || 0) - (order.paidAmount || 0);

  const handleSubmit = async () => {
    setError("");
    const pay = Number(amount);

    if (!pay || pay <= 0) {
      setError("Please enter a valid amount."); return;
    }
    if (pay > due) {
      setError(`Amount exceeds due balance of Rs ${due.toLocaleString()}.`); return;
    }

    setLoading(true);
    await dispatch(updatePayment({ id: order._id, amount: pay, note }));
    setLoading(false);
    setAmount("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Update Payment</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Order{" "}
              <span className="font-mono font-semibold text-indigo-600">{order.orderNumber}</span>
              {" "}— {order.customer?.name}
            </p>
          </div>
          <button onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-2 mb-5">
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
              Rs {due.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment History */}
        {order.paymentHistory?.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Payment History
            </p>
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
              {order.paymentHistory.map((p, i) => (
                <div key={i}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        Rs {Number(p.amount).toLocaleString()}
                      </p>
                      {p.note && (
                        <p className="text-xs text-slate-400">{p.note}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(p.date).toLocaleDateString("en-PK", {
                      day:   "numeric",
                      month: "short",
                      year:  "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Payment — only if due > 0 */}
        {due > 0 ? (
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Add Payment
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs mb-3">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Amount (Max: Rs {due.toLocaleString()})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Cash payment"
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            This order is fully paid.
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {due > 0 && (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/>
                  </svg>
                  Saving...
                </>
              ) : "Add Payment"}
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default PaymentModal;
import { useState } from "react";
import DeleteOrderModal from "./orders/DeleteOrderModal";

const statusBadge = {
  "Paid":    "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Pending": "bg-red-100 text-red-700",
};

function OrderList({ filtered, onView, onDelete }) {
  const [deleteModal, setDeleteModal] = useState(null);

  const safeFiltered = Array.isArray(filtered)
    ? filtered.filter((o) => o && (o._id || o.id))
    : [];

  const handleDeleteConfirm = () => {
    if (!deleteModal) return;
    onDelete(deleteModal._id || deleteModal.id);
    setDeleteModal(null);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            All Orders
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({safeFiltered.length} results)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Order No</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Customer</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Items</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Paid</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Due</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Status</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeFiltered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                safeFiltered.map((o) => {
                  const due = (o.totalAmount || 0) - (o.paidAmount || 0);
                  return (
                    <tr key={o._id || o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">

                      {/* Order Number */}
                      <td className="py-3 pr-4">
                        <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {o.orderNumber}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 pr-4">
                        <p className="text-slate-800 font-medium whitespace-nowrap">
                          {o.customer?.name || "—"}
                        </p>
                        <p className="text-xs text-slate-400">{o.customer?.phone || ""}</p>
                      </td>

                      {/* Items count */}
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                        {o.items?.length || 0} item{o.items?.length !== 1 ? "s" : ""}
                      </td>

                      {/* Total */}
                      <td className="py-3 pr-4 text-slate-800 whitespace-nowrap font-medium">
                        Rs {(o.totalAmount || 0).toLocaleString()}
                      </td>

                      {/* Paid */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className="text-green-600 font-medium">
                          Rs {(o.paidAmount || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Due */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={due > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                          Rs {due.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[o.status] || statusBadge["Pending"]}`}>
                          {o.status || "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onView(o)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
                              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => setDeleteModal(o)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"
                                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <DeleteOrderModal
          order={deleteModal}
          onDelete={handleDeleteConfirm}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </>
  );
}

export default OrderList;
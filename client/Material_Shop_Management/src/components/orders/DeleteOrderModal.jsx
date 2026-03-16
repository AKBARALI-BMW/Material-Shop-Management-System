function DeleteOrderModal({ order, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-800">Delete Order</h3>
          <button onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600" viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">
              Delete order "{order.orderNumber}"?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Customer: {order.customer?.name} — Rs {(order.totalAmount || 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onDelete}
            className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition">
            Yes, Delete
          </button>
          <button onClick={onClose}
            className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteOrderModal;
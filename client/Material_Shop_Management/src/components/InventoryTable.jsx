import { useState } from "react";

const statusBadge = {
  "In Stock":  "bg-green-100 text-green-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out Stock": "bg-red-100 text-red-700",
};

const statusDot = {
  "In Stock":  "bg-green-500",
  "Low Stock": "bg-amber-500",
  "Out Stock": "bg-red-500",
};

// ── Update Stock Modal ─────────────────────────────────────────────
function UpdateStockModal({ item, onUpdate, onClose }) {
  const [newStock, setNewStock] = useState(item.stock);
  const [mode,     setMode]     = useState("set"); // "set" or "add"

  const previewStock = mode === "add"
    ? item.stock + Number(newStock || 0)
    : Number(newStock || 0);

  const handleSubmit = () => {
    onUpdate(item.id || item._id, previewStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-800">Update Stock</h3>
          <button onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="bg-slate-50 rounded-xl p-3 mb-4">
          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-slate-500">
              Current stock: <span className="font-medium text-slate-700">{item.stock} {item.unit}</span>
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[item.status]}`}>
              {item.status}
            </span>
          </div>
          {item.status === "Low Stock" && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠ Min stock level: {item.minStock} {item.unit}
            </p>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("set"); setNewStock(item.stock); }}
            className={`flex-1 h-8 text-xs font-medium rounded-lg border transition-all
              ${mode === "set"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
          >
            Set Stock
          </button>
          <button
            onClick={() => { setMode("add"); setNewStock(""); }}
            className={`flex-1 h-8 text-xs font-medium rounded-lg border transition-all
              ${mode === "add"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
          >
            Add Stock
          </button>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {mode === "set" ? "New Quantity" : "Add Quantity"}
          </label>
          <input
            type="number"
            min="0"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            placeholder={mode === "set" ? "Enter new stock" : "Enter quantity to add"}
            className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Preview */}
        <div className="bg-indigo-50 rounded-xl p-3 mb-5">
          <p className="text-xs text-indigo-600 font-medium mb-1">After update:</p>
          <p className="text-lg font-semibold text-indigo-700">
            {previewStock} {item.unit}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={handleSubmit}
            className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">
            Update Stock
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

// ── Main Component ─────────────────────────────────────────────────
function InventoryTable({ filtered, onUpdateStock }) {
  const [stockModal, setStockModal] = useState(null);

  const safeFiltered = Array.isArray(filtered)
    ? filtered.filter((i) => i && (i._id || i.id))
    : [];

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Stock Overview
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({safeFiltered.length} products)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Product</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Category</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Price</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Stock</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Min Level</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Status</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {safeFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                safeFiltered.map((item) => (
                  <tr key={item._id || item.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">

                    {/* Product */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[item.status] || "bg-slate-300"}`} />
                        <div>
                          <p className="text-slate-800 font-medium whitespace-nowrap">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.unit}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{item.category}</td>

                    {/* Price */}
                    <td className="py-3 pr-4 text-slate-800 whitespace-nowrap">
                      Rs {Number(item.price || 0).toLocaleString()}
                    </td>

                    {/* Stock with progress bar */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold whitespace-nowrap ${
                          item.status === "Out Stock" ? "text-red-600"
                          : item.status === "Low Stock" ? "text-amber-600"
                          : "text-slate-800"
                        }`}>
                          {item.stock}
                        </span>
                        {/* Stock progress bar */}
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.status === "Out Stock" ? "bg-red-400"
                              : item.status === "Low Stock" ? "bg-amber-400"
                              : "bg-green-400"
                            }`}
                            style={{
                              width: `${Math.min(100, item.minStock > 0
                                ? (item.stock / (item.minStock * 3)) * 100
                                : 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Min Stock Level */}
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                      {item.minStock}
                    </td>

                    {/* Status */}
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[item.status] || statusBadge["In Stock"]}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3">
                      <button
                        onClick={() => setStockModal(item)}
                        className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8a6 6 0 1012 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          <path d="M14 4v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {stockModal && (
        <UpdateStockModal
          item={stockModal}
          onUpdate={onUpdateStock}
          onClose={() => setStockModal(null)}
        />
      )}
    </>
  );
}

export default InventoryTable;
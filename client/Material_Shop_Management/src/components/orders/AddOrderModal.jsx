import { useState } from "react";



function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const emptyItem = { productId: "", name: "", qty: 1, price: "" };

function AddOrderModal({ customers, products, onAdd, onClose }) {
  const [customerId,  setCustomerId]  = useState("");
  const [items,       setItems]       = useState([{ ...emptyItem }]);
  const [paidAmount,  setPaidAmount]  = useState("");
  const [dueDate,     setDueDate]     = useState("");
  const [notes,       setNotes]       = useState("");
  const [formError,   setFormError]   = useState("");

  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safeProducts  = Array.isArray(products)  ? products  : [];

  // ✅ when product selected — auto fill price
  const handleProductSelect = (index, productId) => {
    const product = safeProducts.find((p) => p._id === productId);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      productId: productId,
      name:      product?.name  || "",
      price:     product?.price || "",
    };
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated  = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem    = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // ✅ calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.qty) * Number(item.price) || 0), 0
  );

  // ✅ submit — sends productId to backend
  const handleSubmit = () => {
    setFormError("");

    if (!customerId) {
      setFormError("Please select a customer."); return;
    }
    if (items.some((i) => !i.productId || !i.price || !i.qty)) {
      setFormError("Please fill all item fields."); return;
    }

    onAdd({
      customerId,
      items: items.map((i) => ({
        productId: i.productId,
        qty:       Number(i.qty),
        price:     Number(i.price),
      })),
      paidAmount: Number(paidAmount) || 0,
      dueDate:    dueDate || null,
      notes,
    });
  };

  return (
    <Modal title="New Order" onClose={onClose}>

      {/* Error */}
      {formError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs mb-4">
          {formError}
        </div>
      )}

      {/* Customer Select */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Customer
        </p>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
        >
          <option value="">— Select Customer —</option>
          {safeCustomers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} — {c.phone}
            </option>
          ))}
        </select>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Order Items
          </p>
          <button onClick={addItem}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Add Item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-end gap-2">

              {/* Product dropdown */}
              <div className="flex-1">
                {index === 0 && (
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                    Product
                  </label>
                )}
                <select
                  value={item.productId}
                  onChange={(e) => handleProductSelect(index, e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  <option value="">— Select —</option>
                  {safeProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* Qty */}
              <div className="w-16">
                {index === 0 && (
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                    Qty
                  </label>
                )}
                <input type="number" min="1" value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  className="w-full h-10 px-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Price */}
              <div className="w-24">
                {index === 0 && (
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                    Price
                  </label>
                )}
                <input type="number" value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  placeholder="0"
                  className="w-full h-10 px-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Remove */}
              <button onClick={() => removeItem(index)} disabled={items.length === 1}
                className="h-10 w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-30 flex-shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Total preview */}
        <div className="flex justify-end mt-3 pt-3 border-t border-slate-100">
          <div className="text-right">
            <p className="text-xs text-slate-500">Order Total</p>
            <p className="text-base font-semibold text-slate-800">
              Rs {totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Payment
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Paid Amount
            </label>
            <input type="number" value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)} placeholder="0"
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Due Date
            </label>
            <input type="date" value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* Payment summary */}
        {paidAmount !== "" && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-sm font-semibold text-slate-800">
                Rs {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500">Paid</p>
              <p className="text-sm font-semibold text-green-600">
                Rs {Number(paidAmount).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500">Due</p>
              <p className="text-sm font-semibold text-red-600">
                Rs {Math.max(0, totalAmount - Number(paidAmount)).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="flex flex-col gap-1.5 mt-3">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Notes (optional)
          </label>
          <input type="text" value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra note..."
            className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={handleSubmit}
          className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">
          Create Order
        </button>
        <button onClick={onClose}
          className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default AddOrderModal;

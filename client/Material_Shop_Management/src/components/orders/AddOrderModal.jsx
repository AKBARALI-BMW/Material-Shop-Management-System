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

function Field({ label, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        {...props}
        className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
      />
    </div>
  );
}

const emptyItem = { product: "", qty: 1, price: "" };

function AddOrderModal({ onAdd, onClose }) {
  const [customerName,  setCustomerName]  = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items,         setItems]         = useState([{ ...emptyItem }]);
  const [paidAmount,    setPaidAmount]    = useState("");
  const [dueDate,       setDueDate]       = useState("");

  // ── Item handlers ──
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // ── Calculate total ──
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.qty) * Number(item.price) || 0), 0
  );

  // ── Submit ──
  const handleSubmit = () => {
    if (!customerName || !customerPhone) return;
    if (items.some((i) => !i.product || !i.price)) return;

    onAdd({
      customer:    { name: customerName, phone: customerPhone },
      items:       items.map((i) => ({ ...i, qty: Number(i.qty), price: Number(i.price) })),
      totalAmount,
      paidAmount:  Number(paidAmount) || 0,
      dueDate:     dueDate || "",
    });
  };

  return (
    <Modal title="New Order" onClose={onClose}>

      {/* Customer Info */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Customer Info
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Customer Name" value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Ali Khan" required />
          <Field label="Phone" value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g. 0300-1234567" required />
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
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
              <div className="flex-1">
                <Field label={index === 0 ? "Product" : ""}
                  value={item.product}
                  onChange={(e) => handleItemChange(index, "product", e.target.value)}
                  placeholder="e.g. Cement" required />
              </div>
              <div className="w-16">
                <Field label={index === 0 ? "Qty" : ""}
                  type="number" min="1" value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  placeholder="1" />
              </div>
              <div className="w-24">
                <Field label={index === 0 ? "Price" : ""}
                  type="number" value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  placeholder="1200" required />
              </div>
              <button
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="h-10 w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-30 flex-shrink-0"
              >
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

      {/* Payment Info */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Payment
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Paid Amount" type="number" value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            placeholder="0" />
          <Field label="Due Date (optional)" type="date" value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} />
        </div>

        {/* Payment summary */}
        {paidAmount !== "" && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-sm font-semibold text-slate-800">Rs {totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500">Paid</p>
              <p className="text-sm font-semibold text-green-600">Rs {Number(paidAmount).toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <p className="text-xs text-slate-500">Due</p>
              <p className="text-sm font-semibold text-red-600">
                Rs {Math.max(0, totalAmount - Number(paidAmount)).toLocaleString()}
              </p>
            </div>
          </div>
        )}
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
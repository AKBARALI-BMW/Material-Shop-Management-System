import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateStock, deleteProduct, updateProduct } from "../redux/productSlice";

const categories = [
  "Cement", "Bricks", "Steel", "Pipes",
  "Sanitary", "Paint", "Wood", "Glass", "Tiles",
  "Electrical", "Plumbing",
];

const statusBadge = {
  "In Stock":  "bg-green-100 text-green-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out Stock": "bg-red-100 text-red-700",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
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

function Field({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        {...props}
        className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, name, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <select
        name={name} value={value} onChange={onChange}
        className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ProductTable({ filtered, loading }) {
  const dispatch = useDispatch();

  const [editProduct,  setEditProduct]  = useState(null);
  const [stockProduct, setStockProduct] = useState(null);
  const [deleteModal,  setDeleteModal]  = useState(null);
  const [newStock,     setNewStock]     = useState("");

  const emptyForm = { name: "", category: "Cement", stock: "", price: "", unit: "Bag" };
  const [form, setForm] = useState(emptyForm);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, stock: p.stock, price: p.price, unit: p.unit });
  };

  const handleEdit = () => {
    if (!editProduct) return;
    dispatch(updateProduct({
      id: editProduct._id,
      formData: { name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), unit: form.unit },
    }));
    setEditProduct(null);
    setForm(emptyForm);
  };

  const handleUpdateStock = () => {
    if (newStock === "" || !stockProduct) return;
    dispatch(updateStock({ id: stockProduct._id, stock: Number(newStock) }));
    setStockProduct(null);
    setNewStock("");
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    dispatch(deleteProduct(deleteModal._id));
    setDeleteModal(null);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            All Products
            <span className="ml-2 text-xs font-normal text-slate-400">({filtered.length} results)</span>
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Product</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Category</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Price</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Stock</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Status</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-4">
                        <p className="text-slate-800 font-medium whitespace-nowrap">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.unit}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{p.category}</td>
                      <td className="py-3 pr-4 text-slate-800 whitespace-nowrap">Rs {Number(p.price).toLocaleString()}</td>
                      <td className="py-3 pr-4 text-slate-800 whitespace-nowrap">{p.stock}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => { setStockProduct(p); setNewStock(p.stock); }}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M2 8a6 6 0 1012 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                              <path d="M14 4v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Stock
                          </button>
                          <button onClick={() => openEdit(p)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>
                          <button onClick={() => setDeleteModal(p)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <Modal title="Edit Product" onClose={() => setEditProduct(null)}>
          <div className="space-y-3">
            <Field label="Product Name" name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Cement OPC" />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Category" name="category" value={form.category} onChange={handleFormChange} options={categories} />
              <Field label="Unit" name="unit" value={form.unit} onChange={handleFormChange} placeholder="e.g. Bag, Piece" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (Rs)" name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="1200" />
              <Field label="Stock Qty" name="stock" type="number" value={form.stock} onChange={handleFormChange} placeholder="100" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={handleEdit} className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">Save Changes</button>
            <button onClick={() => setEditProduct(null)} className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Update Stock Modal */}
      {stockProduct && (
        <Modal title="Update Stock" onClose={() => setStockProduct(null)}>
          <p className="text-sm text-slate-500 mb-4">
            Update stock for <span className="font-medium text-slate-800">{stockProduct.name}</span>.{" "}
            Current stock: <span className="font-medium text-slate-800">{stockProduct.stock}</span>
          </p>
          <Field label="New Stock Quantity" type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="Enter new quantity" />
          <div className="flex gap-2 mt-5">
            <button onClick={handleUpdateStock} className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">Update Stock</button>
            <button onClick={() => setStockProduct(null)} className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Modal title="Delete Product" onClose={() => setDeleteModal(null)}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Delete "{deleteModal.name}"?</p>
              <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition">Yes, Delete</button>
            <button onClick={() => setDeleteModal(null)} className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">Cancel</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ProductTable;
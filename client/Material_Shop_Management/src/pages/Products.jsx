import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct } from "../redux/productSlice";
import Layout from "./Layout";
import ProductTable from "../components/ProductTable";

const categories = [
  "All", "Cement", "Bricks", "Steel", "Pipes",
  "Sanitary", "Paint", "Wood", "Glass", "Tiles",
  "Electrical", "Plumbing",
];

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



function Products() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const safeProducts = Array.isArray(products) ? products : [];

  const [search,         setSearch]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddModal,   setShowAddModal]  = useState(false);

  const emptyForm = { name: "", category: "Cement", stock: "", price: "", unit: "Bag" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const filtered = safeProducts.filter((p) => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });



  const handleAdd = () => {
    if (!form.name || !form.price || !form.stock) return;
    dispatch(addProduct({
      name:     form.name,
      category: form.category,
      price:    Number(form.price),
      stock:    Number(form.stock),
      unit:     form.unit,
    }));
    setForm(emptyForm);
    setShowAddModal(false);
  };



  return (
    <Layout>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Products</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your construction materials.</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setShowAddModal(true); }}
          className="flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition active:scale-[0.99] self-start sm:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Product
        </button>
      </div>

      {/* Search + Category Filter */}
    
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
      
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`h-9 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap 
                ${activeCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"  }`} > {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Products", value: safeProducts.length,                                        color: "text-slate-800" },
          { label: "In Stock",       value: safeProducts.filter(p => p.status === "In Stock").length,   color: "text-green-600" },
          { label: "Low Stock",      value: safeProducts.filter(p => p.status === "Low Stock").length,  color: "text-amber-600" },
          { label: "Out of Stock",   value: safeProducts.filter(p => p.status === "Out Stock").length,  color: "text-red-600"   },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4v3.5M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* Product Table — separate component */}
      <ProductTable filtered={filtered} loading={loading} />

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Product" onClose={() => setShowAddModal(false)}>
          <div className="space-y-3">
            <Field label="Product Name" name="name" value={form.name}
              onChange={handleFormChange} placeholder="e.g. Cement OPC" />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Category" name="category" value={form.category}
                onChange={handleFormChange} options={categories.slice(1)} />
              <Field label="Unit" name="unit" value={form.unit}
                onChange={handleFormChange} placeholder="e.g. Bag, Piece" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (Rs)" name="price" type="number" value={form.price}
                onChange={handleFormChange} placeholder="1200" />
              <Field label="Stock Qty" name="stock" type="number" value={form.stock}
                onChange={handleFormChange} placeholder="100" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={handleAdd} className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">Add Product</button>
            <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">Cancel</button>
          </div>
        </Modal>
      )}

    </Layout>
  );
}

export default Products;
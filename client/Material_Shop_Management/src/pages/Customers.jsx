import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  addCustomer,
} from "../redux/customerSlice";
import Layout from "./Layout";
import CustomerTable from "../components/CustomerTable";

const statusFilters = ["All", "Clear", "Partial", "Pending"];
const emptyForm     = { name: "", phone: "", email: "", address: "", city: "" };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10">
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

function Customers() {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);

  // ✅ always safe array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form,         setForm]         = useState(emptyForm);

  // ✅ load customers from backend on page open
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ filter using safeCustomers
  const filtered = safeCustomers.filter((c) => {
    const matchSearch = (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ✅ ADD — dispatches to Redux → backend
  const handleAdd = () => {
    if (!form.name || !form.phone) return;
    dispatch(addCustomer({
      name:    form.name,
      phone:   form.phone,
      email:   form.email,
      address: form.address,
      city:    form.city,
    }));
    setForm(emptyForm);
    setShowAddModal(false);
  };

  // ✅ stats using safeCustomers
  const totalDue = safeCustomers.reduce(
    (sum, c) => sum + (c.totalAmount - c.paidAmount), 0
  );

  return (
    <Layout>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Customers</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your shop customers and payments.</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setShowAddModal(true); }}
          className="flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition active:scale-[0.99] self-start sm:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Customers", value: safeCustomers.length,                                       color: "text-slate-800" },
          { label: "Clear",           value: safeCustomers.filter(c => c.status === "Clear").length,     color: "text-green-600" },
          { label: "Partial",         value: safeCustomers.filter(c => c.status === "Partial").length,   color: "text-amber-600" },
          { label: "Total Due",       value: `Rs ${totalDue.toLocaleString()}`,                          color: "text-red-600"   },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`h-9 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap
                ${statusFilter === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}>
              {s}
            </button>
          ))}
        </div>
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

      {/* Loading */}
      {loading && (
        <div className="mb-4 text-sm text-slate-500">Loading customers...</div>
      )}

      {/* Table — passes Redux dispatch functions */}
      <CustomerTable filtered={filtered} />

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Customer" onClose={() => setShowAddModal(false)}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full Name" name="name" value={form.name}
                onChange={handleFormChange} placeholder="e.g. Ali Khan" required />
              <Field label="Phone Number" name="phone" value={form.phone}
                onChange={handleFormChange} placeholder="e.g. 0300-1234567" required />
            </div>
            <Field label="Email (optional)" name="email" type="email" value={form.email}
              onChange={handleFormChange} placeholder="e.g. ali@gmail.com" />
            <Field label="Address (optional)" name="address" value={form.address}
              onChange={handleFormChange} placeholder="e.g. Main Bazar, Near Masjid" />
            <Field label="City (optional)" name="city" value={form.city}
              onChange={handleFormChange} placeholder="e.g. Mardan" />
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={handleAdd}
              className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">
              Add Customer
            </button>
            <button onClick={() => setShowAddModal(false)}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
              Cancel
            </button>
          </div>
        </Modal>
      )}

    </Layout>
  );
}

export default Customers;
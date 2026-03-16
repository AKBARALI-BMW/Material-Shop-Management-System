import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCustomer, deleteCustomer } from "../redux/customerSlice";

const statusBadge = {
  "Clear":   "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Pending": "bg-red-100 text-red-700",
};

function Modal({ title, onClose, children, size = "md" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-lg w-full ${size === "lg" ? "max-w-2xl" : "max-w-md"} p-6 z-10 max-h-[90vh] overflow-y-auto`}>
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

function Avatar({ name, size = "sm" }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-teal-100 text-teal-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
  ];
  const color     = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  const sizeClass = size === "lg" ? "w-12 h-12 text-base" : "w-8 h-8 text-xs";
  return (
    <div className={`${sizeClass} rounded-full ${color} flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function CustomerTable({ filtered }) {
  const dispatch = useDispatch();

  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [deleteModal,  setDeleteModal]  = useState(null);

  const emptyForm = { name: "", phone: "", email: "", address: "", city: "" };
  const [form, setForm] = useState(emptyForm);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ EDIT
  const openEdit = (c) => {
    setEditCustomer(c);
    setForm({
      name:    c.name    || "",
      phone:   c.phone   || "",
      email:   c.email   || "",
      address: c.address || "",
      city:    c.city    || "",
    });
  };

  const handleEdit = () => {
    // ✅ safety check before dispatch
    if (!editCustomer?._id) return;
    dispatch(updateCustomer({
      id: editCustomer._id,
      formData: {
        name:    form.name,
        phone:   form.phone,
        email:   form.email,
        address: form.address,
        city:    form.city,
      },
    }));
    setEditCustomer(null);
    setForm(emptyForm);
  };

  // ✅ DELETE
  const handleDelete = () => {
    // ✅ safety check before dispatch
    if (!deleteModal?._id) return;
    dispatch(deleteCustomer(deleteModal._id));
    setDeleteModal(null);
  };

  // ✅ safe filtered array — never null
  const safeFiltered = Array.isArray(filtered) ? filtered.filter(c => c && c._id) : [];

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            All Customers
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({safeFiltered.length} results)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Customer</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Phone</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">City</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Orders</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Balance Due</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Status</th>
                <th className="text-left text-xs text-slate-500 font-medium pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No customers found.
                  </td>
                </tr>
              ) : (
                // ✅ safeFiltered — every item guaranteed to have _id
                safeFiltered.map((c) => {
                  const due = (c.totalAmount || 0) - (c.paidAmount || 0);
                  return (
                    // ✅ key uses _id — safe because safeFiltered filters out null _id
                    <tr key={c._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.name} />
                          <div>
                            <p className="text-slate-800 font-medium whitespace-nowrap">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{c.phone}</td>
                      <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{c.city || "—"}</td>
                      <td className="py-3 pr-4 text-slate-800">{c.totalOrders || 0}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={due > 0 ? "text-red-600 font-medium" : "text-slate-800"}>
                          Rs {due.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[c.status] || statusBadge["Clear"]}`}>
                          {c.status || "Clear"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewCustomer(c)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
                              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                            </svg>
                            View
                          </button>
                          <button onClick={() => openEdit(c)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>
                          <button onClick={() => setDeleteModal(c)}
                            className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition">
                            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                              <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* Edit Modal */}
      {editCustomer && (
        <Modal title="Edit Customer" onClose={() => setEditCustomer(null)}>
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
            <button onClick={handleEdit}
              className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition">
              Save Changes
            </button>
            <button onClick={() => setEditCustomer(null)}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewCustomer && (
        <Modal title="Customer Details" onClose={() => setViewCustomer(null)} size="lg">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
            <Avatar name={viewCustomer.name} size="lg" />
            <div>
              <h4 className="text-base font-semibold text-slate-800">{viewCustomer.name}</h4>
              <p className="text-sm text-slate-500">{viewCustomer.phone}</p>
              {viewCustomer.email && (
                <p className="text-xs text-slate-400 mt-0.5">{viewCustomer.email}</p>
              )}
            </div>
            <div className="ml-auto">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[viewCustomer.status] || statusBadge["Clear"]}`}>
                {viewCustomer.status || "Clear"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Total Orders</p>
              <p className="text-xl font-semibold text-slate-800">{viewCustomer.totalOrders || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Total Amount</p>
              <p className="text-xl font-semibold text-slate-800">
                Rs {(viewCustomer.totalAmount || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Paid Amount</p>
              <p className="text-xl font-semibold text-green-600">
                Rs {(viewCustomer.paidAmount || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Balance Due</p>
              <p className="text-xl font-semibold text-red-600">
                Rs {((viewCustomer.totalAmount || 0) - (viewCustomer.paidAmount || 0)).toLocaleString()}
              </p>
            </div>
          </div>
          {(viewCustomer.address || viewCustomer.city) && (
            <div className="bg-slate-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-500 mb-1">Address</p>
              <p className="text-sm text-slate-700">
                {[viewCustomer.address, viewCustomer.city].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          <button onClick={() => setViewCustomer(null)}
            className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
            Close
          </button>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Modal title="Delete Customer" onClose={() => setDeleteModal(null)}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Delete "{deleteModal.name}"?</p>
              <p className="text-xs text-slate-500 mt-1">
                All orders and payment records for this customer will be lost.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDelete}
              className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition">
              Yes, Delete
            </button>
            <button onClick={() => setDeleteModal(null)}
              className="flex-1 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CustomerTable;
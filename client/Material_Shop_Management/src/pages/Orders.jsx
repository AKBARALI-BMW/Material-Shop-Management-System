import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, createOrder, deleteOrder } from "../redux/orderSlice";
import { fetchCustomers } from "../redux/customerSlice";
import { fetchProducts }  from "../redux/productSlice";
import Layout      from "./Layout";
import OrderList   from "../components/OrderList";
import AddOrderModal  from "../components/orders/AddOrderModal";
import ViewOrderModal from "../components/orders/ViewOrderModal";



const statusFilters = ["All", "Paid", "Partial", "Pending"];



function Orders() {
  const dispatch = useDispatch();

  const { orders,    loading, error } = useSelector((state) => state.orders);
  const { customers }                 = useSelector((state) => state.customers);
  const { products }                  = useSelector((state) => state.products);

  // ✅ always safe arrays
  const safeOrders    = Array.isArray(orders)    ? orders    : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safeProducts  = Array.isArray(products)  ? products  : [];

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewOrder,    setViewOrder]    = useState(null);

  // ✅ load all data on page open
  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ filter
  const filtered = safeOrders.filter((o) => {
    const matchSearch =
      (o.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ✅ ADD — dispatch to Redux → backend
  const handleAdd = (formData) => {
    dispatch(createOrder(formData));
    setShowAddModal(false);
  };

  // ✅ DELETE — dispatch to Redux → backend
  const handleDelete = (id) => {
    dispatch(deleteOrder(id));
  };

  // ✅ stats
  const totalDue = safeOrders.reduce((s, o) => s + (o.dueAmount || 0), 0);

  return (
    <Layout>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Orders</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage all shop orders and payments.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition active:scale-[0.99] self-start sm:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          New Order
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Orders", value: safeOrders.length,                                    color: "text-slate-800" },
          { label: "Paid",         value: safeOrders.filter(o => o.status === "Paid").length,   color: "text-green-600" },
          { label: "Pending",      value: safeOrders.filter(o => o.status !== "Paid").length,   color: "text-amber-600" },
          { label: "Total Due",    value: `Rs ${totalDue.toLocaleString()}`,                    color: "text-red-600"   },
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
          <input type="text" placeholder="Search by order no or customer..."
            value={search} onChange={(e) => setSearch(e.target.value)}
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
        <div className="mb-4 text-sm text-slate-500">Loading orders...</div>
      )}

      {/* Order List */}
      <OrderList
        filtered={filtered}
        onView={(order) => setViewOrder(order)}
        onDelete={handleDelete}
      />

      {/* Add Order Modal */}
      {showAddModal && (
        <AddOrderModal
          customers={safeCustomers}
          products={safeProducts}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <ViewOrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
        />
      )}

    </Layout>
  );
}

export default Orders;

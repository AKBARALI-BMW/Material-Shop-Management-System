import { useState } from "react";
import Layout from "./Layout";
import OrderList from "../components/Orderlist";
import AddOrderModal from "../components/orders/AddOrderModal";
import ViewOrderModal from "../components/orders/ViewOrderModal";

// ── Dummy Data (replaced by Redux + API later) ─────────────────────
const initialOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customer:    { name: "Ali Khan", phone: "0300-1234567" },
    items: [
      { product: "Cement", qty: 10, price: 1200 },
      { product: "Bricks", qty: 100, price: 15  },
    ],
    totalAmount:  13500,
    paidAmount:   13500,
    dueDate:      "2026-04-10",
    status:       "Paid",
    createdAt:    "2026-03-01",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customer:    { name: "Umar Farooq", phone: "0311-9876543" },
    items: [
      { product: "Steel Rod 12mm", qty: 5,  price: 3500 },
      { product: "PVC Pipe 1inch", qty: 10, price: 450  },
    ],
    totalAmount:  22000,
    paidAmount:   10000,
    dueDate:      "2026-04-15",
    status:       "Partial",
    createdAt:    "2026-03-05",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customer:    { name: "Bilal Ahmed", phone: "0321-4567890" },
    items: [
      { product: "Cement", qty: 20, price: 1200 },
    ],
    totalAmount:  24000,
    paidAmount:   0,
    dueDate:      "2026-04-20",
    status:       "Pending",
    createdAt:    "2026-03-10",
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    customer:    { name: "Zara Malik", phone: "0333-1112233" },
    items: [
      { product: "Wash Basin", qty: 2, price: 4500 },
      { product: "Tiles",      qty: 50, price: 120 },
    ],
    totalAmount:  15000,
    paidAmount:   15000,
    dueDate:      "2026-03-30",
    status:       "Paid",
    createdAt:    "2026-03-12",
  },
];

const statusFilters = ["All", "Paid", "Partial", "Pending"];

// ── Main Component ─────────────────────────────────────────────────
function Orders() {
  const [orders,       setOrders]       = useState(initialOrders);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewOrder,    setViewOrder]    = useState(null);

  // ── Filter ──
  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── ADD ──
  const handleAdd = (newOrder) => {
    const order = {
      ...newOrder,
      id:          Date.now(),
      orderNumber: `ORD-00${orders.length + 1}`,
      createdAt:   new Date().toISOString().split("T")[0],
      status:
        newOrder.paidAmount >= newOrder.totalAmount ? "Paid"
        : newOrder.paidAmount > 0 ? "Partial"
        : "Pending",
    };
    setOrders([order, ...orders]);
    setShowAddModal(false);
  };

  // ── DELETE ──
  const handleDelete = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  // ── Stats ──
  const safeOrders  = Array.isArray(orders) ? orders : [];
  
  // const totalRev    = safeOrders.reduce((s, o) => s + o.totalAmount, 0); 
  const totalDue    = safeOrders.reduce((s, o) => s + (o.totalAmount - o.paidAmount), 0);

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
          { label: "Total Orders",   value: safeOrders.length,                                     color: "text-slate-800" },
          { label: "Paid",           value: safeOrders.filter(o => o.status === "Paid").length,    color: "text-green-600" },
          { label: "Pending",        value: safeOrders.filter(o => o.status !== "Paid").length,    color: "text-amber-600" },
          { label: "Total Due",      value: `Rs ${totalDue.toLocaleString()}`,                     color: "text-red-600"   },
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
            placeholder="Search by order no or customer..."
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

      {/* Order List Component */}
      <OrderList
        filtered={filtered}
        onView={(order) => setViewOrder(order)}
        onDelete={handleDelete}
      />

      {/* Add Order Modal */}
      {showAddModal && (
        <AddOrderModal
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
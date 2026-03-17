import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerReport,
  fetchCustomerOrders,
  clearCustomerOrders,
  fetchReceipt,
  clearReceipt,
} from "../../redux/reportSlice";
import ReceiptSlip from "./ReceiptSlip";

const statusBadge = {
  "Paid":    "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Pending": "bg-red-100 text-red-700",
};

function CustomerPurchaseReport() {
  const dispatch = useDispatch();

  const { data: customers, loading: custLoading } = useSelector((state) => state.reports.customerReport);
  const { data: customerData, loading: ordLoading } = useSelector((state) => state.reports.customerOrders);
  const { data: receiptData } = useSelector((state) => state.reports.receipt);

  const [search,          setSearch]          = useState("");
  const [selectedId,      setSelectedId]      = useState(null);
  const [showReceipt,     setShowReceipt]     = useState(false);

  useEffect(() => {
    dispatch(fetchCustomerReport());
  }, [dispatch]);

  const safeCustomers = Array.isArray(customers) ? customers : [];

  const filtered = safeCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleViewOrders = (customerId) => {
    setSelectedId(customerId);
    dispatch(fetchCustomerOrders(customerId));
  };

  const handleBack = () => {
    setSelectedId(null);
    dispatch(clearCustomerOrders());
  };

  const handleViewReceipt = (orderId, paymentIndex) => {
    dispatch(fetchReceipt({ orderId, paymentIndex }));
    setShowReceipt(true);
  };

  const selectedCustomer = customerData?.customer;
  const customerOrders   = Array.isArray(customerData?.orders) ? customerData.orders : [];

  return (
    <div className="space-y-5">

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </span>
        <input type="text" placeholder="Search customer by name or phone..."
          value={search} onChange={(e) => { setSearch(e.target.value); handleBack(); }}
          className="w-full h-9 pl-9 pr-4 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      {/* Customer List */}
      {!selectedId && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            All Customers
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({filtered.length} customers)
            </span>
          </h3>

          {custLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Customer</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Phone</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Orders</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total Spent</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total Due</th>
                    <th className="text-left text-xs text-slate-500 font-medium pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                        No customers found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => {
                      const due = (c.totalAmount || 0) - (c.paidAmount || 0);
                      return (
                        <tr key={c._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                          <td className="py-3 pr-4 text-slate-800 font-medium whitespace-nowrap">{c.name}</td>
                          <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{c.phone}</td>
                          <td className="py-3 pr-4 text-slate-800">{c.totalOrders || 0}</td>
                          <td className="py-3 pr-4 font-medium whitespace-nowrap">
                            Rs {(c.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            <span className={due > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                              Rs {due.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3">
                            <button onClick={() => handleViewOrders(c._id)}
                              className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap">
                              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                                <ellipse cx="8" cy="8" rx="7" ry="4.5" stroke="currentColor" strokeWidth="1.3"/>
                                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                              </svg>
                              View Orders
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Customer Order Detail */}
      {selectedId && (
        <div className="space-y-4">
          <button onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-medium transition">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Customers
          </button>

          {ordLoading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading orders...</div>
          ) : (
            <>
              {/* Customer Summary */}
              {selectedCustomer && (
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700 flex-shrink-0">
                      {selectedCustomer.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{selectedCustomer.name}</h4>
                      <p className="text-xs text-slate-500">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total Orders", value: selectedCustomer.totalOrders || 0,                                                                    color: "text-slate-800"  },
                      { label: "Total Spent",  value: `Rs ${(selectedCustomer.totalAmount || 0).toLocaleString()}`,                                         color: "text-indigo-600" },
                      { label: "Total Paid",   value: `Rs ${(selectedCustomer.paidAmount  || 0).toLocaleString()}`,                                         color: "text-green-600"  },
                      { label: "Total Due",    value: `Rs ${((selectedCustomer.totalAmount || 0) - (selectedCustomer.paidAmount || 0)).toLocaleString()}`,   color: "text-red-600"    },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                        <p className={`text-base font-semibold ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Table */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Order History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[620px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Order No</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Items</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Paid</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Due</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Status</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Date</th>
                        <th className="text-left text-xs text-slate-500 font-medium pb-2">Receipts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                            No orders found.
                          </td>
                        </tr>
                      ) : (
                        customerOrders.map((o) => (
                          <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                            <td className="py-3 pr-4">
                              <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {o.orderNumber}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-500 text-xs">
                              {o.items?.map(i => `${i.name} x${i.qty}`).join(", ") || "—"}
                            </td>
                            <td className="py-3 pr-4 font-medium whitespace-nowrap">
                              Rs {(o.totalAmount || 0).toLocaleString()}
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              <span className="text-green-600 font-medium">
                                Rs {(o.paidAmount || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              <span className={(o.dueAmount || 0) > 0 ? "text-red-600 font-medium" : "text-slate-400"}>
                                Rs {(o.dueAmount || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[o.status] || statusBadge["Pending"]}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-col gap-1">
                                {(o.paymentHistory || []).map((p, i) => (
                                  <button key={i}
                                    onClick={() => handleViewReceipt(o._id, i)}
                                    className="flex items-center gap-1 h-6 px-2 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition whitespace-nowrap">
                                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                                      <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                                      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                                    </svg>
                                    Rs {p.amount.toLocaleString()}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Receipt Slip Modal */}
      {showReceipt && receiptData && (
        <ReceiptSlip
          data={receiptData}
          onClose={() => {
            setShowReceipt(false);
            dispatch(clearReceipt());
          }}
        />
      )}
    </div>
  );
}

export default CustomerPurchaseReport;

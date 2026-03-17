import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesReport, fetchInvoice, clearInvoice } from "../../redux/reportSlice";
import InvoiceSlip from "./InvoiceSlip";

const filters = [
  { label: "This Week",      value: "week"  },
  { label: "This Month",     value: "month" },
  { label: "Last 3 Months",  value: "month" },
  { label: "This Year",      value: "year"  },
];

const statusBadge = {
  "Paid":    "bg-green-100 text-green-700",
  "Partial": "bg-amber-100 text-amber-700",
  "Pending": "bg-red-100 text-red-700",
};

function SalesReport() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.reports.sales);
  const { data: invoiceData }    = useSelector((state) => state.reports.invoice);

  const [filter,       setFilter]       = useState("month");
  const [showInvoice,  setShowInvoice]  = useState(false);

  useEffect(() => {
    dispatch(fetchSalesReport(filter));
  }, [dispatch, filter]);

  const safeOrders     = Array.isArray(data?.orders) ? data.orders : [];
  const totalRevenue   = data?.totalRevenue   || 0;
  const totalCollected = data?.totalCollected || 0;
  const totalDue       = data?.totalDue       || 0;

  const handleViewInvoice = (orderId) => {
    dispatch(fetchInvoice(orderId));
    setShowInvoice(true);
  };

  return (
    <div className="space-y-5">

      {/* Filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((f) => (
          <button key={f.label} onClick={() => setFilter(f.value)}
            className={`h-8 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap
              ${filter === f.value
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue",   value: `Rs ${totalRevenue.toLocaleString()}`,   color: "text-slate-800"  },
          { label: "Total Orders",    value: safeOrders.length,                        color: "text-indigo-600" },
          { label: "Total Collected", value: `Rs ${totalCollected.toLocaleString()}`, color: "text-green-600"  },
          { label: "Total Due",       value: `Rs ${totalDue.toLocaleString()}`,        color: "text-red-600"    },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Order Details
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({safeOrders.length} orders)
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Order No</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Customer</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Items</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Total</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Paid</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Due</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Status</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Date</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2">Slip</th>
                </tr>
              </thead>
              <tbody>
                {safeOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                      No orders found for this period.
                    </td>
                  </tr>
                ) : (
                  safeOrders.map((o) => (
                    <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-4">
                        <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {o.orderNumber}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-800 font-medium whitespace-nowrap">
                        {o.customer?.name || "—"}
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
                        <button
                          onClick={() => handleViewInvoice(o._id)}
                          className="flex items-center gap-1 h-7 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition whitespace-nowrap"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                            <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          </svg>
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Slip Modal */}
      {showInvoice && invoiceData && (
        <InvoiceSlip
          data={invoiceData}
          onClose={() => {
            setShowInvoice(false);
            dispatch(clearInvoice());
          }}
        />
      )}
    </div>
  );
}

export default SalesReport;

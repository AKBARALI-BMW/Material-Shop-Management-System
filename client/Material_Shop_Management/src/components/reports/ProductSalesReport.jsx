import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductSalesReport } from "../../redux/reportSlice";

const filters = [
  { label: "This Week",     value: "week"  },
  { label: "This Month",    value: "month" },
  { label: "This Year",     value: "year"  },
];

function ProductSalesReport() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.reports.productSales);

  const [filter, setFilter] = useState("month");

  useEffect(() => {
    dispatch(fetchProductSalesReport(filter));
  }, [dispatch, filter]);

  const safeProducts = Array.isArray(data?.products) ? data.products : [];
  const totalRevenue = data?.totalRevenue || 0;
  const totalQtySold = data?.totalQtySold || 0;

  

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

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Revenue",  value: `Rs ${totalRevenue.toLocaleString()}`, color: "text-slate-800"  },
          { label: "Total Qty Sold", value: totalQtySold.toLocaleString(),         color: "text-indigo-600" },
          { label: "Total Products", value: safeProducts.length,                   color: "text-green-600"  },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Product Sales Breakdown
          <span className="ml-2 text-xs font-normal text-slate-400">sorted by revenue</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">#</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Product</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Qty Sold</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Orders</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {safeProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                      No product sales found for this period.
                    </td>
                  </tr>
                ) : (
                  safeProducts.map((p, index) => (
                    <tr key={p.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-bold ${
                          index === 0 ? "text-amber-500"
                          : index === 1 ? "text-slate-400"
                          : index === 2 ? "text-orange-400"
                          : "text-slate-300"
                        }`}>#{index + 1}</span>
                      </td>
                      <td className="py-3 pr-4 text-slate-800 font-medium whitespace-nowrap">{p.name}</td>
                      <td className="py-3 pr-4 text-slate-800">{p.qtySold.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-slate-800">{p.orders}</td>
                      <td className="py-3">
                        <span className="text-green-600 font-semibold whitespace-nowrap">
                          Rs {p.revenue.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSalesReport;

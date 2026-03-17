import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStockReport } from "../../redux/reportSlice";

const statusBadge = {
  "In Stock":  "bg-green-100 text-green-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out Stock": "bg-red-100 text-red-700",
};

const statusDot = {
  "Low Stock": "bg-amber-500",
  "Out Stock": "bg-red-500",
};

function LowStockReport() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.reports.lowStock);

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchLowStockReport());
  }, [dispatch]);

  const safeProducts = Array.isArray(data?.products) ? data.products : [];

  const filtered = safeProducts.filter((p) =>
    filter === "All" ? true : p.status === filter
  );

  const outCount = data?.outCount || 0;
  const lowCount = data?.lowCount || 0;

  return (
    <div className="space-y-5">

      {/* Alert Banner */}
      {(outCount > 0 || lowCount > 0) && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L1.5 13h13L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Stock Alert</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {outCount > 0 && `${outCount} product${outCount > 1 ? "s" : ""} out of stock. `}
              {lowCount > 0 && `${lowCount} product${lowCount > 1 ? "s" : ""} running low.`}
              {" "}Please reorder from supplier.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Products", value: safeProducts.length, color: "text-slate-800" },
          { label: "Low Stock",      value: lowCount,            color: "text-amber-600" },
          { label: "Out of Stock",   value: outCount,            color: "text-red-600"   },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>


      {/* Filter pills */}
      <div className="flex items-center gap-1.5">
        {["All", "Low Stock", "Out Stock"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`h-8 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap
              ${filter === f
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}>
            {f}
          </button>
        ))}
      </div>


      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Products Needing Attention
          <span className="ml-2 text-xs font-normal text-slate-400">
            ({filtered.length} products)
          </span>
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Product</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Category</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Price</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Stock</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Min Level</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">Shortage</th>
                  <th className="text-left text-xs text-slate-500 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                      All products are well stocked.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const shortage = Math.max(0, (p.minStock || 0) - p.stock);
                    return (
                      <tr key={p._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[p.status] || "bg-slate-300"}`} />
                            <div>
                              <p className="text-slate-800 font-medium whitespace-nowrap">{p.name}</p>
                              <p className="text-xs text-slate-400">{p.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{p.category}</td>
                        <td className="py-3 pr-4 text-slate-800 whitespace-nowrap">
                          Rs {Number(p.price || 0).toLocaleString()}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`font-semibold whitespace-nowrap ${
                            p.status === "Out Stock" ? "text-red-600" : "text-amber-600"
                          }`}>
                            {p.stock} {p.unit}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                          {p.minStock || 10} {p.unit}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <span className="text-red-600 font-medium">-{shortage} {p.unit}</span>
                        </td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[p.status]}`}>
                            {p.status}
                          </span>
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
    </div>
  );
}

export default LowStockReport;

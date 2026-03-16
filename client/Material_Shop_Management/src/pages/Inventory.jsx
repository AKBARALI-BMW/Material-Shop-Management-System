import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../redux/inventorySlice";
import Layout from "./Layout";
import InventoryTable from "../components/InventoryTable";



const categories   = ["All", "Cement", "Bricks", "Steel", "Pipes", "Sanitary", "Tiles", "Paint", "Electrical", "Plumbing", "Wood", "Glass"];
const stockFilters = ["All", "In Stock", "Low Stock", "Out Stock"];



 function Inventory() {
  const dispatch = useDispatch();
  const { inventory, loading, error } = useSelector((state) => state.inventory);

  // ✅ always safe array
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const [search,         setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter,    setStockFilter]    = useState("All");

  // ✅ load inventory from backend on page open
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // ✅ filter
  const filtered = safeInventory.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchStock    = stockFilter    === "All" || item.status   === stockFilter;
    return matchSearch && matchCategory && matchStock;
  });

  // ✅ stats
  const inStock  = safeInventory.filter(i => i.status === "In Stock").length;
  const lowStock = safeInventory.filter(i => i.status === "Low Stock").length;
  const outStock = safeInventory.filter(i => i.status === "Out Stock").length;



   return (
    <Layout>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Inventory</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track stock levels and product availability.</p>
        </div>
      </div>



      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Products", value: safeInventory.length, color: "text-slate-800" },
          { label: "In Stock",       value: inStock,              color: "text-green-600" },
          { label: "Low Stock",      value: lowStock,             color: "text-amber-600" },
          { label: "Out of Stock",   value: outStock,             color: "text-red-600"   },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>


      {/* Alert Banner */}
      {lowStock > 0 || outStock > 0 ? (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L1.5 13h13L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Stock Alert</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {lowStock > 0 && `${lowStock} product${lowStock > 1 ? "s" : ""} running low. `}
              {outStock > 0 && `${outStock} product${outStock > 1 ? "s" : ""} out of stock.`}
              {" "}Please reorder from supplier.
            </p>
          </div>
        </div>
      ) : !loading && safeInventory.length > 0 ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm font-medium text-green-700">All products are well stocked.</p>
        </div>
      ) : null}

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
        <div className="mb-4 text-sm text-slate-500">Loading inventory...</div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-5">

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <input type="text" placeholder="Search by product name or category..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`h-8 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap flex-shrink-0
                  ${categoryFilter === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {stockFilters.map((s) => (
              <button key={s} onClick={() => setStockFilter(s)}
                className={`h-8 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap
                  ${stockFilter === s
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Inventory Table — dispatch handled inside */}
      <InventoryTable filtered={filtered} />

    </Layout>
  );
}

export default Inventory;

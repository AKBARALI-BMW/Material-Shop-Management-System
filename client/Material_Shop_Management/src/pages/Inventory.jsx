import { useState } from "react";
import Layout from "./Layout";
import InventoryTable from "../components/InventoryTable";

// ── Dummy Data (replaced by Redux + API later) ─────────────────────
const initialInventory = [
  { id: 1, name: "Cement OPC",      category: "Cement",   stock: 200, minStock: 20,  unit: "Bag",    price: 1200, status: "In Stock"  },
  { id: 2, name: "Red Bricks",      category: "Bricks",   stock: 8,   minStock: 50,  unit: "Piece",  price: 15,   status: "Low Stock" },
  { id: 3, name: "Steel Rod 12mm",  category: "Steel",    stock: 150, minStock: 10,  unit: "Bundle", price: 3500, status: "In Stock"  },
  { id: 4, name: "PVC Pipe 1inch",  category: "Pipes",    stock: 0,   minStock: 20,  unit: "Piece",  price: 450,  status: "Out Stock" },
  { id: 5, name: "Wash Basin",      category: "Sanitary", stock: 6,   minStock: 10,  unit: "Piece",  price: 4500, status: "Low Stock" },
  { id: 6, name: "Wall Tiles 12x12",category: "Tiles",    stock: 500, minStock: 100, unit: "Piece",  price: 120,  status: "In Stock"  },
  { id: 7, name: "Paint White 20L", category: "Paint",    stock: 3,   minStock: 10,  unit: "Tin",    price: 2800, status: "Low Stock" },
  { id: 8, name: "Copper Wire 2.5", category: "Electrical",stock: 80, minStock: 20,  unit: "Meter",  price: 85,   status: "In Stock"  },
];

const categories   = ["All", "Cement", "Bricks", "Steel", "Pipes", "Sanitary", "Tiles", "Paint", "Electrical", "Plumbing", "Wood", "Glass"];
const stockFilters = ["All", "In Stock", "Low Stock", "Out Stock"];

const getStatus = (stock, minStock) => {
  if (stock === 0)          return "Out Stock";
  if (stock <= minStock)    return "Low Stock";
  return "In Stock";
};

// ── Main Component ─────────────────────────────────────────────────
function Inventory() {
  const [inventory,      setInventory]      = useState(initialInventory);
  const [search,         setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter,    setStockFilter]    = useState("All");

  // ── Update stock handler passed to table ──
  const handleUpdateStock = (id, newStock) => {
    setInventory(inventory.map((item) => {
      if (item.id !== id) return item;
      const stock  = Number(newStock);
      return { ...item, stock, status: getStatus(stock, item.minStock) };
    }));
  };

  // ── Filter ──
  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const filtered = safeInventory.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchStock    = stockFilter === "All"    || item.status === stockFilter;
    return matchSearch && matchCategory && matchStock;
  });

  // ── Stats ──
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
          { label: "Total Products", value: safeInventory.length, color: "text-slate-800", bg: "" },
          { label: "In Stock",       value: inStock,              color: "text-green-600", bg: "" },
          { label: "Low Stock",      value: lowStock,             color: "text-amber-600", bg: "" },
          { label: "Out of Stock",   value: outStock,             color: "text-red-600",   bg: "" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>


      {/* Low Stock Alert Banner */}
      {lowStock > 0 || outStock > 0 ? (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 " viewBox="0 0 16 16" fill="none">
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
      ) : (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm font-medium text-green-700">All products are well stocked.</p>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-5">

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Category + Stock filter row */}
        <div className="flex flex-col sm:flex-row gap-2">

          {/* Category pills — scrollable */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`h-8 px-3 text-xs font-medium rounded-lg border transition-all whitespace-nowrap
                  ${categoryFilter === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Stock status pills */}
          <div className="flex items-center gap-1.5 ">
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

      {/* Inventory Table Component */}
      <InventoryTable
        filtered={filtered}
        onUpdateStock={handleUpdateStock}
      />

    </Layout>
  );
}

export default Inventory;
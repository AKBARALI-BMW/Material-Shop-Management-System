import { useState } from "react";
import Layout from "./Layout";
import SalesReport          from "../components/reports/SalesReport";
import ProductSalesReport   from "../components/reports/ProductSalesReport";
import CustomerPurchaseReport from "../components/reports/CustomerPurchaseReport";
import LowStockReport       from "../components/reports/LowStockReport";


const tabs = [
  {
    id:    "sales",
    label: "Sales Report",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 12l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id:    "products",
    label: "Product Sales",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M2 4l6-3 6 3v8l-6 3-6-3V4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 1v14M2 4l6 3 6-3" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id:    "customers",
    label: "Customer Purchases",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M12 7c1.1 0 2 .9 2 2s-.9 2-2 2M14 14c0-1.1-.9-2-2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id:    "lowstock",
    label: "Low Stock",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L1.5 13h13L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 6v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function Reports() {
  const [activeTab, setActiveTab] = useState("sales");

  return (
    <Layout>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-800">Reports</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          View sales, products, customers and stock reports.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-9 px-4 text-xs font-medium rounded-lg border transition-all whitespace-nowrap flex-shrink-0
              ${activeTab === tab.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
          >
            <span className={activeTab === tab.id ? "text-white" : "text-slate-400"}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "sales"     && <SalesReport />}
      {activeTab === "products"  && <ProductSalesReport />}
      {activeTab === "customers" && <CustomerPurchaseReport />}
      {activeTab === "lowstock"  && <LowStockReport />}

    </Layout>
  );
}

export default Reports;
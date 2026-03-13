import React, { useState } from 'react'

// ── tiny icon components (no extra package needed) ──────────────────────
const Icon = ({ d, size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
)

const Icons = {
  revenue:   "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  orders:    "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  pending:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  customers: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  stock:     "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  trend_up:  "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  trend_dn:  "M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6",
  alert:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  chart:     "M18 20V10M12 20V4M6 20v-6",
  best:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  eye:       "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  plus:      "M12 5v14M5 12h14",
}

// ── Mock data ────────────────────────────────────────────────────────────
const ORDERS = [
  { id: 'ORD-041', customer: 'Ali Khan',     items: 'Cement × 50 bags',  amount: 60000, status: 'Paid',    date: 'Today'     },
  { id: 'ORD-040', customer: 'Bilal Ahmed',  items: 'Steel Rods × 20',   amount: 45000, status: 'Partial', date: 'Today'     },
  { id: 'ORD-039', customer: 'Sara Malik',   items: 'Bricks × 500',      amount: 15000, status: 'Pending', date: 'Yesterday' },
  { id: 'ORD-038', customer: 'Usman Tariq',  items: 'PVC Pipes × 30',    amount:  9000, status: 'Paid',    date: 'Yesterday' },
  { id: 'ORD-037', customer: 'Hina Nawaz',   items: 'Sand × 10 bags',    amount:  5000, status: 'Pending', date: '12 Mar'    },
  { id: 'ORD-036', customer: 'Kamran Butt',  items: 'Gravel × 5 tons',   amount: 22000, status: 'Partial', date: '11 Mar'    },
]

const LOW_STOCK = [
  { name: 'Cement (OPC)',  qty: 8,  unit: 'bags',   max: 20 },
  { name: 'Steel Rods',   qty: 5,  unit: 'pcs',    max: 15 },
  { name: 'Coarse Sand',  qty: 3,  unit: 'bags',   max: 10 },
]

const MONTHLY = [42, 68, 55, 80, 73, 95, 88, 110, 102, 130, 118, 142]
const MONTHS  = ['J','F','M','A','M','J','J','A','S','O','N','D']

// ── helpers ──────────────────────────────────────────────────────────────
const fmt = (n) => 'Rs ' + n.toLocaleString('en-PK')

const StatusPill = ({ s }) => {
  const map = {
    Paid:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    Partial: 'bg-amber-100  text-amber-700  border border-amber-200',
    Pending: 'bg-rose-100   text-rose-600   border border-rose-200',
  }
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide ${map[s]}`}>
      {s}
    </span>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, iconPath, accent, trend, up, delay }) => (
  <div
    className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm
               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    style={{ animationDelay: delay }}
  >
    {/* subtle accent blob */}
    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${accent}`} />

    <div className="flex items-start justify-between mb-4 relative">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md ${accent}`}>
        <Icon d={iconPath} size={18} />
      </div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
          up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
        }`}>
          <Icon d={up ? Icons.trend_up : Icons.trend_dn} size={11} />
          {trend}
        </span>
      )}
    </div>

    <p className="text-2xl font-black text-slate-800 leading-none mb-1 tracking-tight">{value}</p>
    <p className="text-xs font-semibold text-slate-600 mb-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400">{sub}</p>}
  </div>
)

// ── Mini Bar Chart ───────────────────────────────────────────────────────
const MiniChart = () => {
  const max = Math.max(...MONTHLY)
  return (
    <div className="flex items-end gap-1 h-20">
      {MONTHLY.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-t-sm transition-all duration-500 ${
              i === 11 ? 'bg-indigo-500' : 'bg-indigo-200'
            }`}
            style={{ height: `${(v / max) * 100}%` }}
          />
          <span className="text-[9px] text-slate-400">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────
const Dashboard = () => {
  const [tab, setTab] = useState('all')

  const filtered = tab === 'all'
    ? ORDERS
    : ORDERS.filter(o => o.status.toLowerCase() === tab)

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 sm:px-6 py-6 space-y-5"
         style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-slate-900 rounded-2xl px-6 py-5
                      flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* grid texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
        {/* glow blob */}
        <div className="absolute -top-10 -left-10 w-56 h-56 bg-indigo-600 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 right-20 w-40 h-40 bg-violet-500 rounded-full opacity-20 blur-3xl" />

        <div className="relative">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Construction Material Shop
          </p>
          <h1 className="text-white font-black text-2xl sm:text-3xl leading-tight tracking-tight">
            Welcome back, Admin 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-PK',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          </p>
        </div>

        <button className="relative self-start sm:self-auto flex items-center gap-2
                           bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold
                           px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-900/30">
          <Icon d={Icons.plus} size={15} />
          New Sale
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Revenue"      value="Rs 4.2L"  sub="This month"          iconPath={Icons.revenue}   accent="bg-indigo-500" trend="+12%" up delay="0ms"   />
        <StatCard label="Total Orders"       value="134"      sub="41 this week"         iconPath={Icons.orders}    accent="bg-violet-500" trend="+8%"  up delay="60ms"  />
        <StatCard label="Pending Payments"   value="Rs 78.5K" sub="From 19 customers"    iconPath={Icons.pending}   accent="bg-amber-500"  trend="-3%"     delay="120ms" />
        <StatCard label="Active Customers"   value="87"       sub="6 new this month"     iconPath={Icons.customers} accent="bg-emerald-500" trend="+6" up delay="180ms" />
      </div>

      {/* ── Main two-column row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Orders Table — 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* table header */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-slate-800 font-black text-base tracking-tight">Recent Orders</h2>
              <p className="text-slate-400 text-xs mt-0.5">Latest transactions</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['all','paid','partial','pending'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    tab === t
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70">
                  {['Order ID','Customer','Items','Amount','Status'].map(h => (
                    <th key={h} className="text-left text-[10px] font-black text-slate-400
                                          uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">No orders</td></tr>
                ) : filtered.map(o => (
                  <tr key={o.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-indigo-600 font-bold text-xs">#{o.id}</span>
                      <p className="text-slate-400 text-[10px]">{o.date}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 text-xs font-semibold">{o.customer}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs hidden md:table-cell">{o.items}</td>
                    <td className="px-5 py-3.5 text-slate-800 font-bold text-xs">{fmt(o.amount)}</td>
                    <td className="px-5 py-3.5"><StatusPill s={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400">{filtered.length} records</span>
            <button className="text-indigo-600 text-xs font-bold hover:text-indigo-400 transition flex items-center gap-1">
              <Icon d={Icons.eye} size={13} /> View all orders
            </button>
          </div>
        </div>

        {/* Right column — stock + best seller */}
        <div className="flex flex-col gap-4">

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
            <div className="px-5 pt-5 pb-3 border-b border-slate-50 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <Icon d={Icons.alert} size={15} className="text-rose-500" />
              </div>
              <div>
                <h2 className="text-slate-800 font-black text-sm tracking-tight">Low Stock Alert</h2>
                <p className="text-slate-400 text-[10px]">Restock required</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {LOW_STOCK.map(item => {
                const pct = Math.round((item.qty / item.max) * 100)
                return (
                  <div key={item.name} className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/60">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-slate-700">{item.name}</p>
                      <span className="text-[11px] font-black text-rose-500">
                        {item.qty} {item.unit}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-rose-200 overflow-hidden">
                      <div className="h-full rounded-full bg-rose-500 transition-all"
                           style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Min: {item.max} {item.unit}</p>
                  </div>
                )
              })}
            </div>

            <div className="px-4 pb-4">
              <button className="w-full bg-rose-500 hover:bg-rose-400 text-white text-xs
                                font-bold py-2.5 rounded-xl transition-colors shadow-sm shadow-rose-200">
                Order from Supplier
              </button>
            </div>
          </div>

          {/* Best Seller card */}
          <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-indigo-600 rounded-full opacity-20 blur-2xl" />
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center mb-3">
              <Icon d={Icons.best} size={15} className="text-amber-400" />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Best Seller</p>
            <p className="text-white font-black text-lg leading-tight">Cement (OPC)</p>
            <p className="text-indigo-300 text-xs font-semibold mt-1">320 bags this month</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[78%] rounded-full bg-indigo-400" />
              </div>
              <span className="text-slate-400 text-xs font-bold">78%</span>
            </div>
            <p className="text-slate-600 text-[10px] mt-1">of total units sold</p>
          </div>
        </div>
      </div>

      {/* ── Bottom row: Monthly chart + quick stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Monthly Revenue Chart */}
        <div className="sm:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-slate-800 font-black text-base tracking-tight">Monthly Revenue</h2>
              <p className="text-slate-400 text-xs">2025 overview</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
              <Icon d={Icons.trend_up} size={12} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-bold">+22% YoY</span>
            </div>
          </div>
          <MiniChart />
        </div>

        {/* Quick stats column */}
        <div className="flex flex-col gap-3">
          {[
            { label: 'Collected Today',  value: 'Rs 32,000', sub: '6 customers',  icon: Icons.revenue, bg: 'bg-indigo-50',  text: 'text-indigo-600'  },
            { label: 'Total Products',   value: '24 Items',   sub: '3 low stock',  icon: Icons.stock,   bg: 'bg-violet-50',  text: 'text-violet-600'  },
            { label: 'Sales This Week',  value: '41 Orders',  sub: 'Rs 1.8L total',icon: Icons.chart,   bg: 'bg-emerald-50', text: 'text-emerald-600' },
          ].map(q => (
            <div key={q.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4
                         flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${q.bg} flex items-center justify-center shrink-0`}>
                <Icon d={q.icon} size={17} className={q.text} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">{q.label}</p>
                <p className="text-slate-800 font-black text-sm leading-tight">{q.value}</p>
                <p className={`text-[11px] font-semibold ${q.text}`}>{q.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
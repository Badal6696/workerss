import { useState } from "react";
import { Shield, Users, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { PLATFORM_STATS, BOOKINGS, CUSTOMERS } from "@/data/mockData";
import { WORKERS, SERVICE_CATEGORIES } from "@/data/workers";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["#C9A84C","#10B981","#6366F1","#F59E0B","#EF4444","#A855F7","#06B6D4","#84CC16"];

export default function AdminPage() {
  const [tab, setTab] = useState<"overview" | "workers" | "bookings" | "queue">("overview");

  const catData = SERVICE_CATEGORIES.map(cat => ({
    name: cat.name.slice(0, 12),
    count: WORKERS.filter(w => w.categoryId === cat.id).length,
  })).sort((a, b) => b.count - a.count).slice(0, 12);

  const cityData = [
    { city: "Delhi", workers: 162 }, { city: "Mumbai", workers: 148 }, { city: "Bengaluru", workers: 135 },
    { city: "Hyderabad", workers: 98 }, { city: "Chennai", workers: 87 }, { city: "Pune", workers: 82 },
    { city: "Kolkata", workers: 75 }, { city: "Jaipur", workers: 68 }, { city: "Lucknow", workers: 62 },
    { city: "Ahmedabad", workers: 58 }, { city: "Indore", workers: 54 }, { city: "Bhopal", workers: 51 },
  ];

  const verQueue = WORKERS.filter(w => !w.badges.policeVerified).slice(0, 8);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container">
        <div className="py-6 flex items-center gap-3">
          <Shield size={28} className="text-gold-500" />
          <div>
            <h1 className="font-display font-bold text-3xl gold-text">Admin Overview</h1>
            <p className="text-gold-700 text-sm">Platform analytics and management</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6 border-b border-white/5">
          {[{ id: "overview", label: "Overview" }, { id: "workers", label: "Workers" }, { id: "bookings", label: "Bookings" }, { id: "queue", label: "Verification Queue", count: verQueue.length }].map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id as typeof tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
                ${tab === tb.id ? "border-gold-600 text-gold-400" : "border-transparent text-gold-700 hover:text-gold-500"}`}>
              {tb.label}{"count" in tb && <span className="ml-1.5 text-xs bg-crimson-600/20 text-crimson-400 border border-crimson-500/20 rounded-full px-1.5">{tb.count}</span>}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Workers", value: PLATFORM_STATS.totalWorkers.toLocaleString("en-IN"), icon: "👷", change: "+124 this month" },
                { label: "Verified", value: PLATFORM_STATS.verifiedWorkers.toLocaleString("en-IN"), icon: "✅", change: "91.1% of total" },
                { label: "Total Bookings", value: PLATFORM_STATS.totalBookings.toLocaleString("en-IN"), icon: "📅", change: "+2,341 this month" },
                { label: "Revenue", value: formatCurrency(PLATFORM_STATS.totalRevenue), icon: "💰", change: "+23% YoY" },
              ].map(s => (
                <div key={s.label} className="glass-card p-5">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-display font-bold text-xl gold-text">{s.value}</div>
                  <div className="text-gold-700 text-xs mt-0.5">{s.label}</div>
                  <div className="text-emerald-400 text-xs mt-1">{s.change}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Workers by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={catData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis type="number" stroke="#C9A84C44" tick={{ fill: "#C9A84C88", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" stroke="#C9A84C44" tick={{ fill: "#C9A84C88", fontSize: 10 }} width={80} />
                    <Tooltip contentStyle={{ background: "#141720", border: "1px solid #C9A84C22", borderRadius: 12 }} labelStyle={{ color: "#C9A84C" }} />
                    <Bar dataKey="count" fill="#C9A84C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Workers by City</h3>
                <div className="space-y-2">
                  {cityData.map((city, i) => (
                    <div key={city.city} className="flex items-center gap-3">
                      <span className="text-gold-700 text-xs w-5 text-right">{i + 1}</span>
                      <span className="text-gold-500 text-sm w-20">{city.city}</span>
                      <div className="flex-1 h-2 bg-ink-600 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(city.workers / 162) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      </div>
                      <span className="text-gold-600 text-xs w-8 text-right">{city.workers}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Status Pie */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Booking Status Distribution</h3>
              <div className="flex items-center gap-8 flex-wrap">
                <PieChart width={180} height={180}>
                  <Pie data={[
                    { name: "Completed", value: 43190 }, { name: "In Progress", value: 2340 },
                    { name: "Pending", value: 1800 }, { name: "Cancelled", value: 990 },
                  ]} cx={85} cy={85} innerRadius={50} outerRadius={80} dataKey="value">
                    {CHART_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2">
                  {[["Completed","43,190","#C9A84C"],["In Progress","2,340","#10B981"],["Pending","1,800","#F59E0B"],["Cancelled","990","#EF4444"]].map(([label, val, color]) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <span className="text-gold-600">{label}</span>
                      <span className="text-gold-400 font-medium ml-auto">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "workers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gold-600 text-sm">{WORKERS.length} total workers • {WORKERS.filter(w => w.availability === "available").length} available now</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Worker","Category","City","Rating","Status","Verified","Actions"].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-gold-700 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WORKERS.slice(0, 20).map(w => (
                    <tr key={w.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-3"><div className="flex items-center gap-2">
                        <img src={w.avatar} alt={w.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-gold-400">{w.name}</span></div></td>
                      <td className="py-3 px-3 text-gold-600">{w.category}</td>
                      <td className="py-3 px-3 text-gold-600">{w.city}</td>
                      <td className="py-3 px-3 text-gold-500">⭐ {w.rating}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${w.availability === "available" ? "text-emerald-400 bg-emerald-500/10" : "text-gold-700 bg-ink-600"}`}>
                          {w.availability}
                        </span>
                      </td>
                      <td className="py-3 px-3">{w.badges.idVerified ? <CheckCircle size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-gold-700" />}</td>
                      <td className="py-3 px-3"><button className="text-xs text-gold-600 hover:text-gold-400 transition-colors">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Booking ID","Service","Date","Amount","Status","Payment"].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-gold-700 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BOOKINGS.slice(0, 25).map(b => (
                  <tr key={b.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                    <td className="py-3 px-3 text-gold-500 font-mono text-xs">{b.id}</td>
                    <td className="py-3 px-3 text-gold-400">{b.service}</td>
                    <td className="py-3 px-3 text-gold-600">{formatDate(b.date)}</td>
                    <td className="py-3 px-3 text-gold-400 font-medium">{formatCurrency(b.price)}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        ${b.status === "completed" ? "text-emerald-400 bg-emerald-500/10" : b.status === "cancelled" ? "text-crimson-400 bg-crimson-500/10" : "text-yellow-400 bg-yellow-500/10"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs ${b.paymentStatus === "paid" ? "text-emerald-400" : "text-yellow-400"}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "queue" && (
          <div className="space-y-4">
            <div className="glass-card p-4 flex items-center gap-3 border-l-4 border-l-yellow-500">
              <AlertCircle size={18} className="text-yellow-400" />
              <p className="text-gold-500 text-sm">{verQueue.length} workers pending police verification</p>
            </div>
            {verQueue.map(w => (
              <div key={w.id} className="glass-card p-4 flex gap-4 flex-wrap items-center">
                <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-gold-300">{w.name}</div>
                  <div className="text-gold-700 text-xs">{w.category} • {w.city} • {w.experience} yrs exp</div>
                  <div className="flex gap-1 mt-1">
                    {w.badges.idVerified && <span className="badge-verified text-xs">ID ✓</span>}
                    {w.badges.skillCertified && <span className="badge-gold text-xs">Skill ✓</span>}
                    <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">Police Pending</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-emerald py-1.5 px-3 text-xs">Approve</button>
                  <button className="py-1.5 px-3 text-xs border border-crimson-500/30 text-crimson-400 rounded-xl hover:bg-crimson-500/5 transition-all">Flag</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

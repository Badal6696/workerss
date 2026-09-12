import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, CreditCard, Heart, Settings, User } from "lucide-react";
import { useAuth, useLang, useToast } from "@/contexts/AppContext";
import { BOOKINGS, CUSTOMERS } from "@/data/mockData";
import { WORKERS } from "@/data/workers";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SPEND_DATA = [
  { month: "Aug", spend: 2400 }, { month: "Sep", spend: 1800 }, { month: "Oct", spend: 3200 },
  { month: "Nov", spend: 2100 }, { month: "Dec", spend: 4500 }, { month: "Jan", spend: 2900 },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  accepted: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  in_progress: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  completed: "text-gold-500 bg-gold-700/10 border-gold-700/20",
  cancelled: "text-crimson-400 bg-crimson-500/10 border-crimson-500/20",
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const { toast } = useToast();
  const [tab, setTab] = useState<"upcoming" | "past" | "saved" | "payments" | "settings">("upcoming");

  const myBookings = BOOKINGS.slice(0, 20);
  const upcoming = myBookings.filter(b => ["pending","accepted","in_progress"].includes(b.status));
  const past = myBookings.filter(b => ["completed","cancelled"].includes(b.status));
  const savedWorkers = WORKERS.slice(0, 6);
  const totalSpent = past.filter(b => b.status === "completed").reduce((s, b) => s + b.price, 0);

  const TABS = [
    { id: "upcoming", label: t.upcomingBookings, count: upcoming.length },
    { id: "past", label: t.pastBookings, count: past.length },
    { id: "saved", label: t.savedWorkers, count: savedWorkers.length },
    { id: "payments", label: t.paymentHistory },
    { id: "settings", label: "Profile" },
  ] as const;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container">
        {/* Header */}
        <div className="py-6 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img src={user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-gold-700/30 shadow-gold" />
            <div>
              <h1 className="font-display font-bold text-2xl text-gold-400">Welcome, {user?.name?.split(" ")[0]}!</h1>
              <p className="text-gold-700 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Bookings", value: myBookings.length },
              { label: "Spent", value: formatCurrency(totalSpent) },
              { label: "Saved", value: savedWorkers.length },
            ].map(stat => (
              <div key={stat.label} className="glass-card px-4 py-3 text-center">
                <div className="font-bold text-gold-400">{stat.value}</div>
                <div className="text-gold-700 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6 border-b border-white/5">
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id as typeof tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
                ${tab === tb.id ? "border-gold-600 text-gold-400" : "border-transparent text-gold-700 hover:text-gold-500"}`}>
              {tb.label}{"count" in tb && tb.count !== undefined && <span className="ml-1.5 text-xs bg-ink-600 text-gold-600 rounded-full px-1.5 py-0.5">{tb.count}</span>}
            </button>
          ))}
        </div>

        {/* Upcoming Bookings */}
        {tab === "upcoming" && (
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="font-display text-xl text-gold-400 mb-2">No upcoming bookings</h3>
                <p className="text-gold-700 mb-6">Book a professional to get started</p>
                <Link to="/browse" className="btn-gold px-8 py-3">Browse Professionals</Link>
              </div>
            ) : upcoming.map(b => {
              const w = WORKERS.find(w => w.id === b.workerId);
              return (
                <div key={b.id} className="glass-card p-5 flex gap-4 flex-wrap">
                  {w && <img src={w.avatar} alt={w.name} className="w-14 h-14 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="font-semibold text-gold-300">{b.service}</h3>
                        <p className="text-gold-700 text-sm">{w?.name} • {w?.category}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>
                        {b.status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gold-700 flex-wrap">
                      <span className="flex items-center gap-1"><Clock size={11} />{b.date} at {b.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{b.address.split(",")[0]}</span>
                      <span className="font-semibold text-gold-500">{formatCurrency(b.price)}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/worker/${b.workerId}`} className="btn-outline-gold py-1.5 px-3 text-xs">View Worker</Link>
                      <button onClick={() => toast("info", "Tracking feature active")} className="btn-emerald py-1.5 px-3 text-xs">Track</button>
                      <button onClick={() => toast("info", "Cancellation initiated")} className="text-xs text-crimson-400 hover:text-crimson-300 px-3 py-1.5 border border-crimson-500/20 rounded-xl hover:bg-crimson-500/5 transition-all">Cancel</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Past Bookings */}
        {tab === "past" && (
          <div className="space-y-4">
            {past.map(b => {
              const w = WORKERS.find(w => w.id === b.workerId);
              return (
                <div key={b.id} className="glass-card p-5 flex gap-4 flex-wrap">
                  {w && <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-xl object-cover opacity-80" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="font-medium text-gold-400">{b.service}</h3>
                        <p className="text-gold-700 text-xs">{w?.name} • {formatDate(b.date)}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gold-400">{formatCurrency(b.price)}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                      </div>
                    </div>
                    {b.status === "completed" && (
                      <div className="flex gap-2 mt-2">
                        {b.rating ? (
                          <div className="flex items-center gap-1 text-xs text-gold-600">
                            <Star size={11} fill="#C9A84C" className="text-gold-500" /> You rated {b.rating}/5
                          </div>
                        ) : (
                          <button onClick={() => toast("info", "Review submitted — thank you!")} className="text-xs btn-outline-gold py-1 px-3">Write Review</button>
                        )}
                        <button onClick={() => toast("success", "Re-booking initiated")} className="text-xs btn-gold py-1 px-3">Re-book</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Saved Workers */}
        {tab === "saved" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedWorkers.map(w => (
              <div key={w.id} className="glass-card p-4 flex gap-3">
                <img src={w.avatar} alt={w.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gold-300 truncate">{w.name}</div>
                  <div className="text-gold-700 text-xs">{w.category}</div>
                  <div className="flex gap-3 mt-2">
                    <Link to={`/book/${w.id}`} className="btn-gold py-1 px-3 text-xs">Book</Link>
                    <button onClick={() => toast("info", "Removed from saved")} className="text-xs text-crimson-400 hover:text-crimson-300">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payments */}
        {tab === "payments" && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Spending Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={SPEND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="month" stroke="#C9A84C88" tick={{ fill: "#C9A84C88", fontSize: 12 }} />
                  <YAxis stroke="#C9A84C88" tick={{ fill: "#C9A84C88", fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#141720", border: "1px solid #C9A84C22", borderRadius: 12 }} labelStyle={{ color: "#C9A84C" }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Spent"]} />
                  <Bar dataKey="spend" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {past.filter(b => b.status === "completed").slice(0, 8).map(b => (
                <div key={b.id} className="glass-card p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-gold-400 font-medium text-sm">{b.service}</div>
                    <div className="text-gold-700 text-xs">{formatDate(b.date)} • {b.paymentMethod}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gold-400">{formatCurrency(b.price)}</div>
                    <span className="text-xs text-emerald-400">{b.paymentStatus === "paid" ? "✓ Paid" : "Pending"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="max-w-lg space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg text-gold-400">Profile Settings</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-700/30" />
                <button className="btn-outline-gold py-2 px-4 text-sm">Change Photo</button>
              </div>
              {["Full Name","Email","Phone","City"].map(field => (
                <div key={field}>
                  <label className="text-xs text-gold-600 mb-1 block">{field}</label>
                  <input className="input-dark w-full" defaultValue={field === "Full Name" ? user?.name : field === "Email" ? user?.email : ""} placeholder={field} />
                </div>
              ))}
              <button onClick={() => toast("success", "Profile updated")} className="btn-gold w-full py-3">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

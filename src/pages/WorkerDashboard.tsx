import { useState } from "react";
import { Star, TrendingUp, Clock, CheckCircle, XCircle, ToggleLeft, ToggleRight, Video, Bell } from "lucide-react";
import { useAuth, useLang, useToast } from "@/contexts/AppContext";
import { BOOKINGS } from "@/data/mockData";
import { WORKERS } from "@/data/workers";
import { EARNINGS_DATA } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "requests" | "schedule" | "earnings" | "media" | "profile">("overview");
  const [available, setAvailable] = useState(true);

  const myWorker = WORKERS[0]; // demo worker
  const requests = BOOKINGS.filter(b => b.status === "pending").slice(0, 8);
  const todayJobs = BOOKINGS.filter(b => b.status === "accepted" || b.status === "in_progress").slice(0, 4);
  const completed = BOOKINGS.filter(b => b.status === "completed").slice(0, 6);
  const monthEarnings = EARNINGS_DATA[EARNINGS_DATA.length - 1].earnings;
  const totalEarnings = EARNINGS_DATA.reduce((s, d) => s + d.earnings, 0);

  const completeness = {
    photo: true, bio: true, skills: true, id: true, pricing: true, gallery: myWorker.gallery.length > 0, video: false,
  };
  const compScore = Math.round((Object.values(completeness).filter(Boolean).length / Object.keys(completeness).length) * 100);

  const TABS = [
    { id: "overview", label: "Overview" }, { id: "requests", label: t.incomingBookings, count: requests.length },
    { id: "schedule", label: t.todaySchedule }, { id: "earnings", label: t.earnings },
    { id: "media", label: "Media Manager" }, { id: "profile", label: "My Profile" },
  ] as const;

  const tooltipStyle = { contentStyle: { background: "#141720", border: "1px solid #C9A84C22", borderRadius: 12 }, labelStyle: { color: "#C9A84C" } };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container">
        {/* Header */}
        <div className="py-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={myWorker.avatar} alt={myWorker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-gold-700/30 shadow-gold" />
            <div>
              <h1 className="font-display font-bold text-2xl text-gold-400">{myWorker.name}</h1>
              <p className="text-gold-600 text-sm">{myWorker.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star size={13} fill="#C9A84C" className="text-gold-500" />
                <span className="text-gold-400 font-semibold text-sm">{myWorker.rating}</span>
                <span className="text-gold-700 text-xs">({myWorker.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Incoming Bookings Notification */}
            {requests.length > 0 && (
              <button onClick={() => setTab("requests")}
                className="relative flex items-center gap-2 glass-card px-3 py-2 hover:border-crimson-500/30 transition-all">
                <Bell size={16} className="text-crimson-400 animate-pulse" />
                <span className="text-xs text-crimson-400 font-medium">{requests.length} {t.newBookingRequest}</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-600 rounded-full text-white text-xs flex items-center justify-center">{requests.length}</span>
              </button>
            )}
            {/* Video Editor Button */}
            <button onClick={() => navigate("/video-editor")}
              className="flex items-center gap-2 glass-card px-3 py-2 hover:border-gold-700/40 transition-all">
              <Video size={16} className="text-gold-500" />
              <span className="text-xs text-gold-500 font-medium hidden sm:inline">{t.videoEdit}</span>
            </button>
            <button onClick={() => { setAvailable(!available); toast("info", available ? "You are now Offline" : "You are now Available"); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${available ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-ink-500 text-gold-700"}`}>
              {available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {available ? t.available : t.offline}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-6 border-b border-white/5">
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id as typeof tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
                ${tab === tb.id ? "border-gold-600 text-gold-400" : "border-transparent text-gold-700 hover:text-gold-500"}`}>
              {tb.label}{"count" in tb && tb.count !== undefined && <span className="ml-1.5 text-xs bg-crimson-600/20 text-crimson-400 border border-crimson-500/20 rounded-full px-1.5 py-0.5">{tb.count}</span>}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "This Month", value: formatCurrency(monthEarnings), icon: "💰", trend: "+18%" },
                { label: "Total Earned", value: formatCurrency(totalEarnings), icon: "📈", trend: "" },
                { label: "Jobs Done", value: myWorker.jobsCompleted.toLocaleString(), icon: "✅", trend: "" },
                { label: "Rating", value: myWorker.rating.toString() + "★", icon: "⭐", trend: "" },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-5">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="font-display font-bold text-xl text-gold-400">{stat.value}</div>
                  <div className="text-gold-700 text-xs">{stat.label}</div>
                  {stat.trend && <div className="text-emerald-400 text-xs mt-1 font-medium">{stat.trend} this month</div>}
                </div>
              ))}
            </div>

            {/* Profile Completeness */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-lg text-gold-400">Profile Completeness</h3>
                <span className="text-2xl font-bold gold-text">{compScore}%</span>
              </div>
              <div className="h-2 bg-ink-600 rounded-full mb-4">
                <div className="h-full bg-gold-gradient rounded-full transition-all" style={{ width: `${compScore}%` }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(completeness).map(([key, done]) => (
                  <div key={key} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${done ? "text-emerald-400" : "text-gold-700"}`}>
                    {done ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {key.replace(/([A-Z])/g, " $1").replace(/^\w/, c => c.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Earnings Chart */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Earnings (Last 12 Months)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={EARNINGS_DATA}>
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="month" stroke="#C9A84C44" tick={{ fill: "#C9A84C88", fontSize: 11 }} />
                  <YAxis stroke="#C9A84C44" tick={{ fill: "#C9A84C88", fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Earnings"]} />
                  <Area type="monotone" dataKey="earnings" stroke="#C9A84C" fill="url(#earnGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Job Requests */}
        {tab === "requests" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gold-600">No pending job requests right now.</p>
              </div>
            ) : requests.map(b => {
              const customer = { name: "Ananya Sharma", avatar: "https://randomuser.me/api/portraits/women/44.jpg" };
              return (
                <div key={b.id} className="glass-card p-5">
                  <div className="flex gap-4 flex-wrap">
                    <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-semibold text-gold-300">{b.service}</h3>
                          <p className="text-gold-700 text-sm">by {customer.name}</p>
                        </div>
                        <div className="text-gold-400 font-bold">{formatCurrency(b.price)}</div>
                      </div>
                      <div className="flex gap-4 text-xs text-gold-700 mt-1 flex-wrap">
                        <span>📅 {b.date} at {b.time}</span>
                        <span>📍 {b.address.split(",")[0]}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => toast("success", "Job accepted!")} className="btn-emerald py-1.5 px-4 text-sm flex items-center gap-1.5"><CheckCircle size={14} /> Accept</button>
                        <button onClick={() => toast("info", "Job declined")} className="py-1.5 px-4 text-sm border border-crimson-500/30 text-crimson-400 rounded-xl hover:bg-crimson-500/5 transition-all flex items-center gap-1.5"><XCircle size={14} /> Decline</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Today's Schedule */}
        {tab === "schedule" && (
          <div className="space-y-4">
            <div className="glass-card p-4 flex items-center gap-3">
              <Clock size={18} className="text-gold-500" />
              <span className="text-gold-400 font-medium">Today — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
            </div>
            {todayJobs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-gold-600">No jobs scheduled today. Enjoy your day!</p>
              </div>
            ) : todayJobs.map((b, i) => (
              <div key={b.id} className="glass-card p-5 flex gap-4 flex-wrap">
                <div className="flex flex-col items-center gap-1 w-14 flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-gold-600 border-2 border-ink-900" />
                  {i < todayJobs.length - 1 && <div className="w-0.5 h-8 bg-ink-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gold-300">{b.service}</div>
                  <div className="text-gold-700 text-sm">{b.time} • {b.address.split(",")[0]}</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => toast("success", "Navigation opened")} className="btn-gold py-1 px-3 text-xs">Navigate</button>
                    <button onClick={() => toast("success", "Status updated")} className="btn-outline-gold py-1 px-3 text-xs">Update Status</button>
                  </div>
                </div>
                <div className="text-gold-400 font-bold">{formatCurrency(b.price)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings */}
        {tab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "This Month", value: formatCurrency(monthEarnings) },
                { label: "Total Earned", value: formatCurrency(totalEarnings) },
                { label: "Avg per Job", value: formatCurrency(Math.round(monthEarnings / EARNINGS_DATA[EARNINGS_DATA.length - 1].jobs)) },
              ].map(s => (
                <div key={s.label} className="glass-card p-5 text-center">
                  <div className="font-display font-bold text-2xl gold-text mb-1">{s.value}</div>
                  <div className="text-gold-700 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Monthly Jobs Completed</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={EARNINGS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="month" stroke="#C9A84C44" tick={{ fill: "#C9A84C88", fontSize: 12 }} />
                  <YAxis stroke="#C9A84C44" tick={{ fill: "#C9A84C88", fontSize: 12 }} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [v, "Jobs"]} />
                  <Bar dataKey="jobs" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Recent Payouts</h3>
              <div className="space-y-3">
                {completed.map(b => (
                  <div key={b.id} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div><div className="text-gold-400 text-sm font-medium">{b.service}</div>
                      <div className="text-gold-700 text-xs">{formatDate(b.date)}</div></div>
                    <div className="text-emerald-400 font-bold">+{formatCurrency(Math.round(b.price * 0.85))}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Manager */}
        {tab === "media" && (
          <div className="space-y-6 max-w-2xl">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-4">Work Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {myWorker.gallery.map((img, i) => (
                  <div key={i} className="relative group aspect-video rounded-xl overflow-hidden">
                    <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => toast("info", "Photo removed")}
                      className="absolute top-1 right-1 w-6 h-6 bg-crimson-600/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                  </div>
                ))}
              </div>
              <FileUpload accept="image/*" multiple label="Add Work Photos" hint="JPG, PNG • max 5MB per photo • up to 20 photos" maxSizeMB={5} />
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg text-gold-400 mb-2">Intro Video</h3>
              <p className="text-gold-700 text-sm mb-4">Add a short 60-90 second video introducing yourself and your work. Videos increase bookings by 40%.</p>
              <FileUpload accept="video/*" multiple={false} label="Upload Intro Video (Optional)" hint="MP4, MOV • max 100MB • 30 to 120 seconds" maxSizeMB={100} />
            </div>
            {/* Video Editor Section */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-gold-400">{t.videoEditTitle}</h3>
                  <p className="text-gold-700 text-sm">{t.videoEditDesc}</p>
                </div>
                <button onClick={() => navigate("/video-editor")} className="btn-gold py-2 px-4 text-sm flex items-center gap-2">
                  <Video size={14} /> Open Editor
                </button>
              </div>
              <div className="bg-ink-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gold-700/10 flex items-center justify-center flex-shrink-0">
                  <Video size={24} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-gold-400 font-medium text-sm">Showcase Your Work</p>
                  <p className="text-gold-700 text-xs">Upload, trim, and add filters to your work videos. Let customers see your skills in action.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile */}
        {tab === "profile" && (
          <div className="max-w-lg space-y-5">
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg text-gold-400">Edit Profile</h3>
              {["Full Name","Phone","Bio","Hourly Rate (₹)","Visit Charge (₹)","City"].map(field => (
                <div key={field}>
                  <label className="text-xs text-gold-600 mb-1 block">{field}</label>
                  <input className="input-dark w-full" defaultValue={
                    field === "Full Name" ? myWorker.name : field === "Hourly Rate (₹)" ? String(myWorker.hourlyRate) :
                    field === "Visit Charge (₹)" ? String(myWorker.visitCharge) : field === "City" ? myWorker.city : ""
                  } placeholder={field} />
                </div>
              ))}
              <button onClick={() => toast("success", "Profile updated successfully")} className="btn-gold w-full py-3">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Star, Clock, Zap } from "lucide-react";
import { WORKERS, SERVICE_CATEGORIES } from "@/data/workers";
import { useLang } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";

const USER_LAT = 28.6139, USER_LNG = 77.2090;

export default function NearMePage() {
  const { t } = useLang();
  const [radius, setRadius] = useState(10);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const nearby = useMemo(() => {
    let list = WORKERS.filter(w => w.distance <= radius);
    if (category) list = list.filter(w => w.categoryId === category);
    return list.sort((a, b) => a.distance - b.distance).slice(0, 40);
  }, [radius, category]);

  const selectedWorker = nearby.find(w => w.id === selected);

  // Simple SVG-based map visualization
  const mapW = 600, mapH = 400;
  const toLat = (lat: number) => ((USER_LAT + 0.3 - lat) / 0.6) * mapH;
  const toLng = (lng: number) => ((lng - USER_LNG + 0.3) / 0.6) * mapW;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container">
        <div className="py-6">
          <h1 className="font-display font-bold text-3xl gold-text mb-1">{t.nearMe}</h1>
          <p className="text-gold-700">Skilled professionals near your location in Delhi NCR</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center gap-3 glass-card px-4 py-3">
            <Navigation size={16} className="text-gold-500" />
            <span className="text-gold-500 text-sm">Delhi NCR (Mock Location)</span>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-48">
            <span className="text-gold-600 text-sm whitespace-nowrap">Radius: <strong className="text-gold-400">{radius} km</strong></span>
            <input type="range" min={1} max={50} value={radius} onChange={e => setRadius(+e.target.value)} className="flex-1 accent-yellow-500" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-dark text-sm">
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-ink-800">{c.name}</option>)}
          </select>
          <div className="text-gold-700 text-sm">{nearby.length} found</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map Panel */}
          <div className="lg:col-span-3">
            <div className="glass-card overflow-hidden relative">
              <div className="bg-ink-800 p-2 flex items-center gap-2 border-b border-white/5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-gold-600">Live Map — {nearby.length} professionals in range</span>
              </div>
              <div className="relative overflow-hidden" style={{ height: "420px" }}>
                {/* Stylized map background */}
                <svg width="100%" height="100%" viewBox={`0 0 ${mapW} ${mapH}`} className="absolute inset-0">
                  <defs>
                    <radialGradient id="mapGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1A1D2E" />
                      <stop offset="100%" stopColor="#0D0F14" />
                    </radialGradient>
                    <radialGradient id="radiusGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width={mapW} height={mapH} fill="url(#mapGrad)" />
                  {/* Grid lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i}>
                      <line x1={i * 60} y1={0} x2={i * 60} y2={mapH} stroke="#ffffff08" strokeWidth={1} />
                      <line x1={0} y1={i * 40} x2={mapW} y2={i * 40} stroke="#ffffff08" strokeWidth={1} />
                    </g>
                  ))}
                  {/* Radius circle */}
                  <circle cx={mapW / 2} cy={mapH / 2} r={radius * 10} fill="url(#radiusGrad)" stroke="#C9A84C22" strokeWidth={1} strokeDasharray="4 4" />
                  {/* Worker dots */}
                  {nearby.map(w => {
                    const x = toLng(w.lng); const y = toLat(w.lat);
                    const isSelected = w.id === selected;
                    return (
                      <g key={w.id} onClick={() => setSelected(w.id === selected ? null : w.id)} style={{ cursor: "pointer" }}>
                        <circle cx={x} cy={y} r={isSelected ? 10 : 7}
                          fill={w.availability === "available" ? "#10B981" : w.availability === "busy" ? "#F59E0B" : "#6B7280"}
                          opacity={isSelected ? 1 : 0.8}
                          stroke={isSelected ? "#C9A84C" : "transparent"} strokeWidth={2} />
                        {isSelected && <circle cx={x} cy={y} r={16} fill="none" stroke="#C9A84C" strokeWidth={1} opacity={0.5} />}
                      </g>
                    );
                  })}
                  {/* User location */}
                  <circle cx={mapW / 2} cy={mapH / 2} r={8} fill="#6366F1" stroke="#818CF8" strokeWidth={2} />
                  <circle cx={mapW / 2} cy={mapH / 2} r={16} fill="none" stroke="#6366F130" strokeWidth={1} />
                  <text x={mapW / 2 + 12} y={mapH / 2 + 4} fill="#818CF8" fontSize={11}>You</text>
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 glass-card px-3 py-2 flex gap-3 text-xs">
                  {[{ color: "#10B981", label: "Available" }, { color: "#F59E0B", label: "Busy" }, { color: "#6B7280", label: "Offline" }].map(item => (
                    <span key={item.label} className="flex items-center gap-1 text-gold-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />{item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected Worker Panel */}
              {selectedWorker && (
                <div className="border-t border-white/5 p-4 flex gap-4 items-start animate-slide-up">
                  <img src={selectedWorker.avatar} alt={selectedWorker.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-gold-400">{selectedWorker.name}</div>
                    <div className="text-gold-700 text-xs">{selectedWorker.category} • {selectedWorker.locality}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1 text-gold-500"><Star size={11} fill="currentColor" />{selectedWorker.rating}</span>
                      <span className="text-gold-700">{selectedWorker.distance} km away</span>
                      <span className="text-gold-700">{selectedWorker.responseTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-gold-400 text-sm font-bold">{formatCurrency(selectedWorker.hourlyRate)}/hr</div>
                    <Link to={`/book/${selectedWorker.id}`} className="btn-gold py-1.5 px-4 text-xs">{t.bookNow}</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* List Panel */}
          <div className="lg:col-span-2 space-y-3 max-h-[520px] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-gold-500" />
              <span className="text-gold-500 text-sm font-medium">Fastest to Arrive</span>
            </div>
            {nearby.slice(0, 20).map((w, i) => (
              <div key={w.id} onClick={() => setSelected(w.id === selected ? null : w.id)}
                className={`glass-card p-3 flex gap-3 items-center cursor-pointer transition-all
                  ${selected === w.id ? "border-gold-600/50 bg-gold-700/5" : "hover:border-gold-700/30"}`}>
                <div className="relative">
                  {i < 3 && (
                    <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-gold-gradient rounded-full flex items-center justify-center text-ink-900 text-xs font-bold z-10">
                      {i + 1}
                    </div>
                  )}
                  <img src={w.avatar} alt={w.name} className="w-11 h-11 rounded-xl object-cover border border-white/10" />
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-ink-900
                    ${w.availability === "available" ? "bg-emerald-500" : w.availability === "busy" ? "bg-yellow-500" : "bg-gray-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gold-300 text-sm truncate">{w.name}</div>
                  <div className="text-gold-700 text-xs">{w.category}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={10} className="text-gold-700" />
                    <span className="text-xs text-gold-600">{w.responseTime}</span>
                    <MapPin size={10} className="text-gold-700" />
                    <span className="text-xs text-gold-600">{w.distance} km</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gold-400 text-xs font-bold">{formatCurrency(w.hourlyRate)}/hr</div>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <Star size={10} fill="#C9A84C" className="text-gold-500" />
                    <span className="text-xs text-gold-500">{w.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

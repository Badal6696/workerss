import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import { WORKERS, SERVICE_CATEGORIES, Worker } from "@/data/workers";
import WorkerCard, { WorkerCardSkeleton } from "@/components/WorkerCard";
import { useLang } from "@/contexts/AppContext";

const SORT_OPTIONS = [
  { value: "distance", label: "Nearest First" },
  { value: "rating", label: "Top Rated" },
  { value: "price_low", label: "Lowest Price" },
  { value: "price_high", label: "Highest Price" },
  { value: "experience", label: "Most Experienced" },
];

export default function BrowsePage() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "distance",
    availability: false,
    minRating: 0,
    maxPrice: 1000,
    minExp: 0,
    gender: "",
    verified: false,
    language: "",
    maxDistance: 50,
  });

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [filters]);

  const setF = (key: string, val: unknown) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list: Worker[] = [...WORKERS];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(w => w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q) || w.skillTags.some(s => s.toLowerCase().includes(q)));
    }
    if (filters.category) list = list.filter(w => w.categoryId === filters.category);
    if (filters.availability) list = list.filter(w => w.availability === "available");
    if (filters.minRating > 0) list = list.filter(w => w.rating >= filters.minRating);
    if (filters.maxPrice < 1000) list = list.filter(w => w.hourlyRate <= filters.maxPrice);
    if (filters.minExp > 0) list = list.filter(w => w.experience >= filters.minExp);
    if (filters.gender) list = list.filter(w => w.gender === filters.gender);
    if (filters.verified) list = list.filter(w => w.badges.idVerified && w.badges.skillCertified);
    if (filters.language) list = list.filter(w => w.languages.includes(filters.language));
    if (filters.maxDistance < 50) list = list.filter(w => w.distance <= filters.maxDistance);

    switch (filters.sort) {
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "price_low": list.sort((a, b) => a.hourlyRate - b.hourlyRate); break;
      case "price_high": list.sort((a, b) => b.hourlyRate - a.hourlyRate); break;
      case "experience": list.sort((a, b) => b.experience - a.experience); break;
      default: list.sort((a, b) => a.distance - b.distance);
    }
    return list;
  }, [filters]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;
  const activeFilterCount = [filters.category, filters.availability, filters.minRating > 0, filters.maxPrice < 1000, filters.minExp > 0, filters.gender, filters.verified, filters.language, filters.maxDistance < 50].filter(Boolean).length;

  const LANGS = ["Hindi","English","Marathi","Bengali","Telugu","Tamil","Kannada","Gujarati"];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container">
        {/* Header */}
        <div className="py-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl gold-text">{t.browse} Professionals</h1>
              <p className="text-gold-700 text-sm mt-1">{filtered.length.toLocaleString("en-IN")} professionals found</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="flex items-center gap-2 bg-ink-800 border border-ink-500 rounded-xl px-3 py-2 flex-1 md:w-64">
                <Search size={16} className="text-gold-700" />
                <input value={filters.q} onChange={e => setF("q", e.target.value)}
                  placeholder="Search worker, skill..."
                  className="bg-transparent text-gold-300 placeholder-gold-700/50 text-sm flex-1 focus:outline-none" />
                {filters.q && <button onClick={() => setF("q", "")} className="text-gold-700 hover:text-gold-400"><X size={14} /></button>}
              </div>
              {/* Sort */}
              <div className="relative">
                <select value={filters.sort} onChange={e => setF("sort", e.target.value)}
                  className="input-dark pr-8 text-sm appearance-none cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-ink-800">{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-600 pointer-events-none" />
              </div>
              {/* Filter Toggle */}
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || activeFilterCount > 0 ? "border-gold-600 text-gold-400 bg-gold-700/10" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                <SlidersHorizontal size={15} />{t.filters}{activeFilterCount > 0 && <span className="w-4 h-4 bg-gold-600 rounded-full text-ink-900 text-xs flex items-center justify-center font-bold">{activeFilterCount}</span>}
              </button>
              {/* View Toggle */}
              <div className="flex border border-ink-500 rounded-xl overflow-hidden hidden sm:flex">
                {(["grid","list"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`p-2.5 transition-colors ${view === v ? "bg-gold-700/20 text-gold-400" : "text-gold-700 hover:text-gold-500"}`}>
                    {v === "grid" ? <Grid3X3 size={16} /> : <List size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 pb-1">
            <button onClick={() => setF("category", "")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${!filters.category ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
              All Services
            </button>
            {SERVICE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setF("category", cat.id === filters.category ? "" : cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${filters.category === cat.id ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                <span>{cat.icon}</span><span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0 hidden lg:block">
              <div className="glass-card p-5 space-y-5 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gold-400">Filters</h3>
                  <button onClick={() => setFilters(prev => ({ ...prev, availability: false, minRating: 0, maxPrice: 1000, minExp: 0, gender: "", verified: false, language: "", maxDistance: 50 }))}
                    className="text-xs text-gold-600 hover:text-gold-400">Clear all</button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.availability} onChange={e => setF("availability", e.target.checked)}
                    className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm text-gold-500">Available Now</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.verified} onChange={e => setF("verified", e.target.checked)}
                    className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm text-gold-500">Fully Verified</span>
                </label>

                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Min Rating: {filters.minRating > 0 ? `${filters.minRating}★` : "Any"}</label>
                  <input type="range" min={0} max={5} step={0.5} value={filters.minRating} onChange={e => setF("minRating", +e.target.value)}
                    className="w-full accent-yellow-500" />
                </div>

                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Max Hourly: ₹{filters.maxPrice === 1000 ? "Any" : filters.maxPrice}</label>
                  <input type="range" min={100} max={1000} step={50} value={filters.maxPrice} onChange={e => setF("maxPrice", +e.target.value)}
                    className="w-full accent-yellow-500" />
                </div>

                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Min Experience: {filters.minExp > 0 ? `${filters.minExp} yrs` : "Any"}</label>
                  <input type="range" min={0} max={20} value={filters.minExp} onChange={e => setF("minExp", +e.target.value)}
                    className="w-full accent-yellow-500" />
                </div>

                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Max Distance: {filters.maxDistance < 50 ? `${filters.maxDistance} km` : "Any"}</label>
                  <input type="range" min={1} max={50} value={filters.maxDistance} onChange={e => setF("maxDistance", +e.target.value)}
                    className="w-full accent-yellow-500" />
                </div>

                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Gender</label>
                  <div className="flex gap-2">
                    {["","male","female"].map(g => (
                      <button key={g} onClick={() => setF("gender", g)}
                        className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${filters.gender === g ? "border-gold-600 text-gold-400" : "border-ink-500 text-gold-700"}`}>
                        {g === "" ? "Any" : g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Language</label>
                  <select value={filters.language} onChange={e => setF("language", e.target.value)}
                    className="input-dark w-full text-sm">
                    <option value="">Any Language</option>
                    {LANGS.map(l => <option key={l} value={l} className="bg-ink-800">{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-ink-900/90 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="glass-card p-5 max-w-sm mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gold-400">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X size={18} className="text-gold-600" /></button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.availability} onChange={e => setF("availability", e.target.checked)} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm text-gold-500">Available Now</span>
                </label>
                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Min Rating: {filters.minRating > 0 ? `${filters.minRating}★` : "Any"}</label>
                  <input type="range" min={0} max={5} step={0.5} value={filters.minRating} onChange={e => setF("minRating", +e.target.value)} className="w-full accent-yellow-500" />
                </div>
                <div>
                  <label className="text-sm text-gold-500 mb-2 block">Max Hourly: ₹{filters.maxPrice === 1000 ? "Any" : filters.maxPrice}</label>
                  <input type="range" min={100} max={1000} step={50} value={filters.maxPrice} onChange={e => setF("maxPrice", +e.target.value)} className="w-full accent-yellow-500" />
                </div>
                <button onClick={() => setShowFilters(false)} className="btn-gold w-full py-3">Apply Filters</button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {Array.from({ length: 6 }).map((_, i) => <WorkerCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display font-semibold text-xl text-gold-400 mb-2">No workers found</h3>
                <p className="text-gold-700">{t.noResults}</p>
                <button onClick={() => setFilters(prev => ({ ...prev, q: "", category: "", availability: false, minRating: 0, maxPrice: 1000, minExp: 0, gender: "", verified: false }))}
                  className="btn-outline-gold mt-6 px-6 py-2">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {paginated.map(w => <WorkerCard key={w.id} worker={w} view={view} />)}
                </div>
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button onClick={() => setPage(p => p + 1)} className="btn-outline-gold px-8 py-3">
                      Load More ({filtered.length - paginated.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

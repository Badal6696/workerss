import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, ChevronRight, Shield, Award, Clock, Zap, CheckCircle, Briefcase } from "lucide-react";
import { SERVICE_CATEGORIES, getNearestWorkers, getTopRated } from "@/data/workers";
import { TESTIMONIALS, HOW_IT_WORKS, PLATFORM_STATS } from "@/data/mockData";
import WorkerCard from "@/components/WorkerCard";
import { useLang } from "@/contexts/AppContext";

const heroBanner = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=900&fit=crop&q=80";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function HiringLanding() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Delhi NCR");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const nearWorkers = getNearestWorkers(8);
  const topWorkers = getTopRated(6);

  const workers = useCountUp(PLATFORM_STATS.verifiedWorkers, 2000, statsVisible);
  const jobs = useCountUp(PLATFORM_STATS.completedJobs, 2000, statsVisible);
  const customers = useCountUp(PLATFORM_STATS.happyCustomers, 2000, statsVisible);
  const cities = useCountUp(PLATFORM_STATS.citiesServed, 1500, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeCategory) params.set("category", activeCategory);
    navigate(`/browse?${params.toString()}`);
  };

  const heroLines = t.hiringHeroTitle.split("\n");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-900/40 to-transparent" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 page-container text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm text-gold-400">
              <Zap size={14} className="text-gold-500" />
              <span>India's Most Trusted Skilled Worker Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight text-balance">
              {t.hiringHeroTitle.split("\n")[0]}
              <br />
              <span className="gold-text">{t.hiringHeroTitle.split("\n")[1] || "Instantly."}</span>
            </h1>

            <p className="text-gold-400/80 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hiringHeroSubtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-ink-800 rounded-xl flex-1">
                  <Search size={18} className="text-gold-600 flex-shrink-0" />
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    placeholder={t.searchPlaceholder}
                    className="bg-transparent text-gold-300 placeholder-gold-700/50 text-sm flex-1 focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-ink-800 rounded-xl sm:w-40">
                  <MapPin size={16} className="text-gold-600 flex-shrink-0" />
                  <select value={location} onChange={e => setLocation(e.target.value)}
                    className="bg-transparent text-gold-400 text-sm flex-1 focus:outline-none appearance-none cursor-pointer">
                    {["Delhi NCR","Mumbai","Bengaluru","Hyderabad","Chennai","Pune","Kolkata","Jaipur","Lucknow","Ahmedabad","Indore","Bhopal"].map(c => (
                      <option key={c} value={c} className="bg-ink-800 text-gold-300">{c}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSearch} className="btn-gold px-6 py-3 text-sm whitespace-nowrap">
                  {t.searchBtn} ✦
                </button>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {SERVICE_CATEGORIES.slice(0, 8).map(cat => (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id); navigate(`/browse?category=${cat.id}`); }}
                    className="glass-card px-3 py-1.5 text-xs text-gold-500 hover:border-gold-700/40 hover:text-gold-300 transition-all flex items-center gap-1.5">
                    <span>{cat.icon}</span><span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 justify-center mt-10">
              {[
                { icon: <Shield size={14} />, text: "ID & Police Verified" },
                { icon: <Award size={14} />, text: "Skill Certified" },
                { icon: <Clock size={14} />, text: "Instant Booking" },
                { icon: <CheckCircle size={14} />, text: "Satisfaction Guarantee" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-emerald-400/80 text-sm">
                  {item.icon} <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Register Worker Link */}
            <div className="mt-8">
              <button onClick={() => navigate("/worker-portal")}
                className="inline-flex items-center gap-2 text-emerald-400/70 hover:text-emerald-400 text-sm transition-colors border border-emerald-500/20 rounded-full px-5 py-2 hover:border-emerald-500/40">
                <Briefcase size={14} /> Are you a worker? Register Now <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-gold-700/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-gold-600 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-700/5 via-transparent to-emerald-700/5" />
        <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: workers.toLocaleString("en-IN") + "+", label: t.verifiedWorkers, icon: "👷" },
            { value: cities.toString(), label: t.citiesServed, icon: "🏙️" },
            { value: (jobs / 1000).toFixed(0) + "K+", label: t.jobsCompleted, icon: "✅" },
            { value: (customers / 1000).toFixed(0) + "K+", label: t.happyCustomers, icon: "😊" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center group hover:border-gold-700/40 transition-all">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-display font-bold text-3xl gold-text mb-1">{stat.value}</div>
              <div className="text-gold-700 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.categoriesTitle}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{t.categoriesSubtitle}</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {SERVICE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => navigate(`/browse?category=${cat.id}`)}
                className="glass-card-hover p-3 flex flex-col items-center gap-2 group text-center">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                <span className="text-xs text-gold-600 group-hover:text-gold-400 transition-colors font-medium leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Workers Near You */}
      <section className="py-20 bg-ink-800/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Workers Near You</h2>
              <p className="section-subtitle">Available professionals in your area right now</p>
            </div>
            <button onClick={() => navigate("/near-me")} className="btn-outline-gold py-2 px-4 text-sm flex items-center gap-2 hidden sm:flex">
              View on Map <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {nearWorkers.map(w => (
              <div key={w.id} className="min-w-[280px]">
                <WorkerCard worker={w} view="grid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">How KaamPehechan Works</h2>
            <p className="section-subtitle">Book a verified professional in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="glass-card-hover p-6 relative group">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center text-ink-900 font-bold text-sm">
                  {step.step}
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-8 text-gold-700 translate-x-4 text-lg">→</div>
                )}
                <div className="text-4xl mb-4 mt-2">{step.icon}</div>
                <h3 className="font-display font-semibold text-gold-400 mb-2">{step.title}</h3>
                <p className="text-gold-700 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className="py-20 bg-ink-800/30">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Top Rated Professionals</h2>
              <p className="section-subtitle">Consistently exceptional service, verified and trusted</p>
            </div>
            <button onClick={() => navigate("/browse?sort=rating")} className="btn-outline-gold py-2 px-4 text-sm hidden sm:flex items-center gap-2">
              See All <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topWorkers.map(w => <WorkerCard key={w.id} worker={w} />)}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-4">{t.trustTitle}</h2>
              <p className="text-gold-600 leading-relaxed mb-8">
                Every worker on KaamPehechan undergoes a rigorous multi-step verification before going live. We check identity, skills, background, and insurance so you can focus on getting your work done.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🪪", title: t.idVerified, desc: "Aadhaar, PAN and document verification." },
                  { icon: "🎓", title: t.skillCertified, desc: "Trade test by industry experts." },
                  { icon: "🚔", title: t.policeVerified, desc: "Criminal background check from local police." },
                  { icon: "🛡️", title: t.insured, desc: "Work liability insurance covered." },
                ].map(item => (
                  <div key={item.title} className="glass-card p-4">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="text-gold-400 font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-gold-700 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Live Verification Dashboard</span>
                </div>
                {[
                  { label: "ID Verification", value: 98, color: "bg-emerald-gradient" },
                  { label: "Skill Certification", value: 87, color: "bg-gold-gradient" },
                  { label: "Police Verification", value: 72, color: "bg-emerald-gradient" },
                  { label: "Insurance Coverage", value: 65, color: "bg-gold-gradient" },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gold-500">{item.label}</span>
                      <span className="text-gold-400 font-semibold">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-ink-600 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-gold-700 text-xs pt-2">Based on {PLATFORM_STATS.verifiedWorkers.toLocaleString("en-IN")} verified workers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-ink-800/30">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real customers across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map(item => (
              <div key={item.id} className="glass-card-hover p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < item.rating ? "#C9A84C" : "none"} className={i < item.rating ? "text-gold-500" : "text-ink-500"} />
                  ))}
                </div>
                <p className="text-gold-500 text-sm leading-relaxed mb-4 italic">"{item.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gold-700/20" />
                  <div>
                    <div className="font-semibold text-gold-400 text-sm">{item.name}</div>
                    <div className="text-gold-700 text-xs">{item.city} • {item.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-700/5 via-transparent to-emerald-700/5" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">Ready to get work done?</h2>
              <p className="text-gold-500 text-lg max-w-xl mx-auto mb-8">
                Join 28,000+ satisfied customers who book skilled professionals through KaamPehechan every month.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate("/browse")} className="btn-gold px-8 py-4 text-base">Find a Professional Now</button>
                <button onClick={() => navigate("/worker-portal")} className="btn-outline-gold px-8 py-4 text-base flex items-center justify-center gap-2">
                  <Briefcase size={16} /> Register as a Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

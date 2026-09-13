import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp, Shield, Clock, Star, ChevronRight, Wallet, CalendarCheck, Users } from "lucide-react";
import { useLang } from "@/contexts/AppContext";
import { PLATFORM_STATS } from "@/data/mockData";

export default function WorkerLanding() {
  const { t } = useLang();
  const navigate = useNavigate();

  const benefits = [
    { icon: <Wallet size={22} />, title: "Daily Earnings", desc: "Get paid directly after every job. No waiting for weeks." },
    { icon: <CalendarCheck size={22} />, title: "Flexible Schedule", desc: "Choose your working hours. Accept jobs that fit your time." },
    { icon: <Users size={22} />, title: "Regular Customers", desc: "Build a loyal customer base and get repeat bookings." },
    { icon: <Shield size={22} />, title: "Platform Support", desc: "Insurance coverage, dispute resolution, and 24/7 help." },
    { icon: <TrendingUp size={22} />, title: "Grow Your Business", desc: "Get featured, earn badges, and increase your rates." },
    { icon: <Clock size={22} />, title: "Instant Job Alerts", desc: "Receive job requests in real-time on your phone." },
  ];

  const earnings = [
    { category: "Plumber", avg: "₹25,000-40,000/mo" },
    { category: "Electrician", avg: "₹22,000-35,000/mo" },
    { category: "Beauty Pro", avg: "₹30,000-50,000/mo" },
    { category: "AC Technician", avg: "₹28,000-45,000/mo" },
    { category: "Carpenter", avg: "₹20,000-35,000/mo" },
    { category: "Cook/Chef", avg: "₹18,000-30,000/mo" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 page-container text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm text-emerald-400">
            <Briefcase size={14} className="text-emerald-500" />
            <span>Join India's Largest Worker Network</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight">
            {t.workerHeroTitle.split("\n")[0]}
            <br />
            <span className="text-emerald-400">{t.workerHeroTitle.split("\n")[1] || "Grow Your Career"}</span>
          </h1>

          <p className="text-gold-500/80 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.workerHeroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/signup?role=worker&mode=signup")} className="btn-gold px-8 py-4 text-base flex items-center justify-center gap-2">
              <Briefcase size={18} /> Register as Worker
            </button>
            <button onClick={() => navigate("/")} className="btn-outline-gold px-8 py-4 text-base flex items-center justify-center gap-2">
              <ChevronRight size={18} /> Go to Hiring Portal
            </button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mt-10 text-sm text-gold-600">
            <span className="flex items-center gap-1.5"><Star size={14} className="text-gold-500" /> {PLATFORM_STATS.verifiedWorkers.toLocaleString("en-IN")}+ Workers</span>
            <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-emerald-500" /> Avg ₹25K+ Monthly</span>
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-gold-500" /> Fully Insured</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Join KaamPehechan?</h2>
            <p className="section-subtitle">Everything you need to grow your career as a skilled worker</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="glass-card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-700/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-700/20 transition-all">
                  {b.icon}
                </div>
                <h3 className="font-display font-semibold text-gold-400 mb-2">{b.title}</h3>
                <p className="text-gold-700 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="py-20 bg-ink-800/30">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">How Much Can You Earn?</h2>
            <p className="section-subtitle">Average monthly earnings by category</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {earnings.map((e, i) => (
              <div key={i} className="glass-card p-5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gold-400">{e.category}</div>
                  <div className="text-gold-700 text-xs">Avg. Monthly</div>
                </div>
                <div className="font-display font-bold text-emerald-400 text-lg">{e.avg}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works for Workers */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">Get Started in 4 Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Register", desc: "Create your profile with skills, experience and ID proof.", icon: "📝" },
              { step: 2, title: "Get Verified", desc: "Complete ID, skill and police verification within 24 hours.", icon: "✅" },
              { step: 3, title: "Receive Jobs", desc: "Get job requests from customers near you instantly.", icon: "📱" },
              { step: 4, title: "Earn Daily", desc: "Complete jobs and get paid directly to your account.", icon: "💰" },
            ].map(s => (
              <div key={s.step} className="glass-card-hover p-6 relative group">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {s.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{s.icon}</div>
                <h3 className="font-display font-semibold text-gold-400 mb-2">{s.title}</h3>
                <p className="text-gold-700 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/5 via-transparent to-gold-700/5" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-4">
                Ready to start earning?
              </h2>
              <p className="text-gold-500 text-lg max-w-xl mx-auto mb-8">
                Join thousands of skilled workers who are building their career with KaamPehechan.
              </p>
              <button onClick={() => navigate("/signup?role=worker&mode=signup")} className="btn-gold px-8 py-4 text-base">
                Register Now — It's Free
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

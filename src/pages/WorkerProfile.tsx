import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Shield, Award, Phone, MessageCircle, ChevronLeft, X, Zap, Check } from "lucide-react";
import { getWorkerById, WORKERS, SERVICE_CATEGORIES } from "@/data/workers";
import { useLang, useToast } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import WorkerCard from "@/components/WorkerCard";

export default function WorkerProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const worker = getWorkerById(id || "");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!worker) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-4">👷</div>
        <h2 className="font-display text-2xl text-gold-400 mb-2">Worker not found</h2>
        <Link to="/browse" className="btn-gold px-6 py-3">Browse Workers</Link></div>
    </div>
  );

  const similar = WORKERS.filter(w => w.categoryId === worker.categoryId && w.id !== worker.id).slice(0, 4);
  const badgeList = [
    { show: worker.badges.idVerified, icon: "🪪", label: t.idVerified },
    { show: worker.badges.skillCertified, icon: "🎓", label: t.skillCertified },
    { show: worker.badges.policeVerified, icon: "🚔", label: t.policeVerified },
    { show: worker.badges.insured, icon: "🛡️", label: t.insured },
  ].filter(b => b.show);

  const ratingBreakdown = [5,4,3,2,1].map(star => ({
    star, count: worker.reviews.filter(r => r.stars === star).length
  }));

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-10">
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={28} /></button>
          <img src={lightbox} alt="Work" className="max-w-full max-h-full rounded-2xl object-contain shadow-deep" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img src={worker.gallery[0] || worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/20" />
        <button onClick={() => navigate(-1)} className="absolute top-20 left-4 glass-card p-2 hover:border-gold-700/40 transition-all">
          <ChevronLeft size={20} className="text-gold-400" />
        </button>
      </div>

      <div className="page-container -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="glass-card p-6">
              <div className="flex gap-5 items-start flex-wrap">
                <div className="relative">
                  <img src={worker.avatar} alt={worker.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-gold-700/30 shadow-gold" />
                  {worker.availability === "available" && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-ink-900 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h1 className="font-display font-bold text-2xl text-white">{worker.name}</h1>
                      <p className="text-gold-500">{worker.category}</p>
                      <p className="text-gold-700 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={13} />{worker.locality}, {worker.city} • {worker.distance} km away
                      </p>
                    </div>
                    <button onClick={() => { setSaved(!saved); toast(saved ? "info" : "success", saved ? "Removed from saved" : "Saved to favourites"); }}
                      className={`text-2xl transition-transform hover:scale-110 ${saved ? "grayscale-0" : "grayscale"}`}>
                      {saved ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star size={15} fill="#C9A84C" className="text-gold-500" />
                      <span className="font-bold text-gold-400">{worker.rating}</span>
                      <span className="text-gold-700 text-sm">({worker.reviewCount} reviews)</span>
                    </div>
                    <span className="text-gold-700">•</span>
                    <span className="text-gold-600 text-sm">{worker.jobsCompleted} jobs done</span>
                    <span className="text-gold-700">•</span>
                    <span className="text-gold-600 text-sm">{worker.repeatCustomerPct}% repeat</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {badgeList.map(b => (
                      <span key={b.label} className="badge-verified text-xs">{b.icon} {b.label}</span>
                    ))}
                    <span className={`text-xs px-2 py-0.5 rounded-full border
                      ${worker.availability === "available" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : "text-gold-700 border-gold-700/20 bg-gold-700/10"}`}>
                      {worker.availability === "available" ? `✦ ${t.available}` : worker.availability === "busy" ? t.busy : t.offline}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="border-white/5 my-5" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: "Experience", value: `${worker.experience} yrs` },
                  { label: "Response", value: worker.responseTime },
                  { label: "Hourly Rate", value: formatCurrency(worker.hourlyRate) },
                  { label: "Visit Charge", value: formatCurrency(worker.visitCharge) },
                ].map(item => (
                  <div key={item.label} className="bg-ink-800 rounded-xl p-3">
                    <div className="font-bold text-gold-400 text-lg">{item.value}</div>
                    <div className="text-gold-700 text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Bio */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl text-gold-400 mb-3">About & Skills</h2>
              <p className="text-gold-600 leading-relaxed mb-4">{worker.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {worker.skillTags.map(tag => (
                  <span key={tag} className="bg-ink-600 text-gold-500 text-sm px-3 py-1 rounded-full border border-ink-500">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4 text-sm text-gold-700">
                <span>🗣️ {worker.languages.join(", ")}</span>
                <span>⚥ {worker.gender === "male" ? "Male" : worker.gender === "female" ? "Female" : "Other"}</span>
                <span>🎂 {worker.age} years</span>
              </div>
            </div>

            {/* Gallery */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl text-gold-400 mb-4">Work Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {worker.gallery.map((img, i) => (
                  <button key={i} onClick={() => setLightbox(img)} className="relative group overflow-hidden rounded-xl aspect-video">
                    <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">🔍</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl text-gold-400">Reviews & Ratings</h2>
                <span className="text-gold-700 text-sm">{worker.reviewCount} total</span>
              </div>
              <div className="flex gap-8 mb-6 flex-wrap">
                <div className="text-center">
                  <div className="font-display font-bold text-5xl gold-text">{worker.rating}</div>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.round(worker.rating) ? "#C9A84C" : "none"} className={i < Math.round(worker.rating) ? "text-gold-500" : "text-ink-500"} />
                    ))}
                  </div>
                  <div className="text-gold-700 text-xs mt-1">{worker.reviewCount} reviews</div>
                </div>
                <div className="flex-1 space-y-1.5 min-w-40">
                  {ratingBreakdown.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="text-gold-600 w-4">{star}★</span>
                      <div className="flex-1 h-1.5 bg-ink-600 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-gradient rounded-full" style={{ width: `${worker.reviews.length ? (count / worker.reviews.length) * 100 : 0}%` }} />
                      </div>
                      <span className="text-gold-700 w-4">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {worker.reviews.map(rev => (
                  <div key={rev.id} className="border-t border-white/5 pt-4">
                    <div className="flex items-start gap-3">
                      <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-medium text-gold-400 text-sm">{rev.reviewerName}</span>
                          <span className="text-gold-700 text-xs">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} fill={i < rev.stars ? "#C9A84C" : "none"} className={i < rev.stars ? "text-gold-500" : "text-ink-500"} />
                          ))}
                        </div>
                        <p className="text-gold-600 text-sm">{rev.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Workers */}
            {similar.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xl text-gold-400 mb-4">Similar {worker.category} Professionals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similar.map(w => <WorkerCard key={w.id} worker={w} compact />)}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24 space-y-4">
              <div className="text-center mb-2">
                <div className="font-display font-bold text-3xl gold-text">{formatCurrency(worker.hourlyRate)}</div>
                <div className="text-gold-700 text-sm">per hour + {formatCurrency(worker.visitCharge)} visit</div>
              </div>

              <Link to={`/book/${worker.id}`} className="btn-gold w-full py-4 text-center block text-base font-semibold">
                📅 {t.bookNow}
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => toast("info", "Calling feature coming soon")}
                  className="btn-outline-gold py-3 text-sm flex items-center justify-center gap-2">
                  <Phone size={15} /> Call
                </button>
                <button onClick={() => toast("info", "Chat feature coming soon")}
                  className="btn-outline-gold py-3 text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={15} /> Chat
                </button>
              </div>

              <div className="bg-ink-800 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gold-700">Availability</span>
                  <span className={worker.availability === "available" ? "text-emerald-400" : "text-gold-500"}>
                    {worker.availability === "available" ? "✦ Right Now" : worker.responseTime}
                  </span></div>
                <div className="flex justify-between"><span className="text-gold-700">Location</span><span className="text-gold-500">{worker.city}</span></div>
                <div className="flex justify-between"><span className="text-gold-700">Languages</span><span className="text-gold-500 text-right">{worker.languages.slice(0, 2).join(", ")}</span></div>
              </div>

              <div className="text-xs text-gold-700 text-center flex items-center justify-center gap-1">
                <Shield size={11} /> All payments protected. Satisfaction guaranteed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

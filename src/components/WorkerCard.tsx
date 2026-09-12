import { Link } from "react-router-dom";
import { Star, MapPin, Clock, Shield, Zap, Award } from "lucide-react";
import { Worker } from "@/data/workers";
import { useLang } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";

interface WorkerCardProps {
  worker: Worker;
  view?: "grid" | "list";
  compact?: boolean;
}

const STATUS_STYLES = {
  available: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  busy: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  offline: "text-gold-700 bg-gold-700/10 border-gold-700/20",
};

export default function WorkerCard({ worker, view = "grid", compact = false }: WorkerCardProps) {
  const { t } = useLang();

  const statusLabel = worker.availability === "available" ? t.available : worker.availability === "busy" ? t.busy : t.offline;

  if (view === "list") {
    return (
      <div className="glass-card-hover p-4 flex gap-4 items-start">
        <div className="relative flex-shrink-0">
          <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-ink-900
            ${worker.availability === "available" ? "bg-emerald-500" : worker.availability === "busy" ? "bg-yellow-500" : "bg-gold-700"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-gold-300 truncate">{worker.name}</h3>
              <p className="text-gold-700 text-sm">{worker.category}</p>
            </div>
            <div className="flex items-center gap-1 text-gold-500">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-semibold">{worker.rating}</span>
              <span className="text-gold-700 text-xs">({worker.reviewCount})</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gold-700">
            <span className="flex items-center gap-1"><MapPin size={11} />{worker.locality}, {worker.city}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{worker.responseTime}</span>
            <span>{worker.experience} {t.years} exp</span>
          </div>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {worker.badges.idVerified && <span className="badge-verified"><Shield size={10} />ID</span>}
              {worker.badges.skillCertified && <span className="badge-gold"><Award size={10} />Certified</span>}
              <span className={`badge-gold border ${STATUS_STYLES[worker.availability]} text-xs`}>{statusLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-gold-400 font-semibold text-sm">{formatCurrency(worker.hourlyRate)}<span className="text-gold-700 font-normal text-xs">/hr</span></div>
              </div>
              <Link to={`/worker/${worker.id}`} className="btn-gold py-1.5 px-4 text-sm">{t.bookNow}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <Link to={`/worker/${worker.id}`} className="glass-card-hover p-3 flex gap-3 items-center group">
        <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gold-300 text-sm truncate">{worker.name}</div>
          <div className="text-gold-700 text-xs">{worker.category}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <Star size={11} fill="#C9A84C" className="text-gold-500" />
            <span className="text-xs text-gold-500">{worker.rating}</span>
            <span className="text-xs text-gold-700">• {worker.distance} {t.km}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-gold-400 text-xs font-semibold">{formatCurrency(worker.hourlyRate)}/hr</div>
          <span className={`text-xs px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[worker.availability]}`}>
            {worker.availability === "available" ? "•" : "○"} {statusLabel}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="glass-card-hover overflow-hidden group relative">
      {/* Photo */}
      <div className="relative h-44 overflow-hidden">
        <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full border backdrop-blur-sm ${STATUS_STYLES[worker.availability]}`}>
          {worker.availability === "available" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />}
          {statusLabel}
        </span>
        {worker.badges.policeVerified && (
          <span className="absolute top-3 right-3 badge-verified backdrop-blur-sm"><Shield size={10} />Verified</span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="font-display font-semibold text-white text-base leading-tight">{worker.name}</div>
            <div className="text-gold-400 text-xs">{worker.category}</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star size={14} fill="#C9A84C" className="text-gold-500" />
            <span className="font-semibold text-gold-400 text-sm">{worker.rating}</span>
            <span className="text-gold-700 text-xs">({worker.reviewCount})</span>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {worker.badges.idVerified && <span className="badge-verified"><Shield size={9} /></span>}
            {worker.badges.skillCertified && <span className="badge-gold"><Zap size={9} /></span>}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gold-700 mb-3">
          <span className="flex items-center gap-1"><MapPin size={10} />{worker.locality}</span>
          <span>•</span>
          <span>{worker.distance} {t.km}</span>
          <span>•</span>
          <span>{worker.experience} {t.years}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {worker.skillTags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-ink-600 text-gold-600 rounded-full px-2 py-0.5">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-gold-400 font-bold text-base">{formatCurrency(worker.hourlyRate)}</span>
            <span className="text-gold-700 text-xs">/hr</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/worker/${worker.id}`} className="btn-outline-gold py-1.5 px-3 text-xs">{t.viewProfile}</Link>
            <Link to={`/book/${worker.id}`} className="btn-gold py-1.5 px-3 text-xs">{t.bookNow}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkerCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

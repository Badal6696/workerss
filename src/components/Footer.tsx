import { Link } from "react-router-dom";
import { useLang } from "@/contexts/AppContext";
import { SERVICE_CATEGORIES } from "@/data/workers";

export default function Footer() {
  const { t } = useLang();
  const topCats = SERVICE_CATEGORIES.slice(0, 12);

  return (
    <footer className="bg-ink-950 border-t border-white/5 pt-16 pb-24 md:pb-12">
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://cdn-ai.onspace.ai/onspace/project/uploads/QSQEi3RybKcDdBBTRJksEx/logo.jpg"
                alt="KaamPehechan" className="w-12 h-12 rounded-full object-cover border border-gold-700/30" />
              <div>
                <div className="font-display font-bold text-gold-400 text-lg">KaamPehechan</div>
                <div className="text-gold-700 text-xs">Identify. Connect. Work.</div>
              </div>
            </div>
            <p className="text-gold-700 text-sm leading-relaxed mb-4">
              India's premium platform for verified skilled workers. Every professional, every service — in one trusted place.
            </p>
            <div className="flex gap-3">
              {["📘","🐦","📸","▶️"].map((icon, i) => (
                <button key={i} className="w-8 h-8 glass-card flex items-center justify-center text-sm hover:border-gold-700/40 transition-all">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-gold-400 mb-4">Popular Services</h4>
            <div className="grid grid-cols-2 gap-1">
              {topCats.map(cat => (
                <Link key={cat.id} to={`/browse?category=${cat.id}`}
                  className="text-sm text-gold-700 hover:text-gold-400 transition-colors py-0.5">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-gold-400 mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/about", label: t.aboutUs }, { to: "/safety", label: t.safety },
                { to: "/pricing", label: t.pricing }, { to: "/help", label: t.help },
                { to: "/contact", label: t.contact }, { to: "/admin", label: "Admin Overview" },
              ].map(item => (
                <Link key={item.to} to={item.to} className="text-sm text-gold-700 hover:text-gold-400 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-gold-400 mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-gold-700">
              <div className="flex items-start gap-2"><span>📍</span><span>KaamPehechan HQ, MG Road, Bengaluru – 560001</span></div>
              <div className="flex items-center gap-2"><span>📞</span><span>1800-KP-INDIA (toll free)</span></div>
              <div className="flex items-center gap-2"><span>📧</span><span>support@kaampehchan.in</span></div>
              <div className="flex items-center gap-2"><span>⏰</span><span>8 AM – 10 PM, All Days</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="glass-card px-3 py-1.5 text-xs text-gold-500 hover:border-gold-700/40 transition-all">App Store</button>
              <button className="glass-card px-3 py-1.5 text-xs text-gold-500 hover:border-gold-700/40 transition-all">Play Store</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gold-700 text-xs">© 2026 KaamPehechan. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-gold-700 hover:text-gold-400 transition-colors">{t.privacyPolicy}</Link>
            <Link to="/terms" className="text-xs text-gold-700 hover:text-gold-400 transition-colors">{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

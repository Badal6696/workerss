import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useLang } from "@/contexts/AppContext";
import { LANGUAGES } from "@/translations";
import { Menu, X, ChevronDown, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); setUserMenuOpen(false); };
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink-900/90 backdrop-blur-md border-b border-white/5">
      <div className="page-container h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="https://cdn-ai.onspace.ai/onspace/project/uploads/QSQEi3RybKcDdBBTRJksEx/logo.jpg"
            alt="KaamPehechan" className="w-10 h-10 rounded-full object-cover border border-gold-700/30" />
          <span className="font-display font-bold text-lg text-gold-400 hidden sm:block">KaamPehechan</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`nav-link ${isActive("/") ? "text-gold-400" : ""}`}>{t.hiringPortal}</Link>
          <Link to="/worker-portal" className={`nav-link ${isActive("/worker-portal") ? "text-emerald-400" : ""}`}>Register Worker</Link>
          <Link to="/browse" className={`nav-link ${isActive("/browse") ? "text-gold-400" : ""}`}>{t.browse}</Link>
          <Link to="/near-me" className={`nav-link ${isActive("/near-me") ? "text-gold-400" : ""}`}>{t.nearMe}</Link>
          <Link to="/help" className="nav-link">{t.help}</Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button onClick={() => { setLangOpen(!langOpen); setUserMenuOpen(false); }}
              className="flex items-center gap-1 text-gold-600 hover:text-gold-400 text-sm font-medium transition-colors px-2 py-1">
              <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
              <span className="hidden sm:block">{LANGUAGES.find(l => l.code === lang)?.nativeLabel}</span>
              <ChevronDown size={14} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 glass-card py-1 shadow-deep animate-slide-down">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors
                      ${lang === l.code ? "text-gold-400" : "text-gold-600"}`}>
                    <span>{l.flag}</span><span>{l.nativeLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => { setUserMenuOpen(!userMenuOpen); setLangOpen(false); }}
                className="flex items-center gap-2 glass-card px-3 py-1.5 hover:border-gold-700/40 transition-all">
                <img src={user?.avatar || `https://randomuser.me/api/portraits/men/1.jpg`}
                  alt={user?.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-sm text-gold-400 font-medium hidden sm:block max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown size={14} className="text-gold-600" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-card py-1 shadow-deep animate-slide-down">
                  <Link to={user?.role === "worker" ? "/worker-dashboard" : "/dashboard"}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gold-500 hover:bg-white/5 transition-colors"
                    onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard size={14} /> {t.dashboard}
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gold-500 hover:bg-white/5 transition-colors"
                    onClick={() => setUserMenuOpen(false)}>
                    <User size={14} /> Profile
                  </Link>
                  <hr className="border-white/5 my-1" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-crimson-400 hover:bg-white/5 transition-colors">
                    <LogOut size={14} /> {t.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline-gold py-2 px-4 text-sm hidden sm:block">{t.login}</Link>
              <Link to="/signup" className="btn-gold py-2 px-4 text-sm">{t.signup}</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gold-500 p-1 hover:text-gold-300 transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ink-800/95 backdrop-blur-md border-t border-white/5 py-4 px-6 flex flex-col gap-3 animate-slide-down">
          {[
            { to: "/", label: t.home }, { to: "/worker-portal", label: "Register Worker" }, { to: "/browse", label: t.browse },
            { to: "/near-me", label: t.nearMe }, { to: "/about", label: t.aboutUs },
            { to: "/help", label: t.help }, { to: "/contact", label: t.contact },
          ].map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
              className="text-gold-500 hover:text-gold-300 font-medium py-1 transition-colors">
              {item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline-gold text-center py-2 mt-2">
              {t.login}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

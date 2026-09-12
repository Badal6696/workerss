import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import translations, { Language, TranslationKeys } from "@/translations";

// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "worker" | "admin";
  avatar?: string;
  workerId?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

// ─── Language Types ───────────────────────────────────────────────────────────
interface LangState {
  lang: Language;
  setLang: (l: Language) => void;
  t: TranslationKeys;
}

// ─── Toast Types ──────────────────────────────────────────────────────────────
interface Toast { id: string; type: "success" | "error" | "info" | "warning"; message: string; }
interface ToastState {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

// ─── Combined Context ─────────────────────────────────────────────────────────
interface AppContextType extends AuthState, LangState, ToastState {}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const s = localStorage.getItem("kp_user"); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  const login = useCallback((u: AuthUser) => {
    setUser(u);
    localStorage.setItem("kp_user", JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("kp_user");
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem("kp_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Language
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("kp_lang") as Language) || "en";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem("kp_lang", l);
  }, []);

  const t = translations[lang];

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user, login, logout, updateUser,
      lang, setLang, t,
      toasts, addToast, removeToast,
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-deep
            border backdrop-blur-md animate-slide-down max-w-sm
            ${toast.type === "success" ? "bg-emerald-700/20 border-emerald-500/30 text-emerald-300" : ""}
            ${toast.type === "error" ? "bg-crimson-600/20 border-crimson-500/30 text-crimson-400" : ""}
            ${toast.type === "info" ? "bg-ink-700/80 border-gold-700/30 text-gold-400" : ""}
            ${toast.type === "warning" ? "bg-yellow-800/20 border-yellow-600/30 text-yellow-400" : ""}
          `}>
            <span className="text-lg">
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "ℹ"}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-auto text-current opacity-60 hover:opacity-100 text-lg leading-none">×</button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export const useAuth = () => {
  const { user, isAuthenticated, login, logout, updateUser } = useContext(AppContext);
  return { user, isAuthenticated, login, logout, updateUser };
};
export const useLang = () => {
  const { lang, setLang, t } = useContext(AppContext);
  return { lang, setLang, t };
};
export const useToast = () => {
  const { addToast } = useContext(AppContext);
  return { toast: addToast };
};

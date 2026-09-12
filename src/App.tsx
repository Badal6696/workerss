import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider, useAuth } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import BrowsePage from "@/pages/BrowsePage";
import NearMePage from "@/pages/NearMePage";
import WorkerProfile from "@/pages/WorkerProfile";
import BookingFlow from "@/pages/BookingFlow";
import CustomerDashboard from "@/pages/CustomerDashboard";
import WorkerDashboard from "@/pages/WorkerDashboard";
import AdminPage from "@/pages/AdminPage";
import {
  AboutPage, SafetyPage, HelpPage, ContactPage, PricingPage, NotFoundPage
} from "@/pages/StaticPages";

// Mobile Bottom Tab Bar
import { Home, Search, MapPin, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function MobileTabBar() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const tabs = [
    { to: "/", icon: <Home size={22} />, label: "Home" },
    { to: "/browse", icon: <Search size={22} />, label: "Browse" },
    { to: "/near-me", icon: <MapPin size={22} />, label: "Near Me" },
    { to: isAuthenticated ? (user?.role === "worker" ? "/worker-dashboard" : "/dashboard") : "/login",
      icon: <LayoutDashboard size={22} />, label: "Dashboard" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-ink-900/95 backdrop-blur-md border-t border-white/5 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {tabs.map(tab => (
          <Link key={tab.to} to={tab.to}
            className={`mobile-tab py-2 px-4 rounded-xl transition-all min-w-[60px]
              ${isActive(tab.to) ? "text-gold-400" : "text-gold-700"}`}>
            {tab.icon}
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Protected route wrapper
function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role && user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/near-me" element={<NearMePage />} />
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/book/:id" element={<BookingFlow />} />
          <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/worker-dashboard" element={<ProtectedRoute><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<SafetyPage />} />
          <Route path="/terms" element={<SafetyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

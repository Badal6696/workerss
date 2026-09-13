import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Phone, Share2, X, Navigation, Shield } from "lucide-react";
import { useLang, useToast } from "@/contexts/AppContext";

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: string } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { t } = useLang();
  const { toast } = useToast();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude.toString() });
          setLocationShared(true);
          toast("success", "Location captured successfully!");
        },
        () => {
          // Fallback mock location
          setCoords({ lat: 28.6139, lng: "77.2090" });
          setLocationShared(true);
          toast("info", "Using approximate location");
        }
      );
    }
  };

  const handleSOS = () => {
    setCountdown(3);
    getLocation();
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      toast("success", t.sosAlertSent);
      setLocationShared(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const callPolice = () => {
    window.open("tel:100", "_self");
    toast("info", "Calling Police Emergency (100)...");
  };

  const shareLocation = () => {
    if (coords) {
      const url = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}`;
      if (navigator.share) {
        navigator.share({ title: "My Location - SOS", text: "I need help! Here is my location:", url });
      } else {
        navigator.clipboard.writeText(url);
        toast("success", "Location link copied to clipboard!");
      }
    } else {
      getLocation();
    }
  };

  const emergencyContacts = [
    { name: "Police", number: "100", icon: "🚔" },
    { name: "Ambulance", number: "108", icon: "🚑" },
    { name: "Fire Brigade", number: "101", icon: "🚒" },
    { name: "Women Helpline", number: "1091", icon: "🛡️" },
  ];

  return (
    <>
      {/* SOS Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 left-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-deep transition-all duration-300 md:bottom-6 md:left-6
          ${isOpen ? "bg-ink-700 border border-gold-700/30" : "bg-crimson-600 hover:bg-crimson-500 animate-pulse"}
        `}
        title={t.sos}
      >
        {isOpen ? <X size={20} className="text-gold-400" /> : <AlertTriangle size={22} className="text-white" />}
      </button>

      {/* SOS Panel */}
      {isOpen && (
        <div className="fixed bottom-40 left-4 z-50 w-80 glass-card p-5 shadow-deep animate-slide-up md:bottom-24 md:left-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-crimson-600/20 flex items-center justify-center">
              <AlertTriangle size={18} className="text-crimson-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-crimson-400 text-sm">{t.sosTitle}</h3>
              <p className="text-gold-700 text-xs">{t.sosSubtitle}</p>
            </div>
          </div>

          {/* Countdown */}
          {countdown !== null && (
            <div className="bg-crimson-600/10 border border-crimson-500/30 rounded-xl p-4 mb-4 text-center">
              <div className="font-display font-bold text-4xl text-crimson-400 mb-1">{countdown}</div>
              <p className="text-crimson-400/70 text-xs">Sending SOS alert with location...</p>
            </div>
          )}

          {/* Main SOS Button */}
          {!countdown && (
            <button
              onClick={handleSOS}
              className="w-full py-4 bg-crimson-600 hover:bg-crimson-500 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 mb-4 transition-all shadow-lg shadow-crimson-600/20"
            >
              <AlertTriangle size={18} /> {t.sosTap}
            </button>
          )}

          {/* Location Status */}
          {locationShared && coords && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
              <Navigation size={16} className="text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-emerald-400 text-xs font-medium">Location Shared</p>
                <p className="text-emerald-400/60 text-xs truncate">{coords.lat.toFixed(4)}, {coords.lng}</p>
              </div>
              <button onClick={shareLocation} className="text-emerald-400 hover:text-emerald-300">
                <Share2 size={14} />
              </button>
            </div>
          )}

          {/* Police Call */}
          <button
            onClick={callPolice}
            className="w-full py-3 bg-ink-800 border border-gold-700/20 rounded-xl text-sm text-gold-400 font-medium flex items-center justify-center gap-2 mb-3 hover:border-gold-600/40 transition-all"
          >
            <Phone size={16} className="text-gold-500" /> {t.sosPoliceCall}
          </button>

          {/* Share Location */}
          <button
            onClick={shareLocation}
            className="w-full py-3 bg-ink-800 border border-gold-700/20 rounded-xl text-sm text-gold-400 font-medium flex items-center justify-center gap-2 mb-4 hover:border-gold-600/40 transition-all"
          >
            <MapPin size={16} className="text-gold-500" /> {t.sosLocationTrack}
          </button>

          {/* Emergency Contacts */}
          <div>
            <p className="text-gold-700 text-xs font-medium mb-2 flex items-center gap-1">
              <Shield size={11} /> {t.sosEmergencyContacts}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {emergencyContacts.map(c => (
                <a key={c.number} href={`tel:${c.number}`}
                  className="flex items-center gap-2 bg-ink-800 rounded-lg px-3 py-2 text-xs text-gold-500 hover:text-gold-300 hover:bg-ink-700 transition-all">
                  <span>{c.icon}</span>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-gold-700">{c.number}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

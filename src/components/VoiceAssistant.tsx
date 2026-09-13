import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X, Volume2 } from "lucide-react";
import { useLang, useToast } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-IN";

      recognitionRef.current.onresult = (event: any) => {
        const text = Array.from(event.results).map((r: any) => r[0].transcript).join("");
        setTranscript(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) processCommand(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast("error", "Voice recognition error. Please try again.");
      };
    }
    return () => { if (recognitionRef.current) recognitionRef.current.abort(); };
  }, []);

  const processCommand = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("plumber") || lower.includes("plumbing")) {
      navigate("/browse?category=plumbing");
      toast("success", "Showing plumbers near you...");
    } else if (lower.includes("electric") || lower.includes("wiring")) {
      navigate("/browse?category=electrical");
      toast("success", "Showing electricians near you...");
    } else if (lower.includes("clean") || lower.includes("safai")) {
      navigate("/browse?category=cleaning");
      toast("success", "Showing cleaning services...");
    } else if (lower.includes("paint") || lower.includes("painting")) {
      navigate("/browse?category=painting");
      toast("success", "Showing painters near you...");
    } else if (lower.includes("beauty") || lower.includes("salon") || lower.includes("parlour")) {
      navigate("/browse?category=beauty");
      toast("success", "Showing beauty services...");
    } else if (lower.includes("driver") || lower.includes("cab")) {
      navigate("/browse?category=driver");
      toast("success", "Showing drivers near you...");
    } else if (lower.includes("cook") || lower.includes("chef")) {
      navigate("/browse?category=cook");
      toast("success", "Showing cooks near you...");
    } else if (lower.includes("carpenter") || lower.includes("furniture")) {
      navigate("/browse?category=carpentry");
      toast("success", "Showing carpenters near you...");
    } else if (lower.includes("near") || lower.includes("pas")) {
      navigate("/near-me");
      toast("success", "Showing workers near you...");
    } else if (lower.includes("sos") || lower.includes("emergency") || lower.includes("help")) {
      toast("warning", "Opening SOS...");
      setIsOpen(false);
    } else {
      navigate(`/browse?q=${encodeURIComponent(text)}`);
      toast("info", `Searching for "${text}"...`);
    }
    setIsOpen(false);
    setTranscript("");
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast("error", "Voice recognition not supported in this browser");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-deep transition-all duration-300 md:bottom-6 md:right-6
          ${isOpen ? "bg-crimson-600 hover:bg-crimson-500 rotate-90" : "bg-gold-gradient hover:shadow-gold"}
        `}
        title={t.voiceAssistant}
      >
        {isOpen ? <X size={22} className="text-white" /> : <Mic size={22} className="text-ink-900" />}
      </button>

      {/* Voice Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 z-50 w-80 glass-card p-5 shadow-deep animate-slide-up md:bottom-24 md:right-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isListening ? "bg-crimson-600/20 animate-pulse" : "bg-gold-700/20"}`}>
              {isListening ? <Mic size={18} className="text-crimson-400" /> : <Volume2 size={18} className="text-gold-500" />}
            </div>
            <div>
              <h3 className="font-display font-semibold text-gold-400 text-sm">{t.voiceAssistant}</h3>
              <p className="text-gold-700 text-xs">{isListening ? t.voiceListening : t.voicePrompt}</p>
            </div>
          </div>

          {/* Waveform Animation */}
          {isListening && (
            <div className="flex items-center justify-center gap-1 h-12 mb-3">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gold-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 32 + 8}px`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: `${400 + Math.random() * 300}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="bg-ink-800 rounded-xl p-3 mb-3">
              <p className="text-gold-400 text-sm">"{transcript}"</p>
            </div>
          )}

          {/* Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all
              ${isListening ? "bg-crimson-600/20 border border-crimson-500/30 text-crimson-400" : "btn-gold"}
            `}
          >
            {isListening ? <><MicOff size={16} /> Stop Listening</> : <><Mic size={16} /> Tap to Speak</>}
          </button>

          {/* Quick Commands */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {["Plumber", "Electrician", "Cleaner", "Cook", "Driver"].map(cmd => (
              <button key={cmd} onClick={() => processCommand(cmd)}
                className="text-xs px-2.5 py-1 rounded-full border border-gold-700/30 text-gold-600 hover:text-gold-400 hover:border-gold-600/50 transition-all">
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

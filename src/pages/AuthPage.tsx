import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check, Upload, User, Briefcase } from "lucide-react";
import { useAuth, useToast } from "@/contexts/AppContext";
import { useLang } from "@/contexts/AppContext";
import { SERVICE_CATEGORIES } from "@/data/workers";
import FileUpload from "@/components/FileUpload";

type AuthMode = "login" | "signup" | "otp" | "forgot" | "reset";

const WORKER_STEPS = [
  "Personal Details", "Service & Skills", "Experience & Pricing",
  "Service Area", "ID Upload", "Profile Photo", "Review & Submit"
];

export default function AuthPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialRole = params.get("role") === "worker" ? "worker" : "customer";
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode as AuthMode);
  const [role, setRole] = useState<"customer" | "worker">(initialRole as "customer" | "worker");
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState(0); // worker registration step
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
    otp: ["","","","","",""],
    category: "", skills: [] as string[], experience: 0,
    hourlyRate: 300, visitCharge: 100, bio: "", city: "", area: "",
    languages: [] as string[], gender: "male"
  });

  const setField = (key: string, val: unknown) => setForm(prev => ({ ...prev, [key]: val }));

  const simulateLoading = (cb: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); cb(); }, 1200);
  };

  const handleLogin = () => {
    if (!form.email || !form.password) { toast("error", "Please fill in all fields"); return; }
    simulateLoading(() => {
      login({
        id: `u-${Date.now()}`,
        name: form.email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Demo User",
        email: form.email, phone: form.phone || "+91 9999999999",
        role: form.email.includes("admin") ? "admin" : "customer",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      });
      toast("success", "Welcome back!");
      navigate(form.email.includes("admin") ? "/admin" : "/dashboard");
    });
  };

  const handleSignup = () => {
    if (!form.name || !form.email || !form.password) { toast("error", "Please fill in all fields"); return; }
    if (form.password !== form.confirm) { toast("error", "Passwords do not match"); return; }
    if (role === "worker") { setMode("signup"); setStep(0); return; }
    setMode("otp");
  };

  const handleOTP = () => {
    const code = form.otp.join("");
    if (code.length !== 6) { toast("error", "Please enter 6-digit OTP"); return; }
    simulateLoading(() => {
      login({
        id: `u-${Date.now()}`,
        name: form.name, email: form.email, phone: form.phone,
        role, avatar: `https://randomuser.me/api/portraits/${form.gender === "female" ? "women" : "men"}/${Math.floor(Math.random() * 70) + 1}.jpg`,
      });
      toast("success", "Account created successfully!");
      navigate(role === "worker" ? "/worker-dashboard" : "/dashboard");
    });
  };

  const handleWorkerStep = () => {
    if (step < WORKER_STEPS.length - 1) { setStep(s => s + 1); }
    else {
      simulateLoading(() => {
        login({
          id: `w-${Date.now()}`, name: form.name, email: form.email, phone: form.phone,
          role: "worker", avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70) + 1}.jpg`,
        });
        toast("success", "Profile submitted for verification!");
        navigate("/worker-dashboard");
      });
    }
  };

  const LANGS = ["Hindi","English","Marathi","Bengali","Telugu","Tamil","Kannada","Gujarati"];

  const renderWorkerStep = () => {
    const sel = SERVICE_CATEGORIES.find(c => c.id === form.category);
    switch(step) {
      case 0: return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gold-500 mb-1 block">Full Name *</label>
              <input className="input-dark w-full" value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Your full name" /></div>
            <div><label className="text-sm text-gold-500 mb-1 block">Age</label>
              <input className="input-dark w-full" type="number" min={18} max={70} placeholder="25" /></div>
          </div>
          <div><label className="text-sm text-gold-500 mb-1 block">Phone *</label>
            <input className="input-dark w-full" value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+91 9XXXXXXXXX" /></div>
          <div><label className="text-sm text-gold-500 mb-1 block">Email *</label>
            <input className="input-dark w-full" type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="your@email.com" /></div>
          <div><label className="text-sm text-gold-500 mb-1 block">Gender</label>
            <div className="flex gap-3">
              {["male","female","other"].map(g => (
                <button key={g} onClick={() => setField("gender", g)}
                  className={`flex-1 py-2 rounded-xl text-sm capitalize border transition-all
                    ${form.gender === g ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
      case 1: return (
        <div className="space-y-4">
          <div><label className="text-sm text-gold-500 mb-2 block">Service Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {SERVICE_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setField("category", cat.id)}
                  className={`p-3 rounded-xl text-xs text-left border transition-all
                    ${form.category === cat.id ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                  <div className="text-lg mb-1">{cat.icon}</div>
                  <div className="font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>
          {sel && (
            <div><label className="text-sm text-gold-500 mb-2 block">Skills (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {(["Pipe Fitting","Leak Repair","Wiring","Switchboard","Furniture","Door Frame","Interior","Exterior","AC Service","Installation","Haircut","Facial","Daily Cook","Party Chef"]).map(skill => (
                  <button key={skill} onClick={() => setField("skills", form.skills.includes(skill) ? form.skills.filter(s => s !== skill) : [...form.skills, skill])}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all
                      ${form.skills.includes(skill) ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
      case 2: return (
        <div className="space-y-4">
          <div><label className="text-sm text-gold-500 mb-1 block">Years of Experience</label>
            <input className="input-dark w-full" type="number" min={0} max={50} value={form.experience} onChange={e => setField("experience", +e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gold-500 mb-1 block">Hourly Rate (₹)</label>
              <input className="input-dark w-full" type="number" value={form.hourlyRate} onChange={e => setField("hourlyRate", +e.target.value)} /></div>
            <div><label className="text-sm text-gold-500 mb-1 block">Visit Charge (₹)</label>
              <input className="input-dark w-full" type="number" value={form.visitCharge} onChange={e => setField("visitCharge", +e.target.value)} /></div>
          </div>
          <div><label className="text-sm text-gold-500 mb-1 block">Bio (Short Introduction)</label>
            <textarea className="input-dark w-full h-24 resize-none" value={form.bio} onChange={e => setField("bio", e.target.value)}
              placeholder="Tell customers about your experience and expertise..." /></div>
          <div><label className="text-sm text-gold-500 mb-2 block">Languages Spoken</label>
            <div className="flex flex-wrap gap-2">
              {LANGS.map(l => (
                <button key={l} onClick={() => setField("languages", form.languages.includes(l) ? form.languages.filter(x => x !== l) : [...form.languages, l])}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all
                    ${form.languages.includes(l) ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-4">
          <div><label className="text-sm text-gold-500 mb-2 block">City *</label>
            <select className="input-dark w-full" value={form.city} onChange={e => setField("city", e.target.value)}>
              <option value="">Select City</option>
              {["Delhi","Mumbai","Bengaluru","Hyderabad","Chennai","Pune","Kolkata","Jaipur","Lucknow","Ahmedabad","Indore","Bhopal"].map(c => (
                <option key={c} value={c} className="bg-ink-800">{c}</option>
              ))}
            </select>
          </div>
          <div><label className="text-sm text-gold-500 mb-1 block">Area / Locality *</label>
            <input className="input-dark w-full" value={form.area} onChange={e => setField("area", e.target.value)} placeholder="e.g. Koramangala, Bandra West" /></div>
          <div><label className="text-sm text-gold-500 mb-1 block">Service Radius</label>
            <div className="flex items-center gap-4">
              <input type="range" min={1} max={30} defaultValue={10} className="flex-1 accent-yellow-500" />
              <span className="text-gold-400 font-semibold w-16 text-right">10 km</span>
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-4">
          <p className="text-gold-600 text-sm">Upload government-issued ID for verification (Aadhaar, PAN, Voter ID).</p>
          <FileUpload accept="image/*,.pdf" multiple={false} maxSizeMB={5} label="Government ID (Front)" hint="JPG, PNG or PDF • max 5MB" />
          <FileUpload accept="image/*,.pdf" multiple={false} maxSizeMB={5} label="Government ID (Back)" hint="JPG, PNG or PDF • max 5MB" />
        </div>
      );
      case 5: return (
        <div className="space-y-4">
          <p className="text-gold-600 text-sm">Upload a clear professional photo in work uniform. Optional: add a short intro video (max 2 min).</p>
          <FileUpload accept="image/*" multiple={false} maxSizeMB={10} label="Profile Photo *" hint="Clear face photo in work uniform" />
          <FileUpload accept="video/*" multiple={false} maxSizeMB={100} label="Intro Video (Optional)" hint="Short 30–120 sec intro • MP4 preferred" />
        </div>
      );
      case 6: return (
        <div className="space-y-4">
          <div className="glass-card p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gold-700">Name</span><span className="text-gold-400 font-medium">{form.name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Category</span><span className="text-gold-400 font-medium">{SERVICE_CATEGORIES.find(c => c.id === form.category)?.name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Experience</span><span className="text-gold-400 font-medium">{form.experience} years</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Hourly Rate</span><span className="text-gold-400 font-medium">₹{form.hourlyRate}/hr</span></div>
            <div className="flex justify-between"><span className="text-gold-700">City</span><span className="text-gold-400 font-medium">{form.city || "—"}</span></div>
          </div>
          <div className="glass-card p-4 text-sm">
            <p className="text-gold-500 font-medium mb-2">What happens next?</p>
            <ul className="space-y-1 text-gold-700">
              {["Your profile will be reviewed within 24 hours","ID verification takes 1–2 business days","You will receive SMS/email confirmation","Your profile goes live after approval"].map((item, i) => (
                <li key={i} className="flex items-start gap-2"><Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      );
      default: return null;
    }
  };

  // Worker Registration Flow
  if (mode === "signup" && role === "worker") {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="glass-card p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-2xl text-gold-400">Worker Registration</h2>
                <span className="text-gold-700 text-sm">{step + 1}/{WORKER_STEPS.length}</span>
              </div>
              {/* Progress */}
              <div className="flex gap-1 mb-2">
                {WORKER_STEPS.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-gold-gradient" : "bg-ink-600"}`} />
                ))}
              </div>
              <p className="text-gold-600 text-sm font-medium">{WORKER_STEPS[step]}</p>
            </div>

            {renderWorkerStep()}

            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="btn-outline-gold py-3 px-4 flex items-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button onClick={handleWorkerStep} disabled={loading}
                className="btn-gold flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-ink-900/50 border-t-ink-900 rounded-full animate-spin" /> :
                  step === WORKER_STEPS.length - 1 ? <><Check size={16} />Submit Profile</> : <>Next <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://cdn-ai.onspace.ai/onspace/project/uploads/QSQEi3RybKcDdBBTRJksEx/logo.jpg"
            alt="KaamPehechan" className="w-16 h-16 rounded-full object-cover border-2 border-gold-700/30 mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl gold-text">
            {mode === "login" ? "Welcome Back" : mode === "otp" ? "Verify OTP" : mode === "forgot" ? "Reset Password" : "Create Account"}
          </h1>
        </div>

        <div className="glass-card p-8">
          {/* Role Selector (signup) */}
          {mode === "signup" && (
            <div className="flex gap-3 mb-6">
              {[
                { id: "customer", label: t.asCustomer, icon: <User size={16} /> },
                { id: "worker", label: t.asWorker, icon: <Briefcase size={16} /> },
              ].map(r => (
                <button key={r.id} onClick={() => setRole(r.id as "customer" | "worker")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all
                    ${role === r.id ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          )}

          {/* OTP Screen */}
          {mode === "otp" ? (
            <div className="space-y-6">
              <p className="text-gold-600 text-sm text-center">Enter the 6-digit code sent to <strong className="text-gold-400">{form.email}</strong></p>
              <div className="flex gap-2 justify-center">
                {form.otp.map((digit, i) => (
                  <input key={i} type="text" maxLength={1} value={digit}
                    className="w-12 h-12 text-center text-xl font-bold input-dark rounded-xl"
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      const newOtp = [...form.otp]; newOtp[i] = val;
                      setField("otp", newOtp);
                      if (val && i < 5) (document.querySelectorAll(".otp-input")[i + 1] as HTMLInputElement)?.focus();
                    }}
                    onKeyDown={e => { if (e.key === "Backspace" && !digit && i > 0) (document.querySelectorAll(".otp-input")[i - 1] as HTMLInputElement)?.focus(); }} />
                ))}
              </div>
              <button onClick={handleOTP} disabled={loading} className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-ink-900/50 border-t-ink-900 rounded-full animate-spin" /> : t.verifyOTP}
              </button>
              <p className="text-center text-gold-700 text-sm">Didn't receive it? <button className="text-gold-400 hover:text-gold-300" onClick={() => toast("info", "OTP resent!")}>{t.resendOTP}</button></p>
            </div>
          ) : mode === "forgot" ? (
            <div className="space-y-4">
              <input className="input-dark w-full" type="email" placeholder={t.emailOrPhone} />
              <button className="btn-gold w-full py-3">Send Reset Link</button>
              <button onClick={() => setMode("login")} className="w-full text-center text-gold-700 text-sm hover:text-gold-400 transition-colors flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-sm text-gold-500 mb-1 block">Full Name</label>
                  <input className="input-dark w-full" value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Your full name" />
                </div>
              )}
              <div>
                <label className="text-sm text-gold-500 mb-1 block">{t.emailOrPhone}</label>
                <input className="input-dark w-full" type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-sm text-gold-500 mb-1 block">{t.password}</label>
                <div className="relative">
                  <input className="input-dark w-full pr-10" type={showPwd ? "text" : "password"} value={form.password} onChange={e => setField("password", e.target.value)} placeholder="••••••••" />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-700 hover:text-gold-400">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {mode === "signup" && (
                <div>
                  <label className="text-sm text-gold-500 mb-1 block">{t.confirmPassword}</label>
                  <input className="input-dark w-full" type="password" value={form.confirm} onChange={e => setField("confirm", e.target.value)} placeholder="••••••••" />
                </div>
              )}
              {mode === "login" && (
                <div className="text-right">
                  <button onClick={() => setMode("forgot")} className="text-xs text-gold-600 hover:text-gold-400">{t.forgotPassword}</button>
                </div>
              )}
              <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}
                className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <div className="w-4 h-4 border-2 border-ink-900/50 border-t-ink-900 rounded-full animate-spin" /> :
                  mode === "login" ? t.login : t.signup}
              </button>
              <p className="text-center text-gold-700 text-sm">
                {mode === "login" ? t.dontHaveAccount : t.alreadyHaveAccount}{" "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-gold-400 hover:text-gold-300 font-medium">
                  {mode === "login" ? t.signup : t.login}
                </button>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-gold-700/60 text-xs mt-6">
          By continuing, you agree to KaamPehechan's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

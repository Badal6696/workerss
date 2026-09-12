import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, CreditCard, Smartphone, Banknote } from "lucide-react";
import { getWorkerById } from "@/data/workers";
import { useLang, useToast } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";

const TIME_SLOTS = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"];
const SERVICES: Record<string, string[]> = {
  plumbing: ["Pipe Leak Repair","Tap/Faucet Replacement","Drain Cleaning","Water Heater Service","Bathroom Fixture"],
  electrical: ["Switch/Socket Repair","Fan Installation","Wiring Work","MCB/Fuse Fix","LED Light Fitting"],
  cleaning: ["Full Home Cleaning","Kitchen Deep Clean","Bathroom Cleaning","Sofa/Carpet Cleaning","Move-in/Move-out"],
  default: ["Standard Service","Inspection & Quotation","Emergency Repair","Installation","Maintenance Visit"],
};

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) };
  });
}

export default function BookingFlow() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const worker = getWorkerById(id || "");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingId] = useState(`BK${Date.now().toString().slice(-8)}`);

  const [booking, setBooking] = useState({
    service: "", date: getNext7Days()[0].date, time: "", address: "",
    description: "", payMethod: "upi",
  });

  const setF = (k: string, v: string) => setBooking(prev => ({ ...prev, [k]: v }));

  if (!worker) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-gold-400">Worker not found. <Link to="/browse" className="underline">Browse all</Link></p></div>;

  const services = SERVICES[worker.categoryId] || SERVICES.default;
  const days = getNext7Days();
  const visitFee = worker.visitCharge;
  const serviceFee = booking.service ? worker.hourlyRate : 0;
  const platformFee = Math.round((visitFee + serviceFee) * 0.05);
  const gst = Math.round((visitFee + serviceFee + platformFee) * 0.18);
  const total = visitFee + serviceFee + platformFee + gst;

  const STEPS = [t.selectDate, t.yourAddress, "Job Details", t.priceBreakdown, "Payment", "Confirmed"];

  const handleNext = () => {
    if (step === 0 && !booking.time) { toast("error", "Please select a time slot"); return; }
    if (step === 1 && !booking.address) { toast("error", "Please enter your address"); return; }
    if (step === 4) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep(5); }, 1800);
      return;
    }
    if (step < STEPS.length - 2) setStep(s => s + 1);
  };

  if (step === 5) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="glass-card p-10 animate-scale-in">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500/30">
            <Check size={40} className="text-emerald-400" />
          </div>
          <h1 className="font-display font-bold text-3xl text-emerald-400 mb-2">{t.bookingConfirmed}</h1>
          <p className="text-gold-600 mb-6">Your booking has been placed successfully. {worker.name} will confirm shortly.</p>
          <div className="bg-ink-800 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gold-700">{t.bookingId}</span><span className="text-gold-400 font-bold">{bookingId}</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Worker</span><span className="text-gold-400">{worker.name}</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Service</span><span className="text-gold-400">{booking.service || "Standard Service"}</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Date & Time</span><span className="text-gold-400">{booking.date} {booking.time}</span></div>
            <div className="flex justify-between"><span className="text-gold-700">Total</span><span className="text-gold-400 font-bold">{formatCurrency(total)}</span></div>
          </div>
          <div className="space-y-3">
            {["Booking Received","Worker Notified","Confirmation Pending","Worker En Route","Job In Progress","Completed"].map((stage, i) => (
              <div key={stage} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${i <= 1 ? "bg-emerald-500 text-white" : "bg-ink-600 text-gold-700"}`}>
                  {i <= 1 ? <Check size={14} /> : i + 1}
                </div>
                <div className={`h-0.5 flex-1 ${i < 1 ? "bg-emerald-500" : "bg-ink-600"}`} />
                <span className={`text-xs w-28 text-right ${i <= 1 ? "text-gold-400" : "text-gold-700"}`}>{stage}</span>
              </div>
            ))}
          </div>
          <Link to="/dashboard" className="btn-gold w-full py-3 mt-8 block text-center">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container max-w-2xl">
        {/* Progress */}
        <div className="py-6">
          <div className="flex items-center gap-1 mb-4 overflow-x-auto no-scrollbar">
            {STEPS.slice(0, 5).map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-gold-gradient text-ink-900" : "bg-ink-700 text-gold-700"}`}>
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                {i < STEPS.length - 2 && <div className={`w-6 h-0.5 ${i < step ? "bg-emerald-500" : "bg-ink-600"}`} />}
              </div>
            ))}
          </div>
          <h2 className="font-display font-bold text-2xl text-gold-400">{STEPS[step]}</h2>
        </div>

        {/* Worker Summary */}
        <div className="glass-card p-4 flex gap-3 items-center mb-6">
          <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="font-semibold text-gold-300">{worker.name}</div>
            <div className="text-gold-700 text-xs">{worker.category} • {worker.city}</div>
          </div>
          <div className="text-gold-400 text-sm font-bold">{formatCurrency(worker.hourlyRate)}/hr</div>
        </div>

        <div className="glass-card p-6 mb-6">
          {/* Step 0: Date & Time */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gold-500 mb-3 block font-medium">Select Service</label>
                <div className="grid grid-cols-1 gap-2">
                  {services.map(s => (
                    <button key={s} onClick={() => setF("service", s)}
                      className={`px-4 py-3 rounded-xl text-sm text-left border transition-all ${booking.service === s ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gold-500 mb-3 block font-medium">{t.selectDate}</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {days.map(d => (
                    <button key={d.date} onClick={() => setF("date", d.date)}
                      className={`flex-shrink-0 px-4 py-3 rounded-xl text-xs border transition-all ${booking.date === d.date ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gold-500 mb-3 block font-medium">{t.selectTime}</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} onClick={() => setF("time", slot)}
                      className={`py-2.5 rounded-xl text-xs border transition-all ${booking.time === slot ? "border-gold-600 bg-gold-700/10 text-gold-400" : "border-ink-500 text-gold-700 hover:border-gold-700"}`}>
                      <Clock size={11} className="inline mr-1" />{slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gold-500 mb-2 block">{t.yourAddress} *</label>
                <textarea className="input-dark w-full h-24 resize-none" value={booking.address} onChange={e => setF("address", e.target.value)}
                  placeholder="House No, Street, Area, City, Pincode" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Home","Work","Hotel","Other"].map(type => (
                  <button key={type} className="py-2.5 glass-card text-sm text-gold-600 hover:border-gold-700/40 transition-all flex items-center justify-center gap-2">
                    <MapPin size={13} />{type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gold-500 mb-2 block">{t.jobDescription}</label>
                <textarea className="input-dark w-full h-28 resize-none" value={booking.description} onChange={e => setF("description", e.target.value)}
                  placeholder="Describe the problem in detail. e.g. 'Kitchen tap is leaking at the joint. Need replacement.'" />
              </div>
              <FileUpload accept="image/*,video/*" multiple label="Photos/Videos (optional)" hint="Add photos to help the worker understand the issue" />
            </div>
          )}

          {/* Step 3: Price Breakdown */}
          {step === 3 && (
            <div className="space-y-3">
              {[
                { label: "Visit Charge", value: visitFee },
                { label: `Service (${booking.service || "Standard"})`, value: serviceFee },
                { label: t.platformFee + " (5%)", value: platformFee },
                { label: t.taxes, value: gst },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gold-600 text-sm">{item.label}</span>
                  <span className="text-gold-400 font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-gold-400 font-bold">{t.total}</span>
                <span className="font-display font-bold text-2xl gold-text">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="font-display font-bold text-3xl gold-text">{formatCurrency(total)}</div>
                <p className="text-gold-700 text-sm">Total amount to pay</p>
              </div>
              {[
                { id: "upi", icon: <Smartphone size={18} />, label: "UPI (GPay, PhonePe, Paytm)", desc: "Instant payment via UPI ID" },
                { id: "card", icon: <CreditCard size={18} />, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
                { id: "cash", icon: <Banknote size={18} />, label: t.payLater, desc: "Pay in cash after job done" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setF("payMethod", opt.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                    ${booking.payMethod === opt.id ? "border-gold-600 bg-gold-700/10" : "border-ink-500 hover:border-gold-700"}`}>
                  <div className={`p-2 rounded-lg ${booking.payMethod === opt.id ? "bg-gold-700/20 text-gold-400" : "bg-ink-700 text-gold-700"}`}>{opt.icon}</div>
                  <div>
                    <div className={`font-medium text-sm ${booking.payMethod === opt.id ? "text-gold-400" : "text-gold-600"}`}>{opt.label}</div>
                    <div className="text-gold-700 text-xs">{opt.desc}</div>
                  </div>
                  <div className={`ml-auto w-4 h-4 rounded-full border-2 ${booking.payMethod === opt.id ? "border-gold-600 bg-gold-600" : "border-ink-500"}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="btn-outline-gold py-3 px-5 flex items-center gap-2"><ArrowLeft size={16} /> Back</button>}
          <button onClick={handleNext} disabled={loading} className="btn-gold flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-ink-900/50 border-t-ink-900 rounded-full animate-spin" /> :
              step === 4 ? <><Check size={16} /> Confirm & Pay {formatCurrency(total)}</> : <>Next <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Mail, Phone, MapPin, Send } from "lucide-react";
import { FAQS } from "@/data/mockData";
import { useToast } from "@/contexts/AppContext";

// ─── About Page ────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container">
        {/* Hero */}
        <div className="py-16 text-center">
          <img src="https://cdn-ai.onspace.ai/onspace/project/uploads/QSQEi3RybKcDdBBTRJksEx/logo.jpg"
            alt="KaamPehechan" className="w-20 h-20 rounded-full object-cover border-2 border-gold-700/30 mx-auto mb-6 shadow-gold" />
          <h1 className="font-display font-bold text-4xl md:text-5xl gold-text mb-4">Our Mission</h1>
          <p className="text-gold-500 text-lg max-w-2xl mx-auto leading-relaxed">
            KaamPehechan was founded on one simple belief: every skilled worker deserves recognition, and every customer deserves trust. We bridge the gap between India's vast workforce of skilled professionals and the millions of households that need them.
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="glass-card p-8">
            <h2 className="font-display font-bold text-2xl text-gold-400 mb-4">The Problem We Solve</h2>
            <p className="text-gold-600 leading-relaxed mb-4">Today, finding a reliable plumber means calling multiple contacts, hoping someone picks up. A homeowner needing a cook for the evening has no way to verify credentials or compare prices. Meanwhile, millions of skilled workers in India have no digital identity.</p>
            <p className="text-gold-600 leading-relaxed">KaamPehechan solves this by creating a verified digital identity (ID card) for every worker — combining Aadhaar verification, skill certification, customer reviews and police clearance — so customers can hire with complete confidence.</p>
          </div>
          <div className="glass-card p-8">
            <h2 className="font-display font-bold text-2xl text-gold-400 mb-4">What We Believe</h2>
            <div className="space-y-4">
              {[
                { icon: "🪪", title: "Identity Matters", desc: "Every worker deserves a verified digital identity that travels with them." },
                { icon: "🤝", title: "Trust is Built, Not Assumed", desc: "Multi-layer verification before any worker goes live on the platform." },
                { icon: "💰", title: "Fair Earnings", desc: "Workers set their own rates. We just help them find the right customers." },
                { icon: "🇮🇳", title: "Made for India", desc: "12+ cities, 4 languages, and growing. Built for every corner of India." },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div><h4 className="text-gold-400 font-semibold text-sm">{item.title}</h4>
                    <p className="text-gold-700 text-xs leading-relaxed">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="font-display font-bold text-3xl gold-text text-center mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Aryan Kapoor", role: "Co-Founder & CEO", avatar: "https://randomuser.me/api/portraits/men/32.jpg", bio: "Ex-McKinsey, IIT Delhi" },
              { name: "Priya Nambiar", role: "Co-Founder & COO", avatar: "https://randomuser.me/api/portraits/women/44.jpg", bio: "Ex-Flipkart, IIM Ahmedabad" },
              { name: "Rahul Tiwari", role: "CTO", avatar: "https://randomuser.me/api/portraits/men/52.jpg", bio: "Ex-Google, BITS Pilani" },
              { name: "Ananya Singh", role: "Head of Growth", avatar: "https://randomuser.me/api/portraits/women/33.jpg", bio: "Ex-Urban Company, XLRI" },
            ].map(member => (
              <div key={member.name} className="glass-card-hover p-6 text-center">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-gold-700/20 mx-auto mb-3" />
                <h3 className="font-display font-semibold text-gold-400">{member.name}</h3>
                <p className="text-gold-500 text-sm">{member.role}</p>
                <p className="text-gold-700 text-xs mt-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Safety Page ───────────────────────────────────────────────────────────────
export function SafetyPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container max-w-4xl">
        <div className="py-12 text-center mb-8">
          <h1 className="font-display font-bold text-4xl gold-text mb-4">Safety & Verification</h1>
          <p className="text-gold-500 text-lg">Our 4-layer trust system ensures every worker is safe, skilled and reliable.</p>
        </div>
        {[
          { icon: "🪪", title: "Government ID Verification", badge: "Layer 1", desc: "Every worker submits a valid government-issued photo ID (Aadhaar, Voter ID, or Passport). Our system cross-verifies with UIDAI's database. No fake or duplicate IDs are accepted.", details: ["Aadhaar OTP verification","PAN card cross-check","Selfie liveness detection","Document fraud prevention"] },
          { icon: "🎓", title: "Skill Assessment & Certification", badge: "Layer 2", desc: "Workers complete a practical skill test assessed by industry-certified evaluators in their city. Only workers who pass are awarded the KaamPehechan Skill Certificate.", details: ["Practical test by industry experts","Trade-specific evaluation rubric","Skill badge displayed on profile","Re-assessment every 2 years"] },
          { icon: "🚔", title: "Police Verification", badge: "Layer 3", desc: "For certain high-trust categories (home nursing, security, elder care, baby care), workers must submit a police verification certificate. We assist with the application process.", details: ["Mandatory for 8 categories","Accepted from any state police","Digital verification on profile","Renewed annually"] },
          { icon: "🛡️", title: "Liability Insurance", badge: "Layer 4", desc: "All workers on the platform are covered by our group liability insurance policy. If a worker causes accidental damage or injury during a job, you are financially protected.", details: ["Coverage up to ₹5 lakh per incident","No excess for customers","Claim process within 48 hrs","Underwritten by leading insurer"] },
        ].map(item => (
          <div key={item.title} className="glass-card p-6 mb-6">
            <div className="flex items-start gap-5 flex-wrap">
              <div className="text-4xl w-12 text-center">{item.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display font-bold text-xl text-gold-400">{item.title}</h2>
                  <span className="badge-gold text-xs">{item.badge}</span>
                </div>
                <p className="text-gold-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {item.details.map(d => (
                    <div key={d} className="flex items-center gap-2 text-xs text-gold-600">
                      <span className="text-emerald-400">✓</span>{d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Help / FAQ Page ───────────────────────────────────────────────────────────
export function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container max-w-3xl">
        <div className="py-12 text-center mb-8">
          <h1 className="font-display font-bold text-4xl gold-text mb-4">Help & FAQ</h1>
          <p className="text-gold-500">Find answers to the most common questions</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-gold-400 pr-4">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-gold-600 flex-shrink-0" /> : <ChevronDown size={18} className="text-gold-700 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gold-600 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="glass-card p-8 mt-8 text-center">
          <h3 className="font-display font-semibold text-xl text-gold-400 mb-2">Still need help?</h3>
          <p className="text-gold-700 mb-4">Our support team is available 7 days a week, 8 AM to 10 PM</p>
          <Link to="/contact" className="btn-gold px-8 py-3 inline-block">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Page ──────────────────────────────────────────────────────────────
export function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container max-w-4xl">
        <div className="py-12 text-center mb-8">
          <h1 className="font-display font-bold text-4xl gold-text mb-4">Contact Us</h1>
          <p className="text-gold-500">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: <Phone size={18} />, title: "Phone", value: "1800-KP-INDIA", sub: "Toll-free, 8 AM–10 PM" },
              { icon: <Mail size={18} />, title: "Email", value: "support@kaampehchan.in", sub: "24hr response" },
              { icon: <MapPin size={18} />, title: "Office", value: "MG Road, Bengaluru", sub: "Karnataka – 560001" },
            ].map(item => (
              <div key={item.title} className="glass-card p-5 flex gap-4 items-start">
                <div className="w-10 h-10 bg-gold-700/20 rounded-xl flex items-center justify-center text-gold-500 flex-shrink-0">{item.icon}</div>
                <div><h4 className="font-medium text-gold-400 text-sm">{item.title}</h4>
                  <p className="text-gold-500 text-sm">{item.value}</p>
                  <p className="text-gold-700 text-xs">{item.sub}</p></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display font-semibold text-xl text-gold-400 mb-5">Send a Message</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gold-600 mb-1 block">Your Name</label>
                  <input className="input-dark w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
                <div><label className="text-xs text-gold-600 mb-1 block">Email</label>
                  <input className="input-dark w-full" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" /></div>
              </div>
              <div><label className="text-xs text-gold-600 mb-1 block">Subject</label>
                <input className="input-dark w-full" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" /></div>
              <div><label className="text-xs text-gold-600 mb-1 block">Message</label>
                <textarea className="input-dark w-full h-32 resize-none" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your query in detail..." /></div>
              <button onClick={() => { if (!form.name || !form.email || !form.message) { toast("error", "Please fill all fields"); return; } toast("success", "Message sent! We'll reply within 24 hours."); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="btn-gold w-full py-3 flex items-center justify-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Page ──────────────────────────────────────────────────────────────
export function PricingPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="page-container max-w-4xl">
        <div className="py-12 text-center mb-8">
          <h1 className="font-display font-bold text-4xl gold-text mb-4">Transparent Pricing</h1>
          <p className="text-gold-500 text-lg">No hidden charges. Workers set their own rates.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "For Customers", price: "Free", desc: "Searching, comparing and booking is completely free for customers.", features: ["Browse unlimited profiles","View verified IDs & reviews","Instant booking","Secure payment protection","Satisfaction guarantee","24/7 support access"] },
            { title: "For Workers", price: "5%", desc: "Workers keep 95% of every job. Only a small platform fee is charged.", features: ["Free profile & verification","Unlimited job requests","Digital ID card included","Payment within 24 hrs","Performance analytics","Worker support line"], highlight: true },
            { title: "Premium Worker", price: "₹499/mo", desc: "Boost visibility and get priority placement in search results.", features: ["Top of search results","Priority job matching","Featured badge on profile","Advanced analytics","Dedicated account manager","Early access to new features"] },
          ].map(plan => (
            <div key={plan.title} className={`glass-card p-6 ${plan.highlight ? "border-gold-600/40 shadow-gold" : ""}`}>
              {plan.highlight && <div className="text-xs text-center badge-gold mb-3 mx-auto w-fit">Most Popular</div>}
              <h3 className="font-display font-bold text-xl text-gold-400 mb-1">{plan.title}</h3>
              <div className="font-display font-bold text-4xl gold-text mb-2">{plan.price}</div>
              <p className="text-gold-700 text-xs mb-4 leading-relaxed">{plan.desc}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gold-600">
                    <span className="text-emerald-400 text-xs">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? "btn-gold" : "btn-outline-gold"}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 404 Page ──────────────────────────────────────────────────────────────────
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="animate-fade-in">
        <div className="font-display font-bold text-9xl gold-text opacity-20 mb-4">404</div>
        <h1 className="font-display font-bold text-4xl text-gold-400 mb-4">Page Not Found</h1>
        <p className="text-gold-600 text-lg mb-8 max-w-md mx-auto">Looks like this page has gone out for a job. Let's get you back on track.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate(-1)} className="btn-outline-gold px-6 py-3">Go Back</button>
          <Link to="/" className="btn-gold px-6 py-3">Go Home</Link>
        </div>
      </div>
    </div>
  );
}

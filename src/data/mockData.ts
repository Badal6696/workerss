import { WORKERS } from "./workers";

export interface Customer {
  id: string; name: string; email: string; phone: string;
  avatar: string; city: string; joinDate: string;
  totalBookings: number; totalSpent: number;
}

export interface Booking {
  id: string; customerId: string; workerId: string;
  service: string; status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  date: string; time: string; address: string;
  price: number; paymentMethod: string; paymentStatus: "paid" | "pending";
  description: string; rating?: number; review?: string;
  createdAt: string;
}

export interface EarningsPoint { month: string; earnings: number; jobs: number; }

// Seeded RNG for mock data
function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296; };
}
const r = seededRand(99);
const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;

const CUSTOMER_NAMES = [
  "Ananya Sharma","Rohan Gupta","Pooja Mehta","Kiran Reddy","Aditya Singh","Shalini Kumar",
  "Neeraj Joshi","Divya Pillai","Varun Nair","Kavya Patel","Arjun Iyer","Ishaan Verma",
  "Preethi Nambiar","Rohit Dubey","Sneha Chauhan","Tarun Malhotra","Ritu Saxena","Harsh Agarwal",
  "Meenal Bhatt","Vikash Rao","Shruti Sinha","Aakash Pandey","Neha Tiwari","Sumit Shukla",
  "Pallavi Mishra","Dhruv Rajan","Isha Tandon","Manav Kaur","Tanya Bose","Nikhil Das",
];

export const CUSTOMERS: Customer[] = Array.from({ length: 200 }, (_, i) => ({
  id: `cust-${i + 1}`,
  name: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length],
  email: `user${i + 1}@example.com`,
  phone: `+91 ${9000000000 + i}`,
  avatar: `https://randomuser.me/api/portraits/${r() > 0.5 ? "women" : "men"}/${(i * 3) % 70 + 1}.jpg`,
  city: ["Delhi","Mumbai","Bengaluru","Hyderabad","Pune"][i % 5],
  joinDate: new Date(Date.now() - ri(30, 730) * 86400000).toISOString().split("T")[0],
  totalBookings: ri(1, 25),
  totalSpent: ri(500, 15000),
}));

const ADDRESSES = [
  "42, MG Road, Koramangala, Bengaluru","B-12, Sector 15, Dwarka, New Delhi",
  "Flat 304, Hiranandani Gardens, Powai, Mumbai","House 7, Banjara Hills, Hyderabad",
  "3rd Floor, Kalyani Nagar, Pune","32/A, Salt Lake Sector V, Kolkata",
];

const SERVICES = ["Plumbing Repair","Electrical Wiring","Home Cleaning","AC Service","Beauty at Home","Carpentry Work","Cook for Party","Packers & Movers","CCTV Installation","Pest Control"];
const PAY_METHODS = ["UPI","Credit Card","Debit Card","Cash","Net Banking"];
const STATUSES: Booking["status"][] = ["pending","accepted","in_progress","completed","completed","completed","completed","cancelled"];

export const BOOKINGS: Booking[] = Array.from({ length: 400 }, (_, i) => {
  const worker = WORKERS[i % WORKERS.length];
  const status = STATUSES[i % STATUSES.length];
  const daysAgo = ri(0, 180);
  const price = worker.visitCharge + ri(200, 1500);
  return {
    id: `BK${String(1000 + i).padStart(6, "0")}`,
    customerId: `cust-${(i % 200) + 1}`,
    workerId: worker.id,
    service: SERVICES[i % SERVICES.length],
    status,
    date: new Date(Date.now() - daysAgo * 86400000).toISOString().split("T")[0],
    time: `${ri(8, 19)}:${r() > 0.5 ? "00" : "30"}`,
    address: ADDRESSES[i % ADDRESSES.length],
    price,
    paymentMethod: PAY_METHODS[i % PAY_METHODS.length],
    paymentStatus: status === "completed" ? "paid" : "pending",
    description: `Need ${SERVICES[i % SERVICES.length].toLowerCase()} done at home.`,
    rating: status === "completed" ? ri(4, 5) : undefined,
    review: status === "completed" ? "Very good service, highly recommended." : undefined,
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  };
});

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const EARNINGS_DATA: EarningsPoint[] = MONTHS.map((month, i) => ({
  month,
  earnings: 8000 + i * 1200 + ri(500, 3000),
  jobs: 15 + i * 2 + ri(2, 8),
}));

export const PLATFORM_STATS = {
  totalWorkers: 1080,
  verifiedWorkers: 984,
  citiesServed: 12,
  totalBookings: 48320,
  completedJobs: 43190,
  happyCustomers: 28740,
  avgRating: 4.4,
  totalRevenue: 18540000,
};

export const TESTIMONIALS = [
  { id: 1, name: "Neha Agarwal", city: "Delhi", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 5, text: "Found an amazing plumber within minutes! He arrived in under 20 minutes and fixed the leak perfectly. This platform is a lifesaver.", service: "Plumbing" },
  { id: 2, name: "Rohan Khanna", city: "Mumbai", avatar: "https://randomuser.me/api/portraits/men/32.jpg", rating: 5, text: "Booked a home chef for my mother's birthday party. The food was incredible and the presentation was top-notch. Guests were impressed!", service: "Cook & Chef" },
  { id: 3, name: "Priya Menon", city: "Bengaluru", avatar: "https://randomuser.me/api/portraits/women/67.jpg", rating: 5, text: "The beauty professional came home and did my sister's bridal makeup. She looked stunning! Punctual, skilled, and very professional.", service: "Beauty & Salon" },
  { id: 4, name: "Arjun Reddy", city: "Hyderabad", avatar: "https://randomuser.me/api/portraits/men/55.jpg", rating: 5, text: "Used the tutor service for my daughter's math coaching. Remarkable improvement in just 3 months. Will continue for sure.", service: "Tutors & Trainers" },
  { id: 5, name: "Anita Desai", city: "Pune", avatar: "https://randomuser.me/api/portraits/women/23.jpg", rating: 5, text: "Booked packers and movers for our home shifting. Professional team, handled everything with care. Not a single item was damaged!", service: "Packers & Movers" },
];

export const HOW_IT_WORKS = [
  { step: 1, title: "Search & Filter", desc: "Enter what you need and your location. Filter by rating, price, availability and more.", icon: "🔍" },
  { step: 2, title: "Compare Profiles", desc: "View verified digital ID cards, work galleries, reviews and transparent pricing.", icon: "👤" },
  { step: 3, title: "Book Instantly", desc: "Choose a date and time slot. Describe the job and confirm your booking in seconds.", icon: "📅" },
  { step: 4, title: "Job Done & Pay", desc: "Track the worker in real-time. Pay securely after the job is completed to your satisfaction.", icon: "✅" },
];

export const FAQS = [
  { q: "How are workers verified on KaamPehechan?", a: "Every worker goes through a 4-step verification: Government ID check, skill assessment, police verification (for eligible categories), and insurance enrollment. You can see verification badges on each worker's profile." },
  { q: "What if I am not satisfied with the service?", a: "Your satisfaction is our priority. If you are not happy with the service, you can raise a dispute within 24 hours of job completion. Our support team resolves issues within 48 hours and provides a full refund or redo if warranted." },
  { q: "How is pricing calculated?", a: "Workers set their own rates (hourly and per-visit), which are clearly displayed on their profiles. You get a full price breakdown before confirming any booking. No hidden charges." },
  { q: "Can I book a worker for recurring services?", a: "Yes! You can set up recurring bookings for daily, weekly or monthly services. Preferred workers can be saved to your profile for quick re-booking." },
  { q: "What happens if a worker cancels last minute?", a: "In case of a worker cancellation within 2 hours of the job, we immediately find you the next available worker in the same category. You also receive a platform credit for the inconvenience." },
  { q: "Is it safe to let workers into my home?", a: "Safety is our top priority. All workers are police-verified (where applicable), ID-verified, and reviewed by real customers. Our in-app tracking and emergency contact feature is always active during a job." },
  { q: "How do I become a worker on KaamPehechan?", a: "Click 'Sign Up as Worker', complete the multi-step registration with your skills, experience, ID proof and a photo. After verification (usually within 24 hours), your profile goes live and you can start receiving job requests." },
  { q: "What payment methods are accepted?", a: "We accept UPI (Google Pay, PhonePe, Paytm), credit and debit cards, net banking, and cash on delivery. All digital payments are secured with 256-bit encryption." },
];

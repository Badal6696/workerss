import { calcDistance } from "@/lib/utils";

// ─── Seeded RNG (Mulberry32) ──────────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(42);
const rand = () => rng();
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Review {
  id: string; reviewerName: string; reviewerAvatar: string;
  stars: number; date: string; text: string;
}

export interface Worker {
  id: string; name: string; gender: "male" | "female";
  age: number; avatar: string;
  category: string; categoryId: string;
  skillTags: string[];
  experience: number;
  city: string; locality: string; pincode: string;
  lat: number; lng: number;
  distance: number;
  availability: "available" | "busy" | "offline";
  responseTime: string;
  rating: number; reviewCount: number;
  jobsCompleted: number; repeatCustomerPct: number;
  badges: { idVerified: boolean; skillCertified: boolean; policeVerified: boolean; insured: boolean };
  hourlyRate: number; visitCharge: number;
  languages: string[];
  bio: string;
  gallery: string[];
  introVideo?: string;
  reviews: Review[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const SERVICE_CATEGORIES = [
  { id: "plumbing",       name: "Plumbing",             icon: "🔧", color: "#3B82F6", desc: "Pipe repairs, leaks, installations" },
  { id: "electrical",     name: "Electrical",           icon: "⚡", color: "#F59E0B", desc: "Wiring, fuse, switchboard" },
  { id: "carpentry",      name: "Carpentry",            icon: "🪚", color: "#8B5CF6", desc: "Furniture, doors, woodwork" },
  { id: "painting",       name: "Painting",             icon: "🖌️", color: "#EC4899", desc: "Interior, exterior, texture" },
  { id: "welding",        name: "Welding",              icon: "🔥", color: "#EF4444", desc: "Metal fabrication, grills" },
  { id: "masonry",        name: "Masonry & Tiling",     icon: "🧱", color: "#78716C", desc: "Brickwork, tiles, flooring" },
  { id: "ac_repair",      name: "AC & Appliance Repair",icon: "❄️", color: "#06B6D4", desc: "AC, washing machine, fridge" },
  { id: "beauty",         name: "Beauty & Salon",       icon: "💄", color: "#F472B6", desc: "Hair, makeup, skincare at home" },
  { id: "driver",         name: "Driver & Rides",       icon: "🚗", color: "#6366F1", desc: "Personal driver, outstation" },
  { id: "delivery",       name: "Delivery",             icon: "📦", color: "#F97316", desc: "Courier, grocery, parcel" },
  { id: "cleaning",       name: "Home Cleaning",        icon: "🧹", color: "#14B8A6", desc: "Deep clean, regular, bathroom" },
  { id: "pest_control",   name: "Pest Control",         icon: "🐛", color: "#84CC16", desc: "Termites, cockroach, rodent" },
  { id: "cook",           name: "Cook & Chef",          icon: "👨‍🍳", color: "#F59E0B", desc: "Daily cook, party chef, baking" },
  { id: "maid",           name: "Maid & Housekeeping",  icon: "🧺", color: "#A78BFA", desc: "Sweeping, utensils, laundry" },
  { id: "elder_care",     name: "Elder Care",           icon: "👴", color: "#F9A8D4", desc: "Patient care, medication, mobility" },
  { id: "baby_care",      name: "Baby Care",            icon: "👶", color: "#FCA5A5", desc: "Nanny, infant care, creche" },
  { id: "gardening",      name: "Gardening",            icon: "🌱", color: "#22C55E", desc: "Lawn, plants, landscape" },
  { id: "packers",        name: "Packers & Movers",     icon: "🚚", color: "#64748B", desc: "Home shifting, office moving" },
  { id: "laundry",        name: "Laundry",              icon: "👗", color: "#A855F7", desc: "Wash, dry, iron, folding" },
  { id: "tech_repair",    name: "Computer & Mobile",    icon: "💻", color: "#0EA5E9", desc: "Laptop, phone, data recovery" },
  { id: "cctv",           name: "CCTV & Security",      icon: "📷", color: "#DC2626", desc: "Camera install, biometric" },
  { id: "water_purifier", name: "Water Purifier",       icon: "💧", color: "#38BDF8", desc: "RO service, filter change" },
  { id: "tutor",          name: "Tutors & Trainers",    icon: "📚", color: "#818CF8", desc: "School, college, fitness" },
  { id: "event_helper",   name: "Event Helper",         icon: "🎉", color: "#FB923C", desc: "Decoration, catering, hosting" },
  { id: "tailor",         name: "Tailor",               icon: "🧵", color: "#E879F9", desc: "Stitching, alteration, design" },
  { id: "photographer",   name: "Photographer",         icon: "📸", color: "#FBBF24", desc: "Events, portraits, video" },
  { id: "security_guard", name: "Security Guard",       icon: "🛡️", color: "#475569", desc: "Building, event, night watch" },
  { id: "nursing",        name: "Nursing & Healthcare", icon: "🏥", color: "#F43F5E", desc: "IV, wound care, injection" },
  { id: "home_repair",    name: "General Home Repair",  icon: "🏠", color: "#C9A84C", desc: "Handyman, fixture, general" },
];

const CITIES = [
  { name: "Delhi", localities: ["Connaught Place","Lajpat Nagar","Saket","Dwarka","Rohini","Karol Bagh","Janakpuri","Vasant Kunj","Greater Kailash","Pitampura"], lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", localities: ["Bandra","Andheri","Powai","Dadar","Thane","Borivali","Malad","Kurla","Worli","Juhu"], lat: 19.0760, lng: 72.8777 },
  { name: "Bengaluru", localities: ["Koramangala","Whitefield","Indiranagar","Jayanagar","HSR Layout","BTM Layout","Marathahalli","Rajajinagar","Bannerghatta","Yelahanka"], lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", localities: ["Banjara Hills","Gachibowli","Madhapur","Secunderabad","Kukatpally","LB Nagar","Dilsukhnagar","Ameerpet","HITEC City","Kondapur"], lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", localities: ["T. Nagar","Anna Nagar","Adyar","Velachery","Tambaram","Porur","Nungambakkam","Mylapore","Perambur","Kodambakkam"], lat: 13.0827, lng: 80.2707 },
  { name: "Pune", localities: ["Koregaon Park","Baner","Viman Nagar","Kothrud","Hadapsar","Wakad","Hinjewadi","Shivajinagar","Pimpri","Aundh"], lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata", localities: ["Park Street","Salt Lake","New Town","Behala","Dum Dum","Ballygunge","Gariahat","Rajarhat","Tollygunge","Kasba"], lat: 22.5726, lng: 88.3639 },
  { name: "Jaipur", localities: ["Malviya Nagar","Vaishali Nagar","Mansarovar","C-Scheme","Raja Park","Tonk Road","Bapu Nagar","Sanganer","Jagatpura","Gopalpura"], lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", localities: ["Gomti Nagar","Hazratganj","Indira Nagar","Aliganj","Alambagh","Mahanagar","Vikas Nagar","Ashiyana","Jankipuram","Chinhat"], lat: 26.8467, lng: 80.9462 },
  { name: "Ahmedabad", localities: ["Navrangpura","Satellite","Vastrapur","Bodakdev","Thaltej","Maninagar","Paldi","Naranpura","Gota","Ambawadi"], lat: 23.0225, lng: 72.5714 },
  { name: "Indore", localities: ["Vijay Nagar","Palasia","LIG Colony","Scheme 54","MG Road","Sudama Nagar","Bhawarkua","Rajendra Nagar","Annapurna Nagar","AB Road"], lat: 22.7196, lng: 75.8577 },
  { name: "Bhopal", localities: ["Arera Colony","Shahpura","Kolar Road","New Market","Ayodhya Bypass","Habibganj","Karond","Bairagarh","Misrod","TT Nagar"], lat: 23.2599, lng: 77.4126 },
];

const USER_LAT = 28.6139, USER_LNG = 77.2090; // Mock user in Delhi

const MALE_NAMES = [
  "Rahul Sharma","Amit Kumar","Suresh Patel","Vijay Singh","Ravi Gupta","Sanjay Mishra","Deepak Yadav","Manoj Tiwari","Rajesh Verma","Akash Joshi",
  "Pradeep Nair","Sunil Mehta","Kapil Dev","Anand Pillai","Vinod Rao","Kartik Reddy","Nikhil Jain","Rohit Chauhan","Vivek Pandey","Arjun Bose",
  "Saurabh Saxena","Arun Iyer","Vikram Malhotra","Harish Chandra","Santosh Dubey","Girish Kumar","Naveen Rajan","Ajay Tandon","Ritesh Patil","Dinesh Garg",
  "Manish Bhatt","Gaurav Srivastava","Hemant Shukla","Praveen Tripathi","Ramesh Upadhyay","Suresh Bhattacharya","Abhijit Das","Sourav Dey","Tapan Ghosh","Dipak Saha",
  "Biren Desai","Nilesh Shah","Parth Modi","Rushikesh Thakur","Tejas Kulkarni","Omkar Bhosale","Siddhant Kadam","Vaibhav Patil","Yash Kale","Ganesh Mane",
  "Sudhir Menon","Anil Mathew","George Thomas","Biju Philip","Renjith Krishnan","Sreejith Pillai","Dineshan Nambiar","Unnikrishnan Raj","Jithin Jose","Sajeev Mohan",
  "Ravi Shankar","Kannan Murugan","Selvam Arumugam","Saravanan Sundaram","Murugan Krishnan","Senthil Pandian","Balamurugan Raja","Pandiyarajan Kumar","Ganesan Thangavel","Karthikeyan Vel",
  "Shyam Babu","Ram Prasad","Lal Bahadur","Brijesh Kumar","Arvind Kushwaha","Yogendra Pal","Rajendra Maurya","Shailendra Prajapati","Sudhakar Bind","Virendra Yadav",
  "Zakir Hussain","Mohammad Irfan","Abdul Rehman","Faiyaz Khan","Tanveer Ahmad","Imtiyaz Ali","Salim Sheikh","Feroz Akhtar","Nasir Patel","Iqbal Mirza",
  "Gurpreet Singh","Harjinder Kaur","Paramjit Sandhu","Balvinder Gill","Jaswinder Bains","Kulwinder Dhaliwal","Satinder Sohal","Tejinder Mann","Maninder Khanna","Daljeet Randhawa",
];

const FEMALE_NAMES = [
  "Priya Sharma","Anita Gupta","Sunita Devi","Rekha Singh","Meena Patel","Geeta Yadav","Sushma Verma","Kavitha Nair","Lakshmi Menon","Radha Krishnan",
  "Deepa Reddy","Suma Bhat","Shanthi Pillai","Vani Iyer","Malathi Rao","Leela Devi","Bhavana Kumar","Ananya Joshi","Pallavi Mehta","Swati Shah",
  "Shreya Kulkarni","Pooja Patil","Rutuja Bhosale","Prachi Kadam","Sayali Desai","Madhuri Joshi","Aarti Thakur","Neha Gaikwad","Manasi Pawar","Vidya Chavan",
  "Rupa Chatterjee","Mita Das","Sandipa Ghosh","Madhurima Bose","Pamela Dey","Sreemoyee Saha","Tanushree Roy","Supriya Mukhopadhyay","Rituparna Banerjee","Aparajita Mukherjee",
  "Rashida Begum","Fatima Sheikh","Saira Bano","Zeenat Hussain","Nabeela Khan","Rukhsar Patel","Samrina Ali","Humera Mirza","Zulekha Ahmad","Tabassum Siddiqui",
  "Gurpreet Kaur","Harpreet Kaur","Manpreet Dhaliwal","Parminder Gill","Surjit Sandhu","Baljit Rangi","Navjot Bains","Jasleen Virdi","Simranpreet Kang","Tejinder Sohi",
  "Asha Lata","Champa Devi","Pushpa Rani","Savitri Devi","Kamlesh Kumari","Shobha Devi","Usha Rani","Beena Sharma","Reeta Jain","Sunanda Mishra",
  "Aishwarya Nambiar","Divya Thomas","Sini Mathew","Bindhu Pillai","Jyothi Krishnan","Anjali Nair","Remya Rajan","Soumya Philip","Vinitha Jose","Sindhu Mohan",
  "Kamala Venkatesh","Selvi Murugan","Geetha Sundaram","Vimala Pandian","Chandra Arumugam","Saraswathi Raja","Vijayalakshmi Kumar","Meenakshi Thangavel","Parvathi Vel","Savitha Krishnamurthy",
];

const SKILL_MAP: Record<string, string[]> = {
  plumbing: ["Pipe Fitting","Leak Repair","Bathroom Fixture","Drain Cleaning","Water Heater","Kitchen Plumbing","Shower Installation","Tank Repair","RO Installation","Motor Repair"],
  electrical: ["Wiring","Switchboard","Circuit Breaker","Ceiling Fan","LED Lighting","MCB Fitting","Earthing","Power Backup","CCTV Wiring","Solar Panel"],
  carpentry: ["Furniture Making","Door Frame","Wardrobe","Kitchen Cabinet","Wooden Flooring","Window Frame","Partitions","Modular Furniture","Repair & Polish","False Ceiling"],
  painting: ["Interior Paint","Exterior Paint","Texture Paint","Waterproofing","Wall Putty","Epoxy Flooring","POP Work","Spray Paint","Wood Polish","Grill Paint"],
  welding: ["Arc Welding","MIG Welding","TIG Welding","Gate Fabrication","Grill Making","Metal Cutting","Structural Welding","Stainless Steel","Aluminum Work","Railing"],
  masonry: ["Brickwork","Tiling","Marble Fitting","Granite Work","Waterproofing","Plaster Work","Flooring","Cladding","Stone Work","Bathroom Tiling"],
  ac_repair: ["AC Service","AC Installation","Refrigerator","Washing Machine","Microwave","Water Heater","Chimney","Dishwasher","Deep Freezer","Geyser"],
  beauty: ["Hair Cut","Hair Color","Facial","Manicure","Pedicure","Threading","Waxing","Bridal Makeup","Keratin","Blow Dry"],
  driver: ["Personal Driver","Outstation","Airport Drop","Car Rental","Night Duty","Long Route","Office Cab","Wedding Car","School Pickup","Lady Driver"],
  delivery: ["Grocery Delivery","Parcel Pickup","Document Courier","Food Delivery","Medicine Delivery","Furniture Delivery","Same Day","Express Delivery","E-commerce","Bulk Delivery"],
  cleaning: ["Deep Cleaning","Bathroom Cleaning","Kitchen Cleaning","Sofa Cleaning","Carpet Cleaning","Window Cleaning","Move-in/Move-out","Office Cleaning","Disinfection","Tank Cleaning"],
  pest_control: ["Cockroach Control","Termite Treatment","Rodent Control","Bed Bug Treatment","Ant Control","Mosquito Spray","General Pest","Fumigation","Bird Netting","Pre-Construction"],
  cook: ["North Indian","South Indian","Chinese","Continental","Jain Food","Vegan","Party Cooking","Tiffin Service","Baking","Biryani"],
  maid: ["Full Time Maid","Part Time","Utensil Washing","Sweeping & Mopping","Laundry","Baby Care","Elderly Help","Cook + Maid","Live-in","Office Helper"],
  elder_care: ["Patient Attendant","Medication Reminder","Physiotherapy Assist","Night Duty","Hospital Escort","Mobility Assistance","Dementia Care","Post-Surgery Care","Bedridden Care","Vital Monitoring"],
  baby_care: ["Newborn Care","Night Nanny","Day Nanny","Toddler Care","School Pickup","Bath & Feed","Infant Sleep Training","Twins Care","Au Pair","NICU Follow-up"],
  gardening: ["Lawn Mowing","Plant Care","Landscaping","Garden Design","Tree Trimming","Pot Gardening","Organic Farming","Terrace Garden","Irrigation Setup","Composting"],
  packers: ["Home Shifting","Office Shifting","Loading & Unloading","Packing Only","Storage","Bike Transport","Furniture Dismantling","Local Move","City to City","International"],
  laundry: ["Wash & Fold","Dry Cleaning","Ironing","Steam Press","Stain Removal","Saree Cleaning","Leather Cleaning","Curtain Wash","Shoe Cleaning","Pickup & Delivery"],
  tech_repair: ["Laptop Repair","Phone Screen","Data Recovery","Virus Removal","RAM/SSD Upgrade","Printer Repair","Networking","Smart TV","Tablet Repair","Software Install"],
  cctv: ["CCTV Install","IP Camera","DVR/NVR Setup","Biometric","Video Door Phone","Fire Alarm","Access Control","Network Camera","PTZ Camera","Remote Monitoring"],
  water_purifier: ["RO Service","Filter Change","UV Lamp","Membrane Replacement","Kent Service","Aquaguard","Installation","AMC","TDS Check","Tap Purifier"],
  tutor: ["Mathematics","Science","English","Computer","Music","Dance","Yoga","NEET Prep","IIT JEE","Personality Dev"],
  event_helper: ["Decoration","Catering","Waiters","Stage Setup","Sound System","Photography Assist","Flower Arrangement","Tent Canopy","Mandap Setup","DJ Setup"],
  tailor: ["Blouse Stitching","Suit Tailoring","Dress Alteration","Kids Clothes","Saree Blouse","Embroidery","Fabric Design","Lehenga","Jeans Alteration","Uniform"],
  photographer: ["Wedding Photography","Birthday","Product Photos","Maternity","Portfolio","Real Estate","Event Photography","Videography","Drone Shots","Passport Photos"],
  security_guard: ["Residential Guard","Commercial Guard","Night Patrolling","CCTV Monitoring","Access Control","Event Security","Bank Security","Female Guard","Armed Guard","Dog Squad"],
  nursing: ["Home Nursing","IV Drip","Wound Dressing","Injection","Blood Test","ECG","Catheter Care","Post-Op Care","Physiotherapy","Palliative Care"],
  home_repair: ["General Handyman","Door Repair","Lock Changing","Furniture Assembly","Geyser Repair","Fan Repair","Switch Repair","Window Repair","False Ceiling","General Fix"],
};

const BIO_TEMPLATES = [
  "Experienced {cat} professional with {exp}+ years serving households across {city}. Known for punctuality and quality work.",
  "Dedicated {cat} expert based in {city}. I take pride in delivering clean, efficient, and long-lasting solutions every time.",
  "Reliable {cat} specialist with a track record of {jobs}+ satisfied customers in {city} and surrounding areas.",
  "Your trusted {cat} professional in {locality}, {city}. Available 7 days a week for urgent and scheduled calls.",
  "Passionate about my craft as a {cat} worker. Every job, big or small, gets my full attention and skill.",
  "Professional {cat} service provider operating in {city} for the past {exp} years. Fully insured and ID verified.",
];

const PORTRAIT_MALE = Array.from({ length: 70 }, (_, i) => `https://randomuser.me/api/portraits/men/${i + 1}.jpg`);
const PORTRAIT_FEMALE = Array.from({ length: 70 }, (_, i) => `https://randomuser.me/api/portraits/women/${i + 1}.jpg`);

const WORK_PHOTOS: Record<string, string[]> = {
  plumbing: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop"],
  electrical: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"],
  carpentry: ["https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=300&fit=crop"],
  painting: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571907483086-5f0ec8cc0d29?w=400&h=300&fit=crop"],
  welding: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1570126688035-1e6adbd61053?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=400&h=300&fit=crop"],
  masonry: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=400&h=300&fit=crop"],
  ac_repair: ["https://images.unsplash.com/photo-1631700611307-37dbcb89ef7e?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1583842761848-89fd1d6c1640?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop"],
  beauty: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596704017256-9902b8393f32?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop"],
  driver: ["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1502662791691-b77c8c27f8ae?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop"],
  delivery: ["https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1596432310800-f8b2fc23ec14?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1593766788306-28561086694e?w=400&h=300&fit=crop"],
  cleaning: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop"],
  pest_control: ["https://images.unsplash.com/photo-1594652634010-275456c808d0?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1584043720379-b56cd9199c94?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1626682561371-7893e6b9f3ce?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1578323851363-cf6c1a0b2b34?w=400&h=300&fit=crop"],
  cook: ["https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1559384269-e8da5c31e41a?w=400&h=300&fit=crop"],
  maid: ["https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"],
  elder_care: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"],
  baby_care: ["https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&h=300&fit=crop"],
  gardening: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1581093577421-f561a654a353?w=400&h=300&fit=crop"],
  packers: ["https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop"],
  laundry: ["https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1620732884038-fc3d41f39019?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&h=300&fit=crop"],
  tech_repair: ["https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop"],
  cctv: ["https://images.unsplash.com/photo-1557597774-9d475d030a00?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop"],
  water_purifier: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1559963110-71b394e7494d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop"],
  tutor: ["https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1555431189-0fabf2667795?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"],
  event_helper: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop"],
  tailor: ["https://images.unsplash.com/photo-1558171813-1e6f2e26a6c1?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1617396900799-f4ec2b43c7d3?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=300&fit=crop"],
  photographer: ["https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop"],
  security_guard: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1522345961-6823686f02cd?w=400&h=300&fit=crop"],
  nursing: ["https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=300&fit=crop"],
  home_repair: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop"],
};

const LANGUAGES = ["Hindi","English","Marathi","Bengali","Telugu","Tamil","Kannada","Gujarati","Punjabi","Odia"];
const REVIEW_TEXTS = [
  "Excellent work! Very professional and completed the job on time.",
  "Highly recommended. Thorough, clean and very skilled.",
  "Arrived on time, very polite and did a fantastic job.",
  "Great experience. Will definitely book again.",
  "Fixed the issue quickly. Explained what was wrong clearly.",
  "Very neat and tidy. Left the place clean after the job.",
  "Very knowledgeable. Offered good suggestions and did quality work.",
  "Super fast response. Resolved everything in under an hour.",
  "Very satisfied. Price was fair and the work was excellent.",
  "Professional attitude, good communication, job done right.",
  "Has been working with us for 2 years now. Absolutely reliable.",
  "Went above and beyond to solve the problem. Highly recommended.",
  "Best service I have ever had. Very thorough and careful.",
  "Wonderful person. Very skilled and trustworthy.",
  "Quick, efficient and affordable. Will book again for sure.",
];
const REVIEWER_NAMES = ["Priya S.","Arun M.","Sunita K.","Vijay P.","Meena R.","Rajesh D.","Anita G.","Suresh T.","Deepa N.","Kavitha L.","Manoj V.","Lakshmi B.","Rohit C.","Geeta I.","Sanjay A."];

// ─── Generator ────────────────────────────────────────────────────────────────
function generateWorker(index: number): Worker {
  const catObj = SERVICE_CATEGORIES[index % SERVICE_CATEGORIES.length];
  const catId = catObj.id;
  const catName = catObj.name;

  const gender: "male" | "female" = rand() > 0.35 ? "male" : "female";
  const namePool = gender === "male" ? MALE_NAMES : FEMALE_NAMES;
  const name = namePool[index % namePool.length];

  const portraitPool = gender === "male" ? PORTRAIT_MALE : PORTRAIT_FEMALE;
  const avatar = portraitPool[index % portraitPool.length];

  const cityObj = CITIES[index % CITIES.length];
  const locality = cityObj.localities[randInt(0, cityObj.localities.length - 1)];
  const pincode = String(100000 + randInt(0, 899999));
  const lat = cityObj.lat + (rand() - 0.5) * 0.3;
  const lng = cityObj.lng + (rand() - 0.5) * 0.3;
  const distance = calcDistance(USER_LAT, USER_LNG, lat, lng);

  const experience = randInt(1, 18);
  const jobsCompleted = randInt(experience * 20, experience * 120);
  const repeatCustomerPct = randInt(55, 92);
  const rating = parseFloat((3.5 + rand() * 1.5).toFixed(1));
  const reviewCount = randInt(10, 200);

  const availability: Worker["availability"] = rand() < 0.55 ? "available" : rand() < 0.75 ? "busy" : "offline";
  const responseTime = pick(["~5 min","~10 min","~15 min","~20 min","~30 min","~45 min","~1 hr"]);

  const allSkills = SKILL_MAP[catId] || ["General Service","Quality Work","Expert"];
  const skillCount = randInt(2, 4);
  const skillTags = [...allSkills].sort(() => rand() - 0.5).slice(0, skillCount);

  const hourlyRate = randInt(150, 800);
  const visitCharge = randInt(50, 250);

  const langCount = randInt(1, 3);
  const languages = [...LANGUAGES].sort(() => rand() - 0.5).slice(0, langCount);

  const bioTpl = BIO_TEMPLATES[index % BIO_TEMPLATES.length];
  const bio = bioTpl
    .replace("{cat}", catName).replace("{exp}", String(experience))
    .replace("{city}", cityObj.name).replace("{locality}", locality)
    .replace("{jobs}", String(jobsCompleted));

  const workPhotos = WORK_PHOTOS[catId] || WORK_PHOTOS.home_repair;
  const galleryCount = randInt(3, 4);
  const gallery = workPhotos.slice(0, galleryCount);

  const badges = {
    idVerified: true,
    skillCertified: rand() > 0.25,
    policeVerified: rand() > 0.45,
    insured: rand() > 0.55,
  };

  const revCount = randInt(3, 8);
  const reviews: Review[] = Array.from({ length: revCount }, (_, i) => ({
    id: `rev-${index}-${i}`,
    reviewerName: REVIEWER_NAMES[(index + i) % REVIEWER_NAMES.length],
    reviewerAvatar: `https://randomuser.me/api/portraits/${rand() > 0.5 ? "women" : "men"}/${(index + i * 7) % 70 + 1}.jpg`,
    stars: Math.min(5, Math.max(3, Math.round(rating + (rand() - 0.5)))),
    date: new Date(Date.now() - randInt(1, 365) * 86400000).toISOString().split("T")[0],
    text: REVIEW_TEXTS[(index + i) % REVIEW_TEXTS.length],
  }));

  return {
    id: `worker-${index + 1}`,
    name, gender, age: randInt(22, 55),
    avatar, category: catName, categoryId: catId,
    skillTags, experience,
    city: cityObj.name, locality, pincode, lat, lng, distance,
    availability, responseTime,
    rating, reviewCount, jobsCompleted, repeatCustomerPct,
    badges, hourlyRate, visitCharge,
    languages, bio, gallery, reviews,
  };
}

// Generate 1080 workers (≥ 37 per category, some categories get more)
export const WORKERS: Worker[] = Array.from({ length: 1080 }, (_, i) => generateWorker(i));

export const getWorkerById = (id: string) => WORKERS.find(w => w.id === id);
export const getWorkersByCategory = (catId: string) => WORKERS.filter(w => w.categoryId === catId);
export const getAvailableWorkers = () => WORKERS.filter(w => w.availability === "available");
export const getTopRated = (n = 10) => [...WORKERS].sort((a, b) => b.rating - a.rating).slice(0, n);
export const getNearestWorkers = (n = 20) => [...WORKERS].sort((a, b) => a.distance - b.distance).slice(0, n);

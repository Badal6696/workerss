export type Language = "en" | "hi" | "ta" | "bn";

export const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🏴" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🏴" },
];

type TranslationKeys = {
  // Nav
  home: string; browse: string; nearMe: string; login: string; signup: string; dashboard: string; logout: string;
  // Hero
  heroTitle: string; heroSubtitle: string; searchPlaceholder: string; searchBtn: string; locationLabel: string;
  // Categories
  categoriesTitle: string; categoriesSubtitle: string;
  // Common
  bookNow: string; viewProfile: string; filters: string; sortBy: string; loading: string; noResults: string;
  available: string; busy: string; offline: string; verified: string; rating: string; reviews: string;
  experience: string; years: string; hourlyRate: string; visitCharge: string; distance: string; km: string;
  // Auth
  emailOrPhone: string; password: string; confirmPassword: string; forgotPassword: string; orContinueWith: string;
  alreadyHaveAccount: string; dontHaveAccount: string; asCustomer: string; asWorker: string; enterOTP: string;
  resendOTP: string; verifyOTP: string;
  // Booking
  selectDate: string; selectTime: string; yourAddress: string; jobDescription: string; priceBreakdown: string;
  subtotal: string; platformFee: string; taxes: string; total: string; payNow: string; payLater: string;
  bookingConfirmed: string; bookingId: string;
  // Dashboard
  upcomingBookings: string; pastBookings: string; savedWorkers: string; paymentHistory: string;
  earnings: string; jobRequests: string; todaySchedule: string; myReviews: string;
  // Misc
  readMore: string; readLess: string; shareProfile: string; reportWorker: string; writeReview: string;
  submitReview: string; cancel: string; confirm: string; save: string; edit: string; delete: string;
  upload: string; dragDrop: string; chooseFile: string;
  // Stats
  verifiedWorkers: string; citiesServed: string; jobsCompleted: string; happyCustomers: string;
  // Trust
  trustTitle: string; idVerified: string; skillCertified: string; policeVerified: string; insured: string;
  // Footer
  aboutUs: string; safety: string; pricing: string; help: string; contact: string; privacyPolicy: string; terms: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    home: "Home", browse: "Browse", nearMe: "Near Me", login: "Log In", signup: "Sign Up",
    dashboard: "Dashboard", logout: "Log Out",
    heroTitle: "Find Trusted Skilled Workers,\nInstantly.", heroSubtitle: "India's premium verified platform for home services, repairs, beauty, driving and 30+ more skilled trades.",
    searchPlaceholder: "What do you need done? e.g. plumber, chef, driver...", searchBtn: "Search",
    locationLabel: "Your Location",
    categoriesTitle: "All Services, One Platform", categoriesSubtitle: "From home repairs to personal care — every skilled professional you need, verified and ready.",
    bookNow: "Book Now", viewProfile: "View Profile", filters: "Filters", sortBy: "Sort By",
    loading: "Loading...", noResults: "No workers found. Try adjusting filters.",
    available: "Available Now", busy: "Busy", offline: "Offline",
    verified: "Verified", rating: "Rating", reviews: "Reviews",
    experience: "Experience", years: "yrs", hourlyRate: "Hourly", visitCharge: "Visit",
    distance: "Distance", km: "km",
    emailOrPhone: "Email or Phone", password: "Password", confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?", orContinueWith: "or continue with",
    alreadyHaveAccount: "Already have an account?", dontHaveAccount: "Don't have an account?",
    asCustomer: "As Customer", asWorker: "As Worker", enterOTP: "Enter OTP",
    resendOTP: "Resend OTP", verifyOTP: "Verify OTP",
    selectDate: "Select Date", selectTime: "Select Time Slot", yourAddress: "Your Address",
    jobDescription: "Describe the Job", priceBreakdown: "Price Breakdown",
    subtotal: "Subtotal", platformFee: "Platform Fee", taxes: "GST (18%)", total: "Total",
    payNow: "Pay Now", payLater: "Pay After Service", bookingConfirmed: "Booking Confirmed!",
    bookingId: "Booking ID",
    upcomingBookings: "Upcoming", pastBookings: "Past Bookings", savedWorkers: "Saved Workers",
    paymentHistory: "Payment History", earnings: "Earnings", jobRequests: "Job Requests",
    todaySchedule: "Today's Schedule", myReviews: "My Reviews",
    readMore: "Read more", readLess: "Read less", shareProfile: "Share Profile",
    reportWorker: "Report", writeReview: "Write a Review", submitReview: "Submit Review",
    cancel: "Cancel", confirm: "Confirm", save: "Save", edit: "Edit", delete: "Delete",
    upload: "Upload", dragDrop: "Drag & drop files here", chooseFile: "Choose File",
    verifiedWorkers: "Verified Workers", citiesServed: "Cities Served", jobsCompleted: "Jobs Completed", happyCustomers: "Happy Customers",
    trustTitle: "Every Worker, Fully Verified",
    idVerified: "ID Verified", skillCertified: "Skill Certified", policeVerified: "Police Verified", insured: "Insured",
    aboutUs: "About Us", safety: "Safety & Verification", pricing: "Pricing", help: "Help & FAQ",
    contact: "Contact", privacyPolicy: "Privacy Policy", terms: "Terms of Service",
  },
  hi: {
    home: "होम", browse: "खोजें", nearMe: "पास में", login: "लॉग इन", signup: "साइन अप",
    dashboard: "डैशबोर्ड", logout: "लॉग आउट",
    heroTitle: "विश्वसनीय कुशल कामगार खोजें,\nतुरंत।", heroSubtitle: "घर की मरम्मत, सौंदर्य, ड्राइविंग और 30+ कुशल सेवाओं के लिए भारत का प्रीमियम सत्यापित प्लेटफॉर्म।",
    searchPlaceholder: "क्या चाहिए? जैसे प्लंबर, शेफ, ड्राइवर...", searchBtn: "खोजें",
    locationLabel: "आपका स्थान",
    categoriesTitle: "सभी सेवाएं, एक प्लेटफॉर्म", categoriesSubtitle: "घर की मरम्मत से व्यक्तिगत देखभाल तक — हर कुशल पेशेवर, सत्यापित और तैयार।",
    bookNow: "अभी बुक करें", viewProfile: "प्रोफाइल देखें", filters: "फ़िल्टर", sortBy: "क्रम से",
    loading: "लोड हो रहा है...", noResults: "कोई कामगार नहीं मिला। फ़िल्टर बदलें।",
    available: "उपलब्ध है", busy: "व्यस्त", offline: "ऑफलाइन",
    verified: "सत्यापित", rating: "रेटिंग", reviews: "समीक्षाएं",
    experience: "अनुभव", years: "साल", hourlyRate: "प्रति घंटा", visitCharge: "विज़िट",
    distance: "दूरी", km: "किमी",
    emailOrPhone: "ईमेल या फ़ोन", password: "पासवर्ड", confirmPassword: "पासवर्ड पुष्टि करें",
    forgotPassword: "पासवर्ड भूल गए?", orContinueWith: "या जारी रखें",
    alreadyHaveAccount: "पहले से खाता है?", dontHaveAccount: "खाता नहीं है?",
    asCustomer: "ग्राहक के रूप में", asWorker: "कामगार के रूप में", enterOTP: "OTP दर्ज करें",
    resendOTP: "OTP फिर भेजें", verifyOTP: "OTP सत्यापित करें",
    selectDate: "दिनांक चुनें", selectTime: "समय स्लॉट चुनें", yourAddress: "आपका पता",
    jobDescription: "काम का विवरण दें", priceBreakdown: "मूल्य विवरण",
    subtotal: "उप-योग", platformFee: "प्लेटफॉर्म शुल्क", taxes: "GST (18%)", total: "कुल",
    payNow: "अभी भुगतान करें", payLater: "सेवा के बाद भुगतान करें", bookingConfirmed: "बुकिंग पुष्ट!",
    bookingId: "बुकिंग आईडी",
    upcomingBookings: "आगामी", pastBookings: "पिछली बुकिंग", savedWorkers: "सहेजे गए कामगार",
    paymentHistory: "भुगतान इतिहास", earnings: "कमाई", jobRequests: "काम की मांग",
    todaySchedule: "आज का कार्यक्रम", myReviews: "मेरी समीक्षाएं",
    readMore: "और पढ़ें", readLess: "कम पढ़ें", shareProfile: "प्रोफाइल शेयर करें",
    reportWorker: "रिपोर्ट करें", writeReview: "समीक्षा लिखें", submitReview: "समीक्षा जमा करें",
    cancel: "रद्द करें", confirm: "पुष्टि करें", save: "सहेजें", edit: "संपादित करें", delete: "हटाएं",
    upload: "अपलोड", dragDrop: "फ़ाइलें यहाँ खींचें", chooseFile: "फ़ाइल चुनें",
    verifiedWorkers: "सत्यापित कामगार", citiesServed: "शहर", jobsCompleted: "काम पूरे", happyCustomers: "खुश ग्राहक",
    trustTitle: "हर कामगार, पूरी तरह सत्यापित",
    idVerified: "आईडी सत्यापित", skillCertified: "कौशल प्रमाणित", policeVerified: "पुलिस सत्यापित", insured: "बीमित",
    aboutUs: "हमारे बारे में", safety: "सुरक्षा और सत्यापन", pricing: "मूल्य निर्धारण",
    help: "सहायता और FAQ", contact: "संपर्क", privacyPolicy: "गोपनीयता नीति", terms: "सेवा की शर्तें",
  },
  ta: {
    home: "முகப்பு", browse: "தேடு", nearMe: "அருகில்", login: "உள்நுழை", signup: "பதிவு",
    dashboard: "டாஷ்போர்டு", logout: "வெளியேறு",
    heroTitle: "நம்பகமான திறமையான தொழிலாளர்களை\nதக்ஷணமே கண்டறியுங்கள்.", heroSubtitle: "வீட்டு சேவைகள், பழுதுபார்ப்பு மற்றும் 30+ சேவைகளுக்கான இந்தியாவின் சிறந்த தளம்.",
    searchPlaceholder: "என்ன வேண்டும்? எ.கா. பம்பர், சமையல்காரர்...", searchBtn: "தேடு",
    locationLabel: "உங்கள் இடம்",
    categoriesTitle: "அனைத்து சேவைகள், ஒரு தளம்", categoriesSubtitle: "வீட்டு பழுதுபார்ப்பு முதல் தனிப்பட்ட பராமரிப்பு வரை — அனைவரும் சரிபார்க்கப்பட்டவர்கள்.",
    bookNow: "இப்போதே முன்பதிவு", viewProfile: "சுயவிவரம் காண்க", filters: "வடிகட்டிகள்", sortBy: "வரிசைப்படுத்து",
    loading: "ஏற்றுகிறது...", noResults: "தொழிலாளர்கள் இல்லை. வடிகட்டிகளை சரிசெய்யவும்.",
    available: "இப்போது கிடைக்கும்", busy: "பிஸி", offline: "ஆஃப்லைன்",
    verified: "சரிபார்க்கப்பட்டது", rating: "மதிப்பீடு", reviews: "மதிப்புரைகள்",
    experience: "அனுபவம்", years: "ஆண்டுகள்", hourlyRate: "மணிக்கு", visitCharge: "வருகை",
    distance: "தூரம்", km: "கி.மீ",
    emailOrPhone: "மின்னஞ்சல் அல்லது தொலைபேசி", password: "கடவுச்சொல்", confirmPassword: "கடவுச்சொல் உறுதி",
    forgotPassword: "கடவுச்சொல் மறந்தீர்களா?", orContinueWith: "அல்லது தொடரவும்",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?", dontHaveAccount: "கணக்கு இல்லையா?",
    asCustomer: "வாடிக்கையாளராக", asWorker: "தொழிலாளராக", enterOTP: "OTP உள்ளிடவும்",
    resendOTP: "OTP மீண்டும் அனுப்பு", verifyOTP: "OTP சரிபார்",
    selectDate: "தேதி தேர்ந்தெடு", selectTime: "நேர ஸ்லாட் தேர்ந்தெடு", yourAddress: "உங்கள் முகவரி",
    jobDescription: "வேலையை விவரிக்கவும்", priceBreakdown: "விலை விவரம்",
    subtotal: "துணைத்தொகை", platformFee: "தள கட்டணம்", taxes: "GST (18%)", total: "மொத்தம்",
    payNow: "இப்போது செலுத்து", payLater: "சேவைக்கு பின் செலுத்து", bookingConfirmed: "முன்பதிவு உறுதி!",
    bookingId: "முன்பதிவு ஐடி",
    upcomingBookings: "வரவிருக்கும்", pastBookings: "கடந்த முன்பதிவுகள்", savedWorkers: "சேமித்த தொழிலாளர்கள்",
    paymentHistory: "கட்டண வரலாறு", earnings: "வருவாய்", jobRequests: "வேலை கோரிக்கைகள்",
    todaySchedule: "இன்றைய அட்டவணை", myReviews: "என் மதிப்புரைகள்",
    readMore: "மேலும் படிக்க", readLess: "குறைவாக படிக்க", shareProfile: "சுயவிவரம் பகிர்",
    reportWorker: "புகார்", writeReview: "மதிப்புரை எழுது", submitReview: "மதிப்புரை சமர்ப்பி",
    cancel: "ரத்துசெய்", confirm: "உறுதிப்படுத்து", save: "சேமி", edit: "திருத்து", delete: "நீக்கு",
    upload: "பதிவேற்று", dragDrop: "கோப்புகளை இங்கே இழுக்கவும்", chooseFile: "கோப்பு தேர்ந்தெடு",
    verifiedWorkers: "சரிபார்க்கப்பட்ட தொழிலாளர்கள்", citiesServed: "நகரங்கள்", jobsCompleted: "வேலைகள் முடிந்தன", happyCustomers: "மகிழ்ச்சியான வாடிக்கையாளர்கள்",
    trustTitle: "ஒவ்வொரு தொழிலாளரும் முழுமையாக சரிபார்க்கப்பட்டவர்",
    idVerified: "ஐடி சரிபார்க்கப்பட்டது", skillCertified: "திறன் சான்றிதழ்", policeVerified: "போலீஸ் சரிபார்ப்பு", insured: "காப்பீடு",
    aboutUs: "எங்களைப் பற்றி", safety: "பாதுகாப்பு மற்றும் சரிபார்ப்பு", pricing: "விலை நிர்ணயம்",
    help: "உதவி மற்றும் FAQ", contact: "தொடர்பு", privacyPolicy: "தனியுரிமை கொள்கை", terms: "சேவை விதிமுறைகள்",
  },
  bn: {
    home: "হোম", browse: "খুঁজুন", nearMe: "কাছাকাছি", login: "লগ ইন", signup: "সাইন আপ",
    dashboard: "ড্যাশবোর্ড", logout: "লগ আউট",
    heroTitle: "বিশ্বস্ত দক্ষ কর্মী খুঁজুন,\nতাৎক্ষণিকভাবে।", heroSubtitle: "গৃহ সেবা, মেরামত, সৌন্দর্য, ড্রাইভিং এবং ৩০+ সেবার জন্য ভারতের প্রিমিয়াম যাচাইকৃত প্ল্যাটফর্ম।",
    searchPlaceholder: "কী প্রয়োজন? যেমন প্লাম্বার, শেফ, ড্রাইভার...", searchBtn: "খুঁজুন",
    locationLabel: "আপনার অবস্থান",
    categoriesTitle: "সব সেবা, এক প্ল্যাটফর্ম", categoriesSubtitle: "গৃহ মেরামত থেকে ব্যক্তিগত পরিচর্যা — প্রতিটি দক্ষ পেশাদার, যাচাইকৃত এবং প্রস্তুত।",
    bookNow: "এখনই বুক করুন", viewProfile: "প্রোফাইল দেখুন", filters: "ফিল্টার", sortBy: "সাজান",
    loading: "লোড হচ্ছে...", noResults: "কোনো কর্মী পাওয়া যায়নি। ফিল্টার পরিবর্তন করুন।",
    available: "এখন উপলব্ধ", busy: "ব্যস্ত", offline: "অফলাইন",
    verified: "যাচাইকৃত", rating: "রেটিং", reviews: "রিভিউ",
    experience: "অভিজ্ঞতা", years: "বছর", hourlyRate: "প্রতি ঘণ্টা", visitCharge: "ভিজিট",
    distance: "দূরত্ব", km: "কিমি",
    emailOrPhone: "ইমেইল বা ফোন", password: "পাসওয়ার্ড", confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?", orContinueWith: "অথবা চালিয়ে যান",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?", dontHaveAccount: "অ্যাকাউন্ট নেই?",
    asCustomer: "গ্রাহক হিসেবে", asWorker: "কর্মী হিসেবে", enterOTP: "OTP দিন",
    resendOTP: "OTP পুনরায় পাঠান", verifyOTP: "OTP যাচাই করুন",
    selectDate: "তারিখ বেছে নিন", selectTime: "সময় স্লট বেছে নিন", yourAddress: "আপনার ঠিকানা",
    jobDescription: "কাজের বিবরণ দিন", priceBreakdown: "মূল্য বিবরণ",
    subtotal: "উপমোট", platformFee: "প্ল্যাটফর্ম ফি", taxes: "GST (18%)", total: "মোট",
    payNow: "এখনই পরিশোধ করুন", payLater: "সেবার পরে পরিশোধ", bookingConfirmed: "বুকিং নিশ্চিত!",
    bookingId: "বুকিং আইডি",
    upcomingBookings: "আসন্ন", pastBookings: "পুরানো বুকিং", savedWorkers: "সংরক্ষিত কর্মী",
    paymentHistory: "পেমেন্ট ইতিহাস", earnings: "আয়", jobRequests: "কাজের অনুরোধ",
    todaySchedule: "আজকের সময়সূচী", myReviews: "আমার রিভিউ",
    readMore: "আরও পড়ুন", readLess: "কম পড়ুন", shareProfile: "প্রোফাইল শেয়ার করুন",
    reportWorker: "রিপোর্ট করুন", writeReview: "রিভিউ লিখুন", submitReview: "রিভিউ জমা দিন",
    cancel: "বাতিল করুন", confirm: "নিশ্চিত করুন", save: "সংরক্ষণ করুন", edit: "সম্পাদনা করুন", delete: "মুছুন",
    upload: "আপলোড", dragDrop: "ফাইলগুলি এখানে টেনে আনুন", chooseFile: "ফাইল বেছে নিন",
    verifiedWorkers: "যাচাইকৃত কর্মী", citiesServed: "শহর", jobsCompleted: "সম্পন্ন কাজ", happyCustomers: "সন্তুষ্ট গ্রাহক",
    trustTitle: "প্রতিটি কর্মী, সম্পূর্ণরূপে যাচাইকৃত",
    idVerified: "আইডি যাচাইকৃত", skillCertified: "দক্ষতা সার্টিফাইড", policeVerified: "পুলিশ যাচাইকৃত", insured: "বিমাকৃত",
    aboutUs: "আমাদের সম্পর্কে", safety: "নিরাপত্তা ও যাচাইকরণ", pricing: "মূল্য নির্ধারণ",
    help: "সহায়তা ও FAQ", contact: "যোগাযোগ", privacyPolicy: "গোপনীয়তা নীতি", terms: "সেবার শর্তাবলী",
  },
};

export default translations;
export type { TranslationKeys };

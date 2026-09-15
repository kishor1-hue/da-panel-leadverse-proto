// ---- Mock data model for the Test Drive Console prototype ----
// Everything here is fake/example data, mutated in-memory as you interact.

const DAS = [
  { id: "da1", name: "Omar Hassan",  role: "COMMON_DA",  hub: "Al Quoz", status: "AVAILABLE", todayCount: 6,  maxPerDay: 10, score: 92 },
  { id: "da2", name: "Layla Ahmed",  role: "HUB_DA",     hub: "Al Quoz", status: "AVAILABLE", todayCount: 3,  maxPerDay: 10, score: 88 },
  { id: "da3", name: "Sara Ibrahim", role: "VIRTUAL_DA", hub: "Al Quoz", status: "CHECK_OUT", todayCount: 0,  maxPerDay: 8,  score: 81 },
  { id: "da4", name: "Yusuf Khan",   role: "HOME_DA",    hub: "Al Quoz", status: "ON_BREAK",  todayCount: 10, maxPerDay: 10, score: 75 },
];

const CARS = [
  { id: "c1", title: "2023 Nissan Altima SV",   price: "AED 62,900", km: "18,400 km", fuel: "Petrol", trans: "Automatic", rating: 4.6, color: "#DCE3EA", url: "https://www.cars24.ae/buy-used-nissan-altima-cars-dubai/" },
  { id: "c2", title: "2022 Toyota Camry GLE",    price: "AED 71,500", km: "24,100 km", fuel: "Petrol", trans: "Automatic", rating: 4.7, color: "#E5DED0", url: "https://www.cars24.ae/buy-used-toyota-camry-cars-dubai/" },
  { id: "c3", title: "2023 Hyundai Tucson",      price: "AED 68,200", km: "12,900 km", fuel: "Petrol", trans: "Automatic", rating: 4.5, color: "#D9E2DC", url: "https://www.cars24.ae/buy-used-hyundai-tucson-cars-dubai/" },
  { id: "c4", title: "2022 Kia Sportage",        price: "AED 59,900", km: "31,200 km", fuel: "Petrol", trans: "Automatic", rating: 4.4, color: "#E6D9D9", url: "https://www.cars24.ae/buy-used-kia-sportage-cars-dubai/" },
];

const VAS_CATALOG = [
  { id: "v1", name: "Extended Warranty &mdash; 2 yr",         price: 1899 },
  { id: "v2", name: "Service Package &mdash; 3 services",     price: 899  },
  { id: "v3", name: "Insurance Add-on &mdash; comprehensive",  price: 2400 },
  { id: "v4", name: "Ceramic Coating",                   price: 650  },
];

const DISPOSITION_OPTIONS = ["Interested &mdash; financing", "Interested &mdash; cash", "Needs to think", "Not interested"];

let ORDERS = [
  { id: "BK-88213", isWalkIn: false, slot: "Today, 2:30 PM",
    customer: { name: "Fatima Al Suwaidi", phone: "050 123 4567", email: "fatima.s@example.com", dl: "DXB-882134", dlCountry: "UAE", nationality: "UAE", language: "Arabic" },
    car: CARS[0], type: "Hub", assignedDaId: "da1", stage: "da_conduct", status: "Conduct TD", tone: "warn", tokenPaid: false, disposition: null, vasSelected: [] },

  { id: "BK-88190", isWalkIn: false, slot: "Today, 3:00 PM",
    customer: { name: "Khalid Al Jaberi", phone: "055 987 1230", email: "khalid.j@example.com", dl: "", dlCountry: "", nationality: "UAE", language: "English" },
    car: CARS[1], type: "Virtual", assignedDaId: null, stage: "rec_existing", stepIndex: 0, status: "Unassigned", tone: "bad", tokenPaid: false, disposition: null, vasSelected: [] },

  { id: "BK-88177", isWalkIn: false, slot: "Today, 4:15 PM",
    customer: { name: "Maryam Rashidi", phone: "052 445 9981", email: "maryam.r@example.com", dl: "SHJ-771029", dlCountry: "UAE", nationality: "UAE", language: "Arabic" },
    car: CARS[2], type: "Hub", assignedDaId: "da2", stage: "da_conduct", status: "Assigned", tone: "neutral", tokenPaid: false, disposition: null, vasSelected: [] },

  { id: "BK-88155", isWalkIn: false, slot: "Tomorrow, 11:00 AM",
    customer: { name: "Sultan Al Nuaimi", phone: "056 221 7743", email: "sultan.n@example.com", dl: "AUH-551190", dlCountry: "UAE", nationality: "UAE", language: "Arabic" },
    car: CARS[3], type: "Home", assignedDaId: "da4", stage: "da_conduct", status: "Left Yard", tone: "warn", tokenPaid: false, disposition: null, vasSelected: [] },

  { id: "BK-88141", isWalkIn: false, slot: "Yesterday",
    customer: { name: "Aisha Al Mazrouei", phone: "050 774 2210", email: "aisha.m@example.com", dl: "DXB-441028", dlCountry: "UAE", nationality: "UAE", language: "English" },
    car: CARS[0], type: "Hub", assignedDaId: "da2", stage: "da_conduct", status: "Complete", tone: "ok", tokenPaid: true, disposition: "Interested &mdash; financing", vasSelected: [VAS_CATALOG[0]] },

  { id: "BK-88129", isWalkIn: false, slot: "Yesterday",
    customer: { name: "Rashid Al Falasi", phone: "050 662 9034", email: "rashid.f@example.com", dl: "DXB-129843", dlCountry: "UAE", nationality: "UAE", language: "Arabic" },
    car: CARS[1], type: "Virtual", assignedDaId: "da1", stage: "da_conduct", status: "Cancelled", tone: "bad", tokenPaid: false, disposition: null, vasSelected: [] },

  { id: "BK-88102", isWalkIn: false, slot: "Tomorrow, 2:00 PM",
    customer: { name: "Noora Al Shamsi", phone: "054 118 2276", email: "noora.s@example.com", dl: "", dlCountry: "", nationality: "UAE", language: "Arabic" },
    car: CARS[2], type: "Home", assignedDaId: null, stage: "rec_existing", stepIndex: 0, status: "Unassigned", tone: "bad", tokenPaid: false, disposition: null, vasSelected: [] },
];

let orderSeq = 89000;
function createDraftOrder() {
  const id = "BK-" + (orderSeq++);
  const order = {
    id, isWalkIn: true, slot: "Walk-in, now",
    customer: { name: "", phone: "", email: "", dl: "", dlCountry: "", nationality: "", language: "" },
    car: null, type: "Hub", assignedDaId: null,
    stage: "rec_walkin", stepIndex: 0,
    status: "New walk-in", tone: "neutral", tokenPaid: false, disposition: null, vasSelected: [],
  };
  ORDERS.unshift(order);
  return order;
}

function findOrder(id) { return ORDERS.find(o => o.id === id); }
function findDa(id) { return DAS.find(d => d.id === id); }
function initials(name) { return (name || "?").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase(); }
function moneyAED(n) { return "AED " + n.toLocaleString(); }

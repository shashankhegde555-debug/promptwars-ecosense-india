// ── Tab Definitions ───────────────────────────────────────────────────────────
export const TABS = [
  { id: 'dashboard', label: 'Dashboard', emoji: '🏠', description: 'Understand your carbon footprint' },
  { id: 'todo', label: 'To-Do', emoji: '✅', description: 'Carbon-reduction tasks' },
  { id: 'tracker', label: 'Tracker', emoji: '📊', description: 'Log and track activities' },
  { id: 'actions', label: 'Eco-Actions', emoji: '🌱', description: 'Discover ways to reduce' },
  { id: 'insights', label: 'Insights', emoji: '💡', description: 'AI-powered personalised insights' },
  { id: 'pledge', label: 'My Pledge', emoji: '🎯', description: 'Set and track your carbon goal' },
  { id: 'leaderboard', label: 'Community', emoji: '🏆', description: 'See how your community is doing' },
  { id: 'assistant', label: 'AI Assistant', emoji: '🤖', description: 'Chat with your eco AI assistant' },
];

// ── Categories ────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'transport', label: 'Transport', emoji: '🚗', color: '#60a5fa' },
  { id: 'food', label: 'Food', emoji: '🍛', color: '#34d399' },
  { id: 'energy', label: 'Energy', emoji: '⚡', color: '#fbbf24' },
  { id: 'shopping', label: 'Shopping', emoji: '🛒', color: '#a78bfa' },
  { id: 'waste', label: 'Waste', emoji: '♻️', color: '#f87171' },
];

// ── India Average Carbon Data ─────────────────────────────────────────────────
export const INDIA_AVERAGES = {
  dailyKg: 5.2,        // kg CO2/day
  annualTonnes: 1.9,   // tonnes/year
  globalDailyKg: 11.0,
  globalAnnualTonnes: 4.0,
  safeDailyKg: 6.8,    // 2.5 tonnes/year target
};

// ── India City Grid Emission Factors ──────────────────────────────────────────
// Source: CEA (Central Electricity Authority) 2023-24 emission factors
export const INDIA_GRID_FACTORS = {
  Delhi: { kgCO2perKWh: 0.82, source: 'Northern Grid (coal-heavy)', region: 'North' },
  Mumbai: { kgCO2perKWh: 0.71, source: 'Maharashtra grid (mixed)', region: 'West' },
  Pune: { kgCO2perKWh: 0.71, source: 'Maharashtra grid (mixed)', region: 'West' },
  Bengaluru: { kgCO2perKWh: 0.65, source: 'BESCOM / Karnataka (renewables growing)', region: 'South' },
  Chennai: { kgCO2perKWh: 0.58, source: 'TANGEDCO (wind + thermal mix)', region: 'South' },
  Hyderabad: { kgCO2perKWh: 0.69, source: 'TSSPDCL (Telangana)', region: 'South' },
  Kerala: { kgCO2perKWh: 0.35, source: 'KSEB (hydro-dominant)', region: 'South' },
  Kolkata: { kgCO2perKWh: 0.85, source: 'Eastern Grid (coal-heavy)', region: 'East' },
  Ahmedabad: { kgCO2perKWh: 0.75, source: 'Gujarat grid (coal + solar)', region: 'West' },
  Jaipur: { kgCO2perKWh: 0.79, source: 'Rajasthan grid (solar growing)', region: 'North' },
  Lucknow: { kgCO2perKWh: 0.83, source: 'UP grid (coal-heavy)', region: 'North' },
  Bhopal: { kgCO2perKWh: 0.78, source: 'MP grid', region: 'Central' },
  Other: { kgCO2perKWh: 0.71, source: 'India average (CEA 2023-24)', region: 'India' },
};

// ── India Transport Emission Factors ──────────────────────────────────────────
export const INDIA_TRANSPORT_FACTORS = {
  auto_cng: { label: 'Auto-rickshaw (CNG)', kgPerkm: 0.09, emoji: '🛺' },
  auto_petrol: { label: 'Auto-rickshaw (petrol)', kgPerkm: 0.12, emoji: '🛺' },
  metro: { label: 'Metro / Local Train', kgPerkm: 0.028, emoji: '🚇' },
  bus: { label: 'State Bus', kgPerkm: 0.052, emoji: '🚌' },
  car_petrol: { label: 'Petrol Car', kgPerkm: 0.21, emoji: '🚗' },
  car_diesel: { label: 'Diesel Car', kgPerkm: 0.17, emoji: '🚗' },
  two_wheeler: { label: 'Two-Wheeler (petrol)', kgPerkm: 0.044, emoji: '🛵' },
  ev_two_wheeler: { label: 'Electric Two-Wheeler', kgPerkm: 0.015, emoji: '⚡' },
  ev_car: { label: 'Electric Car', kgPerkm: 0.05, emoji: '🔋' },
  domestic_flight: { label: 'Domestic Flight', kgPerkm: 0.255, emoji: '✈️' },
  cycle: { label: 'Bicycle', kgPerkm: 0, emoji: '🚲' },
};

// ── India Food Emission Factors ───────────────────────────────────────────────
export const INDIA_FOOD_FACTORS = {
  dal_rice: { label: 'Dal-rice meal', kgCO2: 0.8, emoji: '🍛' },
  chapati_sabzi: { label: 'Chapati + sabzi', kgCO2: 0.6, emoji: '🫓' },
  chicken_curry: { label: 'Chicken curry meal', kgCO2: 2.1, emoji: '🍗' },
  mutton_biryani: { label: 'Mutton biryani', kgCO2: 4.2, emoji: '🍖' },
  fish_curry: { label: 'Fish curry meal', kgCO2: 1.4, emoji: '🐟' },
  paneer_dish: { label: 'Paneer dish', kgCO2: 1.2, emoji: '🧀' },
  lpg_cylinder: { label: 'LPG cylinder (cooking)', kgCO2: 2.98, emoji: '🔥' },
  milk_litre: { label: 'Milk (per litre)', kgCO2: 1.6, emoji: '🥛' },
};

// ── Quick-add Activities ──────────────────────────────────────────────────────
export const QUICK_ACTIVITIES = [
  { id: 'qa_commute_car', name: 'Car commute (20km)', category: 'transport', carbonKg: 4.2, emoji: '🚗' },
  { id: 'qa_auto', name: 'Auto-rickshaw (8km)', category: 'transport', carbonKg: 0.72, emoji: '🛺' },
  { id: 'qa_metro', name: 'Metro commute (15km)', category: 'transport', carbonKg: 0.42, emoji: '🚇' },
  { id: 'qa_flight', name: 'Short domestic flight', category: 'transport', carbonKg: 120, emoji: '✈️' },
  { id: 'qa_dal_rice', name: 'Dal-rice meal', category: 'food', carbonKg: 0.8, emoji: '🍛' },
  { id: 'qa_chicken', name: 'Chicken meal', category: 'food', carbonKg: 2.1, emoji: '🍗' },
  { id: 'qa_lpg', name: 'LPG cylinder', category: 'food', carbonKg: 2.98, emoji: '🔥' },
  { id: 'qa_ac_day', name: 'AC for 8 hours', category: 'energy', carbonKg: 3.2, emoji: '❄️' },
  { id: 'qa_online_shopping', name: 'Online order (delivered)', category: 'shopping', carbonKg: 0.5, emoji: '📦' },
  { id: 'qa_plastic_bag', name: 'Plastic bags (weekly)', category: 'waste', carbonKg: 0.3, emoji: '🛍️' },
  { id: 'qa_two_wheeler', name: 'Bike commute (10km)', category: 'transport', carbonKg: 0.44, emoji: '🛵' },
  { id: 'qa_bus', name: 'State bus (20km)', category: 'transport', carbonKg: 1.04, emoji: '🚌' },
];

// ── Dashboard Rotating Facts ──────────────────────────────────────────────────
export const INDIA_CARBON_FACTS = [
  { fact: 'India\'s average carbon footprint is 1.9 tonnes/year — about half the global average.', icon: '🇮🇳' },
  { fact: 'India\'s Eastern grid (Kolkata) emits 2.4× more CO₂ per kWh than Kerala\'s KSEB hydro grid.', icon: '⚡' },
  { fact: 'Switching from a petrol car to Delhi Metro reduces your commute emissions by 88%.', icon: '🚇' },
  { fact: 'A CNG auto-rickshaw emits 57% less CO₂ per km than a petrol car.', icon: '🛺' },
  { fact: 'India is the 3rd largest emitter globally, yet emits just 2 tonnes/person vs USA\'s 14.', icon: '🌍' },
  { fact: 'Solar water heaters (available via MNRE subsidy) can save 300-500 kg CO₂/year.', icon: '☀️' },
  { fact: 'A single domestic flight Mumbai–Delhi produces ~150 kg CO₂ — equal to 3 weeks of vegetarian meals.', icon: '✈️' },
  { fact: 'Switching to an electric two-wheeler saves ~500 kg CO₂/year compared to a petrol bike.', icon: '🛵' },
  { fact: 'India\'s renewable energy capacity crossed 200 GW in 2024 — 43% of total installed capacity.', icon: '🌱' },
  { fact: 'An LPG cylinder releases 2.98 kg CO₂ — but induction cooking uses 50% less energy.', icon: '🔥' },
  { fact: 'Planting one tree offsets ~21 kg CO₂/year. You\'d need 90 trees to offset the India average.', icon: '🌳' },
  { fact: 'The FAME scheme offers subsidies up to ₹50,000 for electric two-wheelers in India.', icon: '⚡' },
  { fact: 'A vegetarian diet produces 50% less CO₂ than a meat-heavy diet in India.', icon: '🥗' },
  { fact: 'India\'s building sector accounts for ~22% of total CO₂ emissions.', icon: '🏗️' },
  { fact: 'Bengaluru\'s grid is becoming greener — 40% of Karnataka\'s power now comes from renewables.', icon: '💚' },
];

// ── Impact Level Config ───────────────────────────────────────────────────────
export const IMPACT_LEVELS = {
  low: { label: 'Low Impact', color: '#34d399', bg: 'rgba(52,211,153,0.15)', emoji: '🟢' },
  moderate: { label: 'Moderate', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', emoji: '🟡' },
  high: { label: 'High Impact', color: '#f97316', bg: 'rgba(249,115,22,0.15)', emoji: '🟠' },
  'very-high': { label: 'Very High', color: '#f87171', bg: 'rgba(248,113,113,0.15)', emoji: '🔴' },
};

// ── Difficulty Config ─────────────────────────────────────────────────────────
export const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  committed: { label: 'Committed', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
};

// ── API Base URL ──────────────────────────────────────────────────────────────
export const API_BASE = import.meta.env.VITE_API_URL || '';

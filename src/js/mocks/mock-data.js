/**
 * Mock data for the standalone Cirota Admin/CRM app (demo mode, no backend needed)
 */

export const MOCK_PLANS = [
export const MOCK_PLANS = [
  {
    id: 'plan_veg_lite',
    name: 'Veg Lite',
    category: 'veg',
    tier: 'lite',
    description: 'Budget-friendly vegetarian meals — paratha/poori breakfast, dal-rice lunch, sabzi-roti dinner.',
    trial_price: 50,
    pricing: {
      times_3: { monthly: 3200, daily_rate: 107 },
      times_2: { monthly: 2500, daily_rate: 83 },
      times_1: { monthly: 1350, daily_rate: 45 }
    },
    short_term_options: [
      { days: 1, price_3_times: 50, price_2_times: 50, price_1_time: 50, is_trial: true },
      { days: 7, price_3_times: 850, price_2_times: 700, price_1_time: 360 },
      { days: 15, price_3_times: 1700, price_2_times: 1300, price_1_time: 700 },
      { days: 30, price_3_times: 3200, price_2_times: 2500, price_1_time: 1350 }
    ],
    includes: ['Paratha / Poori / Sattu Breakfast', 'Dal-Rice-Sabzi Lunch', 'Seasonal Sabzi & Roti Dinner', 'Fryums']
  },
  {
    id: 'plan_nonveg_lite',
    name: 'Non-Veg Lite',
    category: 'nonveg',
    tier: 'lite',
    description: 'Budget-friendly non-vegetarian meals with egg/chicken curry on select days.',
    trial_price: 65,
    pricing: {
      times_3: { monthly: 3600, daily_rate: 120 },
      times_2: { monthly: 2800, daily_rate: 93 },
      times_1: { monthly: 1500, daily_rate: 50 }
    },
    short_term_options: [
      { days: 1, price_3_times: 65, price_2_times: 65, price_1_time: 65, is_trial: true },
      { days: 7, price_3_times: 950, price_2_times: 750, price_1_time: 400 },
      { days: 15, price_3_times: 1900, price_2_times: 1500, price_1_time: 800 },
      { days: 30, price_3_times: 3600, price_2_times: 2800, price_1_time: 1500 }
    ],
    includes: ['Paratha / Poori Breakfast', 'Egg / Chicken Curry (select days)', 'Dal-Rice Lunch', 'Roti Dinner']
  },
  {
    id: 'plan_veg_prime',
    name: 'Veg Prime',
    category: 'veg',
    tier: 'prime',
    popular: true,
    description: 'Versatile dishes, generous portions — comes with salad. Paneer, Kofta & Ghee Khichdi specials.',
    trial_price: 70,
    pricing: {
      times_3: { monthly: 4500, daily_rate: 150 },
      times_2: { monthly: 3500, daily_rate: 117 },
      times_1: { monthly: 1800, daily_rate: 60 }
    },
    short_term_options: [
      { days: 1, price_3_times: 70, price_2_times: 70, price_1_time: 70, is_trial: true },
      { days: 7, price_3_times: 1150, price_2_times: 900, price_1_time: 500 },
      { days: 15, price_3_times: 2300, price_2_times: 1800, price_1_time: 1000 },
      { days: 30, price_3_times: 4500, price_2_times: 3500, price_1_time: 1800 }
    ],
    includes: ['Paratha + Fruit/Curd Breakfast', 'Paneer Butter Masala / Soya Chaap', 'Salad with every meal', 'Ghee Khichdi & Papad (Sat)']
  },
  {
    id: 'plan_nonveg_prime',
    name: 'Non-Veg Prime',
    category: 'nonveg',
    tier: 'prime',
    description: 'Best of both worlds — generous non-veg portions with salad. Butter Chicken & Chicken Curry specials.',
    trial_price: 90,
    pricing: {
      times_3: { monthly: 5100, daily_rate: 170 },
      times_2: { monthly: 3900, daily_rate: 130 },
      times_1: { monthly: 2000, daily_rate: 67 }
    },
    short_term_options: [
      { days: 1, price_3_times: 90, price_2_times: 90, price_1_time: 90, is_trial: true },
      { days: 7, price_3_times: 1300, price_2_times: 1000, price_1_time: 550 },
      { days: 15, price_3_times: 2600, price_2_times: 2000, price_1_time: 1100 },
      { days: 30, price_3_times: 5100, price_2_times: 3900, price_1_time: 2000 }
    ],
    includes: ['Paratha + Fruit/Curd Breakfast', 'Butter Chicken / Chicken Masala', 'Salad with every meal', 'Chicken Chilli (Sun)']
  }
];

// Add-Ons Registry with per-unit prices

export const MOCK_CUSTOMERS = {
export const MOCK_CUSTOMERS = {
  'cust_active_1': {
    id: 'cust_active_1',
    name: 'Amit Sharma',
    phone: '9876543210',
    email: 'amit.sharma@example.com',
    area: 'Lalpur',
    address: 'Flat 302, Green Valley Apts, Circular Rd, Lalpur, Ranchi',
    plan_id: 'plan_veg_prime',
    frequency: 'times_2', // Lunch & Dinner
    status: 'active', // 'active' | 'paused_indefinite' | 'stopped_no_balance'
    validity_days_total: 30,
    validity_days_remaining: 19,
    meals_remaining_count: 38,
    start_date: '2026-08-10',
    next_renewal_date: '2026-09-15',
    dues_amount: 0
  },
  'cust_low_validity': {
    id: 'cust_low_validity',
    name: 'Priya Verma',
    phone: '9876543211',
    email: 'priya.v@example.com',
    area: 'Kanke Road',
    address: 'House 14, CMPDI Colony, Kanke Road, Ranchi',
    plan_id: 'plan_nonveg_lite',
    frequency: 'times_3',
    status: 'active',
    validity_days_total: 30,
    validity_days_remaining: 2, // Low balance urgency trigger!
    meals_remaining_count: 6,
    start_date: '2026-07-28',
    next_renewal_date: '2026-08-29',
    dues_amount: 0
  },
  'cust_paused_indefinite': {
    id: 'cust_paused_indefinite',
    name: 'Rahul Sen',
    phone: '9876543212',
    email: 'rahul.sen@example.com',
    area: 'Morabadi',
    address: 'Near Tagore Hill, Morabadi, Ranchi',
    plan_id: 'plan_veg_lite',
    frequency: 'times_2',
    status: 'paused_indefinite', // Paused state to test Resume button
    validity_days_total: 30,
    validity_days_remaining: 14,
    meals_remaining_count: 28,
    start_date: '2026-08-01',
    next_renewal_date: '2026-09-05',
    dues_amount: 0
  },
  'cust_stopped_no_balance': {
    id: 'cust_stopped_no_balance',
    name: 'Vikram Sahay',
    phone: '9876543213',
    email: 'vikram.s@example.com',
    area: 'Doranda',
    address: 'St. Xavier School Lane, Doranda, Ranchi',
    plan_id: 'plan_veg_prime',
    frequency: 'times_1',
    status: 'stopped_no_balance',
    validity_days_total: 30,
    validity_days_remaining: 0,
    meals_remaining_count: 0,
    start_date: '2026-07-15',
    next_renewal_date: '2026-08-15',
    dues_amount: 1450
  }
};

// Meal Sequence for the swipeable carousel (§4a)

export const MOCK_DAILY_SHEET = [
export const MOCK_DAILY_SHEET = [
  {
    id: 'row_1',
    customer_id: 'cust_active_1',
    partner: 'Zomato Delivery',
    area: 'Lalpur',
    customer_name: 'Amit Sharma',
    phone: '9876543210',
    subscription: 'Veg Prime (2x)',
    meal_type: 'lunch',
    roti_count: 3,
    rice_portion: 'Basmati Rice',
    special_notes: 'Extra spicy sabzi',
    delivered: true,
    status: 'delivered'
  },
  {
    id: 'row_2',
    customer_id: 'cust_low_validity',
    partner: 'Swiggy Genie',
    area: 'Kanke Road',
    customer_name: 'Priya Verma',
    phone: '9876543211',
    subscription: 'Non-Veg Lite (3x)',
    meal_type: 'lunch',
    roti_count: 4,
    rice_portion: 'Standard Rice',
    special_notes: 'Egg Curry preferred',
    delivered: false,
    status: 'pending'
  },
  {
    id: 'row_3',
    customer_id: 'cust_paused_indefinite',
    partner: 'In-House Rider',
    area: 'Morabadi',
    customer_name: 'Rahul Sen',
    phone: '9876543212',
    subscription: 'Veg Lite (2x)',
    meal_type: 'lunch',
    roti_count: 3,
    rice_portion: 'Standard Rice',
    special_notes: 'Leave at security gate',
    delivered: false,
    status: 'paused'
  },
  {
    id: 'row_4',
    customer_id: 'cust_4',
    partner: 'In-House Rider',
    area: 'Hinoo',
    customer_name: 'Deepak Kumar',
    phone: '9876543214',
    subscription: 'Non-Veg Prime (2x)',
    meal_type: 'lunch',
    roti_count: 4,
    rice_portion: 'Jeera Rice',
    special_notes: 'Less oil',
    delivered: true,
    status: 'delivered'
  },
  {
    id: 'row_5',
    customer_id: 'cust_5',
    partner: 'Shadowfax',
    area: 'Doranda',
    customer_name: 'Sunita Rao',
    phone: '9876543215',
    subscription: 'Veg Prime (1x)',
    meal_type: 'lunch',
    roti_count: 2,
    rice_portion: 'Brown Rice',
    special_notes: 'No garlic',
    delivered: false,
    status: 'pending'
  }
];

// Kitchen Prep Summary Dataset (§5 item 5)

export const MOCK_KITCHEN_SUMMARY = {
export const MOCK_KITCHEN_SUMMARY = {
  date: '2026-08-27',
  total_packets_today: 148,
  breakdown: {
    breakfast: {
      total: 38,
      veg_lite: 18,
      veg_prime: 12,
      nonveg_lite: 5,
      nonveg_prime: 3,
      total_rotis_parathas: 114
    },
    lunch: {
      total: 62,
      veg_lite: 24,
      veg_prime: 22,
      nonveg_lite: 10,
      nonveg_prime: 6,
      total_rotis_parathas: 218,
      rice_kg_approx: '18.5 kg'
    },
    dinner: {
      total: 48,
      veg_lite: 19,
      veg_prime: 18,
      nonveg_lite: 7,
      nonveg_prime: 4,
      total_rotis_parathas: 172,
      rice_kg_approx: '12.0 kg'
    }
  },
  area_distribution: [
    { area: 'Lalpur', packets: 42 },
    { area: 'Kanke Road', packets: 36 },
    { area: 'Morabadi', packets: 28 },
    { area: 'Doranda', packets: 24 },
    { area: 'Hinoo', packets: 18 }
  ]
};

export const MOCK_DUES_CUSTOMERS = [
export const MOCK_DUES_CUSTOMERS = [
  {
    id: 'cust_stopped_no_balance',
    name: 'Vikram Sahay',
    phone: '919876543213',
    area: 'Doranda',
    plan: 'Veg Prime (1x)',
    due_amount: 1450,
    days_overdue: 12,
    last_reminder_sent: '2026-08-24'
  },
  {
    id: 'cust_due_2',
    name: 'Ananya Roy',
    phone: '919876543299',
    area: 'Lalpur',
    plan: 'Non-Veg Lite (2x)',
    due_amount: 2200,
    days_overdue: 5,
    last_reminder_sent: 'None'
  },
  {
    id: 'cust_due_3',
    name: 'Karan Mehra',
    phone: '919876543288',
    area: 'Kanke Road',
    plan: 'Veg Lite (3x)',
    due_amount: 850,
    days_overdue: 3,
    last_reminder_sent: '2026-08-26'
  }
];

// ==========================================
// DELIVERY PARTNERS (for CRM assignment + attendance register + live map)
// ==========================================
export const MOCK_PARTNERS = [
  { id: 'partner_ramesh', name: 'Ramesh Kumar', phone: '9876543210', assigned_area: 'Lalpur', is_active: true },
  { id: 'partner_suresh', name: 'Suresh Oraon', phone: '9876500011', assigned_area: 'Doranda', is_active: true },
  { id: 'partner_vikas', name: 'Vikas Toppo', phone: '9876500022', assigned_area: 'Kanke Road', is_active: true },
];

// Today's attendance register — which of the 3 shifts each rider has checked into
export const MOCK_ATTENDANCE_REGISTER = [
  {
    id: 'partner_ramesh', name: 'Ramesh Kumar', phone: '9876543210', assigned_area: 'Lalpur',
    shifts: {
      breakfast: { checked_in_at: '2026-09-11T03:05:00.000Z', lat: 23.3745, lng: 85.3312 },
      lunch: { checked_in_at: '2026-09-11T07:32:00.000Z', lat: 23.3701, lng: 85.3270 },
      dinner: null,
    }
  },
  {
    id: 'partner_suresh', name: 'Suresh Oraon', phone: '9876500011', assigned_area: 'Doranda',
    shifts: { breakfast: { checked_in_at: '2026-09-11T03:12:00.000Z', lat: 23.3450, lng: 85.3100 }, lunch: null, dinner: null }
  },
  {
    id: 'partner_vikas', name: 'Vikas Toppo', phone: '9876500022', assigned_area: 'Kanke Road',
    shifts: { breakfast: null, lunch: null, dinner: null }
  },
];

// Currently on-duty riders' live positions (for the ops overview map)
export const MOCK_LIVE_LOCATIONS = [
  { id: 'partner_ramesh', name: 'Ramesh Kumar', assigned_area: 'Lalpur', current_lat: 23.3745, current_lng: 85.3312, location_updated_at: new Date().toISOString() },
  { id: 'partner_suresh', name: 'Suresh Oraon', assigned_area: 'Doranda', current_lat: 23.3450, current_lng: 85.3100, location_updated_at: new Date().toISOString() },
];

// Flat plan rows — same shape as what the real backend's GET /api/menu/plans returns
// (one row per plan-tier + duration + meals/day combination). Using the identical shape
// here means the CRM screen's logic doesn't need to change between mock and live modes.
export const MOCK_PLAN_ROWS = [
  { id: 'veg_lite_3t_30d', name: 'Veg Lite', is_veg: true, times_per_week: 3, duration_days: 30, total_price: 3200 },
  { id: 'veg_lite_2t_30d', name: 'Veg Lite', is_veg: true, times_per_week: 2, duration_days: 30, total_price: 2500 },
  { id: 'veg_lite_1t_30d', name: 'Veg Lite', is_veg: true, times_per_week: 1, duration_days: 30, total_price: 1350 },
  { id: 'veg_lite_3t_15d_st', name: 'Veg Lite', is_veg: true, times_per_week: 3, duration_days: 15, total_price: 1700 },
  { id: 'veg_lite_3t_7d_st', name: 'Veg Lite', is_veg: true, times_per_week: 3, duration_days: 7, total_price: 850 },
  { id: 'veg_lite_trial_1d', name: 'Veg Lite', is_veg: true, times_per_week: 1, duration_days: 1, total_price: 50 },

  { id: 'non_veg_lite_3t_30d', name: 'Non-Veg Lite', is_veg: false, times_per_week: 3, duration_days: 30, total_price: 3600 },
  { id: 'non_veg_lite_2t_30d', name: 'Non-Veg Lite', is_veg: false, times_per_week: 2, duration_days: 30, total_price: 2800 },
  { id: 'non_veg_lite_1t_30d', name: 'Non-Veg Lite', is_veg: false, times_per_week: 1, duration_days: 30, total_price: 1500 },
  { id: 'non_veg_lite_3t_15d_st', name: 'Non-Veg Lite', is_veg: false, times_per_week: 3, duration_days: 15, total_price: 1900 },
  { id: 'non_veg_lite_3t_7d_st', name: 'Non-Veg Lite', is_veg: false, times_per_week: 3, duration_days: 7, total_price: 950 },
  { id: 'non_veg_lite_trial_1d', name: 'Non-Veg Lite', is_veg: false, times_per_week: 1, duration_days: 1, total_price: 65 },

  { id: 'veg_prime_3t_30d', name: 'Veg Prime', is_veg: true, times_per_week: 3, duration_days: 30, total_price: 4500 },
  { id: 'veg_prime_2t_30d', name: 'Veg Prime', is_veg: true, times_per_week: 2, duration_days: 30, total_price: 3500 },
  { id: 'veg_prime_1t_30d', name: 'Veg Prime', is_veg: true, times_per_week: 1, duration_days: 30, total_price: 1800 },
  { id: 'veg_prime_3t_15d_st', name: 'Veg Prime', is_veg: true, times_per_week: 3, duration_days: 15, total_price: 2300 },
  { id: 'veg_prime_3t_7d_st', name: 'Veg Prime', is_veg: true, times_per_week: 3, duration_days: 7, total_price: 1150 },
  { id: 'veg_prime_trial_1d', name: 'Veg Prime', is_veg: true, times_per_week: 1, duration_days: 1, total_price: 70 },

  { id: 'non_veg_prime_3t_30d', name: 'Non-Veg Prime', is_veg: false, times_per_week: 3, duration_days: 30, total_price: 5100 },
  { id: 'non_veg_prime_2t_30d', name: 'Non-Veg Prime', is_veg: false, times_per_week: 2, duration_days: 30, total_price: 3900 },
  { id: 'non_veg_prime_1t_30d', name: 'Non-Veg Prime', is_veg: false, times_per_week: 1, duration_days: 30, total_price: 2000 },
  { id: 'non_veg_prime_3t_15d_st', name: 'Non-Veg Prime', is_veg: false, times_per_week: 3, duration_days: 15, total_price: 2600 },
  { id: 'non_veg_prime_3t_7d_st', name: 'Non-Veg Prime', is_veg: false, times_per_week: 3, duration_days: 7, total_price: 1300 },
  { id: 'non_veg_prime_trial_1d', name: 'Non-Veg Prime', is_veg: false, times_per_week: 1, duration_days: 1, total_price: 90 },
];

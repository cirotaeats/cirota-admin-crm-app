/**
 * Cirota Admin/CRM App — API Client
 */
import { CONFIG } from './config.js';
import { delay } from './mocks/mock-delay.js';
import {
  MOCK_CUSTOMERS,
  MOCK_DAILY_SHEET,
  MOCK_KITCHEN_SUMMARY,
  MOCK_DUES_CUSTOMERS,
  MOCK_PARTNERS,
  MOCK_ATTENDANCE_REGISTER,
  MOCK_LIVE_LOCATIONS,
  MOCK_PLAN_ROWS
} from './mocks/mock-data.js';

let localCustomers = JSON.parse(JSON.stringify(MOCK_CUSTOMERS));
let localDailySheet = JSON.parse(JSON.stringify(MOCK_DAILY_SHEET));
let lastSyncedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function getToken() {
  return localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
}

async function httpFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = `${CONFIG.BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_USER);
      window.location.hash = '#/login';
      throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data?.error?.message || 'Something went wrong. Please try again.');
    }
    return data.data !== undefined ? data.data : data;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Network error — check your internet connection.');
    }
    throw err;
  }
}

export const api = {

  // ==========================================
  // ADMIN API ENDPOINTS (§5)
  // ==========================================
  async adminLogin(email, password) {
    if (CONFIG.USE_MOCKS) {
      await delay(450);
      if (email.toLowerCase().includes('admin') || password.length >= 4) {
        return {
          token: 'mock_jwt_admin_token_abc999',
          admin: { email, name: 'Cirota Ops Admin', role: 'admin' }
        };
      }
      throw new Error('Invalid email or password');
    }
    return httpFetch('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, true);
  },

  async getAdminDashboardStats() {
    if (CONFIG.USE_MOCKS) {
      await delay(300);
      const custList = Object.values(localCustomers);
      const activeCount = custList.filter(c => c.status === 'active').length + 32;
      const duesCount = MOCK_DUES_CUSTOMERS.length;
      const lowBalanceCount = custList.filter(c => c.validity_days_remaining <= 3).length + 4;

      return {
        active_customers: activeCount,
        today_total_tiffins: MOCK_KITCHEN_SUMMARY.total_packets_today,
        customers_with_dues: duesCount,
        low_balance_customers: lowBalanceCount,
        last_synced_sheets: lastSyncedTime
      };
    }
    return httpFetch('/admin/stats', { method: 'GET' }, true);
  },

  async getAdminCustomers(query = '', area = 'all', status = 'all') {
    if (CONFIG.USE_MOCKS) {
      await delay(300);
      let list = Object.values(localCustomers);
      if (area && area !== 'all') {
        list = list.filter(c => c.area.toLowerCase() === area.toLowerCase());
      }
      if (status && status !== 'all') {
        list = list.filter(c => c.status === status);
      }
      if (query) {
        const q = query.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.area.toLowerCase().includes(q));
      }
      return { customers: list };
    }
    const params = new URLSearchParams({ query, area, status });
    return httpFetch(`/admin/customers?${params.toString()}`, { method: 'GET' }, true);
  },

  async updateCustomerManual(customerId, updateData) {
    if (CONFIG.USE_MOCKS) {
      await delay(400);
      if (localCustomers[customerId]) {
        localCustomers[customerId] = { ...localCustomers[customerId], ...updateData };
      }
      return { success: true, customer: localCustomers[customerId] };
    }
    return httpFetch(`/admin/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    }, true);
  },

  async getDailySheet(date = '2026-08-27') {
    if (CONFIG.USE_MOCKS) {
      await delay(300);
      return { date, rows: localDailySheet };
    }
    return httpFetch(`/admin/daily-orders?date=${date}`, { method: 'GET' }, true);
  },

  async markDailySheetDelivered(rowId, isDelivered) {
    if (CONFIG.USE_MOCKS) {
      await delay(200);
      const row = localDailySheet.find(r => r.id === rowId);
      if (row) {
        row.delivered = isDelivered;
        row.status = isDelivered ? 'delivered' : 'pending';
      }
      return { success: true, row };
    }
    return httpFetch(`/admin/daily-orders/${rowId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: isDelivered ? 'delivered' : 'confirmed' })
    }, true);
  },

  async updateDailySheetRoti(rowId, rotiCount) {
    if (CONFIG.USE_MOCKS) {
      await delay(200);
      const row = localDailySheet.find(r => r.id === rowId);
      if (row) {
        row.roti_count = parseInt(rotiCount, 10) || 0;
      }
      return { success: true, row };
    }
    return httpFetch(`/admin/daily-orders/${rowId}`, {
      method: 'PATCH',
      body: JSON.stringify({ roti_paratha_count: rotiCount })
    }, true);
  },

  async getKitchenSummary(date = '2026-08-27') {
    if (CONFIG.USE_MOCKS) {
      await delay(250);
      return { summary: MOCK_KITCHEN_SUMMARY };
    }
    return httpFetch(`/admin/kitchen-summary?date=${date}`, { method: 'GET' }, true);
  },

  async getDuesList() {
    if (CONFIG.USE_MOCKS) {
      await delay(250);
      return { dues: MOCK_DUES_CUSTOMERS };
    }
    return httpFetch('/admin/dues', { method: 'GET' }, true);
  },

  async triggerSheetsSync() {
    if (CONFIG.USE_MOCKS) {
      await delay(800);
      lastSyncedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { success: true, synced_at: lastSyncedTime };
    }
    return httpFetch('/admin/sync-sheets', {
      method: 'POST',
      body: JSON.stringify({ target: 'all' })
    }, true);
  },

  // ==========================================
  // CRM — LOG A PHONE ORDER (customer called in, not via app)
  // ==========================================
  async getPlansForCrm() {
    if (CONFIG.USE_MOCKS) {
      await delay(150);
      return { plans: MOCK_PLAN_ROWS };
    }
    // Real backend returns this exact flat shape from GET /api/menu/plans —
    // one row per plan-tier + duration + meals/day combination.
    return httpFetch('/menu/plans', { method: 'GET' });
  },

  async createManualOrder(orderData) {
    if (CONFIG.USE_MOCKS) {
      await delay(500);
      const id = 'cust_' + Math.random().toString(36).slice(2, 8);
      const record = { id, ...orderData, status: 'active', tiffins_remaining: 30, source: 'admin_phone_order' };
      localCustomers[id] = record;
      return { success: true, message: `Phone order logged for ${orderData.name}.`, customer: record };
    }
    return httpFetch('/admin/orders/manual', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, true);
  },

  // ==========================================
  // ATTENDANCE REGISTER
  // ==========================================
  async getAttendanceRegister(date) {
    if (CONFIG.USE_MOCKS) {
      await delay(300);
      return { date: date || 'today', register: MOCK_ATTENDANCE_REGISTER };
    }
    const params = date ? `?date=${date}` : '';
    return httpFetch(`/admin/attendance${params}`, { method: 'GET' }, true);
  },

  // ==========================================
  // DELIVERY PARTNERS (for CRM area-assignment + attendance/live map)
  // ==========================================
  async getPartners() {
    if (CONFIG.USE_MOCKS) {
      await delay(200);
      return { partners: MOCK_PARTNERS };
    }
    return httpFetch('/admin/partners', { method: 'GET' }, true);
  },

  async createPartner(partnerData) {
    if (CONFIG.USE_MOCKS) {
      await delay(400);
      return { success: true, partner: { id: 'partner_' + Date.now(), ...partnerData } };
    }
    return httpFetch('/admin/partners', {
      method: 'POST',
      body: JSON.stringify(partnerData)
    }, true);
  },

  async resetPartnerPin(partnerId, pin) {
    if (CONFIG.USE_MOCKS) {
      await delay(300);
      return { success: true };
    }
    return httpFetch(`/admin/partners/${partnerId}/pin`, {
      method: 'PATCH',
      body: JSON.stringify({ pin })
    }, true);
  },

  async getLiveLocations() {
    if (CONFIG.USE_MOCKS) {
      await delay(250);
      return MOCK_LIVE_LOCATIONS;
    }
    return httpFetch('/admin/partners/live-locations', { method: 'GET' }, true);
  }
};

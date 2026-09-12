/**
 * Admin Authentication (standalone app — one role only)
 */
import { CONFIG } from './config.js';
import { api } from './api.js';

export const auth = {
  isAdminAuthenticated() {
    return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
  },

  getAdminToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
  },

  getAdminUser() {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_USER);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async loginAdmin(email, password) {
    const res = await api.adminLogin(email, password);
    if (res.token) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN, res.token);
      if (res.admin) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_USER, JSON.stringify(res.admin));
      }
      return res;
    }
    throw new Error('Admin authentication failed');
  },

  logoutAdmin() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_USER);
    window.location.hash = '#/login';
  }
};

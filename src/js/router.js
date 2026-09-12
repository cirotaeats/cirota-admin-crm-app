/**
 * Cirota Admin/CRM App — Router (single-role app, no hostname switching needed)
 */
import { CONFIG } from './config.js';
import { auth } from './auth.js';

import { renderAdminDashboard } from './admin/dashboard.js';
import { renderAdminCustomers } from './admin/customers.js';
import { renderDailySheet } from './admin/daily-sheet.js';
import { renderKitchenSummary } from './admin/kitchen.js';
import { renderAdminDues } from './admin/dues.js';
import { renderCrmNewOrder } from './admin/crm-new-order.js';
import { renderAttendanceRegister } from './admin/attendance-register.js';
import { renderLiveMap, stopLiveMap } from './admin/live-map.js';

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash || '#/dashboard';
  const appContainer = document.getElementById('app-content');
  const headerContainer = document.getElementById('app-header-container');

  if (hash !== '#/live-map') stopLiveMap();

  const isAuthed = auth.isAdminAuthenticated() || CONFIG.USE_MOCKS;

  renderHeader(headerContainer);
  renderMobileNav();

  if (hash === '#/login') {
    renderAdminLogin(appContainer);
    return;
  }

  if (!isAuthed) {
    window.location.hash = '#/login';
    return;
  }

  switch (hash) {
    case '#/':
    case '#/dashboard':
      renderAdminDashboard(appContainer);
      break;
    case '#/customers':
      renderAdminCustomers(appContainer);
      break;
    case '#/daily-sheet':
      renderDailySheet(appContainer);
      break;
    case '#/kitchen':
      renderKitchenSummary(appContainer);
      break;
    case '#/dues':
      renderAdminDues(appContainer);
      break;
    case '#/crm-new-order':
      renderCrmNewOrder(appContainer);
      break;
    case '#/attendance':
      renderAttendanceRegister(appContainer);
      break;
    case '#/live-map':
      renderLiveMap(appContainer);
      break;
    default:
      renderAdminDashboard(appContainer);
      break;
  }
}

function renderHeader(container) {
  if (!container) return;
  const hash = window.location.hash || '#/dashboard';

  container.innerHTML = `
    <div class="header-container">
      <a href="#/dashboard" class="brand-logo">
        <div class="logo-mark">
          <svg viewBox="0 0 24 24">
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
          </svg>
        </div>
        <div class="brand-text">
          <div style="display:flex;align-items:center;">
            <span class="brand-title">CIROTA</span>
            <span class="brand-badge-admin">Admin</span>
          </div>
          <span class="brand-tagline">ops &amp; CRM</span>
        </div>
      </a>
      <nav class="nav-actions">
        <a href="#/dashboard" class="nav-link ${hash.includes('dashboard') || hash === '#/' ? 'active' : ''}">Dashboard</a>
        <a href="#/daily-sheet" class="nav-link ${hash.includes('daily-sheet') ? 'active' : ''}">Daily Sheet</a>
        <a href="#/kitchen" class="nav-link ${hash.includes('kitchen') ? 'active' : ''}">Kitchen</a>
        <a href="#/customers" class="nav-link ${hash.includes('customers') ? 'active' : ''}">Subscribers</a>
        <a href="#/dues" class="nav-link ${hash.includes('dues') ? 'active' : ''}">Dues</a>
        <a href="#/attendance" class="nav-link ${hash.includes('attendance') ? 'active' : ''}">Attendance</a>
        <a href="#/live-map" class="nav-link ${hash.includes('live-map') ? 'active' : ''}">Live Map</a>
        <a href="#/crm-new-order" class="btn btn-accent btn-sm" style="margin-left:6px;">📞 Phone Order</a>
        <button class="btn btn-outline-accent btn-sm" id="btn-admin-logout" style="margin-left:8px;">Logout</button>
      </nav>
    </div>
  `;

  const logoutBtn = container.querySelector('#btn-admin-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => auth.logoutAdmin());
}

function renderMobileNav() {
  const mobileNavContainer = document.getElementById('app-mobile-nav');
  if (!mobileNavContainer) return;
  const hash = window.location.hash || '#/dashboard';

  if (hash.includes('login')) {
    mobileNavContainer.style.display = 'none';
    return;
  }
  mobileNavContainer.style.display = '';

  const items = [
    ['#/dashboard', '📊', 'Overview', hash.includes('dashboard') || hash === '#/'],
    ['#/daily-sheet', '📋', 'Sheet', hash.includes('daily-sheet')],
    ['#/kitchen', '👨‍🍳', 'Kitchen', hash.includes('kitchen')],
    ['#/attendance', '📍', 'Attend.', hash.includes('attendance')],
    ['#/crm-new-order', '📞', 'Phone Order', hash.includes('crm-new-order')],
  ];

  mobileNavContainer.innerHTML = items.map(([href, icon, label, active]) => `
    <a href="${href}" class="mobile-nav-item ${active ? 'active' : ''}">
      <span class="mobile-nav-icon">${icon}</span><span>${label}</span>
    </a>
  `).join('');
}

function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="cirota-card" style="max-width: 420px; margin: 3rem auto; text-align: center; padding: 2.5rem 2rem;">
      <span class="brand-badge-admin" style="margin-bottom: 0.5rem; display: inline-block;">Kitchen &amp; Ops Portal</span>
      <h1 style="font-size: 1.6rem; color: var(--color-primary); margin-bottom: 0.25rem;">Admin Sign In</h1>
      <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
        Authorized access for Cirota staff.
      </p>

      <form id="admin-login-form">
        <div class="form-group" style="text-align: left;">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="admin-email" value="admin@cirota.in" required />
        </div>
        <div class="form-group" style="text-align: left;">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="admin-password" value="cirota123" required />
        </div>
        <button type="submit" class="btn btn-primary btn-full" id="btn-admin-submit" style="margin-top: 1rem;">
          Sign In to Admin Hub
        </button>
      </form>
    </div>
  `;

  container.querySelector('#admin-login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#admin-email').value;
    const pass = container.querySelector('#admin-password').value;
    const btn = container.querySelector('#btn-admin-submit');
    btn.disabled = true;
    btn.textContent = 'Signing in...';
    try {
      await auth.loginAdmin(email, pass);
      window.location.hash = '#/dashboard';
    } catch (err) {
      alert(err.message || 'Login failed');
      btn.disabled = false;
      btn.textContent = 'Sign In to Admin Hub';
    }
  });
}

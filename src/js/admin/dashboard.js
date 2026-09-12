/**
 * Admin Dashboard View (§5 item 2)
 * Displays overview operational metrics, live tiffin tallies, low-balance alerts, and manual Google Sheets sync trigger.
 */
import { api } from '../api.js';

export async function renderAdminDashboard(containerElement) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div class="skeleton" style="height: 120px; width: 100%; margin-bottom: 1.5rem;"></div>
      <div class="skeleton" style="height: 300px; width: 100%;"></div>
    </div>
  `;

  try {
    const stats = await api.getAdminDashboardStats();

    containerElement.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Header & Quick Sync -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
          <div>
            <span class="brand-badge-admin">Admin Portal</span>
            <h1 style="font-size: 1.8rem; color: var(--color-primary); margin-top: 4px;">Operations & Kitchen Hub</h1>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">
              Live Ranchi dispatch overview • Sync with Google Sheets
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.8rem; color: var(--color-text-muted);">
              Synced: <strong id="sheets-synced-time">${stats.last_synced_sheets || 'Just now'}</strong>
            </span>
            <button class="btn btn-outline btn-sm" id="btn-force-sync">
              <span>🔄 Force Sheets Sync</span>
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards (§5 item 2) -->
        <div class="admin-metrics-grid">
          <!-- Active Subscribers -->
          <div class="metric-card">
            <div class="metric-icon" style="background: var(--color-accent-soft); color: var(--color-accent);">
              👥
            </div>
            <div class="metric-data">
              <h3>${stats.active_customers}</h3>
              <p>Active Customers</p>
            </div>
          </div>

          <!-- Today's Total Tiffins -->
          <div class="metric-card">
            <div class="metric-icon" style="background: var(--color-gold-soft); color: #B27B00;">
              🍱
            </div>
            <div class="metric-data">
              <h3>${stats.today_total_tiffins}</h3>
              <p>Today's Total Tiffins</p>
            </div>
          </div>

          <!-- Customers with Dues -->
          <div class="metric-card">
            <div class="metric-icon" style="background: var(--color-danger-soft); color: var(--color-danger);">
              ⚠️
            </div>
            <div class="metric-data">
              <h3>${stats.customers_with_dues}</h3>
              <p>Pending Dues</p>
            </div>
          </div>

          <!-- Low Balance Customers -->
          <div class="metric-card">
            <div class="metric-icon" style="background: var(--color-success-soft); color: var(--color-success);">
              ⏳
            </div>
            <div class="metric-data">
              <h3>${stats.low_balance_customers}</h3>
              <p>Low Balance (&le; 3 days)</p>
            </div>
          </div>
        </div>

        <!-- Quick Navigation Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
          <a href="#/admin/daily-sheet" class="cirota-card" style="display: block; text-decoration: none;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📋</div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">Daily Delivery Sheet</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">Manage rider dispatches, area routes, and mark delivered.</p>
          </a>

          <a href="#/admin/kitchen" class="cirota-card" style="display: block; text-decoration: none;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👨‍🍳</div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">Kitchen Prep Summary</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">Print-ready meal totals, roti counts, and area splits.</p>
          </a>

          <a href="#/admin/customers" class="cirota-card" style="display: block; text-decoration: none;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👥</div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">Customer Directory</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">Search subscribers, manual cash receipts, and overrides.</p>
          </a>

          <a href="#/admin/dues" class="cirota-card" style="display: block; text-decoration: none;">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">💬</div>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">Dues & WhatsApp Reminders</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-muted);">Send 1-click WhatsApp payment reminders with deep links.</p>
          </a>
        </div>
      </div>
    `;

    // Force Sync Trigger (§5 item 7)
    const btnSync = containerElement.querySelector('#btn-force-sync');
    const timeLabel = containerElement.querySelector('#sheets-synced-time');
    btnSync.addEventListener('click', async () => {
      btnSync.disabled = true;
      btnSync.innerHTML = '<span>⏳ Syncing...</span>';
      try {
        const res = await api.triggerSheetsSync();
        timeLabel.textContent = res.synced_at;
        btnSync.innerHTML = '<span>✓ Synced!</span>';
        setTimeout(() => {
          btnSync.disabled = false;
          btnSync.innerHTML = '<span>🔄 Force Sheets Sync</span>';
        }, 2000);
      } catch (err) {
        alert(err.message || 'Sheets sync failed');
        btnSync.disabled = false;
        btnSync.innerHTML = '<span>🔄 Force Sheets Sync</span>';
      }
    });

  } catch (err) {
    containerElement.innerHTML = `
      <div class="cirota-card" style="text-align: center; margin: 2rem auto; max-width: 500px;">
        <h3 style="color: var(--color-danger);">Error Loading Admin Hub</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

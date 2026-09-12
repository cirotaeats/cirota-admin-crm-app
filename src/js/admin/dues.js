/**
 * Admin Dues & WhatsApp Reminders View (§5 item 6)
 * Lists subscribers with pending balance and provides 1-click wa.me deep links with prefilled reminder templates.
 */
import { api } from '../api.js';

export async function renderAdminDues(containerElement) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div class="skeleton" style="height: 300px; width: 100%;"></div>
    </div>
  `;

  try {
    const { dues } = await api.getDuesList();

    let rowsHtml = '';
    dues.forEach(d => {
      // Build WhatsApp message template
      const waMessage = `Hi ${d.name}, gentle reminder from Cirota Tiffin Ranchi. Your tiffin renewal balance of ₹${d.due_amount} is pending (${d.days_overdue} days overdue). Please renew at https://cirota.in/#/plan to ensure uninterrupted daily tiffin delivery. Thank you!`;
      const waUrl = `https://wa.me/${d.phone}?text=${encodeURIComponent(waMessage)}`;

      rowsHtml += `
        <tr>
          <td>
            <strong>${d.name}</strong><br>
            <small style="color: var(--color-text-muted);">${d.phone}</small>
          </td>
          <td><span class="star-badge">${d.area}</span></td>
          <td>${d.plan}</td>
          <td><strong style="color: var(--color-danger); font-size: 1.1rem;">₹${d.due_amount}</strong></td>
          <td>
            <span style="color: var(--color-danger); font-weight: 700;">${d.days_overdue} days overdue</span><br>
            <small style="color: var(--color-text-muted);">Last: ${d.last_reminder_sent}</small>
          </td>
          <td>
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-sm" style="background: #25D366; color: #FFFFFF; font-weight: 700;">
              <span>💬 Send WhatsApp</span>
            </a>
          </td>
        </tr>
      `;
    });

    containerElement.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <a href="#/admin/dashboard" class="btn btn-outline btn-sm">← Back to Admin Hub</a>
            <h1 style="font-size: 1.6rem; color: var(--color-primary); margin-top: 4px;">Pending Dues & Collections</h1>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">
              Send instant WhatsApp payment links to overdue accounts.
            </p>
          </div>
        </div>

        <!-- Dues Table -->
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Subscriber</th>
                <th>Area</th>
                <th>Current Plan</th>
                <th>Pending Due</th>
                <th>Overdue Status</th>
                <th>Direct Action</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    containerElement.innerHTML = `
      <div class="cirota-card" style="text-align: center; margin: 2rem auto; max-width: 500px;">
        <h3 style="color: var(--color-danger);">Error Loading Dues</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

/**
 * Admin Daily Delivery Sheet View (§5 item 4)
 * Real-time delivery tracking matching physical sheet columns: Partner, Area, Customer Name, Subscription, Roti Count, Rice, Notes & Delivered Checkbox.
 */
import { api } from '../api.js';

export async function renderDailySheet(containerElement) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div class="skeleton" style="height: 350px; width: 100%;"></div>
    </div>
  `;

  try {
    let selectedDate = '2026-08-27';

    async function loadSheet() {
      const { rows } = await api.getDailySheet(selectedDate);

      let rowsHtml = '';
      rows.forEach(r => {
        const isDelivered = r.delivered;
        rowsHtml += `
          <tr style="${isDelivered ? 'background: rgba(232, 245, 233, 0.4);' : ''}">
            <td><strong style="color: var(--color-primary);">${r.partner}</strong></td>
            <td><span class="star-badge">${r.area}</span></td>
            <td>
              <strong>${r.customer_name}</strong><br>
              <small style="color: var(--color-text-muted);">${r.phone}</small>
            </td>
            <td>${r.subscription}</td>
            <td>
              <input
                type="number"
                class="roti-input-inline"
                data-row-id="${r.id}"
                value="${r.roti_count}"
                min="0"
                max="10"
              />
            </td>
            <td>${r.rice_portion}</td>
            <td style="font-size: 0.8rem; color: var(--color-text-muted);">${r.special_notes || '—'}</td>
            <td>
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input
                  type="checkbox"
                  class="delivery-toggle-checkbox"
                  data-row-id="${r.id}"
                  ${isDelivered ? 'checked' : ''}
                  style="width: 18px; height: 18px; accent-color: var(--color-success);"
                />
                <span style="font-weight: 600; font-size: 0.82rem; color: ${isDelivered ? 'var(--color-success)' : 'var(--color-text-muted)'};">
                  ${isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </label>
            </td>
          </tr>
        `;
      });

      containerElement.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <a href="#/admin/dashboard" class="btn btn-outline btn-sm">← Back to Admin Hub</a>
              <h1 style="font-size: 1.6rem; color: var(--color-primary); margin-top: 4px;">Daily Delivery Sheet</h1>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <label class="form-label" style="margin-bottom:0;">Date:</label>
              <input type="date" class="form-input" id="sheet-date-picker" value="${selectedDate}" style="padding: 0.4rem 0.8rem;" />
            </div>
          </div>

          <!-- Sheet Table -->
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Partner / Rider</th>
                  <th>Area</th>
                  <th>Customer</th>
                  <th>Subscription</th>
                  <th>Rotis</th>
                  <th>Rice</th>
                  <th>Special Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // Date Picker handler
      containerElement.querySelector('#sheet-date-picker').addEventListener('change', (e) => {
        selectedDate = e.target.value;
        loadSheet();
      });

      // Inline Delivered Checkboxes
      containerElement.querySelectorAll('.delivery-toggle-checkbox').forEach(cb => {
        cb.addEventListener('change', async (e) => {
          const rowId = e.target.dataset.rowId;
          const checked = e.target.checked;
          try {
            await api.markDailySheetDelivered(rowId, checked);
            loadSheet();
          } catch (err) {
            alert('Failed to update status');
            e.target.checked = !checked;
          }
        });
      });

      // Inline Roti Inputs
      containerElement.querySelectorAll('.roti-input-inline').forEach(input => {
        input.addEventListener('change', async (e) => {
          const rowId = e.target.dataset.rowId;
          const val = e.target.value;
          try {
            await api.updateDailySheetRoti(rowId, val);
          } catch (err) {
            console.warn('Failed to update roti count', err);
          }
        });
      });
    }

    loadSheet();
  } catch (err) {
    containerElement.innerHTML = `
      <div class="cirota-card" style="text-align: center; margin: 2rem auto; max-width: 500px;">
        <h3 style="color: var(--color-danger);">Error Loading Daily Sheet</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

/**
 * CRM — Log a Phone Order
 * For when a customer calls in directly instead of ordering through the app.
 * Reuses the exact same subscription logic as self-serve checkout on the backend,
 * so tiffin counts stay consistent no matter which channel the order came from.
 */
import { api } from '../api.js';

const MEAL_LABEL = { 1: '1x/day (Lunch or Dinner)', 2: '2x/day (Lunch + Dinner)', 3: '3x/day (All meals)' };

function planRowLabel(row) {
  const durationLabel = row.duration_days === 1 ? 'Single Tiffin (trial)' : `${row.duration_days} Days`;
  return `${row.name} — ${MEAL_LABEL[row.times_per_week]} — ${durationLabel} — ₹${row.total_price}`;
}

export async function renderCrmNewOrder(containerElement) {
  if (!containerElement) return;
  containerElement.innerHTML = `<div class="skeleton" style="height:400px; max-width:600px; margin:0 auto;"></div>`;

  let planRows = [];
  try {
    const res = await api.getPlansForCrm();
    planRows = res.plans || res || [];
  } catch (err) {
    containerElement.innerHTML = `<div class="cirota-card" style="max-width:500px;margin:2rem auto;text-align:center;"><p>Could not load plans: ${err.message}</p></div>`;
    return;
  }

  let selectedRowId = planRows[0]?.id || '';

  function render() {
    const selectedRow = planRows.find(r => r.id === selectedRowId) || planRows[0];

    containerElement.innerHTML = `
      <div style="max-width: 640px; margin: 0 auto;">
        <div class="cirota-card">
          <h2 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.25rem;">📞 Log a Phone Order</h2>
          <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
            For customers who call in directly. This creates their subscription and deducts tiffins exactly like a self-serve order.
          </p>

          <form id="crm-order-form">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label class="form-label">Customer Name</label>
                <input type="text" class="form-input" id="crm-name" required />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" id="crm-phone" placeholder="10-digit number" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Area</label>
              <input type="text" class="form-input" id="crm-area" placeholder="e.g. Lalpur" required />
            </div>
            <div class="form-group">
              <label class="form-label">Full Delivery Address</label>
              <input type="text" class="form-input" id="crm-address" required />
            </div>

            <div class="form-group">
              <label class="form-label">Plan, Meals/Day &amp; Duration</label>
              <select class="form-select" id="crm-plan-row">
                ${planRows.map(r => `<option value="${r.id}" ${r.id === selectedRowId ? 'selected' : ''}>${planRowLabel(r)}</option>`).join('')}
              </select>
            </div>

            <div class="cirota-card" style="background: var(--color-bg-subtle, #F3E8F7); display:flex; justify-content:space-between; align-items:center; margin: 1rem 0;">
              <span style="font-size:0.85rem; font-weight:600;">Order Total</span>
              <span style="font-size:1.4rem; font-weight:800; color: var(--color-primary);">₹${selectedRow?.total_price || 0}</span>
            </div>

            <button type="submit" class="btn btn-primary btn-full" id="crm-submit-btn">Log Order &amp; Deduct Tiffins</button>
          </form>
        </div>
      </div>
    `;

    containerElement.querySelector('#crm-plan-row').addEventListener('change', (e) => {
      selectedRowId = e.target.value;
      render();
    });

    containerElement.querySelector('#crm-order-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = containerElement.querySelector('#crm-submit-btn');
      btn.disabled = true;
      btn.textContent = 'Logging order…';

      const row = planRows.find(r => r.id === selectedRowId);
      const payload = {
        name: containerElement.querySelector('#crm-name').value,
        phone: containerElement.querySelector('#crm-phone').value,
        area: containerElement.querySelector('#crm-area').value,
        address: containerElement.querySelector('#crm-address').value,
        plan_id: row.id,
        times_per_day: row.times_per_week, // this field historically encodes meals/day, not week-days
      };

      try {
        const result = await api.createManualOrder(payload);
        containerElement.innerHTML = `
          <div class="cirota-card" style="max-width: 500px; margin: 2rem auto; text-align:center;">
            <h3 style="color: var(--color-success, #16a34a); margin-bottom: 0.5rem;">✅ Order Logged</h3>
            <p style="color: var(--color-text-muted); margin-bottom: 1.25rem;">${result.message || `${payload.name}'s tiffins have been deducted from their plan.`}</p>
            <button class="btn btn-primary btn-full" id="crm-log-another">Log Another Order</button>
          </div>
        `;
        containerElement.querySelector('#crm-log-another').addEventListener('click', () => renderCrmNewOrder(containerElement));
      } catch (err) {
        alert(err.message || 'Failed to log this order. Please try again.');
        btn.disabled = false;
        btn.textContent = 'Log Order & Deduct Tiffins';
      }
    });
  }

  render();
}

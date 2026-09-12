/**
 * Admin Customer Management View (§5 item 3)
 * Searchable, filterable subscriber table with manual cash overrides and balance adjustments.
 */
import { api } from '../api.js';

export async function renderAdminCustomers(containerElement) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div class="skeleton" style="height: 350px; width: 100%;"></div>
    </div>
  `;

  try {
    let currentQuery = '';
    let currentArea = 'all';
    let currentStatus = 'all';

    async function loadTable() {
      const { customers } = await api.getAdminCustomers(currentQuery, currentArea, currentStatus);

      let rowsHtml = '';
      if (customers.length === 0) {
        rowsHtml = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--color-text-muted);">No subscribers match the filter.</td></tr>`;
      } else {
        customers.forEach(c => {
          rowsHtml += `
            <tr>
              <td>
                <strong>${c.name}</strong><br>
                <small style="color: var(--color-text-muted);">${c.phone}</small>
              </td>
              <td><span class="star-badge">${c.area}</span></td>
              <td>${c.plan_id.replace('plan_', '').replace('_', ' ').toUpperCase()}</td>
              <td><strong>${c.validity_days_remaining}</strong> / ${c.validity_days_total || 30} days</td>
              <td>${c.meals_remaining_count || 0} left</td>
              <td>
                <span class="status-pill ${c.status === 'active' ? 'status-active' : (c.status === 'paused_indefinite' ? 'status-paused' : 'status-stopped')}">
                  ${c.status}
                </span>
              </td>
              <td>
                <button class="btn btn-outline btn-sm btn-edit-customer" data-cust-id="${c.id}">
                  ⚙️ Edit / Cash
                </button>
              </td>
            </tr>
          `;
        });
      }

      containerElement.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <a href="#/admin/dashboard" class="btn btn-outline btn-sm">← Back to Admin Hub</a>
              <h1 style="font-size: 1.6rem; color: var(--color-primary); margin-top: 4px;">Subscriber Directory</h1>
            </div>
          </div>

          <!-- Filters Bar -->
          <div class="cirota-card" style="padding: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Search Name / Phone</label>
                <input type="text" class="form-input" id="search-cust-input" placeholder="Type to filter..." value="${currentQuery}" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Filter Area</label>
                <select class="form-select" id="filter-area-select">
                  <option value="all" ${currentArea === 'all' ? 'selected' : ''}>All Areas</option>
                  <option value="Lalpur" ${currentArea === 'Lalpur' ? 'selected' : ''}>Lalpur</option>
                  <option value="Kanke Road" ${currentArea === 'Kanke Road' ? 'selected' : ''}>Kanke Road</option>
                  <option value="Morabadi" ${currentArea === 'Morabadi' ? 'selected' : ''}>Morabadi</option>
                  <option value="Doranda" ${currentArea === 'Doranda' ? 'selected' : ''}>Doranda</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Status</label>
                <select class="form-select" id="filter-status-select">
                  <option value="all" ${currentStatus === 'all' ? 'selected' : ''}>All Statuses</option>
                  <option value="active" ${currentStatus === 'active' ? 'selected' : ''}>Active</option>
                  <option value="paused_indefinite" ${currentStatus === 'paused_indefinite' ? 'selected' : ''}>Paused</option>
                  <option value="stopped_no_balance" ${currentStatus === 'stopped_no_balance' ? 'selected' : ''}>Stopped</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Customers Table -->
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Subscriber</th>
                  <th>Area</th>
                  <th>Plan Tier</th>
                  <th>Validity</th>
                  <th>Meals</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Manual Edit Override Modal -->
        <div class="modal-overlay" id="edit-customer-modal">
          <div class="modal-card">
            <div class="modal-header">
              <h3 class="modal-title" id="edit-modal-title">Edit Subscriber</h3>
              <button class="btn-icon" id="edit-modal-close" style="background:none;font-size:1.4rem;">✕</button>
            </div>
            <div class="modal-body">
              <form id="edit-customer-form">
                <input type="hidden" id="edit-cust-id" />
                <div class="form-group">
                  <label class="form-label">Add Validity Days (Manual Cash Payment)</label>
                  <input type="number" class="form-input" id="edit-add-days" value="0" />
                  <small style="color: var(--color-text-muted);">e.g. +30 for monthly cash renewal</small>
                </div>
                <div class="form-group">
                  <label class="form-label">Subscription Status</label>
                  <select class="form-select" id="edit-status">
                    <option value="active">Active</option>
                    <option value="paused_indefinite">Paused Indefinite</option>
                    <option value="stopped_no_balance">Stopped (No Balance)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Outstanding Dues (₹)</label>
                  <input type="number" class="form-input" id="edit-dues" value="0" />
                </div>
              </form>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" id="edit-modal-cancel">Cancel</button>
              <button class="btn btn-primary" id="edit-modal-save">Save Override</button>
            </div>
          </div>
        </div>
      `;

      // Filter event handlers
      containerElement.querySelector('#search-cust-input').addEventListener('input', (e) => {
        currentQuery = e.target.value;
        loadTable();
      });
      containerElement.querySelector('#filter-area-select').addEventListener('change', (e) => {
        currentArea = e.target.value;
        loadTable();
      });
      containerElement.querySelector('#filter-status-select').addEventListener('change', (e) => {
        currentStatus = e.target.value;
        loadTable();
      });

      // Edit modal handlers
      const modal = containerElement.querySelector('#edit-customer-modal');
      const editIdInput = containerElement.querySelector('#edit-cust-id');
      const editDaysInput = containerElement.querySelector('#edit-add-days');
      const editStatusInput = containerElement.querySelector('#edit-status');
      const editDuesInput = containerElement.querySelector('#edit-dues');
      const btnSave = containerElement.querySelector('#edit-modal-save');
      const btnCancel = containerElement.querySelector('#edit-modal-cancel');
      const btnClose = containerElement.querySelector('#edit-modal-close');

      const closeModal = () => modal.classList.remove('active');
      btnCancel.addEventListener('click', closeModal);
      btnClose.addEventListener('click', closeModal);

      containerElement.querySelectorAll('.btn-edit-customer').forEach(btn => {
        btn.addEventListener('click', () => {
          const custId = btn.dataset.custId;
          const target = customers.find(c => c.id === custId);
          if (target) {
            editIdInput.value = target.id;
            editDaysInput.value = 0;
            editStatusInput.value = target.status;
            editDuesInput.value = target.dues_amount || 0;
            containerElement.querySelector('#edit-modal-title').textContent = `Override: ${target.name}`;
            modal.classList.add('active');
          }
        });
      });

      btnSave.addEventListener('click', async () => {
        const custId = editIdInput.value;
        const addDays = parseInt(editDaysInput.value, 10) || 0;
        const status = editStatusInput.value;
        const dues = parseInt(editDuesInput.value, 10) || 0;

        const target = customers.find(c => c.id === custId);
        const newRemaining = (target?.validity_days_remaining || 0) + addDays;

        btnSave.disabled = true;
        btnSave.textContent = 'Saving...';
        try {
          await api.updateCustomerManual(custId, {
            status,
            validity_days_remaining: Math.max(0, newRemaining),
            dues_amount: dues
          });
          closeModal();
          loadTable();
        } catch (err) {
          alert(err.message || 'Failed to update customer');
        } finally {
          btnSave.disabled = false;
          btnSave.textContent = 'Save Override';
        }
      });
    }

    loadTable();
  } catch (err) {
    containerElement.innerHTML = `
      <div class="cirota-card" style="text-align: center; margin: 2rem auto; max-width: 500px;">
        <h3 style="color: var(--color-danger);">Error Loading Customers</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

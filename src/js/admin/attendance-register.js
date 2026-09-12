/**
 * Attendance Register — every delivery partner's check-in status for today's
 * 3 shifts (breakfast/lunch/dinner), each with the location they checked in from.
 */
import { api } from '../api.js';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export async function renderAttendanceRegister(containerElement) {
  if (!containerElement) return;
  containerElement.innerHTML = `<div class="skeleton" style="height:400px; max-width:800px; margin:0 auto;"></div>`;

  try {
    const { date, register } = await api.getAttendanceRegister();

    containerElement.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <div class="cirota-card" style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.15rem;">📋 Attendance Register</h2>
          <p style="font-size: 0.82rem; color: var(--color-text-muted);">
            ${date} — riders check in for each of their 3 shifts; each check-in captures their location.
          </p>
        </div>

        <div class="cirota-card" style="padding:0; overflow-x:auto;">
          <table class="admin-table" style="width:100%;">
            <thead>
              <tr>
                <th>Rider</th>
                <th>Area</th>
                <th>🌅 Breakfast</th>
                <th>☀️ Lunch</th>
                <th>🌙 Dinner</th>
              </tr>
            </thead>
            <tbody>
              ${register.map(r => `
                <tr>
                  <td>
                    <div style="font-weight:600;">${r.name}</div>
                    <div style="font-size:0.72rem; color: var(--color-text-muted);">${r.phone}</div>
                  </td>
                  <td>${r.assigned_area}</td>
                  ${['breakfast', 'lunch', 'dinner'].map(mt => {
                    const shift = r.shifts[mt];
                    return `<td>${shift
                      ? `<span class="status-pill status-active">✓ ${formatTime(shift.checked_in_at)}</span>`
                      : `<span class="status-pill status-paused">Not yet</span>`
                    }</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${register.length === 0 ? `<p style="text-align:center; color: var(--color-text-muted); margin-top:1rem;">No active delivery partners found.</p>` : ''}
      </div>
    `;
  } catch (err) {
    containerElement.innerHTML = `
      <div class="cirota-card" style="max-width: 500px; margin: 2rem auto; text-align: center;">
        <h3 style="color: var(--color-danger);">Error Loading Attendance</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

/**
 * Kitchen Prep Summary View (§5 item 5)
 * Large-print, high-legibility view of meal totals, roti production tallies, and area dispatches.
 * Optimized for kitchen glanceability and one-click thermal/paper printing via window.print().
 */
import { api } from '../api.js';

export async function renderKitchenSummary(containerElement) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div class="skeleton" style="height: 350px; width: 100%;"></div>
    </div>
  `;

  try {
    let selectedDate = '2026-08-27';
    const { summary } = await api.getKitchenSummary(selectedDate);
    const { breakdown, area_distribution, total_packets_today } = summary;

    containerElement.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Header & Print Action -->
        <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <a href="#/admin/dashboard" class="btn btn-outline btn-sm">← Back to Admin Hub</a>
            <h1 style="font-size: 1.8rem; color: var(--color-primary); margin-top: 4px;">Kitchen Prep Summary</h1>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">
              Production counts for Ranchi Kitchen • ${selectedDate}
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button class="btn btn-primary" id="btn-print-kitchen" style="padding: 0.75rem 1.5rem;">
              <span>🖨️ Print Kitchen Sheet</span>
            </button>
          </div>
        </div>

        <!-- Print-only Header -->
        <div class="kitchen-print-header">
          <h1>CIROTA KITCHEN PREP SHEET</h1>
          <p>Date: ${selectedDate} • Total Daily Packets: ${total_packets_today}</p>
        </div>

        <!-- Overall Daily Total Banner -->
        <div class="cirota-card" style="background: linear-gradient(135deg, var(--color-primary), #63238F); color: #fff; text-align: center; padding: 1.5rem;">
          <div style="font-size: 0.9rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #E8D2F5;">
            Total Tiffins Prepared Today
          </div>
          <div style="font-size: 3.5rem; font-weight: 900; font-family: var(--font-heading); line-height: 1; margin: 0.25rem 0; color: #FFFFFF;">
            ${total_packets_today}
          </div>
          <div style="font-size: 0.85rem; color: #E8D2F5;">
            Breakfast (${breakdown.breakfast.total}) + Lunch (${breakdown.lunch.total}) + Dinner (${breakdown.dinner.total})
          </div>
        </div>

        <!-- Meal Type Breakdown Grid (§5 item 5) -->
        <div class="kitchen-summary-grid">
          <!-- 1. Breakfast Card -->
          <div class="kitchen-meal-block">
            <div class="kitchen-meal-title">
              <span>🌅 BREAKFAST</span>
              <span class="kitchen-count-number">${breakdown.breakfast.total} pkts</span>
            </div>
            <div class="kitchen-count-row">
              <span>Veg Lite:</span>
              <strong style="color: var(--color-primary);">${breakdown.breakfast.veg_lite}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Veg Prime:</span>
              <strong style="color: var(--color-primary);">${breakdown.breakfast.veg_prime}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Non-Veg (Lite/Prime):</span>
              <strong style="color: var(--color-primary);">${breakdown.breakfast.nonveg_lite + breakdown.breakfast.nonveg_prime}</strong>
            </div>
            <div class="kitchen-count-row" style="border-top: 2px solid var(--color-primary); margin-top: 8px; padding-top: 8px;">
              <span>Total Poori / Paratha:</span>
              <strong style="color: var(--color-accent); font-size: 1.3rem;">${breakdown.breakfast.total_rotis_parathas} pcs</strong>
            </div>
          </div>

          <!-- 2. Lunch Card -->
          <div class="kitchen-meal-block" style="border-color: var(--color-accent);">
            <div class="kitchen-meal-title" style="color: var(--color-accent);">
              <span>☀️ LUNCH</span>
              <span class="kitchen-count-number" style="color: var(--color-accent);">${breakdown.lunch.total} pkts</span>
            </div>
            <div class="kitchen-count-row">
              <span>Veg Lite (Standard):</span>
              <strong style="color: var(--color-primary);">${breakdown.lunch.veg_lite}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Veg Prime (Paneer/Spl):</span>
              <strong style="color: var(--color-primary);">${breakdown.lunch.veg_prime}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Non-Veg (Curry/Egg):</span>
              <strong style="color: var(--color-primary);">${breakdown.lunch.nonveg_lite + breakdown.lunch.nonveg_prime}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Total Phulka Rotis:</span>
              <strong style="color: var(--color-accent); font-size: 1.3rem;">${breakdown.lunch.total_rotis_parathas} pcs</strong>
            </div>
            <div class="kitchen-count-row" style="border-top: 2px solid var(--color-accent); margin-top: 8px; padding-top: 8px;">
              <span>Approx Rice Required:</span>
              <strong style="color: var(--color-primary);">${breakdown.lunch.rice_kg_approx}</strong>
            </div>
          </div>

          <!-- 3. Dinner Card -->
          <div class="kitchen-meal-block">
            <div class="kitchen-meal-title">
              <span>🌙 DINNER</span>
              <span class="kitchen-count-number">${breakdown.dinner.total} pkts</span>
            </div>
            <div class="kitchen-count-row">
              <span>Veg Lite:</span>
              <strong style="color: var(--color-primary);">${breakdown.dinner.veg_lite}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Veg Prime:</span>
              <strong style="color: var(--color-primary);">${breakdown.dinner.veg_prime}</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Non-Veg:</span>
              <strong style="color: var(--color-primary);">${breakdown.dinner.nonveg_lite + breakdown.dinner.nonveg_prime}</strong>
            </div>
            <div class="kitchen-count-row" style="border-top: 2px solid var(--color-primary); margin-top: 8px; padding-top: 8px;">
              <span>Total Phulka Rotis:</span>
              <strong style="color: var(--color-accent); font-size: 1.3rem;">${breakdown.dinner.total_rotis_parathas} pcs</strong>
            </div>
            <div class="kitchen-count-row">
              <span>Approx Rice Required:</span>
              <strong style="color: var(--color-primary);">${breakdown.dinner.rice_kg_approx}</strong>
            </div>
          </div>
        </div>

        <!-- Area Distribution Summary -->
        <div class="cirota-card">
          <h3 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.75rem;">
            📍 Route & Area Distribution
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            ${area_distribution.map(a => `
              <div style="flex: 1; min-width: 140px; background: var(--color-bg); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1.5px solid var(--color-border); text-align: center;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">${a.area}</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-accent); font-family: var(--font-heading);">${a.packets}</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">packets</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Print Sheet Handler
    containerElement.querySelector('#btn-print-kitchen').addEventListener('click', () => {
      window.print();
    });

  } catch (err) {
    containerElement.innerHTML = `
      <div class="cirota-card" style="text-align: center; margin: 2rem auto; max-width: 500px;">
        <h3 style="color: var(--color-danger);">Error Loading Kitchen Summary</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
}

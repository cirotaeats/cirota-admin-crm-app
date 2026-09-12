/**
 * Live Ops Map — shows every currently on-duty rider's position at a glance.
 */
import { api } from '../api.js';

let leafletMap = null;
let markers = [];

export async function renderLiveMap(containerElement) {
  if (!containerElement) return;

  containerElement.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <div class="cirota-card" style="margin-bottom: 1rem;">
        <h2 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.15rem;">🗺️ Live Rider Map</h2>
        <p style="font-size: 0.82rem; color: var(--color-text-muted);">Riders currently on duty and sharing their location.</p>
      </div>
      <div id="ops-map" style="height: 420px; border-radius: 16px; overflow:hidden; background:#eee;"></div>
      <div id="ops-map-list" style="margin-top: 1rem;"></div>
    </div>
  `;

  try {
    const partners = await api.getLiveLocations();
    renderMap(partners);
    renderList(partners);
  } catch (err) {
    containerElement.querySelector('#ops-map').outerHTML = `<div class="cirota-card"><p>Could not load live locations: ${err.message}</p></div>`;
  }

  function renderMap(partners) {
    if (typeof L === 'undefined' || !document.getElementById('ops-map')) return;

    leafletMap = L.map('ops-map').setView([23.3745, 85.3312], 12); // Ranchi center
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(leafletMap);

    markers = partners.filter(p => p.current_lat && p.current_lng).map(p => {
      const icon = L.divIcon({ className: '', html: '<div style="font-size:26px;">🛵</div>', iconSize: [30, 30], iconAnchor: [15, 15] });
      return L.marker([p.current_lat, p.current_lng], { icon })
        .addTo(leafletMap)
        .bindPopup(`<strong>${p.name}</strong><br/>${p.assigned_area}`);
    });

    if (markers.length) {
      const group = L.featureGroup(markers);
      leafletMap.fitBounds(group.getBounds().pad(0.3));
    }
  }

  function renderList(partners) {
    const listEl = containerElement.querySelector('#ops-map-list');
    if (!listEl) return;
    if (!partners.length) {
      listEl.innerHTML = `<div class="cirota-card" style="text-align:center; color: var(--color-text-muted);">No riders are currently on duty.</div>`;
      return;
    }
    listEl.innerHTML = partners.map(p => `
      <div class="cirota-card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <div>
          <div style="font-weight:600;">${p.name}</div>
          <div style="font-size:0.75rem; color: var(--color-text-muted);">${p.assigned_area}</div>
        </div>
        <span class="status-pill status-active">🟢 On duty</span>
      </div>
    `).join('');
  }
}

export function stopLiveMap() {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
    markers = [];
  }
}

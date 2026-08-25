/**
 * MANGENESIS API Client
 * Interfaces with FastAPI Python backend on localhost:8000 for multi-mine telemetry and predictions.
 */

const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchMines() {
  try {
    const res = await fetch(`${API_BASE_URL}/mines`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchMines failed; using local registry fallback.', err);
    return null;
  }
}

export async function fetchLiveSatellite(mineId = 'gumgaon') {
  try {
    const res = await fetch(`${API_BASE_URL}/satellite/live?mine_id=${encodeURIComponent(mineId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchLiveSatellite failed; using local fallback.', err);
    return null;
  }
}

export async function fetchZones(mineId = 'gumgaon') {
  try {
    const res = await fetch(`${API_BASE_URL}/zones?mine_id=${encodeURIComponent(mineId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchZones failed; using local fallback.', err);
    return null;
  }
}

export async function fetchProduction(scenario = 'normal', mineId = 'gumgaon') {
  try {
    const res = await fetch(
      `${API_BASE_URL}/production?scenario=${encodeURIComponent(scenario)}&mine_id=${encodeURIComponent(mineId)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchProduction failed; using local fallback.', err);
    return null;
  }
}

export async function fetchRisk(scenario = 'normal', mineId = 'gumgaon') {
  try {
    const res = await fetch(
      `${API_BASE_URL}/risk?scenario=${encodeURIComponent(scenario)}&mine_id=${encodeURIComponent(mineId)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchRisk failed; using local fallback.', err);
    return null;
  }
}

export async function fetchActions(scenario = 'normal', mineId = 'gumgaon') {
  try {
    const res = await fetch(
      `${API_BASE_URL}/actions?scenario=${encodeURIComponent(scenario)}&mine_id=${encodeURIComponent(mineId)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchActions failed; using local fallback.', err);
    return null;
  }
}

export async function fetchSupabaseStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/supabase/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchSupabaseStatus failed.', err);
    return null;
  }
}

export async function seedSupabaseDatabase() {
  try {
    const res = await fetch(`${API_BASE_URL}/supabase/seed`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API seedSupabaseDatabase failed.', err);
    return null;
  }
}

export async function fetchAlertConfig() {
  try { const res = await fetch(`${API_BASE_URL}/alerts/config`); return await res.json(); } catch { return null; }
}

export async function updateAlertConfig(config) {
  try { const res = await fetch(`${API_BASE_URL}/alerts/config`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(config) }); return await res.json(); } catch { return null; }
}

export async function sendTestAlert(channel) {
  try { const res = await fetch(`${API_BASE_URL}/alerts/test`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({channel}) }); return await res.json(); } catch { return null; }
}

export async function fetchAlertHistory() {
  try { const res = await fetch(`${API_BASE_URL}/alerts/history`); return await res.json(); } catch { return []; }
}

export async function fetchPushNotifications() {
  try { const res = await fetch(`${API_BASE_URL}/alerts/push`); return await res.json(); } catch { return []; }
}

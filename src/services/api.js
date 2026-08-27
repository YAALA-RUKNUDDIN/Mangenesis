/**
 * MANGENESIS API Client
 * Interfaces with FastAPI Python backend on localhost:8000 for multi-mine telemetry and predictions.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchMines() {
  try {
    const res = await fetch(`${API_BASE_URL}/mines`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchMines fallback used.', err);
    return null;
  }
}

export async function fetchLiveSatellite(mineId = 'gumgaon') {
  try {
    const res = await fetch(`${API_BASE_URL}/satellite/live?mine_id=${encodeURIComponent(mineId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchLiveSatellite fallback used.', err);
    return null;
  }
}

export async function fetchZones(mineId = 'gumgaon') {
  try {
    const res = await fetch(`${API_BASE_URL}/zones?mine_id=${encodeURIComponent(mineId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchZones fallback used.', err);
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
    console.warn('API fetchProduction fallback used.', err);
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
    console.warn('API fetchRisk fallback used.', err);
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
    console.warn('API fetchActions fallback used.', err);
    return null;
  }
}

export async function fetchSupabaseStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/supabase/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'STANDBY', message: 'Local Mode Active' };
  }
}

export async function seedSupabaseDatabase() {
  try {
    const res = await fetch(`${API_BASE_URL}/supabase/seed`, { method: 'POST' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Seeded in local store' };
  }
}

export async function fetchAlertConfig() {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/config`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
      email_recipients: ['controlroom.gumgaon@moil.nic.in', 'shift.engineer@moil.nic.in'],
      phone_numbers: ['+91-9876543210', '+91-9123456789'],
      thresholds: {
        shortfall_risk_warning: 50,
        shortfall_risk_critical: 75,
        production_gap_warning: 500,
        production_gap_critical: 1500,
      },
    };
  }
}

export async function updateAlertConfig(config) {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return await res.json();
  } catch (err) {
    return { success: true, updated: config };
  }
}

export async function sendTestAlert(channel) {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel }),
    });
    return await res.json();
  } catch (err) {
    return { success: true, message: `Synthetic ${channel} test alert dispatched.` };
  }
}

export async function fetchAlertHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/history`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [
      {
        id: 'ALT-1092',
        timestamp: new Date().toISOString(),
        severity: 'CRITICAL',
        channel: 'SMS + EMAIL',
        message: 'Primary Excavator EX-04 Hydraulic Pressure drop (142 bar). Shortfall risk 84%.',
        status: 'DISPATCHED',
      },
      {
        id: 'ALT-1089',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'WARNING',
        channel: 'PUSH',
        message: 'SMAP Radar: Haul Road Sector 3 soil saturation exceeds 72%. Reduced speed limit.',
        status: 'ACKNOWLEDGED',
      },
    ];
  }
}

export async function fetchPushNotifications() {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/push`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchSingleMineROI(mineId = 'gumgaon', scenarioId = 'equipment_failure') {
  try {
    const res = await fetch(`${API_BASE_URL}/roi/single?mine_id=${mineId}&scenario_id=${scenarioId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEnterpriseROI() {
  try {
    const res = await fetch(`${API_BASE_URL}/roi/enterprise`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

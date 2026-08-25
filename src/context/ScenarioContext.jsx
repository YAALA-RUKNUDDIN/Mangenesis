import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  mines as localMines,
  historicalProduction as defaultHistorical,
  forecastProduction as defaultForecast,
} from '../data/mockData';
import {
  fetchMines,
  fetchLiveSatellite,
  fetchZones,
  fetchProduction,
  fetchRisk,
  fetchActions,
} from '../services/api';

const ScenarioContext = createContext();

export function ScenarioProvider({ children }) {
  const [minesList, setMinesList] = useState(localMines);
  const [activeMine, setActiveMine] = useState('gumgaon');
  const [activeScenario, setActiveScenario] = useState('normal');

  const [liveSatellite, setLiveSatellite] = useState(null);
  const [liveZones, setLiveZones] = useState(null);
  const [liveProduction, setLiveProduction] = useState(null);
  const [liveRisk, setLiveRisk] = useState(null);
  const [liveActions, setLiveActions] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Mine Metadata with fallback guarantees
  const fallbackMine = localMines.find((m) => m.id === activeMine) || localMines[0];
  const remoteMine = minesList.find((m) => m.id === activeMine) || {};

  const activeMineData = {
    ...fallbackMine,
    ...remoteMine,
    drill_points:
      (remoteMine.drill_points && remoteMine.drill_points.length > 0)
        ? remoteMine.drill_points
        : fallbackMine.drill_points || [],
    zones:
      (remoteMine.zones && remoteMine.zones.length > 0)
        ? remoteMine.zones
        : fallbackMine.zones || [],
    roads:
      (remoteMine.roads && remoteMine.roads.length > 0)
        ? remoteMine.roads
        : fallbackMine.roads || [],
  };

  const availableScenarios = [
    { id: 'normal', label: 'Normal Operations', description: 'Optimal conditions with standard target output.' },
    { id: 'equipment_failure', label: 'Equipment Failure', description: 'Major excavator hydraulic failure on extraction bench.' },
    { id: 'heavy_rainfall', label: 'Heavy Rainfall', description: 'Monsoon downpour causing haul road saturation.' },
    { id: 'blasting_delay', label: 'Blasting Delay', description: 'DGMS safety clearance delay holding bench fragmentation.' },
  ];

  // Fetch all backend data for active mine & scenario
  const refreshData = useCallback(async (mineId, scenarioId) => {
    try {
      const [minesRes, satRes, zonesRes, prodRes, riskRes, actionsRes] = await Promise.all([
        fetchMines(),
        fetchLiveSatellite(mineId),
        fetchZones(mineId),
        fetchProduction(scenarioId, mineId),
        fetchRisk(scenarioId, mineId),
        fetchActions(scenarioId, mineId),
      ]);

      if (minesRes && minesRes.length > 0) {
        setMinesList(minesRes);
      }
      if (satRes) setLiveSatellite(satRes);
      if (zonesRes) setLiveZones(zonesRes);
      if (prodRes) setLiveProduction(prodRes);
      if (riskRes) setLiveRisk(riskRes);
      if (actionsRes) setLiveActions(actionsRes);

      setIsLiveConnected(Boolean(satRes || zonesRes || prodRes));
    } catch (err) {
      console.warn('Backend sync failed, relying on dynamic local dataset.', err);
      setIsLiveConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshData(activeMine, activeScenario);
  }, [activeMine, activeScenario, refreshData]);

  const switchScenario = (scenarioId) => {
    setActiveScenario(scenarioId);
  };

  const switchMine = (mineId) => {
    setActiveMine(mineId);
  };

  // Base capacity from active mine
  const targetTonnes = activeMineData.capacity_tpd || 10000;

  // Local fallback scenario computation scaled to active mine
  const getScenarioData = () => {
    const isLive = Boolean(liveProduction && liveRisk && liveActions);

    if (isLive) {
      return {
        id: activeScenario,
        label: liveProduction.scenario_label || activeScenario,
        currentProduction: liveProduction.current_production,
        productionChange: liveProduction.production_change,
        targetProduction: liveProduction.production_target,
        shortfallRisk: liveRisk.shortfall_risk,
        riskLevel: liveRisk.risk_level,
        expectedGap: liveActions.expected_gap,
        primaryCause: liveRisk.primary_cause,
        forecastConfidence: liveProduction.forecast_confidence,
        riskDrivers: liveRisk.drivers || [],
        riskExplanation: liveRisk.risk_explanation,
        aiInsight: liveRisk.ai_insight,
        liveSignals: liveRisk.live_signals || [],
        recoveryPotential: liveActions.recovery_potential,
        residualRisk: liveActions.residual_risk,
        actions: liveActions.actions || [],
      };
    }

    // Dynamic local fallback scaled to active mine
    const factors = {
      normal: { factor: 1.02, risk: 18, level: 'LOW', gap: 0, cause: 'None (Nominal Performance)' },
      equipment_failure: { factor: 0.78, risk: 84, level: 'HIGH', gap: Math.round(targetTonnes * 0.22), cause: 'Primary Excavator Hydraulic Breakdown' },
      heavy_rainfall: { factor: 0.65, risk: 91, level: 'CRITICAL', gap: Math.round(targetTonnes * 0.35), cause: 'Road Saturation & Inundation Risk' },
      blasting_delay: { factor: 0.84, risk: 68, level: 'MEDIUM', gap: Math.round(targetTonnes * 0.16), cause: 'Bench Blasting Clearance Delay' },
    };

    const cur = factors[activeScenario] || factors.normal;
    const currentProd = Math.round(targetTonnes * cur.factor);
    const prodChange = Math.round((cur.factor - 1.0) * 1000) / 10;
    const gap = cur.gap;
    const recovery = Math.round(gap * 0.77);

    return {
      id: activeScenario,
      label: availableScenarios.find((s) => s.id === activeScenario)?.label || 'Normal Operations',
      currentProduction: currentProd,
      productionChange: prodChange,
      targetProduction: targetTonnes,
      shortfallRisk: cur.risk,
      riskLevel: cur.level,
      expectedGap: gap,
      primaryCause: cur.cause,
      forecastConfidence: 94,
      riskDrivers: [
        { name: 'Equipment Downtime', percentage: activeScenario === 'equipment_failure' ? 58 : 24, color: '#EF4444' },
        { name: 'Weather Factors', percentage: activeScenario === 'heavy_rainfall' ? 64 : 18, color: '#3B82F6' },
        { name: 'Blasting Clearance', percentage: activeScenario === 'blasting_delay' ? 52 : 12, color: '#F59E0B' },
      ],
      riskExplanation: `AI operational diagnostic for ${activeMineData.name}: telemetry indicates ${cur.cause.toLowerCase()}.`,
      aiInsight: `AI diagnostic for ${activeMineData.name}: monitoring spatial weather and equipment throughput.`,
      liveSignals: [
        { name: 'Machine Fleet Health', value: activeScenario === 'equipment_failure' ? '58% (Alert)' : '94% (Nominal)', status: activeScenario === 'equipment_failure' ? 'CRITICAL' : 'NORMAL' },
        { name: 'Radar Rainfall (GPM)', value: activeScenario === 'heavy_rainfall' ? '68.4 mm' : '4.2 mm', status: activeScenario === 'heavy_rainfall' ? 'HIGH' : 'NORMAL' },
        { name: 'Ground Moisture (SMAP)', value: activeScenario === 'heavy_rainfall' ? '82.5%' : '35.0%', status: activeScenario === 'heavy_rainfall' ? 'HIGH' : 'NORMAL' },
      ],
      recoveryPotential: recovery,
      residualRisk: Math.max(14, Math.round(cur.risk * 0.38)),
      actions: [
        {
          priority: 1,
          urgency: cur.level,
          title: `Redeploy Reserve Shovel (${activeMineData.name})`,
          description: 'MILP Solver optimal assignment: Shift standby loader from secondary stockpiles to main extraction face.',
          impact: `Recover ~${Math.round(recovery * 0.55).toLocaleString()} T`,
          impactScore: 92,
          feasibility: 'HIGH',
        },
        {
          priority: 2,
          urgency: 'HIGH',
          title: 'Optimize Haulage Ramp Traffic',
          description: 'Bypass congested intersection to decrease haul dumper cycle time by 4.2 mins.',
          impact: `Recover ~${Math.round(recovery * 0.30).toLocaleString()} T`,
          impactScore: 78,
          feasibility: 'HIGH',
        },
        {
          priority: 3,
          urgency: 'MEDIUM',
          title: 'Expedite Preventive Maintenance',
          description: 'Authorize priority workshop overhaul on degraded units.',
          impact: `Recover ~${Math.round(recovery * 0.15).toLocaleString()} T`,
          impactScore: 65,
          feasibility: 'MEDIUM',
        },
      ],
    };
  };

  const scenarioData = getScenarioData();

  // Forecast data scaled to active mine target
  const forecastData = (liveProduction && liveProduction.forecast) || [
    { day: 1, date: 'Aug 19', predicted: Math.round(targetTonnes * 1.01), target: targetTonnes, risk: 'low' },
    { day: 2, date: 'Aug 20', predicted: Math.round(targetTonnes * 0.98), target: targetTonnes, risk: 'low' },
    { day: 3, date: 'Aug 21', predicted: Math.round(targetTonnes * (activeScenario === 'normal' ? 0.99 : 0.91)), target: targetTonnes, risk: activeScenario === 'normal' ? 'low' : 'medium' },
    { day: 4, date: 'Aug 22', predicted: Math.round(targetTonnes * (activeScenario === 'normal' ? 1.02 : 0.72)), target: targetTonnes, risk: activeScenario === 'normal' ? 'low' : 'high' },
    { day: 5, date: 'Aug 23', predicted: Math.round(targetTonnes * (activeScenario === 'normal' ? 1.00 : 0.74)), target: targetTonnes, risk: activeScenario === 'normal' ? 'low' : 'high' },
    { day: 6, date: 'Aug 24', predicted: Math.round(targetTonnes * (activeScenario === 'normal' ? 1.01 : 0.81)), target: targetTonnes, risk: activeScenario === 'normal' ? 'low' : 'high' },
    { day: 7, date: 'Aug 25', predicted: Math.round(targetTonnes * (activeScenario === 'normal' ? 1.03 : 0.94)), target: targetTonnes, risk: activeScenario === 'normal' ? 'low' : 'medium' },
  ];

  // Historical data scaled to active mine target
  const historicalData = (liveProduction && liveProduction.historical) || defaultHistorical.map((h) => ({
    ...h,
    target: targetTonnes,
    actual: Math.round((h.actual / 10000) * targetTonnes),
  }));

  const value = {
    minesList,
    activeMine,
    activeMineData,
    switchMine,
    activeScenario,
    switchScenario,
    availableScenarios,
    scenarioData,
    forecastData,
    historicalData,
    liveSatellite,
    liveZones: liveZones || activeMineData.zones,
    isLiveConnected,
    mobileMenuOpen,
    setMobileMenuOpen,
    refreshData,
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  mines as localMines,
  historicalProduction as defaultHistorical,
  forecastProduction as defaultForecast,
  equipmentAssets as defaultEquipment,
  safetyHazards as defaultSafety,
  initialIncidents as defaultIncidents,
  initialAuditLog as defaultAuditLog,
  roleProfiles,
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
  const [activeScenario, setActiveScenario] = useState('equipment_failure');
  const [activeRole, setActiveRole] = useState('manager'); // 'manager' | 'safety' | 'maintenance' | 'operations'

  // Dynamic Operational Datasets (Mutable for closed-loop lifecycle)
  const [equipmentList, setEquipmentList] = useState(defaultEquipment);
  const [safetyList, setSafetyList] = useState(defaultSafety);
  const [incidentsList, setIncidentsList] = useState(defaultIncidents);
  const [auditLogList, setAuditLogList] = useState(defaultAuditLog);
  const [executedActionIds, setExecutedActionIds] = useState([]);

  // Simulation Mode State (For SIH Jury Presentation)
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0 to 5
  const [simulationPaused, setSimulationPaused] = useState(false);
  const simulationTimerRef = useRef(null);

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
      remoteMine.drill_points && remoteMine.drill_points.length > 0
        ? remoteMine.drill_points
        : fallbackMine.drill_points || [],
    zones:
      remoteMine.zones && remoteMine.zones.length > 0
        ? remoteMine.zones
        : fallbackMine.zones || [],
    roads:
      remoteMine.roads && remoteMine.roads.length > 0
        ? remoteMine.roads
        : fallbackMine.roads || [],
  };

  const availableScenarios = [
    { id: 'normal', label: 'Normal Operations', description: 'Optimal conditions with standard target output.' },
    { id: 'equipment_failure', label: 'Equipment Failure', description: 'Major excavator hydraulic failure on extraction bench.' },
    { id: 'heavy_rainfall', label: 'Heavy Rainfall', description: 'Monsoon downpour causing haul road saturation.' },
    { id: 'blasting_delay', label: 'Blasting Delay', description: 'DGMS safety clearance delay holding bench fragmentation.' },
  ];

  // Helper to append immutable audit entry
  const addAuditEntry = useCallback((entry) => {
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ...entry,
    };
    setAuditLogList((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

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

      if (minesRes && minesRes.length > 0) setMinesList(minesRes);
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
    addAuditEntry({
      eventType: 'SCENARIO_SWITCHED',
      severity: 'INFO',
      actor: 'Control Room Operator',
      entity: 'Pit Simulation Engine',
      description: `Scenario shifted to "${availableScenarios.find((s) => s.id === scenarioId)?.label || scenarioId}". Operational models recalibrating.`,
      evidence: `Target capacity: ${activeMineData.capacity_tpd || 10000} TPD.`,
      sourceSystem: 'Scenario Context Controller',
    });
  };

  const switchMine = (mineId) => {
    setActiveMine(mineId);
    addAuditEntry({
      eventType: 'MINE_SWITCHED',
      severity: 'INFO',
      actor: 'Enterprise Executive',
      entity: 'Mine Geofence',
      description: `Active mine viewport switched to ${localMines.find((m) => m.id === mineId)?.name || mineId}.`,
      evidence: 'Geospatial coordinates and remote sensing indices re-centered.',
      sourceSystem: 'Enterprise Multi-Mine Network',
    });
  };

  const switchRole = (roleId) => {
    if (roleProfiles[roleId]) {
      setActiveRole(roleId);
    }
  };

  // Base capacity from active mine
  const targetTonnes = activeMineData.capacity_tpd || 10000;

  // Closed-loop Incident Lifecycle Handlers
  const acknowledgeIncident = (incidentId) => {
    setIncidentsList((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: 'ACKNOWLEDGED' } : inc
      )
    );
    const inc = incidentsList.find((i) => i.id === incidentId);
    addAuditEntry({
      eventType: 'OPERATOR_ACKNOWLEDGED',
      severity: 'INFO',
      actor: `${roleProfiles[activeRole]?.label || 'Shift Operator'}`,
      entity: `Incident ${incidentId}`,
      description: `Incident acknowledged for ${inc?.title || incidentId}. Dispatch team mobilized.`,
      evidence: `AI confidence: ${inc?.aiConfidence || 94.2}%.`,
      sourceSystem: 'Incident Lifecycle Manager',
    });
  };

  const startWorkOrder = (incidentId) => {
    setIncidentsList((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: 'IN_PROGRESS' } : inc
      )
    );
    addAuditEntry({
      eventType: 'WORK_ORDER_STARTED',
      severity: 'INFO',
      actor: 'Maintenance Lead R. Verma',
      entity: `Work Order ${incidentId}`,
      description: `Field technician commenced active repair/intervention protocol on ${incidentId}.`,
      evidence: 'Maintenance crew on site with parts kit.',
      sourceSystem: 'Fleet Management System',
    });
  };

  const resolveIncident = (incidentId, notes = 'Repair completed and telemetry verified nominal.') => {
    setIncidentsList((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'RESOLVED',
              resolutionNotes: notes,
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : inc
      )
    );

    // Normalize equipment health if asset was linked
    const targetInc = incidentsList.find((i) => i.id === incidentId);
    if (targetInc && targetInc.assetId) {
      setEquipmentList((prev) =>
        prev.map((eq) =>
          eq.id === targetInc.assetId
            ? {
                ...eq,
                status: 'OPERATIONAL',
                healthScore: 92,
                engineTempC: 84.0,
                vibrationMmS: 3.5,
                hydraulicPressureBar: 275,
                riskScore: 15,
                failureRiskDescription: 'Post-overhaul operating parameters certified nominal by maintenance engineer.',
              }
            : eq
        )
      );
    }

    addAuditEntry({
      eventType: 'RESOLUTION_VERIFIED',
      severity: 'SUCCESS',
      actor: `${roleProfiles[activeRole]?.label || 'Maintenance Engineer'}`,
      entity: `Incident ${incidentId}`,
      description: `Incident ${incidentId} marked RESOLVED: ${notes}`,
      evidence: `Recovered throughput: ~${targetInc?.impactRecoveredTonnes || 1240} T. Telemetry verified nominal.`,
      sourceSystem: 'Closed-Loop Verification Engine',
    });
  };

  const executePrescriptiveAction = (action) => {
    const actionKey = action.priority || action.title;
    if (!executedActionIds.includes(actionKey)) {
      setExecutedActionIds((prev) => [...prev, actionKey]);

      const newIncId = `INC-${843 + executedActionIds.length}`;
      const newIncident = {
        id: newIncId,
        title: action.title,
        severity: action.urgency || 'HIGH',
        category: 'Prescriptive Dispatch',
        assetId: action.title?.includes('Shovel') ? 'EXC-02' : 'TRK-09',
        zone: activeMineData.name,
        detectedAt: 'Just Now',
        status: 'IN_PROGRESS',
        assignedTeam: 'Shift A Haulage Dispatch',
        assignedLead: 'Operator Dispatch Desk',
        aiConfidence: 96.4,
        rootCause: 'MILP Solver optimized reallocation to counter pit extraction deficit.',
        recommendedAction: action.description,
        actionTaken: 'Automated FMS dispatch order broadcast to Caterpillar/Komatsu in-cab terminals.',
        resolutionNotes: 'Active fleet in transit.',
        auditId: `AUD-${Date.now().toString().slice(-4)}`,
        impactRecoveredTonnes: parseInt(action.impact?.replace(/[^0-9]/g, '')) || 950,
      };

      setIncidentsList((prev) => [newIncident, ...prev]);

      addAuditEntry({
        eventType: 'DISPATCH_EXECUTED',
        severity: 'INFO',
        actor: `${roleProfiles[activeRole]?.label || 'Operator Desk'}`,
        entity: `Action: ${action.title}`,
        description: `MILP Prescriptive Recommendation dispatched: ${action.description}`,
        evidence: `Expected recovery: ${action.impact}. Solved in <120ms.`,
        sourceSystem: 'PuLP MILP Dispatch Engine',
      });
    }
  };

  // Manual Anomaly Injection (For SIH Demonstration)
  const triggerManualAnomaly = (assetId = 'TRK-17') => {
    setEquipmentList((prev) =>
      prev.map((eq) =>
        eq.id === assetId
          ? {
              ...eq,
              status: 'CRITICAL',
              healthScore: 48,
              engineTempC: 106.8,
              vibrationMmS: 15.4,
              fuelEfficiencyLph: 68.2,
              riskScore: 92,
              predictedFailureWindow: '4 - 8 Hours',
              failureRiskDescription: '[INJECTED DEMO ANOMALY] Sudden high-amplitude vibration and turbocharger overheat detected by telemetry gateway.',
            }
          : eq
      )
    );

    const newIncId = `INC-${900 + Math.floor(Math.random() * 90)}`;
    const newInc = {
      id: newIncId,
      title: `Telemetry Anomaly Triggered — ${assetId}`,
      severity: 'CRITICAL',
      category: 'Equipment Telemetry Anomaly',
      assetId: assetId,
      zone: 'Sector A-12',
      detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'DETECTED',
      assignedTeam: 'Heavy Equipment Maintenance Team B',
      assignedLead: 'Engineer Rajesh Verma',
      aiConfidence: 97.2,
      rootCause: `High-frequency vibration spike (15.4 mm/s) on ${assetId} drive axle. Risk score: 92/100.`,
      recommendedAction: `Halt ${assetId} loaded cycles immediately. Perform bearing and hydraulic inspection.`,
      actionTaken: 'AI alert dispatched to control room and mobile units.',
      resolutionNotes: 'Pending maintenance acknowledgement.',
      auditId: `AUD-${Date.now().toString().slice(-4)}`,
      impactRecoveredTonnes: 750,
    };

    setIncidentsList((prev) => [newInc, ...prev]);

    addAuditEntry({
      eventType: 'AI_DETECTION',
      severity: 'CRITICAL',
      actor: 'CAN-bus IoT Edge Gateway',
      entity: `Asset ${assetId}`,
      description: `[DEMO ANOMALY INJECTED] Sensor telemetry threshold exceeded on ${assetId}. Temperature: 106.8°C, Vibration: 15.4 mm/s.`,
      evidence: 'Instantaneous CAN-bus alert packet dispatched.',
      sourceSystem: 'IoT Telemetry Gateway',
    });
  };

  // Automated 14-Step SIH Demo Simulation Sequence
  const startSimulation = () => {
    setSimulationActive(true);
    setSimulationPaused(false);
    setSimulationStep(1);

    addAuditEntry({
      eventType: 'SIMULATION_STARTED',
      severity: 'INFO',
      actor: 'SIH Jury Presentation Mode',
      entity: 'Full Mine Digital Twin',
      description: 'Interactive demo simulation initiated. Demonstrating 14-step closed-loop decision intelligence.',
      evidence: 'Step 1 of 5: Injecting telemetry anomaly into Haul Truck T-17.',
      sourceSystem: 'SIH Demo Simulator',
    });

    triggerManualAnomaly('TRK-17');

    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);

    let currentStep = 1;
    simulationTimerRef.current = setInterval(() => {
      currentStep += 1;
      setSimulationStep(currentStep);

      if (currentStep === 2) {
        addAuditEntry({
          eventType: 'RISK_CLASSIFICATION',
          severity: 'HIGH',
          actor: 'TreeSHAP Engine',
          entity: 'Shortfall Model',
          description: 'AI detected high risk: Shortfall probability surged to 87%. Root cause: 42% engine thermal stress, 28% vibration.',
          evidence: 'TreeSHAP Shapley value decomposition verified.',
          sourceSystem: 'XAI Diagnostic Core',
        });
      } else if (currentStep === 3) {
        addAuditEntry({
          eventType: 'RECOMMENDATION_GENERATED',
          severity: 'INFO',
          actor: 'MILP Prescriptive Optimizer',
          entity: 'Action Center',
          description: 'Optimal prescription generated: Reroute Standby Dumper T-09 and shift loader EX-02 (+1,700 T recovery).',
          evidence: 'PuLP branch-and-cut solver completed in 118ms.',
          sourceSystem: 'MILP Action Engine',
        });
      } else if (currentStep === 4) {
        setIncidentsList((prev) =>
          prev.map((inc) =>
            inc.assetId === 'TRK-17' ? { ...inc, status: 'IN_PROGRESS' } : inc
          )
        );
        addAuditEntry({
          eventType: 'WORK_ORDER_STARTED',
          severity: 'INFO',
          actor: 'Maintenance Dispatcher',
          entity: 'Work Order for TRK-17',
          description: 'Maintenance crew dispatched to Truck T-17 on Ramp Sector 3.',
          evidence: 'Technician on site; replacement turbo coupling deployed.',
          sourceSystem: 'Fleet Maintenance System',
        });
      } else if (currentStep >= 5) {
        resolveIncident(
          incidentsList.find((i) => i.assetId === 'TRK-17')?.id || 'INC-900',
          'Demo simulation overhaul completed: bearing replaced, temperature normalized to 84°C.'
        );
        clearInterval(simulationTimerRef.current);
      }
    }, 4500);
  };

  const pauseSimulation = () => {
    setSimulationPaused(true);
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
  };

  const resumeSimulation = () => {
    setSimulationPaused(false);
    simulationTimerRef.current = setInterval(() => {
      setSimulationStep((s) => {
        if (s >= 5) {
          clearInterval(simulationTimerRef.current);
          return 5;
        }
        return s + 1;
      });
    }, 4500);
  };

  const resetSimulation = () => {
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    setSimulationActive(false);
    setSimulationPaused(false);
    setSimulationStep(0);
    setEquipmentList(defaultEquipment);
    setSafetyList(defaultSafety);
    setIncidentsList(defaultIncidents);
    setAuditLogList(defaultAuditLog);
    setExecutedActionIds([]);

    addAuditEntry({
      eventType: 'SIMULATION_RESET',
      severity: 'INFO',
      actor: 'Control Room Supervisor',
      entity: 'All Mine Systems',
      description: 'Simulation state reset. All equipment, safety sensors, and production parameters restored to nominal ground-truth baseline.',
      evidence: 'Gumgaon Mine ground-truth baseline re-established.',
      sourceSystem: 'System Reset Controller',
    });
  };

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, []);

  // Compute live scenario data scaled to active mine
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
      shortfallRisk: simulationActive && simulationStep >= 1 && simulationStep < 5 ? 89 : cur.risk,
      riskLevel: simulationActive && simulationStep >= 1 && simulationStep < 5 ? 'CRITICAL' : cur.level,
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

  // Overall Mine Health Score (computed dynamically from equipment, safety, and production)
  const computeMineHealthScore = () => {
    const avgEquipHealth = Math.round(
      equipmentList.reduce((acc, eq) => acc + (eq.healthScore || 80), 0) / (equipmentList.length || 1)
    );
    const activeHazardsCount = safetyList.filter((s) => s.status === 'ACTIVE').length;
    const safetyDeduction = activeHazardsCount * 4;
    const productionHealth = scenarioData.shortfallRisk > 50 ? 65 : 95;

    return Math.max(40, Math.min(99, Math.round(avgEquipHealth * 0.4 + productionHealth * 0.4 + (100 - safetyDeduction) * 0.2)));
  };

  const mineHealthScore = computeMineHealthScore();

  const simulationSteps = [
    { step: 1, title: 'Asset Telemetry Spike', desc: 'High-vibration & temperature anomaly injected into TRK-17 CAN-bus stream.' },
    { step: 2, title: 'TreeSHAP Mathematical Attribution', desc: 'Attributing 42% of extraction risk to equipment hydraulic degradation.' },
    { step: 3, title: 'MILP Linear Prescriptive Dispatch', desc: 'PuLP solver computing optimal dumper rerouting and backup shovel deployment.' },
    { step: 4, title: 'Incident Lifecycle Work Order', desc: 'Automated work order INC-842 created and dispatched to maintenance lead.' },
    { step: 5, title: 'Immutable Audit Trail Verification', desc: 'Forensic cryptographic log recorded with timestamp and DGMS compliance notes.' },
  ];
  const currentSimulationStep = simulationSteps[(simulationStep - 1) % simulationSteps.length] || simulationSteps[0];
  const activeAnomalies = equipmentList.filter((e) => e.status === 'CRITICAL');

  const value = {
    // Mine & Scenario Selection
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

    // Role-Based Experience
    activeRole,
    switchRole,
    roleProfile: roleProfiles[activeRole] || roleProfiles.manager,
    allRoleProfiles: roleProfiles,

    // Closed-Loop Datasets & Actions (dual aliases to prevent undefined errors)
    equipmentList,
    equipment: equipmentList,
    safetyList,
    safetyHazards: safetyList,
    incidentsList,
    incidents: incidentsList,
    auditLogList,
    auditLog: auditLogList,
    mineHealthScore,
    acknowledgeIncident,
    startWorkOrder,
    resolveIncident,
    executePrescriptiveAction,
    executedActionIds,
    triggerManualAnomaly,
    addAuditEntry,

    // SIH Demo Simulation
    simulationActive,
    simulationStep,
    simulationPaused,
    currentSimulationStep,
    activeAnomalies,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
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

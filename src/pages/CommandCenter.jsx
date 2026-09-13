import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Target,
  AlertTriangle,
  MapPin,
  TrendingUp,
  ChevronDown,
  Sparkles,
  Box,
  Compass,
  Radio,
  Truck,
  ShieldCheck,
  Eye,
  Sliders,
  AlertCircle,
  Wrench,
  ShieldAlert,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
  FileCheck2,
  BrainCircuit,
  Info,
  HelpCircle,
  Database,
  Network,
  X,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import OriginCard from '../components/ui/OriginCard';
import AIInsightPanel from '../components/shared/AIInsightPanel';
import MineSceneCanvas from '../components/3d/MineSceneCanvas';
import ProductionForecastChart from '../components/charts/ProductionForecastChart';
import RiskBars from '../components/charts/RiskBars';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import { useScenario } from '../context/ScenarioContext';

export default function CommandCenter() {
  const {
    activeMineData,
    activeScenario,
    switchScenario,
    scenarioData,
    forecastData,
    historicalData,
    availableScenarios,
    liveZones,
    activeRole,
    switchRole,
    roleProfile,
    mineHealthScore,
    simulationStatus,
    simulationActive,
    simulationStep,
    simulationPaused,
    simulationCompleted,
    TOTAL_SIMULATION_STEPS,
    currentSimulationStep,
    activeAnomalies,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    equipment,
    equipmentList,
    safetyHazards,
    safetyList,
    incidents,
    incidentsList,
  } = useScenario();

  const navigate = useNavigate();
  const [selected3DZone, setSelected3DZone] = useState(null);
  const [activeMetricModal, setActiveMetricModal] = useState(null); // 'health' | 'risk' | 'provenance' | null

  const fleetList = equipment || equipmentList || [];
  const hazardsList = safetyHazards || safetyList || [];
  const incList = incidents || incidentsList || [];

  // Urgent triage items calculation (with 100% defensive fallbacks)
  const urgentEquip = fleetList.find(e => e.status === 'CRITICAL' || e.status === 'WARNING');
  const urgentHazard = hazardsList.find(h => h.severity === 'CRITICAL' || h.severity === 'HIGH');
  const openIncidentsCount = incList.filter(i => i.status !== 'RESOLVED').length;

  const zonesCount = (liveZones && liveZones.length) || (activeMineData.zones && activeMineData.zones.length) || 4;

  // Header Right Content: Clear Live Status & Provenance Pill (avoids label collisions)
  const headerRightContent = (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#131720] border border-[#262F3D] text-xs font-mono text-slate-300 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Telemetry Live &bull; 18 Aug 2026 (Shift A)</span>
      </div>
      <button
        onClick={() => setActiveMetricModal('provenance')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#C7B59F]/40 text-xs font-mono text-[#E8DFD1] hover:text-white transition-colors cursor-pointer shadow-sm"
        title="View model training provenance, data sources, and algorithm benchmarks"
      >
        <Network size={13} className="text-[#C7B59F]" />
        <span>Model Provenance</span>
      </button>
    </div>
  );

  return (
    <PageLayout
      title="Mine Operations Command"
      subtitle={`Industrial AI decision platform, real-time pit digital twin, and predictive extraction governance for ${activeMineData.name} (${activeMineData.district}, ${activeMineData.state}).`}
      className="p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6"
      rightContent={headerRightContent}
    >
      {/* 1. STATE-AWARE DEMO SIMULATION & LIVE ANOMALY BANNER */}
      {(simulationStatus !== 'IDLE' || (activeAnomalies && activeAnomalies.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-4 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
            simulationStatus === 'COMPLETED'
              ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-[#131720] to-[#131720]'
              : simulationStatus === 'PAUSED'
              ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#131720] to-[#131720]'
              : 'border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-[#131720] to-[#131720]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              simulationStatus === 'COMPLETED'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse'
            }`}>
              {simulationStatus === 'COMPLETED' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  simulationStatus === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : simulationStatus === 'PAUSED'
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {simulationStatus === 'RUNNING' && `SIMULATION RUNNING • STEP ${simulationStep}/${TOTAL_SIMULATION_STEPS || 5}`}
                  {simulationStatus === 'PAUSED' && `SIMULATION PAUSED • STEP ${simulationStep}/${TOTAL_SIMULATION_STEPS || 5}`}
                  {simulationStatus === 'COMPLETED' && `SIMULATION COMPLETED • 5/5 STAGES`}
                  {simulationStatus === 'IDLE' && 'LIVE PIT ANOMALY'}
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {currentSimulationStep ? currentSimulationStep.title : 'Excavator EX-04 Telemetry Spike'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentSimulationStep ? currentSimulationStep.desc : 'Primary hydraulic manifold pressure gradient loss (142 bar). Autonomous diagnostic and dispatch triggered.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/action-center"
              className="px-3.5 py-1.5 rounded-lg bg-[#C7B59F] text-[#0B0D12] text-xs font-bold hover:bg-[#E8DFD1] transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>View Interventions</span>
              <ArrowRight size={13} />
            </Link>

            {/* State-Harmonized Action Buttons (No conflicting states) */}
            {simulationStatus === 'RUNNING' && (
              <button
                onClick={pauseSimulation}
                className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-slate-300 border border-[#262F3D] text-xs font-medium hover:bg-[#262F3D] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pause size={12} />
                <span>Pause Demo</span>
              </button>
            )}

            {simulationStatus === 'PAUSED' && (
              <>
                <button
                  onClick={resumeSimulation}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium hover:bg-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play size={12} className="fill-emerald-300" />
                  <span>Resume Demo</span>
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-slate-400 border border-[#262F3D] text-xs font-medium hover:text-rose-400 transition-all cursor-pointer"
                  title="Reset to Ground Truth Baseline"
                >
                  Reset
                </button>
              </>
            )}

            {simulationStatus === 'COMPLETED' && (
              <>
                <button
                  onClick={startSimulation}
                  className="px-3 py-1.5 rounded-lg bg-[#C7B59F]/20 text-[#E8DFD1] border border-[#C7B59F]/40 text-xs font-medium hover:bg-[#C7B59F]/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  <span>Replay Demo</span>
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-slate-400 border border-[#262F3D] text-xs font-medium hover:text-rose-400 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </>
            )}

            {simulationStatus === 'IDLE' && (
              <button
                onClick={resetSimulation}
                className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-slate-300 border border-[#262F3D] text-xs font-medium hover:bg-[#262F3D] transition-all cursor-pointer"
              >
                Reset Anomaly
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* 2. FUNCTIONAL ROLE PERSPECTIVE STRIP & ROLE-SPECIFIC MISSION COMMAND */}
      <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-4 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase font-bold text-[#0B0D12] tracking-wider px-2.5 py-1 rounded bg-[#C7B59F] shadow-sm">
              ROLE VIEW: {roleProfile.label.toUpperCase()}
            </span>
            <span className="text-slate-300 text-xs font-mono hidden sm:inline">{roleProfile.subtitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase font-mono hidden md:inline">Quick Switch:</span>
            {['manager', 'safety', 'maintenance', 'operations'].map((rId) => {
              const isActive = activeRole === rId;
              const labels = {
                manager: 'Executive',
                safety: 'Safety / DGMS',
                maintenance: 'Maintenance',
                operations: 'In-Pit Dispatch',
              };
              return (
                <button
                  key={rId}
                  onClick={() => switchRole(rId)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C7B59F]/20 text-[#E8DFD1] font-bold border border-[#C7B59F]/50 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {labels[rId]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Role-Specific Focus Feed */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#262F3D] text-xs font-mono">
          {activeRole === 'manager' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">DAILY REVENUE TARGET</span>
                <span className="font-bold text-white text-sm">₹3.12 Cr / Day</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-rose-500/30">
                <span className="text-[10px] text-slate-400 block">ESTIMATED GAP LOSS</span>
                <span className="font-bold text-rose-400 text-sm">₹68.6 Lakhs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">LIGHTGBM CONFIDENCE</span>
                <span className="font-bold text-sky-400 text-sm">94.8% (R² 0.942)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block">MILP RECOVERY VALUE</span>
                <span className="font-bold text-emerald-400 text-sm">₹53.0 Lakhs (+1,700 T)</span>
              </div>
            </>
          )}

          {activeRole === 'safety' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block">GLOBAL PIT SLOPE FOS</span>
                <span className="font-bold text-emerald-400 text-sm">FoS 1.48 (DGMS OK)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-amber-500/30">
                <span className="text-[10px] text-slate-400 block">SECTOR A-12 ADVISORY</span>
                <span className="font-bold text-amber-300 text-sm">FoS 1.18 (4.8 mm/day)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">BLAST GEOFENCE BUFFER</span>
                <span className="font-bold text-sky-400 text-sm">500m Clearance Ready</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">HAUL ROAD TRACTION</span>
                <span className="font-bold text-slate-200 text-sm">Friction 0.72 (Wet Alert)</span>
              </div>
            </>
          )}

          {activeRole === 'maintenance' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-rose-500/30">
                <span className="text-[10px] text-slate-400 block">EXC-04 HYDRAULIC PRESSURE</span>
                <span className="font-bold text-rose-400 text-sm">142 bar (Rated 280)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-amber-500/30">
                <span className="text-[10px] text-slate-400 block">TRK-17 BEARING VIBRATION</span>
                <span className="font-bold text-amber-300 text-sm">15.4 mm/s (Alert)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">RUL BREAKDOWN WINDOW</span>
                <span className="font-bold text-rose-300 text-sm">&lt; 12 Hours</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">WORK ORDERS STATUS</span>
                <span className="font-bold text-emerald-400 text-sm">2 In-Progress</span>
              </div>
            </>
          )}

          {activeRole === 'operations' && (
            <>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block">FLEET IN-PIT ALLOCATION</span>
                <span className="font-bold text-emerald-400 text-sm">7 / 7 Units Online</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-amber-500/30">
                <span className="text-[10px] text-slate-400 block">DUMPER CYCLE TIME</span>
                <span className="font-bold text-amber-300 text-sm">22.4 mins (+4.2 min delay)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                <span className="text-[10px] text-slate-400 block">TRAFFIC BYPASS ACTION</span>
                <span className="font-bold text-sky-400 text-sm">Ramp 3 Diversion Active</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block">MILP TPD MITIGATION</span>
                <span className="font-bold text-emerald-400 text-sm">+1,700 T Recoverable</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. EXECUTIVE KPI CARDS & COMPOSITE HEALTH SCORE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Mine Health Composite Score */}
        <OriginCard
          glowColor="rgba(199, 181, 159, 0.2)"
          borderColor="rgba(199, 181, 159, 0.35)"
          className="p-5 relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                Mine Health Index
              </span>
              <button
                onClick={() => setActiveMetricModal('health')}
                className="text-slate-500 hover:text-[#C7B59F] transition-colors cursor-pointer"
                title="Click for score formulation and weighting"
              >
                <HelpCircle size={12} />
              </button>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#C7B59F]/15 border border-[#C7B59F]/30 flex items-center justify-center text-[#E8DFD1]">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-3xl font-extrabold font-mono text-white">
              {mineHealthScore}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 100</span>
            <span className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {mineHealthScore >= 80 ? 'GRADE A' : mineHealthScore >= 65 ? 'GRADE B' : 'GRADE C'}
            </span>
          </div>
          <div className="w-full bg-[#1A202C] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C7B59F] to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${mineHealthScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2">
            <span>Fleet: 88% &bull; Pace: 78%</span>
            <button
              onClick={() => setActiveMetricModal('health')}
              className="text-[#C7B59F] hover:underline"
            >
              Details &rarr;
            </button>
          </div>
        </OriginCard>

        {/* Current Production */}
        <OriginCard
          glowColor="rgba(56, 189, 248, 0.2)"
          borderColor="rgba(56, 189, 248, 0.3)"
          className="p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Daily Output (18 Aug)
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Activity size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">
            <AnimatedNumber value={scenarioData.currentProduction} suffix=" T" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-mono font-bold text-emerald-400">
              {scenarioData.productionChange}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Target: 10,000 T</span>
          </div>
        </OriginCard>

        {/* Projected Deficit */}
        <OriginCard
          glowColor={scenarioData.expectedGap > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
          borderColor={scenarioData.expectedGap > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}
          className="p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Projected Deficit
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              scenarioData.expectedGap > 0 ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              <Target size={16} />
            </div>
          </div>
          <div className={`text-3xl font-extrabold font-mono mt-2.5 ${
            scenarioData.expectedGap > 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {scenarioData.expectedGap > 0 ? `-${scenarioData.expectedGap.toLocaleString()} T` : '0 T Deficit'}
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-2 truncate">
            LightGBM Forward Model (19–25 Aug)
          </p>
        </OriginCard>

        {/* Shortfall Risk Tier */}
        <OriginCard
          glowColor={scenarioData.shortfallRisk > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
          borderColor={scenarioData.shortfallRisk > 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}
          className="p-5 relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                Shortfall Probability
              </span>
              <button
                onClick={() => setActiveMetricModal('risk')}
                className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                title="Click for severity tier thresholds"
              >
                <HelpCircle size={12} />
              </button>
            </div>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              scenarioData.shortfallRisk > 50 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">
            <AnimatedNumber value={scenarioData.shortfallRisk} suffix="%" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2">
            <span>Tier: <strong className="text-white uppercase">{scenarioData.riskLevel}</strong></span>
            <button
              onClick={() => setActiveMetricModal('risk')}
              className="text-amber-400 hover:underline"
            >
              Thresholds &rarr;
            </button>
          </div>
        </OriginCard>

        {/* Active Open Incidents */}
        <OriginCard
          glowColor="rgba(199, 181, 159, 0.15)"
          borderColor="rgba(199, 181, 159, 0.25)"
          className="p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Active Work Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#C7B59F]/15 border border-[#C7B59F]/30 flex items-center justify-center text-[#E8DFD1]">
              <FileCheck2 size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">
            {openIncidentsCount}
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-2">
            {fleetList.length} Fleet Units &bull; {hazardsList.length} Hazard Zones
          </p>
        </OriginCard>
      </div>

      {/* 4. WHAT NEEDS ATTENTION NOW? — OPERATIONAL TRIAGE PANEL */}
      <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262F3D] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              What Needs Attention Now? — Operational Triage
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Priority-Ranked by Production & Safety Impact
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Triage Item 1: Equipment */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-[#C7B59F]/50 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  CRITICAL EQUIPMENT FAULT
                </span>
                <span className="text-[11px] font-mono text-slate-400">Unit: {urgentEquip?.id || 'EXC-04'}</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                {urgentEquip ? `${urgentEquip.name} (${urgentEquip.healthScore}% Health)` : 'Excavator EX-04 Pressure Loss'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Manifold pressure at <strong className="text-rose-400 font-mono">{urgentEquip?.hydraulicPressureBar || 142} bar</strong> (rated 280 bar). Drive vibration <strong className="text-amber-300 font-mono">{urgentEquip?.vibrationMmS || 14.2} mm/s</strong>. RUL breakdown window: 6–12 hrs.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-mono">Breakdown in &lt;12h</span>
              <Link
                to="/equipment"
                className="text-xs font-medium text-[#C7B59F] hover:text-[#E8DFD1] flex items-center gap-1 font-mono"
              >
                Inspect Telemetry <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Triage Item 2: Safety / Road */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-[#C7B59F]/50 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  GEOTECHNICAL ADVISORY
                </span>
                <span className="text-[11px] font-mono text-slate-400">{urgentHazard?.zone || 'Sector A-12 (North Ridge)'}</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                {urgentHazard?.title || 'Bench Slope Instability Warning'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Localized displacement at <strong className="text-amber-300 font-mono">4.8 mm/day</strong> (DGMS limit: 3.0 mm/day, local FoS: 1.18 Marginal). <span className="text-emerald-400">Pit overall average FoS remains 1.48 (Stable)</span>.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">30m Geofenced Setback</span>
              <Link
                to="/safety"
                className="text-xs font-medium text-[#C7B59F] hover:text-[#E8DFD1] flex items-center gap-1 font-mono"
              >
                Inspect Hazard <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Triage Item 3: Prescriptive MILP Action */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#C7B59F]/30 bg-[#C7B59F]/5 hover:border-[#C7B59F]/60 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C7B59F]/20 text-[#E8DFD1] border border-[#C7B59F]/30 font-bold">
                  MILP DISPATCH READY
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">+1,700 T Recovery</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                Prescriptive Shovel & Dumper Reassignment
              </h4>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                PuLP / COIN-OR CBC branch-and-cut linear optimizer solved 24 operational constraints in <strong className="text-[#E8DFD1] font-mono">118ms</strong>, recovering 77% of extraction deficit.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-[10px] text-[#C7B59F] font-mono">Solve latency: 118ms</span>
              <Link
                to="/action-center"
                className="text-xs font-bold text-[#E8DFD1] hover:underline flex items-center gap-1 font-mono"
              >
                Execute Dispatch <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MAIN TWO-COLUMN VIEWPORT: 3D DIGITAL TWIN + ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT (8 Cols) — 3D Digital Twin Pit Canvas & Telemetry Health Strip */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C7B59F] shadow-[0_0_10px_#C7B59F] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span>{activeMineData.name}</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-[#C7B59F]">Open-Pit 3D Digital Twin</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Link to="/digital-twin" className="hover:text-white underline flex items-center gap-1">
                Full Twin Map <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-[#262F3D] bg-[#080B12] shadow-2xl">
            <MineSceneCanvas
              height="580px"
              selectedZoneId={selected3DZone?.id}
              onSelectZone={(zone) => setSelected3DZone(zone)}
            />

            {/* Zone Telemetry Popover (Mineral Beige & Slate, strictly zero purple) */}
            {selected3DZone && (
              <div className="absolute top-16 right-6 z-20 w-76 p-5 rounded-2xl bg-[#0E1322]/95 backdrop-blur-2xl border border-[#C7B59F]/40 shadow-2xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C7B59F]" />
                    <span className="text-xs font-bold text-white font-mono">{selected3DZone.name}</span>
                  </div>
                  <button
                    onClick={() => setSelected3DZone(null)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-400">Manganese Grade:</span>
                    <span className="text-[#E8DFD1] font-mono font-bold">{selected3DZone.grade}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-400">Formation:</span>
                    <span className="text-slate-200 font-mono">Mansar Quartzite & Gondite</span>
                  </div>
                  <div className="flex justify-between pt-1 text-slate-300">
                    <span className="text-slate-400">Extraction Status:</span>
                    <span className="text-emerald-400 font-mono font-bold uppercase">{selected3DZone.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Telemetry Health Strip (Clean Spacing and Provenance) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#131720]/80 border border-[#262F3D] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Sensors Online:</span>
              <span className="text-white font-bold">142 / 142</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-400">Advisories:</span>
              <span className="text-amber-300 font-bold">4 Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-slate-400">Critical Faults:</span>
              <span className="text-rose-300 font-bold">1 Unit (EXC-04)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-slate-400">Telemetry Latency:</span>
              <span className="text-sky-300 font-bold"> &lt; 120 ms</span>
            </div>
          </div>
        </div>

        {/* RIGHT (4 Cols) — Analytics, TreeSHAP & AI Console Link */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Yield Forecast Card */}
          <OriginCard
            glowColor="rgba(56, 189, 248, 0.15)"
            borderColor="rgba(56, 189, 248, 0.25)"
            className="p-6"
          >
            <div className="flex items-center justify-between mb-2 pb-3 border-b border-[#262F3D]">
              <div className="flex items-center gap-2.5">
                <TrendingUp size={18} className="text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  7-Day Forward Extraction Trajectory
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">
                LightGBM v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mb-3">
              Horizon: 19–25 Aug 2026 &bull; Base Shift: 18 Aug 2026 &bull; Walk-Forward RMSE: 142.4 T
            </p>

            <ProductionForecastChart
              historicalData={historicalData.slice(-7)}
              forecastData={forecastData}
              height={190}
            />

            {/* Gap Alert Box */}
            <div className={`mt-5 p-4 rounded-2xl border flex items-center justify-between ${
              scenarioData.expectedGap > 0
                ? 'bg-rose-500/10 border-rose-500/25'
                : 'bg-emerald-500/10 border-emerald-500/25'
            }`}>
              <div>
                <div className={`text-[10px] uppercase tracking-wider font-mono font-bold ${
                  scenarioData.expectedGap > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  Projected Shift Deficit
                </div>
                <div className={`text-base font-extrabold font-mono mt-0.5 ${
                  scenarioData.expectedGap > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {scenarioData.expectedGap > 0 ? `-${scenarioData.expectedGap.toLocaleString()} T` : '0 T Deficit'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Model Confidence</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">94.8% (R² 0.942)</div>
              </div>
            </div>
          </OriginCard>

          {/* Operational Risk Drivers (TreeSHAP) */}
          <OriginCard className="p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#262F3D]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Primary Hazard Drivers
              </h3>
              <span className="text-[10px] text-[#C7B59F] font-mono">TreeSHAP &lt;10ms</span>
            </div>
            <RiskBars drivers={scenarioData.riskDrivers} />
            <div className="mt-5">
              <AIInsightPanel text={scenarioData.aiInsight} label="AI Telemetry Analysis" />
            </div>
            <div className="mt-4 pt-3 border-t border-[#1F2937]">
              <Link
                to="/ai-intelligence"
                className="w-full py-2.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] text-[#E8DFD1] text-xs font-semibold flex items-center justify-center gap-2 border border-[#C7B59F]/30 transition-colors"
              >
                <BrainCircuit size={14} className="text-[#C7B59F]" />
                <span>Open AI Operational Console</span>
              </Link>
            </div>
          </OriginCard>
        </div>
      </div>

      {/* 6. CLOSED-LOOP REACTION BAR (Bottom Navigation Quick Jumps) */}
      <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase font-bold text-[#C7B59F] tracking-wider px-2 py-1 rounded bg-[#C7B59F]/10 border border-[#C7B59F]/20">
              CLOSED-LOOP LIFECYCLE
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline font-mono">
              From IoT Anomaly to MILP Dispatch, DGMS Verification & Immutable Audit
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/equipment"
              className="px-3 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-[#1A202C] border border-[#262F3D] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              1. Equipment
            </Link>
            <Link
              to="/safety"
              className="px-3 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-[#1A202C] border border-[#262F3D] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              2. Safety
            </Link>
            <Link
              to="/risk-analysis"
              className="px-3 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-[#1A202C] border border-[#262F3D] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              3. TreeSHAP
            </Link>
            <Link
              to="/action-center"
              className="px-3 py-1.5 rounded-lg bg-[#C7B59F]/20 hover:bg-[#C7B59F]/30 border border-[#C7B59F]/40 text-xs font-mono text-[#E8DFD1] font-bold transition-colors"
            >
              4. MILP Dispatch
            </Link>
            <Link
              to="/incidents"
              className="px-3 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-[#1A202C] border border-[#262F3D] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              5. Work Orders
            </Link>
            <Link
              to="/audit-log"
              className="px-3 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-[#1A202C] border border-[#262F3D] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              6. Audit Trail
            </Link>
          </div>
        </div>
      </div>

      {/* METRIC DEFINITION & AUDITABILITY MODALS */}
      <AnimatePresence>
        {activeMetricModal && (
          <>
            <div
              className="fixed inset-0 z-[2500] bg-black/70 backdrop-blur-xs"
              onClick={() => setActiveMetricModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#131720] border border-[#C7B59F]/50 rounded-2xl p-6 shadow-2xl z-[2600] space-y-4"
            >
              {/* Health Score Modal */}
              {activeMetricModal === 'health' && (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#C7B59F]" />
                      <h3 className="text-sm font-bold text-white font-mono uppercase">
                        Mine Health Index — Formulation & Weights
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveMetricModal(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300 font-mono">
                    <p>
                      The <strong className="text-white">Mine Health Index ({mineHealthScore}/100)</strong> is an automated operational composite synthesized across three critical domains:
                    </p>
                    <div className="space-y-2 p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                      <div className="flex justify-between">
                        <span>1. Equipment Health (40% Weight):</span>
                        <span className="text-emerald-400 font-bold">88% Avg Availability</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2. Production Pace (40% Weight):</span>
                        <span className="text-amber-400 font-bold">78% Target (7,800/10k T)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3. Geotechnical & DGMS (20% Weight):</span>
                        <span className="text-emerald-400 font-bold">Pit FoS 1.48 (Stable)</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Standard Grade Scale: Grade A (&gt;80) &bull; Grade B (65–80) &bull; Grade C (&lt;65).
                    </p>
                  </div>
                </>
              )}

              {/* Risk Metrics Modal */}
              {activeMetricModal === 'risk' && (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-400" />
                      <h3 className="text-sm font-bold text-white font-mono uppercase">
                        Shortfall Risk & Severity Threshold Matrix
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveMetricModal(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300 font-mono">
                    <p>
                      The <strong className="text-white">Shortfall Probability ({scenarioData.shortfallRisk}%)</strong> measures the likelihood of extraction falling &gt;10% below target over the next 24 hours.
                    </p>
                    <div className="space-y-1.5 p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                      <div className="text-[11px] font-bold text-slate-400 pb-1 border-b border-white/5">
                        MOIL Opencast Severity Hierarchy
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>NORMAL TIER:</span>
                        <span>&lt; 30% Shortfall Risk</span>
                      </div>
                      <div className="flex justify-between text-amber-400">
                        <span>WARNING TIER:</span>
                        <span>30% – 65% Shortfall Risk</span>
                      </div>
                      <div className="flex justify-between text-rose-400 font-bold">
                        <span>HIGH TIER (ACTIVE):</span>
                        <span>65% – 85% Shortfall Risk</span>
                      </div>
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>CRITICAL TIER:</span>
                        <span>&gt; 85% Shortfall Risk</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Calculated via LightGBM walk-forward time-series model (R² 0.942, MAE 98.2 TPD).
                    </p>
                  </div>
                </>
              )}

              {/* Model Provenance Modal */}
              {activeMetricModal === 'provenance' && (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
                    <div className="flex items-center gap-2">
                      <Network size={18} className="text-[#C7B59F]" />
                      <h3 className="text-sm font-bold text-white font-mono uppercase">
                        AI Model Provenance & Benchmark Registry
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveMetricModal(null)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 text-xs text-slate-300 font-mono">
                    <div className="space-y-2 p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                      <div>
                        <div className="text-[#C7B59F] font-bold">1. LightGBM Production Regressor</div>
                        <div className="text-[11px] text-slate-400">Run ID: LGBM-MOIL-7D &bull; RMSE: 142.4 TPD &bull; Dataset: 1,825 shifts</div>
                      </div>
                      <div className="border-t border-white/5 pt-1.5">
                        <div className="text-sky-400 font-bold">2. TreeSHAP Explainability Core</div>
                        <div className="text-[11px] text-slate-400">Exact Shapley values computed in 8.4 ms &bull; Attribution: 42% equipment</div>
                      </div>
                      <div className="border-t border-white/5 pt-1.5">
                        <div className="text-emerald-400 font-bold">3. PuLP / COIN-OR CBC Linear Optimizer</div>
                        <div className="text-[11px] text-slate-400">24 constraints solved in 118 ms &bull; Mathematically guaranteed optimum</div>
                      </div>
                      <div className="border-t border-white/5 pt-1.5">
                        <div className="text-amber-300 font-bold">4. Satellite Remote Sensing Ingest</div>
                        <div className="text-[11px] text-slate-400">Sentinel-2 SWIR Band 11/12 &bull; Validated against core DP-G01 (44.8% Mn)</div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link
                        to="/architecture"
                        className="text-xs text-[#E8DFD1] hover:underline font-bold"
                        onClick={() => setActiveMetricModal(null)}
                      >
                        View Complete 8-Stage Architecture &rarr;
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

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
  RotateCcw,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
  FileCheck2,
  BrainCircuit,
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
    simulationActive,
    simulationStep,
    currentSimulationStep,
    activeAnomalies,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    equipment,
    safetyHazards,
    incidents,
  } = useScenario();

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [selected3DZone, setSelected3DZone] = useState(null);

  const rolesList = [
    { id: 'manager', label: 'Mine Manager', focus: 'Tonnage & Target Deficit' },
    { id: 'safety', label: 'Safety Officer', focus: 'DGMS & Slope Stability' },
    { id: 'maintenance', label: 'Maintenance Engineer', focus: 'Asset CAN-Bus Health' },
    { id: 'operations', label: 'Operations Supervisor', focus: 'Fleet Cycle Dispatch' },
  ];

  const scenarioSelector = (
    <div className="flex items-center gap-3">
      {/* Role Switcher Pill */}
      <div className="relative z-[1500]">
        <button
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="flex items-center gap-2 bg-[#131720] hover:bg-[#1A202C] border border-[#C7B59F]/30 hover:border-[#C7B59F]/60 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-lg"
        >
          <span className="text-[#C7B59F] text-[10px] font-mono uppercase font-bold tracking-wider">
            ROLE:
          </span>
          <span className="text-white font-semibold text-xs">{roleProfile.label}</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        <AnimatePresence>
          {roleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-[1550]"
                onClick={() => setRoleDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-[#0E1322]/95 border border-[#262F3D] rounded-2xl py-2 shadow-2xl z-[1600] backdrop-blur-2xl"
              >
                <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#C7B59F] font-mono font-bold border-b border-[#262F3D]/80">
                  Select Perspective
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activeRole === r.id
                        ? 'bg-[#C7B59F]/15 text-[#E8DFD1] font-semibold border-l-2 border-[#C7B59F]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.focus}</div>
                    </div>
                    {activeRole === r.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C7B59F]" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Scenario Selector */}
      <div className="relative z-[1500]">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 bg-[#111624]/90 hover:bg-[#1A2238] border border-white/10 hover:border-[#C7B59F]/40 rounded-xl px-4 py-2 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-xl backdrop-blur-xl"
        >
          <span className="text-[#C7B59F] uppercase tracking-widest text-[10px] font-mono font-bold">
            SCENARIO:
          </span>
          <span className="text-white font-semibold">{scenarioData.label}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-[1550] bg-black/60 backdrop-blur-xs"
                onClick={() => setDropdownOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-3 w-80 bg-[#0E1322]/95 border border-white/15 rounded-3xl py-3 shadow-2xl z-[1600] overflow-hidden backdrop-blur-2xl"
              >
                <div className="px-5 py-2.5 text-[10px] uppercase tracking-widest text-[#C7B59F] font-mono font-bold border-b border-white/10 mb-1 flex items-center justify-between">
                  <span>Operational Scenarios</span>
                  <span className="text-[9px] text-slate-400 font-mono">MOIL OS</span>
                </div>
                {availableScenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      switchScenario(sc.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-xs transition-all flex items-center justify-between cursor-pointer ${
                      activeScenario === sc.id
                        ? 'bg-gradient-to-r from-[#C7B59F]/20 to-transparent text-white font-semibold border-l-2 border-[#C7B59F]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        {sc.label}
                        {activeScenario === sc.id && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#C7B59F]/20 text-[#E8DFD1] border border-[#C7B59F]/30 font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{sc.description}</div>
                    </div>
                    {activeScenario === sc.id && (
                      <span className="w-2 h-2 rounded-full bg-[#C7B59F] shadow-[0_0_8px_#C7B59F] shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const zonesCount = (liveZones && liveZones.length) || (activeMineData.zones && activeMineData.zones.length) || 4;

  // Urgent triage items calculation
  const urgentEquip = equipment.find(e => e.status === 'CRITICAL' || e.status === 'WARNING');
  const urgentHazard = safetyHazards.find(h => h.severity === 'CRITICAL' || h.severity === 'HIGH');
  const openIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  return (
    <PageLayout
      title="Mine Operations Command"
      subtitle={`Industrial AI decision platform, real-time pit digital twin, and predictive extraction governance for ${activeMineData.name}.`}
      className="p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6"
      rightContent={scenarioSelector}
    >
      {/* 1. ACTIVE DEMO SIMULATION OR LIVE ANOMALY BANNER */}
      {(simulationActive || (activeAnomalies && activeAnomalies.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-[#131720] to-[#131720] p-4 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {simulationActive ? `SIMULATION STEP ${simulationStep}/14` : 'LIVE PIT ANOMALY'}
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
            {simulationActive ? (
              <button
                onClick={pauseSimulation}
                className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-slate-300 border border-[#262F3D] text-xs font-medium hover:bg-[#262F3D] transition-all"
              >
                Pause Demo
              </button>
            ) : (
              <button
                onClick={resetSimulation}
                className="px-3 py-1.5 rounded-lg bg-[#1A202C] text-slate-300 border border-[#262F3D] text-xs font-medium hover:bg-[#262F3D] transition-all"
              >
                Reset Anomaly
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* 2. ROLE PERSPECTIVE STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#131720]/80 border border-[#262F3D] text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#C7B59F] tracking-wider px-2 py-0.5 rounded bg-[#C7B59F]/10 border border-[#C7B59F]/20">
            ACTIVE PERSPECTIVE: {roleProfile.label.toUpperCase()}
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">&bull; {roleProfile.subtitle}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Focus Areas:</span>
          {roleProfile.primaryFocus.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A202C] text-slate-200 border border-[#262F3D]">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* 3. EXECUTIVE KPI CARDS & COMPOSITE HEALTH SCORE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Mine Health Composite Score */}
        <OriginCard
          glowColor="rgba(199, 181, 159, 0.2)"
          borderColor="rgba(199, 181, 159, 0.35)"
          className="p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Mine Health Index
            </span>
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
          <p className="text-[10px] text-slate-400 font-mono mt-2">
            Composite Equipment, Safety & DGMS Index
          </p>
        </OriginCard>

        {/* Current Production */}
        <OriginCard
          glowColor="rgba(56, 189, 248, 0.2)"
          borderColor="rgba(56, 189, 248, 0.3)"
          className="p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Daily Output
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
          <p className="text-[10px] text-slate-400 font-mono mt-2">
            LightGBM 7-Day Forward Horizon
          </p>
        </OriginCard>

        {/* Shortfall Risk Tier */}
        <OriginCard
          glowColor={scenarioData.shortfallRisk > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
          borderColor={scenarioData.shortfallRisk > 50 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}
          className="p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Shortfall Risk
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              scenarioData.shortfallRisk > 50 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">
            <AnimatedNumber value={scenarioData.shortfallRisk} suffix="%" />
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-2">
            Tier: <span className="font-bold text-white uppercase">{scenarioData.riskLevel}</span>
          </p>
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
            {equipment.length} Fleet Units &bull; {safetyHazards.length} Hazard Zones
          </p>
        </OriginCard>
      </div>

      {/* 4. WHAT NEEDS ATTENTION NOW? — EXECUTIVE TRIAGE PANEL */}
      <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262F3D] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              What Needs Attention Now? — Operational Triage
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Ranked by Production & Safety Impact
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Triage Item 1: Equipment */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-[#C7B59F]/50 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  EQUIPMENT ALERT
                </span>
                <span className="text-[11px] font-mono text-slate-400">Unit: {urgentEquip?.id || 'EXC-04'}</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                {urgentEquip ? `${urgentEquip.name} (${urgentEquip.healthScore}% Health)` : 'Excavator EX-04 Pressure Loss'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {urgentEquip ? `${urgentEquip.failureRisk} failure risk. ${urgentEquip.sensors.pressure} bar vs 280 bar rated.` : 'Hydraulic pump cartridge degradation. Risk of unrecoverable 3,200 T shortfall.'}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center justify-between">
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
                  SAFETY ADVISORY
                </span>
                <span className="text-[11px] font-mono text-slate-400">{urgentHazard?.location || 'Ramp Sector 3'}</span>
              </div>
              <h4 className="text-xs font-semibold text-white">
                {urgentHazard?.hazardType || 'Haul Road Friction Degradation'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                SMAP radar soil saturation at 78.5%. Friction coefficient dropped to 0.28 (DGMS baseline 0.35).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Speed capped at 15 km/h</span>
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
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                COIN-OR CBC linear solver computed 3 synchronized dispatches satisfying all DGMS safety constraints.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#1F2937] flex items-center justify-between">
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

          {/* Live Telemetry Health Strip */}
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
              <span className="text-rose-300 font-bold">1 Unit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-slate-400">Telemetry Latency:</span>
              <span className="text-sky-300 font-bold">&lt; 120 ms</span>
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
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262F3D]">
              <div className="flex items-center gap-2.5">
                <TrendingUp size={18} className="text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  7-Day Yield Forecast
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">
                LightGBM v2.4
              </span>
            </div>

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
                  Projected Deficit
                </div>
                <div className={`text-base font-extrabold font-mono mt-0.5 ${
                  scenarioData.expectedGap > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {scenarioData.expectedGap > 0 ? `-${scenarioData.expectedGap.toLocaleString()} T` : '0 T Deficit'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Confidence</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">94.8%</div>
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
    </PageLayout>
  );
}

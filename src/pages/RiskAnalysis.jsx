import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Wrench,
  CloudRain,
  Droplets,
  Zap,
  Truck,
  Activity,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  Sliders,
  CheckCircle2,
  Gauge,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import RiskContributionChart from '../components/charts/RiskContributionChart';
import StatusBadge from '../components/shared/StatusBadge';
import AIInsightPanel from '../components/shared/AIInsightPanel';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import { useScenario } from '../context/ScenarioContext';

export default function RiskAnalysis() {
  const {
    activeMineData,
    activeScenario,
    switchScenario,
    availableScenarios,
    scenarioData,
  } = useScenario();

  const [activeTab, setActiveTab] = useState('factors'); // 'factors' | 'geotech' | 'shap'

  // Geotechnical Sectors Factor of Safety Table
  const pitSectors = [
    {
      id: 'A-12',
      name: 'Sector A-12 (North Ridge)',
      status: 'ADVISORY',
      fos: 1.18,
      dgmsReq: 1.30,
      displacement: '4.8 mm / day',
      limit: '3.0 mm / day',
      action: '30m Exclusion Geofence Active • Divert TRK-12 & TRK-17',
      severity: 'HIGH',
    },
    {
      id: 'B-07',
      name: 'Sector B-07 (East Overburden Wall)',
      status: 'STABLE',
      fos: 1.52,
      dgmsReq: 1.30,
      displacement: '1.1 mm / day',
      limit: '3.0 mm / day',
      action: 'Nominal Operations • Bench Slope Competent',
      severity: 'LOW',
    },
    {
      id: 'C-03',
      name: 'Sector C-03 (South Ramp Approach)',
      status: 'STABLE',
      fos: 1.46,
      dgmsReq: 1.30,
      displacement: '1.4 mm / day',
      limit: '3.0 mm / day',
      action: 'Nominal Operations • Speed Limit 25 km/h',
      severity: 'LOW',
    },
    {
      id: 'D-04',
      name: 'Sector D-04 (Main Braunite Face)',
      status: 'STABLE',
      fos: 1.44,
      dgmsReq: 1.30,
      displacement: '1.8 mm / day',
      limit: '3.0 mm / day',
      action: 'Primary Extraction Active • Shovel EXC-04 Work Zone',
      severity: 'LOW',
    },
  ];

  // TreeSHAP Feature Attributions
  const shapDrivers = [
    {
      feature: 'Shovel EXC-04 Hydraulic Pressure Loss (142 bar)',
      category: 'Equipment Degradation',
      impactTons: -924,
      percentage: 42,
      direction: 'NEGATIVE',
      color: '#EF4444',
      shapValue: '+0.420',
    },
    {
      feature: 'Haul Road Saturation (SMAP 68.2%)',
      category: 'Environmental / Traction',
      impactTons: -616,
      percentage: 28,
      direction: 'NEGATIVE',
      color: '#F59E0B',
      shapValue: '+0.280',
    },
    {
      feature: 'Sector A-12 Geofence Ramp Bypass Delay',
      category: 'In-Pit Traffic & Logistics',
      impactTons: -396,
      percentage: 18,
      direction: 'NEGATIVE',
      color: '#38BDF8',
      shapValue: '+0.180',
    },
    {
      feature: 'Stochastic Operator Shift Handover Delay',
      category: 'Operational Noise',
      impactTons: -264,
      percentage: 12,
      direction: 'NEGATIVE',
      color: '#94A3B8',
      shapValue: '+0.120',
    },
  ];

  return (
    <PageLayout
      title="Root Cause Diagnostics & Shortfall Risk"
      subtitle={`Decomposing production shortfall risk drivers via game-theoretic feature attribution (TreeSHAP) for ${activeMineData.name}.`}
      className="p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6"
    >
      {/* 1. SCENARIO SIMULATION BAR */}
      <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#262F3D]">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-[#C7B59F]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Simulate Operational Scenarios & Test Shortfall Detection
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any scenario to see real-time shortfall & root-cause shift
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {availableScenarios.map((sc) => {
            const isSelected = activeScenario === sc.id;
            const isCritical = sc.id === 'heavy_rainfall';
            const isHigh = sc.id === 'equipment_failure';
            const isMed = sc.id === 'blasting_delay';

            return (
              <button
                key={sc.id}
                onClick={() => switchScenario(sc.id)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1A202C] border-[#C7B59F] shadow-card text-white'
                    : 'bg-[#0B0D12] border-[#262F3D] hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-slate-100 font-mono">{sc.label}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isCritical || isHigh
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : isMed
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {sc.id === 'equipment_failure' ? '84% Risk' :
                     sc.id === 'heavy_rainfall' ? '91% Risk' :
                     sc.id === 'blasting_delay' ? '68% Risk' : '18% Risk'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight truncate">{sc.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. HERO DEFICIT BANNER */}
      <div className={`rounded-2xl border p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        scenarioData.riskLevel === 'CRITICAL' || scenarioData.riskLevel === 'HIGH'
          ? 'bg-gradient-to-r from-rose-950/30 via-[#131720] to-[#131720] border-rose-500/30'
          : scenarioData.riskLevel === 'MEDIUM'
          ? 'bg-gradient-to-r from-amber-950/30 via-[#131720] to-[#131720] border-amber-500/30'
          : 'bg-gradient-to-r from-emerald-950/20 via-[#131720] to-[#131720] border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
            scenarioData.riskLevel === 'CRITICAL' || scenarioData.riskLevel === 'HIGH'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : scenarioData.riskLevel === 'MEDIUM'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            <AlertTriangle size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                ACTIVE SCENARIO SHORTFALL STATUS
              </span>
              <StatusBadge level={scenarioData.riskLevel} size="sm" />
            </div>
            <h3 className="text-base font-bold font-mono text-white mt-0.5">
              {scenarioData.expectedGap > 0
                ? `Projected Output Deficit: -${scenarioData.expectedGap.toLocaleString()} Tonnes / Day`
                : 'Nominal Operations: 100% Target Met (Zero Shortfall)'}
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              Primary Root Cause: <strong className="text-white">{scenarioData.primaryCause}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-center min-w-[110px]">
            <div className="text-[10px] text-slate-400 font-mono">SHORTFALL PROB</div>
            <div className={`text-xl font-bold font-mono ${
              scenarioData.riskLevel === 'LOW' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <AnimatedNumber value={scenarioData.shortfallRisk} suffix="%" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-center min-w-[110px]">
            <div className="text-[10px] text-slate-400 font-mono">DEFICIT GAP</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {scenarioData.expectedGap.toLocaleString()} T
            </div>
          </div>
        </div>
      </div>

      {/* 3. PURPOSE-BUILT GEOTECHNICAL RISK HEATMAP (Replaces duplicate 3D canvas!) */}
      <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#262F3D]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Geotechnical Slope Stability & Radar Displacement Matrix
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Overall Pit Factor of Safety:</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              FoS 1.48 (DGMS Compliant &ge; 1.30)
            </span>
          </div>
        </div>

        {/* Sectors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262F3D] text-slate-400 text-left">
                <th className="pb-2.5 font-bold">PIT SECTOR</th>
                <th className="pb-2.5 font-bold">RADAR DISPLACEMENT</th>
                <th className="pb-2.5 font-bold">FACTOR OF SAFETY</th>
                <th className="pb-2.5 font-bold">DGMS BENCHMARK</th>
                <th className="pb-2.5 font-bold">OPERATIONAL RISK STATUS</th>
                <th className="pb-2.5 font-bold">ACTIVE CONTROL ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {pitSectors.map((sector) => {
                const isCrit = sector.severity === 'HIGH';
                return (
                  <tr key={sector.id} className={isCrit ? 'bg-rose-500/5' : 'hover:bg-white/[0.02]'}>
                    <td className="py-3 font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                      <span>{sector.name}</span>
                    </td>
                    <td className={`py-3 font-bold ${isCrit ? 'text-rose-400' : 'text-slate-300'}`}>
                      {sector.displacement}
                    </td>
                    <td className="py-3">
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        isCrit ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        FoS {sector.fos}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">&ge; {sector.dgmsReq} (MMR 1961)</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCrit ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {sector.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 max-w-xs truncate">{sector.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TREESHAP ATTRIBUTION WATERFALL & TELEMETRY SIGNALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: TreeSHAP Feature Attribution Waterfall (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 p-5 shadow-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262F3D]">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#C7B59F]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  TreeSHAP Feature Attribution Waterfall
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#C7B59F] bg-[#C7B59F]/10 px-2 py-0.5 rounded border border-[#C7B59F]/20">
                Exact Shapley Decomposition &bull; &lt;10ms
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed">
              Mathematical proof of root cause: TreeSHAP isolates the exact marginal contribution of each physical telemetry signal towards the <strong className="text-rose-400 font-mono">-{scenarioData.expectedGap.toLocaleString()} T</strong> extraction deficit:
            </p>

            <div className="space-y-3 font-mono">
              {shapDrivers.map((driver) => (
                <div key={driver.feature} className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{driver.feature}</span>
                    <span className="font-bold text-rose-400">{driver.impactTons} T</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{driver.category}</span>
                    <span>Contribution: <strong className="text-white">{driver.percentage}%</strong> ({driver.shapValue} Shapley)</span>
                  </div>
                  <div className="w-full bg-[#1A202C] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${driver.percentage}%`, backgroundColor: driver.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry Signals & AI Insights (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Live Telemetry Ingest Signals
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {scenarioData.liveSignals?.map((sig) => (
                <div key={sig.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-slate-400">{sig.name}:</span>
                  <span className={`font-bold ${sig.status === 'CRITICAL' ? 'text-rose-400' : sig.status === 'HIGH' ? 'text-amber-300' : 'text-emerald-400'}`}>
                    {sig.value}
                  </span>
                </div>
              ))}
            </div>

            <AIInsightPanel text={scenarioData.aiInsight} label="AI Telemetry Diagnostics" />

            <div className="pt-2">
              <a
                href="/action-center"
                className="w-full py-2.5 rounded-xl bg-[#C7B59F] hover:bg-[#E8DFD1] text-[#0B0D12] text-xs font-bold font-mono transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceed to MILP Prescriptive Dispatch</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

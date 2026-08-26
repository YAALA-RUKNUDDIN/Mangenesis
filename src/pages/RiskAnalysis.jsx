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

  const getSignalIcon = (name) => {
    if (name.includes('Equipment') || name.includes('Machine')) return Wrench;
    if (name.includes('Rainfall')) return CloudRain;
    if (name.includes('Soil') || name.includes('Ground')) return Droplets;
    if (name.includes('Blasting')) return Zap;
    if (name.includes('Vehicle')) return Truck;
    return Activity;
  };

  return (
    <PageLayout
      title="Root Cause Diagnostics & Shortfall Risk"
      subtitle={`Decomposing production shortfall risk drivers via game-theoretic feature attribution (TreeSHAP) for ${activeMineData.name}.`}
    >
      {/* Interactive Scenario Selection Bar */}
      <div className="mb-6 rounded-2xl border border-[#262F3D] bg-[#131720]/90 p-4 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#262F3D]">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-blue-400" />
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
                    ? 'bg-[#1A202C] border-blue-500/80 shadow-card text-white'
                    : 'bg-[#0B0D12] border-[#262F3D] hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-slate-100">{sc.label}</span>
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

      {/* Hero Metric Banner: Predicted Shortfall Deficit */}
      <div className={`rounded-2xl border p-5 shadow-card mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
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
            <h3 className="text-base font-bold font-display text-white mt-0.5">
              {scenarioData.expectedGap > 0
                ? `Projected Output Deficit: -${scenarioData.expectedGap.toLocaleString()} Tonnes / Day`
                : 'Nominal Operations: 100% Target Met (Zero Shortfall)'}
            </h3>
            <p className="text-xs text-slate-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart & Explanation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262F3D]">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-blue-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                  TreeSHAP Risk Attribution Breakdown
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                XGBoost Feature Attribution
              </span>
            </div>

            {/* Radial Donut Contribution Chart */}
            <RiskContributionChart
              riskPercentage={scenarioData.shortfallRisk}
              riskLevel={scenarioData.riskLevel}
              drivers={scenarioData.riskDrivers}
              height={230}
            />
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#262F3D]">
              <HelpCircle size={15} className="text-blue-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Primary Root Cause Diagnostic
              </h3>
            </div>

            <AIInsightPanel
              text={scenarioData.riskExplanation}
              label="Diagnostic Analysis"
            />
          </div>
        </div>

        {/* Right: Live Risk Signals */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262F3D]">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                    Live Telemetry Signals
                  </h2>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              </div>

              {/* Signal Rows */}
              <div className="space-y-2.5">
                {scenarioData.liveSignals.map((sig, idx) => {
                  const Icon = getSignalIcon(sig.name);
                  return (
                    <motion.div
                      key={sig.name}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.04 }}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-slate-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#1A202C] border border-[#262F3D] flex items-center justify-center text-slate-300 shadow-inner">
                          <Icon size={15} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            {sig.name}
                          </div>
                          <div className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                            {sig.value}
                          </div>
                        </div>
                      </div>

                      <StatusBadge level={sig.status} size="sm" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#262F3D] text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Model Confidence: 94.2%</span>
              <span className="text-blue-400 font-semibold">TreeSHAP Attributed</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

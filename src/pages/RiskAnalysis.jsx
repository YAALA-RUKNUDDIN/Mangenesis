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
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import RiskContributionChart from '../components/charts/RiskContributionChart';
import StatusBadge from '../components/shared/StatusBadge';
import AIInsightPanel from '../components/shared/AIInsightPanel';
import { useScenario } from '../context/ScenarioContext';

export default function RiskAnalysis() {
  const { scenarioData } = useScenario();

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
      title="Root Cause Diagnostics"
      subtitle="Decomposing shortfall risk drivers via game-theoretic feature attribution (TreeSHAP)."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart & Explanation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-800/90 bg-[#0E131F]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-blue-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                  Risk Factor Contribution Breakdown
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                TreeSHAP Model
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
          <div className="rounded-2xl border border-slate-800/90 bg-[#0E131F]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
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
          <div className="rounded-2xl border border-slate-800/90 bg-[#0E131F]/85 text-slate-100 shadow-card backdrop-blur-xl p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
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
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#080B11] border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-850 border border-slate-700/60 flex items-center justify-center text-slate-300 shadow-inner">
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

            <div className="mt-5 pt-3.5 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Confidence: 94.2%</span>
              <span className="text-blue-400">TreeSHAP Attributed</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

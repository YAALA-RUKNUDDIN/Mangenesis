import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  FileText,
  History,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ActionCard from '../components/actions/ActionCard';
import RecoveryPanel from '../components/actions/RecoveryPanel';
import MineSceneCanvas from '../components/3d/MineSceneCanvas';
import { useScenario } from '../context/ScenarioContext';

export default function ActionCenter() {
  const { scenarioData, activeMineData, executePrescriptiveAction } = useScenario();
  const [executedActions, setExecutedActions] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleExecute = (action) => {
    if (!executedActions.includes(action.priority)) {
      setExecutedActions((prev) => [...prev, action.priority]);
      executePrescriptiveAction(action);
      setNotification(`Action 0${action.priority} ("${action.title}") dispatched & logged in Audit Trail.`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <PageLayout
      title="Corrective Action Optimization"
      subtitle={`Prioritized operational interventions computed via Mixed Integer Linear Programming (MILP) to recover production deficit for ${activeMineData.name}.`}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-8 z-[2000] bg-[#131720] border border-[#C7B59F]/40 text-slate-100 text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="text-[#C7B59F] shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prioritized Recommendation Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-[#C7B59F]" />
              <h2 className="text-xs uppercase font-semibold tracking-wider text-slate-200 font-mono">
                Ranked Operational Interventions (MILP Solver)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Sequenced by Recovered Tonnage
            </span>
          </div>

          <div className="space-y-3.5">
            {scenarioData.actions.map((action, idx) => (
              <ActionCard
                key={action.title}
                action={action}
                index={idx}
                onExecute={handleExecute}
              />
            ))}
          </div>
        </div>

        {/* Right: Recovery Panel & Workflow */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recovery Potential */}
          <RecoveryPanel
            shortfall={scenarioData.expectedGap}
            recovery={scenarioData.recoveryPotential}
            currentRisk={scenarioData.shortfallRisk}
            residualRisk={scenarioData.residualRisk}
          />

          {/* 3D Mine Spatial Action Context */}
          <div className="rounded-2xl border border-[#262F3D] overflow-hidden shadow-2xl bg-[#0B0D12] relative">
            <div className="absolute top-3 left-4 z-20 px-3 py-1.5 rounded-xl bg-[#0B0F19]/90 backdrop-blur-xl border border-[#C7B59F]/30 text-xs font-mono font-semibold text-[#E8DFD1] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C7B59F] animate-pulse" />
              <span>3D SPATIAL INTERVENTION MAPPING</span>
            </div>
            <MineSceneCanvas
              height="260px"
              showTelemetryHUD={false}
            />
          </div>

          {/* Closed-Loop Operational Decision Pipeline */}
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
            <div className="text-xs uppercase font-semibold tracking-wider text-[#C7B59F] mb-4 flex items-center justify-between pb-3 border-b border-[#262F3D] font-mono">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#C7B59F]" />
                <span>Closed-Loop Decision Chain</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Step 1: Predict */}
              <Link
                to="/production-forecast"
                className="block p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-sky-400 text-[11px] flex items-center gap-1.5">
                    <TrendingUp size={12} /> 01 &bull; PREDICT
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200 flex items-center gap-1 font-mono">
                    View Forecast <ArrowRight size={11} />
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  {scenarioData.expectedGap > 0
                    ? `${scenarioData.expectedGap.toLocaleString()} T shortfall projected ahead`
                    : 'Extraction nominal & stable'}
                </div>
              </Link>

              {/* Step 2: Explain */}
              <Link
                to="/risk-analysis"
                className="block p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-blue-400 text-[11px] flex items-center gap-1.5">
                    <ShieldCheck size={12} /> 02 &bull; EXPLAIN
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200 flex items-center gap-1 font-mono">
                    View TreeSHAP <ArrowRight size={11} />
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  Root driver: {scenarioData.primaryCause}
                </div>
              </Link>

              {/* Step 3: Act (Active) */}
              <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#C7B59F]/40 bg-[#C7B59F]/5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-[#E8DFD1] text-[11px] flex items-center gap-1.5">
                    <Zap size={12} className="text-[#C7B59F]" /> 03 &bull; ACT (MILP Solver)
                  </span>
                  <span className="text-[9px] uppercase font-mono font-bold text-[#E8DFD1] bg-[#C7B59F]/20 border border-[#C7B59F]/30 px-2 py-0.5 rounded-md">
                    Current Step
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-semibold">
                  3 prioritized actions to recover {scenarioData.recoveryPotential.toLocaleString()} T
                </div>
              </div>

              {/* Step 4: Verify & Track */}
              <Link
                to="/incidents"
                className="block p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-amber-500/40 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-amber-400 text-[11px] flex items-center gap-1.5">
                    <FileText size={12} /> 04 &bull; VERIFY (Work Orders)
                  </span>
                  <span className="text-[10px] text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-mono">
                    Track Lifecycle <ArrowRight size={11} />
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Monitor incident state transition: DETECTED &rarr; IN PROGRESS &rarr; RESOLVED.
                </div>
              </Link>

              {/* Step 5: Audit & Compliance */}
              <Link
                to="/audit-log"
                className="block p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] hover:border-slate-500 transition-colors group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
                    <History size={12} /> 05 &bull; AUDIT (DGMS Ledger)
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200 flex items-center gap-1 font-mono">
                    Inspect Ledger <ArrowRight size={11} />
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Immutable audit records with actor timestamps, evidence hashes, and DGMS compliance notes.
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

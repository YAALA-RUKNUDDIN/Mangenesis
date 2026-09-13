import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Cpu,
  FileCheck2,
  Lock,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function DemoTourHUD() {
  const {
    simulationStatus,
    simulationStep,
    TOTAL_SIMULATION_STEPS,
    currentSimulationStep,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
  } = useScenario();
  const navigate = useNavigate();

  if (simulationStatus !== 'RUNNING' && simulationStatus !== 'PAUSED') {
    return null;
  }

  const stageRoutes = {
    1: { path: '/equipment', name: 'Equipment Telemetry Spike' },
    2: { path: '/risk-analysis', name: 'TreeSHAP Root Cause Diagnostics' },
    3: { path: '/action-center', name: 'MILP Prescriptive Dispatch' },
    4: { path: '/incidents', name: 'Work Order Incident Lifecycle' },
    5: { path: '/audit-log', name: 'Immutable DGMS Audit Trail' },
  };

  const currentRoute = stageRoutes[simulationStep] || stageRoutes[1];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[3000] max-w-md w-full bg-[#131720]/95 backdrop-blur-2xl border-2 border-[#C7B59F] rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] space-y-3 font-mono select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#262F3D]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-bold text-[#E8DFD1] tracking-wider uppercase">
              SIH PRESENTATION TOUR &bull; STAGE {simulationStep} OF {TOTAL_SIMULATION_STEPS || 5}
            </span>
          </div>
          <button
            onClick={resetSimulation}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Exit Tour"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono">
              {currentSimulationStep?.title || 'Closed-Loop Decision Demonstration'}
            </h4>
            <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30">
              {simulationStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            {currentSimulationStep?.desc}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 py-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s < simulationStep
                  ? 'bg-emerald-400'
                  : s === simulationStep
                  ? 'bg-[#C7B59F] shadow-[0_0_8px_#C7B59F]'
                  : 'bg-[#262F3D]'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {simulationStatus === 'RUNNING' ? (
              <button
                onClick={pauseSimulation}
                className="px-3 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Pause size={12} />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeSimulation}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={12} className="fill-emerald-300" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="px-2.5 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] text-slate-400 hover:text-rose-400 text-xs cursor-pointer"
              title="Reset to Ground Truth Baseline"
            >
              Reset
            </button>
          </div>

          <button
            onClick={() => navigate(currentRoute.path)}
            className="px-3.5 py-1.5 rounded-xl bg-[#C7B59F] hover:bg-[#E8DFD1] text-[#0B0D12] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Jump to View</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

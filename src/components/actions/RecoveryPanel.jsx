import { motion } from 'framer-motion';
import { ArrowDown, TrendingDown, CheckCircle, ShieldAlert } from 'lucide-react';
import AnimatedNumber from '../shared/AnimatedNumber';

export default function RecoveryPanel({
  shortfall = 1900,
  recovery = 1470,
  currentRisk = 82,
  residualRisk = 31,
}) {
  return (
    <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#262F3D]">
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-blue-400" />
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-200 font-mono">
            Recovery Potential Analysis
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
          MILP Solver Active
        </span>
      </div>

      {/* Metrics 2-Col Grid */}
      <div className="grid grid-cols-2 gap-3.5 py-4 border-b border-[#262F3D]">
        <div className="p-3.5 bg-[#0B0D12] rounded-xl border border-[#262F3D]">
          <div className="text-[11px] text-slate-400 font-medium mb-1">
            Projected Shortfall
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
            <AnimatedNumber value={shortfall} suffix=" T" />
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Unmitigated gap</div>
        </div>

        <div className="p-3.5 bg-[#0B0D12] rounded-xl border border-[#262F3D]">
          <div className="text-[11px] text-slate-400 font-medium mb-1">
            Recoverable Volume
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            +<AnimatedNumber value={recovery} suffix=" T" />
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-bold font-mono">77% Restored</div>
        </div>
      </div>

      {/* Before / After Risk Reduction */}
      <div className="pt-4 space-y-4">
        <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
          Shortfall Probability Reduction
        </div>

        {/* Before Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <ShieldAlert size={14} className="text-rose-400" />
              Before Intervention
            </span>
            <span className="font-mono font-bold text-rose-400">{currentRisk}% Risk</span>
          </div>
          <div className="w-full h-2 bg-[#0B0D12] rounded-full overflow-hidden border border-[#262F3D]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentRisk}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-rose-500 rounded-full"
            />
          </div>
        </div>

        {/* Reduction Indicator */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200 bg-[#0B0D12] px-3.5 py-1.5 rounded-full border border-[#262F3D] shadow-sm">
            <ArrowDown size={13} className="text-blue-400" />
            <span>51% Risk Reduction via Fleet Redeployment</span>
          </div>
        </div>

        {/* After Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-400" />
              After Intervention
            </span>
            <span className="font-mono font-bold text-emerald-400">{residualRisk}% Residual</span>
          </div>
          <div className="w-full h-2 bg-[#0B0D12] rounded-full overflow-hidden border border-[#262F3D]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${residualRisk}%` }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

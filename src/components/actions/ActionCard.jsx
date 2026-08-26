import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

export default function ActionCard({ action, index = 0, onExecute }) {
  const score = action.impactScore || 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-5 hover:border-slate-700 transition-all duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Priority 0{action.priority}
          </span>
          <StatusBadge level={action.urgency} size="sm" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span>Feasibility:</span>
          <span
            className={`font-bold ${
              action.feasibility === 'HIGH' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {action.feasibility}
          </span>
        </div>
      </div>

      {/* Action Title & Detail */}
      <h3 className="text-sm font-bold text-slate-100 tracking-tight font-display">
        {action.title}
      </h3>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
        {action.description}
      </p>

      {/* Impact & Score Grid */}
      <div className="mt-4 pt-3.5 border-t border-[#262F3D] grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="text-emerald-400 font-semibold">{action.impact}</span>
        </div>

        {/* Impact Score Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
            <span>Yield Score</span>
            <span className="font-mono font-bold text-blue-400">
              {score}/100
            </span>
          </div>
          <div className="w-full h-2 bg-[#0B0D12] rounded-full overflow-hidden border border-[#262F3D]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Dispatch Button */}
      <div className="mt-4 pt-3 border-t border-[#262F3D] flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-mono">
          MILP Optimal Assignment
        </span>
        <button
          onClick={() => onExecute && onExecute(action)}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs transition-all shadow-glow-blue cursor-pointer"
        >
          <span>Dispatch Command</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}

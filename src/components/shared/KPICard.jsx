import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  riskLevel,
  icon: Icon,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: 'easeOut' }}
      className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-5 hover:border-slate-700 transition-all duration-200 relative overflow-hidden group"
    >
      {/* Subtle top card gradient highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C7B59F]/20 to-transparent" />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-[#1A202C] border border-[#262F3D] flex items-center justify-center text-blue-400 group-hover:scale-105 transition-all">
              <Icon size={16} />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            {title}
          </span>
        </div>
        {riskLevel && <StatusBadge level={riskLevel} size="sm" />}
      </div>

      {/* Main Metric Value */}
      <div className="mt-4">
        <div className="text-2xl lg:text-3xl font-extrabold font-display text-white tracking-tight">
          {value}
        </div>
      </div>

      {/* Trend & Subtitle */}
      <div className="mt-2.5 flex items-center gap-2 text-xs">
        {trend !== undefined && trend !== null && (
          <span
            className={`inline-flex items-center gap-0.5 font-mono font-bold px-2 py-0.5 rounded-lg text-[11px] ${
              trend >= 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trend >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
        {(trendLabel || subtitle) && (
          <span className="text-slate-400 text-[11px] font-medium">
            {trendLabel || subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
}

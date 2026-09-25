import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Enterprise Metric / KPI Card
 * Props:
 * - title: Metric title (e.g. "Estimated Reserve")
 * - value: Primary number or string
 * - unit: Unit suffix (e.g. "Mt", "% Mn", "kt")
 * - trend: { value: "+4.2%", positive: true/false/null }
 * - context: Explanatory microcopy (e.g. "UNFC 111 + 122 compliant")
 * - timestamp: Data freshness (e.g. "Updated 14m ago")
 * - icon: Lucide icon component
 * - variant: 'default' | 'mineral' | 'intelligence'
 */
export default function KPICard({
  title,
  value,
  unit,
  trend,
  context,
  timestamp,
  icon: Icon,
  variant = 'default',
  className = '',
  onClick,
}) {
  const variantBorders = {
    default: 'border-[#243046] hover:border-[#334462]',
    mineral: 'border-amber-500/30 hover:border-amber-500/50',
    intelligence: 'border-sky-500/30 hover:border-sky-500/50',
  };

  const iconColors = {
    default: 'text-slate-400 bg-slate-800/40 border-slate-700/50',
    mineral: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    intelligence: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#0D111A] border rounded-[12px] p-4 transition-all flex flex-col justify-between ${variantBorders[variant]} ${
        onClick ? 'cursor-pointer hover:bg-[#121824]' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-1.5 rounded-[6px] border ${iconColors[variant]}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight num-tabular">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400 font-normal">{unit}</span>}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#1C2536] text-[11px]">
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 font-mono font-medium ${
              trend.positive === true
                ? 'text-emerald-400'
                : trend.positive === false
                ? 'text-red-400'
                : 'text-slate-400'
            }`}
          >
            {trend.positive === true ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend.positive === false ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {trend.value}
          </span>
        ) : context ? (
          <span className="text-slate-400 truncate">{context}</span>
        ) : (
          <span className="text-slate-500 font-mono">Telemetry synced</span>
        )}

        {timestamp && (
          <span className="text-[10px] text-slate-500 font-mono shrink-0">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

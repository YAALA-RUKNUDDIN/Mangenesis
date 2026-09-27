import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import ProvenanceBadge from './ProvenanceBadge';

/**
 * Enterprise Metric / KPI Card with Scientific Provenance Metadata
 * Props:
 * - title: Metric title (e.g. "Estimated Reserve")
 * - value: Primary number or string
 * - unit: Unit suffix (e.g. "Mt", "% Mn", "kt")
 * - uncertainty: Confidence interval e.g. "± 0.31" or "± 1.4 kt"
 * - provenance: { type: 'government'|'satellite'|'prediction'|'simulation'|'observed', source: '...', model: '...' }
 * - trend: { value: "+4.2%", positive: true/false/null }
 * - context: Explanatory microcopy (e.g. "UNFC 111 (Measured) + 122")
 * - timestamp: Data freshness / overpass date (e.g. "Acquired: 27 Sep 2026")
 * - icon: Lucide icon component
 * - variant: 'default' | 'mineral' | 'intelligence' | 'danger' | 'warning' | 'healthy'
 */
export default function KPICard({
  title,
  value,
  unit,
  uncertainty,
  provenance,
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
    danger: 'border-red-500/30 hover:border-red-500/50',
    warning: 'border-amber-500/30 hover:border-amber-500/50',
    healthy: 'border-emerald-500/30 hover:border-emerald-500/50',
  };

  const iconColors = {
    default: 'text-slate-400 bg-slate-800/40 border-slate-700/50',
    mineral: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    intelligence: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    danger: 'text-red-400 bg-red-500/10 border-red-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    healthy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#0D111A] border rounded-[14px] p-4 transition-all flex flex-col justify-between ${variantBorders[variant] || variantBorders.default} ${
        onClick ? 'cursor-pointer hover:bg-[#121824]' : ''
      } ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">
            {title}
          </span>
          {Icon && (
            <div className={`p-1.5 rounded-[6px] border ${iconColors[variant] || iconColors.default}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-1.5 my-1">
          <span className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight num-tabular">
            {value}
          </span>
          {uncertainty && (
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/30" title="95% Confidence Interval">
              {uncertainty}
            </span>
          )}
          {unit && <span className="text-xs font-mono text-slate-400 font-normal">{unit}</span>}
        </div>

        {/* Provenance Metadata Badge */}
        {provenance && (
          <div className="mt-2">
            <ProvenanceBadge
              type={provenance.type || 'government'}
              source={provenance.source}
              model={provenance.model}
              uncertainty={provenance.uncertainty}
              size="xs"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#1C2536] text-[11px]">
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
          <span className="text-slate-400 truncate text-[11px]">{context}</span>
        ) : (
          <span className="text-slate-500 font-mono text-[10px]">Verified Metric</span>
        )}

        {timestamp && (
          <span className="text-[10px] text-slate-500 font-mono shrink-0">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

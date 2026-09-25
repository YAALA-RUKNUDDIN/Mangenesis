import { ShieldCheck, Info } from 'lucide-react';

/**
 * Enterprise AI Confidence & Uncertainty Indicator
 * Clear distinction between Confidence, Uncertainty, and Data Coverage
 */
export default function ConfidenceIndicator({
  score = 85,
  level = 'High',
  coverage = 92,
  uncertainty = '±4.1%',
  updated = '14m ago',
  compact = false,
  className = '',
}) {
  const scoreColor =
    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';

  const barColor =
    score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-red-400';

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-[6px] bg-[#121824] border border-[#243046] text-xs font-mono ${className}`}>
        <span className="text-slate-400">Confidence:</span>
        <span className={`font-bold ${scoreColor}`}>{score}% ({level})</span>
      </div>
    );
  }

  return (
    <div className={`bg-[#0D111A] border border-[#243046] rounded-[12px] p-4 ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1C2536]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Model Confidence & Uncertainty</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Updated {updated}</span>
      </div>

      <div className="space-y-3">
        {/* Primary score bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="text-slate-400">Confidence Score:</span>
            <span className={`font-bold ${scoreColor}`}>
              {score}% ({level})
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#1C2536] overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Breakdown grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1C2536] text-[11px] font-mono">
          <div className="bg-[#121824] p-2 rounded-[6px] border border-[#1C2536]">
            <span className="text-slate-400 block text-[10px]">Data Coverage</span>
            <span className="text-white font-semibold">{coverage}% verified</span>
          </div>
          <div className="bg-[#121824] p-2 rounded-[6px] border border-[#1C2536]">
            <span className="text-slate-400 block text-[10px]">Uncertainty Band</span>
            <span className="text-amber-400 font-semibold">{uncertainty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

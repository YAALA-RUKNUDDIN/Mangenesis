import { Cpu, AlertCircle } from 'lucide-react';

export default function AIInsightPanel({ text, label = 'AI Diagnostic Analysis', variant = 'default' }) {
  const isAlert = variant === 'alert';

  return (
    <div
      className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-colors ${
        isAlert
          ? 'bg-status-danger-bg border-status-danger-border text-slate-200'
          : 'bg-slate-850 border-slate-750 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {isAlert ? (
          <AlertCircle size={13} className="text-status-danger" />
        ) : (
          <Cpu size={13} className="text-accent" />
        )}
        <span
          className={`text-[11px] font-medium tracking-wide uppercase ${
            isAlert ? 'text-status-danger' : 'text-slate-400'
          }`}
        >
          {label}
        </span>
      </div>

      <p className="text-slate-300 text-xs">
        {text}
      </p>
    </div>
  );
}

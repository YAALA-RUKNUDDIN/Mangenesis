import { Loader2 } from 'lucide-react';

/**
 * Enterprise LoadingState component
 */
export default function LoadingState({
  message = 'Calculating geostatistical models...',
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 bg-[#0D111A]/50 border border-[#1C2536] rounded-[12px] ${className}`}
    >
      <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-3" />
      <span className="text-xs font-mono text-slate-300">{message}</span>
      <span className="text-[10px] font-mono text-slate-500 mt-1">SIH26009 Multi-Mine AI Pipeline</span>
    </div>
  );
}

import { Database, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Enterprise EmptyState component
 */
export default function EmptyState({
  title = 'No records found',
  description = 'There are no active records matching the current filter criteria.',
  icon: Icon = Database,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-[#0D111A] border border-[#1C2536] rounded-[12px] ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#121824] border border-[#243046] flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

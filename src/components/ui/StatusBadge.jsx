/**
 * Enterprise StatusBadge component
 * Statuses: 'healthy' | 'warning' | 'critical' | 'neutral' | 'unfc111' | 'unfc122' | 'unfc333'
 */
export default function StatusBadge({
  status = 'neutral',
  label,
  children,
  size = 'sm',
  dot = true,
  className = '',
}) {
  const text = label || children;

  const styles = {
    healthy: {
      bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      dot: 'bg-emerald-400',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
      dot: 'bg-amber-400',
    },
    critical: {
      bg: 'bg-red-500/10 border-red-500/25 text-red-400',
      dot: 'bg-red-400',
    },
    intelligence: {
      bg: 'bg-sky-500/10 border-sky-500/25 text-sky-400',
      dot: 'bg-sky-400',
    },
    neutral: {
      bg: 'bg-slate-500/10 border-slate-500/25 text-slate-400',
      dot: 'bg-slate-400',
    },
    unfc111: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-mono',
      dot: 'bg-emerald-400',
    },
    unfc122: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-mono',
      dot: 'bg-amber-400',
    },
    unfc333: {
      bg: 'bg-slate-500/10 border-slate-500/30 text-slate-300 font-mono',
      dot: 'bg-slate-400',
    },
  };

  const selected = styles[status] || styles.neutral;

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded-[4px] gap-1',
    sm: 'text-[11px] px-2 py-0.5 rounded-[6px] gap-1.5',
    md: 'text-xs px-2.5 py-1 rounded-[6px] gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border uppercase tracking-wider ${sizeStyles[size]} ${selected.bg} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selected.dot}`} />}
      <span>{text}</span>
    </span>
  );
}

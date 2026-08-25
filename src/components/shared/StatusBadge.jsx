export default function StatusBadge({ level = 'NORMAL', size = 'sm' }) {
  const lvl = (level || 'NORMAL').toUpperCase();
  const isSm = size === 'sm';

  // Explicit literal Tailwind classes for reliable rendering
  let bgClass = 'bg-emerald-500/15';
  let textClass = 'text-emerald-400';
  let borderClass = 'border-emerald-500/30';
  let dotClass = 'bg-emerald-400';

  if (lvl === 'CRITICAL') {
    bgClass = 'bg-red-500/15';
    textClass = 'text-red-400';
    borderClass = 'border-red-500/35';
    dotClass = 'bg-red-400';
  } else if (lvl === 'HIGH') {
    bgClass = 'bg-rose-500/15';
    textClass = 'text-rose-400';
    borderClass = 'border-rose-500/35';
    dotClass = 'bg-rose-400';
  } else if (lvl === 'WARNING' || lvl === 'MEDIUM' || lvl === 'MODERATE') {
    bgClass = 'bg-amber-500/15';
    textClass = 'text-amber-400';
    borderClass = 'border-amber-500/35';
    dotClass = 'bg-amber-400';
  } else if (lvl === 'LOW' || lvl === 'NORMAL' || lvl === 'SUCCESS') {
    bgClass = 'bg-emerald-500/15';
    textClass = 'text-emerald-400';
    borderClass = 'border-emerald-500/35';
    dotClass = 'bg-emerald-400';
  } else if (lvl === 'INFO') {
    bgClass = 'bg-blue-500/15';
    textClass = 'text-blue-400';
    borderClass = 'border-blue-500/35';
    dotClass = 'bg-blue-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-semibold uppercase tracking-wider border ${bgClass} ${textClass} ${borderClass} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span>{lvl}</span>
    </span>
  );
}

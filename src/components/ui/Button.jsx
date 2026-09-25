import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enterprise Physical Button Component
 * Designed for Geological / Mining Engineering Intelligence.
 *
 * Variants:
 *  - 'primary': Graphite solid background (#141924) with subtle mineral-gold edge/accent (border-amber-500/40),
 *               high contrast text, subtle hover lift, NO neon glow.
 *  - 'secondary': Neutral dark surface (#0E131E) with subtle border (#243046), hover border shift.
 *  - 'tertiary': Minimal text button for inline inspection (View, Details, Expand, Inspect).
 *  - 'intelligence': Analytical desaturated blue (#0F2137) with #38BDF8/40 border for spatial/sensor actions.
 *  - 'destructive' / 'danger': Reserved deep red (bg-rose-950/40 border-rose-800/40 text-rose-300).
 *  - 'ghost': Transparent with subtle hover wash.
 *
 * Micro-interactions:
 *  - 140ms hover transition
 *  - 180ms physical press feedback (translate-y-[1px], scale-[0.985])
 *  - directional icon translation
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'secondary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconRight: IconRight,
    onClick,
    type = 'button',
    ...props
  },
  ref
) {
  const baseStyles =
    'group relative inline-flex items-center justify-center font-medium transition-all duration-150 ease-out select-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-1 focus:ring-offset-[#07090E] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.985] active:translate-y-[1px] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-[7px] gap-1.5 font-mono',
    md: 'text-xs px-3.5 py-2 rounded-[8px] gap-2 font-medium',
    lg: 'text-sm px-4.5 py-2.5 rounded-[9px] gap-2.5 font-medium',
    text: 'text-xs px-1.5 py-0.5 rounded gap-1.5 font-mono',
  };

  const variantStyles = {
    // Mineral-metal graphite primary
    primary:
      'bg-[#141924] text-slate-100 border border-amber-500/40 hover:border-amber-400/80 hover:bg-[#1A2232] hover:text-white shadow-sm hover:shadow-[0_2px_8px_rgba(0,0,0,0.5)] focus:border-amber-400',
    // Secondary neutral graphite
    secondary:
      'bg-[#0E131E] text-slate-300 border border-[#243046] hover:bg-[#151D2C] hover:border-[#334462] hover:text-slate-100 focus:border-slate-500',
    // Minimal text button
    tertiary:
      'bg-transparent text-slate-400 hover:text-amber-300 hover:underline decoration-amber-500/50 underline-offset-4 active:scale-100 active:translate-y-0 p-0',
    // Analytical geospatial blue
    intelligence:
      'bg-[#0C1A2B] text-sky-200 border border-sky-500/35 hover:bg-[#11243B] hover:border-sky-400/60 hover:text-white focus:border-sky-400',
    // Ghost
    ghost:
      'bg-transparent text-slate-400 hover:text-white hover:bg-[#121824] border border-transparent hover:border-[#1C2536]',
    // Destructive
    danger:
      'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/50 hover:border-rose-700/60 focus:ring-rose-500',
    destructive:
      'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/50 hover:border-rose-700/60 focus:ring-rose-500',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[variant === 'tertiary' ? 'text' : size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-400" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:scale-105" />
      ) : null}
      <span>{children}</span>
      {!loading && IconRight ? (
        <IconRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
      ) : null}
    </button>
  );
});

export default Button;

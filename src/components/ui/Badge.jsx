const variants = {
  default:  'bg-white/5 text-slate-300 border border-white/10',
  primary:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  accent:   'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  warning:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  success:  'bg-green-500/10 text-green-400 border border-green-500/20',
  live:     'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  draft:    'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};

/**
 * Small inline badge/tag component.
 */
export default function Badge({
  children,
  variant = 'default',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-medium whitespace-nowrap
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'live' || variant === 'success' || variant === 'primary'
            ? 'bg-emerald-400 animate-pulse'
            : 'bg-current opacity-60'
        }`} />
      )}
      {children}
    </span>
  );
}

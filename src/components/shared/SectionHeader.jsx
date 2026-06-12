/**
 * Section header with animated accent line and subtitle.
 */
export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  light = false,
}) {
  const alignment = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={`max-w-2xl mb-14 ${alignment[align]}`}>
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {badge}
        </span>
      )}
      <h2
        className={`font-sora font-bold text-3xl md:text-4xl mb-4 ${
          light ? 'text-slate-900 dark:text-white' : 'text-white'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg leading-relaxed ${
            light ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

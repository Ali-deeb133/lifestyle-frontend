type BadgeVariant = 'healthy' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger:  'bg-red-500/15 text-red-400 border-red-500/30',
  info:    'bg-violet-500/15 text-violet-400 border-violet-500/30',
  neutral: 'bg-white/5 text-slate-400 border-white/10',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-0.5 rounded-full
        text-xs font-medium tracking-wide
        border
        ${variants[variant]}
      `}
    >
      {label}
    </span>
  )
}
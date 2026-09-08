import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: `
    bg-gradient-to-r from-violet-600 to-indigo-600
    hover:from-violet-500 hover:to-indigo-500
    text-white shadow-lg shadow-violet-500/25
    hover:shadow-violet-500/40
  `,
  secondary: `
    bg-white/5 hover:bg-white/10
    text-slate-200 border border-white/10
    hover:border-white/20
  `,
  ghost: `
    bg-transparent hover:bg-white/5
    text-slate-400 hover:text-slate-200
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-rose-600
    hover:from-red-500 hover:to-rose-500
    text-white shadow-lg shadow-red-500/25
  `,
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-medium tracking-wide
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-[0.97]
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={loading ? 'invisible' : ''}>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
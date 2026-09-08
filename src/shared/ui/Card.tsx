


import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: 'violet' | 'cyan' | 'emerald' | 'none'
  hover?: boolean
}

const glows = {
  violet:  'hover:shadow-violet-500/10',
  cyan:    'hover:shadow-cyan-500/10',
  emerald: 'hover:shadow-emerald-500/10',
  none:    '',
}

export function Card({
  children,
  className = '',
  glow = 'none',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-white border border-slate-100 rounded-2xl shadow-sm
        transition-all duration-300
        ${hover ? 'hover:border-slate-200 hover:shadow-md cursor-pointer' : ''}
        ${glow !== 'none' ? `hover:shadow-lg ${glows[glow]}` : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
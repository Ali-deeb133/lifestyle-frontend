interface ErrorMessageProps {
  message: string | null
  className?: string
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div
      className={`
        flex items-center gap-2
        px-4 py-3 rounded-xl
        bg-red-500/10 border border-red-500/20
        text-red-400 text-sm
        animate-in fade-in slide-in-from-top-1 duration-200
        ${className}
      `}
    >
      <span className="text-base">⚠</span>
      <span>{message}</span>
    </div>
  )
}
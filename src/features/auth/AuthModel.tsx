

import { useState, useRef } from 'react'
import { Modal } from '../../shared/ui/Model'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type AuthView = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('login')
  const [displayView, setDisplayView] = useState<AuthView>('login')
  const [sliding, setSliding] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  function handleSuccess() {
    onClose()
    setView('login')
    setDisplayView('login')
  }

  function switchView(next: AuthView) {
    if (next === view || sliding) return
    setSliding(true)

    const el = contentRef.current
    if (el) {
      el.style.transition = 'opacity 0.15s ease, transform 0.15s ease'
      el.style.opacity = '0'
      el.style.transform = 'translateY(6px)'
    }

    setTimeout(() => {
      setView(next)
      setDisplayView(next)
      if (el) {
        void el.offsetHeight // force reflow
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }
      setSliding(false)
    }, 160)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">

      {/* Tabs */}
      <div className="relative flex gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl mb-6">

        {/* Sliding pill indicator */}
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-6px)] rounded-lg bg-white/[0.09] border border-white/[0.1]"
          style={{
            left: view === 'login' ? '4px' : 'calc(50% + 2px)',
            transition: 'left 0.28s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        />

        {(['login', 'register'] as AuthView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => switchView(tab)}
            className={`
              relative z-10 flex-1 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${view === tab
                ? 'text-slate-200'
                : 'text-slate-500 hover:text-slate-400'
              }
            `}
          >
            {tab === 'login' ? 'Login' : 'Register'}
          </button>
        ))}
      </div>

      {/* Content — fade + slide on switch */}
      <div
        ref={contentRef}
        style={{ opacity: 1, transform: 'translateY(0)' }}
      >
        {displayView === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => switchView('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => switchView('login')}
          />
        )}
      </div>

    </Modal>
  )
}



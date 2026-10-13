
import {
  LayoutGrid,
  Activity,
  Moon,
  Dumbbell,
  Home,
  LogOut,
} from 'lucide-react'
import { Link } from 'react-router-dom'

type SidebarView = 'body' | 'sleep' | 'workout' | 'overview'

interface NavItem {
  id: SidebarView
  label: string
  shortLabel: string
  icon: React.ElementType
  description: string
  color: string
  glow: string
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    shortLabel: 'Overview',
    icon: LayoutGrid,
    description: 'General health score',
    color: 'from-violet-500 to-indigo-500',
    glow: 'shadow-violet-500/30',
  },
  {
    id: 'body',
    label: 'Body Metrics',
    shortLabel: 'Body',
    icon: Activity,
    description: 'BMI · BMR · TDEE',
    color: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/30',
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    shortLabel: 'Sleep',
    icon: Moon,
    description: 'Efficiency analysis',
    color: 'from-indigo-500 to-purple-500',
    glow: 'shadow-indigo-500/30',
  },
  {
    id: 'workout',
    label: 'Workout Plan',
    shortLabel: 'Workout',
    icon: Dumbbell,
    description: 'AI recommendations',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/30',
  },
]

interface SidebarProps {
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
  userName?: string
  onLogout?: () => void
}

function Logo() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/40 flex-shrink-0">
      L
    </div>
  )
}

// Phones: top bar + bottom tab bar. Tablets (md): icon rail. Desktops (lg): full sidebar.
export function Sidebar({ activeView, onViewChange, userName, onLogout }: SidebarProps) {
  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-100/95 backdrop-blur border-b border-gray-200">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 leading-tight">LifeStyle</p>
            <p className="text-[10px] text-slate-500 truncate">{userName ?? 'Health OS'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            to="/"
            aria-label="Home"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <Home size={18} />
          </Link>

          {onLogout && (
            <button
              onClick={onLogout}
              aria-label="Logout"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Tablet rail / desktop sidebar */}
      <aside className="hidden md:flex sticky top-0 h-dvh flex-shrink-0 flex-col bg-gray-100 border-r border-gray-200 transition-all duration-300 w-[72px] lg:w-[200px]">

        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start gap-3 px-4 py-6 flex-shrink-0">
          <Logo />
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">LifeStyle</p>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">Health OS</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          <p className="hidden lg:block text-[10px] text-slate-400 tracking-widest uppercase px-2 mb-2 font-bold">
            Modules
          </p>

          {navItems.map((item) => {
            const isActive = activeView === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                title={item.label}
                className={`
                  group relative flex items-center justify-center lg:justify-start gap-3 rounded-xl transition-all duration-200
                  p-2 lg:px-3 lg:py-3
                  ${isActive ? 'bg-slate-50' : 'hover:bg-slate-50/50'}
                `}
              >
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-gradient-to-b ${item.color}`} />
                )}

                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                  ${isActive
                    ? `bg-gradient-to-br ${item.color} text-white shadow-md ${item.glow}`
                    : 'text-slate-400 bg-slate-100 group-hover:text-slate-600'
                  }
                `}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <div className="hidden lg:flex flex-col text-left min-w-0">
                  <span className={`text-sm font-medium truncate ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{item.description}</span>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Account */}
        <div className="flex flex-col gap-1 p-3 border-t border-slate-100 flex-shrink-0">
          {userName && (
            <p className="hidden lg:block px-3 pb-1 text-xs font-medium text-slate-500 truncate">{userName}</p>
          )}

          <Link
            to="/"
            title="Home"
            className="flex items-center justify-center lg:justify-start gap-3 rounded-xl px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <Home size={18} />
            <span className="hidden lg:inline text-sm font-medium">Home</span>
          </Link>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Logout"
              className="flex items-center justify-center lg:justify-start gap-3 rounded-xl px-3 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline text-sm font-medium">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-4 bg-white/95 backdrop-blur border-t border-gray-200">
        {navItems.map((item) => {
          const isActive = activeView === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-1 pt-2 pb-2.5"
            >
              <div className={`
                w-10 h-7 rounded-lg flex items-center justify-center transition-all duration-300
                ${isActive ? `bg-gradient-to-br ${item.color} text-white shadow-md ${item.glow}` : 'text-slate-400'}
              `}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                {item.shortLabel}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

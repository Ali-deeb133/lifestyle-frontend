
import { useState } from 'react'
import { 
  LayoutGrid, 
  Activity, 
  Moon, 
  Dumbbell,  
} from 'lucide-react'

type SidebarView = 'body' | 'sleep' | 'workout' | 'overview'

interface NavItem {
  id: SidebarView
  label: string
  icon: React.ElementType
  description: string
  color: string
  glow: string
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutGrid,
    description: 'General health score',
    color: 'from-violet-500 to-indigo-500',
    glow: 'shadow-violet-500/30',
  },
  {
    id: 'body',
    label: 'Body Metrics',
    icon: Activity,
    description: 'BMI · BMR · TDEE',
    color: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/30',
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    icon: Moon,
    description: 'Efficiency analysis',
    color: 'from-indigo-500 to-purple-500',
    glow: 'shadow-indigo-500/30',
  },
  {
    id: 'workout',
    label: 'Workout Plan',
    icon: Dumbbell,
    description: 'AI recommendations',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/30',
  },
]

interface SidebarProps {
  activeView: SidebarView
  onViewChange: (view: SidebarView) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed] = useState(false)

  return (
    <aside className={`
      /* هنا التعديل اللي طلبته */
      sticky top-0 
      h-screen 
      /* --------------------- */
      flex flex-col 
      bg-gray -100
      border-r 
      -gray-200
      transition-all duration-300 
      ${collapsed ? 'w-[72px]' : 'w-[200px]'}
    `}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/40 flex-shrink-0">
          L
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">LifeStyle</p>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">Health OS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] text-slate-400 tracking-widest uppercase px-2 mb-2 font-bold">
            Modules
          </p>
        )}

        {navItems.map((item) => {
          const isActive = activeView === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                group relative flex items-center gap-3 rounded-xl transition-all duration-200
                ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'px-3 py-3'}
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

              {!collapsed && (
                <div className="flex flex-col text-left">
                  <span className={`text-sm font-medium truncate ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">{item.description}</span>
                </div>
              )}

              {collapsed && (
                <div className="absolute left-full ml-3 z-50 px-2 py-1 rounded bg-slate-900 text-white text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {item.label}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      {/* <div className="p-3 border-t border-slate-50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-slate-400 hover:text-indigo-600 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <div className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
            <ChevronLeft size={18} />
          </div>
          {!collapsed && <span className="text-xs font-bold uppercase tracking-wider">Collapse</span>}
        </button>
      </div> */}
    </aside>
  )
}
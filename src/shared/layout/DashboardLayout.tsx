



import { Sidebar } from './SideBare'
import { useState } from 'react'

type SidebarView = 'body' | 'sleep' | 'workout' | 'overview'

interface DashboardLayoutProps {
  children: (activeView: SidebarView) => React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState<SidebarView>('overview')

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative">

        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div>
            <h1 className="text-sm font-semibold text-slate-800 capitalize tracking-wide">
              {activeView === 'overview' ? 'Health Overview' : `${activeView} Analysis`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Status dot */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">Live</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8">
          {children(activeView)}
        </div>

      </main>
    </div>
  )
}
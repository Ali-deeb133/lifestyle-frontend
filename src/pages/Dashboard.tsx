


import { BodyForm } from "../features/body/components/BodyForm"
import { BodyDashboard } from "../features/body/components/BodyDashboard"
import { SleepForm } from "../features/sleep/components/SleepForm"
import { SleepDashboard } from "../features/sleep/components/SleepDashboard"
import { WorkoutForm } from "../features/workout/components/WorkoutForm"
import { WorkoutDashboard } from "../features/workout/components/WorkoutDashboard"

import { Sidebar } from "../shared/layout/Sidebar"
import { useState } from "react"
import { OverviewDashboard } from "../features/overview/OverviewDashboard"
import { useAuth } from "../features/auth/useAuth"
import { Modal } from "../shared/ui/Modal"
import { Button } from "../shared/ui/Button"


type ActiveView = 'overview' | 'body' | 'sleep' | 'workout'

const viewMeta: Record<ActiveView, { title: string; subtitle: string }> = {
  overview: { title: 'Overview',      subtitle: 'General Health Score'       },
  body:     { title: 'Body Metrics',  subtitle: 'Body Metrics Analysis'      },
  sleep:    { title: 'Sleep Quality', subtitle: 'Sleep Efficiency Analysis'  },
  workout:  { title: 'Workout Plan',  subtitle: 'AI-Powered Recommendations' },
}

export function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('body')
  const meta = viewMeta[activeView]

  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const userName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : undefined

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false)
    await logout()
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        userName={userName}
        onLogout={() => setShowLogoutModal(true)}
      />

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} size="sm">
        <div className="text-center">
          <p className="text-white text-sm font-semibold">Confirm Logout</p>
          <p className="mt-1 text-xs text-slate-300">Are you sure?</p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowLogoutModal(false)}>No</Button>
            <Button variant="danger" size="sm" onClick={handleConfirmLogout}>Yes</Button>
          </div>
        </div>
      </Modal>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="p-8 pb-4">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{meta.title}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{meta.subtitle}</p>
        </header>

        {/* Body */}
        {activeView === 'body' && (
          <div className="flex flex-col lg:flex-row gap-8 p-8 pt-0 items-start">
            <div className="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <BodyForm onSuccess={() => {}} />
              </div>
            </div>
            <div className="w-full lg:flex-1 min-w-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 bg-white">
                <BodyDashboard />
              </div>
            </div>
          </div>
        )}

        {/* Overview */}
         {activeView === 'overview' && (
          <div className="flex flex-col lg:flex-row gap-8 p-8 pt-0 items-start">
            <div className="w-full lg:flex-1 min-w-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 bg-white">
                <OverviewDashboard />
              </div>
            </div>
          </div>
        )}

        {/* Sleep */}
        {activeView === 'sleep' && (
          <div className="flex flex-col lg:flex-row gap-8 p-8 pt-0 items-start">
            <div className="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <SleepForm onSuccess={() => {}} />
              </div>
            </div>
            <div className="w-full lg:flex-1 min-w-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 bg-white">
                <SleepDashboard />
              </div>
            </div>
          </div>
        )}

        {/* Workout */}
         {activeView === 'workout' && (
          <div className="flex flex-col lg:flex-row gap-8 p-8 pt-0 items-start">
            <div className="w-full lg:w-[380px] lg:sticky lg:top-8 flex-shrink-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <WorkoutForm onSuccess={() => {}} />
              </div>
            </div>
            <div className="w-full lg:flex-1 min-w-0">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 bg-white">
                <WorkoutDashboard />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
} 
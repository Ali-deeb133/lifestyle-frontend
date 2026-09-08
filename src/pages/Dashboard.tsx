


import { BodyForm } from "../features/body/components/BodyForm"
import { BodyDashboard } from "../features/body/components/BodyDashboard"
import { SleepForm } from "../features/sleep/components/SleepForm"
import { SleepDashboard } from "../features/sleep/components/SleepDashboard"
import { WorkoutForm } from "../features/workout/components/WorkoutForm"
import { WorkoutDashboard } from "../features/workout/components/WorkDashboard"

import { Sidebar } from "../shared/layout/SideBare"
import { useState } from "react"
import { OverviewDashboard } from "../features/overview/OverviewDashboard"


type ActiveView = 'overview' | 'body' | 'sleep' | 'workout'

const viewMeta: Record<ActiveView, { title: string; subtitle: string }> = {
  overview: { title: 'Overview',      subtitle: 'General Health Score'       },
  body:     { title: 'Body Metrics',  subtitle: 'Body Metrics Analysis'      },
  sleep:    { title: 'Sleep Quality', subtitle: 'Sleep Efficiency Analysis'  },
  workout:  { title: 'Workout Plan',  subtitle: 'AI-Powered Recommendations' },
}

// function ComingSoon({ label }: { label: string }) {
//   return (
//     <div className="flex-1 flex items-center justify-center min-h-[400px]">
//       <div className="text-center">
//         <div className="text-5xl mb-4">🚧</div>
//         <h2 className="text-xl font-bold text-slate-700">{label}</h2>
//         <p className="text-sm text-slate-400 mt-2">قريباً...</p>
//       </div>
//     </div>   )
// }

export function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('body')
  const meta = viewMeta[activeView]

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

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
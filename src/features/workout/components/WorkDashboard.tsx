

import { useState } from 'react'
import { useWorkoutStore } from '../WorkoutStore'
import { Card } from '../../../shared/ui/Card'
import { Badge } from '../../../shared/ui/Badge'
import { Clock, Dumbbell, Calendar, ListChecks, ChevronLeft } from 'lucide-react'
import type { Exercise } from '../Workout.types'

/**
 * 1. مكون شريط نسبة الملائمة
 * تم ضبطه ليكون مرناً ومحتوى بالكامل داخل الحاوية
 */
function SimilarityBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="w-full mt-auto">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Goal suitability</span>
        <span className="text-[11px] font-black text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
        <div 
          className="h-full bg-indigo-300 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/**
 * 2. مكون عرض التمرين المنفرد
 * تم التركيز على الوضوح العالي للأرقام (جولات × تكرار)
 */
function ExerciseItem({ ex }: { ex: Exercise }) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300">
      {/* الخط الجانبي الجمالي */}
      <div className="w-1.5 h-12 bg-slate-100 group-hover:bg-indigo-400 rounded-full transition-colors" />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-slate-900 truncate group-hover:text-indigo-400 transition-colors">
          {ex.exercise_name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          {/* <Badge label="عضلة أساسية" variant="secondary" className="bg-slate-50 text-[9px] text-slate-500 border-none" /> */}
          <span className="text-[10px] text-slate-300 font-bold tracking-tighter uppercase">Primary Target</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div className="bg-slate-50 group-hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
          <div className="text-sm font-black text-slate-900 whitespace-nowrap">
            {ex.sets} <span className="text-indigo-300 text-[10px] mx-0.5">×</span> {ex.reps_display}
          </div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center">Sets × Reps</div>
        </div>
      </div>
    </div>
  )
}

export function WorkoutDashboard() {
  const { programs, selected, setSelected } = useWorkoutStore()
  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState(1)

  if (!programs.length || !selected) return null

  const weeks = [...new Set(selected.exercises.map(e => e.week))].sort()
  const daysInWeek = [...new Set(selected.exercises.filter(e => e.week === activeWeek).map(e => e.day))].sort()

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-sky-50 via-white to-sky-50 min-h-screen font-sans">
      
      {/* --- القسم العلوي: اختيار البرنامج التدريبي --- */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-300 rounded-2xl shadow-xl shadow-indigo-200">
              <Dumbbell size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Your Programs</h2>
              <p className="text-sm text-slate-500 font-medium">Choose the plan that fits your lifestyle</p>
            </div>
          </div>
          <Badge label={`${programs.length} Programs`}  border-slate-100 text-slate-600  />
        </div>

        <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
          {programs.map((prog) => {
            const isSelected = selected.title === prog.title
            return (
              <button
                key={prog.title}
                onClick={() => { setSelected(prog); setActiveWeek(1); setActiveDay(1); }}
                className={`
                  relative flex-shrink-0 w-72 p-6 rounded-[2rem] border transition-all duration-500 flex flex-col text-right box-border
                  ${isSelected
                    ? 'bg-white border-indigo-300 shadow-2xl shadow-indigo-100 ring-2 ring-indigo-50 scale-[1.02]'
                    : 'bg-white/60 border-slate-100 hover:border-slate-300'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-300 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{prog.program_length} أسابيع</span>
                </div>

                <h4 className={`text-md font-black mb-4 min-h-[44px] leading-tight ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>
                  {prog.title}
                </h4>
                
                <div className="flex gap-4 text-[11px] font-bold text-slate-500 mb-6 py-3 border-y border-slate-50 w-full">
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-300"/> {Math.round(prog.time_per_workout / 60)} ساعة</div>
                  <div className="flex items-center gap-1.5"><ListChecks size={14} className="text-indigo-300"/> {prog.total_exercises} حركة</div>
                </div>

                <SimilarityBar value={prog.similarity} />
              </button>
            )
          })}
        </div>
      </section>

      {/* --- القسم السفلي: التفاصيل والتمارين --- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* التحكم الجانبي (الأيام والأسابيع) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm shadow-slate-100/50">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-indigo-400 rounded-full" />
                <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Time Table</span>
             </div>
             
             {/* اختيار الأسبوع */}
             <div className="space-y-4">
               <label className="text-[11px] text-slate-400 font-black uppercase tracking-[0.1em]">Week</label>
               <div className="flex gap-2 flex-wrap">
                 {weeks.map(w => (
                   <button
                     key={w}
                     onClick={() => { setActiveWeek(w); setActiveDay(1); }}
                     className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                       activeWeek === w 
                       ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                       : 'bg-slate-50 text-slate-400 border border-transparent hover:border-slate-200'
                     }`}
                   >
                     {w}
                   </button>
                 ))}
               </div>
             </div>

             <div className="h-px bg-slate-100 my-8" />

             {/* اختيار اليوم */}
             <div className="space-y-4">
               <label className="text-[11px] text-slate-400 font-black uppercase tracking-[0.1em]">Day</label>
               <div className="grid grid-cols-2 gap-3">
                 {daysInWeek.map(d => (
                   <button
                     key={d}
                     onClick={() => setActiveDay(d)}
                     className={`py-3.5 rounded-2xl text-xs font-black transition-all border text-center ${
                       activeDay === d 
                       ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                       : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                     }`}
                   >
                    Day{d}
                   </button>
                 ))}
               </div>
             </div>
          </Card>
        </div>

        {/* عرض قائمة التمارين */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Today's exercises</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-300 rounded-full text-[10px] font-black border border-indigo-100">
                W{activeWeek} <ChevronLeft size={10} /> DAY {activeDay}
              </div>
           </div>
           
           <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
             {selected.exercises
               .filter(e => e.week === activeWeek && e.day === activeDay)
               .map((ex, i) => (
                 <ExerciseItem key={i} ex={ex} />
               ))
             }
           </div>
        </div>

      </section>
    </div>
  )
}





















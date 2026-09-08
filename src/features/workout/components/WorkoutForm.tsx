import { useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { ErrorMessage } from '../../../shared/ui/ErrorMessage'
import { Card } from '../../../shared/ui/Card'
import { useWorkout } from '../useWorkout'
import type {
  WorkoutRequest,
  FitnessLevel,
  FitnessGoal,
  Equipment,
} from '../Workout.types'

const levels: FitnessLevel[] = ['Beginner', 'Novice', 'Intermediate', 'Advanced']

const goals: { value: FitnessGoal; label: string; icon: string }[] = [
  { value: 'Muscle & Sculpting', label: 'Muscle & Sculpting', icon: '💪' },
  { value: 'Bodybuilding', label: 'Bodybuilding', icon: '🏆' },
  { value: 'Powerbuilding', label: 'Powerbuilding', icon: '⚡' },
  { value: 'Athletics', label: 'Athletics', icon: '🏃' },
  
]

const equipments: { value: Equipment; label: string; desc: string }[] = [
  { value: 'Full Gym', label: 'Full Gym', desc: 'All equipment' },
  { value: 'Minimal', label: 'Minimal Equipment', desc: 'Dumbbells and light weights' },
  { value: 'Bodyweight', label: 'Bodyweight Only', desc: 'Bodyweight exercises only' },
]

const durations = [4, 8, 12, 16]

interface WorkoutFormProps {
  onSuccess: () => void
}

export function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const { submitWorkout, loading, error } = useWorkout()

  const [form, setForm] = useState<WorkoutRequest>({
    level: 'Beginner',
    goal: 'Muscle & Sculpting',
    equipment: 'Full Gym',
    program_length: 12,
  })

  // تحديث موحّد
  function update<K extends keyof WorkoutRequest>(key: K, val: WorkoutRequest[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  // Guard قبل الإرسال (مهم)
  function isValid(): boolean {
    if (!form.level || !form.goal || !form.equipment) return false
    if (!form.program_length || form.program_length <= 0) return false
    return true
  }

  async function handleSubmit() {
    if (!isValid()) return

    const success = await submitWorkout(form)
    if (success) onSuccess()
  }

  return (
    <Card className="p-6 flex flex-col gap-5">

      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-slate-600">Program</h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize your program based on your level and goal
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* Level */}
      <div className="flex flex-col gap-2">
        <label className="text-xxs font-medium text-slate-600 uppercase tracking-wide">
         Level
        </label>

        <div className="grid grid-cols-2 gap-2">
          {levels.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => update('level', l)}
              className={`
                py-2 rounded-xl text-sm font-medium border transition-all duration-200
                ${form.level === l
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-700'
                  : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="flex flex-col gap-2">
        <label className="text-xxs font-medium text-slate-600 uppercase tracking-wide">
         Goal
        </label>

        <div className="grid grid-cols-2 gap-2">
          {goals.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => update('goal', g.value)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm
                transition-all duration-200
                ${form.goal === g.value
                  ? 'bg-violet-500/15 border-violet-500/40 text-violet-700'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-700'
                }
              `}
            >
              <span>{g.icon}</span>
              <span className="text-xs">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="flex flex-col gap-2">
        <label className="text-xxs font-medium text-slate-600 uppercase tracking-wide">
         Equipment
        </label>

        <div className="flex flex-col gap-1.5">
          {equipments.map(eq => (
            <button
              key={eq.value}
              type="button"
              onClick={() => update('equipment', eq.value)}
              className={`
                flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm
                transition-all duration-200
                ${form.equipment === eq.value
                  ? 'bg-violet-500/15 border-violet-500/40 text-violet-700'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-500 hover:text-slate-700'
                }
              `}
            >
              <span className="font-medium">{eq.label}</span>
              <span className="text-xs opacity-60">{eq.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <label className="text-xxs font-medium text-slate-600 uppercase tracking-wide">
          Program Duration
        </label>

        <div className="grid grid-cols-4 gap-2">
          {durations.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => update('program_length', d)}
              className={`
                py-2 rounded-xl text-sm font-medium border transition-all duration-200
                ${form.program_length === d
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-700'
                  : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {d}w
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
       Search for Programs
      </Button>

    </Card>
  )
}
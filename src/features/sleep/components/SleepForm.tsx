
import { useState, type FormEvent } from 'react'
import { Input } from '../../../shared/ui/Input'
import { Button } from '../../../shared/ui/Button'
import { ErrorMessage } from '../../../shared/ui/ErrorMessage'
import { Card } from '../../../shared/ui/Card'
import { useSleep } from '../useSleep'
import { sleepSchema } from './SleepSchema'
import type { SleepRequest } from '../sleep.types'

interface FormState {
  sleep_duration: string
  exercise_frequency: string
  smoking_status: boolean
  bed_time: string
  coffee_cups: string
  alcohol_glasses: string
  awakenings: string
}

export function SleepForm({ onSuccess }: { onSuccess: () => void }) {
  const { submitSleep, loading, error: serverError } = useSleep()

  const [form, setForm] = useState<FormState>({
    sleep_duration: '',
    exercise_frequency: '',
    smoking_status: false,
    bed_time: '',
    coffee_cups: '',
    alcohol_glasses: '',
    awakenings: '',
  })

  const [validationError, setValidationError] = useState<string | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validateAndTransform(): SleepRequest | null {
    const result = sleepSchema.safeParse(form)

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Check the entered data')
      return null
    }

    setValidationError(null)
    return result.data
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = validateAndTransform()
    if (!data) return

    const success = await submitSleep(data)
    if (success) onSuccess()
  }

  return (
    <Card className="p-6 flex flex-col gap-6 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      <form onSubmit={handleSubmit} noValidate className="contents">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Sleep Data</h3>
        <p className="text-xs text-slate-400 mt-1">
          Enter your sleep habits accurately to ensure the accuracy of your sleep efficiency analysis
        </p>
      </div>

      <ErrorMessage message={validationError || serverError} />

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-5 items-end">
        <Input
          label="Sleep Duration (Hours)"
          type="number"
          min={1}
          max={24}
          step="any"
          value={form.sleep_duration}
          onChange={(e) => update('sleep_duration', e.target.value)}
        />

        <Input
          label="Bed Time"
          type="time"
          value={form.bed_time}
          onChange={(e) => update('bed_time', e.target.value)}
        />

        <Input
          label="Exercise Frequency (Days/Week)"
          type="number"
          min={0}
          max={7}
          value={form.exercise_frequency}
          onChange={(e) => update('exercise_frequency', e.target.value)}
        />

        <Input
          label="Awakenings (Times)"
          type="number"
          min={0}
          max={20}
          value={form.awakenings}
          onChange={(e) => update('awakenings', e.target.value)}
        />

        <Input
          label="Coffee Cups"
          type="number"
          min={0}
          max={20}
          value={form.coffee_cups}
          onChange={(e) => update('coffee_cups', e.target.value)}
        />

        <Input
          label="Alcohol Glasses"
          type="number"
          min={0}
          max={20}
          value={form.alcohol_glasses}
          onChange={(e) => update('alcohol_glasses', e.target.value)}
        />
      </div>

      {/* Smoking */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          
          <span className="text-base sm:text-[20px] text-slate-500 uppercase tracking-widest font-mono">
            Smoking Status :
          </span>
        </div>

        <div className="flex gap-2 p-1 bg-black/30 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => update('smoking_status', true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${
              form.smoking_status
                ? 'bg-violet-600 text-white'
                : 'text-slate-500'
            }`}
          >
           Yes
          </button>

          <button
            type="button"
            onClick={() => update('smoking_status', false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg ${
              !form.smoking_status
                ? 'bg-slate-700 text-white'
                : 'text-slate-500'
            }`}
          >
          No
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button 
        fullWidth 
        loading={loading} 
        type="submit"
        className="py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-300 font-black uppercase tracking-widest text-xs"
      >
        Analyze Now
      </Button>
      </form>
    </Card>
  )
}
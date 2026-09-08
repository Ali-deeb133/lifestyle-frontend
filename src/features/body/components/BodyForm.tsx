



import { useState } from 'react'
import { Input } from '../../../shared/ui/Input'
import { Button } from '../../../shared/ui/Button'
import { ErrorMessage } from '../../../shared/ui/ErrorMessage'
import { Card } from '../../../shared/ui/Card'
import { useBody } from '../useBody'
import { bodySchema } from './BodySchema'
import type { BodyProfileRequest, ActivityLevel } from '../body.types'

const activityOptions: { value: ActivityLevel; label: string }[] = [
  { value: 'none',      label: 'none'                  },
  { value: 'very_low',  label: 'Very Low'    },
  { value: 'light',     label: 'Light'    },
  { value: 'moderate',  label: 'Moderate'   },
  { value: 'high',      label: 'High'    },
  { value: 'very_high', label: 'Very High' },
]

interface BodyFormProps {
  onSuccess: () => void
}

export function BodyForm({ onSuccess }: BodyFormProps) {
  const { submitBodyData, loading, error, warnings } = useBody()
  const [localError, setLocalError] = useState<string | null>(null)
  const [form, setForm] = useState<BodyProfileRequest>({
    birth_date: '',
    gender: 'male',
    height: 0,
    weight: 0,
    neck_circumference: 0,
    waist_circumference: 0,
    hip_circumference: 0,
    activity_level: 'moderate',
  })

  function update<K extends keyof BodyProfileRequest>(key: K, value: BodyProfileRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    setLocalError(null)
    const result = bodySchema.safeParse(form)
    if (!result.success) {
      setLocalError(result.error.issues[0].message)
      return
    }
    const success = await submitBodyData(result.data)
    if (success) onSuccess()
  }

  return (
    <Card className="p-5 flex flex-col gap-5 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-[2.5rem]">

      {/* Header - أضيق وأوضح */}
      <div className="border-b border-slate-50 pb-3">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Physical data</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Personal Measurements</p>
      </div>

      <ErrorMessage message={localError || error} />

      {/* Gender Selection - كروت تفاعلية صغيرة */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Gender</label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map((g) => (
            <button
              key={g}
              onClick={() => update('gender', g)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 transition-all duration-300
                ${form.gender === g
                  ? g === 'male'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
                    : 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                  : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                }`}
            >
              <span className="text-xl leading-none">{g === 'male' ? '♂' : '♀'}</span>
              <span className="text-xs font-bold uppercase tracking-tight">{g === 'male' ? 'Male' : 'Female'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Inputs - الطول والوزن بجانب بعضهما */}
      <div className="space-y-4">
        <Input
          label="Birth Date"
          type="date"
          className="bg-slate-50 border-none rounded-xl text-sm"
          value={form.birth_date}
          onChange={(e) => update('birth_date', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Height (cm)"
            type="number"
            placeholder="175"
            className="bg-slate-50 border-none rounded-xl"
            value={form.height || ''}
            onChange={(e) => update('height', e.target.value ? Number(e.target.value) : 0)}
          />
          <Input
            label="Weight (kg)"
            type="number"
            placeholder="70"
            className="bg-slate-50 border-none rounded-xl"
            value={form.weight || ''}
            onChange={(e) => update('weight', e.target.value ? Number(e.target.value) : 0)}
          />
        </div>

        {/* قياسات المحيط - بجانب بعضها لتقليل الطول */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Neck Circumference (cm)"
            type="number"
            placeholder="38"
            className="bg-slate-50 border-none rounded-xl"
            value={form.neck_circumference || ''}
            onChange={(e) => update('neck_circumference', e.target.value ? Number(e.target.value) : 0)}
          />
          <Input
            label="Waist Circumference (cm)"
            type="number"
            placeholder="85"
            className="bg-slate-50 border-none rounded-xl"
            value={form.waist_circumference || ''}
            onChange={(e) => update('waist_circumference', e.target.value ? Number(e.target.value) : 0)}
          />
        </div>

        {form.gender === 'female' && (
          <Input
            label="Hips Circumference (cm)"
            type="number"
            placeholder="95"
            className="bg-slate-50 border-none rounded-xl"
            value={form.hip_circumference || ''}
            onChange={(e) => update('hip_circumference', e.target.value ? Number(e.target.value) : 0)}
          />
        )}
      </div>

      {/* Activity - قائمة منسدلة بستايل زجاجي */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Activity Level</label>
        <select
          value={form.activity_level}
          onChange={(e) => update('activity_level', e.target.value as ActivityLevel)}
          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:ring-2 ring-indigo-500/20 transition-all appearance-none"
        >
          {activityOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-700">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Warnings - بشكل أنظف */}
      {warnings.length > 0 && (
        <div className="space-y-1">
          {warnings.map((w, i) => (
            <div key={i} className="text-[10px] font-medium text-amber-700 bg-amber-500/10 border border-amber-200/50 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span>⚠️</span> {w}
            </div>
          ))}
        </div>
      )}

      {/* Submit Button - تصميم عريض وفخم */}
      <Button 
        fullWidth 
        loading={loading} 
        onClick={handleSubmit}
        className="py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-300 font-black uppercase tracking-widest text-xs"
      >
        Analyze Now
      </Button>

    </Card>
  )
}
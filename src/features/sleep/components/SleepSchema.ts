import { z } from 'zod'

// الحقول نصوص بالفورم — الفاضي مرفوض (ما بيتحول لـ 0)
function numberField(label: string, min: number, max: number, integer = true) {
  const range = `${label} must be between ${min} and ${max}`
  let value = z
    .number({ error: `${label} must be a number` })
    .min(min, range)
    .max(max, range)
  if (integer) value = value.int(`${label} must be a whole number`)

  return z.string().trim().min(1, `${label} is required`).transform(Number).pipe(value)
}

export const sleepSchema = z.object({
  sleep_duration: numberField('Sleep duration', 1, 24, false),
  exercise_frequency: numberField('Exercise frequency', 0, 7),
  smoking_status: z.boolean(),
  bed_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Bed time is required'),
  coffee_cups: numberField('Coffee cups', 0, 20),
  alcohol_glasses: numberField('Alcohol glasses', 0, 20),
  awakenings: numberField('Awakenings', 0, 20),
})

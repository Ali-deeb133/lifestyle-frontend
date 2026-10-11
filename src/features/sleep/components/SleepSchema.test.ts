import { describe, expect, it } from 'vitest'
import { sleepSchema } from './SleepSchema'

const valid = {
  sleep_duration: '7.5',
  exercise_frequency: '3',
  smoking_status: false,
  bed_time: '23:30',
  coffee_cups: '2',
  alcohol_glasses: '0',
  awakenings: '1',
}

const firstError = (overrides: Partial<typeof valid>) => {
  const result = sleepSchema.safeParse({ ...valid, ...overrides })
  return result.success ? null : result.error.issues[0].message
}

describe('sleepSchema', () => {
  it('converts a valid form to numbers', () => {
    expect(sleepSchema.parse(valid)).toEqual({
      sleep_duration: 7.5,
      exercise_frequency: 3,
      smoking_status: false,
      bed_time: '23:30',
      coffee_cups: 2,
      alcohol_glasses: 0,
      awakenings: 1,
    })
  })

  it('rejects empty fields instead of sending 0', () => {
    expect(firstError({ sleep_duration: '' })).toBe('Sleep duration is required')
    expect(firstError({ coffee_cups: '  ' })).toBe('Coffee cups is required')
    expect(firstError({ bed_time: '' })).toBe('Bed time is required')
  })

  it('rejects non-numeric text', () => {
    expect(firstError({ awakenings: 'abc' })).toBe('Awakenings must be a number')
  })

  it('enforces ranges', () => {
    expect(firstError({ sleep_duration: '0' })).toBe('Sleep duration must be between 1 and 24')
    expect(firstError({ sleep_duration: '25' })).toBe('Sleep duration must be between 1 and 24')
    expect(firstError({ exercise_frequency: '8' })).toBe('Exercise frequency must be between 0 and 7')
  })

  it('requires whole numbers for counts but allows decimal hours', () => {
    expect(firstError({ coffee_cups: '2.5' })).toBe('Coffee cups must be a whole number')
    expect(firstError({ sleep_duration: '6.5' })).toBeNull()
  })
})

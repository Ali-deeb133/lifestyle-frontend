import { describe, expect, it } from 'vitest'
import { bodySchema } from './BodySchema'

const male = {
  birth_date: '1995-04-12',
  gender: 'male' as const,
  height: 178,
  weight: 76,
  neck_circumference: 38,
  waist_circumference: 84,
  hip_circumference: 0,
  activity_level: 'moderate' as const,
}

const firstError = (data: unknown) => {
  const result = bodySchema.safeParse(data)
  return result.success ? null : result.error.issues[0].message
}

describe('bodySchema', () => {
  it('accepts a male profile without a hip measurement', () => {
    expect(firstError(male)).toBeNull()
  })

  it('requires a hip measurement for females', () => {
    expect(firstError({ ...male, gender: 'female' })).toBe('Hip measurement is required')
    expect(firstError({ ...male, gender: 'female', hip_circumference: 96 })).toBeNull()
  })

  it('rejects missing measurements', () => {
    expect(firstError({ ...male, birth_date: '' })).toBe('Enter your birth date')
    expect(firstError({ ...male, height: 0 })).toBe('Enter a valid height')
    expect(firstError({ ...male, waist_circumference: 0 })).toBe('Enter a valid waist measurement')
  })
})

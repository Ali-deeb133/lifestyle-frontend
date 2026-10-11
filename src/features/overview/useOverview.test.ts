import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOverview } from './useOverview'
import { useBodyStore } from '../body/bodyStore'
import { useSleepStore } from '../sleep/sleepStore'
import { useWorkoutStore } from '../workout/workoutStore'
import type { BodyMetrics, BodyProfile, RuleBase } from '../body/body.types'
import type { SleepDetails } from '../sleep/sleep.types'
import type { WorkoutProgram, WorkoutRequest } from '../workout/workout.types'

function setBody(bmiCategory: string) {
  useBodyStore.getState().setAll(
    { weight: 76 } as BodyProfile,
    { bmi: 24, body_fat_percentage: 18, bmr: 1700, tdee: 2600 } as BodyMetrics,
    { bmi_category: bmiCategory, bfp_category: 'Healthy', segment: 'Normal', metabolic_status: 'Normal' } as RuleBase,
  )
}

function setSleep(efficiency: number) {
  const factor = { value: 1, evaluation: 'Normal' }
  useSleepStore.getState().setAll(
    { predicted_efficiency: efficiency, efficiency_label: 'Good sleep efficiency', created_at: '' },
    {
      sleep_efficiency: efficiency,
      classification: 'Good sleep efficiency',
      factors_analysis: {
        sleep_duration: factor, caffeine: factor, alcohol: factor, awakenings: factor, exercise_frequency: factor,
      },
    } satisfies SleepDetails,
  )
}

function setWorkout(similarity: number) {
  const program = { title: 'Plan', program_length: 12, total_exercises: 40, time_per_workout: 60, similarity, exercises: [] }
  useWorkoutStore.getState().setPrograms([program as unknown as WorkoutProgram], { level: 'Beginner' } as WorkoutRequest)
}

beforeEach(() => {
  useBodyStore.getState().clear()
  useSleepStore.getState().clear()
  useWorkoutStore.getState().clear()
})

describe('useOverview', () => {
  it('has no score and no completed modules when nothing was submitted', () => {
    const { result } = renderHook(() => useOverview())

    expect(result.current.healthScore).toBeNull()
    expect(result.current.completedModules).toEqual([])
    expect(result.current.isComplete).toBe(false)
  })

  it('counts only the modules that have data', () => {
    setBody('Normal')
    const { result } = renderHook(() => useOverview())

    expect(result.current.completedModules).toEqual(['body'])
    expect(result.current.isComplete).toBe(false)
    expect(result.current.healthScore).toBe(90)
  })

  it('averages the three module scores', () => {
    setBody('Overweight') // 65
    setSleep(85)          // 90
    setWorkout(0.7)       // 70
    const { result } = renderHook(() => useOverview())

    expect(result.current.completedModules).toEqual(['body', 'sleep', 'workout'])
    expect(result.current.isComplete).toBe(true)
    expect(result.current.healthScore).toBe(75)
  })

  it.each([
    [85, 90],
    [70, 65],
    [40, 55],
  ])('scores sleep efficiency %i as %i', (efficiency, score) => {
    setSleep(efficiency)
    const { result } = renderHook(() => useOverview())

    expect(result.current.sleep?.score).toBe(score)
  })
})

import { useState, useCallback } from 'react'
import { workoutService } from './WorkoutService'
import { useWorkoutStore } from './WorkoutStore'

import { parseWorkoutError } from './WorkoutError'
import { handleError } from '../../shared/errors/handleError'
import { toAppError } from '../../shared/errors/errorUtils'
import { ERROR_TYPES } from '../../shared/errors/errorTypes'
import { Toast } from '../../shared/utils/toaster'

import type { WorkoutRequest } from './Workout.types'

export function useWorkout() {
  const { setPrograms, setSelected, clear } = useWorkoutStore()

  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleErr = (err: unknown) => {
    const appError = toAppError(err)

    // validation → UI
    if (appError.type === ERROR_TYPES.VALIDATION) {
      setError(parseWorkoutError(appError))
      return
    }

    // server/network → toast
    const msg = handleError(appError)

    if (msg) {
      Toast.error(msg)
    } else {
      setError(appError.message)
    }
  }

  const submitWorkout = useCallback(async (data: WorkoutRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const programs = await workoutService.recommend(data)

      // 🔥 أهم إضافة
      if (!programs.length) {
        setError('لم يتم العثور على برامج مناسبة')
        return false
      }

      setPrograms(programs, data)
      return true

    } catch (err) {
      handleErr(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [setPrograms])

  return {
    submitWorkout,
    setSelected,
    error,
    loading,
    clear,
  }
}
import { useState, useCallback } from 'react'
import { sleepService } from './sleepService'
import { useSleepStore } from './sleepStore'

import { parseSleepError } from './sleepErrors'
import { handleError } from '../../shared/errors/handleError'
import { toAppError } from '../../shared/errors/errorUtils'
import { ERROR_TYPES } from '../../shared/errors/errorTypes'
import { Toast } from '../../shared/utils/toaster'

import type { SleepRequest } from './sleep.types'

export function useSleep() {
  const { setAll, clear } = useSleepStore()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleErr = (err: unknown) => {
    const appError = toAppError(err)

    if (appError.type === ERROR_TYPES.VALIDATION) {
      setError(parseSleepError(appError))
      return
    }

    const msg = handleError(appError)

    if (msg) Toast.error(msg)
    else setError(appError.message)
  }

  // 📦 جلب آخر نتيجة محفوظة عالسيرفر
  const loadLatest = useCallback(async (): Promise<void> => {
    try {
      const [latest, details] = await Promise.all([
        sleepService.getLatest(),
        sleepService.getLatestDetails(),
      ])
      setAll(latest, details)
    } catch (err) {
      const appError = toAppError(err)

      // 404 → المستخدم ما عنده بيانات نوم لسا
      if (appError.type === ERROR_TYPES.NOT_FOUND) {
        clear()
        return
      }

      const msg = handleError(appError)
      if (msg) Toast.error(msg)
    }
  }, [setAll, clear])

  const submitSleep = useCallback(async (data: SleepRequest) => {
    setLoading(true)
    setError(null)

    try {
      const result = await sleepService.createSleep(data)
      const details = await sleepService.getLatestDetails()

      setAll(
        {
          predicted_efficiency: result.predicted_efficiency,
          efficiency_label: result.efficiency_label,
          created_at: result.created_at,
        },
        details
      )

      return true
    } catch (err) {
      handleErr(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [setAll])

  return {
    submitSleep,
    loadLatest,
    error,
    loading,
  }
}

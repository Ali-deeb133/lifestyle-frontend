


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
  const { setResult, setDetails, setLatest } = useSleepStore()

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

  const loadLatest = useCallback(async () => {
    try {
      const latest = await sleepService.getLatest()
      setLatest(latest)
    } catch (err) {
      handleErr(err)
    }
  }, [setLatest])

  const submitSleep = useCallback(async (data: SleepRequest) => {
    setLoading(true)
    setError(null)

    try {
      const result = await sleepService.createSleep(data)
      const details = await sleepService.getLatestDetails()

      setResult(result)
      setDetails(details)

      return true
    } catch (err) {
      handleErr(err)
      return false
    } finally {
      setLoading(false)
    }
  }, [setResult, setDetails])

  return {
    submitSleep,
    loadLatest,
    error,
    loading,
  }
}
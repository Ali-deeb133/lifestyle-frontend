import { useState } from 'react'
import { bodyService } from './bodyService'
import { useBodyStore } from './bodyStore'
import { parseBodyError } from './bodyErrors'

import { toAppError } from '../../shared/errors/errorUtils'
import { handleError } from '../../shared/errors/handleError'
import { ERROR_TYPES } from '../../shared/errors/errorTypes'
import { Toast } from '../../shared/utils/toaster'

import type { BodyProfileRequest } from './body.types'

export function useBody() {
  const { setAll, clear } = useBodyStore()

  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // 🔥 pipeline كامل (atomic)
  async function submitBodyData(data: BodyProfileRequest): Promise<boolean> {
    setLoading(true)
    setError(null)
    setWarnings([])

    try {
      const profile = await bodyService.createProfile(data)
      const metrics = await bodyService.calculateMetrics()
      const ruleBase = await bodyService.generateRuleBase()

      // ✅ حفظ atomic
      setAll(profile, metrics, ruleBase)

      // ✅ جمع كل التحذيرات
      const allWarnings = [
        ...(profile.warnings || []),
        ...(metrics.warnings || []),
      ]

      if (allWarnings.length) {
        setWarnings(allWarnings)
      }

      return true

    } catch (err) {
      const appError = toAppError(err)

      if (appError.type === ERROR_TYPES.VALIDATION) {
        setError(parseBodyError(appError))
      } else {
        const toastMessage = handleError(appError)

        if (toastMessage) {
          Toast.error(toastMessage)
        } else {
          setError(appError.message)
        }
      }

      return false
    } finally {
      setLoading(false)
    }
  }

  // 📦 جلب آخر بيانات (ملاحظة تحت 👇)
  async function loadLatest(): Promise<void> {
    setLoading(true)
    try {
      const profile = await bodyService.getLatestProfile()
      const metrics = await bodyService.calculateMetrics()
      const ruleBase = await bodyService.generateRuleBase()

      setAll(profile, metrics, ruleBase)
    } catch (err) {
      const appError = toAppError(err)
      const toastMessage = handleError(appError)

      if (toastMessage) {
        Toast.error(toastMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    submitBodyData,
    loadLatest,
    error,
    warnings,
    loading,
    clear,
  }
}
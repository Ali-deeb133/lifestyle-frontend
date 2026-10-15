import { useState } from 'react'
import { authService } from './authService'
import { useAuthStore } from './authStore'
import { parseAuthError } from './authErrors'
import { clearFeatureStores, resetSession } from './session'

import { toAppError } from '../../shared/errors/errorUtils'
import { ERROR_TYPES } from '../../shared/errors/errorTypes'
import type { LoginCredentials, RegisterCredentials } from './auth.types'
import { Toast } from '../../shared/utils/toaster'
import { handleError } from '../../shared/errors/handleError'
import { useSlowServerHint } from '../../shared/hooks/useSlowServerHint'

export function useAuth() {
  const { setUser, user, isInitialized } = useAuthStore()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  useSlowServerHint(loading)

  const isAuthenticated = !!user

  async function login(credentials: LoginCredentials): Promise<boolean> {
    setLoading(true)
    setError(null)

    try {
      const user = await authService.login(credentials)
      // بيانات محلية قديمة ممكن تكون لمستخدم تاني
      clearFeatureStores()
      setUser(user)

      return true
    } catch (err) {
      const appError = toAppError(err)

      if (appError.type === ERROR_TYPES.VALIDATION) {
        setError(parseAuthError(appError))
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

  async function register(credentials: RegisterCredentials): Promise<boolean> {
    setLoading(true)
    setError(null)

    try {
      await authService.register(credentials)

      const user = await authService.login({
        email: credentials.email,
        password: credentials.password,
      })
      clearFeatureStores()
      setUser(user)

      return true
    } catch (err) {
      const appError = toAppError(err)

      if (appError.type === ERROR_TYPES.VALIDATION) {
        const msg = parseAuthError(appError)
        setError(msg)
        Toast.error(msg)
      } else {
        setError(appError.message)
        Toast.error(appError.message)
      }

      return false
    } finally {
      setLoading(false)
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } catch (err) {
      // الجلسة المحلية بتنمسح بكل الأحوال — نبّه بس على مشاكل الشبكة/السيرفر
      const toastMessage = handleError(toAppError(err))
      if (toastMessage) Toast.error(toastMessage)
    } finally {
      resetSession()
    }
  }

  return {
    login,
    register,
    logout,
    error,
    loading,
    user,
    isAuthenticated,
    isInitialized,
  }
}

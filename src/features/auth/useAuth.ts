

import { useState } from 'react'
import { authService } from './authService'
import { useAuthStore } from './authStore'
import { parseAuthError } from './authErrors'

import { toAppError } from '../../shared/errors/errorUtils'
import { ERROR_TYPES } from '../../shared/errors/errorTypes'
import type { LoginCredentials, RegisterCredentials } from './auth.types'
import { Toast } from '../../shared/utils/toaster'
import  {handleError} from '../../shared/errors/handleError'
import { useBodyStore } from '../body/bodyStore'
import { useSleepStore } from '../sleep/sleepStore'
import { useWorkoutStore } from '../workout/WorkoutStore'

export function useAuth() {
  const { setUser, clearUser, user } = useAuthStore()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isAuthenticated = !!user

  if (typeof window !== 'undefined') {
  const handler = () => useAuthStore.getState().clearUser()

  window.removeEventListener('auth:logout', handler)
  window.addEventListener('auth:logout', handler)
}

  async function login(credentials: LoginCredentials): Promise<boolean> {
    setLoading(true)
    setError(null)

    try {
      await authService.login(credentials)

      const user = await authService.me()
      setUser(user)

      return true
    } catch (err) {
  const appError = toAppError(err)
  console.log('appError', appError)

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

      await authService.login({
        email: credentials.email,
        password: credentials.password,
      })

      const user = await authService.me()
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
      const appError = toAppError(err)
       setError(appError.message)
       Toast.error(appError.message)
    } finally {
      clearUser()
      useBodyStore.getState().clear() // مسح بيانات الجسم عند تسجيل الخروج
      useSleepStore.getState().clear() // مسح بيانات النوم عند تسجيل الخروج
      useWorkoutStore.getInitialState().clear() // مسح بيانات التمارين عند تسجيل الخروج
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
  }
}
import { useEffect, useState } from 'react'
import { useAuthStore } from './authStore'
import { authService } from './authService'
import { resetSession } from './session'
import { tokenStorage } from '../../shared/api/api'
import { toAppError } from '../../shared/errors/errorUtils'
import { handleError } from '../../shared/errors/handleError'
import { ERROR_TYPES } from '../../shared/errors/errorTypes'
import { Toast } from '../../shared/utils/toaster'
import { useSlowServerHint } from '../../shared/hooks/useSlowServerHint'

export function AppInitializer() {
  // /me ممكن ياخد لحد ~110 ثانية إذا السيرفر عم يصحى
  const [checking, setChecking] = useState(false)
  useSlowServerHint(checking)

  useEffect(() => {
    const { setUser, setInitialized } = useAuthStore.getState()

    // الـ interceptor بيطلق هالحدث لما السيرفر يرفض الـ refresh token
    window.addEventListener('auth:logout', resetSession)

    const init = async () => {
      if (!tokenStorage.getAccess() && !tokenStorage.getRefresh()) {
        resetSession()
        return
      }

      setChecking(true)
      try {
        const user = await authService.me()
        setUser(user)
      } catch (err) {
        const appError = toAppError(err)

        if (appError.type === ERROR_TYPES.AUTH) {
          resetSession()
          return
        }

        // مشكلة شبكة/سيرفر → خلي التوكنز، إعادة التحميل بتجرب من جديد
        setInitialized()
        const message = handleError(appError)
        if (message) Toast.error(message)
      } finally {
        setChecking(false)
      }
    }

    init()

    return () => window.removeEventListener('auth:logout', resetSession)
  }, [])

  return null
}

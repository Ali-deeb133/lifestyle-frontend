

import { useEffect } from 'react'
import { useAuthStore } from './authStore'
import { authService } from './authService'
import { tokenStorage } from '../../shared/api/api'

export function AppInitializer() {
  const { setUser, clearUser, setInitialized } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      const token = tokenStorage.getAccess()

      if (!token) {
        setInitialized()
        return
      }

      try {
        const user = await authService.me()
        setUser(user)
      } catch {
        clearUser()
      }
    }

    init()
  }, [])

  return null
}




import { create } from 'zustand'
import type { AuthState } from './auth.types'

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isInitialized: false,

  setUser: (user) => set({ user, isInitialized: true }),
  clearUser: () => set({ user: null, isInitialized: true }),
  setInitialized: () => set({ isInitialized: true }),
}))
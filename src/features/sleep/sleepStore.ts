import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SleepState } from './sleep.types'

// مفتاح النسخة القديمة (شكل بيانات مختلف) — امسح اللي بقي منه
localStorage.removeItem('sleep-storage-${user.id}')

// النتائج بتنحفظ بالـ localStorage — وبتنمسح عند تسجيل الدخول/الخروج (auth/session.ts)
export const useSleepStore = create<SleepState>()(
  persist(
    (set) => ({
      latest: null,
      details: null,

      setAll: (latest, details) => set({ latest, details }),

      clear: () => set({ latest: null, details: null }),
    }),
    {
      name: 'sleep-storage', // الاسم الذي سيظهر في localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)

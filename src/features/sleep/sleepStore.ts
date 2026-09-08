


import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SleepResult, SleepState } from './sleep.types'

export const useSleepStore = create<SleepState>()(
  persist(
    (set) => ({
      result: null,
      details: null,
      latest: null,

      setResult: (result: SleepResult) => set({ result }),
      setDetails: (details) => set({ details }),
      setLatest: (latest) => set({ latest }),

      clear: () => set({ result: null, details: null, latest: null }),
    }),
    {
      name: 'sleep-storage-${user.id}', // الاسم الذي سيظهر في localStorage
      storage: createJSONStorage(() => localStorage),

      // 🔥 أهم تعديل فعلي
      partialize: (state) => ({
        result: state.result,
        details: state.details,
        // ❌ لا تخزن latest
      }),

      version: 1,
    }
  )
)


// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'
// import { useAuthStore } from '../auth/authStore'
// import type { SleepState } from './sleep.types'

// const getStorageKey = () => {
//   const user = useAuthStore.getState().user
//   return user ? `sleep-storage-${user.id}` : 'sleep-storage-guest'
// }

// export const useSleepStore = create<SleepState>()(
//   persist(
//     (set) => ({
//       result: null,
//       details: null,
//       latest: null,

//       setResult: (result) => set({ result }),
//       setDetails: (details) => set({ details }),
//       setLatest: (latest) => set({ latest }),

//       clear: () => set({ result: null, details: null, latest: null }),
//     }),
//     {
//       name: getStorageKey(),
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// )
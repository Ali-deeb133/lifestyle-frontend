import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // استيراد الـ middleware
import type { WorkoutState } from './Workout.types'

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      programs: [],
      selected: null,
      request: null,

      setPrograms: (programs, request) =>
        set({
          programs,
          request,
          selected: programs.length > 0 ? programs[0] : null,
        }),

      setSelected: (program) =>
        set({ selected: program }),

      clear: () =>
        set({
          programs: [],
          selected: null,
          request: null,
        }),
    }),
    {
      name: 'workout-storage', // اسم المفتاح في الـ localStorage
      storage: createJSONStorage(() => localStorage), // تحديد مكان التخزين (اختياري، الافتراضي هو localStorage)
    }
  )
)
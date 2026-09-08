

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' 
import type { BodyState, BodyProfile, BodyMetrics, RuleBase } from './body.types'

export const useBodyStore = create<BodyState>()(
  persist(
    (set) => ({
      profile: null,
      metrics: null,
      ruleBase: null,

      setAll: (
        profile: BodyProfile,
        metrics: BodyMetrics,
        ruleBase: RuleBase
      ) => set({ profile, metrics, ruleBase }),

      clear: () => set({ profile: null, metrics: null, ruleBase: null }),
    }),
    {
      name: 'body-storage', // الاسم الذي سيظهر في localStorage
      storage: createJSONStorage(() => localStorage), // تحديد مكان التخزين (اختياري، الافتراضي هو localStorage)
    }
  )
)



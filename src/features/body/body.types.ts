// ─── Request ───────────────────────────────────────────
export interface BodyProfileRequest {
  birth_date: string
  gender: 'male' | 'female'
  height: number
  weight: number
  neck_circumference: number
  waist_circumference: number
  hip_circumference?: number       // مطلوب للـ female بس
  activity_level: ActivityLevel
}

export type ActivityLevel =
  | 'very_low'
  | 'light'
  | 'moderate'
  | 'high'
  | 'very_high'
  | 'none'

// ─── Responses ─────────────────────────────────────────
export interface BodyProfile {
  id: number
  warnings: string[]
  birth_date: string
  gender: 'male' | 'female'
  height: number
  weight: number
  neck_circumference: number
  waist_circumference: number
  hip_circumference: number
  activity_level: ActivityLevel
  created_at: string
}

export interface BodyMetrics {
  id: number
  warnings: string[]
  age: number
  activity_factor: number
  bmi: number
  body_fat_percentage: number
  fat_mass: number
  lean_mass: number
  ideal_body_fat_percentage: number
  fat_to_lose: number
  bmr: number
  tdee: number
  created_at: string
}

export interface RuleBase {
  id: number
  bmi_category: string
  bfp_category: string
  lean_mass_category: string
  fat_mass_category: string
  bmr_category: string
  tdee_category: string
  fat_to_lose_status: string
  ideal_bfp_deviation: string
  primary_pattern: string
  segment: string
  metabolic_status: string
  created_at: string
  user: number
  body_metrics: number
}

export interface BodyApiResponse<T> {
  status: 'success' | 'warning' | 'error'
  warnings: string[]
  data: T
}

// ─── Store State ───────────────────────────────────────
export interface BodyState {
  profile: BodyProfile | null
  metrics: BodyMetrics | null
  ruleBase: RuleBase | null
  setAll: (profile: BodyProfile, metrics: BodyMetrics, ruleBase: RuleBase) => void
  clear: () => void
}
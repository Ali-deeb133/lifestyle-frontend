// ─── Request ───────────────────────────────────────────
export interface SleepRequest {
  sleep_duration: number
  exercise_frequency: number
  smoking_status: boolean
  bed_time: string
  coffee_cups: number
  alcohol_glasses: number
  awakenings: number
}

// ─── Responses ─────────────────────────────────────────
export interface SleepResult {
  id: number
  age: number
  gender: string
  sleep_duration: number
  exercise_frequency: number
  smoking_status: boolean
  bed_time: string
  caffeine_mg: number
  alcohol_grams: number
  awakenings: number
  predicted_efficiency: number
  efficiency_label: string
  created_at: string
  user: number
}

export interface SleepLatest {
  predicted_efficiency: number
  efficiency_label: string
  created_at: string
}

export interface FactorEvaluation {
  value: number
  evaluation: string
}

export interface SleepDetails {
  sleep_efficiency: number
  classification: string
  factors_analysis: {
    sleep_duration: FactorEvaluation
    caffeine: FactorEvaluation
    alcohol: FactorEvaluation
    awakenings: FactorEvaluation
    exercise_frequency: FactorEvaluation
  }
}

// ─── Store State ───────────────────────────────────────
export interface SleepState {
  latest: SleepLatest | null
  details: SleepDetails | null
  setAll: (latest: SleepLatest, details: SleepDetails) => void
  clear: () => void
}
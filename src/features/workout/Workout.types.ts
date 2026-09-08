
// ─── Request ───────────────────────────────────────────
export type FitnessLevel = 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced'

export type FitnessGoal =
  | 'Muscle & Sculpting'
  | 'Bodybuilding'
  | 'Powerbuilding'
  | 'Athletics'
  

export type Equipment = 'Full Gym' | 'Minimal' | 'Bodyweight'

export interface WorkoutRequest {
  level: FitnessLevel
  goal: FitnessGoal
  equipment: Equipment
  program_length: number
}

// ─── Response ──────────────────────────────────────────
export interface Exercise {
  week: number
  day: number
  exercise_name: string
  sets: number
  reps_display: string
  number_of_exercises: number
}

export interface WorkoutProgram {
  title: string
  description: string
  level: string
  goal: string
  program_length: number
  total_exercises: number
  time_per_workout: number
  similarity: number
  exercises: Exercise[]
  
}

// ─── Store State ───────────────────────────────────────
export interface WorkoutState {
  programs: WorkoutProgram[]
  selected: WorkoutProgram | null
  request: WorkoutRequest | null
  setPrograms: (programs: WorkoutProgram[], request: WorkoutRequest) => void
  setSelected: (program: WorkoutProgram) => void
  clear: () => void
}
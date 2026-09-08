import { useWorkoutStore } from '../workout/WorkoutStore'

export function useWorkoutSummary() {
  const { selected, request } = useWorkoutStore()

  if (!selected) return null

  return {
    title:           selected.title,
    programLength:   selected.program_length,
    totalExercises:  selected.total_exercises,
    timePerWorkout:  selected.time_per_workout,
    similarity:      selected.similarity,
    level:           request?.level ?? '',
    goal:            request?.goal ?? '',
    score:           Math.round(selected.similarity * 100),
  }
}
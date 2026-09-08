import api from '../../shared/api/api'
import type { WorkoutRequest, WorkoutProgram } from './Workout.types'



 

function isWorkoutProgram(obj: unknown): obj is WorkoutProgram {
  // هون عم نقلّه للـ TS: اعتبر هالكائن "مبدئياً" بيشبه الـ WorkoutProgram 
  // بس مو أكيد (Partial)، مشان يخليني أقرأ الخصائص تبعه
  const candidate = obj as Partial<WorkoutProgram>;

  return (
    !!candidate &&
    typeof candidate === 'object' &&
    typeof candidate.title === 'string' &&
    Array.isArray(candidate.exercises)
  );
}
export const workoutService = {
  async recommend(data: WorkoutRequest): Promise<WorkoutProgram[]> {
    const res = await api.post('/api/sport/recommend/', data)

    const raw = res.data

    if (Array.isArray(raw)) {
      return raw.filter(isWorkoutProgram)
    }

    if (isWorkoutProgram(raw)) {
      return [raw]
    }

    throw new Error('Invalid workout response shape')
  },
}
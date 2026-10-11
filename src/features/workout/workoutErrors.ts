import axios from 'axios'
import type { AppError } from '../../shared/errors/AppError'

export function parseWorkoutError(appError: AppError): string {
  const original = appError.originalError

  if (axios.isAxiosError(original) && original.response?.status === 400) {
    const data = original.response.data as Record<string, unknown> | undefined

    if (data?.level)          return 'Invalid fitness level'
    if (data?.goal)           return 'Invalid goal'
    if (data?.equipment)      return 'Invalid equipment'
    if (data?.program_length) return 'Invalid program length'
  }

  return 'Check the entered data'
}

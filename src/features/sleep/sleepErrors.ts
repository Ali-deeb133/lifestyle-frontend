import axios from 'axios'
import type { AppError } from '../../shared/errors/AppError'
import { getServerMessage } from '../../shared/errors/serverMessage'

export function parseSleepError(appError: AppError): string {
  const original = appError.originalError

  if (axios.isAxiosError(original) && original.response?.status === 400) {
    const data = original.response.data

    if (data?.sleep_duration)     return 'Invalid sleep duration'
    if (data?.bed_time)           return 'Invalid bed time'
    if (data?.exercise_frequency) return 'Invalid exercise frequency'
    if (data?.coffee_cups)        return 'Invalid coffee cups count'
    if (data?.alcohol_glasses)    return 'Invalid alcohol glasses count'
    if (data?.awakenings)         return 'Invalid awakenings count'
  }

  const message = getServerMessage(appError)

  // السيرفر بيرفض بيانات النوم إذا المستخدم ما عمل تحليل الجسم
  if (message && /body (metrics|profile)/i.test(message)) {
    return 'Complete the Body Metrics analysis first, then analyze your sleep.'
  }

  return message ?? 'Check the entered data'
}

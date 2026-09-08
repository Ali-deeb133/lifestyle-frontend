import axios from 'axios'

export function parseWorkoutError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const data = error.response.data as Record<string, any>

    if (data?.level)          return 'مستوى اللياقة غير صحيح'
    if (data?.goal)           return 'الهدف غير صحيح'
    if (data?.equipment)      return 'المعدات غير صحيحة'
    if (data?.program_length) return 'مدة البرنامج غير صحيحة'
  }

  return 'تحقق من البيانات المدخلة'
}
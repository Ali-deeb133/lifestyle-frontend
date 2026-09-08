import { toAppError } from '../errors/errorUtils'
import { ERROR_TYPES } from '../errors/errorTypes'
import type { AppError } from '../errors/AppError'

// helper يستخدمه الـ hooks لتحويل error → رسالة نهائية
export function handleApiError(error: unknown): string {
  const appError = toAppError(error) as AppError

  switch (appError.type) {
    case ERROR_TYPES.NETWORK:
      return 'تحقق من اتصالك بالإنترنت'
    case ERROR_TYPES.AUTH:
      return 'انتهت الجلسة، يرجى تسجيل الدخول'
    case ERROR_TYPES.FORBIDDEN:
      return 'ليس لديك صلاحية للوصول'
    case ERROR_TYPES.VALIDATION:
      return appError.message
    case ERROR_TYPES.SERVER:
      return 'خطأ في الخادم، حاول مجدداً'
    default:
      return 'حدث خطأ غير متوقع'
  }
}
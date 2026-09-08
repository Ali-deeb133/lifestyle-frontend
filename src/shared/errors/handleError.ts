import { AppError } from "./AppError"
import { ERROR_TYPES } from "./errorTypes"

export function handleError(error: AppError): string | null {

  switch (error.type) {

    case ERROR_TYPES.NETWORK:
      return 'لا يوجد اتصال بالسيرفر'

    case ERROR_TYPES.SERVER:
      return 'مشكلة في السيرفر'

    // ❗ لا تتدخل بهدول → خليهم للـ UI
    case ERROR_TYPES.VALIDATION:
    case ERROR_TYPES.AUTH:
    case ERROR_TYPES.FORBIDDEN:
      return null

    default:
      return 'حدث خطأ غير متوقع'
  }
}
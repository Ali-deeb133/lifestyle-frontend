import { AppError } from "./AppError"
import { ERROR_TYPES } from "./errorTypes"

export function handleError(error: AppError): string | null {

  switch (error.type) {

    case ERROR_TYPES.NETWORK:
      return 'Cannot reach the server'

    case ERROR_TYPES.SERVER:
      return 'Server error. Please try again.'

    // ❗ لا تتدخل بهدول → خليهم للـ UI
    case ERROR_TYPES.VALIDATION:
    case ERROR_TYPES.AUTH:
    case ERROR_TYPES.FORBIDDEN:
    case ERROR_TYPES.NOT_FOUND:
      return null

    default:
      return 'Something went wrong'
  }
}
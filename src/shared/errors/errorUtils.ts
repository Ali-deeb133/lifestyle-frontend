// import axios from 'axios'
// import { AppError } from './AppError'
// import { ERROR_TYPES } from './errorTypes'

// export function toAppError(error: unknown): AppError {

//   // أصلاً AppError
//   if (error instanceof AppError) return error

//   // Axios error
//   if (axios.isAxiosError(error)) {
//     const status = error.response?.status
//     const data = error.response?.data

//     // Network / Timeout
//     if (!error.response) {
//       return new AppError({
//         type: ERROR_TYPES.NETWORK,
//         message: "تعذر الاتصال بالخادم ",
//         originalError: error,
//       })
//     }

//     // 401
//     if (status === 401) {
//       return new AppError({
//         type: ERROR_TYPES.AUTH,
//         message: 'انتهت الجلسة، يرجى تسجيل الدخول',
//         status,
//         originalError: error,
//       })
//     }

//     // 403
//     if (status === 403) {
//       return new AppError({
//         type: ERROR_TYPES.FORBIDDEN,
//         message: 'ليس لديك صلاحية للوصول',
//         status,
//         originalError: error,
//       })
//     }

//     // 400 — validation
//     if (status === 400) {
//       const field = data ? Object.keys(data)[0] : undefined
//       const message = field && data[field]
//         ? data[field][0]
//         : 'بيانات غير صحيحة'

//       return new AppError({
//         type: ERROR_TYPES.VALIDATION,
//         message,
//         status,
//         field,
//         originalError: error,
//       })
//     }

//     // 500+
//     if (status && status >= 500) {
//       return new AppError({
//         type: ERROR_TYPES.SERVER,
//         message: 'خطأ في الخادم، حاول مجدداً',
//         status,
//         originalError: error,
//       })
//     }
//   }

//   // Unknown
//   return new AppError({
//     type: ERROR_TYPES.UNKNOWN,
//     message: 'حدث خطأ غير متوقع',
//     originalError: error,
//   })}

import axios from 'axios'
import { AppError } from './AppError'
import { ERROR_TYPES } from './errorTypes'

export function toAppError(error: unknown): AppError {

  if (error instanceof AppError) return error

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    // const data = error.response?.data

    // ❗ لا يوجد response → مشكلة اتصال حقيقية
    if (!error.response) {
      return new AppError({
        type: ERROR_TYPES.NETWORK,
        message: 'لا يمكن الوصول للسيرفر',
        originalError: error,
      })
    }

    // 401
    if (status === 401) {
      return new AppError({
        type: ERROR_TYPES.AUTH,
        message: 'انتهت الجلسة',
        status,
        originalError: error,
      })
    }

    // 403
    if (status === 403) {
      return new AppError({
        type: ERROR_TYPES.FORBIDDEN,
        message: 'ليس لديك صلاحية',
        status,
        originalError: error,
      })
    }

    // 400 validation
    if (status === 400) {
      return new AppError({
        type: ERROR_TYPES.VALIDATION,
        message: 'بيانات غير صحيحة',
        status,
        originalError: error,
      })
    }

    // ✅ السيرفر رد بس فيه مشكلة
    if (status && status >= 500) {
      return new AppError({
        type: ERROR_TYPES.SERVER,
        message: 'السيرفر فيه مشكلة',
        status,
        originalError: error,
      })
    }
  }

  return new AppError({
    type: ERROR_TYPES.UNKNOWN,
    message: 'خطأ غير متوقع',
    originalError: error,
  })
}
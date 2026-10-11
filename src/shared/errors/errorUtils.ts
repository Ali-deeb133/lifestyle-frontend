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
        message: 'Cannot reach the server',
        originalError: error,
      })
    }

    // 401
    if (status === 401) {
      return new AppError({
        type: ERROR_TYPES.AUTH,
        message: 'Your session has expired',
        status,
        originalError: error,
      })
    }

    // 403
    if (status === 403) {
      return new AppError({
        type: ERROR_TYPES.FORBIDDEN,
        message: 'You do not have permission',
        status,
        originalError: error,
      })
    }

    // 404
    if (status === 404) {
      return new AppError({
        type: ERROR_TYPES.NOT_FOUND,
        message: 'Not found',
        status,
        originalError: error,
      })
    }

    // 400 validation
    if (status === 400) {
      return new AppError({
        type: ERROR_TYPES.VALIDATION,
        message: 'Invalid data',
        status,
        originalError: error,
      })
    }

    // ✅ السيرفر رد بس فيه مشكلة
    if (status && status >= 500) {
      return new AppError({
        type: ERROR_TYPES.SERVER,
        message: 'Server error',
        status,
        originalError: error,
      })
    }
  }

  return new AppError({
    type: ERROR_TYPES.UNKNOWN,
    message: 'Unexpected error',
    originalError: error,
  })
}
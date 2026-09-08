import type { ErrorType } from './errorTypes'

export class AppError extends Error {
  type: ErrorType
  status?: number
  field?: string
  originalError?: unknown

  constructor(params: {
    type: ErrorType
    message: string
    status?: number
    field?: string
    originalError?: unknown
  }) {
    super(params.message)
    this.name = 'AppError'
    this.type = params.type
    this.status = params.status
    this.field = params.field
    this.originalError = params.originalError
    // تصحيح الـ prototype chain
    Object.setPrototypeOf(this, AppError.prototype)
  }}
import { AppError } from '../../shared/errors/AppError'

type ValidationErrorResponse = {
  height?: string[]
  weight?: string[]
  birth_date?: string[]
  neck_circumference?: string[]
  waist_circumference?: string[]
  hip_circumference?: string[]
  non_field_errors?: string[]
}

function isValidationErrorResponse(data: unknown): data is ValidationErrorResponse {
  return typeof data === 'object' && data !== null
}

export function parseBodyError(error: AppError): string {
  const raw = (error.originalError as { response?: { data?: unknown } })?.response?.data

  if (!isValidationErrorResponse(raw)) {
    return 'تحقق من البيانات المدخلة'
  }

  if (raw.height?.length)              return raw.height[0]
  if (raw.weight?.length)              return raw.weight[0]
  if (raw.birth_date?.length)          return raw.birth_date[0]
  if (raw.neck_circumference?.length)  return raw.neck_circumference[0]
  if (raw.waist_circumference?.length) return raw.waist_circumference[0]
  if (raw.hip_circumference?.length)   return raw.hip_circumference[0]

  if (raw.non_field_errors?.length) {
    return raw.non_field_errors[0]
  }

  return 'تحقق من البيانات المدخلة'
}
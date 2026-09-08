import axios from 'axios'
import type { AppError } from '../../shared/errors/AppError'

export function parseAuthError(appError: AppError): string {
  const original = appError.originalError

  if (axios.isAxiosError(original)) {
    const data = original.response?.data

    // validation fields
    if (data?.email?.length) return data.email[0]
    if (data?.password?.length) return data.password[0]

    // login / general auth errors
   if (data?.non_field_errors?.length) {
  const msg = data.non_field_errors[0]

  if (msg === 'Invalid credentials')
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'

  return msg
}
  }

  return 'خطأ في تسجيل الدخول'
}
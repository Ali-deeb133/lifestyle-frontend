import axios from 'axios'
import type { AppError } from './AppError'

function firstString(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0]
  return null
}

// أول رسالة نصية من رد السيرفر: ["msg"] | { detail: "msg" } | { field: "msg" | ["msg"] }
export function getServerMessage(appError: AppError): string | null {
  const original = appError.originalError
  if (!axios.isAxiosError(original)) return null

  const data: unknown = original.response?.data

  if (Array.isArray(data)) return firstString(data)

  if (data && typeof data === 'object') {
    for (const value of Object.values(data)) {
      const message = firstString(value)
      if (message) return message
    }
  }

  return null
}

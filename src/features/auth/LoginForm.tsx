



import { useState } from 'react'
import { z } from 'zod'

import { Input } from '../../shared/ui/Input'
import { Button } from '../../shared/ui/Button'
import { ErrorMessage } from '../../shared/ui/ErrorMessage'
import { useAuth } from './useAuth'
import type { LoginCredentials } from './auth.types'

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

/* =========================
   ZOD SCHEMA
========================= */
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login, loading, error } = useAuth()

  const [form, setForm] = useState<LoginCredentials>({
    email: '',
    password: '',
  })

  const [localError, setLocalError] = useState<string | null>(null)

  async function handleSubmit() {
    setLocalError(null)

    /* =========================
       CLIENT VALIDATION (ZOD)
    ========================= */
    const result = loginSchema.safeParse(form)

    if (!result.success) {
      const firstError = result.error.issues[0]
      setLocalError(firstError?.message || 'Invalid input')
      return
    }

    /* =========================
       API CALL
    ========================= */
    const success = await login(result.data)

    if (success) onSuccess()
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-100">Welcome Back</h2>
        <p className="text-sm text-slate-100 mt-1">Sign in to continue</p>
      </div>

      {/* =========================
          ERROR DISPLAY (LOCAL + API)
      ========================= */}
      <ErrorMessage message={localError || error} />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      {/* Submit */}
      <Button
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        Login
      </Button>

      {/* Switch */}
      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
        >
          Create Account
        </button>
      </p>

    </div>
  )
}
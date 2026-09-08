




import { useState } from 'react'
import { z } from 'zod'

import { Input } from '../../shared/ui/Input'
import { Button } from '../../shared/ui/Button'
import { ErrorMessage } from '../../shared/ui/ErrorMessage'
import { useAuth } from './useAuth'
import type { RegisterCredentials } from './auth.types'

interface RegisterFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

/* =========================
   ZOD SCHEMA
========================= */
const registerSchema = z.object({
  first_name: z.string().min(2, 'First name too short'),
  last_name: z.string().min(2, 'Last name too short'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, loading, error } = useAuth()

  const [form, setForm] = useState<RegisterCredentials>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })

  const [localError, setLocalError] = useState<string | null>(null)

  async function handleSubmit() {
    setLocalError(null)

    /* =========================
       CLIENT VALIDATION (ZOD)
    ========================= */
    const result = registerSchema.safeParse(form)

    if (!result.success) {
      const message = result.error.issues?.[0]?.message
      setLocalError(message || 'Invalid input')
      return
    }

    /* =========================
       API CALL
    ========================= */
    const success = await register(result.data)

    if (success) onSuccess()
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-100">
          Create Account
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Start your health journey with us
        </p>
      </div>

      {/* =========================
          ERROR DISPLAY
      ========================= */}
      <ErrorMessage message={localError || error} />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={form.first_name}
            onChange={(e) =>
              setForm({ ...form, first_name: e.target.value })
            }
          />

          <Input
            label="Last Name"
            value={form.last_name}
            onChange={(e) =>
              setForm({ ...form, last_name: e.target.value })
            }
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
      </div>

      {/* Submit */}
      <Button
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        Create Account
      </Button>

      {/* Switch */}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
        >
          Sign In
        </button>
      </p>

    </div>
  )
}
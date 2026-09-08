export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: AuthUser
}

export interface AuthUser {
  first_name: string
  id: number
  last_name: string
  email: string
  is_active: boolean
  is_staff: boolean
  join_date: string
}

export interface AuthState {
   user: AuthUser | null
  setUser: (user: AuthUser) => void
  clearUser: () => void
  isInitialized: boolean
  setInitialized: () => void
}
import api, { tokenStorage } from '../../shared/api/api'
import type {
  LoginCredentials,
  RegisterCredentials,
  
  AuthUser,
  AuthResponse,
} from './auth.types'

export const authService = {

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { data } = await api.post<AuthResponse>(
      '/api/accounts/login/',
      credentials
    )
    tokenStorage.setTokens(data.access, data.refresh)

    return data.user
  },

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const { data } = await api.post<AuthUser>(
      '/api/accounts/register/',
      credentials
    )
    return data
  },

  async me(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/api/accounts/me/')
  return data
},

  async logout(): Promise<void> {
    const refresh = tokenStorage.getRefresh()
      await api.post('/api/accounts/logout/', { refresh })
    tokenStorage.clearTokens()
  },
}
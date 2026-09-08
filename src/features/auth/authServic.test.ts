

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../auth/authService'
import api, { tokenStorage } from '../../shared/api/api'

vi.mock('../../shared/api/api', () => ({
  default: {
    post: vi.fn(),
  },
  tokenStorage: {
    setTokens: vi.fn(),
    getRefresh: vi.fn(),
    clearTokens: vi.fn(),
  },
}))

describe('authService.login - success', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call API, store tokens, and return user on success', async () => {
    // arrange
    const credentials = {
      email: 'test@test.com',
      password: '123456',
    }

    const mockResponse = {
      data: {
        access: 'access-token',
        refresh: 'refresh-token',
        user: {
          id: 1,
          email: 'test@test.com',
        },
      },
    }

   vi.mocked(api.post).mockResolvedValue(mockResponse)

    // act
    const result = await authService.login(credentials)

    // assert

    // 1. API call correctness
    expect(api.post).toHaveBeenCalledWith(
      '/api/accounts/login/',
      credentials
    )

    // 2. side effect (critical)
    expect(tokenStorage.setTokens).toHaveBeenCalledWith(
      'access-token',
      'refresh-token'
    )

    // 3. return value
    expect(result).toEqual(mockResponse.data.user)
  })
})
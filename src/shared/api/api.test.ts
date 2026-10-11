import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import api, { tokenStorage } from './api'
import { ERROR_TYPES } from '../errors/errorTypes'

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown = {}): Promise<AxiosResponse> {
  const response = { status, data, statusText: '', headers: {}, config } as AxiosResponse
  if (status < 400) return Promise.resolve(response)
  return Promise.reject(new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response))
}

// السيرفر الوهمي: بيقبل بس التوكن "fresh"
function fakeServer(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const authorized = config.headers.Authorization === 'Bearer fresh'
  return respond(config, authorized ? 200 : 401, { url: config.url })
}

const logoutEvents = vi.fn()

beforeEach(() => {
  localStorage.clear()
  api.defaults.adapter = fakeServer
  window.addEventListener('auth:logout', logoutEvents)
})

afterEach(() => {
  window.removeEventListener('auth:logout', logoutEvents)
  vi.restoreAllMocks()
  logoutEvents.mockClear()
})

describe('token refresh', () => {
  it('refreshes once and retries each failed request with its own URL', async () => {
    tokenStorage.setTokens('stale', 'refresh-token')
    const refresh = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access: 'fresh' } })

    const [a, b] = await Promise.all([api.get('/api/a/'), api.get('/api/b/')])

    expect(refresh).toHaveBeenCalledTimes(1)
    expect(a.data.url).toBe('/api/a/')
    expect(b.data.url).toBe('/api/b/')
    expect(tokenStorage.getAccess()).toBe('fresh')
    expect(logoutEvents).not.toHaveBeenCalled()
  })

  it('logs out when the server rejects the refresh token', async () => {
    tokenStorage.setTokens('stale', 'refresh-token')
    vi.spyOn(axios, 'post').mockImplementation((_url, _body, config) =>
      respond(config as InternalAxiosRequestConfig, 401))

    await expect(api.get('/api/a/')).rejects.toMatchObject({ type: ERROR_TYPES.AUTH })

    expect(tokenStorage.getAccess()).toBeNull()
    expect(tokenStorage.getRefresh()).toBeNull()
    expect(logoutEvents).toHaveBeenCalled()
  })

  it('keeps the session when the refresh fails because of the network', async () => {
    tokenStorage.setTokens('stale', 'refresh-token')
    vi.spyOn(axios, 'post').mockRejectedValue(new AxiosError('Network Error'))

    await expect(api.get('/api/a/')).rejects.toMatchObject({ type: ERROR_TYPES.NETWORK })

    expect(tokenStorage.getRefresh()).toBe('refresh-token')
    expect(logoutEvents).not.toHaveBeenCalled()
  })

  it('logs out when there is no refresh token', async () => {
    tokenStorage.setAccess('stale')
    const refresh = vi.spyOn(axios, 'post')

    await expect(api.get('/api/a/')).rejects.toMatchObject({ type: ERROR_TYPES.AUTH })

    expect(refresh).not.toHaveBeenCalled()
    expect(logoutEvents).toHaveBeenCalled()
  })

  it('does not try to refresh after a failed login', async () => {
    const refresh = vi.spyOn(axios, 'post')
    tokenStorage.setTokens('stale', 'refresh-token')

    await expect(api.post('/api/accounts/login/', {})).rejects.toMatchObject({ type: ERROR_TYPES.AUTH })

    expect(refresh).not.toHaveBeenCalled()
    expect(logoutEvents).not.toHaveBeenCalled()
  })
})

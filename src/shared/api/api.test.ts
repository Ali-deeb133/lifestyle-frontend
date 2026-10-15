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

  it('does not send the stored token to login and register', async () => {
    tokenStorage.setTokens('stale', 'refresh-token')
    const adapter = vi.fn((config: InternalAxiosRequestConfig) => respond(config, 200))
    api.defaults.adapter = adapter

    await api.post('/api/accounts/login/', {})
    await api.post('/api/accounts/register/', {})
    await api.get('/api/accounts/me/')

    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined()
    expect(adapter.mock.calls[1][0].headers.Authorization).toBeUndefined()
    expect(adapter.mock.calls[2][0].headers.Authorization).toBe('Bearer stale')
  })
})

// السيرفر نايم: بيرجع خطأ بلا response لأول `failures` طلبات، وبعدين بيرد عادي
function sleepyServer(failures: number, code = 'ERR_NETWORK') {
  let calls = 0
  const adapter = vi.fn((config: InternalAxiosRequestConfig) => {
    calls += 1
    if (calls <= failures) {
      return Promise.reject(new AxiosError('Network Error', code, config, {}))
    }
    return fakeServer(config)
  })
  api.defaults.adapter = adapter
  return adapter
}

describe('cold start retry', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retries a GET after network errors until the server answers', async () => {
    tokenStorage.setAccess('fresh')
    const adapter = sleepyServer(2)

    const request = api.get('/api/a/')
    await vi.runAllTimersAsync()
    const res = await request

    expect(res.data.url).toBe('/api/a/')
    expect(adapter).toHaveBeenCalledTimes(3)
  })

  it('does not retry a POST that timed out, and gives it the long timeout', async () => {
    tokenStorage.setAccess('fresh')
    const adapter = sleepyServer(1, 'ECONNABORTED')

    const request = expect(api.post('/api/sleep/create/', {})).rejects.toMatchObject({ type: ERROR_TYPES.NETWORK })
    await vi.runAllTimersAsync()
    await request

    expect(adapter).toHaveBeenCalledTimes(1)
    expect(adapter.mock.calls[0][0].timeout).toBe(75_000)
  })

  it('does not retry when the browser is offline', async () => {
    tokenStorage.setAccess('fresh')
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const adapter = sleepyServer(1)

    const request = expect(api.get('/api/a/')).rejects.toMatchObject({ type: ERROR_TYPES.NETWORK })
    await vi.runAllTimersAsync()
    await request

    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('still refreshes the token when the server wakes up with a 401', async () => {
    tokenStorage.setTokens('stale', 'refresh-token')
    const refresh = vi.spyOn(axios, 'post').mockResolvedValue({ data: { access: 'fresh' } })
    const adapter = sleepyServer(1)

    const request = api.get('/api/a/')
    await vi.runAllTimersAsync()
    const res = await request

    expect(res.data.url).toBe('/api/a/')
    expect(refresh).toHaveBeenCalledTimes(1)
    // network error → retry بيرجع 401 → refresh → نجاح
    expect(adapter).toHaveBeenCalledTimes(3)
    expect(tokenStorage.getAccess()).toBe('fresh')
    expect(logoutEvents).not.toHaveBeenCalled()
  })
})

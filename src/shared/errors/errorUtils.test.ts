import { describe, expect, it } from 'vitest'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { toAppError } from './errorUtils'
import { getServerMessage } from './serverMessage'
import { AppError } from './AppError'
import { ERROR_TYPES } from './errorTypes'

function httpError(status: number, data: unknown = {}): AxiosError {
  const config = { headers: {} } as InternalAxiosRequestConfig
  const response = { status, data, statusText: '', headers: {}, config } as AxiosResponse
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response)
}

describe('toAppError', () => {
  it.each([
    [400, ERROR_TYPES.VALIDATION],
    [401, ERROR_TYPES.AUTH],
    [403, ERROR_TYPES.FORBIDDEN],
    [404, ERROR_TYPES.NOT_FOUND],
    [500, ERROR_TYPES.SERVER],
    [503, ERROR_TYPES.SERVER],
    [409, ERROR_TYPES.UNKNOWN],
  ])('maps HTTP %i to %s', (status, type) => {
    expect(toAppError(httpError(status)).type).toBe(type)
  })

  it('maps a request with no response to a network error', () => {
    expect(toAppError(new AxiosError('Network Error')).type).toBe(ERROR_TYPES.NETWORK)
  })

  it('returns an existing AppError unchanged', () => {
    const error = new AppError({ type: ERROR_TYPES.AUTH, message: 'x' })
    expect(toAppError(error)).toBe(error)
  })

  it('maps a non-HTTP error to unknown', () => {
    expect(toAppError(new Error('boom')).type).toBe(ERROR_TYPES.UNKNOWN)
  })
})

describe('getServerMessage', () => {
  const message = (data: unknown) => getServerMessage(toAppError(httpError(400, data)))

  it('reads a list body', () => {
    expect(message(['You must calculate body metrics first.'])).toBe('You must calculate body metrics first.')
  })

  it('reads a detail string', () => {
    expect(message({ detail: 'No body metrics found.' })).toBe('No body metrics found.')
  })

  it('reads the first field error, as a string or a list', () => {
    expect(message({ bmi: 'The BMI value is illogical.' })).toBe('The BMI value is illogical.')
    expect(message({ height: ['Invalid height value.'] })).toBe('Invalid height value.')
  })

  it('returns null when there is nothing readable', () => {
    expect(message('<html>error page</html>')).toBeNull()
    expect(message({})).toBeNull()
    expect(getServerMessage(toAppError(new Error('boom')))).toBeNull()
  })
})

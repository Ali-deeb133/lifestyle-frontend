import api from '../../shared/api/api'
import type { SleepRequest, SleepResult, SleepLatest, SleepDetails } from './sleep.types'

export const sleepService = {

  async createSleep(data: SleepRequest): Promise<SleepResult> {
    const res = await api.post<SleepResult>('/api/sleep/create/', data)
    return res.data
  },

  async getLatest(): Promise<SleepLatest> {
    const res = await api.get<SleepLatest>('/api/sleep/latest/')
    return res.data
  },

  async getLatestDetails(): Promise<SleepDetails> {
    const res = await api.get<SleepDetails>('/api/sleep/latest/details/')
    return res.data
  },
}
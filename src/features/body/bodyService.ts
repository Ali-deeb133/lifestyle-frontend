import api from '../../shared/api/api'
import type {
  BodyProfileRequest,
  BodyProfile,
  BodyMetrics,
  RuleBase,
  BodyApiResponse,
} from './body.types'

export const bodyService = {

  async createProfile(data: BodyProfileRequest): Promise<BodyProfile> {
    const res = await api.post<BodyApiResponse<BodyProfile>>(
      '/api/body_profiles/create/',
      data
    )
    return res.data.data
  },

  async getLatestProfile(): Promise<BodyProfile> {
    const res = await api.get<BodyProfile>('/api/body_profiles/latest/')
    return res.data
  },

  async calculateMetrics(): Promise<BodyMetrics> {
    const res = await api.post<BodyApiResponse<BodyMetrics>>(
      '/api/body-metrics/calculate/'
    )
    return res.data.data
  },

  async generateRuleBase(): Promise<RuleBase> {
    const res = await api.post<RuleBase>('/api/rule-base/generate/')
    return res.data
  },
}
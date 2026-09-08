import { useSleepStore } from '../sleep/sleepStore'
import { getSleepInsight } from '../../shared/utils/insightMapper'

export function useSleepSummary() {
  const { result, details } = useSleepStore()

  if (!result || !details) return null

  return {
    efficiency:      result.predicted_efficiency,
    label:           result.efficiency_label,
    insight:         getSleepInsight(result.efficiency_label),
    sleepDuration:   details.factors_analysis.sleep_duration.value,
    durationEval:    details.factors_analysis.sleep_duration.evaluation,
    awakenings:      details.factors_analysis.awakenings.value,
    awakeningsEval:  details.factors_analysis.awakenings.evaluation,
    caffeineEval:    details.factors_analysis.caffeine.evaluation,
    exerciseEval:    details.factors_analysis.exercise_frequency.evaluation,
    score: (() => {
      if (result.predicted_efficiency >= 80) return 90
      if (result.predicted_efficiency >= 60) return 65
      if (result.predicted_efficiency <= 60) return 55
      return 40
    })(),
  }
}
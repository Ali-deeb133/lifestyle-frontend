import { useSleepStore } from '../sleep/sleepStore'
import { getSleepInsight } from '../../shared/utils/insightMapper'

export function useSleepSummary() {
  const { latest, details } = useSleepStore()

  if (!latest || !details) return null

  return {
    efficiency:      latest.predicted_efficiency,
    label:           latest.efficiency_label,
    insight:         getSleepInsight(latest.efficiency_label),
    sleepDuration:   details.factors_analysis.sleep_duration.value,
    durationEval:    details.factors_analysis.sleep_duration.evaluation,
    awakenings:      details.factors_analysis.awakenings.value,
    awakeningsEval:  details.factors_analysis.awakenings.evaluation,
    caffeineEval:    details.factors_analysis.caffeine.evaluation,
    exerciseEval:    details.factors_analysis.exercise_frequency.evaluation,
    score: (() => {
      if (latest.predicted_efficiency >= 80) return 90
      if (latest.predicted_efficiency >= 60) return 65
      return 55
    })(),
  }
}

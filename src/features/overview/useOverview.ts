

import { useBodySummary }    from './useBodySummary'
import { useSleepSummary }   from './useSleepSummary'
import { useWorkoutSummary } from './useWorkoutSummery'


export function useOverview() {
  const body = useBodySummary()
  const sleep = useSleepSummary()
  const workout = useWorkoutSummary()

  const scores = [body?.score, sleep?.score, workout?.score]
    .filter((s): s is number => s !== null && s !== undefined)

  const healthScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null

  const modules = {
    body: !!body,
    sleep: !!sleep,
    workout: !!workout,
  }

  const completedModules = Object.entries(modules)
    .filter(([ v]) => v)
    .map(([k]) => k)

  return {
    body,
    sleep,
    workout,
    healthScore,
    completedModules,
    modules,
    isComplete: completedModules.length === 3,
  }
}
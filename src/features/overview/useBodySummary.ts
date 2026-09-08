import { useBodyStore } from '../body/bodyStore'
import { getBmiInsight, getSegmentInsight } from '../../shared/utils/insightMapper'

export function useBodySummary() {
  const { metrics, ruleBase } = useBodyStore()

  if (!metrics || !ruleBase) return null

  return {
    bmi:             metrics.bmi,
    bmiCategory:     ruleBase.bmi_category,
    bmiInsight:      getBmiInsight(ruleBase.bmi_category),
    bodyFat:         metrics.body_fat_percentage,
    fatCategory:     ruleBase.bfp_category,
    bmr:             metrics.bmr,
    tdee:            metrics.tdee,
    segment:         ruleBase.segment,
    segmentInsight:  getSegmentInsight(ruleBase.segment),
    metabolicStatus: ruleBase.metabolic_status,
    score: (() => {
      if (ruleBase.bmi_category === 'Normal')      return 90
      if (ruleBase.bmi_category === 'Overweight')  return 65
      if (ruleBase.bmi_category.includes('Obese')) return 50
      return 55
    })(),
  }
}
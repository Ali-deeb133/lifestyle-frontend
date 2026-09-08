export const bmiInsight: Record<string, string> = {
  'Severe Thinness': 'Your weight is significantly below normal',
  'Moderate Thinness': 'Your weight is slightly below normal',
  'Mild Thinness': 'Your weight is slightly below normal',
  'Normal': 'Your weight is within the normal range',
  'Overweight': 'Your weight is slightly above normal',
  'Obese Class I': 'You have a mild amount of excess weight',
  'Obese Class II': 'You have a moderate amount of excess weight',
  'Obese Class III': 'You have a severe amount of excess weight',
}

export const sleepInsight: Record<string, string> = {
  'Excellent sleep efficiency': 'Your sleep efficiency is excellent 🌙',
  'Good sleep efficiency': 'Your sleep efficiency is good',
  'Moderate sleep efficiency': 'Your sleep efficiency is moderate, and can be improved',
  'Poor sleep efficiency': 'Your sleep efficiency is poor, and requires attention',
}

export const segmentInsight: Record<string, string> = {
  'Underweight': 'You are underweight',
  'Normal': 'Your physical fitness is good',
  'Overweight': 'You are slightly overweight',
  'Obese': 'You are obese and should consult a specialist',
}

export function getBmiInsight(category: string): string {
  return bmiInsight[category] ?? category
}

export function getSleepInsight(label: string): string {
  return sleepInsight[label] ?? label
}

export function getSegmentInsight(segment: string): string {
  return segmentInsight[segment] ?? segment
}
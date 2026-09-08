import axios from 'axios'

export function parseSleepError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const data = error.response.data

    if (data.sleep_duration)     return 'Invalid sleep duration'
    if (data.bed_time)           return 'Invalid bed time'
    if (data.exercise_frequency) return 'Invalid exercise frequency'
    if (data.coffee_cups)        return 'Invalid coffee cups count'
    if (data.alcohol_glasses)    return 'Invalid alcohol glasses count'
    if (data.awakenings)         return 'Invalid awakenings count'
  }
  return 'Check the entered data'
}
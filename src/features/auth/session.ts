import { tokenStorage } from '../../shared/api/api'
import { useAuthStore } from './authStore'
import { useBodyStore } from '../body/bodyStore'
import { useSleepStore } from '../sleep/sleepStore'
import { useWorkoutStore } from '../workout/workoutStore'

// مسح بيانات المستخدم المخزنة محلياً (body / sleep / workout)
export function clearFeatureStores(): void {
  useBodyStore.getState().clear()
  useSleepStore.getState().clear()
  useWorkoutStore.getState().clear()
}

// المسار الوحيد لإنهاء الجلسة — يستخدمه زر الخروج وحدث auth:logout
export function resetSession(): void {
  tokenStorage.clearTokens()
  clearFeatureStores()
  useAuthStore.getState().clearUser()
}

export interface ApiResponse<T> {
  status: 'success' | 'warning' | 'error'
  warnings: string[]
  data: T
}

export interface SelectOption {
  value: string
  label: string
}
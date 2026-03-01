export interface ApiError {
  code: string
  message: string
  status?: number
}

export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') {
    return false
  }

  const candidate = error as Partial<ApiError>

  return (
    typeof candidate.code === 'string' &&
    typeof candidate.message === 'string' &&
    (candidate.status === undefined || typeof candidate.status === 'number')
  )
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (isApiError(error)) {
    return error.message
  }

  return fallbackMessage
}

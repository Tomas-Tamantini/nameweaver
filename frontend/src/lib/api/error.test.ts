import { describe, expect, it } from 'vitest'
import type { ApiError } from './error'
import { getApiErrorMessage, isApiError } from './error'

describe('isApiError', () => {
  it('returns true for valid ApiError objects', () => {
    const validError: ApiError = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      status: 400,
    }

    expect(isApiError(validError)).toBe(true)
  })

  it('returns true for ApiError without status', () => {
    const errorWithoutStatus = {
      code: 'UNKNOWN_ERROR',
      message: 'Something went wrong',
    }

    expect(isApiError(errorWithoutStatus)).toBe(true)
  })

  it('returns false for objects missing code', () => {
    const error = {
      message: 'Error message',
      status: 500,
    }

    expect(isApiError(error)).toBe(false)
  })

  it('returns false for objects missing message', () => {
    const error = {
      code: 'ERROR_CODE',
      status: 500,
    }

    expect(isApiError(error)).toBe(false)
  })

  it('returns false for objects with wrong types', () => {
    const errorWithWrongTypes = {
      code: 123, // should be string
      message: 'Error',
      status: 500,
    }

    expect(isApiError(errorWithWrongTypes)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isApiError(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isApiError(undefined)).toBe(false)
  })

  it('returns false for non-objects', () => {
    expect(isApiError('error string')).toBe(false)
    expect(isApiError(42)).toBe(false)
    expect(isApiError(true)).toBe(false)
  })

  it('returns false for arrays', () => {
    expect(isApiError([])).toBe(false)
    expect(isApiError(['error'])).toBe(false)
  })
})

describe('getApiErrorMessage', () => {
  it('returns error message for valid ApiError', () => {
    const error: ApiError = {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      status: 404,
    }

    expect(getApiErrorMessage(error, 'Default message')).toBe(
      'Resource not found',
    )
  })

  it('returns fallback message for non-ApiError objects', () => {
    const error = new Error('Regular error')

    expect(getApiErrorMessage(error, 'Fallback message')).toBe(
      'Fallback message',
    )
  })

  it('returns fallback message for null', () => {
    expect(getApiErrorMessage(null, 'Fallback message')).toBe(
      'Fallback message',
    )
  })

  it('returns fallback message for undefined', () => {
    expect(getApiErrorMessage(undefined, 'Fallback message')).toBe(
      'Fallback message',
    )
  })

  it('returns fallback message for objects missing required fields', () => {
    const invalidError = {
      code: 'ERROR_CODE',
      // missing message field
    }

    expect(getApiErrorMessage(invalidError, 'Fallback message')).toBe(
      'Fallback message',
    )
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './client'
import type { ApiError } from './error'

describe('ApiClient', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    globalThis.fetch = mockFetch
  })

  afterEach(() => {
    mockFetch.mockReset()
  })

  describe('GET requests', () => {
    it('makes a successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      })

      const result = await apiClient.get<typeof mockData>('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      )
      expect(result).toEqual(mockData)
    })

    it('appends query parameters to URL', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ items: [] }),
      })

      await apiClient.get('/people', {
        params: { q: 'test', limit: 10, optional: undefined },
      })

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toBe('http://localhost:8000/people?q=test&limit=10')
    })

    it('includes custom headers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      })

      await apiClient.get('/test', {
        headers: { Authorization: 'Bearer token' },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          }),
        }),
      )
    })
  })

  describe('POST requests', () => {
    it('makes a successful POST request with body', async () => {
      const requestBody = { name: 'John', description: 'Test' }
      const responseData = { id: 1, ...requestBody }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => responseData,
      })

      const result = await apiClient.post<typeof responseData>(
        '/people',
        requestBody,
      )

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/people',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(requestBody),
        }),
      )
      expect(result).toEqual(responseData)
    })

    it('handles POST without body', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      })

      await apiClient.post('/action')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/action',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        }),
      )
    })
  })

  describe('PUT requests', () => {
    it('makes a successful PUT request', async () => {
      const updateData = { name: 'Updated Name' }
      const responseData = { id: 1, ...updateData }

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      })

      const result = await apiClient.put<typeof responseData>(
        '/people/1',
        updateData,
      )

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/people/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        }),
      )
      expect(result).toEqual(responseData)
    })
  })

  describe('DELETE requests', () => {
    it('makes a successful DELETE request', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      })

      const result = await apiClient.delete('/people/1')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/people/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      )
      expect(result).toBeUndefined()
    })

    it('handles DELETE with JSON response', async () => {
      const responseData = { success: true }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      })

      const result = await apiClient.delete<typeof responseData>('/people/1')

      expect(result).toEqual(responseData)
    })
  })

  describe('Error handling', () => {
    it('throws ApiError for FastAPI detail string format', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Validation error' }),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
        message: 'Validation error',
        status: 400,
      } as ApiError)
    })

    it('throws ApiError for FastAPI detail array format', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          detail: [{ loc: ['body', 'name'], msg: 'field required' }],
        }),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
        message: expect.stringContaining('field required'),
        status: 422,
      } as ApiError)
    })

    it('throws ApiError with custom code and message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          code: 'NOT_FOUND',
          message: 'Resource not found',
        }),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Resource not found',
        status: 404,
      } as ApiError)
    })

    it('handles error response with message field', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          message: 'Internal server error',
        }),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        message: 'Internal server error',
        status: 500,
      } as ApiError)
    })

    it('falls back to statusText when JSON parsing fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
        message: 'Internal Server Error',
        status: 500,
      } as ApiError)
    })

    it('uses default message when statusText is empty', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: '',
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        status: 500,
      } as ApiError)
    })

    it('throws PARSE_ERROR when successful response has invalid JSON', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        code: 'PARSE_ERROR',
        message: 'Failed to parse response',
        status: 200,
      } as ApiError)
    })
  })

  describe('204 No Content responses', () => {
    it('returns undefined for 204 responses', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      })

      const result = await apiClient.delete('/people/1')

      expect(result).toBeUndefined()
    })
  })
})

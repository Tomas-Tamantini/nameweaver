import type { ApiError } from './error'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private buildURL(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): string {
    const url = new URL(path, this.baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Try to parse error response
      const errorData: Partial<ApiError> = {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        status: response.status,
      }

      try {
        const data = await response.json()
        if (data.detail) {
          // FastAPI validation error format
          errorData.message =
            typeof data.detail === 'string'
              ? data.detail
              : JSON.stringify(data.detail)
        } else if (data.message) {
          errorData.message = data.message
        }
        if (data.code) {
          errorData.code = data.code
        }
      } catch {
        // If JSON parsing fails, use status text
        errorData.message = response.statusText || errorData.message
      }

      throw errorData as ApiError
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    try {
      return await response.json()
    } catch {
      throw {
        code: 'PARSE_ERROR',
        message: 'Failed to parse response',
        status: response.status,
      } as ApiError
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    return this.handleResponse<T>(response)
  }
}

// Create singleton instance
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const apiClient = new ApiClient(baseURL)

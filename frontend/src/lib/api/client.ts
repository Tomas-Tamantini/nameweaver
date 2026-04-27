import { clearTokens, getTokens, setTokens } from '@/lib/auth/token-store'
import type { ApiError } from './error'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string

  constructor(apiBaseURL: string) {
    this.baseURL = apiBaseURL
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

  private authHeaders(): Record<string, string> {
    const tokens = getTokens()
    if (!tokens) return {}
    return { Authorization: `Bearer ${tokens.accessToken}` }
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

  private async fetchWithAuth(
    url: string,
    init: RequestInit,
  ): Promise<Response> {
    const response = await fetch(url, {
      ...init,
      headers: { ...this.authHeaders(), ...init.headers },
    })

    if (response.status !== 401) {
      return response
    }

    // Attempt silent token refresh
    const tokens = getTokens()
    if (!tokens) {
      window.dispatchEvent(new Event('auth:logout'))
      return response
    }

    try {
      const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: tokens.refreshToken }),
      })

      if (!refreshResponse.ok) throw new Error('Refresh failed')

      const data = await refreshResponse.json()
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      })

      // Replay the original request with the new access token
      return fetch(url, {
        ...init,
        headers: { ...this.authHeaders(), ...init.headers },
      })
    } catch {
      clearTokens()
      window.dispatchEvent(new Event('auth:logout'))
      return response
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await this.fetchWithAuth(url, {
      ...options,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await this.fetchWithAuth(url, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
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
    const response = await this.fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(path, options?.params)
    const response = await this.fetchWithAuth(url, {
      ...options,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient(baseURL)

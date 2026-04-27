import { getApiErrorMessage, isApiError } from '@/lib/api'
import type { TokenPair } from '@/lib/auth/token-store'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface UserResponse {
  id: number
  username: string
  email: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText || 'An unexpected error occurred'
    try {
      const data = await response.json()
      if (data.detail) {
        message =
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail)
      } else if (data.message) {
        message = data.message
      }
    } catch {
      // use status text
    }
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

interface RawTokenResponse {
  access_token: string
  refresh_token: string
}

function toTokenPair(raw: RawTokenResponse): TokenPair {
  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
  }
}

export async function login(
  username: string,
  password: string,
): Promise<TokenPair> {
  const body = new URLSearchParams({ username, password })
  const response = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const raw = await parseResponse<RawTokenResponse>(response)
  return toTokenPair(raw)
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  const response = await fetch(`${baseURL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  const raw = await parseResponse<RawTokenResponse>(response)
  return toTokenPair(raw)
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<UserResponse> {
  const response = await fetch(`${baseURL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  try {
    return await parseResponse<UserResponse>(response)
  } catch (err) {
    if (isApiError(err)) {
      throw new Error(getApiErrorMessage(err, 'Registration failed'))
    }
    throw err
  }
}

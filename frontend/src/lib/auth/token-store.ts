const ACCESS_TOKEN_KEY = 'nw_access_token'
const REFRESH_TOKEN_KEY = 'nw_refresh_token'

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export function getTokens(): TokenPair | null {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!accessToken || !refreshToken) return null
  return { accessToken, refreshToken }
}

export function setTokens(pair: TokenPair): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, pair.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, pair.refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

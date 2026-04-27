import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { TokenPair } from './token-store'
import { clearTokens, getTokens, setTokens } from './token-store'

const PAIR: TokenPair = { accessToken: 'acc', refreshToken: 'ref' }

function clearStorage() {
  localStorage.removeItem('nw_access_token')
  localStorage.removeItem('nw_refresh_token')
}

beforeEach(() => {
  clearStorage()
})

afterEach(() => {
  clearStorage()
})

describe('token-store', () => {
  describe('getTokens', () => {
    it('returns null when nothing is stored', () => {
      expect(getTokens()).toBeNull()
    })

    it('returns null when only access token is stored', () => {
      localStorage.setItem('nw_access_token', 'acc')
      expect(getTokens()).toBeNull()
    })

    it('returns the stored token pair', () => {
      setTokens(PAIR)
      expect(getTokens()).toEqual(PAIR)
    })
  })

  describe('setTokens', () => {
    it('persists both tokens to localStorage', () => {
      setTokens(PAIR)
      expect(localStorage.getItem('nw_access_token')).toBe('acc')
      expect(localStorage.getItem('nw_refresh_token')).toBe('ref')
    })
  })

  describe('clearTokens', () => {
    it('removes both tokens from localStorage', () => {
      setTokens(PAIR)
      clearTokens()
      expect(localStorage.getItem('nw_access_token')).toBeNull()
      expect(localStorage.getItem('nw_refresh_token')).toBeNull()
      expect(getTokens()).toBeNull()
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { login, refreshTokens, register } from './auth-service'

const BASE = 'http://localhost:8000'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const mockFetch = () => vi.mocked(fetch)

function makeResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
    statusText: 'OK',
  } as unknown as Response
}

describe('auth-service', () => {
  describe('login', () => {
    it('POSTs to /auth/login with urlencoded body and returns a token pair', async () => {
      mockFetch().mockResolvedValue(
        makeResponse({ access_token: 'acc', refresh_token: 'ref' }),
      )

      const result = await login('alice', 'secret')

      expect(fetch).toHaveBeenCalledWith(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'username=alice&password=secret',
      })
      expect(result).toEqual({ accessToken: 'acc', refreshToken: 'ref' })
    })

    it('throws an Error with the detail message on failure', async () => {
      mockFetch().mockResolvedValue(
        makeResponse({ detail: 'Invalid credentials' }, 401),
      )

      await expect(login('alice', 'wrong')).rejects.toThrow(
        'Invalid credentials',
      )
    })
  })

  describe('refreshTokens', () => {
    it('POSTs to /auth/refresh with JSON body and returns a token pair', async () => {
      mockFetch().mockResolvedValue(
        makeResponse({ access_token: 'new_acc', refresh_token: 'new_ref' }),
      )

      const result = await refreshTokens('old_ref')

      expect(fetch).toHaveBeenCalledWith(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: 'old_ref' }),
      })
      expect(result).toEqual({
        accessToken: 'new_acc',
        refreshToken: 'new_ref',
      })
    })
  })

  describe('register', () => {
    it('POSTs to /users/ with JSON body', async () => {
      mockFetch().mockResolvedValue(
        makeResponse({ id: 1, username: 'alice', email: 'alice@example.com' }),
      )

      const result = await register('alice', 'alice@example.com', 'secret123')

      expect(fetch).toHaveBeenCalledWith(`${BASE}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'alice',
          email: 'alice@example.com',
          password: 'secret123',
        }),
      })
      expect(result).toEqual({
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
      })
    })

    it('throws on failure', async () => {
      mockFetch().mockResolvedValue(
        makeResponse({ detail: 'Username already taken' }, 400),
      )

      await expect(
        register('alice', 'alice@example.com', 'secret123'),
      ).rejects.toThrow('Username already taken')
    })
  })
})

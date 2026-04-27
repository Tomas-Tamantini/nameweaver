import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as authService from '@/features/auth/services/auth-service'
import { clearTokens, setTokens } from '@/lib/auth/token-store'
import { AuthProvider, useAuth } from './auth-context'

vi.mock('@/features/auth/services/auth-service')

const mockedLogin = vi.mocked(authService.login)
const mockedRegister = vi.mocked(authService.register)

function TestConsumer() {
  const auth = useAuth()
  return (
    <div>
      <p data-testid="authenticated">{String(auth.isAuthenticated)}</p>
      <button onClick={() => auth.login('alice', 'pw')}>login</button>
      <button onClick={() => auth.logout()}>logout</button>
    </div>
  )
}

function renderWithAuth() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  clearTokens()
  vi.clearAllMocks()
})

describe('AuthProvider', () => {
  beforeEach(() => {
    clearTokens()
  })

  it('starts unauthenticated when no tokens in storage', async () => {
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })
  })

  it('starts authenticated when tokens already in storage', async () => {
    setTokens({ accessToken: 'acc', refreshToken: 'ref' })
    renderWithAuth()
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    })
  })

  it('becomes authenticated after successful login', async () => {
    mockedLogin.mockResolvedValue({ accessToken: 'acc', refreshToken: 'ref' })
    renderWithAuth()

    fireEvent.click(screen.getByText('login'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    })
  })

  it('becomes unauthenticated after logout', async () => {
    setTokens({ accessToken: 'acc', refreshToken: 'ref' })
    renderWithAuth()

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true'),
    )

    fireEvent.click(screen.getByText('logout'))

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
  })

  it('becomes unauthenticated when auth:logout event fires', async () => {
    setTokens({ accessToken: 'acc', refreshToken: 'ref' })
    renderWithAuth()

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true'),
    )

    window.dispatchEvent(new Event('auth:logout'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })
  })

  it('throws when useAuth is used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <MemoryRouter>
          <TestConsumer />
        </MemoryRouter>,
      ),
    ).toThrow('useAuth must be used within AuthProvider')
    spy.mockRestore()
  })
})

// suppress unused var
void mockedRegister

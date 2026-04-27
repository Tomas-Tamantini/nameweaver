import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as authContextModule from '@/features/auth/context/auth-context'
import { AppRoutes } from './AppRoutes'

vi.mock('@/features/auth/context/auth-context')

const mockedUseAuth = vi.mocked(authContextModule.useAuth)

function stubAuth(isAuthenticated: boolean) {
  mockedUseAuth.mockReturnValue({
    isAuthenticated,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  })
}

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="current-path">{location.pathname}</p>
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('AppRoutes', () => {
  it('redirects from / to /login when not authenticated', () => {
    stubAuth(false)
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
        <LocationDisplay />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('current-path')).toHaveTextContent('/login')
  })

  it('renders login page at /login', () => {
    stubAuth(false)
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument()
  })

  it('renders register page at /register', () => {
    stubAuth(false)
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /create account/i }),
    ).toBeInTheDocument()
  })

  it('redirects /people to /login when not authenticated', () => {
    stubAuth(false)
    render(
      <MemoryRouter initialEntries={['/people']}>
        <AppRoutes />
        <LocationDisplay />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('current-path')).toHaveTextContent('/login')
  })

  it('renders add person page for /people/new when authenticated', () => {
    stubAuth(true)
    render(
      <MemoryRouter initialEntries={['/people/new']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Add person' }),
    ).toBeInTheDocument()
  })
})

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import * as authContextModule from '@/features/auth/context/auth-context'
import { ProtectedRoute } from './ProtectedRoute'

vi.mock('@/features/auth/context/auth-context')

const mockedUseAuth = vi.mocked(authContextModule.useAuth)

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function renderRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/people" element={<p>People page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    renderRoutes('/people')

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    renderRoutes('/people')

    expect(screen.getByText('People page')).toBeInTheDocument()
  })

  it('renders nothing while loading', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })

    const { container } = renderRoutes('/people')

    expect(container).toBeEmptyDOMElement()
  })
})

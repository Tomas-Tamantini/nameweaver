import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as authContextModule from '@/features/auth/context/auth-context'
import { LoginPage } from './LoginPage'

vi.mock('@/features/auth/context/auth-context')

const mockedUseAuth = vi.mocked(authContextModule.useAuth)

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}</p>
}

function renderPage(initialPath = '/login') {
  const mockLogin = vi.fn()
  mockedUseAuth.mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    login: mockLogin,
    register: vi.fn(),
    logout: vi.fn(),
  })

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/people" element={<p>People page</p>} />
        <Route path="/register" element={<p>Register page</p>} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  )

  return { mockLogin }
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('LoginPage', () => {
  it('renders username and password fields', () => {
    renderPage()
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('calls login and navigates to /people on success', async () => {
    const { mockLogin } = renderPage()
    mockLogin.mockResolvedValue(undefined)

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'alice' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('alice', 'secret')
      expect(screen.getByTestId('location')).toHaveTextContent('/people')
    })
  })

  it('has a link to the register page', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute(
      'href',
      '/register',
    )
  })
})

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
import { RegisterPage } from './RegisterPage'

vi.mock('@/features/auth/context/auth-context')

const mockedUseAuth = vi.mocked(authContextModule.useAuth)

function LocationDisplay() {
  const location = useLocation()
  return <p data-testid="location">{location.pathname}</p>
}

function renderPage() {
  const mockRegister = vi.fn()
  mockedUseAuth.mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: mockRegister,
    logout: vi.fn(),
  })

  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/people" element={<p>People page</p>} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
      <LocationDisplay />
    </MemoryRouter>,
  )

  return { mockRegister }
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('RegisterPage', () => {
  it('renders all fields', () => {
    renderPage()
    expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('shows validation error when passwords do not match', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText(/^username$/i), {
      target: { value: 'alice' },
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'other' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText(/^username$/i), {
      target: { value: 'alice' },
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'abc' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'abc' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Password must be at least 6 characters'),
      ).toBeInTheDocument()
    })
  })

  it('calls register and navigates to /people on success', async () => {
    const { mockRegister } = renderPage()
    mockRegister.mockResolvedValue(undefined)

    fireEvent.change(screen.getByLabelText(/^username$/i), {
      target: { value: 'alice' },
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'secret123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'secret123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'alice',
        'alice@example.com',
        'secret123',
      )
      expect(screen.getByTestId('location')).toHaveTextContent('/people')
    })
  })

  it('has a link to the login page', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/login',
    )
  })
})

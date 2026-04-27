import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import * as authContextModule from '@/features/auth/context/auth-context'
import { App } from './App'

vi.mock('@/features/auth/context/auth-context')

vi.mocked(authContextModule.useAuth).mockReturnValue({
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
})

describe('App', () => {
  it('renders the app header heading', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /nameweaver/i }),
    ).toBeInTheDocument()
  })
})

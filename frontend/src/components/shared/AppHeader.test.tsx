import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import * as authContextModule from '@/features/auth/context/auth-context'
import { AppHeader } from './AppHeader'

vi.mock('@/features/auth/context/auth-context')

vi.mocked(authContextModule.useAuth).mockReturnValue({
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
})

describe('AppHeader', () => {
  it('renders the app name as a link to home', () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /nameweaver/i })).toHaveAttribute(
      'href',
      '/',
    )
  })
})

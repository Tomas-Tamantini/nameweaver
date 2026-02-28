import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import AppHeader from './AppHeader'

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

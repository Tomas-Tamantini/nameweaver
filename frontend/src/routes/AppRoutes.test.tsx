import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import AppRoutes from './AppRoutes'

function LocationDisplay() {
  const location = useLocation()

  return <p data-testid="current-path">{location.pathname}</p>
}

afterEach(() => {
  cleanup()
})

describe('AppRoutes', () => {
  it('redirects from / to /people', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
        <LocationDisplay />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('current-path')).toHaveTextContent('/people')
  })
})

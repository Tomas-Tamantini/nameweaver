import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import NotFoundPage from './NotFoundPage'

function LocationDisplay() {
  const location = useLocation()

  return <p data-testid="current-path">{location.pathname}</p>
}

afterEach(() => {
  cleanup()
})

describe('NotFoundPage', () => {
  it('renders not-found message', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
    expect(
      screen.getByText('The page you are looking for does not exist.'),
    ).toBeInTheDocument()
  })

  it('navigates to home path when clicking the button', () => {
    render(
      <MemoryRouter initialEntries={['/missing-route']}>
        <NotFoundPage />
        <LocationDisplay />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('link', { name: 'Go to home page' }))

    expect(screen.getByTestId('current-path')).toHaveTextContent('/')
  })
})

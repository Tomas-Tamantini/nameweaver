import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import PeopleToolbar from './PeopleToolbar'

afterEach(() => {
  cleanup()
})

describe('PeopleToolbar', () => {
  it('renders a search input', () => {
    render(<PeopleToolbar />)

    expect(
      screen.getByRole('searchbox', { name: 'Search people' }),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Search people by name or note'),
    ).toBeInTheDocument()
  })
})

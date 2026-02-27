import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PeopleToolbar from './PeopleToolbar'

afterEach(() => {
  cleanup()
})

describe('PeopleToolbar', () => {
  it('renders a search input', () => {
    render(<PeopleToolbar value="" onQueryChange={vi.fn()} />)

    expect(
      screen.getByRole('searchbox', { name: 'Search people' }),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Search people by name or note'),
    ).toBeInTheDocument()
  })

  it('calls onQueryChange when typing', () => {
    const handleQueryChange = vi.fn()

    render(<PeopleToolbar value="" onQueryChange={handleQueryChange} />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search people' }), {
      target: { value: 'Ada' },
    })

    expect(handleQueryChange).toHaveBeenCalledWith('Ada')
  })
})

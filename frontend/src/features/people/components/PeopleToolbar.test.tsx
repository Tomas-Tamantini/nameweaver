import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PeopleToolbar from './PeopleToolbar'

const EMPTY_QUERY = { name: '', description: '' }

afterEach(() => {
  cleanup()
})

describe('PeopleToolbar', () => {
  it('renders name and description filter inputs', () => {
    render(<PeopleToolbar query={EMPTY_QUERY} onQueryChange={vi.fn()} />)

    expect(
      screen.getByRole('searchbox', { name: 'Filter by name' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('searchbox', { name: 'Filter by description' }),
    ).toBeInTheDocument()
  })

  it('calls onQueryChange with name update when typing in name input', () => {
    const handleQueryChange = vi.fn()

    render(
      <PeopleToolbar query={EMPTY_QUERY} onQueryChange={handleQueryChange} />,
    )

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Filter by name' }),
      {
        target: { value: 'Ada' },
      },
    )

    expect(handleQueryChange).toHaveBeenCalledWith({ name: 'Ada' })
  })

  it('calls onQueryChange with description update when typing in description input', () => {
    const handleQueryChange = vi.fn()

    render(
      <PeopleToolbar query={EMPTY_QUERY} onQueryChange={handleQueryChange} />,
    )

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Filter by description' }),
      { target: { value: 'mathematician' } },
    )

    expect(handleQueryChange).toHaveBeenCalledWith({
      description: 'mathematician',
    })
  })
})

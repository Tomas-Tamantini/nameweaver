import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PeopleList from './PeopleList'

afterEach(() => {
  cleanup()
})

describe('PeopleList', () => {
  it('renders loading state', () => {
    render(<PeopleList state={{ status: 'loading' }} />)

    expect(screen.getByText('Loading people...')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="card"]').length).toBe(3)
  })

  it('renders error state and retry button when callback is provided', () => {
    const onRetry = vi.fn()

    render(
      <PeopleList
        state={{ status: 'error', message: 'Could not fetch people.' }}
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('Could not fetch people.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders error state without retry button when callback is not provided', () => {
    render(
      <PeopleList
        state={{ status: 'error', message: 'Could not fetch people.' }}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Retry' }),
    ).not.toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<PeopleList state={{ status: 'empty' }} />)

    expect(screen.getByText("There's no one here...")).toBeInTheDocument()
  })

  it('renders people in success state', () => {
    render(
      <PeopleList
        state={{
          status: 'success',
          total: 2,
          people: [
            {
              id: 1,
              name: 'Ada Lovelace',
              description: 'Met at a conference.',
            },
            {
              id: 2,
              name: 'Alan Turing',
              description: 'Discussed algorithms.',
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Met at a conference.')).toBeInTheDocument()
    expect(screen.getByText('Alan Turing')).toBeInTheDocument()
    expect(screen.getByText('Discussed algorithms.')).toBeInTheDocument()
    expect(screen.queryByText(/updated at:/i)).not.toBeInTheDocument()
  })
})

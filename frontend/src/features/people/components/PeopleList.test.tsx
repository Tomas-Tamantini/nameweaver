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

    expect(screen.getByText('No people yet.')).toBeInTheDocument()
  })

  it('renders people in success state', () => {
    render(
      <PeopleList
        state={{
          status: 'success',
          people: [
            {
              id: 1,
              name: 'Ada Lovelace',
              shortDescription: 'Met at a conference.',
              createdAt: '2026-02-21T18:00:00.000Z',
              updatedAt: '2026-02-21T18:00:00.000Z',
            },
            {
              id: 2,
              name: 'Alan Turing',
              shortDescription: 'Discussed algorithms.',
              createdAt: '2026-02-21T18:30:00.000Z',
              updatedAt: '2026-02-21T18:30:00.000Z',
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

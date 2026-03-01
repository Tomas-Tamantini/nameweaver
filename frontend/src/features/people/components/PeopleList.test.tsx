import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildPerson } from '@/test/factories/person'
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
    const personA = buildPerson()
    const personB = buildPerson()

    render(
      <PeopleList
        state={{
          status: 'success',
          total: 2,
          people: [personA, personB],
        }}
      />,
    )

    expect(screen.getByText(personA.name)).toBeInTheDocument()
    expect(screen.getByText(personA.description)).toBeInTheDocument()
    expect(screen.getByText(personB.name)).toBeInTheDocument()
    expect(screen.getByText(personB.description)).toBeInTheDocument()
    expect(screen.queryByText(/updated at:/i)).not.toBeInTheDocument()
  })
})

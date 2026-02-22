import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PeoplePage from './PeoplePage'

import type { Person } from '@/features/people/models/person'

vi.mock('@/features/people/services/people-service', () => ({
  getPeople: vi.fn(),
}))

import { getPeople } from '@/features/people/services/people-service'

const mockedGetPeople = vi.mocked(getPeople)

const ADA: Person = {
  id: 1,
  name: 'Ada Lovelace',
  shortDescription: 'Met at a conference.',
  createdAt: '2026-02-21T18:00:00.000Z',
  updatedAt: '2026-02-21T18:00:00.000Z',
}

const ALAN: Person = {
  id: 2,
  name: 'Alan Turing',
  shortDescription: 'Discussed algorithms.',
  createdAt: '2026-02-21T18:30:00.000Z',
  updatedAt: '2026-02-21T18:30:00.000Z',
}

afterEach(() => {
  mockedGetPeople.mockReset()
  cleanup()
})

describe('PeoplePage', () => {
  it('loads and renders people from the service', async () => {
    const people: Person[] = [ADA]

    mockedGetPeople.mockResolvedValue(people)

    render(<PeoplePage />)

    expect(screen.getByText('Loading people...')).toBeInTheDocument()
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(mockedGetPeople).toHaveBeenCalledTimes(1)
  })

  it('shows an error and retries successfully', async () => {
    const people: Person[] = [ALAN]

    mockedGetPeople.mockRejectedValueOnce(new Error('Network error'))
    mockedGetPeople.mockResolvedValueOnce(people)

    render(<PeoplePage />)

    expect(
      await screen.findByText('Could not fetch people.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(await screen.findByText('Alan Turing')).toBeInTheDocument()
    expect(mockedGetPeople).toHaveBeenCalledTimes(2)
  })
})

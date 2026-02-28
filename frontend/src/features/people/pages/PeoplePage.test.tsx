import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import usePeopleSearch from '@/features/people/hooks/use-people-search'
import PeoplePage from './PeoplePage'

import type { PeopleListState } from '@/features/people/models/people-list-state'
import type { Person } from '@/features/people/models/person'

vi.mock('@/features/people/hooks/use-people-search', () => ({
  default: vi.fn(),
}))

const mockedUsePeopleSearch = vi.mocked(usePeopleSearch)

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

function buildHookResult(
  overrides: {
    query?: string
    state?: PeopleListState
    onQueryChange?: (nextQuery: string) => void
    reloadPeople?: () => Promise<void>
  } = {},
) {
  return {
    query: overrides.query ?? '',
    state: overrides.state ?? { status: 'loading' },
    onQueryChange: overrides.onQueryChange ?? vi.fn(),
    reloadPeople: overrides.reloadPeople ?? vi.fn(async () => {}),
  }
}

afterEach(() => {
  mockedUsePeopleSearch.mockReset()
  cleanup()
})

describe('PeoplePage', () => {
  it('renders search and list content from the hook state', () => {
    mockedUsePeopleSearch.mockReturnValue(
      buildHookResult({ state: { status: 'success', people: [ADA] } }),
    )

    render(
      <MemoryRouter>
        <PeoplePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('searchbox', { name: 'Search people' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add person' })).toHaveAttribute(
      'href',
      '/people/new',
    )
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  })

  it('wires retry button to reloadPeople', () => {
    const reloadPeople = vi.fn(async () => {})
    mockedUsePeopleSearch.mockReturnValue(
      buildHookResult({
        state: { status: 'error', message: 'Could not fetch people.' },
        reloadPeople,
      }),
    )

    render(
      <MemoryRouter>
        <PeoplePage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Could not fetch people.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(reloadPeople).toHaveBeenCalledTimes(1)
  })

  it('wires search input changes to onQueryChange', () => {
    const onQueryChange = vi.fn()
    mockedUsePeopleSearch.mockReturnValue(
      buildHookResult({
        query: '',
        state: { status: 'success', people: [ALAN] },
        onQueryChange,
      }),
    )

    render(
      <MemoryRouter>
        <PeoplePage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search people' }), {
      target: { value: 'Ada' },
    })

    expect(onQueryChange).toHaveBeenCalledWith('Ada')
  })
})

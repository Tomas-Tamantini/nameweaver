import { useCallback, useEffect, useState } from 'react'

import { getPeople } from '@/features/people/services/people-service'

import type { PeopleListState } from '@/features/people/types/people-list-state'

function toPeopleListState(
  response: Awaited<ReturnType<typeof getPeople>>,
): PeopleListState {
  if (response.items.length === 0) {
    return { status: 'empty' }
  }

  return {
    status: 'success',
    total: response.total,
    people: response.items,
  }
}

export type PeopleSearchQuery = {
  name: string
  description: string
}

const EMPTY_QUERY: PeopleSearchQuery = { name: '', description: '' }

type UsePeopleSearchResult = {
  query: PeopleSearchQuery
  state: PeopleListState
  onQueryChange: (updates: Partial<PeopleSearchQuery>) => void
  reloadPeople: () => Promise<void>
}

function usePeopleSearch(): UsePeopleSearchResult {
  const [query, setQuery] = useState<PeopleSearchQuery>(EMPTY_QUERY)
  const [debouncedQuery, setDebouncedQuery] =
    useState<PeopleSearchQuery>(EMPTY_QUERY)
  const [state, setState] = useState<PeopleListState>({ status: 'loading' })

  const onQueryChange = useCallback((updates: Partial<PeopleSearchQuery>) => {
    setQuery((prev) => ({ ...prev, ...updates }))
    setState({ status: 'loading' })
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery({ name: query.name, description: query.description })
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [query.name, query.description])

  useEffect(() => {
    let isActive = true

    const params = {
      ...(debouncedQuery.name && { name: debouncedQuery.name }),
      ...(debouncedQuery.description && {
        description: debouncedQuery.description,
      }),
    }

    void getPeople(params)
      .then((people) => {
        if (!isActive) {
          return
        }

        setState(toPeopleListState(people))
      })
      .catch(() => {
        if (!isActive) {
          return
        }

        setState({ status: 'error', message: 'Could not fetch people.' })
      })

    return () => {
      isActive = false
    }
  }, [debouncedQuery.name, debouncedQuery.description])

  const reloadPeople = useCallback(async () => {
    setState({ status: 'loading' })

    const params = {
      ...(debouncedQuery.name && { name: debouncedQuery.name }),
      ...(debouncedQuery.description && {
        description: debouncedQuery.description,
      }),
    }

    try {
      const people = await getPeople(params)
      setState(toPeopleListState(people))
    } catch {
      setState({ status: 'error', message: 'Could not fetch people.' })
    }
  }, [debouncedQuery.name, debouncedQuery.description])

  return {
    query,
    state,
    onQueryChange,
    reloadPeople,
  }
}

export { usePeopleSearch }

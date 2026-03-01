import { useCallback, useEffect, useState } from 'react'

import { getPeople } from '@/features/people/services/people-service'

import type { PeopleListState } from '@/features/people/models/people-list-state'

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

type UsePeopleSearchResult = {
  query: string
  state: PeopleListState
  onQueryChange: (nextQuery: string) => void
  reloadPeople: () => Promise<void>
}

function usePeopleSearch(): UsePeopleSearchResult {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [state, setState] = useState<PeopleListState>({ status: 'loading' })

  const onQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery)
    setState({ status: 'loading' })
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query)
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [query])

  useEffect(() => {
    let isActive = true

    void getPeople({ q: debouncedQuery })
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
  }, [debouncedQuery])

  const reloadPeople = useCallback(async () => {
    setState({ status: 'loading' })

    try {
      const people = await getPeople({ q: debouncedQuery })
      setState(toPeopleListState(people))
    } catch {
      setState({ status: 'error', message: 'Could not fetch people.' })
    }
  }, [debouncedQuery])

  return {
    query,
    state,
    onQueryChange,
    reloadPeople,
  }
}

export default usePeopleSearch

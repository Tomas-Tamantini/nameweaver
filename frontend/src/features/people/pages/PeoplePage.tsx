import { useCallback, useEffect, useState } from 'react'

import PeopleList from '@/features/people/components/PeopleList'
import PeopleToolbar from '@/features/people/components/PeopleToolbar'
import { getPeople } from '@/features/people/services/people-service'

import type { PeopleListState } from '@/features/people/models/people-list-state'

function toPeopleListState(
  people: Awaited<ReturnType<typeof getPeople>>,
): PeopleListState {
  if (people.length === 0) {
    return { status: 'empty' }
  }

  return {
    status: 'success',
    people,
  }
}

function PeoplePage() {
  const [state, setState] = useState<PeopleListState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    void getPeople()
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
  }, [])

  const loadPeople = useCallback(async () => {
    setState({ status: 'loading' })

    try {
      const people = await getPeople()
      setState(toPeopleListState(people))
    } catch {
      setState({ status: 'error', message: 'Could not fetch people.' })
    }
  }, [])

  return (
    <section className="space-y-4" aria-label="People page">
      <PeopleToolbar />
      <PeopleList state={state} onRetry={loadPeople} />
    </section>
  )
}

export default PeoplePage

import PeopleList from '@/features/people/components/PeopleList'

import type { PeopleListState } from '@/features/people/models/people-list-state'

const demoPeopleState: PeopleListState = {
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
}

function PeoplePage() {
  return <PeopleList state={demoPeopleState} />
}

export default PeoplePage

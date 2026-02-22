import type { Person } from '../models/person'

export type GetPeopleQuery = {
  q?: string
}

const MOCK_PEOPLE: Person[] = [
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
  {
    id: 3,
    name: 'Grace Hopper',
    shortDescription: 'Former colleague from compiler project.',
    createdAt: '2026-02-21T19:00:00.000Z',
    updatedAt: '2026-02-21T19:00:00.000Z',
  },
]

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export async function getPeople(query: GetPeopleQuery = {}) {
  await wait(150)

  const searchText = query.q?.trim().toLowerCase()

  if (!searchText) {
    return [...MOCK_PEOPLE]
  }

  return MOCK_PEOPLE.filter((person) => {
    const name = person.name.toLowerCase()
    const description = person.shortDescription.toLowerCase()

    return name.includes(searchText) || description.includes(searchText)
  })
}

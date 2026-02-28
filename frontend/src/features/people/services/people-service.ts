import type { CreatePersonRequest, Person } from '../models/person'

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
  // TODO: Replace with real API call
  // TODO: Remove console.log
  console.log('Fetching people with query:', query)
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

export async function createPerson(input: CreatePersonRequest) {
  // TODO: Replace with real API call
  await wait(150)

  const now = new Date().toISOString()
  const nextId =
    MOCK_PEOPLE.length > 0
      ? Math.max(...MOCK_PEOPLE.map((person) => person.id)) + 1
      : 1

  const newPerson: Person = {
    id: nextId,
    name: input.name.trim(),
    shortDescription: input.shortDescription.trim(),
    createdAt: now,
    updatedAt: now,
  }

  MOCK_PEOPLE.push(newPerson)

  return { ...newPerson }
}

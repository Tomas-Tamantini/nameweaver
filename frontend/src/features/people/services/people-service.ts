import type { PaginatedResponse } from '@/lib/pagination'
import type { CreatePersonRequest, Person } from '../models/person'

export type GetPeopleQuery = {
  q?: string
}

const MOCK_PEOPLE: Person[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    description: 'Met at a conference.',
  },
  {
    id: 2,
    name: 'Alan Turing',
    description: 'Discussed algorithms.',
  },
  {
    id: 3,
    name: 'Grace Hopper',
    description: 'Former colleague from compiler project.',
  },
]

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

export async function getPeople(
  query: GetPeopleQuery = {},
): Promise<PaginatedResponse<Person>> {
  // TODO: Replace with real API call
  await wait(150)

  const searchText = query.q?.trim().toLowerCase()

  const filtered = !searchText
    ? [...MOCK_PEOPLE]
    : MOCK_PEOPLE.filter((person) => {
        const name = person.name.toLowerCase()
        const description = person.description.toLowerCase()

        return name.includes(searchText) || description.includes(searchText)
      })

  return { total: filtered.length, items: filtered }
}

export async function createPerson(input: CreatePersonRequest) {
  // TODO: Replace with real API call
  await wait(150)

  const nextId =
    MOCK_PEOPLE.length > 0
      ? Math.max(...MOCK_PEOPLE.map((person) => person.id)) + 1
      : 1

  const newPerson: Person = {
    id: nextId,
    name: input.name.trim(),
    description: input.description.trim(),
  }

  MOCK_PEOPLE.push(newPerson)

  return { ...newPerson }
}

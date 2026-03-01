import type { Person } from '@/features/people/models/person'

let sequence = 0

export function resetPersonSequence(): void {
  sequence = 0
}

export function buildPerson(overrides: Partial<Person> = {}): Person {
  const n = ++sequence
  return {
    id: n,
    name: `Person ${n}`,
    description: `Description ${n}`,
    ...overrides,
  }
}

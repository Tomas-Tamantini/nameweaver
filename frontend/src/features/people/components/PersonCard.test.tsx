import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { buildPerson } from '@/test/factories/person'
import PersonCard from './PersonCard'

afterEach(() => {
  cleanup()
})

describe('PersonCard', () => {
  it('renders person name and short description', () => {
    const person = buildPerson()

    render(<PersonCard person={person} />)

    expect(screen.getByText(person.name)).toBeInTheDocument()
    expect(screen.getByText(person.description)).toBeInTheDocument()
  })
})

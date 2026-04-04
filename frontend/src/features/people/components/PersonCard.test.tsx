import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildPerson } from '@/test-utils/factories/person'
import { PersonCard } from './PersonCard'

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

  it('does not render delete button when onDelete is not provided', () => {
    const person = buildPerson()

    render(<PersonCard person={person} />)

    expect(
      screen.queryByRole('button', { name: `Delete ${person.name}` }),
    ).not.toBeInTheDocument()
  })

  it('renders delete button when onDelete is provided', () => {
    const person = buildPerson()

    render(<PersonCard person={person} onDelete={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: `Delete ${person.name}` }),
    ).toBeInTheDocument()
  })

  it('calls onDelete with person id when delete button is clicked', () => {
    const person = buildPerson()
    const onDelete = vi.fn()

    render(<PersonCard person={person} onDelete={onDelete} />)

    fireEvent.click(
      screen.getByRole('button', { name: `Delete ${person.name}` }),
    )

    expect(onDelete).toHaveBeenCalledWith(person.id)
    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})

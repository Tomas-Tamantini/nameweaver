import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import PersonCard from './PersonCard'

afterEach(() => {
  cleanup()
})

describe('PersonCard', () => {
  it('renders person name and short description', () => {
    render(
      <PersonCard
        person={{
          id: 1,
          name: 'Ada Lovelace',
          shortDescription: 'Met at a conference.',
          createdAt: '2026-02-21T18:00:00.000Z',
          updatedAt: '2026-02-21T18:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Met at a conference.')).toBeInTheDocument()
  })
})

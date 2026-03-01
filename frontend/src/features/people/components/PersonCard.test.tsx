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
          description: 'Met at a conference.',
        }}
      />,
    )

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Met at a conference.')).toBeInTheDocument()
  })
})

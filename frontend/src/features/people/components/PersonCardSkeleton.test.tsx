import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import PersonCardSkeleton from './PersonCardSkeleton'

afterEach(() => {
  cleanup()
})

describe('PersonCardSkeleton', () => {
  it('renders loading label for accessibility', () => {
    render(<PersonCardSkeleton />)

    expect(screen.getByText('Loading people...')).toBeInTheDocument()
  })
})

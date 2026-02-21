import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import AppHeader from './AppHeader'

describe('AppHeader', () => {
  it('renders the app name heading', () => {
    render(<AppHeader />)

    expect(
      screen.getByRole('heading', { level: 1, name: /nameweaver/i }),
    ).toBeInTheDocument()
  })
})

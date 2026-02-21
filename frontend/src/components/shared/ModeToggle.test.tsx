import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ModeToggle } from './ModeToggle'

const mockSetTheme = vi.fn()

vi.mock('@/providers/theme', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}))

describe('ModeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('changes theme when selecting a dropdown option', () => {
    render(<ModeToggle />)

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })

    fireEvent.pointerDown(toggleButton)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Light' }))
    expect(mockSetTheme).toHaveBeenLastCalledWith('light')

    fireEvent.pointerDown(toggleButton)
    fireEvent.click(screen.getByRole('menuitem', { name: 'Dark' }))
    expect(mockSetTheme).toHaveBeenLastCalledWith('dark')

    fireEvent.pointerDown(toggleButton)
    fireEvent.click(screen.getByRole('menuitem', { name: 'System' }))
    expect(mockSetTheme).toHaveBeenLastCalledWith('system')

    expect(mockSetTheme).toHaveBeenCalledTimes(3)
  })
})

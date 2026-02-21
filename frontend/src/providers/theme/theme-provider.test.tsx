import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from './theme-provider'
import { useTheme } from './use-theme'

function mockLocalStorage() {
  const storage = new Map<string, string>()

  Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value)
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key)
      }),
      clear: vi.fn(() => {
        storage.clear()
      }),
    },
  })
}

function ThemeProbe() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set dark</button>
      <button onClick={() => setTheme('system')}>Set system</button>
    </>
  )
}

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    mockLocalStorage()
    window.localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
  })

  it('uses system theme by default and applies light class when system is light', async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('system')

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('light')
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })

  it('reads initial theme from localStorage', async () => {
    window.localStorage.setItem('vite-ui-theme', 'dark')

    render(
      <ThemeProvider defaultTheme="light">
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
      expect(document.documentElement).not.toHaveClass('light')
    })
  })

  it('persists theme changes and updates document classes', async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /set dark/i }))

    expect(window.localStorage.getItem('vite-ui-theme')).toBe('dark')

    await waitFor(() => {
      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
      expect(document.documentElement).toHaveClass('dark')
      expect(document.documentElement).not.toHaveClass('light')
    })

    fireEvent.click(screen.getByRole('button', { name: /set system/i }))

    expect(window.localStorage.getItem('vite-ui-theme')).toBe('system')

    await waitFor(() => {
      expect(screen.getByTestId('theme-value')).toHaveTextContent('system')
      expect(document.documentElement).toHaveClass('light')
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })
})

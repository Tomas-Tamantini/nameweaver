import '@testing-library/jest-dom/vitest'
import { beforeEach, vi } from 'vitest'
import { resetPersonSequence } from './factories/person'

// jsdom 28 requires a valid --localstorage-file path; provide an in-memory mock instead.
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
})()

vi.stubGlobal('localStorage', localStorageMock)

beforeEach(() => {
  localStorageMock.clear()
  resetPersonSequence()
})

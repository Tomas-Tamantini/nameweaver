import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildPerson } from '@/test/factories/person'
import usePeopleSearch from './use-people-search'

import type { Person } from '@/features/people/models/person'

vi.mock('@/features/people/services/people-service', () => ({
  getPeople: vi.fn(),
}))

import { getPeople } from '@/features/people/services/people-service'

const mockedGetPeople = vi.mocked(getPeople)

const ADA = buildPerson()
const ALAN = buildPerson()

function createDeferred<T>() {
  let resolvePromise: (value: T | PromiseLike<T>) => void = () => {}
  let rejectPromise: (reason?: unknown) => void = () => {}

  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  }
}

afterEach(() => {
  vi.useRealTimers()
  mockedGetPeople.mockReset()
})

describe('usePeopleSearch', () => {
  it('loads people on mount', async () => {
    mockedGetPeople.mockResolvedValue({ total: 1, items: [ADA] })

    const { result } = renderHook(() => usePeopleSearch())

    expect(result.current.state.status).toBe('loading')

    await waitFor(() => {
      expect(result.current.state.status).toBe('success')
    })

    expect(mockedGetPeople).toHaveBeenCalledTimes(1)
    expect(mockedGetPeople).toHaveBeenCalledWith({ q: '' })
  })

  it('sets empty state when service returns no people', async () => {
    mockedGetPeople.mockResolvedValue({ total: 0, items: [] })

    const { result } = renderHook(() => usePeopleSearch())

    await waitFor(() => {
      expect(result.current.state.status).toBe('empty')
    })
  })

  it('searches using a debounced query', async () => {
    mockedGetPeople.mockResolvedValue({ total: 1, items: [ADA] })

    const { result } = renderHook(() => usePeopleSearch())

    await waitFor(() => {
      expect(mockedGetPeople).toHaveBeenCalledTimes(1)
    })

    act(() => {
      result.current.onQueryChange('Ada')
    })

    expect(result.current.query).toBe('Ada')
    expect(result.current.state.status).toBe('loading')
    expect(mockedGetPeople).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(mockedGetPeople).toHaveBeenCalledTimes(2)
    })

    expect(mockedGetPeople).toHaveBeenNthCalledWith(2, { q: 'Ada' })
  })

  it('sets error state and reloads successfully', async () => {
    mockedGetPeople.mockRejectedValueOnce(new Error('Network error'))
    mockedGetPeople.mockResolvedValueOnce({ total: 1, items: [ADA] })

    const { result } = renderHook(() => usePeopleSearch())

    await waitFor(() => {
      expect(result.current.state).toEqual({
        status: 'error',
        message: 'Could not fetch people.',
      })
    })

    await act(async () => {
      await result.current.reloadPeople()
    })

    expect(result.current.state.status).toBe('success')
    expect(mockedGetPeople).toHaveBeenCalledTimes(2)
    expect(mockedGetPeople).toHaveBeenNthCalledWith(1, { q: '' })
    expect(mockedGetPeople).toHaveBeenNthCalledWith(2, { q: '' })
  })

  it('ignores stale responses from previous queries', async () => {
    const firstRequest = createDeferred<{ total: number; items: Person[] }>()
    const secondRequest = createDeferred<{ total: number; items: Person[] }>()

    mockedGetPeople
      .mockImplementationOnce(() => firstRequest.promise)
      .mockImplementationOnce(() => secondRequest.promise)

    const { result } = renderHook(() => usePeopleSearch())

    act(() => {
      result.current.onQueryChange('Alan')
    })

    await waitFor(() => {
      expect(mockedGetPeople).toHaveBeenCalledTimes(2)
    })

    await act(async () => {
      firstRequest.resolve({ total: 1, items: [ADA] })
      await Promise.resolve()
    })

    expect(result.current.state.status).toBe('loading')

    await act(async () => {
      secondRequest.resolve({ total: 1, items: [ALAN] })
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(result.current.state).toEqual({
        status: 'success',
        total: 1,
        people: [ALAN],
      })
    })
  })

  it('reloads with the current debounced query', async () => {
    mockedGetPeople
      .mockResolvedValueOnce({ total: 1, items: [ADA] })
      .mockResolvedValueOnce({ total: 1, items: [ALAN] })
      .mockResolvedValueOnce({ total: 1, items: [ALAN] })

    const { result } = renderHook(() => usePeopleSearch())

    await waitFor(() => {
      expect(mockedGetPeople).toHaveBeenCalledTimes(1)
    })

    act(() => {
      result.current.onQueryChange('Alan')
    })

    await waitFor(() => {
      expect(mockedGetPeople).toHaveBeenCalledTimes(2)
    })

    await act(async () => {
      await result.current.reloadPeople()
    })

    expect(mockedGetPeople).toHaveBeenCalledTimes(3)
    expect(mockedGetPeople).toHaveBeenNthCalledWith(2, { q: 'Alan' })
    expect(mockedGetPeople).toHaveBeenNthCalledWith(3, { q: 'Alan' })
  })
})

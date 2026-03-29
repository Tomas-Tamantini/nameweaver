import { apiClient } from '@/lib/api'
import type { PaginatedResponse } from '@/lib/pagination'
import { buildPerson } from '@/test/factories/person'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Person } from '../models/person'
import { createPerson, getPeople } from './people-service'

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const mockedApiClient = vi.mocked(apiClient)

describe('people-service', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getPeople', () => {
    it('calls apiClient.get with correct endpoint and no params', async () => {
      const mockResponse: PaginatedResponse<Person> = {
        total: 2,
        items: [buildPerson(), buildPerson()],
      }
      mockedApiClient.get.mockResolvedValue(mockResponse)

      const result = await getPeople()

      expect(apiClient.get).toHaveBeenCalledWith('/people/', {
        params: {},
      })
      expect(result).toEqual(mockResponse)
    })

    it('calls apiClient.get with name filter parameter', async () => {
      const mockResponse: PaginatedResponse<Person> = {
        total: 1,
        items: [buildPerson({ name: 'Ada Lovelace' })],
      }
      mockedApiClient.get.mockResolvedValue(mockResponse)

      const result = await getPeople({ name: 'Ada' })

      expect(apiClient.get).toHaveBeenCalledWith('/people/', {
        params: { name: 'Ada' },
      })
      expect(result).toEqual(mockResponse)
    })

    it('calls apiClient.get with description filter parameter', async () => {
      const mockResponse: PaginatedResponse<Person> = {
        total: 1,
        items: [buildPerson({ description: 'mathematician' })],
      }
      mockedApiClient.get.mockResolvedValue(mockResponse)

      const result = await getPeople({ description: 'mathematician' })

      expect(apiClient.get).toHaveBeenCalledWith('/people/', {
        params: { description: 'mathematician' },
      })
      expect(result).toEqual(mockResponse)
    })

    it('returns empty result when no people match', async () => {
      const mockResponse: PaginatedResponse<Person> = {
        total: 0,
        items: [],
      }
      mockedApiClient.get.mockResolvedValue(mockResponse)

      const result = await getPeople({ name: 'nonexistent' })

      expect(result.total).toBe(0)
      expect(result.items).toHaveLength(0)
    })

    it('propagates errors from apiClient', async () => {
      const error = {
        code: 'NETWORK_ERROR',
        message: 'Failed to fetch',
        status: 500,
      }
      mockedApiClient.get.mockRejectedValue(error)

      await expect(getPeople()).rejects.toEqual(error)
    })
  })

  describe('createPerson', () => {
    it('calls apiClient.post with correct endpoint and payload', async () => {
      const input = {
        name: 'Alan Turing',
        description: 'Computer scientist',
      }
      const mockResponse: Person = {
        id: 123,
        ...input,
      }
      mockedApiClient.post.mockResolvedValue(mockResponse)

      const result = await createPerson(input)

      expect(apiClient.post).toHaveBeenCalledWith('/people/', input)
      expect(result).toEqual(mockResponse)
    })

    it('returns the created person with generated id', async () => {
      const input = {
        name: 'Grace Hopper',
        description: 'Pioneer of computer programming',
      }
      const mockResponse: Person = {
        id: 456,
        ...input,
      }
      mockedApiClient.post.mockResolvedValue(mockResponse)

      const result = await createPerson(input)

      expect(result.id).toBe(456)
      expect(result.name).toBe(input.name)
      expect(result.description).toBe(input.description)
    })

    it('propagates errors from apiClient', async () => {
      const input = {
        name: 'Test',
        description: 'Test',
      }
      const error = {
        code: 'VALIDATION_ERROR',
        message: 'Name is required',
        status: 400,
      }
      mockedApiClient.post.mockRejectedValue(error)

      await expect(createPerson(input)).rejects.toEqual(error)
    })
  })
})

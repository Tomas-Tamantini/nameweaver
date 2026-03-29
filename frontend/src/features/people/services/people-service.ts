import { apiClient } from '@/lib/api'
import type { PaginatedResponse } from '@/lib/pagination'
import type { CreatePersonRequest, Person } from '../models/person'

const BASE_URL = '/people/'

export type GetPeopleQuery = {
  name?: string
  description?: string
}

export async function getPeople(
  query: GetPeopleQuery = {},
): Promise<PaginatedResponse<Person>> {
  return apiClient.get<PaginatedResponse<Person>>(BASE_URL, {
    params: query,
  })
}

export async function createPerson(
  input: CreatePersonRequest,
): Promise<Person> {
  return apiClient.post<Person>(BASE_URL, input)
}

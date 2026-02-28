export interface Person {
  id: number
  name: string
  shortDescription: string
  createdAt: string
  updatedAt: string
}

export interface CreatePersonRequest {
  name: string
  shortDescription: string
}

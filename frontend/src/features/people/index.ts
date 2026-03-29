// Pages
export { AddPersonPage } from './pages/AddPersonPage'
export { PeoplePage } from './pages/PeoplePage'

// Models
export type { PeopleListState } from './types/people-list-state'
export type { CreatePersonRequest, Person } from './types/person'

// Services
export { createPerson, getPeople } from './services/people-service'
export type { GetPeopleQuery } from './services/people-service'

// Hooks
export { usePeopleSearch } from './hooks/use-people-search'
export type { PeopleSearchQuery } from './hooks/use-people-search'

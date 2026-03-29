// Pages
export { default as AddPersonPage } from './pages/AddPersonPage'
export { default as PeoplePage } from './pages/PeoplePage'

// Models
export type { PeopleListState } from './models/people-list-state'
export type { CreatePersonRequest, Person } from './models/person'

// Services
export { createPerson, getPeople } from './services/people-service'
export type { GetPeopleQuery } from './services/people-service'

// Hooks
export { default as usePeopleSearch } from './hooks/use-people-search'
export type { PeopleSearchQuery } from './hooks/use-people-search'

import type { Person } from './person'

export type PeopleListState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      message: string
    }
  | {
      status: 'empty'
    }
  | {
      status: 'success'
      people: Person[]
    }

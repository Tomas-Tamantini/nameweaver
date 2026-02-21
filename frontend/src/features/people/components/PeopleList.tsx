import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { PeopleListState } from '../models/people-list-state'

type PeopleListProps = {
  state: PeopleListState
  onRetry?: () => void
}

function PeopleList({ state, onRetry }: PeopleListProps) {
  if (state.status === 'loading') {
    return (
      <section className="mx-auto w-full max-w-2xl p-6" aria-live="polite">
        <p>Loading people...</p>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="mx-auto w-full max-w-2xl p-6" aria-live="polite">
        <p>{state.message}</p>
        {onRetry ? (
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={onRetry}
          >
            Retry
          </Button>
        ) : null}
      </section>
    )
  }

  if (state.status === 'empty') {
    return (
      <section className="mx-auto w-full max-w-2xl p-6" aria-live="polite">
        <p>No people yet.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-2xl p-6" aria-live="polite">
      <div className="space-y-3">
        {state.people.map((person) => (
          <Card key={person.id}>
            <CardHeader>
              <CardTitle>{person.name}</CardTitle>
              <CardDescription>{person.shortDescription}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default PeopleList

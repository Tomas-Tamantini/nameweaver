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
        <div className="rounded-lg border bg-card p-4 text-foreground shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Loading people...
          </p>
          <div className="mt-4 space-y-2" aria-hidden="true">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>
    )
  }

  if (state.status === 'error') {
    return (
      <section className="mx-auto w-full max-w-2xl p-6" aria-live="polite">
        <div className="rounded-lg border bg-card p-4 text-foreground shadow-sm">
          <p className="text-sm font-medium text-foreground">{state.message}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
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
        <div className="rounded-lg border border-dashed bg-card p-4 text-foreground shadow-sm">
          <p className="text-sm font-medium text-foreground">No people yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No people match the current view.
          </p>
        </div>
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

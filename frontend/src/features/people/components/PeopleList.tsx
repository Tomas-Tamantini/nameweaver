import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { BugIcon } from 'lucide-react'
import type { PeopleListState } from '../models/people-list-state'

type PeopleListProps = {
  state: PeopleListState
  onRetry?: () => void
}

function PeopleList({ state, onRetry }: PeopleListProps) {
  if (state.status === 'loading') {
    return (
      <Card className="w-full max-w-xs">
        <CardHeader>
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      </Card>
    )
  }

  if (state.status === 'error') {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BugIcon />
          </EmptyMedia>
          <EmptyTitle>Uh oh...</EmptyTitle>
          <EmptyDescription>{state.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  if (state.status === 'empty') {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>There's no one here...</EmptyTitle>
          <EmptyDescription>No people match the current view.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
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
  )
}

export default PeopleList

import { Button } from '@/components/ui/button'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { BugIcon } from 'lucide-react'
import type { PeopleListState } from '../models/people-list-state'
import PersonCard from './PersonCard'
import PersonCardSkeleton from './PersonCardSkeleton'

type PeopleListProps = {
  state: PeopleListState
  onRetry?: () => void
}

function PeopleList({ state, onRetry }: PeopleListProps) {
  if (state.status === 'loading') {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => (
          <PersonCardSkeleton key={index} showLoadingLabel={index === 0} />
        ))}
      </div>
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
        {onRetry ? (
          <EmptyContent>
            <Button variant="outline" onClick={onRetry}>
              Retry
            </Button>
          </EmptyContent>
        ) : null}
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
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  )
}

export default PeopleList

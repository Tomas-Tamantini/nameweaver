import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Trash2Icon } from 'lucide-react'

import type { Person } from '@/features/people/types/person'

type PersonCardProps = {
  person: Person
  onDelete?: (id: number) => void
}

function PersonCard({ person, onDelete }: PersonCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <div className="space-y-1.5">
          <CardTitle>{person.name}</CardTitle>
          <CardDescription>{person.description}</CardDescription>
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${person.name}`}
            onClick={() => onDelete(person.id)}
          >
            <Trash2Icon className="size-4" />
          </Button>
        )}
      </CardHeader>
    </Card>
  )
}

export { PersonCard }

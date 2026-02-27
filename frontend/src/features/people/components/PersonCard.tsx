import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { Person } from '@/features/people/models/person'

type PersonCardProps = {
  person: Person
}

function PersonCard({ person }: PersonCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{person.name}</CardTitle>
        <CardDescription>{person.shortDescription}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default PersonCard

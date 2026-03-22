import { Input } from '@/components/ui/input'
import type { PeopleSearchQuery } from '@/features/people/hooks/use-people-search'

type PeopleToolbarProps = {
  query: PeopleSearchQuery
  onQueryChange: (updates: Partial<PeopleSearchQuery>) => void
}

function PeopleToolbar({ query, onQueryChange }: PeopleToolbarProps) {
  return (
    <section aria-label="People toolbar" className="flex gap-2">
      <Input
        type="search"
        placeholder="Filter by name"
        aria-label="Filter by name"
        className="h-12"
        value={query.name}
        onChange={(event) => {
          onQueryChange({ name: event.target.value })
        }}
      />
      <Input
        type="search"
        placeholder="Filter by description"
        aria-label="Filter by description"
        className="h-12"
        value={query.description}
        onChange={(event) => {
          onQueryChange({ description: event.target.value })
        }}
      />
    </section>
  )
}

export default PeopleToolbar

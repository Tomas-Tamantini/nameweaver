import { Button } from '@/components/ui/button'
import PeopleList from '@/features/people/components/PeopleList'
import PeopleToolbar from '@/features/people/components/PeopleToolbar'
import usePeopleSearch from '@/features/people/hooks/use-people-search'
import { Link } from 'react-router-dom'

function PeoplePage() {
  const { query, state, onQueryChange, reloadPeople } = usePeopleSearch()

  return (
    <section className="space-y-4" aria-label="People page">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">People</h1>
        <Button asChild className="shrink-0">
          <Link to="/people/new">Add person</Link>
        </Button>
      </header>
      <PeopleToolbar value={query} onQueryChange={onQueryChange} />
      <PeopleList state={state} onRetry={reloadPeople} />
    </section>
  )
}

export default PeoplePage

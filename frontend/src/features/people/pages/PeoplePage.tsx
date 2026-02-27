import PeopleList from '@/features/people/components/PeopleList'
import PeopleToolbar from '@/features/people/components/PeopleToolbar'
import usePeopleSearch from '@/features/people/hooks/use-people-search'

function PeoplePage() {
  const { query, state, onQueryChange, reloadPeople } = usePeopleSearch()

  return (
    <section className="space-y-4" aria-label="People page">
      <PeopleToolbar value={query} onQueryChange={onQueryChange} />
      <PeopleList state={state} onRetry={reloadPeople} />
    </section>
  )
}

export default PeoplePage

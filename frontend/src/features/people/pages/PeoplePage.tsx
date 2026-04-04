import { Button } from '@/components/ui/button'
import { PeopleList } from '@/features/people/components/PeopleList'
import { PeopleToolbar } from '@/features/people/components/PeopleToolbar'
import { usePeopleSearch } from '@/features/people/hooks/use-people-search'
import { deletePerson } from '@/features/people/services/people-service'
import { getApiErrorMessage } from '@/lib/api'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

function PeoplePage() {
  const { query, state, onQueryChange, reloadPeople } = usePeopleSearch()

  async function handleDeletePerson(id: number) {
    try {
      await deletePerson(id)
      toast.success('Person deleted')
      await reloadPeople()
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Could not delete person. Please try again.'),
      )
    }
  }

  return (
    <section className="space-y-4" aria-label="People page">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">People</h1>
        <Button asChild className="shrink-0">
          <Link to="/people/new">Add person</Link>
        </Button>
      </header>
      <div className="space-y-1">
        <PeopleToolbar query={query} onQueryChange={onQueryChange} />
        {state.status === 'success' && (
          <p className="text-right text-sm text-muted-foreground">
            {state.total}/{state.people.length}
            {state.total === 1 ? 'person' : 'people'}
          </p>
        )}
      </div>
      <PeopleList
        state={state}
        onRetry={reloadPeople}
        onDeletePerson={handleDeletePerson}
      />
    </section>
  )
}

export { PeoplePage }

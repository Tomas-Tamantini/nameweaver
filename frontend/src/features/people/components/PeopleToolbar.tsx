import { Input } from '@/components/ui/input'

function PeopleToolbar() {
  return (
    <section aria-label="People toolbar">
      <Input
        type="search"
        placeholder="Search people by name or note"
        aria-label="Search people"
        className="h-12"
      />
    </section>
  )
}

export default PeopleToolbar

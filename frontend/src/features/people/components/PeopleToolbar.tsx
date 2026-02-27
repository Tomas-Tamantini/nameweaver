import { Input } from '@/components/ui/input'

type PeopleToolbarProps = {
  value: string
  onQueryChange: (nextQuery: string) => void
}

function PeopleToolbar({ value, onQueryChange }: PeopleToolbarProps) {
  return (
    <section aria-label="People toolbar">
      <Input
        type="search"
        placeholder="Search people by name or note"
        aria-label="Search people"
        className="h-12"
        value={value}
        onChange={(event) => {
          onQueryChange(event.target.value)
        }}
      />
    </section>
  )
}

export default PeopleToolbar

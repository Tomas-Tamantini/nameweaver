import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section aria-live="polite">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">Go to home page</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  )
}

export default NotFoundPage

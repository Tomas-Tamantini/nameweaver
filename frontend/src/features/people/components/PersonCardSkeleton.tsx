import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type PersonCardSkeletonProps = {
  showLoadingLabel?: boolean
}

function PersonCardSkeleton({
  showLoadingLabel = true,
}: PersonCardSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        {showLoadingLabel ? <p className="sr-only">Loading people...</p> : null}
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
    </Card>
  )
}

export default PersonCardSkeleton

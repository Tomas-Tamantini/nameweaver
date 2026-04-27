import { useAuth } from '@/features/auth/context/auth-context'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

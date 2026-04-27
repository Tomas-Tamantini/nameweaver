import { ModeToggle } from '@/components/shared/ModeToggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/context/auth-context'
import { Link, useNavigate } from 'react-router-dom'

export function AppHeader() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
        <h1 className="text-base font-semibold tracking-tight">
          <Link to="/">Nameweaver</Link>
        </h1>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

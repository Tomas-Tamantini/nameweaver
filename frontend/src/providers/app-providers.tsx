import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context/auth-context'
import { ThemeProvider } from '@/providers/theme'

type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

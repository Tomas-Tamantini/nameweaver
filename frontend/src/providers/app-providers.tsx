import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/providers/theme'

type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}

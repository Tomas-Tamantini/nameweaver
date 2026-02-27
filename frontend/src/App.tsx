import AppHeader from '@/components/shared/AppHeader'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-6">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App

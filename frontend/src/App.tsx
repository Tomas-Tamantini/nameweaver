import AppHeader from '@/components/shared/AppHeader'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <AppHeader />
      <main>
        <AppRoutes />
      </main>
    </div>
  )
}

export default App

import AppHeader from '@/components/shared/AppHeader'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main>
        <AppRoutes />
      </main>
    </div>
  )
}

export default App

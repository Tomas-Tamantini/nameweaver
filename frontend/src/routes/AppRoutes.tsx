import PeoplePage from '@/features/people/pages/PeoplePage'
import { Navigate, Route, Routes } from 'react-router-dom'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/people" replace />} />
      <Route path="/people" element={<PeoplePage />} />
    </Routes>
  )
}

export default AppRoutes

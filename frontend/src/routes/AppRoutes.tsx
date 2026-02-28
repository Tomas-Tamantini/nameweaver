import AddPersonPage from '@/features/people/pages/AddPersonPage'
import PeoplePage from '@/features/people/pages/PeoplePage'
import NotFoundPage from '@/pages/system/NotFoundPage'
import { Navigate, Route, Routes } from 'react-router-dom'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/people" replace />} />
      <Route path="/people" element={<PeoplePage />} />
      <Route path="/people/new" element={<AddPersonPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes

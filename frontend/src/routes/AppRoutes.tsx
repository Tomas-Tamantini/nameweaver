import { AddPersonPage, PeoplePage } from '@/features/people'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Navigate, Route, Routes } from 'react-router-dom'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/people" replace />} />
      <Route path="/people" element={<PeoplePage />} />
      <Route path="/people/new" element={<AddPersonPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

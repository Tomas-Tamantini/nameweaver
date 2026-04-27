import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { AddPersonPage, PeoplePage } from '@/features/people'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/people" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/new" element={<AddPersonPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

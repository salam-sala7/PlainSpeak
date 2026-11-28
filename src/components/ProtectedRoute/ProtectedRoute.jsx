import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/authContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  const { pathname, search } = useLocation()

  if (loading) return <p role="status">Checking your session…</p>
  if (!session) return <Navigate to="/login" state={{ from: pathname + search }} replace />
  return <Outlet />
}

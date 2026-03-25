import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from './Spinner'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!user)   return <Navigate to="/auth" state={{ from: location }} replace />
  return children
}

export function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()
  if (loading)   return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!user)     return <Navigate to="/auth" state={{ from: location }} replace />
  if (!isAdmin)  return <Navigate to="/" replace />
  return children
}

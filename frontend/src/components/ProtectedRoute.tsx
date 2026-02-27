import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is logged in (check localStorage for token/user)
  const isAuthenticated = localStorage.getItem('userToken') !== null
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

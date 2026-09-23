import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/userProvider'

function AdminProtected() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Logged in but not admin
  if (user.role !== 'Admin') {
    return <Navigate to="/" replace />
  }

  // Logged in + admin
  return <Outlet />
}

export default AdminProtected

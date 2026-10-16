import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/userProvider'
import { isAdminRole } from '../lib/permission'

function AdminProtected() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!isAdminRole(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminProtected

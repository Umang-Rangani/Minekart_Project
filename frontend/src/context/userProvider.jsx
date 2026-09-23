import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import toast from 'react-hot-toast'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showLogin, setShowLogin] = useState(false)

  // GET CURRENT USER
  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/users/profile')

      setUser(response.data.user)
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null)
        return
      }

      toast.error(error.response?.data?.message || 'Unable to fetch user profile')

      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // CHECK LOGIN ON REFRESH
  useEffect(() => {
    getCurrentUser()
  }, [])

  // LOGOUT
  const logout = async () => {
    try {
      await axiosInstance.post('/users/logout')
      setUser(null)
      setShowLogin(true)
      toast.success('Logout successful')
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed. Please try again.')


         toast.error(
        error.response?.data?.message ||
          'Logout failed. Please try again.',
      )
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        getCurrentUser,
        showLogin,
        setShowLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}

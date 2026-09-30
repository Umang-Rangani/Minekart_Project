import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { axiosInstance } from '../config/axiosConfig'

const AdminNotificationContext = createContext(null)

const socket = io(import.meta.env.VITE_API_URL || '${import.meta.env.VITE_API_URL}', {
  withCredentials: true,
  autoConnect: false,
})

export const AdminNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/admin-notification')

      if (response.data.success) {
        setNotifications(response.data.data || [])
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Fetch Admin Notifications Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev])

      setUnreadCount((prev) => prev + 1)
    }

    socket.on('admin-notification:new', handleNewNotification)

    socket.connect()

    return () => {
      socket.off('admin-notification:new', handleNewNotification)

      socket.disconnect()
    }
  }, [])

  const markAsRead = async (notificationId) => {
    try {
      const response = await axiosInstance.patch(`/admin-notification/${notificationId}/read`, {})

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date(),
                }
              : notification,
          ),
        )

        setUnreadCount((prev) => Math.max(prev - 1, 0))
      }
    } catch (error) {
      console.error('Mark Admin Notification Read Error:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.patch('/admin-notification/read-all', {})

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
            readAt: new Date(),
          })),
        )

        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Mark All Admin Notifications Read Error:', error)
    }
  }

  return (
    <AdminNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  )
}

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext)

  if (!context) {
    throw new Error('useAdminNotifications must be used inside AdminNotificationProvider')
  }

  return context
}

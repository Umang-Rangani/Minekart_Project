import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from './userProvider'
import { ADMIN_CHANNEL, POLL_INTERVAL, subscribeToChannel } from '../utils/realtime'

const AdminNotificationContext = createContext(null)

export const AdminNotificationProvider = ({ children }) => {
  const { user, loading: userLoading } = useUser()

  const isAdmin = user?.role === 'Admin'

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
    if (userLoading) {
      return
    }

    if (!isAdmin) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    fetchNotifications()
  }, [isAdmin, userLoading])

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    let cancelled = false
    let unsubscribe = null
    let pollTimer = null

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev])

      setUnreadCount((prev) => prev + 1)
    }

    subscribeToChannel(ADMIN_CHANNEL, 'admin-notification-new', handleNewNotification).then((unsubscribeFn) => {
      if (cancelled) {
        unsubscribeFn?.()
        return
      }

      if (unsubscribeFn) {
        unsubscribe = unsubscribeFn
      } else {
        pollTimer = setInterval(fetchNotifications, POLL_INTERVAL)
      }
    })

    return () => {
      cancelled = true
      unsubscribe?.()
      clearInterval(pollTimer)
    }
  }, [isAdmin])

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

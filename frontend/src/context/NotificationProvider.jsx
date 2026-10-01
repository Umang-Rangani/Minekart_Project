import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from './userProvider'
import { axiosInstance } from '../config/axiosConfig'
import { POLL_INTERVAL, getUserChannel, subscribeToChannel } from '../utils/realtime'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { user } = useUser()

  const userId = user?._id || user?.id

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationLoading, setNotificationLoading] = useState(false)

  const getNotifications = async ({ silent = false } = {}) => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    try {
      if (!silent) {
        setNotificationLoading(true)
      }

      const response = await axiosInstance.get('/notification')

      if (response.data.success) {
        setNotifications(response.data.data || [])
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Get Notifications Error:', error.response?.data || error.message)
    } finally {
      setNotificationLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const notification = notifications.find((item) => item._id === notificationId)

      if (!notification || notification.isRead) {
        return {
          success: true,
        }
      }

      const response = await axiosInstance.patch(`/notification/${notificationId}/read`)

      if (response.data.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notificationId
              ? {
                  ...item,
                  isRead: true,
                  readAt: response.data.data?.readAt || new Date(),
                }
              : item,
          ),
        )

        setUnreadCount((prev) => Math.max(prev - 1, 0))
      }

      return response.data
    } catch (error) {
      console.error('Mark Notification Read Error:', error.response?.data || error.message)

      return {
        success: false,
        message: error.response?.data?.message || 'Unable to mark notification as read',
      }
    }
  }

  const markAllAsRead = async () => {
    if (!unreadCount) {
      return {
        success: true,
      }
    }

    try {
      const response = await axiosInstance.patch('/notification/read-all')

      if (response.data.success) {
        const readAt = new Date()

        setNotifications((prev) =>
          prev.map((item) => ({
            ...item,
            isRead: true,
            readAt: item.readAt || readAt,
          })),
        )

        setUnreadCount(0)
      }

      return response.data
    } catch (error) {
      console.error('Mark All Notifications Read Error:', error.response?.data || error.message)

      return {
        success: false,
        message: error.response?.data?.message || 'Unable to mark all notifications as read',
      }
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const notification = notifications.find((item) => item._id === notificationId)

      const response = await axiosInstance.delete(`/notification/${notificationId}`)

      if (response.data.success) {
        setNotifications((prev) => prev.filter((item) => item._id !== notificationId))

        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(prev - 1, 0))
        }
      }

      return response.data
    } catch (error) {
      console.error('Delete Notification Error:', error.response?.data || error.message)

      return {
        success: false,
        message: error.response?.data?.message || 'Unable to delete notification',
      }
    }
  }

  useEffect(() => {
    getNotifications()
  }, [user])

  useEffect(() => {
    if (!userId) {
      return
    }

    let cancelled = false
    let unsubscribe = null
    let pollTimer = null

    const handleNewNotification = (notification) => {
      setNotifications((prev) => {
        const exists = prev.some((item) => item._id === notification._id)

        if (exists) {
          return prev
        }

        return [notification, ...prev]
      })

      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1)
      }
    }

    subscribeToChannel(getUserChannel(userId), 'notification-new', handleNewNotification).then((unsubscribeFn) => {
      if (cancelled) {
        unsubscribeFn?.()
        return
      }

      if (unsubscribeFn) {
        unsubscribe = unsubscribeFn
      } else {
        pollTimer = setInterval(() => getNotifications({ silent: true }), POLL_INTERVAL)
      }
    })

    return () => {
      cancelled = true
      unsubscribe?.()
      clearInterval(pollTimer)
    }
  }, [userId])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        notificationLoading,
        getNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationContext)
}

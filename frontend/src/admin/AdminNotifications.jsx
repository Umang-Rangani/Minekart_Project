import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpDown, Bell, CheckCheck, CheckCircle2, Clock, CreditCard, Info, PackageCheck, Search, ShoppingCart, Trash2, UserRound, X, XCircle } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { useAdminNotifications } from '../context/AdminNotificationProvider'
import AdminBreadCrumb from './AdminBreadCrumb'

const AdminNotifications = () => {
  const navigate = useNavigate()

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications } = useAdminNotifications()

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminNotificationsSearch') || ''
  })

  const [filter, setFilter] = useState('all')

  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem('adminNotificationsSort') || 'newest'
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return ShoppingCart

      case 'USER_CANCELLED_ORDER':
        return XCircle

      case 'ORDER_RETURN_REQUESTED':
        return PackageCheck

      case 'PAYMENT_RECEIVED':
        return CreditCard

      case 'PAYMENT_FAILED':
        return XCircle

      case 'SYSTEM':
        return Info

      default:
        return Bell
    }
  }

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return {
          wrapper: 'bg-[#EAEDE7] text-[#5E6C55]',
          badge: 'bg-[#EAEDE7] text-[#5E6C55]',
        }

      case 'USER_CANCELLED_ORDER':
      case 'PAYMENT_FAILED':
        return {
          wrapper: 'bg-[#F1E7E5] text-[#A44A3F]',
          badge: 'bg-[#F1E7E5] text-[#A44A3F]',
        }

      case 'ORDER_RETURN_REQUESTED':
        return {
          wrapper: 'bg-[#F1EEE8] text-[#8A6A3D]',
          badge: 'bg-[#F1EEE8] text-[#8A6A3D]',
        }

      case 'PAYMENT_RECEIVED':
        return {
          wrapper: 'bg-[#EAEDE7] text-[#5E6C55]',
          badge: 'bg-[#EAEDE7] text-[#5E6C55]',
        }

      default:
        return {
          wrapper: 'bg-[#F1EEE8] text-[#6B6258]',
          badge: 'bg-[#F1EEE8] text-[#6B6258]',
        }
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return 'New Order'

      case 'USER_CANCELLED_ORDER':
        return 'Cancelled Order'

      case 'ORDER_RETURN_REQUESTED':
        return 'Return Request'

      case 'PAYMENT_RECEIVED':
        return 'Payment Received'

      case 'PAYMENT_FAILED':
        return 'Payment Failed'

      case 'SYSTEM':
        return 'System'

      default:
        return 'Notification'
    }
  }

  const formatDate = (date) => {
    if (!date) return ''

    const createdAt = new Date(date)
    const now = new Date()

    const difference = Math.floor((now.getTime() - createdAt.getTime()) / 1000)

    if (difference < 60) {
      return 'Just now'
    }

    const minutes = Math.floor(difference / 60)

    if (minutes < 60) {
      return `${minutes} min ago`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
      return `${hours} hr ago`
    }

    const days = Math.floor(hours / 24)

    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    }

    return createdAt.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase()

    return notifications
      .filter((notification) => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && !notification.isRead) || (filter === 'read' && notification.isRead)

        if (!matchesFilter) return false

        if (!query) return true

        const searchableText = [notification.title, notification.message, notification.type, notification.orderId?.orderId, notification.userId?.name, notification.userId?.email].filter(Boolean).join(' ').toLowerCase()

        return searchableText.includes(query)
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()

        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
      })
  }, [notifications, search, filter, sortOrder])

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id)
    }

    if (notification.orderId?.orderId) {
      navigate(`/admin/orders/${notification.orderId.orderId}`)
      return
    }

    if (notification.orderId?._id) {
      navigate(`/admin/orders/${notification.orderId._id}`)
      return
    }

    if (notification.userId?._id) {
      navigate(`/admin/users/${notification.userId._id}`)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/admin-notification/${notificationId}`)

      if (response.data.success) {
        await fetchNotifications()
      }
    } catch (error) {
      console.error('Delete Admin Notification Error:', error)
    }
  }

  const items = [{ title: 'Notifications', link: null }]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#99938B]">Total Notifications</p>

              <p className="mt-2 text-2xl font-bold text-[#292725]">{notifications.length}</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
              <Bell size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#99938B]">Unread</p>

              <p className="mt-2 text-2xl font-bold text-[#292725]">{unreadCount}</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#6B6258]">
              <Clock size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#99938B]">Read</p>

              <p className="mt-2 text-2xl font-bold text-[#292725]">{notifications.length - unreadCount}</p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-[#EAEDE7] text-[#5E6C55]">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* TOOLBAR */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                const value = event.target.value
                setSearch(value)
                localStorage.setItem('adminNotificationsSearch', value)
              }}
              placeholder="Search notifications..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  localStorage.removeItem('adminNotificationsSearch')
                }}
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                title="Clear Search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:items-center">
            <div className="relative">
              <ArrowUpDown size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6258]" />

              <select
                value={sortOrder}
                onChange={(event) => {
                  const value = event.target.value
                  setSortOrder(value)
                  localStorage.setItem('adminNotificationsSort', value)
                }}
                className="h-9 w-full appearance-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-8 pr-8 text-[10px] font-bold text-[#6F6A64] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6] sm:w-40"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="flex h-9 w-full items-center rounded-xl border border-[#E3DED6] bg-[#F8F6F2] p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`flex-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition sm:flex-none ${filter === 'all' ? 'bg-[#6B6258] text-white shadow-sm' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'}`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`flex-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition sm:flex-none ${filter === 'unread' ? 'bg-[#6B6258] text-white shadow-sm' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'}`}
              >
                Unread
              </button>

              <button
                type="button"
                onClick={() => setFilter('read')}
                className={`flex-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition sm:flex-none ${filter === 'read' ? 'bg-[#6B6258] text-white shadow-sm' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'}`}
              >
                Read
              </button>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4 text-[10px] font-bold text-[#6B6258] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
          {loading ? (
            <div className="divide-y divide-[#E3DED6]">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex gap-4 p-5">
                  <div className="minekart-admin-page-shimmer size-11 shrink-0 rounded-xl" />

                  <div className="flex-1 space-y-2">
                    <div className="minekart-admin-page-shimmer h-3 w-40 rounded" />
                    <div className="minekart-admin-page-shimmer h-3 w-3/4 rounded" />
                    <div className="minekart-admin-page-shimmer h-2.5 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex min-h-90 flex-col items-center justify-center px-5 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#F1EEE8] text-[#99938B]">
                <Bell size={28} strokeWidth={1.6} />
              </div>

              <h3 className="mt-5 text-sm font-bold text-[#292725]">No notifications found</h3>

              <p className="mt-1 max-w-md text-[11px] leading-5 text-[#99938B]">{search ? 'Try changing your search keyword or filter.' : 'New store activity and alerts will appear here.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E3DED6]">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const styles = getNotificationStyle(notification.type)

                return (
                  <div key={notification._id} className={`group flex gap-4 p-5 transition ${notification.isRead ? 'bg-white hover:bg-[#FBFAF7]' : 'bg-[#F8F6F2] hover:bg-[#F1EEE8]'}`}>
                    {/* ICON */}
                    <button type="button" onClick={() => handleNotificationClick(notification)} className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${styles.wrapper}`}>
                      <Icon size={20} />
                    </button>

                    {/* CONTENT */}
                    <button type="button" onClick={() => handleNotificationClick(notification)} className="min-w-0 flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm ${notification.isRead ? 'font-semibold text-[#4B4743]' : 'font-bold text-[#292725]'}`}>{notification.title}</h3>

                        <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${styles.badge}`}>{getTypeLabel(notification.type)}</span>

                        {!notification.isRead && <span className="size-1.5 rounded-full bg-[#6B6258]" />}
                      </div>

                      <p className="mt-1.5 max-w-3xl text-xs leading-5 text-[#6F6A64]">{notification.message}</p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#99938B]">
                          <Clock size={12} />
                          {formatDate(notification.createdAt)}
                        </span>

                        {notification.orderId?.orderId && (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B6258]">
                            <ShoppingCart size={12} />
                            {notification.orderId.orderId}
                          </span>
                        )}

                        {notification.userId?.name && (
                          <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#99938B]">
                            <UserRound size={12} />
                            {notification.userId.name}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* ACTIONS */}
                    <div className="flex shrink-0 items-start gap-1">
                      {!notification.isRead && (
                        <button type="button" title="Mark as read" onClick={() => markAsRead(notification._id)} className="flex size-9 items-center justify-center rounded-lg text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#6B6258]">
                          <CheckCheck size={16} />
                        </button>
                      )}

                      <button type="button" title="Delete" onClick={() => handleDelete(notification._id)} className="flex size-9 items-center justify-center rounded-lg text-[#99938B] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RESULT INFO */}
        {!loading && filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between px-1 py-4">
            <p className="text-[10px] font-medium text-[#99938B]">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>

            {(search || filter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setFilter('all')
                }}
                className="text-[10px] font-bold text-[#6B6258] hover:text-[#3F3A35]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <style>{`
        @keyframes minekartAdminPageShimmer {
          0% {
            background-position: -500px 0;
          }

          100% {
            background-position: 500px 0;
          }
        }

        .minekart-admin-page-shimmer {
          background: linear-gradient(
            90deg,
            #e9e4dd 25%,
            #f6f3ee 37%,
            #e9e4dd 63%
          );
          background-size: 500px 100%;
          animation: minekartAdminPageShimmer 1.35s ease-in-out infinite;
        }
      `}</style>
      </div>
    </div>
  )
}

export default AdminNotifications

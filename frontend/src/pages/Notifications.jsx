import { useEffect } from 'react'
import { Bell, CheckCheck, Package, CreditCard, RotateCcw, Megaphone, Settings, Trash2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useNotifications } from '../context/NotificationProvider'
import { axiosInstance } from '../config/axiosConfig'

const getNotificationIcon = (type) => {
  if (['ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_PACKED', 'ORDER_SHIPPED', 'OUT_FOR_DELIVERY', 'ORDER_DELIVERED', 'ORDER_CANCELLED'].includes(type)) {
    return Package
  }

  if (['PAYMENT_SUCCESS', 'PAYMENT_FAILED'].includes(type)) {
    return CreditCard
  }

  if (['REFUND_INITIATED', 'REFUND_COMPLETED'].includes(type)) {
    return RotateCcw
  }

  if (type === 'PROMOTION') {
    return Megaphone
  }

  return Settings
}

export default function Notifications() {
  const navigate = useNavigate()

  const { notifications, unreadCount, notificationLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  const formatDate = (date) => {
    if (!date) return ''

    const notificationDate = new Date(date)
    const now = new Date()

    const diff = now - notificationDate
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return notificationDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="w-full py-5 sm:py-6">
      {/* HEADER */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#351C18] shadow-[0_8px_25px_rgba(73,54,49,0.12)]">
        <div className="relative px-4 py-5 sm:px-6 sm:py-6">
          <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-[#A51D26]/25" />
          <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-[#D4A373]/10" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F3D6B8] backdrop-blur-sm sm:h-12 sm:w-12">
                <Bell size={22} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black text-white sm:text-xl">Notifications</h1>

                <p className="mt-0.5 text-[10px] text-white/65 sm:text-xs">Stay updated with your MineKart activity</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button type="button" onClick={markAllAsRead} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-bold text-white transition-all hover:bg-white/15 sm:text-xs">
                <CheckCheck size={14} />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {notificationLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl border border-[#E8DDD4] bg-white" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-[#E8DDD4] bg-white px-5 text-center shadow-[0_5px_20px_rgba(73,54,49,0.05)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <Bell size={28} strokeWidth={1.7} />
          </div>

          <h2 className="mt-4 text-base font-black text-[#351C18]">No notifications yet</h2>

          <p className="mt-1 max-w-sm text-xs leading-5 text-[#806C63]">We will notify you about orders, payments, offers and other important updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)

            const isCancelled = notification.type === 'ORDER_CANCELLED'

            return (
              <div
                key={notification._id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isCancelled ? 'border-[#E7D8D5] bg-[#F8F6F5]' : notification.isRead ? 'border-[#E8DDD4] bg-white' : 'border-[#DCC6BC] bg-[#FFFCFA] shadow-[0_5px_18px_rgba(73,54,49,0.06)]'
                }`}
              >
                {/* LEFT STATUS LINE */}
                <span className={`absolute left-0 top-0 h-full w-1 ${isCancelled ? 'bg-[#C98F89]' : notification.isRead ? 'bg-transparent' : 'bg-[#A51D26]'}`} />

                <div className="flex items-start gap-3 p-4 sm:p-5">
                  {/* ICON */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCancelled ? 'bg-[#EEE9E7] text-[#9A817B]' : notification.isRead ? 'bg-[#F7EEE7] text-[#806C63]' : 'bg-[#F8E8E5] text-[#A51D26]'}`}>
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <button type="button" onClick={() => markAsRead(notification)} className="w-full text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className={`text-sm ${isCancelled ? 'font-bold text-[#6F625E]' : notification.isRead ? 'font-bold text-[#493631]' : 'font-extrabold text-[#351C18]'}`}>{notification.title}</h3>

                          <p className="mt-1 text-xs leading-5 text-[#806C63]">{notification.message}</p>
                        </div>

                        <span className="shrink-0 text-[9px] font-medium text-[#9A857B]">{formatDate(notification.createdAt)}</span>
                      </div>
                    </button>

                    {notification.orderId?.orderId && (
                      <button
                        type="button"
                        onClick={() => {
                          markAsRead(notification)
                          navigate(`/orders/${notification.orderId?.orderId}`)
                        }}
                        className={`mt-3 inline-flex items-center gap-1 text-[10px] font-bold ${isCancelled ? 'text-[#9A817B] hover:text-[#A51D26]' : 'text-[#A51D26] hover:text-[#7D171C]'}`}
                      >
                        View order
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>

                  {/* DELETE */}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notification._id)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isCancelled ? 'text-[#A89A95] hover:bg-[#F0E4E1] hover:text-[#9A4E47]' : 'text-[#9A857B] opacity-100 hover:bg-[#FFF0F0] hover:text-[#A51D26] sm:opacity-0 sm:group-hover:opacity-100'
                    }`}
                    title="Delete notification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutGrid, Package, ShoppingBag, Users, Tag, ChevronLeft, ChevronRight, ShieldCheck, MessageSquare, LogOut, Bell, CheckCheck, ShoppingCart, PackageCheck, XCircle, CreditCard, Info, Clock } from 'lucide-react'
import { MdDashboard } from 'react-icons/md'
import { TbCategory2 } from 'react-icons/tb'
import { useUser } from '../context/userProvider'
import { useAdminNotifications } from '../context/AdminNotificationProvider'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const notificationRef = useRef(null)

  const { user, logout } = useUser()
  const navigate = useNavigate()

  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useAdminNotifications()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: MdDashboard,
    },
    {
      name: 'Category',
      path: '/admin/category',
      icon: LayoutGrid,
    },
    {
      name: 'SubCategory',
      path: '/admin/subcategory',
      icon: TbCategory2,
    },
    {
      name: 'Brand',
      path: '/admin/brand',
      icon: Tag,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
    },
    {
      name: 'Contact Messages',
      path: '/admin/contact-messages',
      icon: MessageSquare,
    },
  ]

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return <ShoppingCart size={17} />

      case 'USER_CANCELLED_ORDER':
        return <XCircle size={17} />

      case 'ORDER_RETURN_REQUESTED':
        return <PackageCheck size={17} />

      case 'PAYMENT_RECEIVED':
        return <CreditCard size={17} />

      case 'PAYMENT_FAILED':
        return <XCircle size={17} />

      case 'SYSTEM':
        return <Info size={17} />

      default:
        return <Bell size={17} />
    }
  }

  const getNotificationIconStyle = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return 'bg-[#EAEDE7] text-[#5E6C55]'

      case 'USER_CANCELLED_ORDER':
      case 'PAYMENT_FAILED':
        return 'bg-[#F1E7E5] text-[#A44A3F]'

      case 'ORDER_RETURN_REQUESTED':
        return 'bg-[#F1EEE8] text-[#8A6A3D]'

      case 'PAYMENT_RECEIVED':
        return 'bg-[#EAEDE7] text-[#5E6C55]'

      case 'SYSTEM':
        return 'bg-[#EEEAE4] text-[#6B6258]'

      default:
        return 'bg-[#F1EEE8] text-[#6B6258]'
    }
  }

  const formatNotificationTime = (date) => {
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

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id)
    }

    setNotificationOpen(false)

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

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#292725]">
      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 h-17 border-b border-[#E3DED6] bg-[#FBFAF7]/95 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-5 lg:px-7">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#6B6258] text-white shadow-sm">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#292725]">
                Mine<span className="text-[#6B6258]">Kart</span>
              </h1>

              <p className="text-[11px] font-medium text-[#99938B]">Admin Panel</p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              className="ml-2 flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
            >
              {sidebarOpen ? <ChevronLeft size={21} /> : <ChevronRight size={21} />}
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* NOTIFICATION */}
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen((prev) => !prev)}
                title="Notifications"
                className={`relative flex size-10 items-center justify-center rounded-xl transition ${notificationOpen ? 'bg-[#EEEAE4] text-[#292725]' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'}`}
              >
                <Bell size={20} strokeWidth={1.9} className={unreadCount > 0 ? 'text-[#6B6258]' : ''} />

                {unreadCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-[#6B6258] px-1 py-0.5 text-[9px] font-bold leading-none text-white shadow-sm">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {notificationOpen && (
                <div className="absolute right-0 top-12 z-70 w-90 overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#FBFAF7] shadow-[0_18px_45px_rgba(63,58,53,0.14)] sm:w-96">
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-[#E3DED6] px-4 py-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#292725]">Notifications</h3>

                        {unreadCount > 0 && <span className="rounded-full bg-[#EAE7E1] px-2 py-0.5 text-[9px] font-bold text-[#6B6258]">{unreadCount} new</span>}
                      </div>

                      <p className="mt-0.5 text-[10px] font-medium text-[#99938B]">Stay updated with your store</p>
                    </div>

                    {unreadCount > 0 && (
                      <button type="button" onClick={markAllAsRead} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-bold text-[#6B6258] transition hover:bg-[#EEEAE4]">
                        <CheckCheck size={14} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* LIST */}
                  <div className="max-h-105 overflow-y-auto">
                    {loading ? (
                      <div className="space-y-3 p-4">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="flex gap-3">
                            <div className="minekart-admin-shimmer size-10 shrink-0 rounded-xl" />

                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="minekart-admin-shimmer h-3 w-32 rounded" />
                              <div className="minekart-admin-shimmer h-2.5 w-full rounded" />
                              <div className="minekart-admin-shimmer h-2.5 w-20 rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F1EEE8] text-[#99938B]">
                          <Bell size={24} strokeWidth={1.7} />
                        </div>

                        <p className="mt-4 text-sm font-bold text-[#292725]">No notifications</p>

                        <p className="mt-1 max-w-58 text-[11px] leading-5 text-[#99938B]">You are all caught up. New store activity will appear here.</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification._id}
                          type="button"
                          onClick={() => handleNotificationClick(notification)}
                          className={`relative flex w-full gap-3 border-b border-[#E3DED6] px-4 py-3.5 text-left transition last:border-b-0 ${notification.isRead ? 'bg-[#FBFAF7] hover:bg-[#F1EEE8]' : 'bg-[#F6F3EE] hover:bg-[#EEEAE4]'}`}
                        >
                          {!notification.isRead && <span className="absolute left-2 top-5 size-1.5 rounded-full bg-[#6B6258]" />}

                          <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${getNotificationIconStyle(notification.type)}`}>{getNotificationIcon(notification.type)}</div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs ${notification.isRead ? 'font-semibold text-[#4B4743]' : 'font-bold text-[#292725]'}`}>{notification.title}</p>

                              {!notification.isRead && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#6B6258]" />}
                            </div>

                            <p className="mt-1 line-clamp-2 text-[11px] leading-4.5 text-[#6F6A64]">{notification.message}</p>

                            <div className="mt-2 flex items-center gap-2">
                              <Clock size={11} className="text-[#99938B]" />

                              <span className="text-[9px] font-medium text-[#99938B]">{formatNotificationTime(notification.createdAt)}</span>

                              {notification.orderId?.orderId && (
                                <>
                                  <span className="text-[#D8D1C8]">•</span>

                                  <span className="truncate text-[9px] font-bold text-[#6B6258]">{notification.orderId.orderId}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* FOOTER */}
                  {!loading && (
                    <div className="border-t border-[#E3DED6] bg-[#F8F6F2] px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationOpen(false)
                          navigate('/admin/notifications')
                        }}
                        className="w-full rounded-lg py-2 text-center text-[10px] font-bold text-[#6B6258] transition hover:bg-[#EEEAE4] hover:text-[#3F3A35]"
                      >
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ADMIN USER */}
            <div className="hidden items-center gap-2 sm:flex">
              <ShieldCheck size={17} className="text-[#6B6258]" />

              <p className="text-sm font-semibold text-[#292725]">{user?.name}</p>

              <span className="rounded-full bg-[#EAE7E1] px-2.5 py-1 text-[10px] font-bold text-[#5D554C]">Admin</span>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={() => {
                navigate('/')
                logout()
              }}
              title="Logout"
              className="flex h-9 items-center gap-2 rounded-lg border border-[#E3DED6] bg-[#F8F6F2] px-3 text-xs font-bold text-[#6F6A64] transition hover:border-[#D8D1C8] hover:bg-[#EEEAE4] hover:text-[#3F3A35]"
            >
              <LogOut size={16} strokeWidth={2} />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`fixed bottom-0 left-0 top-17 z-40 border-r border-[#E3DED6] bg-[#F8F6F2] transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-18'}`}>
        <div className={`flex h-full flex-col py-5 ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#99938B] ${sidebarOpen ? 'px-3' : 'text-center'}`}>{sidebarOpen ? 'Main Menu' : 'Menu'}</p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  title={!sidebarOpen ? item.name : ''}
                  className={({ isActive }) =>
                    `group flex h-11 items-center rounded-xl text-sm font-medium transition ${sidebarOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} ${
                      isActive ? 'bg-[#6B6258] text-white shadow-sm' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative">
                        <Icon size={19} strokeWidth={isActive ? 2.2 : 1.9} />

                        {/* COLLAPSED UNREAD BADGE */}
                        {item.path === '/admin/notifications' && unreadCount > 0 && !sidebarOpen && (
                          <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#6B6258] text-[8px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        )}
                      </div>

                      {sidebarOpen && (
                        <>
                          <span className="flex-1">{item.name}</span>

                          {/* SIDEBAR UNREAD BADGE */}
                          {item.path === '/admin/notifications' && unreadCount > 0 && (
                            <span className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-[#EAE7E1] text-[#6B6258]'}`}>
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="my-5 border-t border-[#E3DED6]" />

          {sidebarOpen && (
            <div className="mt-auto rounded-2xl border border-[#E3DED6] bg-[#F1EEE8] p-4">
              <p className="text-xs font-semibold text-[#292725]">MineKart Admin</p>

              <p className="mt-1 text-[11px] leading-5 text-[#99938B]">Manage your store, products and orders.</p>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`min-h-screen pt-17 transition-all duration-300 ${sidebarOpen ? 'lg:pl-60' : 'lg:pl-18'}`}>
        <div className="flex min-h-[calc(100vh-68px)] flex-col">
          <div className="flex-1 p-4">
            <Outlet />
          </div>

          {/* ADMIN FOOTER */}
          <footer className="mt-20 border-t border-[#E3DED6] bg-[#FBFAF7] px-5 py-4 lg:px-7">
            <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-xs font-bold text-[#3F3A35]">
                  Mine
                  <span className="text-[#6B6258]">Kart</span> Admin Panel
                </p>

                <p className="mt-0.5 text-[10px] font-medium text-[#99938B]">Manage your store with ease.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-[#99938B]">Designed & Developed by</span>

                <span className="rounded-lg bg-[#F1EEE8] px-2.5 py-1 text-[11px] font-extrabold text-[#6B6258]">Rangani Umang 🤍</span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <style>{`
        @keyframes minekartAdminShimmer {
          0% {
            background-position: -500px 0;
          }

          100% {
            background-position: 500px 0;
          }
        }

        .minekart-admin-shimmer {
          background: linear-gradient(
            90deg,
            #e9e4dd 25%,
            #f6f3ee 37%,
            #e9e4dd 63%
          );
          background-size: 500px 100%;
          animation: minekartAdminShimmer 1.35s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

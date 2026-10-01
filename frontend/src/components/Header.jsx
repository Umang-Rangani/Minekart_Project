import { getImageUrl } from '../utils/imageUrl'
import { Search, ChevronDown, ShoppingCart, UserCircle, Store, User, Package, LogOut, Bell, CheckCheck, ArrowRight, CreditCard, RotateCcw, Megaphone, Settings } from 'lucide-react'

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'
import { useNotifications } from '../context/NotificationProvider'

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

const formatNotificationDate = (date) => {
  if (!date) return ''

  const notificationDate = new Date(date)
  const now = new Date()

  const diff = now - notificationDate

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return notificationDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

export default function Header() {
  const { logout, user, setShowLogin } = useUser()
  const { cart } = useCart()

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const navigate = useNavigate()

  const [accountOpen, setAccountOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const headerRef = useRef(null)

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('minekart_search') || ''
  })

  const handleSearch = () => {
    const query = search.trim()

    if (!query) return

    localStorage.setItem('minekart_search', query)

    setAccountOpen(false)
    setNotificationOpen(false)

    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  useEffect(() => {
    localStorage.setItem('minekart_search', search)
  }, [search])

  // Close both dropdowns when clicking outside header
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setAccountOpen(false)
        setNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleAccountToggle = () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    setNotificationOpen(false)
    setAccountOpen((prev) => !prev)
  }

  const handleNotificationToggle = () => {
    setAccountOpen(false)
    setNotificationOpen((prev) => !prev)
  }

  const handleNotificationClick = async (notification) => {
    setNotificationOpen(false)
    setAccountOpen(false)

    if (!notification.isRead) {
      await markAsRead(notification._id)
    }

    if (notification.orderId?.orderId) {
      navigate(`/orders/${notification.orderId.orderId}`)
      return
    }

    navigate('/notifications')
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
  }

  return (
    <header ref={headerRef} className="fixed left-0 top-0 z-50 w-full text-[#351C18]">
      {/* TOP OFFER BAR */}
      <div className="bg-[#351C18] text-white">
        <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-3 sm:px-5 lg:px-7">
          <div className="flex min-w-0 items-center gap-3 text-[9px] font-medium sm:gap-5 sm:text-[10px]">
            <span className="truncate">Free Shipping on Orders Above ₹999</span>

            <span className="hidden h-3 w-px bg-white/20 sm:block" />

            <span className="hidden sm:inline">100% Genuine Products</span>

            <span className="hidden md:inline">Easy Returns</span>
          </div>

          <span className="hidden shrink-0 text-[9px] text-white/70 lg:block">Need Help? 1800-123-4567</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b border-[#E8DDD4] bg-[#FFFDFC]/95 shadow-[0_4px_18px_rgba(73,54,49,0.07)] backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-[1600px] items-center gap-3 px-3 sm:h-19 sm:px-5 lg:gap-5 lg:px-7">
          {/* LOGO */}
          <Link
            to="/"
            onClick={() => {
              setAccountOpen(false)
              setNotificationOpen(false)
            }}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_9px_20px_rgba(125,23,28,0.22)] sm:h-11 sm:w-11">
              <div className="pointer-events-none absolute -right-3 -top-3 h-7 w-7 rounded-full bg-white/10" />

              <Store size={22} strokeWidth={2} className="relative z-10" />
            </div>

            <div className="hidden leading-none sm:block">
              <h1 className="text-[22px] font-black tracking-tight text-[#351C18] lg:text-[24px]">
                Mine
                <span className="text-[#A51D26]">Kart</span>
              </h1>

              <p className="mt-1 text-[7px] font-bold tracking-[0.18em] text-[#9A857B] lg:text-[8px]">SHOP MORE • LIVE BETTER</p>
            </div>
          </Link>

          {/* SEARCH */}
          <div className="group min-w-0 flex-1">
            <div className="flex h-10 w-full items-center overflow-hidden rounded-xl border border-[#DED1C9] bg-[#F8F4F1] transition-all duration-200 focus-within:border-[#A51D26] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(165,29,38,0.06)] sm:h-11">
              <Search size={18} strokeWidth={2} className="ml-3 shrink-0 text-[#806C63] transition-colors duration-200 group-focus-within:text-[#A51D26] sm:ml-3.5" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                placeholder="Search products, brands and more..."
                className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-[11px] text-[#351C18] outline-none placeholder:text-[#9A857B] sm:px-3 sm:text-xs md:text-sm"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="mr-1 flex h-8 items-center justify-center rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-3.5 text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:from-[#681419] hover:to-[#8E181F] active:scale-95 sm:h-9 sm:px-5 sm:text-xs"
              >
                <span className="hidden sm:inline">Search</span>

                <Search size={14} strokeWidth={2.3} className="sm:hidden" />
              </button>
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="relative shrink-0">
            <button type="button" onClick={handleAccountToggle} className={`group flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-200 sm:px-2 ${accountOpen ? 'bg-[#F7EEE7]' : 'hover:bg-[#F7EEE7]'}`}>
              {user?.avatar ? (
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#E7D8D0] bg-[#F7EEE7] sm:h-10 sm:w-10">
                  <img src={getImageUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D5CC] bg-[#F7EEE7] text-[#8E181F] transition-all duration-200 group-hover:border-[#CDAFA4] sm:h-10 sm:w-10">
                  <UserCircle size={23} strokeWidth={1.8} />
                </div>
              )}

              <div className="hidden max-w-25 text-left lg:block">
                <p className="text-[8px] font-medium uppercase tracking-wider text-[#9A857B]">{user ? 'Welcome back' : 'Account'}</p>

                <p className="mt-0.5 truncate text-xs font-extrabold text-[#351C18]">{user ? user.name : 'Login'}</p>
              </div>

              {user && <ChevronDown size={14} strokeWidth={2} className={`hidden transition-all duration-200 lg:block ${accountOpen ? 'rotate-180 text-[#A51D26]' : 'text-[#806C63]'}`} />}
            </button>

            {/* ACCOUNT DROPDOWN */}
            {user && accountOpen && (
              <div className="absolute right-0 top-full z-70 pt-3">
                <div className="w-72 overflow-hidden rounded-2xl border border-[#E3D6CE] bg-white shadow-[0_20px_50px_rgba(53,28,24,0.16)]">
                  {/* PROFILE HEADER */}
                  <div className="border-b border-[#EEE5DF] bg-linear-to-br from-[#FBF5F0] to-[#F7EEE7] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                        {user.avatar ? <img src={getImageUrl(user.avatar)} alt={user.name} className="h-full w-full object-cover" /> : <User size={19} strokeWidth={2} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[#351C18]">{user.name}</p>

                        <p className="mt-0.5 truncate text-[10px] text-[#9A857B]">{user.email}</p>

                        <span className="mt-1.5 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#8E181F] shadow-sm">My Account</span>
                      </div>
                    </div>
                  </div>

                  {/* MENU */}
                  <div className="p-2">
                    <Link to="/profile" onClick={() => setAccountOpen(false)} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-colors group-hover:bg-[#F2DDD5]">
                        <User size={17} strokeWidth={1.9} />
                      </span>

                      <span className="flex-1">
                        <span className="block font-bold">My Profile</span>

                        <span className="mt-0.5 block text-[9px] font-normal text-[#9A857B]">Manage your personal information</span>
                      </span>

                      <ArrowRight size={14} className="text-[#B6A39A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#A51D26]" />
                    </Link>

                    <Link to="/orders" onClick={() => setAccountOpen(false)} className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-colors group-hover:bg-[#F2DDD5]">
                        <Package size={17} strokeWidth={1.9} />
                      </span>

                      <span className="flex-1">
                        <span className="block font-bold">My Orders</span>

                        <span className="mt-0.5 block text-[9px] font-normal text-[#9A857B]">Track and manage your orders</span>
                      </span>

                      <ArrowRight size={14} className="text-[#B6A39A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#A51D26]" />
                    </Link>
                  </div>

                  {/* LOGOUT */}
                  <div className="border-t border-[#EEE5DF] p-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setAccountOpen(false)
                        setNotificationOpen(false)
                        navigate('/')
                      }}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold text-[#A51D26] transition-all duration-200 hover:bg-[#FFF1F1]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F1] text-[#A51D26] transition-colors group-hover:bg-[#FFE5E5]">
                        <LogOut size={17} strokeWidth={1.9} />
                      </span>

                      <span className="flex-1">
                        <span className="block font-bold">Logout</span>

                        <span className="mt-0.5 block text-[9px] font-normal text-[#B17A73]">Sign out from your account</span>
                      </span>

                      <ArrowRight size={14} className="text-[#D1AAA4] transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          {user && <div className="hidden h-9 w-px shrink-0 bg-[#E5D8D0] sm:block" />}

          {/* NOTIFICATIONS */}
          {user && (
            <div className="relative shrink-0">
              <button type="button" onClick={handleNotificationToggle} className={`group flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-200 sm:px-2 ${notificationOpen ? 'bg-[#F7EEE7]' : 'hover:bg-[#F7EEE7]'}`}>
                <div className="relative">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 sm:h-10 sm:w-10 ${notificationOpen ? 'bg-[#F2DDD5] text-[#8E181F]' : 'bg-[#F7EEE7] text-[#493631]  group-hover:text-[#8E181F]'}`}>
                    <Bell size={21} strokeWidth={1.9} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                  </div>

                  {unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#A51D26] px-1 text-[8px] font-extrabold text-white shadow-sm">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {notificationOpen && (
                <div className="absolute right-0 top-full z-80 pt-3">
                  <div className="w-96 overflow-hidden rounded-2xl border border-[#E3D6CE] bg-white shadow-[0_20px_50px_rgba(53,28,24,0.16)]">
                    {/* HEADER */}
                    <div className="flex items-center justify-between border-b border-[#EEE5DF] bg-linear-to-r from-[#FFFCFA] to-[#FBF5F0] px-5 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#A51D26]">
                            <Bell size={16} strokeWidth={1.9} />
                          </div>

                          <div>
                            <h3 className="text-sm font-black text-[#351C18]">Notifications</h3>

                            <p className="mt-0.5 text-[9px] text-[#9A857B]">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You are all caught up'}</p>
                          </div>
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <button type="button" onClick={handleMarkAllRead} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[9px] font-bold text-[#A51D26] transition-all duration-200 hover:bg-[#F8ECE6] hover:text-[#681419]">
                          <CheckCheck size={13} />
                          Mark all
                        </button>
                      )}
                    </div>

                    {/* NOTIFICATION LIST */}
                    {notifications.length === 0 ? (
                      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
                          <Bell size={23} strokeWidth={1.7} />
                        </div>

                        <p className="mt-4 text-sm font-bold text-[#493631]">No notifications yet</p>

                        <p className="mt-1 max-w-55 text-[10px] leading-4 text-[#9A857B]">We will keep you updated about your orders and account activity.</p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.slice(0, 3).map((notification) => {
                          const Icon = getNotificationIcon(notification.type)

                          return (
                            <button
                              key={notification._id}
                              type="button"
                              onClick={() => handleNotificationClick(notification)}
                              className={`group flex w-full items-start gap-3 border-b border-[#F1E9E4] px-5 py-4 text-left transition-all duration-200 last:border-b-0 hover:bg-[#FFF8F4] ${!notification.isRead ? 'bg-[#FFFCFA]' : 'bg-white'}`}
                            >
                              {/* ICON */}
                              <div className={`relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${notification.isRead ? 'bg-[#F7EEE7] text-[#806C63]' : 'bg-[#F8E8E5] text-[#A51D26]'}`}>
                                <Icon size={17} strokeWidth={1.8} />

                                {!notification.isRead && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#A51D26]" />}
                              </div>

                              {/* CONTENT */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <p className={`truncate text-[11px] ${notification.isRead ? 'font-semibold text-[#493631]' : 'font-extrabold text-[#351C18]'}`}>{notification.title}</p>

                                  <span className="shrink-0 text-[8px] font-medium text-[#A8968D]">{formatNotificationDate(notification.createdAt)}</span>
                                </div>

                                <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#806C63]">{notification.message}</p>

                                {notification.orderId && (
                                  <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-extrabold text-[#A51D26]">
                                    View order
                                    <ArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* FOOTER */}
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationOpen(false)
                          setAccountOpen(false)
                          navigate('/notifications')
                        }}
                        className="flex w-full items-center justify-center gap-2 border-t border-[#EEE5DF] bg-[#FFFCFA] px-5 py-4 text-[10px] font-extrabold text-[#A51D26] transition-all duration-200 hover:bg-[#F8ECE6]"
                      >
                        View all notifications
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CART */}
          {user && (
            <button
              type="button"
              onClick={() => {
                setAccountOpen(false)
                setNotificationOpen(false)
                navigate('/cart')
              }}
              className="group relative flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-200 hover:bg-[#F7EEE7] sm:px-2"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#493631] transition-all duration-700  group-hover:text-[#8E181F] sm:h-10 sm:w-10">
                  <ShoppingCart size={21} strokeWidth={1.9} className="transition-all duration-600 group-hover:scale-102" />
                </div>

                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#A51D26] px-1 text-[8px] font-extrabold text-white shadow-sm">{cart?.totalQuantity || 0}</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

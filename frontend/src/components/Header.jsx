import { Search, ChevronDown, ShoppingCart, UserCircle, User, Package, LogOut, Bell, CheckCheck, ArrowRight, CreditCard, RotateCcw, Megaphone, Settings, X } from 'lucide-react'

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'
import { useNotifications } from '../context/NotificationProvider'
import { getImageUrl } from '../utils/imageUrl'

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

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const headerRef = useRef(null)
  const mobileSearchInputRef = useRef(null)

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('minekart_search') || ''
  })

  const handleSearch = () => {
    const query = search.trim()

    if (!query) return

    localStorage.setItem('minekart_search', query)

    setAccountOpen(false)
    setNotificationOpen(false)
    setMobileSearchOpen(false)

    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const openMobileSearch = () => {
    setAccountOpen(false)
    setNotificationOpen(false)
    setMobileSearchOpen(true)
  }

  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
  }

  useEffect(() => {
    localStorage.setItem('minekart_search', search)
  }, [search])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setAccountOpen(false)
        setNotificationOpen(false)
        setMobileSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus()
      }, 50)
    }
  }, [mobileSearchOpen])

  const handleAccountToggle = () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    setMobileSearchOpen(false)
    setNotificationOpen(false)
    setAccountOpen((prev) => !prev)
  }

  const handleNotificationToggle = () => {
    setMobileSearchOpen(false)
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
    <header ref={headerRef} className="fixed left-0 top-0 z-50 w-full text-[#35231F]">
      {/* TOP OFFER BAR */}
      <div className="bg-[#3B211D] text-[#FFF9F5]">
        <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-3 sm:px-5 lg:px-7">
          <div className="flex min-w-0 items-center gap-3 text-[9px] font-medium sm:gap-5 sm:text-[10px]">
            <span className="truncate">Free Shipping on Orders Above ₹999</span>

            <span className="hidden h-3 w-px bg-white/20 sm:block" />

            <span className="hidden sm:inline">100% Genuine Products</span>

            <span className="hidden md:inline">Easy Returns</span>
          </div>

          <span className="hidden shrink-0 text-[9px] text-white/65 lg:block">Need Help? 1800-123-4567</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b border-[#E7D8CE] bg-[#FFFCF9]/95 shadow-[0_5px_22px_rgba(59,33,29,0.08)] backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-[1600px] items-center gap-1.5 px-2 sm:h-19 sm:gap-3 sm:px-5 lg:gap-5 lg:px-7">
          {/* LOGO */}
          <Link
            to="/"
            onClick={() => {
              setAccountOpen(false)
              setNotificationOpen(false)
              setMobileSearchOpen(false)
            }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[#E4CFC5] bg-[#F6E9E0] sm:h-12 sm:w-12">
              <img src="/cart_image.jpg" alt="MineKart" className="h-7 w-7 object-contain sm:h-10 sm:w-10" />
            </div>

            <div className="hidden leading-none sm:block">
              <h1 className="text-[22px] font-black tracking-tight text-[#35231F] lg:text-[24px]">
                Mine
                <span className="text-[#9D2932]">Kart</span>
              </h1>

              <p className="mt-1 text-[7px] font-bold tracking-[0.18em] text-[#967E74] lg:text-[8px]">SHOP MORE • LIVE BETTER</p>
            </div>
          </Link>

          {/* MOBILE SEARCH OPEN */}
          {mobileSearchOpen ? (
            <>
              {/* SEARCH INPUT */}
              <div className="min-w-0 flex-1">
                <div className="flex h-10 w-full items-center overflow-hidden rounded-xl border border-[#A52C35] bg-white shadow-[0_0_0_3px_rgba(165,44,53,0.07)] sm:h-11">
                  <Search size={17} strokeWidth={2} className="ml-2.5 shrink-0 text-[#A52C35] sm:ml-3" />

                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }

                      if (e.key === 'Escape') {
                        closeMobileSearch()
                      }
                    }}
                    placeholder="Search products..."
                    className="h-full min-w-0 flex-1 bg-transparent px-2 text-[11px] text-[#35231F] outline-none placeholder:text-[#9D8980] sm:px-3 sm:text-sm"
                  />

                  {/* SEARCH BUTTON */}
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-r from-[#7F2028] to-[#A52C35] text-white transition-colors duration-200 hover:from-[#69191F] hover:to-[#8E242C]"
                    aria-label="Search"
                  >
                    <Search size={14} strokeWidth={2.3} />
                  </button>

                  {/* CLOSE BUTTON */}
                  <button type="button" onClick={closeMobileSearch} className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#806C63] transition-colors hover:bg-[#F7EEE7] hover:text-[#A52C35]" aria-label="Close search">
                    <X size={17} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* DESKTOP SEARCH / MOBILE SEARCH ICON */}
              <div className="min-w-0 flex-1">
                {/* DESKTOP SEARCH */}
                <div className="hidden sm:block">
                  <div className="group flex h-11 w-full items-center overflow-hidden rounded-xl border border-[#DDCDC3] bg-[#F8F1EC] transition-colors duration-200 focus-within:border-[#A52C35] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(165,44,53,0.07)]">
                    <Search size={18} strokeWidth={2} className="ml-3.5 shrink-0 text-[#8D766D] transition-colors duration-200 group-focus-within:text-[#A52C35]" />

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
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-[#35231F] outline-none placeholder:text-[#9D8980] md:text-sm"
                    />

                    <button
                      type="button"
                      onClick={handleSearch}
                      className="mr-1 flex h-9 items-center justify-center rounded-lg bg-linear-to-r from-[#7F2028] to-[#A52C35] px-5 text-xs font-bold text-white shadow-sm transition-colors duration-200 hover:from-[#69191F] hover:to-[#8E242C]"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* MOBILE SEARCH ICON */}
                <button
                  type="button"
                  onClick={openMobileSearch}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E4D5CD] bg-[#F7EEE7] text-[#4C3630] transition-colors duration-200 hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#922A32] sm:hidden"
                  aria-label="Open search"
                >
                  <Search size={19} strokeWidth={1.9} />
                </button>
              </div>

              {/* ACCOUNT */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={handleAccountToggle}
                  className={`group flex h-9 w-9 items-center justify-center rounded-xl border border-transparent transition-colors duration-200 sm:h-auto sm:w-auto sm:gap-2 sm:px-2 sm:py-1.5 ${
                    accountOpen ? 'border-[#D9C4BA] bg-[#F7EEE7]' : 'hover:border-[#D9C4BA] hover:bg-[#F7EEE7]'
                  }`}
                >
                  {user?.avatar ? (
                    <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#E1D0C7] bg-[#F5E9E2] sm:h-10 sm:w-10">
                      <img src={`${import.meta.env.VITE_API_URL}${user.avatar}`} alt={user.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E1D0C7] bg-[#F5E9E2] text-[#8E2931] transition-colors duration-200 group-hover:border-[#C9A79C] group-hover:bg-[#EFE0D7] sm:h-10 sm:w-10">
                      <UserCircle size={21} strokeWidth={1.8} />
                    </div>
                  )}

                  <div className="hidden max-w-25 text-left lg:block">
                    <p className="text-[8px] font-medium uppercase tracking-wider text-[#967E74]">{user ? 'Welcome back' : 'Account'}</p>

                    <p className="mt-0.5 truncate text-xs font-extrabold text-[#35231F]">{user ? user.name : 'Login'}</p>
                  </div>

                  {user && <ChevronDown size={14} strokeWidth={2} className={`hidden transition-colors duration-200 lg:block ${accountOpen ? 'rotate-180 text-[#A52C35]' : 'text-[#806C63]'}`} />}
                </button>

                {/* ACCOUNT DROPDOWN */}
                {user && accountOpen && (
                  <div className="absolute right-0 top-full z-70 pt-2 sm:pt-3">
                    <div className="w-[calc(100vw-1rem)] max-w-72 overflow-hidden rounded-2xl border border-[#E3D6CE] bg-white shadow-[0_20px_50px_rgba(53,28,24,0.16)] sm:w-72">
                      {/* PROFILE HEADER */}
                      <div className="border-b border-[#EEE5DF] bg-linear-to-br from-[#FBF5F0] to-[#F7EEE7] px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm sm:h-12 sm:w-12">
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
                        <Link
                          to="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold text-[#493631] transition-colors duration-200 hover:bg-[#F8ECE6] hover:text-[#8E181F]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-colors group-hover:bg-[#F2DDD5]">
                            <User size={17} strokeWidth={1.9} />
                          </span>

                          <span className="flex-1">
                            <span className="block font-bold">My Profile</span>

                            <span className="mt-0.5 block text-[9px] font-normal text-[#9A857B]">Manage your personal information</span>
                          </span>

                          <ArrowRight size={14} className="text-[#B6A39A] transition-colors group-hover:text-[#A51D26]" />
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="group mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold text-[#493631] transition-colors duration-200 hover:bg-[#F8ECE6] hover:text-[#8E181F]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-colors group-hover:bg-[#F2DDD5]">
                            <Package size={17} strokeWidth={1.9} />
                          </span>

                          <span className="flex-1">
                            <span className="block font-bold">My Orders</span>

                            <span className="mt-0.5 block text-[9px] font-normal text-[#9A857B]">Track and manage your orders</span>
                          </span>

                          <ArrowRight size={14} className="text-[#B6A39A] transition-colors group-hover:text-[#A51D26]" />
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
                            setMobileSearchOpen(false)
                            navigate('/')
                          }}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold text-[#A51D26] transition-colors duration-200 hover:bg-[#FFF1F1]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F1] text-[#A51D26] transition-colors group-hover:bg-[#FFE5E5]">
                            <LogOut size={17} strokeWidth={1.9} />
                          </span>

                          <span className="flex-1">
                            <span className="block font-bold">Logout</span>

                            <span className="mt-0.5 block text-[9px] font-normal text-[#B17A73]">Sign out from your account</span>
                          </span>

                          <ArrowRight size={14} className="text-[#D1AAA4]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* DIVIDER */}
              {user && <div className="hidden h-9 w-px shrink-0 bg-[#E5D6CD] sm:block" />}

              {/* NOTIFICATION */}
              {user && (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={handleNotificationToggle}
                    className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200 sm:h-10 sm:w-10 ${
                      notificationOpen ? 'border-[#CFA8A0] bg-[#EFE0D7] text-[#922A32]' : 'border-[#E4D5CD] bg-[#F7EEE7] text-[#4C3630] hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#922A32]'
                    }`}
                  >
                    <Bell size={18} strokeWidth={1.9} />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#FFFCF9] bg-[#A52C35] px-1 text-[7px] font-extrabold leading-none text-white sm:h-4.5 sm:min-w-4.5 sm:text-[8px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATION DROPDOWN */}
                  {notificationOpen && (
                    <div className="absolute right-0 top-full z-80 pt-2 sm:pt-3">
                      <div className="w-[calc(100vw-1rem)] max-w-96 overflow-hidden rounded-2xl border border-[#E3D6CE] bg-white shadow-[0_20px_50px_rgba(53,28,24,0.16)] sm:w-96">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-[#EEE5DF] bg-linear-to-r from-[#FFFCFA] to-[#FBF5F0] px-4 py-3.5 sm:px-5 sm:py-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#A51D26]">
                              <Bell size={16} strokeWidth={1.9} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-sm font-black text-[#351C18]">Notifications</h3>

                              <p className="mt-0.5 truncate text-[9px] text-[#9A857B]">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You are all caught up'}</p>
                            </div>
                          </div>

                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllRead}
                              className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-bold text-[#A51D26] transition-colors duration-200 hover:bg-[#F8ECE6] hover:text-[#681419]"
                            >
                              <CheckCheck size={13} />
                              <span className="hidden xs:inline">Mark all</span>
                            </button>
                          )}
                        </div>

                        {/* NOTIFICATION LIST */}
                        {notifications.length === 0 ? (
                          <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center sm:min-h-56 sm:px-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
                              <Bell size={23} strokeWidth={1.7} />
                            </div>

                            <p className="mt-4 text-sm font-bold text-[#493631]">No notifications yet</p>

                            <p className="mt-1 max-w-55 text-[10px] leading-4 text-[#9A857B]">We will keep you updated about your orders and account activity.</p>
                          </div>
                        ) : (
                          <div className="max-h-[60vh] overflow-y-auto sm:max-h-96">
                            {notifications.slice(0, 3).map((notification) => {
                              const Icon = getNotificationIcon(notification.type)

                              return (
                                <button
                                  key={notification._id}
                                  type="button"
                                  onClick={() => handleNotificationClick(notification)}
                                  className={`group flex w-full items-start gap-2.5 border-b border-[#F1E9E4] px-3.5 py-3.5 text-left transition-colors duration-200 last:border-b-0 hover:bg-[#FFF8F4] sm:gap-3 sm:px-5 sm:py-4 ${
                                    !notification.isRead ? 'bg-[#FFFCFA]' : 'bg-white'
                                  }`}
                                >
                                  {/* ICON */}
                                  <div className={`relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${notification.isRead ? 'bg-[#F7EEE7] text-[#806C63]' : 'bg-[#F8E8E5] text-[#A51D26]'}`}>
                                    <Icon size={16} strokeWidth={1.8} />

                                    {!notification.isRead && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#A51D26]" />}
                                  </div>

                                  {/* CONTENT */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`truncate text-[10px] sm:text-[11px] ${notification.isRead ? 'font-semibold text-[#493631]' : 'font-extrabold text-[#351C18]'}`}>{notification.title}</p>

                                      <span className="shrink-0 text-[7px] font-medium text-[#A8968D] sm:text-[8px]">{formatNotificationDate(notification.createdAt)}</span>
                                    </div>

                                    <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-[#806C63] sm:text-[10px]">{notification.message}</p>

                                    {notification.orderId && (
                                      <span className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-extrabold text-[#A51D26] sm:mt-2 sm:text-[9px]">
                                        View order
                                        <ArrowRight size={10} />
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
                            className="flex w-full items-center justify-center gap-2 border-t border-[#EEE5DF] bg-[#FFFCFA] px-4 py-3.5 text-[9px] font-extrabold text-[#A51D26] transition-colors duration-200 hover:bg-[#F8ECE6] sm:px-5 sm:py-4 sm:text-[10px]"
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
                  className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E4D5CD] bg-[#F7EEE7] text-[#4C3630] transition-colors duration-200 hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#922A32] sm:h-10 sm:w-10"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} strokeWidth={1.9} />

                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#FFFCF9] bg-[#A52C35] px-1 text-[7px] font-extrabold leading-none text-white sm:h-4.5 sm:min-w-4.5 sm:text-[8px]">
                    {cart?.totalQuantity || 0}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

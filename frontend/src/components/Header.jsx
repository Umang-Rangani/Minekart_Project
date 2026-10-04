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

  const userAvatar = user?.avatar ? getImageUrl(user.avatar) : ''

  return (
    <header ref={headerRef} className="fixed left-0 top-0 z-50 w-full text-[#35231F]">
      {/* TOP OFFER BAR */}
      <div className="bg-[#6B4139] text-[#FFF9F5]">
        <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-3 sm:px-5 lg:px-7">
          <div className="flex min-w-0 items-center gap-3 text-[9px] font-medium sm:gap-5 sm:text-[10px]">
            <span className="truncate">Free Shipping on Orders Above ₹999</span>

            <span className="hidden h-3 w-px bg-white/20 sm:block" />

            <span className="hidden sm:inline">100% Genuine Products</span>

            <span className="hidden md:inline">Easy Returns</span>
          </div>

          <span className="hidden shrink-0 text-[9px] text-white/75 lg:block">Need Help? 1800-123-4567</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b border-[#E7D8CE] bg-[#FFFCF9]/95 shadow-[0_5px_22px_rgba(59,33,29,0.06)] backdrop-blur-md">
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
              <div className="min-w-0 flex-1">
                <div className="flex h-10 w-full items-center overflow-hidden rounded-xl border border-[#CFA8A0] bg-white shadow-[0_0_0_3px_rgba(157,41,50,0.05)] sm:h-11">
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
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-[11px] text-[#35231F] outline-none placeholder:text-[#9D8980] sm:text-sm"
                  />

                  <button type="button" onClick={handleSearch} className="mr-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9D2932] transition-colors duration-200 hover:bg-[#F7EEE7]" aria-label="Search">
                    <Search size={17} strokeWidth={2.2} />
                  </button>

                  <button
                    type="button"
                    onClick={closeMobileSearch}
                    className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#806C63] transition-colors duration-200 hover:bg-[#F7EEE7] hover:text-[#9D2932]"
                    aria-label="Close search"
                  >
                    <X size={17} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* MOBILE CART */}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false)
                    setNotificationOpen(false)
                    setMobileSearchOpen(false)
                    navigate('/cart')
                  }}
                  className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E4D5CD] bg-[#F7EEE7] text-[#5B423A] transition-colors duration-200 hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#9D2932] sm:h-10 sm:w-10"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} strokeWidth={1.9} />

                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#FFFCF9] bg-[#9D2932] px-1 text-[7px] font-extrabold leading-none text-white">{cart?.totalQuantity || 0}</span>
                </button>
              )}
            </>
          ) : (
            <>
              {/* SEARCH */}
              <div className="min-w-0 flex-1">
                {/* DESKTOP SEARCH */}
                <div className="hidden sm:block">
                  <div className="group flex h-11 w-full items-center overflow-hidden rounded-xl border border-[#DDCDC3] bg-[#F8F1EC] transition-all duration-200 focus-within:border-[#CFA8A0] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(157,41,50,0.05)]">
                    <Search size={18} strokeWidth={2} className="ml-3.5 shrink-0 text-[#8D766D] transition-colors duration-200 group-focus-within:text-[#9D2932]" />

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

                    <button type="button" onClick={handleSearch} className="mr-1 flex h-9 items-center justify-center rounded-lg bg-[#9D2932] px-5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#86232B]">
                      Search
                    </button>
                  </div>
                </div>

                {/* MOBILE SEARCH ICON */}
                <button
                  type="button"
                  onClick={openMobileSearch}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E4D5CD] bg-[#F7EEE7] text-[#5B423A] transition-colors duration-200 hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#9D2932] sm:hidden"
                  aria-label="Open search"
                >
                  <Search size={19} strokeWidth={1.9} />
                </button>
              </div>

              {/* ACCOUNT / PROFILE */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={handleAccountToggle}
                  className={`group flex h-9 w-auto items-center justify-center rounded-xl border transition-all duration-200 sm:h-auto sm:w-auto   sm:gap-2 px-2 sm:py-1.5 ${
                    accountOpen ? 'border-[#D9C4BA] bg-[#F7EEE7]' : 'border-transparent hover:border-[#E4D5CD] hover:bg-[#F9F2ED]'
                  }`}
                >
                  {/* PROFILE IMAGE */}
                  {user && userAvatar ? (
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-[#DCC8BF] bg-[#F5E9E2] shadow-[0_2px_8px_rgba(53,35,31,0.08)] sm:h-10 sm:w-10">
                      <img
                        src={userAvatar}
                        alt={user.name || 'Profile'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DCC8BF] bg-[#F5E9E2] text-[#9D2932] transition-colors duration-200 group-hover:border-[#CFA8A0] group-hover:bg-[#EFE0D7] sm:h-10 sm:w-10">
                      <UserCircle size={21} strokeWidth={1.8} />
                    </div>
                  )}

                  {/* MOBILE USER NAME */}
                  {user && <span className="ml-1 max-w-20 truncate text-[10px] font-bold text-[#35231F] sm:hidden">{user.name}</span>}

                  {/* DESKTOP ACCOUNT INFO */}
                  <div className="hidden max-w-25 text-left lg:block">
                    <p className="text-[8px] font-medium uppercase tracking-wider text-[#967E74]">{user ? 'Welcome back' : 'Account'}</p>

                    <p className="mt-0.5 truncate text-xs font-extrabold text-[#35231F]">{user ? user.name : 'Login'}</p>
                  </div>

                  {user && <ChevronDown size={14} strokeWidth={2} className={`hidden transition-all duration-200 lg:block ${accountOpen ? 'rotate-180 text-[#9D2932]' : 'text-[#806C63]'}`} />}
                </button>

                {/* ACCOUNT DROPDOWN */}
                {user && accountOpen && (
                  <div className="absolute right-0 top-full z-70 pt-2 sm:pt-3">
                    <div className="w-64 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-[#E3D6CE] bg-white shadow-[0_20px_50px_rgba(53,28,24,0.12)] sm:w-72 sm:rounded-2xl">
                      {/* PROFILE HEADER */}
                      <div className="border-b border-[#EEE5DF] bg-linear-to-br from-[#FBF5F0] to-[#F7EEE7] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E2CEC5] bg-[#F5E9E2] text-[#9D2932] sm:h-12 sm:w-12">
                            {userAvatar ? <img src={userAvatar} alt={user.name} className="h-full w-full object-cover" /> : <User size={16} strokeWidth={2} />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-extrabold text-[#351C18] sm:text-sm">{user.name}</p>

                            <p className="mt-0.5 truncate text-[8px] text-[#9A857B] sm:text-[10px]">{user.email}</p>

                            <span className="mt-1 inline-flex items-center rounded-full bg-[#F3E3DC] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-[#9D2932] sm:mt-1.5 sm:px-2 sm:text-[8px]">My Account</span>
                          </div>
                        </div>
                      </div>

                      {/* MENU */}
                      <div className="p-1 sm:p-2">
                        {/* PROFILE */}
                        <Link
                          to="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="group flex items-center gap-2 rounded-xl px-2 py-2 text-[10px] font-semibold text-[#493631] transition-colors duration-200 hover:bg-[#F8ECE6] hover:text-[#9D2932] sm:gap-3 sm:px-3 sm:py-3 sm:text-xs"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#9D2932] transition-colors group-hover:bg-[#F2DDD5] sm:h-9 sm:w-9">
                            <User size={14} strokeWidth={1.9} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold">My Profile</span>

                            <span className="mt-0.5 hidden truncate text-[9px] font-normal text-[#9A857B] sm:block">Manage your personal information</span>
                          </span>

                          <ArrowRight size={12} className="shrink-0 text-[#B6A39A] transition-colors group-hover:text-[#9D2932]" />
                        </Link>

                        {/* ORDERS */}
                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="group mt-0.5 flex items-center gap-2 rounded-xl px-2 py-2 text-[10px] font-semibold text-[#493631] transition-colors duration-200 hover:bg-[#F8ECE6] hover:text-[#9D2932] sm:mt-1 sm:gap-3 sm:px-3 sm:py-3 sm:text-xs"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#9D2932] transition-colors group-hover:bg-[#F2DDD5] sm:h-9 sm:w-9">
                            <Package size={14} strokeWidth={1.9} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold">My Orders</span>

                            <span className="mt-0.5 hidden truncate text-[9px] font-normal text-[#9A857B] sm:block">Track and manage your orders</span>
                          </span>

                          <ArrowRight size={12} className="shrink-0 text-[#B6A39A] transition-colors group-hover:text-[#9D2932]" />
                        </Link>
                      </div>

                      {/* LOGOUT */}
                      <div className="border-t border-[#EEE5DF] p-1 sm:p-2">
                        <button
                          type="button"
                          onClick={() => {
                            logout()
                            setAccountOpen(false)
                            setNotificationOpen(false)
                            setMobileSearchOpen(false)
                            navigate('/')
                          }}
                          className="group flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-[10px] font-semibold text-[#9D2932] transition-colors duration-200 hover:bg-[#FFF1F1] sm:gap-3 sm:px-3 sm:py-3 sm:text-xs"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F1] text-[#9D2932] transition-colors group-hover:bg-[#FFE5E5] sm:h-9 sm:w-9">
                            <LogOut size={14} strokeWidth={1.9} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block font-bold">Logout</span>

                            <span className="mt-0.5 hidden truncate text-[9px] font-normal text-[#B17A73] sm:block">Sign out from your account</span>
                          </span>

                          <ArrowRight size={12} className="shrink-0 text-[#D1AAA4]" />
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
                      notificationOpen ? 'border-[#CFA8A0] bg-[#EFE0D7] text-[#9D2932]' : 'border-[#E4D5CD] bg-[#F7EEE7] text-[#5B423A] hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#9D2932]'
                    }`}
                  >
                    <Bell size={18} strokeWidth={1.9} />

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#FFFCF9] bg-[#9D2932] px-1 text-[7px] font-extrabold leading-none text-white sm:h-4.5 sm:min-w-4.5 sm:text-[8px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATION DROPDOWN */}
                  {notificationOpen && (
                    <div className="absolute right-0 top-full z-80 pt-2 sm:pt-3">
                      <div className="w-72 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-[#E3D6CE] bg-white shadow-[0_20px_50px_rgba(53,28,24,0.12)] sm:w-96 sm:rounded-2xl">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-[#EEE5DF] bg-linear-to-r from-[#FFFCFA] to-[#FBF5F0] px-3 py-2.5 sm:px-5 sm:py-4">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#9D2932] sm:h-8 sm:w-8">
                              <Bell size={14} strokeWidth={1.9} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-[11px] font-black text-[#351C18] sm:text-sm">Notifications</h3>

                              <p className="mt-0.5 truncate text-[7px] text-[#9A857B] sm:text-[9px]">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You are all caught up'}</p>
                            </div>
                          </div>

                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllRead}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#9D2932] transition-colors duration-200 hover:bg-[#F8ECE6] hover:text-[#7D2028] sm:h-auto sm:w-auto sm:gap-1 sm:px-2 sm:py-1.5 sm:text-[9px]"
                              aria-label="Mark all as read"
                            >
                              <CheckCheck size={13} />

                              <span className="hidden sm:inline">Mark all</span>
                            </button>
                          )}
                        </div>

                        {/* EMPTY */}
                        {notifications.length === 0 ? (
                          <div className="flex min-h-36 flex-col items-center justify-center px-4 text-center sm:min-h-56 sm:px-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#9D2932] sm:h-14 sm:w-14 sm:rounded-2xl">
                              <Bell size={19} strokeWidth={1.7} />
                            </div>

                            <p className="mt-2.5 text-[11px] font-bold text-[#493631] sm:mt-4 sm:text-sm">No notifications yet</p>

                            <p className="mt-1 max-w-48 text-[8px] leading-3.5 text-[#9A857B] sm:max-w-55 sm:text-[10px] sm:leading-4">We will keep you updated about your orders and account activity.</p>
                          </div>
                        ) : (
                          <div className="max-h-[45vh] overflow-y-auto sm:max-h-96">
                            {notifications.slice(0, 3).map((notification) => {
                              const Icon = getNotificationIcon(notification.type)

                              return (
                                <button
                                  key={notification._id}
                                  type="button"
                                  onClick={() => handleNotificationClick(notification)}
                                  className={`group flex w-full items-start gap-2 border-b border-[#F1E9E4] px-3 py-2.5 text-left transition-colors duration-200 last:border-b-0 hover:bg-[#FFF8F4] sm:gap-3 sm:px-5 sm:py-4 ${
                                    !notification.isRead ? 'bg-[#FFFCFA]' : 'bg-white'
                                  }`}
                                >
                                  {/* ICON */}
                                  <div className={`relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${notification.isRead ? 'bg-[#F7EEE7] text-[#806C63]' : 'bg-[#F8E8E5] text-[#9D2932]'}`}>
                                    <Icon size={13} strokeWidth={1.8} />

                                    {!notification.isRead && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-white bg-[#9D2932]" />}
                                  </div>

                                  {/* CONTENT */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`min-w-0 truncate text-[8px] sm:text-[11px] ${notification.isRead ? 'font-semibold text-[#493631]' : 'font-extrabold text-[#351C18]'}`}>{notification.title}</p>

                                      <span className="shrink-0 text-[6px] font-medium text-[#A8968D] sm:text-[8px]">{formatNotificationDate(notification.createdAt)}</span>
                                    </div>

                                    <p className="mt-0.5 line-clamp-2 text-[7px] leading-3 text-[#806C63] sm:mt-1 sm:text-[10px] sm:leading-4">{notification.message}</p>

                                    {notification.orderId && (
                                      <span className="mt-1 inline-flex items-center gap-1 text-[6px] font-extrabold text-[#9D2932] sm:mt-2 sm:text-[9px]">
                                        View order
                                        <ArrowRight size={8} />
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
                            className="flex w-full items-center justify-center gap-1.5 border-t border-[#EEE5DF] bg-[#FFFCFA] px-3 py-2.5 text-[7px] font-extrabold text-[#9D2932] transition-colors duration-200 hover:bg-[#F8ECE6] sm:gap-2 sm:px-5 sm:py-4 sm:text-[10px]"
                          >
                            View all notifications
                            <ArrowRight size={11} />
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
                  className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E4D5CD] bg-[#F7EEE7] text-[#5B423A] transition-colors duration-200 hover:border-[#CFA8A0] hover:bg-[#EFE0D7] hover:text-[#9D2932] sm:h-10 sm:w-10"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} strokeWidth={1.9} />

                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#FFFCF9] bg-[#9D2932] px-1 text-[7px] font-extrabold leading-none text-white sm:h-4.5 sm:min-w-4.5 sm:text-[8px]">
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

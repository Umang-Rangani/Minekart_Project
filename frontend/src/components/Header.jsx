import { Search, ChevronDown, ShoppingCart, UserCircle, Store, User, Package, LogOut } from 'lucide-react'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'

export default function Header() {
  const { logout, user, setShowLogin } = useUser()
  const { cart } = useCart()
  const navigate = useNavigate()

  const [accountOpen, setAccountOpen] = useState(false)
  const [search, setSearch] = useState(() => {
    return localStorage.getItem('minekart_search') || ''
  })

  const handleSearch = () => {
    const query = search.trim()

    if (!query) return

    localStorage.setItem('minekart_search', query)

    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  useEffect(() => {
    localStorage.setItem('minekart_search', search)
  }, [search])

  return (
    <header className="fixed left-0 top-0 z-50 w-full text-[#351C18]">
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
        <div className="mx-auto flex h-18 max-w-[1600px] items-center gap-3 px-3 sm:h-19 sm:px-5 lg:gap-6 lg:px-7">
          {/* LOGO */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
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
          <div className="relative shrink-0" onMouseEnter={() => user && setAccountOpen(true)} onMouseLeave={() => user && setAccountOpen(false)}>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setShowLogin(true)
                } else {
                  setAccountOpen((prev) => !prev)
                }
              }}
              className="group flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-200 hover:bg-[#F7EEE7] sm:px-2"
            >
              {/* AVATAR */}
              {user?.avatar ? (
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#E7D8D0] bg-[#F7EEE7] sm:h-10 sm:w-10">
                  <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D5CC] bg-[#F7EEE7] text-[#8E181F] transition-all duration-200 group-hover:border-[#CDAFA4] sm:h-10 sm:w-10">
                  <UserCircle size={23} strokeWidth={1.8} />
                </div>
              )}

              {/* ACCOUNT TEXT */}
              <div className="hidden max-w-25 text-left lg:block">
                <p className="text-[8px] font-medium uppercase tracking-wider text-[#9A857B]">{user ? 'Welcome back' : 'Account'}</p>

                <p className="mt-0.5 truncate text-xs font-extrabold text-[#351C18]">{user ? user.name : 'Login'}</p>
              </div>

              {user && <ChevronDown size={14} strokeWidth={2} className={`hidden transition-all duration-200 lg:block ${accountOpen ? 'rotate-180 text-[#A51D26]' : 'text-[#806C63]'}`} />}
            </button>

            {/* ACCOUNT DROPDOWN */}
            {user && accountOpen && (
              <div className="absolute right-0 top-full z-50 pt-2">
                <div className="w-65 overflow-hidden rounded-2xl border border-[#E3D6CE] bg-white p-1.5 shadow-[0_18px_45px_rgba(53,28,24,0.16)]">
                  {/* USER INFO */}
                  <div className="mb-1.5 flex items-center gap-3 rounded-xl bg-linear-to-r from-[#FBF4EF] to-[#F7EEE7] px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                      {user.avatar ? <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover" /> : <User size={17} strokeWidth={2} />}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-[#351C18]">{user.name}</p>

                      <p className="mt-0.5 truncate text-[10px] text-[#9A857B]">{user.email}</p>
                    </div>
                  </div>

                  {/* PROFILE */}
                  <Link to="/profile" onClick={() => setAccountOpen(false)} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-colors group-hover:bg-[#F2DDD5]">
                      <User size={16} />
                    </span>

                    <span>My Profile</span>

                    <ChevronDown size={13} className="ml-auto -rotate-90 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>

                  {/* ORDERS */}
                  <Link to="/orders" onClick={() => setAccountOpen(false)} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-colors group-hover:bg-[#F2DDD5]">
                      <Package size={16} />
                    </span>

                    <span>My Orders</span>

                    <ChevronDown size={13} className="ml-auto -rotate-90 opacity-0 transition-all group-hover:opacity-100" />
                  </Link>

                  <div className="my-1.5 border-t border-[#EEE5DF]" />

                  {/* LOGOUT */}
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setAccountOpen(false)
                      navigate("/")
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#A51D26] transition-all duration-200 hover:bg-[#FFF0F0]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF1F1] transition-colors group-hover:bg-[#FFE5E5]">
                      <LogOut size={16} />
                    </span>

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          {user && <div className="hidden h-9 w-px bg-[#E5D8D0] sm:block" />}

          {/* CART */}
          {user && (
            <button type="button" onClick={() => navigate('/cart')} className="group relative flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1.5 transition-all duration-200 hover:bg-[#F7EEE7] sm:px-2">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#493631] transition-all duration-200 group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F] sm:h-10 sm:w-10">
                  <ShoppingCart size={21} strokeWidth={1.9} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                </div>

                {/* CART BADGE */}
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#A51D26] px-1 text-[8px] font-extrabold text-white shadow-sm">{cart?.totalQuantity || 0}</span>
              </div>

              <span className="hidden text-xs font-extrabold text-[#493631] md:block">Cart</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

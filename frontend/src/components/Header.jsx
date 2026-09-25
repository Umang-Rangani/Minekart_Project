import { Search, ChevronDown, ShoppingCart, UserCircle, Store, User, Package, LogOut, LogInIcon, Heart } from 'lucide-react'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'

export default function Header() {
  const { logout, user, setShowLogin } = useUser()
  const { cart } = useCart()
  const navigate = useNavigate()

  const [accountOpen, setAccountOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white text-[#351C18] shadow-[0_3px_18px_rgba(63,37,30,0.10)]">
      {/* ==
          TOP OFFER BAR
      === */}
      <div className="bg-[#351C18] text-white">
        <div className="mx-auto flex h-8 max-w-[1600px] items-center justify-between px-4 text-[10px] font-medium sm:px-7 sm:text-[11px]">
          <div className="flex items-center gap-4 sm:gap-6">
            <span>Free Shipping on Orders Above ₹999</span>

            <span className="hidden h-3.5 w-px bg-white/20 sm:block" />

            <span className="hidden sm:inline">100% Genuine Products</span>

            <span className="hidden md:inline">Easy Returns</span>
          </div>

          <span className="hidden lg:inline text-white/80">Need Help? 1800-123-4567</span>
        </div>
      </div>

      {/* ==
          MAIN HEADER
      === */}
      <div className="border-b border-[#E8DDD4] bg-[#FFFDFC]">
        <div className="mx-auto flex h-19 max-w-[1600px] items-center gap-4 px-4 sm:px-7 lg:gap-7">
          {/*  LOGO  */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A51D26] text-white shadow-md shadow-[#A51D26]/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#8E181F]">
              <Store size={23} strokeWidth={2} />
            </div>

            <div className="hidden leading-none sm:block">
              <h1 className="text-[24px] font-black tracking-tight text-[#351C18]">
                Mine
                <span className="text-[#A51D26]">Kart</span>
              </h1>

              <p className="mt-1 text-[8px] font-bold tracking-[0.18em] text-[#9A857B]">SHOP MORE • LIVE BETTER</p>
            </div>
          </Link>

          {/*  SEARCH  */}
          <div className="group relative min-w-0 flex-1">
            <div className="flex h-11 w-full items-center overflow-hidden rounded-lg border border-[#DCCFC7] bg-[#F8F4F1] transition-all duration-200 focus-within:border-[#A51D26] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(165,29,38,0.06)]">
              <Search size={19} strokeWidth={2} className="ml-3.5 shrink-0 text-[#806C63] transition-colors group-focus-within:text-[#A51D26]" />

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
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#351C18] outline-none placeholder:text-[#9A857B]"
              />

              <button type="button" onClick={handleSearch} className="mr-1 flex h-9 items-center justify-center rounded-md bg-[#A51D26] px-5 text-xs font-bold text-white transition-all duration-200 hover:bg-[#8E181F] active:scale-95">
                <span className="hidden sm:inline">Search</span>

                <Search size={15} className="sm:hidden" />
              </button>
            </div>
          </div>

          {/*  ACCOUNT  */}
          <div className="relative shrink-0" onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setShowLogin(true)
                }
              }}
              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#F7EEE7]"
            >
              {/* Avatar */}
              {!user?.avatar ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2D5CC] bg-[#F7EEE7] text-[#8E181F]">
                  <UserCircle size={23} />
                </div>
              ) : (
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-[#E5D4CA]">
                  <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
              )}

              <div className="hidden text-left lg:block">
                <p className="text-[9px] font-medium text-[#9A857B]">{user ? 'Welcome' : 'Hello, Sign in'}</p>

                {user ? (
                  <button className="max-w-24 truncate text-xs font-bold text-[#351C18]">{user.name}</button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="max-w-24 truncate text-xs font-bold text-[#351C18]"
                  >
                    {/* <LogInIcon size={16} /> */}
                    <span className="hidden sm:inline">Login</span>
                  </button>
                )}
              </div>

              {user && <ChevronDown size={14} className={`hidden lg:block transition-transform duration-200 ${accountOpen ? 'rotate-180 text-[#A51D26]' : 'text-[#806C63]'}`} />}
            </button>

            {/*  ACCOUNT DROPDOWN  */}
            {user && accountOpen && (
              <div className="absolute right-0 top-full z-50 pt-2">
                <div className="w-60 overflow-hidden rounded-xl border border-[#E3D6CE] bg-white p-1.5 shadow-[0_15px_40px_rgba(53,28,24,0.15)]">
                  {/* Account Header */}
                  <div className="mb-1 flex items-center gap-3 rounded-lg bg-[#F8F2EE] px-3 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A51D26] text-white">
                      {user.avatar ? <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full rounded-full object-cover" /> : <User size={17} />}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#351C18]">{user.name}</p>

                      <p className="truncate text-[10px] text-[#9A857B]">{user.email}</p>
                    </div>
                  </div>

                  {/* Profile */}
                  <Link to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#493631] transition-colors hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                    <User size={17} />
                    <span>My Profile</span>
                  </Link>

                  {/* Orders */}
                  <Link to="/orders" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#493631] transition-colors hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                    <Package size={17} />
                    <span>My Orders</span>
                  </Link>

                  {/* Wishlist
                  <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#493631] transition-colors hover:bg-[#F8ECE6] hover:text-[#8E181F]">
                    <Heart size={17} />
                    <span>Wishlist</span>
                  </button> */}

                  <div className="my-1.5 border-t border-[#EEE5DF]" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setAccountOpen(false)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#A51D26] transition-colors hover:bg-[#FFF0F0]"
                  >
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/*  CART  */}
          {user && (
            <>
              <div className="hidden h-8 w-px bg-[#E5D8D0] sm:block" />

              <button type="button" onClick={() => navigate('/cart')} className="group relative flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#F7EEE7]">
                <div className="relative">
                  <ShoppingCart size={23} strokeWidth={1.9} className="text-[#493631] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-[#8E181F]" />

                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A51D26] px-1 text-[9px] font-bold text-white shadow-sm">{cart?.totalQuantity || 0}</span>
                </div>

                <span className="hidden text-xs font-bold text-[#493631] md:block">Cart</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

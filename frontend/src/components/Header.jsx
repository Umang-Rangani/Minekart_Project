import { Search, ChevronDown, ShoppingCart, UserCircle, Store, User, Package, LogOut, LogInIcon } from 'lucide-react'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'

export default function Header() {
  const { logout, user, setShowLogin } = useUser()
  const { cart } = useCart()
  const navigate = useNavigate()

  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-[#FFFDFC] text-[#351C18] shadow-[0_4px_25px_rgba(63,37,30,0.10)]">
      {/* Top Offer Bar */}
      <div className="bg-linear-to-r from-[#321411] via-[#6F171C] to-[#9F2027] text-white">
        <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between px-5 text-xs font-medium sm:px-7">
          <div className="flex items-center gap-5 sm:gap-7">
            <span className="hidden sm:inline">Free Shipping on Orders Above ₹999</span>

            <span className="hidden h-4 w-px bg-white/30 sm:block" />

            <span className="hidden md:inline">100% Genuine Products</span>

            <span className="hidden sm:inline">Easy Returns</span>
          </div>

          <span className="hidden sm:inline">Need Help? 1800-123-4567</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-[#E9DED6] bg-[#FFFDFC]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-4 sm:px-7 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#75171C] to-[#B3262D] text-white shadow-lg shadow-[#75171C]/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
              <Store size={25} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
            </div>

            <div className="hidden leading-none sm:block">
              <h1 className="text-[25px] font-extrabold tracking-tight text-[#351C18]">
                Mine
                <span className="text-[#A51D26]">Kart</span>
              </h1>

              <p className="mt-1 text-[9px] font-semibold tracking-[0.18em] text-[#907A70]">SHOP MORE • LIVE BETTER</p>
            </div>
          </Link>

          {/* Search */}
          <div className="group relative min-w-0 flex-1">
            <div className="flex h-12 w-full items-center overflow-hidden rounded-2xl border border-[#E3D6CE] bg-[#FCF8F4] transition-all duration-300 focus-within:border-[#A51D26] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(165,29,38,0.07)]">
              <Search size={21} strokeWidth={2} className="ml-4 shrink-0 text-[#806C63] transition-colors duration-300 group-focus-within:text-[#A51D26]" />

              <input type="text" placeholder="Search for Products, Brands and More..." className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-[#351C18] outline-none placeholder:text-[#9A8981]" />

              <button
                type="button"
                className="mr-1.5 flex h-9 items-center gap-2 rounded-xl bg-linear-to-r from-[#75171C] to-[#A51D26] px-5 text-sm font-semibold text-white shadow-md shadow-[#75171C]/20 transition-all duration-300 hover:from-[#611217] hover:to-[#8E181F] hover:shadow-lg active:scale-95"
              >
                <span className="hidden sm:inline">Search</span>

                <Search size={16} className="sm:hidden" />
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="relative shrink-0" onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
            <button type="button" className="flex items-center gap-2 rounded-xl px-2 py-2 text-[#493631] transition-all duration-300 hover:bg-[#F6ECE5] hover:text-[#8E181F]">
              {/* Avatar */}
              {!user?.avatar ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4D7CF] bg-[#F7EFE9] text-[#7D171C]">
                  <UserCircle size={27} />
                </div>
              ) : (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#E7D4CA]">
                  <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" />
                </div>
              )}

              {/* Name */}
              <div className="hidden text-left xl:block">
                <p className="text-[10px] font-medium text-[#9A857B]">Welcome</p>

                <p className="max-w-27 truncate text-sm font-semibold text-[#351C18]">{user ? user.name : 'Account'}</p>
              </div>

              <ChevronDown size={16} className={`transition-transform duration-300 ${accountOpen ? 'rotate-180 text-[#A51D26]' : 'text-[#725E55]'}`} />
            </button>

            {/* Account Dropdown */}
            {accountOpen && (
              <div className="absolute right-0 top-full z-50 pt-2">
                <div className="w-56 overflow-hidden rounded-2xl border border-[#E5D8D0] bg-[#FFFDFC] p-1.5 shadow-[0_18px_45px_rgba(65,35,28,0.16)] animate-[fadeIn_.2s_ease-out]">
                  {/* Profile */}
                  <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:pl-5 hover:text-[#8E181F]">
                    <User size={18} />

                    <span>Profile</span>
                  </Link>

                  {/* Login */}
                  {!user && (
                    <button
                      type="button"
                      onClick={() => setShowLogin(true)}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:pl-5 hover:text-[#8E181F]"
                    >
                      <LogInIcon size={18} />

                      <span>Login</span>
                    </button>
                  )}

                  {/* Orders */}
                  <Link to="/orders" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#493631] transition-all duration-200 hover:bg-[#F8ECE6] hover:pl-5 hover:text-[#8E181F]">
                    <Package size={18} />

                    <span>Orders</span>
                  </Link>

                  <div className="my-1 border-t border-[#EDE2DB]" />

                  {/* Logout */}
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setAccountOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-[#A51D26] transition-all duration-200 hover:bg-[#FFF0F0] hover:pl-5"
                    >
                      <LogOut size={18} />

                      <span>Logout</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          {user && (
            <button type="button" onClick={() => navigate('/cart')} className="group relative flex shrink-0 items-center gap-2 rounded-xl px-2 py-2 text-[#493631] transition-all duration-300 hover:bg-[#F6ECE5] hover:text-[#8E181F]">
              <div className="relative">
                <ShoppingCart size={26} strokeWidth={1.8} className="transition-transform duration-300 group-hover:-rotate-6" />

                <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-linear-to-r from-[#8E181F] to-[#B5262D] px-1 text-[10px] font-bold text-white shadow-sm">
                  {cart?.totalQuantity || 0}
                </span>
              </div>

              <span className="hidden text-sm font-semibold sm:block">Cart</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

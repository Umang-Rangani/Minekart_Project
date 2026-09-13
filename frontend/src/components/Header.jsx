import { Search, MapPin, ChevronDown, ShoppingCart, UserCircle, Zap, Store, Bike, LogInIcon } from 'lucide-react'
import { User, Package, LogOut } from 'lucide-react'
import { useUser } from '../context/userProvider'
// import CategoryList from '../user/CategoryList'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const { logout, user, setShowLogin } = useUser()
  // account button dropdown
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="w-full border-b border-[#E2E8F0] bg-white">
    

      {/*  SEARCH + ACCOUNT  */}
      <div className="flex items-center gap-5 px-7 py-4 ">
        <div className="flex items-center gap-4">
          {/* Brand */}
          <Link to={'/'} className="flex h-14 w-40 items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] text-white shadow-md shadow-blue-100">
            <Store size={25} strokeWidth={2} />

            <span className="text-lg font-bold tracking-wide">MineKart</span>
          </Link>
        </div>
        {/* Search */}
        <div className="relative flex-1">
          <Search size={23} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B]" />

          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            className=" h-14 w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] pl-14 pr-5 text-[17px] text-[#172033] outline-none placeholder:text-[#64748B] transition focus:border-[#1D4ED8] focus:bg-white focus:ring-2 focus:ring-[#DBEAFE] "
          />
        </div>

        {/* Account */}
        <div className="relative" onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
          {/* Account */}
          <button className="flex items-center gap-2 px-2 text-[#172033] transition hover:text-[#1D4ED8]">
            {!user?.avatar ? (
              <UserCircle size={30} />
            ) : (
              <div className="size-10 shrink-0 overflow-hidden rounded-full bg-[#dfe5e7]">
                <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
              </div>
            )}

            <span className="text-[16px]">{user ? user.name : 'Account'}</span>

            <ChevronDown size={17} className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {accountOpen && (
            <div className="absolute right-0 top-full z-50 pt-2">
              <div className="w-52 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
                <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                  <User size={19} />
                  <span>Profile</span>
                </button>

                {!user && (
                  <button onClick={() => setShowLogin(true)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                    <LogInIcon size={19} />
                    <span>Login</span>
                  </button>
                )}

                <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                  <Package size={19} />
                  <span>Orders</span>
                </button>

                <div className="border-t border-[#E2E8F0]" />
                {user && (
                  <button onClick={() =>  {
                    logout()
                    setAccountOpen(false)
                  }} className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50">
                    <LogOut size={19} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* More */}
        {/* <button className="flex items-center gap-2 px-2 text-[#172033] transition hover:text-[#1D4ED8]">
          <span className="text-[16px]">More</span>

          <ChevronDown size={17} />
        </button> */}

        {/* Cart */}
        <button className="relative flex items-center gap-2 px-2 text-[#172033] transition hover:text-[#1D4ED8]">
          <ShoppingCart size={27} />

          <span className="text-[16px]">Cart</span>

          {/* Cart Count */}
          <span className=" absolute -right-1 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-xs font-bold text-white shadow-sm ">1</span>
        </button>
      </div>
    </header>
  )
}

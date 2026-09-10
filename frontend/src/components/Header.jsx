import React from 'react'
import { Search, MapPin, ChevronDown, ShoppingCart, UserCircle, Zap, Store, Shirt, Smartphone, Laptop, Sparkles, Home, Tv, Baby, Utensils, Car, Dumbbell, Armchair, BookOpen, Bike, LogIn } from 'lucide-react'
import { User, UserPlus, Package, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/userProvider'

const categories = [
  { name: 'For You', icon: Zap },
  { name: 'Fashion', icon: Shirt },
  { name: 'Mobiles', icon: Smartphone },
  { name: 'Electronics', icon: Laptop },
  { name: 'Beauty', icon: Sparkles },
  { name: 'Home', icon: Home },
  { name: 'Appliances', icon: Tv },
  { name: 'Toys', icon: Baby },
  { name: 'Food', icon: Utensils },
  { name: 'Auto', icon: Car },
  { name: 'Sports', icon: Dumbbell },
  { name: 'Furniture', icon: Armchair },
  { name: 'Books', icon: BookOpen },
  { name: '2 Wheelers', icon: Bike },
]

export default function Header() {
  const [accountOpen, setAccountOpen] = useState(false)
  const { logout, user } = useUser()

  return (
    <header className="w-full border-b border-[#E2E8F0] bg-white">
      {/* ================= TOP HEADER ================= */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Brand */}
        <div className="flex items-center gap-4">
          {/* Brand */}
          <div className="flex h-14 w-40 items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] text-white shadow-md shadow-blue-100">
            <Store size={25} strokeWidth={2} />

            <span className="text-lg font-bold tracking-wide">MineKart</span>
          </div>

          {/* Travel */}
          <div className="flex h-14 w-36 items-center justify-center gap-2 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] text-[#1D4ED8]">
            <Bike size={25} />

            <span className="font-semibold">Travel</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={19} className="fill-[#1D4ED8] text-[#1D4ED8]" />

          <span className="font-semibold text-[#172033]">Delivery Location at</span>

          <button className="font-semibold text-[#1D4ED8] transition hover:text-[#F59E0B]">
            {user.address}, {user.city},{user.pincode}
          </button>

          {/* <span className="text-lg text-[#94A3B8]">›</span> */}

          {/* Coin */}
          <div className="ml-6 flex items-center gap-1 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[#B45309]">
            <Zap size={17} className="fill-[#F59E0B] text-[#F59E0B]" />

            <span className="font-semibold">0</span>
          </div>
        </div>
      </div>

      {/* ================= SEARCH + ACCOUNT ================= */}
      <div className="flex items-center gap-5 px-7 pb-3">
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
            {!user.avatar ? (
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
                  <Link to={'/register'} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                    <UserPlus size={19} />
                    <span>Register</span>
                  </Link>
                )}

                <button className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                  <Package size={19} />
                  <span>Orders</span>
                </button>

                <div className="border-t border-[#E2E8F0]" />
                {user && (
                  <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50">
                    <LogOut size={19} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* More */}
        <button className="flex items-center gap-2 px-2 text-[#172033] transition hover:text-[#1D4ED8]">
          <span className="text-[16px]">More</span>

          <ChevronDown size={17} />
        </button>

        {/* Cart */}
        <button className="relative flex items-center gap-2 px-2 text-[#172033] transition hover:text-[#1D4ED8]">
          <ShoppingCart size={27} />

          <span className="text-[16px]">Cart</span>

          {/* Cart Count */}
          <span className=" absolute -right-1 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-xs font-bold text-white shadow-sm ">1</span>
        </button>
      </div>

      {/* ================= CATEGORY BAR ================= */}
      <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#F8FAFC] px-7">
        {categories.map((category, index) => {
          const Icon = category.icon
          const active = index === 0

          return (
            <button key={category.name} className={` group relative flex min-w-18 flex-col items-center gap-1 px-2 py-4 text-sm transition ${active ? 'font-semibold text-[#1D4ED8]' : 'text-[#64748B] hover:text-[#1D4ED8]'} `}>
              <Icon size={27} strokeWidth={1.8} className={` transition ${active ? 'text-[#1D4ED8]' : 'text-[#64748B] group-hover:text-[#1D4ED8]'} `} />

              <span className="whitespace-nowrap">{category.name}</span>

              {/* Active underline */}
              {active && <span className=" absolute bottom-0 left-2 right-2 h-1 rounded-t-full bg-[#1D4ED8] " />}
            </button>
          )
        })}
      </div>
    </header>
  )
}

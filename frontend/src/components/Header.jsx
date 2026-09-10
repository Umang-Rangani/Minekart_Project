import React from 'react'
import { Search, MapPin, ChevronDown, ShoppingCart, UserCircle, Zap, Store, Shirt, Smartphone, Laptop, Sparkles, Home, Tv, Baby, Utensils, Car, Dumbbell, Armchair, BookOpen, Bike } from 'lucide-react'

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
  return (
  <header className="w-full border-b border-[#E5E5E1] bg-white">
  {/* ================= TOP HEADER ================= */}
  <div className="flex items-center justify-between px-6 py-4">
    {/* Left - Brand */}
    <div className="flex items-center gap-4">
      {/* Brand */}
      <div className="flex h-14 w-40 items-center justify-center gap-2 rounded-xl bg-[#292929] text-white shadow-sm">
        <Store size={25} />
        <span className="text-lg font-bold tracking-wide">MineKart</span>
      </div>

      {/* Travel */}
      <div className="flex h-14 w-36 items-center justify-center gap-2 rounded-xl bg-[#F3F3F1] text-[#292929]">
        <Bike size={25} />
        <span className="font-semibold">Travel</span>
      </div>
    </div>

    {/* Location */}
    <div className="flex items-center gap-2 text-sm">
      <MapPin
        size={19}
        className="fill-[#292929] text-[#292929]"
      />

      <span className="font-semibold text-[#292929]">
        Location not set
      </span>

      <button className="font-semibold text-[#292929] underline-offset-2 hover:underline">
        Select delivery location
      </button>

      <span className="text-lg text-[#777]">›</span>

      {/* Coin */}
      <div className="ml-6 flex items-center gap-1 rounded-lg bg-[#F3F3F1] px-3 py-2 text-[#292929]">
        <Zap
          size={17}
          className="fill-[#292929]"
        />

        <span className="font-semibold">0</span>
      </div>
    </div>
  </div>

  {/* ================= SEARCH + ACCOUNT ================= */}
  <div className="flex items-center gap-5 px-7 pb-3">
    {/* Search */}
    <div className="relative flex-1">
      <Search
        size={23}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#777]"
      />

      <input
        type="text"
        placeholder="Search for Products, Brands and More"
        className="
          h-14
          w-full
          rounded-xl
          border
          border-[#DCDCD7]
          bg-[#F6F6F4]
          pl-14
          pr-5
          text-[17px]
          text-[#292929]
          outline-none
          placeholder:text-[#777]
          transition
          focus:border-[#292929]
          focus:bg-white
        "
      />
    </div>

    {/* Account */}
    <button className="flex items-center gap-2 px-2 text-[#292929] transition hover:text-[#666]">
      <UserCircle size={25} />

      <span className="text-[16px]">
        Account
      </span>

      <ChevronDown size={17} />
    </button>

    {/* More */}
    <button className="flex items-center gap-2 px-2 text-[#292929] transition hover:text-[#666]">
      <span className="text-[16px]">
        More
      </span>

      <ChevronDown size={17} />
    </button>

    {/* Cart */}
    <button className="relative flex items-center gap-2 px-2 text-[#292929]">
      <ShoppingCart size={27} />

      <span className="text-[16px]">
        Cart
      </span>

      {/* Cart Count */}
      <span
        className="
          absolute
          -right-1
          -top-3
          flex
          h-5
          min-w-5
          items-center
          justify-center
          rounded-full
          bg-[#292929]
          px-1
          text-xs
          font-bold
          text-white
        "
      >
        1
      </span>
    </button>
  </div>

  {/* ================= CATEGORY BAR ================= */}
  <div className="flex items-center justify-between border-t border-[#E5E5E1] bg-[#FAFAF8] px-7">
    {categories.map((category, index) => {
      const Icon = category.icon
      const active = index === 0

      return (
        <button
          key={category.name}
          className={`
            group
            relative
            flex
            min-w-[75px]
            flex-col
            items-center
            gap-1
            px-2
            py-4
            text-sm
            transition
            ${
              active
                ? 'font-semibold text-[#292929]'
                : 'text-[#666] hover:text-[#292929]'
            }
          `}
        >
          <Icon
            size={27}
            strokeWidth={1.8}
            className={`
              transition
              ${
                active
                  ? 'text-[#292929]'
                  : 'text-[#777] group-hover:text-[#292929]'
              }
            `}
          />

          <span className="whitespace-nowrap">
            {category.name}
          </span>

          {/* Active underline */}
          {active && (
            <span
              className="
                absolute
                bottom-0
                left-2
                right-2
                h-[3px]
                rounded-t-full
                bg-[#292929]
              "
            />
          )}
        </button>
      )
    })}
  </div>
</header>
  )
}

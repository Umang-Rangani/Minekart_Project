import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HelpCircle, ShoppingBag, Truck, RotateCcw, CreditCard, UserRound, MessageCircle, Search } from 'lucide-react'

export default function HelpCenter() {
  const helpItems = [
    {
      icon: ShoppingBag,
      title: 'Orders & Shopping',
      description: 'Get help with placing and managing your orders.',
      to: '/orders',
    },
    {
      icon: Truck,
      title: 'Delivery & Tracking',
      description: 'Track your order and check delivery information.',
      to: '/track-order',
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      description: 'Learn about returns, refunds and eligible products.',
      to: '/returns',
    },
    {
      icon: CreditCard,
      title: 'Payments',
      description: 'Get help with payment and order payment status.',
      to: '/orders',
    },
    {
      icon: UserRound,
      title: 'My Account',
      description: 'Manage your profile and saved account details.',
      to: '/profile',
    },
    {
      icon: MessageCircle,
      title: 'Contact Us',
      description: 'Need more help? Get in touch with MineKart.',
      to: '/contact',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7EEE7]">
      <div className="mx-auto max-w-350 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />
              <HelpCircle size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Help Center</h1>
              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">How can we help you?</p>
            </div>
          </div>

          <Link to="/contact" className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#A51D26] px-2.5 text-[9px] font-bold text-white transition hover:bg-[#7D171C] sm:px-3 sm:text-[10px]">
            <MessageCircle size={13} />
            Contact Us
          </Link>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-[0_4px_16px_rgba(73,54,49,0.05)] sm:p-5">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-base font-extrabold text-[#351C18] sm:text-lg">What can we help you with?</h2>

            <div className="mt-4 flex h-11 items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3">
              <Search size={18} className="shrink-0 text-[#806C63]" />
              <input type="text" placeholder="Search for help..." className="w-full bg-transparent text-sm text-[#351C18] outline-none placeholder:text-[#A8978F]" />
            </div>
          </div>
        </div>

        {/* Help Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {helpItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-[0_3px_12px_rgba(73,54,49,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D9B7B2] hover:shadow-[0_8px_24px_rgba(73,54,49,0.08)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#A51D26] transition-colors group-hover:bg-[#A51D26] group-hover:text-white">
                    <Icon size={19} />
                  </div>

                  <ArrowRight size={16} className="text-[#B6A49C] transition-all group-hover:translate-x-1 group-hover:text-[#A51D26]" />
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-[#351C18]">{item.title}</h3>

                <p className="mt-1.5 text-xs leading-5 text-[#806C63]">{item.description}</p>
              </Link>
            )
          })}
        </div>

        {/* Bottom */}
        <div className="mt-5 rounded-2xl border border-[#E8DDD4] bg-[#351C18] p-5 text-center text-white sm:p-6">
          <MessageCircle size={22} className="mx-auto text-[#E17B7F]" />
          <h3 className="mt-2 text-sm font-extrabold">Still need help?</h3>
          <p className="mt-1 text-xs text-[#D4C4BD]">Our support team is here to help you.</p>

          <Link to="/contact" className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#A51D26] px-4 text-xs font-bold text-white transition hover:bg-[#B5262D]">
            Contact MineKart
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

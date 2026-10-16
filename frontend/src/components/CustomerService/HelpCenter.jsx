import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HelpCircle, ShoppingBag, Truck, RotateCcw, CreditCard, UserRound, MessageCircle, Search } from 'lucide-react'
import BreadCrumb from '../../user/BreadCrumb'

export default function HelpCenter() {
  const [search, setSearch] = useState('')

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

  const filteredHelpItems = helpItems.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'HelpCenter | MineKart'
  }, [])

  const items = [
    {
      title: 'HelpCenter',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-mk-bg  mx-auto ">
      <BreadCrumb items={items} />

      <div className="py-5">
        {/* Search Order / Help Header */}
        <div className="overflow-hidden rounded-2xl border border-mk-border bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          <div className="bg-linear-to-br from-mk-ink via-mk-ink to-mk-primary-deep px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                <HelpCircle size={27} strokeWidth={1.8} />
              </div>

              <h2 className="mt-4 text-lg font-extrabold text-white sm:text-xl">How can we help?</h2>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Search for help or choose a topic below to get started.</p>

              {/* Search */}
              <div className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white p-1.5 shadow-[0_5px_20px_rgba(0,0,0,0.12)]">
                <Search size={17} className="ml-2 shrink-0 text-mk-muted" />

                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for help..." className="min-w-0 flex-1 bg-transparent px-1 text-sm text-mk-ink outline-none placeholder:text-mk-muted" />
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 divide-x divide-mk-border bg-mk-bg sm:grid-cols-3">
            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Support</p>

              <p className="mt-0.5 text-xs font-extrabold text-mk-ink">Help Center</p>
            </div>

            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Topics</p>

              <p className="mt-0.5 text-xs font-extrabold text-mk-ink">{filteredHelpItems.length} Available</p>
            </div>

            <div className="col-span-2 border-t border-mk-border px-4 py-3 text-center sm:col-span-1 sm:border-t-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Need More Help?</p>

              <Link to="/contact" className="mt-0.5 inline-flex text-xs font-extrabold text-mk-primary transition hover:text-mk-ink">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Help Topics */}
        <div className="mt-5 rounded-2xl border border-mk-border bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-mk-ink">Help Topics</h3>

              <p className="mt-1 text-[10px] text-mk-muted">Choose a topic to find the information you need</p>
            </div>

            <div className="hidden h-8 items-center gap-1.5 rounded-lg bg-mk-primary-soft px-2.5 text-[9px] font-bold text-mk-ink sm:flex">
              <HelpCircle size={13} />
              Quick Help
            </div>
          </div>

          {/* Cards */}
          {filteredHelpItems.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredHelpItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="group relative flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-mk-danger-soft hover:bg-white hover:shadow-[0_8px_24px_rgba(73,54,49,0.08)] sm:block sm:p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mk-ink text-white shadow-[0_4px_10px_rgba(53,28,24,0.12)] transition-all duration-300 group-hover:bg-mk-primary">
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 sm:mt-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="truncate text-xs font-extrabold text-mk-ink">{item.title}</h4>

                        <ArrowRight size={14} className="shrink-0 text-mk-subtle transition-all duration-300 group-hover:translate-x-1 group-hover:text-mk-ink sm:absolute sm:right-4 sm:top-4" />
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-mk-muted sm:mt-1.5 sm:leading-5">{item.description}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-mk-border bg-mk-bg px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-mk-ink text-white">
                <Search size={20} />
              </div>

              <h4 className="mt-3 text-sm font-extrabold text-mk-ink">No help found</h4>

              <p className="mt-1 text-xs text-mk-muted">Try searching with a different keyword.</p>

              <button type="button" onClick={() => setSearch('')} className="mt-4 inline-flex h-8 items-center rounded-lg bg-mk-ink px-3 text-[10px] font-bold text-white transition hover:bg-mk-primary-deep">
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Help */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-linear-to-br from-mk-ink via-mk-ink to-mk-primary-deep p-5 text-center text-white shadow-[0_6px_20px_rgba(53,28,24,0.12)] sm:p-6">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <MessageCircle size={21} strokeWidth={1.8} />
          </div>

          <h3 className="mt-3 text-sm font-extrabold">Still need help?</h3>

          <p className="mt-1 text-xs text-white/65">Our support team is here to help you.</p>

          <Link to="/contact" className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-white px-4 text-xs font-bold text-mk-ink transition hover:bg-mk-primary-soft">
            Contact MineKart
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

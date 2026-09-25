import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PackageSearch, Search, Package, Truck, MapPin, CheckCircle2 } from 'lucide-react'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')

  return (
    <div className="min-h-screen bg-[#F7EEE7]">
      <div className="mx-auto max-w-300 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />
              <PackageSearch size={18} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold text-[#351C18] sm:text-sm">Track Order</h1>
              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Check your order delivery status</p>
            </div>
          </div>

          <Link to="/orders" className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2.5 text-[9px] font-bold text-[#67544D] transition hover:border-[#D9B7B2] hover:text-[#A51D26] sm:px-3 sm:text-[10px]">
            My Orders
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Search Order */}
        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.05)] sm:p-8">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#A51D26]">
              <PackageSearch size={27} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18] sm:text-xl">Track your order</h2>

            <p className="mt-1.5 text-xs leading-5 text-[#806C63] sm:text-sm">Enter your MineKart order ID to check the latest delivery status.</p>

            <div className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-1.5">
              <Search size={17} className="ml-2 shrink-0 text-[#806C63]" />

              <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter order ID" className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#351C18] outline-none placeholder:text-[#A8978F]" />

              <button type="button" className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#A51D26] px-3 text-[10px] font-bold text-white transition hover:bg-[#7D171C]">
                Track
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-5 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
          <h3 className="text-sm font-extrabold text-[#351C18]">How order tracking works</h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[
              [Package, 'Order Placed'],
              [CheckCircle2, 'Confirmed'],
              [Truck, 'Out for Delivery'],
              [MapPin, 'Delivered'],
            ].map(([Icon, title], index) => (
              <div key={title} className="relative flex items-center gap-3 sm:block">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#A51D26]">
                  <Icon size={18} />
                </div>

                <div className="sm:mt-3">
                  <p className="text-xs font-bold text-[#351C18]">{title}</p>
                  <p className="mt-0.5 text-[10px] text-[#806C63]">Step {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="mt-5 text-center">
          <p className="text-xs text-[#806C63]">Don't have your order ID?</p>

          <Link to="/orders" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#A51D26] hover:text-[#7D171C]">
            View My Orders
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

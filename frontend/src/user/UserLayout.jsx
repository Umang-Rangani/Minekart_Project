import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import { RotateCcw, ShieldCheck, Truck, WalletCards } from 'lucide-react'
import { Headphones } from 'lucide-react'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#F7EEE7] text-[#351C18]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full bg-[#FBF7F2] pt-28">
        <div className="mx-auto w-full max-w-[1600px] bg-[#FFFCFA] px-4 sm:px-6 lg:px-7 pb-15">
          <Outlet />
        </div>
      </main>

      {/* MineKart Promise */}
      <section className="border-y border-[#E8DDD4] bg-[#F7EEE7]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-5 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
          {/* Title */}
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8E181F]">The MineKart Promise</p>
            <h3 className="mt-1 text-sm font-extrabold tracking-tight text-[#351C18] sm:text-base">Shopping made simple, safe & reliable.</h3>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            <div className="flex items-center gap-2">
              <Truck size={17} strokeWidth={1.8} className="text-[#8E181F]" />
              <span className="text-[11px] font-semibold text-[#5F4C45]">Fast Delivery</span>
            </div>

            <div className="h-4 w-px bg-[#DCCFC7]" />

            <div className="flex items-center gap-2">
              <ShieldCheck size={17} strokeWidth={1.8} className="text-[#8E181F]" />
              <span className="text-[11px] font-semibold text-[#5F4C45]">Secure Shopping</span>
            </div>

            <div className="h-4 w-px bg-[#DCCFC7]" />

            <div className="flex items-center gap-2">
              <RotateCcw size={17} strokeWidth={1.8} className="text-[#8E181F]" />
              <span className="text-[11px] font-semibold text-[#5F4C45]">Easy Returns</span>
            </div>

            <div className="h-4 w-px bg-[#DCCFC7]" />

            <div className="flex items-center gap-2">
              <Headphones size={17} strokeWidth={1.8} className="text-[#8E181F]" />
              <span className="text-[11px] font-semibold text-[#5F4C45]">Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

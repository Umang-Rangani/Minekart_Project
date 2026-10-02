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
      <main className="w-full bg-[#FBF7F2] pt-23 sm:pt-28">
        <div className="mx-auto w-full max-w-[1600px] bg-[#FFFCFA] px-4 sm:px-6 lg:px-7 pb-15">
          <Outlet />
        </div>
      </main>

      {/* MineKart Promise */}
      <section className="border-y border-[#E8DDD4] bg-[#F7EEE7]">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:py-7">
          {/* Title */}
          <div className="text-center md:text-left">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8E181F] sm:text-[10px] sm:tracking-[0.18em]">The MineKart Promise</p>

            <h3 className="mt-1 whitespace-nowrap text-sm font-extrabold leading-snug tracking-tight text-[#351C18] sm:text-base">Shopping made simple, safe & reliable.</h3>
          </div>

          {/* Highlights */}
          <div className="mt-5 grid grid-cols-4 sm:mt-6 md:mt-0 md:flex md:items-center md:justify-end md:gap-6 lg:gap-8">
            {/* Fast Delivery */}
            <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
              <Truck size={19} strokeWidth={1.8} className="text-[#8E181F] md:h-4.25 md:w-4.25" />

              <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight text-[#5F4C45] sm:text-[10px] md:text-[11px]">Fast Delivery</span>
            </div>

            {/* Divider */}
            <div className="hidden h-4 w-px bg-[#DCCFC7] md:block" />

            {/* Secure Shopping */}
            <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
              <ShieldCheck size={19} strokeWidth={1.8} className="text-[#8E181F] md:h-4.25 md:w-4.25" />

              <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight text-[#5F4C45] sm:text-[10px] md:text-[11px]">Secure Shopping</span>
            </div>

            {/* Divider */}
            <div className="hidden h-4 w-px bg-[#DCCFC7] md:block" />

            {/* Easy Returns */}
            <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
              <RotateCcw size={19} strokeWidth={1.8} className="text-[#8E181F] md:h-4.25 md:w-4.25" />

              <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight text-[#5F4C45] sm:text-[10px] md:text-[11px]">Easy Returns</span>
            </div>

            {/* Divider */}
            <div className="hidden h-4 w-px bg-[#DCCFC7] md:block" />

            {/* Customer Support */}
            <div className="flex flex-col items-center gap-1.5 md:flex-row md:gap-2">
              <Headphones size={19} strokeWidth={1.8} className="text-[#8E181F] md:h-4.25 md:w-4.25" />

              <span className="whitespace-nowrap text-center text-[9px] font-semibold leading-tight text-[#5F4C45] sm:text-[10px] md:text-[11px]">Customer Support</span>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  )
}

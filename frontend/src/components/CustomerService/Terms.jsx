import React, { useEffect } from 'react'
import { FileText, ShoppingBag, CreditCard, Truck, RotateCcw, UserRound, ShieldCheck, CircleHelp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BreadCrumb from '../../user/BreadCrumb'

export default function Terms() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Terms | MineKart'
  }, [])

  const items = [
    {
      title: 'Terms',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen  mx-auto">
      <BreadCrumb items={items} />
      <div className="py-5">
        {/* PAGE HEADER */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          <div className="bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                <FileText size={27} strokeWidth={1.8} />
              </div>

              <h1 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Terms & Conditions</h1>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Please read our terms and conditions before using MineKart.</p>

              <div className="mt-4 inline-flex items-center rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white/75">Last updated: 2026</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mx-auto  px-4 pt-5 sm:px-6 sm:pt-7">
          {/* INTRO */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_18px_rgba(73,54,49,0.05)] sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                <ShoppingBag size={18} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Welcome to MineKart</h2>

                <p className="mt-1.5 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">
                  By accessing or using MineKart, you agree to follow the terms and conditions mentioned below. These terms help us provide a safe and reliable shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* TERMS GRID */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* ACCOUNT */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <UserRound size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">User Account</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">You are responsible for providing accurate account information and keeping your login credentials secure.</p>
            </section>

            {/* PRODUCTS */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShoppingBag size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Products</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Product images, descriptions, prices, offers, and availability may change from time to time.</p>
            </section>

            {/* ORDERS & PAYMENT */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <CreditCard size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Orders & Payments</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Orders are processed based on product availability. Payment information must be accurate and valid.</p>
            </section>

            {/* DELIVERY */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <Truck size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Delivery</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Delivery timelines may vary depending on location, product availability, and other delivery conditions.</p>
            </section>

            {/* RETURNS */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <RotateCcw size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Returns & Refunds</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Returns and refunds are subject to the applicable MineKart return and refund policies.</p>
            </section>

            {/* RESPONSIBLE USE */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShieldCheck size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Responsible Use</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Users must not misuse the website, attempt unauthorized access, or interfere with MineKart services.</p>
            </section>
          </div>

          {/* CHANGES */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Changes to These Terms</h2>

            <p className="mt-2 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">MineKart may update these terms when necessary. Any updated version will be made available on this page.</p>
          </div>

          {/* HELP CARD */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-linear-to-r from-[#7D171C] to-[#A51D26] p-5 text-white shadow-[0_8px_24px_rgba(125,23,28,0.16)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <CircleHelp size={20} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold sm:text-base">Need Help?</h2>

                  <p className="mt-0.5 text-[10px] text-white/75 sm:text-xs">Have questions about our terms?</p>
                </div>
              </div>

              <Link
                to="/contact"
                className="group inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-bold text-[#8E181F] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 sm:h-10 sm:px-5 sm:text-xs"
              >
                Contact Us
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

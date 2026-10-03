import React, { useEffect } from 'react'
import { ShieldCheck, UserRound, ShoppingBag, CreditCard, MapPin, Cookie, LockKeyhole, CircleHelp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BreadCrumb from '../../user/BreadCrumb'

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Privacy Policy | MineKart'
  }, [])

  const items = [
    {
      title: 'Privacy Policy',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen mx-auto">
      <BreadCrumb items={items} />

      <div className="py-5">
        {/* PAGE HEADER */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          <div className="bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                <ShieldCheck size={27} strokeWidth={1.8} />
              </div>

              <h1 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Privacy Policy</h1>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Learn how MineKart collects, uses and protects your information.</p>

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
                <LockKeyhole size={18} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Your Privacy Matters</h2>

                <p className="mt-1.5 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">
                  At MineKart, we respect your privacy and work to protect the information you provide while using our website, creating an account, placing orders and contacting our support team.
                </p>
              </div>
            </div>
          </div>

          {/* PRIVACY GRID */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* PERSONAL INFORMATION */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <UserRound size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Personal Information</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">We may collect information such as your name, email address, phone number and account details when you use MineKart.</p>
            </section>

            {/* ORDER INFORMATION */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShoppingBag size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Order Information</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">When you place an order, we may store order details, products, delivery information and order history to process your order.</p>
            </section>

            {/* PAYMENT INFORMATION */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <CreditCard size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Payment Information</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Payment information is used to process transactions securely. We only use payment information as required for completing your purchase and related services.</p>
            </section>

            {/* DELIVERY INFORMATION */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <MapPin size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Delivery Information</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Your address and contact details may be used to deliver products, provide delivery updates and handle order-related communication.</p>
            </section>

            {/* COOKIES */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <Cookie size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Cookies</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">MineKart may use cookies and similar technologies to maintain sessions, remember preferences and improve your shopping experience.</p>
            </section>

            {/* DATA SECURITY */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShieldCheck size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Data Security</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">We take reasonable measures to protect your information from unauthorized access, misuse or disclosure.</p>
            </section>
          </div>

          {/* HOW WE USE INFORMATION */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">How We Use Your Information</h2>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                'To create and manage your MineKart account.',
                'To process and deliver your orders.',
                'To provide order and delivery updates.',
                'To respond to customer support requests.',
                'To improve our website and shopping experience.',
                'To maintain website security and prevent misuse.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg bg-[#FBF7F2] px-3 py-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E181F]" />

                  <p className="text-xs leading-5 text-[#806C63]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INFORMATION CONTROL */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Your Information</h2>

            <p className="mt-2 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">
              You can review and update certain account information through your MineKart profile. If you have questions about your personal information, you can contact our support team.
            </p>
          </div>

          {/* POLICY CHANGES */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Changes to This Privacy Policy</h2>

            <p className="mt-2 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">MineKart may update this Privacy Policy from time to time. Changes will be reflected on this page with the latest update date.</p>
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

                  <p className="mt-0.5 text-[10px] text-white/75 sm:text-xs">Have questions about your privacy?</p>
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

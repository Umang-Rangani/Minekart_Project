import React, { useEffect } from 'react'
import { Cookie, ShoppingBag, UserRound, ShieldCheck, BarChart3, Settings2, LockKeyhole, CircleHelp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BreadCrumb from '../../user/BreadCrumb'

export default function Cookies() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Cookies | MineKart'
  }, [])

  const items = [
    {
      title: 'Cookies',
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
                <Cookie size={27} strokeWidth={1.8} />
              </div>

              <h1 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Cookie Policy</h1>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Learn how MineKart uses cookies to improve your shopping experience.</p>

              <div className="mt-4 inline-flex items-center rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-[9px] font-bold text-white/75">Last updated: 2026</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mx-auto px-4 pt-5 sm:px-6 sm:pt-7">
          {/* INTRO */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_18px_rgba(73,54,49,0.05)] sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                <ShoppingBag size={18} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Cookies on MineKart</h2>

                <p className="mt-1.5 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">
                  MineKart uses cookies and similar technologies to provide essential website functionality, remember your preferences, keep your account secure and improve your shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* COOKIE GRID */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* ESSENTIAL COOKIES */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <LockKeyhole size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Essential Cookies</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">These cookies help MineKart work correctly. They may be used for login sessions, authentication, cart functionality and other essential website features.</p>
            </section>

            {/* ACCOUNT & SESSION */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <UserRound size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Account & Session</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Cookies may help maintain your login session and remember information needed while you move between different pages of your MineKart account.</p>
            </section>

            {/* SHOPPING EXPERIENCE */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShoppingBag size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Shopping Experience</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Cookies may help remember shopping preferences and support features related to browsing products, carts and checkout.</p>
            </section>

            {/* PREFERENCES */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <Settings2 size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Preferences</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">These technologies may remember preferences such as certain website settings to make your future visits more convenient.</p>
            </section>

            {/* ANALYTICS */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <BarChart3 size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Website Analytics</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Where enabled, analytics technologies may help us understand how visitors use MineKart and improve website performance and functionality.</p>
            </section>

            {/* SECURITY */}
            <section className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShieldCheck size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Security</h2>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#806C63]">Certain cookies or similar technologies may be used to help protect accounts, sessions and website services from misuse.</p>
            </section>
          </div>

          {/* HOW COOKIES HELP */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">How Cookies Help Your Shopping Experience</h2>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                'Keep you signed in to your MineKart account.',
                'Help maintain your shopping cart and checkout session.',
                'Remember selected website preferences.',
                'Improve website speed and functionality.',
                'Understand website usage and improve user experience.',
                'Help maintain website security.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg bg-[#FBF7F2] px-3 py-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8E181F]" />

                  <p className="text-xs leading-5 text-[#806C63]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MANAGE COOKIES */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Managing Cookies</h2>

            <p className="mt-2 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">
              You can manage or disable cookies through your browser settings. However, disabling certain cookies may affect features such as login, cart functionality or checkout.
            </p>
          </div>

          {/* THIRD PARTY */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Third-Party Technologies</h2>

            <p className="mt-2 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">
              Some services used by MineKart may place or access cookies or similar technologies. Their use of information is subject to their respective privacy policies and terms.
            </p>
          </div>

          {/* POLICY CHANGES */}
          <div className="mt-4 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_3px_14px_rgba(73,54,49,0.04)] sm:p-6">
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Changes to This Cookie Policy</h2>

            <p className="mt-2 text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">MineKart may update this Cookie Policy when required. Any changes will be reflected on this page with the latest update date.</p>
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

                  <p className="mt-0.5 text-[10px] text-white/75 sm:text-xs">Have questions about cookies?</p>
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

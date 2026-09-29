import React from 'react'
import { ShoppingBag, MapPin, ShieldCheck, CreditCard, Truck } from 'lucide-react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-[#E8DDD4] ${className}`} />
}

export default function CheckoutShimmer() {
  const items = [
    {
      title: 'cart',
      link: '/cart',
    },
    {
      title: 'checkout',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4 sm:pt-6">
        {/* CHECKOUT HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-20 sm:px-4">
          {/* Left - Cart */}
          <div className="flex min-w-0 items-center gap-2.5">
            <Shimmer className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />

            <div className="min-w-0">
              <Shimmer className="h-3 w-20 rounded sm:h-3.5 sm:w-24" />

              <Shimmer className="mt-2 h-2.5 w-28 rounded sm:w-32" />
            </div>
          </div>

          {/* Progress Shimmer */}
          <div className="flex min-w-0 flex-1 items-center justify-center px-2 sm:px-6">
            <div className="flex w-full max-w-100 items-center">
              {/* Cart */}
              <Shimmer className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9" />

              {/* Line */}
              <Shimmer className="mx-2 h-0.5 flex-1 rounded-full sm:mx-3" />

              {/* Checkout */}
              <Shimmer className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9" />

              {/* Line */}
              <Shimmer className="mx-2 h-0.5 flex-1 rounded-full sm:mx-3" />

              {/* Confirm */}
              <Shimmer className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9" />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <Shimmer className="h-8 w-8 rounded-lg" />

                  <div>
                    <Shimmer className="h-3.5 w-24 sm:h-4 sm:w-28" />
                    <Shimmer className="mt-1.5 h-2.5 w-28 sm:w-32" />
                  </div>
                </div>

                <Shimmer className="h-7 w-16 rounded-lg" />
              </div>

              <div className="max-h-96 overflow-hidden p-3 sm:p-4">
                <div className="space-y-2.5">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] p-2.5">
                      <Shimmer className="h-22 w-18 shrink-0 rounded-lg sm:h-24 sm:w-20" />

                      <div className="min-w-0 flex-1">
                        <Shimmer className="h-2.5 w-16" />
                        <Shimmer className="mt-2 h-3.5 w-[85%] sm:h-4 sm:w-[70%]" />

                        <div className="mt-2 flex gap-1.5">
                          <Shimmer className="h-6 w-16 rounded-md" />
                          <Shimmer className="h-6 w-14 rounded-md" />
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Shimmer className="h-4 w-16 sm:w-20" />
                        <Shimmer className="mt-2 h-2.5 w-14 sm:w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <Shimmer className="h-8 w-8 rounded-lg" />

                  <div>
                    <Shimmer className="h-3.5 w-28 sm:h-4 sm:w-32" />
                    <Shimmer className="mt-1.5 h-2.5 w-40 sm:w-48" />
                  </div>
                </div>

                <Shimmer className="h-7 w-14 rounded-lg" />
              </div>

              <div className="space-y-2.5 p-3 sm:p-4">
                {[1, 2].map((item) => (
                  <div key={item} className="rounded-xl border border-[#E8DDD4] bg-white p-3">
                    <div className="flex items-start gap-3">
                      <Shimmer className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Shimmer className="h-3 w-20" />
                          <Shimmer className="h-4 w-12 rounded-md" />
                          <Shimmer className="h-4 w-14 rounded-md" />
                        </div>

                        <Shimmer className="mt-2 h-3 w-[90%] sm:w-[70%]" />
                        <Shimmer className="mt-1.5 h-2.5 w-20" />
                        <Shimmer className="mt-1.5 h-2.5 w-28" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY */}
            <div className="flex items-center gap-3 rounded-xl border border-[#D5E8DA] bg-[#F0F8F3] p-3.5">
              <Shimmer className="h-9 w-9 shrink-0 rounded-lg" />

              <div>
                <Shimmer className="h-3 w-32" />
                <Shimmer className="mt-1.5 h-2.5 w-44" />
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="min-w-0">
            <div className="h-fit overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_5px_22px_rgba(73,54,49,0.08)] lg:sticky lg:top-24">
              {/* SUMMARY HEADER */}
              <div className="border-b border-[#E8DDD4] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Shimmer className="h-4 w-28 sm:h-5 sm:w-32" />
                    <Shimmer className="mt-1.5 h-2.5 w-40" />
                  </div>

                  <Shimmer className="h-9 w-9 rounded-lg" />
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* ITEM COUNT */}
                <div className="flex items-center justify-between rounded-lg bg-[#FBF7F2] px-3 py-2.5">
                  <Shimmer className="h-2.5 w-24" />
                  <Shimmer className="h-6 w-8 rounded-md" />
                </div>

                {/* PRICE DETAILS */}
                <div className="mt-5 space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <Shimmer className="h-3 w-16" />
                      <Shimmer className="h-3 w-14" />
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-5 flex items-end justify-between border-t border-[#E8DDD4] pt-4">
                  <div>
                    <Shimmer className="h-3.5 w-20" />
                    <Shimmer className="mt-1.5 h-2.5 w-12" />
                  </div>

                  <Shimmer className="h-7 w-24 sm:h-8 sm:w-28" />
                </div>

                {/* FREE DELIVERY */}
                <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#EADCC8] bg-[#FFF8EF] px-3 py-2.5">
                  <Shimmer className="mt-0.5 h-4 w-4 shrink-0 rounded-md" />
                  <Shimmer className="h-2.5 w-[80%] sm:w-[85%]" />
                </div>

                {/* PAYMENT METHOD */}
                <div className="mt-4 overflow-hidden rounded-lg border border-[#E8DDD4]">
                  <div className="flex items-center justify-between bg-[#FBF7F2] px-3.5 py-3">
                    <div>
                      <Shimmer className="h-2 w-20" />
                      <Shimmer className="mt-1.5 h-3.5 w-28" />
                    </div>

                    <Shimmer className="h-6 w-12 rounded-md" />
                  </div>

                  <div className="border-t border-[#E8DDD4] p-2.5">
                    <div className="flex items-start gap-2 rounded-md bg-[#F7EEE7] px-2.5 py-2.5">
                      <Shimmer className="mt-0.5 h-4 w-4 shrink-0 rounded-md" />
                      <Shimmer className="h-2.5 w-[80%]" />
                    </div>
                  </div>
                </div>

                {/* SELECTED ADDRESS */}
                <div className="mt-4 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4 shrink-0 rounded-md" />

                    <div className="min-w-0">
                      <Shimmer className="h-2 w-16" />
                      <Shimmer className="mt-1.5 h-2.5 w-28" />
                    </div>
                  </div>
                </div>

                {/* PLACE ORDER */}
                <Shimmer className="mt-5 h-12 w-full rounded-lg" />

                {/* BACK TO CART */}
                <Shimmer className="mt-2 h-10 w-full rounded-lg" />

                {/* SECURITY */}
                <div className="mt-4 flex items-center justify-center">
                  <Shimmer className="h-2.5 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

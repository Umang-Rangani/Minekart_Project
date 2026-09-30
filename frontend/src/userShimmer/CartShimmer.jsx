import React from 'react'
import { ShoppingBag } from 'lucide-react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-[#E8DDD4] ${className}`} />
}

export default function CartShimmer() {
  const items = Array.from({ length: 3 })

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={[{ title: 'Cart', link: null }]} />

      <div className="mx-auto w-full pb-10 pt-4 sm:pt-5">
        {/* PAGE HEADER */}
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

        {/* MAIN CART */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT */}
          <div className="min-w-0">
            {/* SECTION HEADER */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Shimmer className="h-4 w-28 sm:h-5 sm:w-32" />
                <Shimmer className="mt-2 h-2.5 w-44 sm:h-3 sm:w-52" />
              </div>

              <Shimmer className="h-7 w-16 rounded-lg" />
            </div>

            {/* PRODUCT CARDS */}
            <div className="space-y-3">
              {items.map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.045)] h-40">
                  <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                    {/* IMAGE */}
                    <Shimmer className="h-28 w-24 shrink-0 rounded-xl sm:h-32 sm:w-32" />

                    {/* DETAILS */}
                    <div className="min-w-0 flex-1">
                      {/* TOP */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <Shimmer className="h-2 w-14 sm:h-2.5 sm:w-16" />

                          <Shimmer className="mt-2 h-3.5 w-[85%] sm:h-4 sm:w-[70%]" />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex shrink-0 items-center gap-1">
                          <Shimmer className="h-7 w-7 rounded-lg" />
                          <Shimmer className="h-7 w-7 rounded-lg" />
                        </div>
                      </div>

                      <div className="flex gap-5 items-center ">
                        {/* SIZE */}
                        <Shimmer className="mt-2 h-6 w-14 rounded-md" />

                        {/* STOCK */}
                        <div className="mt-2 flex items-center gap-2">
                          <Shimmer className="h-6 w-20 rounded-md" />
                        </div>
                      </div>

                      {/* PRICE + QUANTITY */}
                      <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[#F0E7E1] pt-3">
                        {/* PRICE */}
                        <div>
                          <Shimmer className="h-2 w-10" />

                          <div className="mt-1 flex items-center gap-2">
                            <Shimmer className="h-5 w-16 rounded-md" />
                            <Shimmer className="h-3 w-12 rounded-md" />
                          </div>
                        </div>

                        {/* QUANTITY + TOTAL */}
                        <div className="flex items-end gap-3">
                          <Shimmer className="h-8 w-24 rounded-lg" />

                          <div className="min-w-20">
                            <Shimmer className="ml-auto h-2 w-10" />
                            <Shimmer className="mt-1 ml-auto h-4 w-16 rounded-md" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BENEFITS */}
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2.5 rounded-xl border border-[#E8DDD4] bg-white px-3 py-3">
                  <Shimmer className="h-8 w-8 shrink-0 rounded-lg" />

                  <div className="min-w-0">
                    <Shimmer className="h-2.5 w-20" />
                    <Shimmer className="mt-1.5 h-2 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.07)] lg:sticky lg:top-24">
              {/* SUMMARY HEADER */}
              <div className="border-b border-[#E8DDD4] bg-[#F7EEE7] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Shimmer className="h-4 w-28" />
                    <Shimmer className="mt-2 h-2.5 w-20" />
                  </div>

                  <Shimmer className="h-9 w-9 rounded-lg" />
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* ITEMS */}
                <div className="max-h-52 space-y-3 overflow-hidden pr-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Shimmer className="h-6 w-6 shrink-0 rounded-md" />

                        <div className="min-w-0">
                          <Shimmer className="h-2.5 w-28" />
                          <Shimmer className="mt-1.5 h-2 w-16" />
                        </div>
                      </div>

                      <Shimmer className="h-3 w-14 shrink-0 rounded-md" />
                    </div>
                  ))}
                </div>

                {/* SAVINGS */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4 rounded-md" />
                    <Shimmer className="h-2.5 w-20" />
                  </div>

                  <Shimmer className="h-3 w-14" />
                </div>

                {/* PRICE */}
                <div className="mt-5 space-y-3 border-t border-[#E8DDD4] pt-4">
                  <div className="flex items-center justify-between">
                    <Shimmer className="h-3 w-16" />
                    <Shimmer className="h-3 w-16" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Shimmer className="h-3 w-14" />
                    <Shimmer className="h-3 w-12" />
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E8DDD4] pt-4">
                    <div>
                      <Shimmer className="h-4 w-24" />
                      <Shimmer className="mt-2 h-2 w-16" />
                    </div>

                    <Shimmer className="h-6 w-24 rounded-md" />
                  </div>
                </div>

                {/* DELIVERY PROGRESS */}
                <div className="mt-4 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Shimmer className="h-4 w-4 rounded-md" />
                      <Shimmer className="h-2.5 w-28" />
                    </div>

                    <Shimmer className="h-2.5 w-8" />
                  </div>

                  <Shimmer className="mt-2 h-1.5 w-full rounded-full" />

                  <Shimmer className="mt-2 h-2.5 w-40" />
                </div>

                {/* CHECKOUT */}
                <Shimmer className="mt-4 h-11 w-full rounded-xl" />

                {/* CONTINUE */}
                <Shimmer className="mt-2.5 h-10 w-full rounded-lg" />

                {/* SECURE */}
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  <Shimmer className="h-4 w-4 rounded-md" />
                  <Shimmer className="h-2.5 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Package, ShieldCheck, ShoppingBag } from 'lucide-react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-[#E8DDD4] ${className}`} />
}

export default function MyOrdersShimmer() {
  return (
    <div className="min-h-screen pb-10">
      <BreadCrumb items={[{ title: 'orders', link: null }]} />

      <div className="mx-auto w-full pt-5">
        {/* PAGE HEADER */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Shimmer className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />

            <div className="min-w-0">
              <Shimmer className="h-3 w-24 sm:h-3.5 sm:w-28" />
              <Shimmer className="mt-1.5 h-2 w-40 sm:h-2.5 sm:w-48" />
            </div>
          </div>

          <Shimmer className="h-8 w-20 shrink-0 rounded-lg sm:w-24" />
        </div>

        {/* ORDER CARDS */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((order) => (
            <div key={order} className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              {/* ORDER HEADER */}
              <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#FBF7F2] px-4 py-3.5 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Shimmer className="h-8 w-8 shrink-0 rounded-lg" />

                    <div className="min-w-0">
                      <Shimmer className="h-2 w-14" />
                      <Shimmer className="mt-1.5 h-2.5 w-28 sm:h-3 sm:w-32" />
                    </div>
                  </div>

                  <Shimmer className="h-7 w-20 shrink-0 rounded-lg sm:w-24" />
                </div>
              </div>

              {/* STATUS BAR */}
              <div className="border-b border-[#EEE5DF] px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-7 w-7 shrink-0 rounded-lg" />

                    <div>
                      <Shimmer className="h-2 w-20" />
                      <Shimmer className="mt-1.5 h-2.5 w-16" />
                    </div>
                  </div>

                  <Shimmer className="h-6 w-20 rounded-md" />
                </div>

                {/* PROGRESS */}
                <div className="mt-4">
                  <Shimmer className="h-1.5 w-full rounded-full" />

                  <div className="mt-1.5 flex justify-between">
                    <Shimmer className="h-1.5 w-8" />
                    <Shimmer className="h-1.5 w-12" />
                    <Shimmer className="h-1.5 w-10" />
                    <Shimmer className="h-1.5 w-12" />
                  </div>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="px-4 py-4 sm:px-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-3.5 w-3.5 rounded" />
                    <Shimmer className="h-2.5 w-20" />
                  </div>

                  <Shimmer className="h-5 w-12 rounded-md" />
                </div>

                <div className="max-h-60 overflow-hidden pr-1">
                  <div className="space-y-2.5">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-2.5">
                        {/* IMAGE */}
                        <Shimmer className="h-16 w-16 shrink-0 rounded-lg sm:h-17 sm:w-17" />

                        {/* INFO */}
                        <div className="min-w-0 flex-1">
                          <Shimmer className="h-2.5 w-[85%] sm:h-3 sm:w-[75%]" />

                          <div className="mt-2 flex items-center gap-2">
                            <Shimmer className="h-2 w-10" />
                            <Shimmer className="h-1.5 w-1.5 rounded-full" />
                            <Shimmer className="h-2 w-12" />
                          </div>

                          <Shimmer className="mt-2 h-2 w-20" />
                        </div>

                        {/* PRICE */}
                        <Shimmer className="h-3 w-14 shrink-0 sm:w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="border-t border-[#E8DDD4] bg-[#FBF7F2] px-4 py-4 sm:px-5">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {/* TOTAL */}
                  <div className="rounded-lg border border-[#E8DDD4] bg-white px-3 py-2.5">
                    <Shimmer className="h-2 w-10" />
                    <Shimmer className="mt-2 h-4 w-16" />
                  </div>

                  {/* PAYMENT */}
                  <div className="rounded-lg border border-[#E8DDD4] bg-white px-3 py-2.5">
                    <Shimmer className="h-2 w-12" />
                    <Shimmer className="mt-2 h-2.5 w-20" />
                    <Shimmer className="mt-1.5 h-4 w-12 rounded-md" />
                  </div>

                  {/* ITEMS */}
                  <div className="rounded-lg border border-[#E8DDD4] bg-white px-3 py-2.5">
                    <Shimmer className="h-2 w-8" />
                    <Shimmer className="mt-2 h-4 w-8" />
                    <Shimmer className="mt-1 h-1.5 w-20" />
                  </div>
                </div>

                {/* VIEW DETAILS */}
                <Shimmer className="mt-3 h-10 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-5">
          <ShieldCheck size={14} className="text-[#D5C7C0]" />
          <Shimmer className="h-2.5 w-48 sm:w-56" />
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { ShieldCheck } from 'lucide-react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-[#E8DDD4] ${className}`} />
}

export default function OrderSuccessShimmer() {
  const items = [
    { title: 'cart', link: '/cart' },
    { title: 'checkout', link: '/checkout' },
    { title: 'success', link: null },
  ]

  return (
    <div className="pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-5">
        {/* HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Shimmer className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />

            <div className="min-w-0">
              <Shimmer className="h-3.5 w-28 sm:h-4 sm:w-36" />
              <Shimmer className="mt-1.5 h-2.5 w-44 sm:w-52" />
            </div>
          </div>

          <Shimmer className="h-8 w-24 shrink-0 rounded-lg sm:w-28" />
        </div>

        {/* SUCCESS HERO */}
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#5A2A25] px-5 py-8 shadow-[0_10px_30px_rgba(73,54,49,0.12)] sm:px-8 sm:py-10">
          <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-8 h-44 w-44 rounded-full bg-white/5" />

          <div className="relative flex flex-col items-center text-center">
            <Shimmer className="h-18 w-18 rounded-full bg-white/20 sm:h-20 sm:w-20" />

            <Shimmer className="mt-5 h-6 w-60 bg-white/20 sm:h-8 sm:w-80" />

            <Shimmer className="mt-3 h-3 w-[85%] max-w-xl bg-white/15 sm:h-4" />

            <Shimmer className="mt-1.5 h-3 w-[65%] max-w-lg bg-white/15 sm:h-4" />

            {/* ORDER ID */}
            <div className="mt-5 flex h-8 max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3">
              <Shimmer className="h-2.5 w-12 bg-white/20" />
              <Shimmer className="h-3 w-28 bg-white/20 sm:w-36" />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {/* ORDER PROGRESS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <Shimmer className="h-8 w-8 rounded-lg" />

                  <div>
                    <Shimmer className="h-3.5 w-28 sm:h-4 sm:w-32" />
                    <Shimmer className="mt-1.5 h-2.5 w-40 sm:w-48" />
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-5">
                <div className="flex items-start">
                  {[1, 2, 3, 4].map((item, index) => (
                    <React.Fragment key={item}>
                      <div className="flex min-w-0 flex-1 flex-col items-center">
                        <Shimmer className="h-8 w-8 rounded-full" />
                        <Shimmer className="mt-2 h-2.5 w-12" />
                      </div>

                      {index < 3 && <Shimmer className="mt-4 h-px flex-1 rounded-none" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="flex items-center gap-2.5 border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <Shimmer className="h-8 w-8 rounded-lg" />

                <div>
                  <Shimmer className="h-3.5 w-24 sm:h-4 sm:w-28" />
                  <Shimmer className="mt-1.5 h-2.5 w-28 sm:w-32" />
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="space-y-2.5">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] p-2.5">
                      <Shimmer className="h-20 w-16 shrink-0 rounded-lg sm:h-22 sm:w-18" />

                      <div className="min-w-0 flex-1">
                        <Shimmer className="h-3.5 w-[85%] sm:h-4 sm:w-[70%]" />

                        <div className="mt-2 flex gap-1.5">
                          <Shimmer className="h-6 w-16 rounded-md" />
                          <Shimmer className="h-6 w-14 rounded-md" />
                        </div>

                        <Shimmer className="mt-2 h-2.5 w-20" />
                      </div>

                      <div className="shrink-0">
                        <Shimmer className="h-4 w-20 sm:w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="flex items-center gap-2.5 border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <Shimmer className="h-8 w-8 rounded-lg" />

                <div>
                  <Shimmer className="h-3.5 w-32 sm:h-4 sm:w-36" />
                  <Shimmer className="mt-1.5 h-2.5 w-40 sm:w-48" />
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                  <div className="flex items-start gap-3">
                    <Shimmer className="h-8 w-8 shrink-0 rounded-lg" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Shimmer className="h-3.5 w-24" />
                        <Shimmer className="h-4 w-14 rounded-md" />
                      </div>

                      <Shimmer className="mt-2 h-3 w-[90%] sm:w-[75%]" />
                      <Shimmer className="mt-1.5 h-2.5 w-44" />
                      <Shimmer className="mt-1.5 h-2.5 w-28" />
                      <Shimmer className="mt-1.5 h-2.5 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT MESSAGE */}
            <div className="flex items-start gap-3 rounded-xl border border-[#EBD7B7] bg-[#FFF9ED] px-4 py-3.5">
              <Shimmer className="mt-0.5 h-4 w-4 shrink-0 rounded-md" />

              <div className="flex-1">
                <Shimmer className="h-3 w-28" />
                <Shimmer className="mt-1.5 h-2.5 w-[90%] sm:w-[75%]" />
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_5px_22px_rgba(73,54,49,0.08)] lg:sticky lg:top-24">
              {/* SUMMARY HEADER */}
              <div className="border-b border-[#E8DDD4] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Shimmer className="h-4 w-28 sm:h-5 sm:w-32" />
                    <Shimmer className="mt-1.5 h-2.5 w-36" />
                  </div>

                  <Shimmer className="h-9 w-9 rounded-lg" />
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* ORDER ID */}
                <div className="rounded-lg bg-[#FBF7F2] px-3 py-2.5">
                  <Shimmer className="h-2 w-16" />
                  <Shimmer className="mt-1.5 h-3 w-[80%]" />
                </div>

                {/* PAYMENT */}
                <div className="mt-3 rounded-lg border border-[#E8DDD4] p-3">
                  <div className="flex items-center gap-2.5">
                    <Shimmer className="h-8 w-8 rounded-lg" />

                    <div className="min-w-0">
                      <Shimmer className="h-2 w-16" />
                      <Shimmer className="mt-1.5 h-3 w-28" />
                    </div>
                  </div>

                  <Shimmer className="mt-3 h-5 w-14 rounded-md" />
                </div>

                {/* ORDER STATUS */}
                <div className="mt-3 rounded-lg border border-[#E8DDD4] p-3">
                  <div className="flex items-center gap-2.5">
                    <Shimmer className="h-8 w-8 rounded-lg" />

                    <div className="min-w-0">
                      <Shimmer className="h-2 w-20" />
                      <Shimmer className="mt-1.5 h-3 w-24" />
                    </div>
                  </div>

                  <Shimmer className="mt-3 h-5 w-16 rounded-md" />
                </div>

                {/* TOTAL */}
                <div className="mt-4 rounded-xl bg-[#F7EEE7] px-3.5 py-3.5">
                  <div className="flex items-center justify-between">
                    <Shimmer className="h-2.5 w-20" />
                    <Shimmer className="h-6 w-24" />
                  </div>
                </div>

                {/* SUMMARY DETAILS */}
                <div className="mt-4 space-y-2.5 border-t border-[#E8DDD4] pt-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <Shimmer className="h-2.5 w-14" />
                      <Shimmer className="h-2.5 w-16" />
                    </div>
                  ))}
                </div>

                {/* BUTTONS */}
                <div className="mt-5 space-y-2.5">
                  <Shimmer className="h-11 w-full rounded-lg" />
                  <Shimmer className="h-10 w-full rounded-lg" />
                </div>

                {/* SECURITY */}
                <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-[#E8DDD4] pt-4">
                  <Shimmer className="h-3 w-3 rounded-md" />
                  <Shimmer className="h-2.5 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-5">
          <Shimmer className="h-3.5 w-3.5 rounded-md" />
          <Shimmer className="h-2.5 w-40" />
        </div>
      </div>
    </div>
  )
}
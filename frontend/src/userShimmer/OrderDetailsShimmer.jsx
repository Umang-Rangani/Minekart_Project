import React from 'react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`minekart-shimmer ${className}`} />
}

export default function OrderDetailsShimmer() {
  const items = [
    { title: 'Orders', link: '/orders' },
    { title: 'Order Details', link: null },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <style>{`
        @keyframes minekartShimmer {
          0% {
            background-position: -700px 0;
          }
          100% {
            background-position: 700px 0;
          }
        }

        .minekart-shimmer {
          background: linear-gradient(
            90deg,
            #eee6df 25%,
            #f8f3ee 37%,
            #eee6df 63%
          );
          background-size: 700px 100%;
          animation: minekartShimmer 1.35s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto w-full">
        {/* BREADCRUMB */}
        {/* <div className="flex h-10 items-center gap-3">
          <Shimmer className="h-4 w-12 rounded-md" />
          <Shimmer className="h-3 w-2 rounded" />
          <Shimmer className="h-4 w-24 rounded-md" />
        </div> */}
        <BreadCrumb items={items} />

        <div className="pt-4 sm:pt-5">
          {/* HEADER */}
          <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-sm sm:mb-5 sm:h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <Shimmer className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />

              <div className="space-y-2">
                <Shimmer className="h-4 w-28 rounded-md sm:w-32" />
                <Shimmer className="h-3 w-36 rounded-md sm:w-44" />
              </div>
            </div>

            <Shimmer className="h-8 w-24 shrink-0 rounded-lg sm:w-28" />
          </div>

          {/* ORDER META */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-5 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`rounded-xl border border-[#E8DDD4] bg-white p-3 shadow-sm ${item === 3 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <div className="flex items-center gap-2">
                  <Shimmer className="h-7 w-7 shrink-0 rounded-lg" />
                  <Shimmer className="h-3 w-20 rounded" />
                </div>

                <Shimmer className="mt-3 h-3 w-28 rounded-md sm:w-32" />
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[270px_minmax(0,1fr)_310px]">
            {/* TRACKING */}
            <div className="order-2 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm lg:order-1">
              {/* Tracking header */}
              <div className="border-b border-[#EEE5DF] bg-[#FBF7F2] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2">
                    <Shimmer className="h-4 w-28 rounded-md" />
                    <Shimmer className="h-3 w-36 rounded" />
                  </div>

                  <Shimmer className="h-9 w-9 shrink-0 rounded-lg" />
                </div>
              </div>

              {/* Tracking steps */}
              <div className="space-y-6 p-4 sm:p-5">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Shimmer className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0 flex-1 space-y-2 pt-1">
                      <Shimmer className="h-3 w-28 rounded" />
                      <Shimmer className="h-3 w-full rounded" />
                      <Shimmer className="h-3 w-4/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTER */}
            <div className="order-1 min-w-0 space-y-4 sm:space-y-5 lg:order-2">
              {/* ORDER ITEMS */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-[#FBF7F2] px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4 rounded" />
                    <Shimmer className="h-4 w-28 rounded-md" />
                  </div>

                  <Shimmer className="h-6 w-16 rounded-lg" />
                </div>

                <div className="divide-y divide-[#EEE5DF]">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex gap-3 p-3.5 sm:gap-4 sm:p-4">
                      {/* Product image */}
                      <Shimmer className="h-19 w-19 shrink-0 rounded-xl sm:h-20 sm:w-20" />

                      {/* Product details */}
                      <div className="min-w-0 flex-1">
                        <Shimmer className="h-4 w-4/5 rounded-md sm:h-5" />
                        <Shimmer className="mt-2 h-4 w-3/5 rounded-md" />

                        <div className="mt-3 flex gap-2">
                          <Shimmer className="h-3 w-14 rounded" />
                          <Shimmer className="h-3 w-20 rounded" />
                        </div>

                        <Shimmer className="mt-3 h-4 w-20 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-[#FBF7F2] px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4 rounded" />
                    <Shimmer className="h-4 w-32 rounded-md" />
                  </div>

                  <Shimmer className="h-6 w-16 rounded-md" />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-4">
                    <div className="flex items-start gap-3">
                      <Shimmer className="h-10 w-10 shrink-0 rounded-xl" />

                      <div className="min-w-0 flex-1 space-y-3">
                        <Shimmer className="h-4 w-32 rounded-md" />
                        <Shimmer className="h-3 w-full max-w-sm rounded" />
                        <Shimmer className="h-3 w-4/5 max-w-xs rounded" />
                        <Shimmer className="h-3 w-24 rounded" />
                        <div className="flex gap-2 pt-1">
                          <Shimmer className="h-3 w-12 rounded" />
                          <Shimmer className="h-3 w-24 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-[#FBF7F2] px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4 rounded" />
                    <Shimmer className="h-4 w-36 rounded-md" />
                  </div>

                  <Shimmer className="h-4 w-4 rounded" />
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                  {[1, 2].map((item) => (
                    <div key={item} className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                      <Shimmer className="h-3 w-24 rounded" />
                      <Shimmer className="mt-2 h-4 w-32 rounded-md" />
                      <Shimmer className="mt-2 h-5 w-20 rounded-md" />
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E8DDD4] px-4 pb-4 sm:px-5">
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#F7EEE7] p-3.5">
                    <Shimmer className="h-4 w-4 shrink-0 rounded" />
                    <Shimmer className="h-3 w-full rounded" />
                  </div>
                </div>
              </div>

              {/* ACTION CARD */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm">
                <div className="flex items-center justify-between bg-[#FBF7F2] px-4 py-4 sm:px-5">
                  <div className="space-y-2">
                    <Shimmer className="h-4 w-28 rounded-md" />
                    <Shimmer className="h-3 w-48 rounded" />
                  </div>

                  <Shimmer className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="order-3">
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm">
                {/* Summary header */}
                <div className="bg-[#351C18] px-4 py-4 sm:px-5">
                  <Shimmer className="h-4 w-32 rounded-md" />
                  <Shimmer className="mt-2 h-3 w-28 rounded" />
                </div>

                <div className="p-4 sm:p-5">
                  {/* Total */}
                  <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                    <Shimmer className="h-3 w-24 rounded" />
                    <Shimmer className="mt-2 h-7 w-28 rounded-md" />
                  </div>

                  {/* Price details */}
                  <div className="mt-4">
                    <Shimmer className="h-3 w-24 rounded" />

                    <div className="mt-4 space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center justify-between">
                          <Shimmer className="h-3 w-16 rounded" />
                          <Shimmer className="h-3 w-16 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="my-4 border-t border-dashed border-[#DCCBC1]" />

                  {/* Final total */}
                  <div className="flex items-center justify-between">
                    <Shimmer className="h-4 w-20 rounded" />
                    <Shimmer className="h-5 w-20 rounded-md" />
                  </div>

                  {/* Payment */}
                  <div className="mt-4 rounded-xl bg-[#FFF9ED] px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Shimmer className="h-4 w-4 rounded" />
                      <Shimmer className="h-3 w-20 rounded" />
                      <Shimmer className="ml-auto h-3 w-14 rounded" />
                    </div>
                  </div>

                  {/* Security */}
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EAF6EF] px-3 py-2.5">
                    <Shimmer className="h-4 w-4 shrink-0 rounded" />
                    <Shimmer className="h-3 flex-1 rounded" />
                  </div>

                  {/* Back button */}
                  <Shimmer className="mt-4 h-11 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-center gap-2 py-5">
            <Shimmer className="h-3 w-3 rounded-full" />
            <Shimmer className="h-3 w-44 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

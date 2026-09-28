import React from 'react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`minekart-shimmer ${className}`} />
}

export default function MySupportShimmer() {
  const items = [
    {
      title: 'Contact Us',
      link: '/contact',
    },
    {
      title: 'My Support',
      link: null,
    },
  ]
  return (
    <div className="min-h-screen mx-auto">
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

      {/* Breadcrumb */}
      <BreadCrumb items={items} />

      <div className="py-5">
        {/* Header */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <Shimmer className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />

            <div className="min-w-0 space-y-2">
              <Shimmer className="h-3.5 w-24 rounded-md sm:w-28" />
              <Shimmer className="h-2.5 w-40 rounded sm:w-48" />
            </div>
          </div>

          <Shimmer className="h-8 w-24 shrink-0 rounded-lg sm:w-28" />
        </div>

        {/* Status Filter */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-1.5">
            <Shimmer className="h-3.5 w-3.5 rounded" />
            <Shimmer className="h-3 w-24 rounded" />
          </div>

          <div className="no-scrollbar overflow-hidden pb-1">
            <div className="flex min-w-max items-center gap-2">
              {/* All */}
              <Shimmer className="h-9 w-20 shrink-0 rounded-xl" />

              {/* Pending */}
              <Shimmer className="h-9 w-24 shrink-0 rounded-xl" />

              {/* In Progress */}
              <Shimmer className="h-9 w-28 shrink-0 rounded-xl" />

              {/* Resolved */}
              <Shimmer className="h-9 w-24 shrink-0 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_3px_15px_rgba(73,54,49,0.04)]">
              {/* Card Top */}
              <div className="border-b border-[#F0E7E1] bg-[#FBF7F2] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Shimmer className="h-10 w-10 shrink-0 rounded-xl" />

                    <div className="min-w-0 space-y-2">
                      <Shimmer className="h-2.5 w-24 rounded" />
                      <Shimmer className="h-3.5 w-36 rounded-md sm:w-40" />
                    </div>
                  </div>

                  <Shimmer className="h-6 w-20 shrink-0 rounded-full" />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* User */}
                <div className="flex items-center gap-2">
                  <Shimmer className="h-3.5 w-3.5 rounded" />
                  <Shimmer className="h-3 w-24 rounded" />
                </div>

                {/* Message */}
                <div className="mt-3 space-y-2">
                  <Shimmer className="h-3 w-full rounded" />
                  <Shimmer className="h-3 w-4/5 rounded" />
                </div>

                {/* Properties */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2.5 py-2">
                    <Shimmer className="h-2.5 w-16 rounded" />
                    <Shimmer className="mt-1.5 h-3 w-8 rounded" />
                  </div>

                  <div className="rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2.5 py-2">
                    <Shimmer className="h-2.5 w-14 rounded" />

                    <div className="mt-1.5 flex items-center gap-1">
                      <Shimmer className="h-3 w-3 rounded" />
                      <Shimmer className="h-3 w-20 rounded" />
                    </div>
                  </div>
                </div>

                {/* View */}
                <div className="mt-4 flex items-center justify-between border-t border-[#F0E7E1] pt-3">
                  <Shimmer className="h-2.5 w-28 rounded" />

                  <div className="flex items-center gap-1">
                    <Shimmer className="h-3 w-8 rounded" />
                    <Shimmer className="h-3.5 w-3.5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

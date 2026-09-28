import React from 'react'

const Shimmer = ({ className = '' }) => {
  return <div className={`minekart-shimmer ${className}`} />
}

export default function TrackOrderResultShimmer() {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.04)]">
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

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#E8DDD4] bg-[#FBF7F2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <Shimmer className="h-3 w-16 rounded" />
          <Shimmer className="h-4 w-44 rounded-md sm:w-56" />
        </div>

        <div className="flex items-center gap-2">
          <Shimmer className="h-3 w-20 rounded" />
          <Shimmer className="h-7 w-24 rounded-lg" />
        </div>
      </div>

      {/* Tracking */}
      <div className="px-5 py-6 sm:px-6 sm:py-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Shimmer className="h-4 w-28 rounded-md" />
            <Shimmer className="h-3 w-56 rounded" />
          </div>

          <Shimmer className="hidden h-8 w-28 rounded-lg sm:block" />
        </div>

        {/* Mobile */}
        <div className="space-y-5 sm:hidden">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 shrink-0 rounded-xl" />

              <div className="flex-1 space-y-2">
                <Shimmer className="h-3 w-28 rounded" />
                <Shimmer className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden grid-cols-6 gap-0 sm:grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="text-center">
              <Shimmer className="mx-auto h-11 w-11 rounded-xl" />

              <Shimmer className="mx-auto mt-3 h-3 w-20 rounded" />

              <Shimmer className="mx-auto mt-2 h-3 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

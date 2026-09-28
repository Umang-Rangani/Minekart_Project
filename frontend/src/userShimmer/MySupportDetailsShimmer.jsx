import React from 'react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`minekart-shimmer ${className}`} />
}

export default function MySupportDetailsShimmer() {
  const items = [
    {
      title: 'Contact Us',
      link: '/contact',
    },
    {
      title: 'My Support',
      link: '/my-support',
    },
    {
      title: 'My Support View',
      link: null,
    },
  ]
  return (
    <div className="min-h-screen  mx-auto">
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
        {/*  HEADER  */}
        <div className="mb-4 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3 py-2.5 sm:min-h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* Icon */}
              <Shimmer className="h-9 w-9 shrink-0 rounded-lg sm:h-10 sm:w-10" />

              <div className="min-w-0 space-y-2">
                <Shimmer className="h-2.5 w-24 rounded" />
                <Shimmer className="h-3.5 w-40 rounded-md sm:w-52" />
              </div>
            </div>

            {/* Status */}
            <Shimmer className="h-8 w-24 shrink-0 rounded-lg sm:w-28" />
          </div>

          {/* Header Meta */}
          <div className="grid grid-cols-3 border-t border-[#F0E7E1] bg-[#FBF7F2]">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`px-3 py-2.5 ${item !== 3 ? 'border-r border-[#E8DDD4]' : ''}`}>
                <Shimmer className="h-2.5 w-14 rounded" />
                <Shimmer className="mt-1.5 h-3 w-24 rounded-md sm:w-32" />
              </div>
            ))}
          </div>
        </div>

        {/*  CONVERSATION  */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-[#FBF7F2] px-4 py-3">
            <div className="flex items-center gap-2">
              <Shimmer className="h-8 w-8 rounded-lg" />

              <div className="space-y-2">
                <Shimmer className="h-3.5 w-24 rounded-md" />
                <Shimmer className="h-2.5 w-36 rounded" />
              </div>
            </div>

            <Shimmer className="h-4 w-4 rounded" />
          </div>

          {/*  MESSAGE AREA  */}
          <div className="max-h-140 min-h-75 space-y-5 overflow-hidden bg-[#FFFDFC] p-3 sm:p-5">
            {/* User message */}
            <div className="flex justify-start">
              <div className="flex max-w-[88%] items-end gap-2 sm:max-w-[75%]">
                <Shimmer className="h-8 w-8 shrink-0 rounded-full" />

                <div>
                  <Shimmer className="h-10 w-48 rounded-2xl sm:w-64" />

                  <Shimmer className="mt-1.5 h-2.5 w-28 rounded" />
                </div>
              </div>
            </div>

            {/* Support message */}
            <div className="flex justify-end">
              <div className="flex max-w-[88%] flex-row-reverse items-end gap-2 sm:max-w-[75%]">
                <Shimmer className="h-8 w-8 shrink-0 rounded-full" />

                <div>
                  <Shimmer className="h-14 w-56 rounded-2xl sm:w-72" />

                  <Shimmer className="mt-1.5 ml-auto h-2.5 w-32 rounded" />
                </div>
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-start">
              <div className="flex max-w-[88%] items-end gap-2 sm:max-w-[75%]">
                <Shimmer className="h-8 w-8 shrink-0 rounded-full" />

                <div>
                  <Shimmer className="h-16 w-60 rounded-2xl sm:w-80" />

                  <Shimmer className="mt-1.5 h-2.5 w-28 rounded" />
                </div>
              </div>
            </div>

            {/* Support message */}
            <div className="flex justify-end">
              <div className="flex max-w-[88%] flex-row-reverse items-end gap-2 sm:max-w-[75%]">
                <Shimmer className="h-8 w-8 shrink-0 rounded-full" />

                <div>
                  <Shimmer className="h-11 w-48 rounded-2xl sm:w-64" />

                  <Shimmer className="mt-1.5 ml-auto h-2.5 w-32 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/*  REPLY AREA  */}
          <div className="border-t border-[#E8DDD4] bg-[#FBF7F2] p-3 sm:p-4">
            <div className="rounded-xl border border-[#E8DDD4] bg-white p-2 shadow-[0_2px_8px_rgba(73,54,49,0.03)]">
              {/* Textarea */}
              <Shimmer className="h-20 w-full rounded-lg sm:h-20" />

              {/* Bottom controls */}
              <div className="flex items-center justify-between gap-2 border-t border-[#F0E8E3] pt-2">
                <Shimmer className="h-2.5 w-12 rounded" />

                <Shimmer className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <Shimmer className="h-3 w-3 rounded" />
          <Shimmer className="h-3 w-56 rounded" />
        </div>
      </div>
    </div>
  )
}

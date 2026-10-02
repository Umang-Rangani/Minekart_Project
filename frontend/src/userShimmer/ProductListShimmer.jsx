import React from 'react'
import { Sparkles } from 'lucide-react'

const ProductCardShimmer = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.04)] sm:rounded-xl sm:shadow-[0_3px_12px_rgba(73,54,49,0.04)]">
      {/* Image Shimmer */}
      <div className="aspect-square animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2]">
        <div className="flex h-full items-center justify-center">
          <div className="h-[52%] w-[52%] rounded-2xl bg-[#E8DDD4] sm:rounded-3xl" />
        </div>
      </div>

      {/* Product Info Shimmer */}
      <div className="border-t border-[#EEE5DF] bg-[#FFFCFA] px-1.5 py-1.5 sm:px-2.5 sm:py-2.5">
        {/* Category */}
        <div className="h-2 w-12 animate-pulse rounded bg-[#E8DDD4] sm:h-2.5 sm:w-16" />

        {/* Product Name */}
        <div className="mt-1 space-y-1 sm:mt-1.5">
          <div className="h-2.5 w-full animate-pulse rounded bg-[#E8DDD4] sm:h-3" />

          <div className="h-2.5 w-3/4 animate-pulse rounded bg-[#EEE5DF] sm:h-3" />
        </div>

        {/* Rating */}
        <div className="mt-1.5 h-4 w-10 animate-pulse rounded-md bg-[#E8DDD4] sm:mt-2 sm:h-5 sm:w-14" />

        {/* Price */}
        <div className="mt-1.5 flex items-center gap-1 sm:mt-2">
          <div className="h-4 w-14 animate-pulse rounded bg-[#E8DDD4] sm:h-5 sm:w-20" />

          <div className="h-2.5 w-9 animate-pulse rounded bg-[#EEE5DF] sm:h-3 sm:w-11" />
        </div>

        {/* Bottom */}
        <div className="mt-1.5 flex items-center justify-between border-t border-[#EFE5DF] pt-1.5 sm:mt-2 sm:pt-2">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D8CBC4]" />

            <div className="h-2 w-14 animate-pulse rounded bg-[#EEE5DF] sm:h-2.5 sm:w-20" />
          </div>

          <div className="h-2 w-7 animate-pulse rounded bg-[#F0DDD8] sm:h-2.5 sm:w-9" />
        </div>
      </div>
    </div>
  )
}

const SectionHeaderShimmer = () => {
  return (
    <div className="mb-3 flex items-end justify-between gap-2 sm:mb-6 sm:gap-4">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
          <span className="flex h-6 w-6 shrink-0 animate-pulse items-center justify-center rounded-md bg-[#F7EEE7] sm:h-8 sm:w-8 sm:rounded-lg">
            <Sparkles size={13} className="text-[#D8CBC4] sm:h-4 sm:w-4" />
          </span>

          <div className="h-2.5 w-16 animate-pulse rounded bg-[#E8DDD4] sm:h-3 sm:w-20" />
        </div>

        <div className="h-5 w-28 animate-pulse rounded-md bg-[#E8DDD4] sm:h-7 sm:w-36 sm:rounded-lg" />

        <div className="mt-1.5 h-2.5 w-40 animate-pulse rounded bg-[#EEE5DF] sm:mt-2 sm:h-4 sm:w-56" />
      </div>

      <div className="h-7 w-18 animate-pulse rounded-lg bg-[#EEE5DF] sm:h-9 sm:w-24 sm:rounded-xl" />
    </div>
  )
}

export default function ProductListShimmer() {
  return (
    <section className="w-full">
      <SectionHeaderShimmer />

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <ProductCardShimmer key={index} />
        ))}
      </div>
    </section>
  )
}

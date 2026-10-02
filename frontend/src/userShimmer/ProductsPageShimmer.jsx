import React from 'react'

export function ProductCardShimmer() {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_2px_8px_rgba(73,54,49,0.05)] sm:rounded-xl">
      <div className="relative aspect-square animate-pulse bg-[#F3EEE9] p-2 sm:p-3">
        <div className="absolute left-1.5 top-1.5 h-3.5 w-10 rounded-md bg-[#E4DAD3] sm:left-2 sm:top-2 sm:h-4 sm:w-12" />

        <div className="absolute right-1.5 top-1.5 h-3.5 w-14 rounded-md bg-[#EAE1DB] sm:right-2 sm:top-2 sm:h-4 sm:w-16" />

        <div className="flex h-full items-center justify-center">
          <div className="h-[55%] w-[55%] rounded-xl bg-[#E4DAD3] sm:rounded-2xl" />
        </div>
      </div>

      <div className="animate-pulse border-t border-[#EEE5DF] bg-[#FFFCFA] px-1.5 py-1.5 sm:px-2.5 sm:py-2.5">
        <div className="h-2 w-14 rounded bg-[#E4DAD3] sm:h-2.5 sm:w-16" />

        <div className="mt-1 h-4 w-full rounded bg-[#E4DAD3] sm:h-5" />

        <div className="mt-0.5 h-4 w-3/4 rounded bg-[#EAE1DB] sm:h-5" />

        <div className="mt-1 flex items-center gap-1 sm:mt-1.5">
          <div className="h-3.5 w-8 rounded bg-[#E4DAD3] sm:h-4 sm:w-9" />

          <div className="h-1 w-1 rounded-full bg-[#D8CBC4]" />

          <div className="h-2.5 w-12 rounded bg-[#EAE1DB] sm:h-3 sm:w-14" />
        </div>

        <div className="mt-1 flex items-baseline gap-1 sm:mt-1.5">
          <div className="h-4 w-16 rounded bg-[#E4DAD3] sm:h-5 sm:w-20" />

          <div className="h-2.5 w-10 rounded bg-[#EAE1DB] sm:h-3 sm:w-12" />

          <div className="h-2.5 w-8 rounded bg-[#EAE1DB] sm:h-3 sm:w-10" />
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-[#EFE5DF] pt-1 sm:mt-1.5 sm:pt-1.5">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#E4DAD3]" />

            <div className="h-2.5 w-14 rounded bg-[#E4DAD3] sm:h-3 sm:w-16" />
          </div>

          <div className="h-2.5 w-8 rounded bg-[#E4DAD3] sm:h-3 sm:w-10" />
        </div>
      </div>
    </div>
  )
}

export function ProductsGridShimmer({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5 xl:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardShimmer key={index} />
      ))}
    </div>
  )
}

export function FilterListShimmer({ count = 5, rounded = false }) {
  return (
    <div className={rounded ? 'flex flex-wrap gap-1.5' : 'space-y-0.5'}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={rounded ? 'h-7 w-16 animate-pulse rounded-full bg-[#EAE1DB]' : 'h-7 w-full animate-pulse rounded-md bg-[#F0E9E4]'} />
      ))}
    </div>
  )
}

export function PriceFilterShimmer() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2 w-16 rounded bg-[#E4DAD3]" />
        <div className="h-2 w-10 rounded bg-[#E4DAD3]" />
      </div>

      <div className="h-1.5 w-full rounded-full bg-[#E4DAD3]" />

      <div className="mt-1.5 flex justify-between">
        <div className="h-2 w-6 rounded bg-[#EAE1DB]" />
        <div className="h-2 w-9 rounded bg-[#EAE1DB]" />
      </div>
    </div>
  )
}

export default function ProductsPageShimmer() {
  return (
    <section className="w-full pb-10">
      <div className="mx-auto w-full pt-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="h-7 w-40 animate-pulse rounded-lg bg-[#E4DAD3]" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-[#EAE1DB]" />
          </div>

          <div className="hidden h-10 w-32 animate-pulse rounded-xl bg-[#EAE1DB] sm:block" />
        </div>

        <div className="flex gap-5">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-4">
              <div className="mb-5 h-5 w-24 animate-pulse rounded bg-[#E4DAD3]" />

              <FilterListShimmer count={6} />

              <div className="my-5 border-t border-[#EEE5DF]" />

              <PriceFilterShimmer />

              <div className="my-5 border-t border-[#EEE5DF]" />

              <FilterListShimmer count={4} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <ProductsGridShimmer count={10} />
          </div>
        </div>
      </div>
    </section>
  )
}

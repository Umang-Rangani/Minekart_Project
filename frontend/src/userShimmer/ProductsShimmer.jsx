import React from 'react'
import BreadCrumb from '../user/BreadCrumb'

function ProductCardShimmer() {
  return (
    <div className="overflow-hidden rounded-lg border border-mk-border bg-mk-card shadow-[0_2px_8px_rgba(73,54,49,0.05)] sm:rounded-xl">
      {/* Image */}
      <div className="relative aspect-square animate-pulse bg-mk-surface p-2 sm:p-3">
        <div className="absolute left-1.5 top-1.5 h-3.5 w-10 rounded-md bg-mk-border sm:left-2 sm:top-2 sm:h-4 sm:w-12" />

        <div className="flex h-full items-center justify-center">
          <div className="h-[72%] w-[72%] rounded-lg bg-mk-border sm:rounded-xl" />
        </div>
      </div>

      {/* Info */}
      <div className="animate-pulse border-t border-mk-surface bg-mk-card px-1.5 py-1.5 sm:px-2.5 sm:py-2.5">
        {/* Category */}
        <div className="h-1.5 w-14 rounded bg-mk-border sm:h-2 sm:w-16" />

        {/* Title */}
        <div className="mt-1 min-h-8 sm:min-h-10">
          <div className="h-3 w-full rounded bg-mk-border sm:h-3.5" />
          <div className="mt-1 h-3 w-3/4 rounded bg-mk-border sm:h-3.5" />
        </div>

        {/* Rating */}
        <div className="mt-1 flex h-4 items-center gap-1 sm:mt-1.5 sm:h-5">
          <div className="h-3.5 w-10 rounded bg-mk-border sm:h-4 sm:w-11" />
          <div className="h-2 w-14 rounded bg-mk-border sm:w-16" />
        </div>

        {/* Price */}
        <div className="mt-1 flex h-4 items-baseline gap-1 sm:mt-1.5 sm:h-5">
          <div className="h-3.5 w-12 rounded bg-mk-border sm:h-4 sm:w-14" />
          <div className="h-2 w-8 rounded bg-mk-border sm:w-10" />
        </div>

        {/* Bottom */}
        <div className="mt-1 flex h-4 items-center justify-between border-t border-mk-surface pt-1 sm:mt-1.5 sm:h-5 sm:pt-1.5">
          <div className="h-2 w-14 rounded bg-mk-border sm:w-16" />
          <div className="h-2 w-8 rounded bg-mk-border sm:w-9" />
        </div>
      </div>
    </div>
  )
}

function ProductsGridShimmer({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5 xl:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardShimmer key={index} />
      ))}
    </div>
  )
}

function FilterListShimmer({ count = 5, rounded = false }) {
  return (
    <div className={rounded ? 'flex flex-wrap gap-1.5' : 'space-y-0.5'}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={rounded ? 'h-7 w-16 animate-pulse rounded-full bg-mk-border' : 'h-7 w-full animate-pulse rounded-md bg-mk-surface'} />
      ))}
    </div>
  )
}

function PriceFilterShimmer() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2 w-16 rounded bg-mk-border" />
        <div className="h-2 w-10 rounded bg-mk-border" />
      </div>

      <div className="h-1.5 w-full rounded-full bg-mk-border" />

      <div className="mt-1.5 flex justify-between">
        <div className="h-2 w-6 rounded bg-mk-border" />
        <div className="h-2 w-9 rounded bg-mk-border" />
      </div>
    </div>
  )
}

export default function ProductsShimmer({ items }) {
  return (
    <section className="w-full pb-8 sm:pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-2.5 sm:pt-4">
        {/* Header */}
        <div className="mb-3 flex min-h-23 flex-col gap-2 overflow-visible rounded-lg border border-mk-border bg-mk-card px-2 py-2 shadow-[0_2px_10px_rgba(73,54,49,0.05)] sm:mb-4 sm:h-15 sm:min-h-0 sm:flex-row sm:items-center sm:gap-4 sm:px-3.5 sm:py-0">
          {/* Title */}
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-mk-border sm:h-10 sm:w-10" />

            <div className="min-w-0">
              <div className="h-3.5 w-20 animate-pulse rounded bg-mk-border sm:h-4 sm:w-28" />

              <div className="mt-1 h-2 w-32 animate-pulse rounded bg-mk-border sm:w-36" />
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <div className="h-8 min-w-0 flex-1 animate-pulse rounded-lg bg-mk-surface sm:h-9" />

            {/* Sort */}
            <div className="h-8 w-13.5 shrink-0 animate-pulse rounded-md bg-mk-border sm:h-9 sm:w-20" />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="mb-3 sm:hidden">
          <div className="h-9 w-full animate-pulse rounded-lg bg-mk-surface" />
        </div>

        {/* Main */}
        <div className="flex gap-4">
          {/* Desktop Filters */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="rounded-xl border border-mk-border bg-mk-card p-3">
              <div className="mb-4 h-4 w-16 animate-pulse rounded bg-mk-border" />

              <FilterListShimmer count={6} />

              <div className="mt-3 border-t border-mk-surface pt-3">
                <FilterListShimmer count={5} />
              </div>

              <div className="mt-3 border-t border-mk-surface pt-3">
                <PriceFilterShimmer />
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="min-w-0 flex-1">
            <ProductsGridShimmer count={10} />
          </div>
        </div>
      </div>
    </section>
  )
}

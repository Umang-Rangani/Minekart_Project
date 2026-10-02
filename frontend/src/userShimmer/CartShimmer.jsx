import React from 'react'
import { ShoppingBag } from 'lucide-react'
import BreadCrumb from '../user/BreadCrumb'

const Shimmer = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-[#E8DDD4] ${className}`} />
}

const ProductCardShimmer = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.045)] sm:rounded-2xl">
      <div className="flex gap-2.5 p-2.5 sm:gap-4 sm:p-4">
        {/* IMAGE */}
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] sm:h-32 sm:w-32 sm:rounded-xl">
          <div className="flex h-full w-full items-center justify-center">
            <Shimmer className="h-[55%] w-[55%] rounded-xl sm:rounded-2xl" />
          </div>
        </div>

        {/* DETAILS */}
        <div className="min-w-0 flex-1">
          {/* TOP */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 flex-1">
              {/* BRAND */}
              <Shimmer className="h-2 w-12 sm:h-2.5 sm:w-16" />

              {/* PRODUCT NAME */}
              <Shimmer className="mt-1.5 h-3 w-[75%] sm:mt-2 sm:h-4 sm:w-[60%]" />
            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 items-center gap-0.5">
              <Shimmer className="h-6 w-6 rounded-md sm:h-7 sm:w-7" />
              <Shimmer className="h-6 w-6 rounded-md sm:h-7 sm:w-7" />
            </div>
          </div>

          {/* SIZE + STOCK + MOBILE PRICE */}
          <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1.5 sm:mt-3 sm:items-center sm:gap-5">
            {/* SIZE */}
            <Shimmer className="h-5 w-16 rounded-md sm:h-7 sm:w-20" />

            {/* STOCK - DESKTOP */}
            <Shimmer className="hidden h-5 w-20 rounded-md sm:block sm:h-7 sm:w-24" />

            {/* MOBILE PRICE */}
            <div className="flex w-full items-end gap-2 sm:hidden">
              <Shimmer className="h-2 w-7 rounded" />

              <div className="flex items-end gap-1">
                <Shimmer className="h-4 w-14 rounded" />
                <Shimmer className="h-2.5 w-10 rounded" />
              </div>
            </div>
          </div>

          {/* PRICE + QUANTITY */}
          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#F0E7E1] pt-2.5 sm:mt-3 sm:items-end sm:gap-3 sm:pt-3">
            {/* DESKTOP PRICE */}
            <div className="hidden sm:block">
              <Shimmer className="h-2.5 w-10" />

              <div className="mt-1 flex items-center gap-1">
                <Shimmer className="h-5 w-16" />
                <Shimmer className="h-3 w-12" />
              </div>
            </div>

            {/* QUANTITY + TOTAL */}
            <div className="flex w-full items-center justify-between sm:w-auto sm:items-end sm:gap-3">
              {/* QUANTITY */}
              <div className="flex h-8 overflow-hidden rounded-lg border border-[#DCCFC7]">
                <Shimmer className="h-full w-8 rounded-none" />
                <Shimmer className="h-full w-9 rounded-none border-x border-[#DCCFC7]" />
                <Shimmer className="h-full w-8 rounded-none" />
              </div>

              {/* TOTAL */}
              <div className="text-right">
                <Shimmer className="ml-auto h-2 w-9" />
                <Shimmer className="mt-1 h-4 w-14 sm:h-5 sm:w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BenefitsShimmer = () => {
  return (
    <div className="mt-4 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2.5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex flex-col items-center justify-center rounded-xl border border-[#E8DDD4] bg-white px-1.5 py-2.5 sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3">
          <Shimmer className="h-7 w-7 shrink-0 rounded-lg sm:h-8 sm:w-8" />

          <div className="mt-1.5 sm:mt-0">
            <Shimmer className="mx-auto h-2.5 w-16 sm:mx-0 sm:h-3 sm:w-20" />
            <Shimmer className="mx-auto mt-1.5 h-2 w-12 sm:mx-0 sm:h-2.5 sm:w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

const SummaryShimmer = () => {
  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.07)] lg:sticky lg:top-24">
        {/* HEADER */}
        <div className="border-b border-[#E8DDD4] bg-[#F7EEE7] px-3 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Shimmer className="h-4 w-28 sm:h-5 sm:w-32" />
              <Shimmer className="mt-1.5 h-2.5 w-16 sm:h-3 sm:w-20" />
            </div>

            <Shimmer className="h-8 w-8 rounded-lg sm:h-9 sm:w-9" />
          </div>
        </div>

        <div className="p-3.5 sm:p-5">
          {/* ITEMS */}
          <div className="max-h-44 space-y-2.5 overflow-hidden sm:max-h-52 sm:space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-2">
                  <Shimmer className="h-5 w-5 shrink-0 rounded-md sm:h-6 sm:w-6" />

                  <div className="min-w-0">
                    <Shimmer className="h-2.5 w-28 sm:h-3 sm:w-32" />
                    <Shimmer className="mt-1.5 h-2 w-16 sm:h-2.5 sm:w-20" />
                  </div>
                </div>

                <Shimmer className="h-3 w-12 shrink-0 sm:h-3.5 sm:w-14" />
              </div>
            ))}
          </div>

          {/* SAVINGS */}
          <div className="mt-3 flex items-center justify-between rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-2.5 py-2 sm:mt-4 sm:px-3 sm:py-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shimmer className="h-3 w-3 rounded sm:h-3.5 sm:w-3.5" />
              <Shimmer className="h-2.5 w-20 sm:h-3 sm:w-24" />
            </div>

            <Shimmer className="h-2.5 w-12 sm:h-3 sm:w-14" />
          </div>

          {/* PRICE */}
          <div className="mt-4 space-y-2.5 border-t border-[#E8DDD4] pt-3 sm:mt-5 sm:space-y-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <Shimmer className="h-2.5 w-14 sm:h-3 sm:w-16" />
              <Shimmer className="h-3 w-14 sm:h-3.5 sm:w-16" />
            </div>

            <div className="flex items-center justify-between">
              <Shimmer className="h-2.5 w-14 sm:h-3 sm:w-16" />
              <Shimmer className="h-3 w-10 sm:h-3.5 sm:w-12" />
            </div>

            <div className="flex items-center justify-between border-t border-[#E8DDD4] pt-3 sm:pt-4">
              <div>
                <Shimmer className="h-3 w-20 sm:h-3.5 sm:w-24" />
                <Shimmer className="mt-1.5 h-2 w-12 sm:h-2.5 sm:w-16" />
              </div>

              <Shimmer className="h-5 w-20 sm:h-6 sm:w-24" />
            </div>
          </div>

          {/* DELIVERY */}
          <div className="mt-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-2.5 sm:mt-4 sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shimmer className="h-3.5 w-3.5 rounded sm:h-4 sm:w-4" />
                <Shimmer className="h-2.5 w-24 sm:h-3 sm:w-28" />
              </div>

              <Shimmer className="h-2.5 w-8 sm:h-3 sm:w-10" />
            </div>

            <Shimmer className="mt-2 h-1.5 w-full rounded-full" />
            <Shimmer className="mt-1.5 h-2 w-36 sm:mt-2 sm:h-2.5 sm:w-44" />
          </div>

          {/* CHECKOUT */}
          <Shimmer className="mt-3 h-10 w-full rounded-xl sm:mt-4 sm:h-11" />

          {/* CONTINUE */}
          <Shimmer className="mt-2 h-9 w-full rounded-lg sm:mt-2.5 sm:h-10" />

          {/* SECURE */}
          <div className="mt-3 flex items-center justify-center gap-1.5 sm:mt-4">
            <Shimmer className="h-3 w-3 rounded" />
            <Shimmer className="h-2.5 w-28 sm:h-3 sm:w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartShimmer() {
  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={[{ title: 'Cart', link: null }]} />

      <div className="mx-auto w-full pb-10 pt-3 sm:pt-5">
        {/* PAGE HEADER */}
        <div className="mb-3 flex h-14 items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-2.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-20 sm:px-4">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7EEE7] sm:h-10 sm:w-10">
              <ShoppingBag size={17} strokeWidth={1.8} className="text-[#D8CBC4]" />
            </div>

            <div className="min-w-0">
              <Shimmer className="h-3 w-14 sm:h-4 sm:w-20" />
              <Shimmer className="mt-1.5 h-2 w-20 sm:h-2.5 sm:w-28" />
            </div>
          </div>

          {/* PROGRESS */}
          <div className="flex min-w-0 flex-1 items-center justify-center px-1 sm:px-6">
            <div className="flex w-full max-w-100 items-center">
              <div className="flex shrink-0 items-center gap-1.5">
                <Shimmer className="h-7 w-7 rounded-full sm:h-9 sm:w-9" />
                <Shimmer className="hidden h-2.5 w-7 sm:block" />
              </div>

              <Shimmer className="mx-1.5 h-0.5 flex-1 rounded-none sm:mx-3" />

              <div className="flex shrink-0 items-center gap-1.5">
                <Shimmer className="h-7 w-7 rounded-full sm:h-9 sm:w-9" />
                <Shimmer className="hidden h-2.5 w-12 sm:block" />
              </div>

              <Shimmer className="mx-1.5 h-0.5 flex-1 rounded-none sm:mx-3" />

              <div className="flex shrink-0 items-center gap-1.5">
                <Shimmer className="h-7 w-7 rounded-full sm:h-9 sm:w-9" />
                <Shimmer className="hidden h-2.5 w-12 sm:block" />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CART */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT */}
          <div className="min-w-0">
            {/* SECTION HEADER */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <Shimmer className="h-4 w-24 sm:h-5 sm:w-32" />
                <Shimmer className="mt-1.5 h-2.5 w-40 sm:h-3 sm:w-52" />
              </div>

              <Shimmer className="h-6 w-14 rounded-lg sm:h-7 sm:w-16" />
            </div>

            {/* PRODUCT CARDS */}
            <div className="space-y-2.5 sm:space-y-3">
              <ProductCardShimmer />
              <ProductCardShimmer />
              <ProductCardShimmer />
            </div>

            {/* BENEFITS */}
            <BenefitsShimmer />
          </div>

          {/* RIGHT SUMMARY */}
          <SummaryShimmer />
        </div>
      </div>
    </div>
  )
}

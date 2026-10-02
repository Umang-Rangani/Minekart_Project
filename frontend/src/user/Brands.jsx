import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ChevronRight, Store, ShoppingBag } from 'lucide-react'
import BreadCrumb from './BreadCrumb'

export default function Brands() {
  const [brand, setBrand] = useState([])
  const [loading, setLoading] = useState(true)

  const getBrand = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/brand')
      setBrand(res.data?.data || [])
    } catch (error) {
      console.log('Get Brands Error:', error.response?.data || error.message)
      setBrand([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Brands | MineKart'
    getBrand()
  }, [])

  const items = [
    {
      title: 'Brands',
      link: null,
    },
  ]

  return (
    <div className="pb-10 ">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-5">
        {/* Brand Header */}
        {loading ? (
          <div className="mb-5 flex h-16 animate-pulse items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* Icon Shimmer */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0E8E2] sm:h-10 sm:w-10">
                <Store size={18} strokeWidth={1.7} className="text-[#D8CCC5]" />
              </div>

              {/* Title Shimmer */}
              <div className="min-w-0">
                <div className="h-3.5 w-20 rounded bg-[#E8DDD4] sm:h-4 sm:w-24" />

                <div className="mt-2 h-2.5 w-36 rounded bg-[#F0E8E2] sm:w-44" />
              </div>
            </div>

            {/* Count Shimmer */}
            <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 sm:px-2.5">
              <div className="h-3 w-3 rounded bg-[#E0D5CE]" />

              <div className="h-2.5 w-12 rounded bg-[#E8DDD4] sm:w-14" />
            </div>
          </div>
        ) : (
          <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

                <Store size={18} strokeWidth={1.8} className="relative z-10" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">All Brands</h1>

                <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Explore products from popular brands</p>
              </div>
            </div>

            <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 text-[8px] font-bold text-[#67544D] sm:px-2.5 sm:text-[9px]">
              <ShoppingBag size={12} strokeWidth={2} className="text-[#8E181F]" />

              <span>
                {brand.length} {brand.length === 1 ? 'Brand' : 'Brands'}
              </span>
            </div>
          </div>
        )}

        
        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex h-60 animate-pulse flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-64">
                {/* Brand Image Shimmer */}
                <div className="flex h-39 shrink-0 items-center justify-center bg-white px-4 sm:h-42">
                  <div className="flex h-16 w-24 items-center justify-center rounded-xl  sm:h-18 sm:w-28">
                    <Store size={26} strokeWidth={1.5} className="text-[#D8CCC5]" />
                  </div>
                </div>

                {/* Brand Info Shimmer */}
                <div className="flex h-21 shrink-0 flex-col justify-between border-t border-[#60483E] bg-[#513A32] px-3.5 pb-2 pt-1 sm:h-22">
                  <div>
                    <div className="h-3.5 w-24 rounded bg-[#806C63]" />

                    <div className="mt-2 h-2.5 w-full rounded bg-[#72574D]" />

                    <div className="mt-1.5 h-2.5 w-3/4 rounded bg-[#72574D]" />
                  </div>

                  {/* Footer Shimmer */}
                  <div className="flex items-center justify-between border-t border-[#654A41] pt-2">
                    <div className="h-2 w-20 rounded bg-[#806C63]" />

                    <div className="h-3 w-3 rounded-full bg-[#75564A]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : brand.length > 0 ? (
          /* Brands */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {brand.map((value) => {
              const isDisabled = value.status === 'Inactive'

              const cardClass = isDisabled
                ? 'group flex h-60 flex-col cursor-not-allowed overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:h-64'
                : 'group flex h-60 flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)] sm:h-64'

              const cardContent = (
                <>
                  {/* Brand Image - 65% */}
                  <div className={`relative flex h-39 shrink-0 items-center justify-center overflow-hidden px-4 sm:h-42 ${isDisabled ? 'bg-white' : 'bg-white'}`}>
                    {!isDisabled && <div className="absolute -right-7 -top-7 h-16 w-16 rounded-full bg-[#A51D26]/[0.035] transition-transform duration-500 group-hover:scale-150" />}

                    {value.brandLogo ? (
                      <img
                        src={getImageUrl(value.brandLogo)}
                        alt={value.brandName}
                        className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-300 group-hover:scale-105'}`}
                      />
                    ) : (
                      <div className={`relative z-10 flex h-full w-full items-center justify-center ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                        <Store size={30} strokeWidth={1.5} />
                      </div>
                    )}

                    {/* Inactive Badge */}
                    {isDisabled && <span className="absolute right-2 top-2 z-20 rounded-md bg-[#E5E5E5] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-[#888888]">Inactive</span>}
                  </div>

                  {/* Brand Info - 35% */}
                  <div
                    className={`flex h-21 min-h-0 shrink-0 flex-col justify-between border-t px-3.5 py-3 sm:h-22 ${
                      isDisabled ? 'border-[#D9D9D9] bg-[#F0EFED]' : 'border-[#60483E] bg-[#513A32] transition-colors duration-300 group-hover:bg-[#4A332C]'
                    }`}
                  >
                    {/* Brand Details */}
                    <div className="min-w-0">
                      <h2 className={`truncate text-xs font-extrabold sm:text-[13px] ${isDisabled ? 'text-[#777777]' : 'text-[#FFF8F3] transition-colors duration-300 group-hover:text-white'}`}>{value.brandName}</h2>

                      <p className={`mt-1 line-clamp-1 text-[9px] leading-3.5 sm:text-[10px] ${isDisabled ? 'text-[#999999]' : 'text-[#DCCBC2]'}`}>{value.description || 'Explore products from this brand'}</p>
                    </div>

                    {/* Footer / View Products */}
                    {isDisabled ? (
                      <div className="flex items-center justify-between border-t border-[#D9D9D9] pt-2">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-[#999999]">Unavailable</span>

                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E0DEDA] text-[#999999]">
                          <ChevronRight size={10} strokeWidth={2.5} />
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border-t border-[#654A41] pt-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#D4B9AA]">
                          <ShoppingBag size={11} strokeWidth={2} />

                          <span>View Products</span>
                        </div>

                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8A6252] text-[#FFF8F3] transition-all duration-300 group-hover:bg-[#A51D26]">
                          <ChevronRight size={10} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )

              return isDisabled ? (
                <div key={value._id} aria-disabled="true" className={cardClass}>
                  {cardContent}
                </div>
              ) : (
                <Link key={value._id} to={`/brand/${value._id}/products`} className={cardClass}>
                  {cardContent}
                </Link>
              )
            })}
          </div>
        ) : (
          /* Empty */
          <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <Store size={30} strokeWidth={1.7} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">No Brands Found</h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#806C63]">There are currently no brands available. Please check again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Store } from 'lucide-react'

export default function BrandList() {
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
    getBrand()
  }, [])

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E8DDD4] bg-[#FBF3EE] text-[#8E181F] shadow-[0_2px_6px_rgba(73,54,49,0.04)]">
              <Store size={17} strokeWidth={2} />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8E181F] sm:text-xs">Featured Brands</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Top Brands</h2>

          <p className="mt-1 truncate text-xs text-[#806C63] sm:text-sm">Explore products from popular brands</p>
        </div>

        {/* View All */}
        <Link
          to="/brands"
          className="group flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-2 text-xs font-semibold text-[#8E181F] shadow-[0_2px_7px_rgba(73,54,49,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#FBF3EE] hover:shadow-[0_5px_14px_rgba(73,54,49,0.08)] sm:px-3.5 sm:text-sm"
        >
          <span>View All</span>
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Brand Scroll */}
      <div className="no-scrollbar w-full overflow-x-auto scroll-smooth">
        <div className="flex min-w-max gap-4 pb-3">
          {loading
            ? /* Brand Shimmer */
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex h-60 w-48 shrink-0 animate-pulse flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-64 sm:w-52">
                  {/* 65% Image Shimmer */}
                  <div className="flex h-39 shrink-0 items-center justify-center bg-white px-4 sm:h-42">
                    <div className="flex h-14 w-28 items-center justify-center rounded-lg ">
                      <Store size={26} strokeWidth={1.5} className="text-[#D8CCC5]" />
                    </div>
                  </div>

                  {/* 35% Info Shimmer */}
                  <div className="flex h-21 shrink-0 flex-col justify-center border-t border-[#60483E] bg-[#513A32] px-3.5 sm:h-22">
                    <div className="h-3.5 w-24 rounded bg-[#806C63]" />

                    <div className="mt-2 h-2.5 w-full rounded bg-[#72574D]" />

                    <div className="mt-2 flex items-center justify-between">
                      <div className="h-2.5 w-12 rounded bg-[#806C63]" />
                      <div className="h-5 w-5 rounded-full bg-[#75564A]" />
                    </div>
                  </div>
                </div>
              ))
            : brand.map((value) => {
                const isDisabled = value.status === 'Inactive'

                const cardContent = (
                  <>
                    {/* 65% Image */}
                    <div className={`relative flex h-39 shrink-0 items-center justify-center overflow-hidden px-4 sm:h-42 ${isDisabled ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
                      {!isDisabled && <div className="absolute -right-7 -top-7 h-16 w-16 rounded-full bg-[#A51D26]/[0.035] transition-transform duration-500 group-hover:scale-150" />}
 
                      {value.brandLogo ? (
                        <img
                          src={`http://localhost:3000${value.brandLogo}`}
                          alt={value.brandName}
                          className={`relative z-10 h-12 w-full object-contain sm:h-14 ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-300 group-hover:scale-105'}`}
                        />
                      ) : (
                        <div className={`relative z-10 flex h-12 w-full items-center justify-center sm:h-14 ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                          <Store size={25} strokeWidth={1.5} />
                        </div>
                      )}

                      {/* Inactive Badge */}
                      {isDisabled && <span className="absolute right-2 top-2 z-20 rounded-md bg-[#E5E5E5] px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wide text-[#888888]">Inactive</span>}
                    </div>

                    {/* 35% Brand Info */}
                    <div className={`flex h-21 shrink-0 flex-col justify-center border-t px-3.5 sm:h-22 ${isDisabled ? 'border-[#D9D9D9] bg-[#F0EFED]' : 'border-[#60483E] bg-[#513A32] transition-colors duration-300 group-hover:bg-[#4A332C]'}`}>
                      {/* Brand Name */}
                      <h3 className={`truncate text-[12px] font-bold sm:text-[13px] ${isDisabled ? 'text-[#777777]' : 'text-[#FFF8F3] transition-colors duration-300 group-hover:text-white'}`}>{value.brandName}</h3>

                      {/* Description */}
                      <p className={`mt-1 line-clamp-1 text-[9px] leading-4 sm:text-[10px] ${isDisabled ? 'text-[#999999]' : 'text-[#DCCBC2]'}`}>{value.description || 'Explore products from this brand'}</p>

                      {/* Action */}
                      {isDisabled ? (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-[#999999]">Unavailable</span>

                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E0DEDA] text-[#999999]">
                            <ChevronRight size={10} strokeWidth={2.5} />
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-[#D4B9AA]">Explore</span>

                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8A6252] text-[#FFF8F3] transition-all duration-300 group-hover:bg-[#A51D26]">
                            <ChevronRight size={10} strokeWidth={2.5} />
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )

                return isDisabled ? (
                  <div key={value._id} aria-disabled="true" className="group flex h-60 w-48 shrink-0 cursor-not-allowed flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:h-64 sm:w-52">
                    {cardContent}
                  </div>
                ) : (
                  <Link
                    to={`/brand/${value._id}/products`}
                    key={value._id}
                    className="group flex h-60 w-48 shrink-0 flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_8px_20px_rgba(73,54,49,0.10)] sm:h-64 sm:w-52"
                  >
                    {cardContent}
                  </Link>
                )
              })}
        </div>
      </div>
    </section>
  )
}

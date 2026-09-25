import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Store } from 'lucide-react'

export default function BrandList() {
  const [brand, setBrand] = useState([])

  const getBrand = async () => {
    try {
      const res = await axiosInstance.get('/brand')
      setBrand(res.data?.data || [])
    } catch (error) {
      console.log('Get Brands Error:', error.response?.data || error.message)
      setBrand([])
    }
  }

  useEffect(() => {
    getBrand()
  }, [])

  return (
    <section className="w-full">
      {/* Heading */}
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
              <Store size={17} strokeWidth={2} />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A857B] sm:text-xs">Featured</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Top Brands</h2>

          <p className="mt-1 truncate text-xs text-[#806C63] sm:text-sm">Explore products from popular brands</p>
        </div>

        {/* View All */}
        <Link
          to="/brand"
          className="group flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-2 text-xs font-semibold text-[#8E181F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:shadow-md sm:px-3.5 sm:text-sm"
        >
          <span>View All</span>

          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Brand Scroll */}
      <div className="no-scrollbar w-full overflow-x-auto scroll-smooth">
        <div className="flex min-w-max gap-4 pb-3">
          {brand.map((value) => {
            const isDisabled = value.status === 'Inactive'

            const cardContent = (
              <>
                {/* Logo */}
                <div className={`relative flex h-24 items-center justify-center overflow-hidden px-5 sm:h-28 ${isDisabled ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
                  {!isDisabled && <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#A51D26]/[0.035] transition-transform duration-500 group-hover:scale-150" />}

                  {value.brandLogo ? (
                    <img
                      src={`http://localhost:3000${value.brandLogo}`}
                      alt={value.brandName}
                      className={`relative z-10 h-14 w-full object-contain sm:h-16 ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-300 group-hover:scale-105'}`}
                    />
                  ) : (
                    <div className={`relative z-10 flex h-14 w-full items-center justify-center sm:h-16 ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                      <Store size={27} strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Inactive Badge */}
                  {isDisabled && <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#E5E5E5] px-1.5 py-1 text-[7px] font-bold uppercase tracking-wide text-[#888888]">Inactive</span>}
                </div>

                {/* Brand Info */}
                <div className={`border-t px-3.5 py-2.5 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#EEE5DF] bg-[#FFFCFA] transition-colors duration-300 group-hover:bg-[#FBF5F1]'}`}>
                  {/* Brand Name */}
                  <h3 className={`truncate text-[13px] font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]'}`}>{value.brandName}</h3>

                  {/* Description */}
                  <p className={`mt-1 line-clamp-1 text-[10px] leading-4 ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{value.description || 'Explore products from this brand'}</p>

                  {/* Action */}
                  {isDisabled ? (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#999999]">Unavailable</span>

                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5E5E5] text-[#999999]">
                        <ChevronRight size={11} strokeWidth={2.5} />
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Explore</span>

                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F7EEE7] text-[#8E181F] transition-all duration-300 group-hover:bg-[#A51D26] group-hover:text-white">
                        <ChevronRight size={11} strokeWidth={2.5} />
                      </span>
                    </div>
                  )}
                </div>
              </>
            )

            return isDisabled ? (
              <div key={value._id} aria-disabled="true" className="group relative w-44 shrink-0 cursor-not-allowed overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:w-48">
                {cardContent}
              </div>
            ) : (
              <Link
                to={`/brand/${value._id}/products`}
                key={value._id}
                className="group relative w-44 shrink-0 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)] sm:w-48"
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

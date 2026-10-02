import { getImageUrl } from '../utils/imageUrl'
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
      {/* HEADER */}
      <div className="mb-3 flex items-end justify-between gap-2 sm:mb-6 sm:gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#E8DDD4] bg-[#FBF3EE] text-[#8E181F] shadow-[0_2px_6px_rgba(73,54,49,0.04)] sm:h-8 sm:w-8">
              <Store size={13} strokeWidth={2} />
            </span>

            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8E181F] sm:text-xs sm:tracking-[0.16em]">Featured Brands</span>
          </div>

          <h2 className="text-base font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Top Brands</h2>

          <p className="mt-0.5 truncate text-[10px] text-[#806C63] sm:mt-1 sm:text-sm">Explore products from popular brands</p>
        </div>

        {/* VIEW ALL */}
        <Link
          to="/brands"
          className="group flex shrink-0 items-center gap-1 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-2 py-1.5 text-[9px] font-semibold text-[#8E181F] shadow-[0_2px_7px_rgba(73,54,49,0.04)] sm:gap-1.5 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-sm"
        >
          <span>View All</span>

          <ArrowRight size={12} className="sm:h-4 sm:w-4 sm:transition-transform sm:duration-300 sm:group-hover:translate-x-1" />
        </Link>
      </div>

      {/* BRAND SCROLL */}
      <div className="no-scrollbar w-full overflow-x-auto scroll-smooth">
        <div className="flex min-w-max gap-2.5 pb-2 sm:gap-4 sm:pb-3">
          {loading
            ? /* BRAND SHIMMER */
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex h-45 w-32 shrink-0 animate-pulse flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-64 sm:w-52">
                  {/* IMAGE */}
                  <div className="flex h-27 shrink-0 items-center justify-center bg-white px-2.5 sm:h-42 sm:px-4">
                    <div className="flex h-10 w-20 items-center justify-center rounded-lg sm:h-14 sm:w-28">
                      <Store size={20} strokeWidth={1.5} className="text-[#D8CCC5]" />
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="flex h-18 shrink-0 flex-col justify-center border-t border-[#60483E] bg-[#513A32] px-2.5 sm:h-22 sm:px-3.5">
                    <div className="h-2.5 w-16 rounded bg-[#806C63] sm:h-3.5 sm:w-24" />

                    <div className="mt-1.5 h-2 w-full rounded bg-[#72574D] sm:mt-2 sm:h-2.5" />

                    <div className="mt-1.5 flex items-center justify-between sm:mt-2">
                      <div className="h-2 w-9 rounded bg-[#806C63] sm:w-12" />

                      <div className="h-5 w-5 rounded-full bg-[#75564A]" />
                    </div>
                  </div>
                </div>
              ))
            : brand.map((value) => {
                const isDisabled = value.status === 'Inactive'

                const cardContent = (
                  <>
                    {/* IMAGE */}
                    <div className={`relative flex h-27 shrink-0 items-center justify-center overflow-hidden px-2.5 sm:h-42 sm:px-4 ${isDisabled ? 'bg-white' : 'bg-white'}`}>
                      {!isDisabled && <div className="absolute -right-6 -top-6 h-14 w-14 rounded-full bg-[#A51D26]/[0.035] sm:h-16 sm:w-16 sm:-right-7 sm:-top-7 sm:transition-transform sm:duration-500 sm:group-hover:scale-150" />}

                      {value.brandLogo ? (
                        <img
                          src={getImageUrl(value.brandLogo)}
                          alt={value.brandName}
                          className={`relative z-10 h-9 w-full object-contain sm:h-14 ${isDisabled ? 'grayscale opacity-45' : 'sm:transition-transform sm:duration-300 sm:group-hover:scale-105'}`}
                        />
                      ) : (
                        <div className={`relative z-10 flex h-9 w-full items-center justify-center sm:h-14 ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                          <Store size={21} strokeWidth={1.5} />
                        </div>
                      )}

                      {/* INACTIVE */}
                      {isDisabled && <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-[#E5E5E5] px-1.5 py-0.5 text-[5px] font-bold uppercase tracking-wide text-[#888888] sm:right-2 sm:top-2 sm:px-1.5 sm:text-[6px]">Inactive</span>}
                    </div>

                    {/* BRAND INFO */}
                    <div
                      className={`flex h-18 shrink-0 flex-col justify-center border-t px-2.5 sm:h-22 sm:px-3.5 ${
                        isDisabled ? 'border-[#D9D9D9] bg-[#F0EFED]' : 'border-[#60483E] bg-[#513A32] sm:transition-colors sm:duration-300 sm:group-hover:bg-[#4A332C]'
                      }`}
                    >
                      {/* BRAND NAME */}
                      <h3 className={`truncate text-[10px] font-bold sm:text-[13px] ${isDisabled ? 'text-[#777777]' : 'text-[#FFF8F3] sm:transition-colors sm:duration-300 sm:group-hover:text-white'}`}>{value.brandName}</h3>

                      {/* DESCRIPTION */}
                      <p className={`mt-0.5 line-clamp-1 text-[7px] leading-3 sm:mt-1 sm:text-[10px] sm:leading-4 ${isDisabled ? 'text-[#999999]' : 'text-[#DCCBC2]'}`}>{value.description || 'Explore products from this brand'}</p>

                      {/* ACTION */}
                      {isDisabled ? (
                        <div className="mt-1 flex items-center justify-between sm:mt-2">
                          <span className="text-[6px] font-bold uppercase tracking-wider text-[#999999] sm:text-[8px]">Unavailable</span>

                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E0DEDA] text-[#999999]">
                            <ChevronRight size={10} strokeWidth={2.5} />
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center justify-between sm:mt-2">
                          <span className="text-[6px] font-bold uppercase tracking-wider text-[#D4B9AA] sm:text-[8px]">Explore</span>

                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8A6252] text-[#FFF8F3] sm:transition-colors sm:duration-300 sm:group-hover:bg-[#A51D26]">
                            <ChevronRight size={10} strokeWidth={2.5} />
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )

                return isDisabled ? (
                  <div key={value._id} aria-disabled="true" className="group flex h-45 w-32 shrink-0 cursor-not-allowed flex-col overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:h-64 sm:w-52">
                    {cardContent}
                  </div>
                ) : (
                  <Link
                    to={`/brand/${value._id}/products`}
                    key={value._id}
                    className="group flex h-45 w-32 shrink-0 flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-64 sm:w-52 sm:transition-all sm:duration-300 sm:hover:-translate-y-1 sm:hover:border-[#D8C1B6] sm:hover:shadow-[0_8px_20px_rgba(73,54,49,0.10)]"
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

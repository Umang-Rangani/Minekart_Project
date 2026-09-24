import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Store } from 'lucide-react'

export default function BrandList() {
  const [brand, setBrand] = useState([])

  const getBrand = async () => {
    try {
      const res = await axiosInstance.get('/brand')
      setBrand(res.data)
    } catch (error) {
      console.log('Get Brands Error:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    getBrand()
  }, [])

  return (
    <section className="w-ful">
      {/* Heading */}
      <div className="my-5 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
              <Store size={17} strokeWidth={2} />
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A857B]">Featured</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Top Brands</h2>

          <p className="mt-1 text-sm text-[#806C63]">Explore products from popular brands</p>
        </div>

        {/* View All */}
        <Link
          to="/brand"
          className="group flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-2 text-sm font-semibold text-[#8E181F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:shadow-md"
        >
          <span className="hidden sm:inline">View All</span>

          <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Brand Scroll */}
      <div className="no-scrollbar w-full overflow-x-auto scroll-smooth">
        <div className="flex min-w-max gap-4 pb-3">
          {brand?.data?.map((value) => (
            <Link
              to={`/brand/${value._id}/products`}
              key={value._id}
              className="group relative w-44 shrink-0 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)] sm:w-48"
            >
              {/* Logo */}
              <div className="relative flex h-24 items-center justify-center overflow-hidden bg-white px-5 sm:h-28">
                {/* Soft Decorative Circle */}
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#A51D26]/[0.035] transition-transform duration-500 group-hover:scale-150" />

                <img src={`http://localhost:3000${value.brandLogo}`} alt={value.brandName} className="relative z-10 h-14 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16" />
              </div>

              {/* Brand Info */}
              <div className="border-t border-[#EEE5DF] bg-[#FFFCFA] px-3.5 py-2.5 transition-colors duration-300 group-hover:bg-[#FBF5F1]">
                {/* Brand Name */}
                <h3 className="truncate text-[13px] font-bold text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]">{value.brandName}</h3>

                {/* Description */}
                {value.description && <p className="mt-1 line-clamp-1 text-[10px] leading-4 text-[#806C63]">{value.description}</p>}

                {/* Explore */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Explore</span>

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F7EEE7] text-[#8E181F] transition-all duration-300 group-hover:bg-[#A51D26] group-hover:text-white">
                    <ChevronRight size={11} strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

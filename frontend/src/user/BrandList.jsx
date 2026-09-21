import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, Store } from 'lucide-react'

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
        <div className="flex min-w-max gap-4 pb-2">
          {brand?.data?.map((value) => (
            <Link
              to={`/brand/${value._id}/products`}
              key={value._id}
              className="group w-48 shrink-0 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_14px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_12px_28px_rgba(73,54,49,0.13)] sm:w-52"
            >
              {/* Logo */}
              <div className="relative flex h-28 w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] px-5">
                {/* Decorative Background */}
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#A51D26]/5 transition-transform duration-500 group-hover:scale-150" />

                <img src={`http://localhost:3000${value.brandLogo}`} alt={value.brandName} className="relative z-10 h-16 w-full object-contain transition-transform duration-500 group-hover:scale-110" />
              </div>

              {/* Details */}
              <div className="min-h-20 border-t border-[#E8DDD4] bg-[#FBF7F2] px-4 py-3 transition-colors duration-300 group-hover:bg-[#F8EEE8]">
                <h3 className="truncate text-sm font-bold text-[#351C18]">{value.brandName}</h3>

                <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#806C63]">{value.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

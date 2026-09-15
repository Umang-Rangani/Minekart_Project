import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'

export default function BrandList() {
  const [brand, setBrand] = useState([])

  // category theme mate
  const [activeCategory, setActiveCategory] = useState(null)

  const getBrand = async () => {
    try {
      const res = await axiosInstance.get('/brand')
      setBrand(res.data)
      //   console.log(res.data.data);
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    } finally {
    }
  }

  useEffect(() => {
    getBrand()
  }, [])

  console.log('brand', brand?.data)

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">Top Brands</h2>

          <p className="mt-1 text-sm text-[#64748B]">Explore products from popular brands</p>
        </div>

        <button className="text-sm font-semibold text-[#1D4ED8] transition hover:text-[#172033]">View All →</button>
      </div>

      {/* Brand Scroll */}
      <div className="no-scrollbar w-full overflow-x-auto scroll-smooth">
        <div className="flex min-w-max gap-4 ">
          {brand?.data?.map((value) => {
            return (
              <Link
                to={`/brand/${value._id}/products`}
                key={value._id}
                className="group w-48 shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-700 hover:w-55 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-lg"
              >
                {/* Logo */}
                <div className="flex h-24 w-full items-center justify-center bg-[#F8FAFC] ">
                  <img src={`http://localhost:3000${value.brandLogo}`} alt={value.brandName} className="h-16 w-full object-fill transition-transform duration-300 group-hover:scale-103" />
                </div>

                {/* Brand Details */}
                <div className="border-t border-[#E2E8F0] px-3 py-3">
                  <h3 className="text-sm font-bold text-[#172033]">{value.brandName}</h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#64748B]">{value.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

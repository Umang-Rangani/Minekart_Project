import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, Store, ShoppingBag } from 'lucide-react'
import BreadCrumb from './BreadCrumb'

export default function Brands() {
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

  const activeBrands = brand?.data?.filter((value) => value.status === 'Active') || []

  const items = [{ title: 'Brands', link: null }]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      {/* Heading */}
      <div className="mb-6 mt-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_6px_24px_rgba(73,54,49,0.07)]">
        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          {/* Left Side */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/20 sm:h-16 sm:w-16">
              <Store size={30} strokeWidth={1.8} />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#FFFDFC] bg-[#D4A373]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                <h1 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl lg:text-3xl">All Brands</h1>
              </div>

              <p className="ml-3 mt-1 text-xs text-[#806C63] sm:text-sm">Explore products from popular brands</p>
            </div>
          </div>

          {/* Brand Count */}
          <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-2 text-xs font-bold text-[#8E181F] shadow-sm">
            <Sparkles size={15} />
            <span>
              {activeBrands.length} {activeBrands.length === 1 ? 'Brand' : 'Brands'}
            </span>
          </div>
        </div>
      </div>

      {/* All Brands */}
      {activeBrands.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {activeBrands.map((value) => (
            <Link
              key={value._id}
              to={`/brand/${value._id}/products`}
              className="group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_14px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)]"
            >
              {/* Brand Image */}
              <div className="relative flex h-32 items-center justify-center overflow-hidden bg-linear-to-br from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] p-5 sm:h-36">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#A51D26]/5 transition-transform duration-500 group-hover:scale-150" />

                <img src={`http://localhost:3000${value.brandLogo}`} alt={value.brandName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />

              </div>

              {/* Brand Details */}
              <div className="min-h-30 border-t border-[#E8DDD4] bg-[#FBF7F2] px-4 py-4 transition-colors duration-300 group-hover:bg-[#F8EEE8]">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="truncate text-sm font-extrabold text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]">{value.brandName}</h2>

                </div>

                <p className="mt-2 line-clamp-2 min-h-8 text-xs leading-4 text-[#806C63]">{value.description || 'Explore products from this brand'}</p>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-[#8E181F]">
                  <ShoppingBag size={13} />
                  <span>View Products</span>
                  <ChevronRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <Store size={30} strokeWidth={1.7} />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">No Brands Found</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-[#806C63]">There are currently no active brands available. Please check again later.</p>
        </div>
      )}
    </div>
  )
}

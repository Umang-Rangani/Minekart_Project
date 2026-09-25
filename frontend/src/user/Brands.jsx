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
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-5 pb-10">
        {/* Brand Header */}
        {!loading && (
          <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
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
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_14px_rgba(73,54,49,0.06)]">
                <div className="h-32 animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2] sm:h-36" />

                <div className="space-y-3 border-t border-[#E8DDD4] bg-[#FBF7F2] p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-[#E8DDD4]" />

                  <div className="h-3 w-full animate-pulse rounded bg-[#E8DDD4]" />

                  <div className="h-3 w-3/4 animate-pulse rounded bg-[#E8DDD4]" />

                  <div className="h-3 w-20 animate-pulse rounded bg-[#E8DDD4]" />
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
                ? 'group relative cursor-not-allowed overflow-hidden rounded-2xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_3px_12px_rgba(0,0,0,0.04)]'
                : 'group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_14px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)]'

              const cardContent = (
                <>
                  {/* Brand Image */}
                  <div className={`relative flex h-32 items-center justify-center overflow-hidden p-5 sm:h-36 ${isDisabled ? 'bg-[#FFFF]' : 'bg-[#FFFFFF]'}`}>
                   

                    {value.brandLogo ? (
                      <img
                        src={`http://localhost:3000${value.brandLogo}`}
                        alt={value.brandName}
                        className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-50' : 'transition-transform duration-500 group-hover:scale-110'}`}
                      />
                    ) : (
                      <div className={`relative z-10 flex h-full w-full items-center justify-center ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                        <Store size={30} strokeWidth={1.5} />
                      </div>
                    )}

                    {isDisabled && <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#E5E5E5] px-2 py-1 text-[9px] font-bold text-[#888888]">Inactive</span>}
                  </div>

                  {/* Brand Details */}
                  <div className={`min-h-30 border-t px-4 py-4 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#E8DDD4] bg-[#FBF7F2] transition-colors duration-300 group-hover:bg-[#F8EEE8]'}`}>
                    <h2 className={`truncate text-sm font-extrabold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]'}`}>{value.brandName}</h2>

                    <p className={`mt-2 line-clamp-2 min-h-8 text-xs leading-4 ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{value.description || 'Explore products from this brand'}</p>

                    {isDisabled ? (
                      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-[#999999]">
                        <span>Currently Unavailable</span>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-[#8E181F]">
                        <ShoppingBag size={13} />

                        <span>View Products</span>

                        <ChevronRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>
                </>
              )

              return isDisabled ? (
                <div key={value._id} className={cardClass} aria-disabled="true">
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

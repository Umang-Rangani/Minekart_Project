import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, Image, LayoutGrid, ShoppingBag } from 'lucide-react'
import { TbIcons } from 'react-icons/tb'
import BreadCrumb from './BreadCrumb'
import { getImageUrl } from '../utils/imageUrl'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const getCategories = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/category/with-products')
      setCategories(res.data)
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCategories()
    document.title = 'Categories | MineKart'
  }, [])

  const categoryList = categories?.data || []

  const items = [{ title: 'Categories', link: null }]

  return (
    <div className="pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-5">
        {loading ? (
          <div className="space-y-5 animate-pulse">
            {/* HEADER SHIMMER */}
            <div className="flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E5D9D2] sm:h-10 sm:w-10" />

                <div className="space-y-2">
                  <div className="h-3.5 w-32 rounded bg-[#E2D7D0] sm:h-4 sm:w-36" />

                  <div className="h-2.5 w-48 rounded bg-[#EEE7E2] sm:w-56" />
                </div>
              </div>

              <div className="h-8 w-20 shrink-0 rounded-lg bg-[#F0E8E3] sm:w-24" />
            </div>

            {/* CATEGORY CARDS SHIMMER */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="relative min-h-62 overflow-hidden rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:min-h-65 sm:p-4">
                  {/* IMAGE SHIMMER */}
                  <div className="mb-4 h-20 w-20 shrink-0 rounded-xl bg-[#F0E5DE] sm:h-22 sm:w-22 md:h-24 md:w-24" />

                  {/* CATEGORY NAME */}
                  <div className="h-3.5 w-3/4 rounded bg-[#E2D8D2] sm:h-4" />

                  {/* DESCRIPTION */}
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2.5 w-full rounded bg-[#EEE7E2]" />
                    <div className="h-2.5 w-4/5 rounded bg-[#EEE7E2]" />
                  </div>

                  {/* VIEW PRODUCTS */}
                  <div className="mt-4 h-3 w-24 rounded bg-[#E5D9D2] sm:w-28" />

                  {/* DECORATIVE ICON */}
                  <TbIcons size={80} strokeWidth={1} className="absolute -bottom-5 -right-5 text-[#999999]/10" />
                </div>
              ))}
            </div>
          </div>
        ) : categoryList.length > 0 ? (
          <div>
            {/* HEADER */}
            <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                {/* HEADER ICON */}
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
                  <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

                  <LayoutGrid size={18} strokeWidth={1.9} className="relative z-10" />
                </div>

                {/* HEADER TEXT */}
                <div className="min-w-0">
                  <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Explore Categories</h1>

                  <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Browse all categories and discover products</p>
                </div>
              </div>

              {/* CATEGORY COUNT */}
              <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 text-[8px] font-bold text-[#67544D] sm:px-2.5 sm:text-[9px]">
                <LayoutGrid size={12} strokeWidth={2} className="text-[#8E181F]" />

                <span>
                  {categoryList.length} {categoryList.length === 1 ? 'Category' : 'Categories'}
                </span>
              </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {categoryList.map((category) => {
                const isDisabled = category.status === 'Inactive'

                {
                  /* CARD */
                }
                const cardClass = isDisabled
                  ? 'group relative min-h-62  overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] p-3.5 text-[#888888] shadow-[0_3px_12px_rgba(0,0,0,0.04)] sm:min-h-65 sm:p-4'
                  : 'group relative min-h-62 overflow-hidden rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:bg-white hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)] sm:min-h-65 sm:p-4'

                {
                  /* IMAGE BOX */
                }
                const iconClass = isDisabled
                  ? 'mb-4 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E7E7E7] text-[#999999] sm:h-22 sm:w-22 md:h-24 md:w-24'
                  : 'mb-4 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7EEE7] text-[#8E181F] transition-all duration-300 group-hover:scale-105  group-hover:text-white group-hover:shadow-md group-hover:shadow-[#7D171C]/20 sm:h-22 sm:w-22 md:h-24 md:w-24'

                {
                  /* NAME */
                }
                const nameClass = isDisabled ? 'line-clamp-1 text-[13px] font-bold text-[#777777] sm:text-sm' : 'line-clamp-1 text-[13px] font-bold text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F] sm:text-sm'

                {
                  /* DESCRIPTION */
                }
                const descriptionClass = isDisabled ? 'mt-1.5 line-clamp-2 min-h-9 text-[10px] leading-4 text-[#999999] sm:text-[11px] sm:leading-4.5' : 'mt-1.5 line-clamp-2 min-h-9 text-[10px] leading-4 text-[#806C63] sm:text-[11px] sm:leading-4.5'

                {
                  /* ACTION */
                }
                const actionClass = isDisabled
                  ? 'mt-4 flex items-center gap-1 text-[10px] font-bold text-[#999999] sm:text-[11px]'
                  : 'mt-4 flex items-center gap-1 text-[10px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-2 sm:text-[11px]'

                return (
                  <Link key={category._id} to={`/category/${category._id}/products`} className={cardClass}>
                    {isDisabled && <div className="absolute right-3 top-3 rounded-md bg-[#E5E5E5] px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-[#888888] ">Inactive</div>}

                    <div className={iconClass}>
                      {category.categoryImage ? (
                        <img src={getImageUrl(category.categoryImage)} alt={category.categoryName} className={`h-full w-full object-contain p-1 ${isDisabled ? 'grayscale opacity-40' : ''}`} />
                      ) : (
                        <Image size={32} strokeWidth={1.8} />
                      )}
                    </div>

                    <h2 className={nameClass}>{category.categoryName}</h2>

                    <p className={descriptionClass}>{category.description || 'Explore products in this category'}</p>

                    <div className={actionClass}>
                      <span>{isDisabled ? 'View Unavailable Products' : 'View Products'}</span>
                      <ArrowRight size={13} strokeWidth={2.3} />
                    </div>

                    <Image size={80} strokeWidth={1} className={`absolute -bottom-5 -right-5 ${isDisabled ? 'text-[#999999]/10' : 'text-[#A51D26]/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#A51D26]/10'}`} />
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          /*  EMPTY STATE  */
          <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center shadow-[0_2px_10px_rgba(73,54,49,0.03)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={28} strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">No Categories Found</h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#806C63]">There are currently no active categories available. Please check again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

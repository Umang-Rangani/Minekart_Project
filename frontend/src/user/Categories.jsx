import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleHelp, LayoutGrid, ShoppingBag } from 'lucide-react'
import { iconMap } from '../data/iconMap'
import BreadCrumb from './BreadCrumb'

export default function Categories() {
  const [categories, setCategories] = useState([])

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('/category')
      setCategories(res.data)
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    getCategories()

    document.title = `Categories | MineKart`
  }, [])

  const categoryList = categories?.data || []

  const items = [{ title: 'Categories', link: null }]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4">
        {/* HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <LayoutGrid size={18} strokeWidth={1.9} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Explore Categories</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Browse all categories and discover products</p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 text-[8px] font-bold text-[#67544D] sm:px-2.5 sm:text-[9px]">
            <LayoutGrid size={12} strokeWidth={2} className="text-[#8E181F]" />

            <span>
              {categoryList.length} {categoryList.length === 1 ? 'Category' : 'Categories'}
            </span>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        {categoryList.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categoryList.map((category) => {
              const Icon = iconMap?.[category.categoryLucideIcons] || CircleHelp

              const isDisabled = category.status === 'Inactive'

              const cardClass = isDisabled
                ? 'group relative cursor-not-allowed overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] p-3.5 text-[#888888] shadow-[0_3px_12px_rgba(0,0,0,0.04)] sm:p-4'
                : 'group relative overflow-hidden rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:bg-white hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)] sm:p-4'

              const iconClass = isDisabled
                ? 'mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7E7E7] text-[#999999] sm:h-12 sm:w-12'
                : 'mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F] transition-all duration-300 group-hover:scale-105 group-hover:bg-linear-to-br group-hover:from-[#7D171C] group-hover:to-[#A51D26] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#7D171C]/20 sm:h-12 sm:w-12'

              const nameClass = isDisabled ? 'line-clamp-1 text-[13px] font-bold text-[#777777] sm:text-sm' : 'line-clamp-1 text-[13px] font-bold text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F] sm:text-sm'

              const descriptionClass = isDisabled ? 'mt-1.5 line-clamp-2 min-h-9 text-[10px] leading-4 text-[#999999] sm:text-[11px] sm:leading-4.5' : 'mt-1.5 line-clamp-2 min-h-9 text-[10px] leading-4 text-[#806C63] sm:text-[11px] sm:leading-4.5'

              const actionClass = isDisabled
                ? 'mt-4 flex items-center gap-1 text-[10px] font-bold text-[#999999] sm:text-[11px]'
                : 'mt-4 flex items-center gap-1 text-[10px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-2 sm:text-[11px]'

              return isDisabled ? (
                <div key={category._id} className={cardClass} aria-disabled="true">
                  {/* DISABLED BADGE */}
                  <div className="absolute right-3 top-3 rounded-md bg-[#E5E5E5] px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-[#888888]">Inactive</div>

                  {/* ICON */}
                  <div className={iconClass}>
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  {/* NAME */}
                  <h2 className={nameClass}>{category.categoryName}</h2>

                  {/* DESCRIPTION */}
                  <p className={descriptionClass}>{category.description || 'Explore products in this category'}</p>

                  {/* DISABLED ACTION */}
                  <div className={actionClass}>
                    <span>Currently Unavailable</span>

                    <ArrowRight size={13} strokeWidth={2.3} />
                  </div>

                  {/* DISABLED DECORATIVE ICON */}
                  <Icon size={80} strokeWidth={1} className="absolute -bottom-5 -right-5 text-[#999999]/10" />
                </div>
              ) : (
                <Link key={category._id} to={`/category/${category._id}/products`} className={cardClass}>
                  {/* ICON */}
                  <div className={iconClass}>
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  {/* NAME */}
                  <h2 className={nameClass}>{category.categoryName}</h2>

                  {/* DESCRIPTION */}
                  <p className={descriptionClass}>{category.description || 'Explore products in this category'}</p>

                  {/* VIEW PRODUCTS */}
                  <div className={actionClass}>
                    <span>View Products</span>

                    <ArrowRight size={13} strokeWidth={2.3} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>

                  {/* DECORATIVE ICON */}
                  <Icon size={80} strokeWidth={1} className="absolute -bottom-5 -right-5 text-[#A51D26]/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#A51D26]/10" />
                </Link>
              )
            })}
          </div>
        ) : (
          /* EMPTY STATE */
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

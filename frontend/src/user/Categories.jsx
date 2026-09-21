import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleHelp, LayoutGrid, ShoppingBag, Sparkles } from 'lucide-react'
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
  }, [])

  const categoryList = categories?.data?.filter((category) => category.status === 'Active') || []

  const items = [{ title: 'Categories', link: null }]

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb items={items} />

      <div className="mx-auto pt-5">
        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] p-5 shadow-[0_5px_20px_rgba(73,54,49,0.06)] sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Category Icon */}
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/20 sm:h-16 sm:w-16">
                <LayoutGrid size={30} strokeWidth={1.8} />
              </div>

              {/* Heading */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />

                  <h1 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl lg:text-3xl">Explore Categories</h1>
                </div>

                <p className="ml-3 mt-1 text-xs leading-5 text-[#806C63] sm:text-sm">Browse all categories and discover products available on MineKart.</p>
              </div>
            </div>

            {/* Category Count */}
            <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-2 text-sm font-semibold text-[#8E181F] shadow-sm">
              <Sparkles size={16} />
              <span>{categoryList.length} Categories</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categoryList.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categoryList.map((category) => {
              const Icon = iconMap?.[category.categoryLucideIcons] || CircleHelp

              return (
                <Link
                  key={category._id}
                  to={`/category/${category._id}/products`}
                  className="group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 shadow-[0_4px_14px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:bg-[#FFFCFA] hover:shadow-[0_12px_28px_rgba(73,54,49,0.12)] sm:p-5"
                >
                  {/* Icon */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F] transition-all duration-300 group-hover:scale-105 group-hover:bg-linear-to-br group-hover:from-[#7D171C] group-hover:to-[#A51D26] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#7D171C]/20 sm:h-14 sm:w-14">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  {/* Category Name */}
                  <h2 className="line-clamp-1 text-sm font-bold text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F] sm:text-base">{category.categoryName}</h2>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#806C63]">{category.description || 'Explore products in this category'}</p>

                  {/* View Products */}
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#8E181F] transition-all duration-300 group-hover:gap-2">
                    <span>View Products</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>

                  {/* Decorative Icon */}
                  <Icon size={90} strokeWidth={1} className="absolute -bottom-6 -right-6 text-[#A51D26]/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#A51D26]/10" />
                </Link>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-6 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={30} strokeWidth={1.6} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#351C18]">No Categories Found</h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#806C63]">There are currently no active categories available. Please check again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

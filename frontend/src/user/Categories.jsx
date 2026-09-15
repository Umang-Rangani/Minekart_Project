import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, LayoutGrid, MapPin, ShoppingBag, Sparkles, Zap } from 'lucide-react'
import { iconMap } from '../data/iconMap'
import { useUser } from '../context/userProvider'
import BreadCrumb from './BreadCrumb'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const { user } = useUser()

  // category theme mate
  const [activeCategory, setActiveCategory] = useState(null)

  const getCategories = async () => {
    try {
      // setLoading(true)

      const res = await axiosInstance.get('/category')
      setCategories(res.data)
      //   console.log(res.data.data);
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  //   console.log('categories', categories)

  const categoryList = categories?.data?.filter((category) => category.status === 'Active') || []

  const items = [{ title: 'Categories', link: null }]

  return (
    <div className="min-h-screen  ">
      <BreadCrumb items={items} />
      <div className="mx-auto pt-5">
        {/* Header */}
        <div className="mb-5 rounded-md bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Category Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#1D4ED8] shadow-sm sm:h-15 sm:w-15">
                <LayoutGrid size={32} strokeWidth={1.8} />
              </div>

              {/* Heading */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-[#1D4ED8]" />

                  <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">Explore Categories</h1>
                </div>

                <p className="mt-1 ml-3 text-sm text-[#64748B] sm:text-base">Browse all categories and discover products available on MineKart.</p>
              </div>
            </div>

            {/* Category Count */}
            <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#2563EB]">
              <Sparkles size={16} />
              <span>{categoryList.length} Categories</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categoryList.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categoryList.map((category) => {
              const Icon = iconMap?.[category.categoryLucideIcons] || CircleHelp

              return (
                <Link
                  key={category._id}
                  to={`/category/${category._id}/products`}
                  className="group relative overflow-hidden rounded-2xl border border-[#DBEAFE] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-[#93C5FD] hover:bg-white hover:shadow-md"
                >
                  {/* Icon */}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] transition duration-200 group-hover:bg-[#2563EB] group-hover:text-white">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  {/* Category Name */}
                  <h2 className="line-clamp-1 text-base font-semibold text-[#1E293B]">{category.categoryName}</h2>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-[#64748B]">{category.description || 'Explore products in this category'}</p>

                  {/* View Products */}
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#2563EB] transition group-hover:gap-2">
                    <span>View Products</span>
                    <ArrowRight size={14} />
                  </div>

                  {/* Decorative Icon */}
                  <Icon size={90} strokeWidth={1} className="absolute -bottom-6 -right-6 text-[#2563EB]/5 transition duration-300 group-hover:scale-110" />
                </Link>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-dashed border-[#BFDBFE] bg-white px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
              <ShoppingBag size={30} strokeWidth={1.6} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#1E293B]">No Categories Found</h2>

            <p className="mt-2 max-w-md text-sm text-[#64748B]">There are currently no active categories available. Please check again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

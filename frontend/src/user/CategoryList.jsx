import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link, NavLink } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { iconMap } from '../data/iconMap'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)

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

  return (
    <div className="fixed left-0 top-30 z-40 flex w-full items-center border-y border-[#E8DDD4] bg-[#FFFDFC]/95 shadow-[0_4px_18px_rgba(73,54,49,0.07)] backdrop-blur-md">
      {/* For You */}
      <div className="shrink-0 border-r border-[#E8DDD4] bg-[#FBF7F2]">
        <NavLink
          to="/"
          onClick={() => setActiveCategory(null)}
          className={`group relative flex min-w-22 flex-col items-center gap-1.5 px-4 py-3 text-xs transition-all duration-300 sm:min-w-25 sm:px-5 sm:py-3.5 sm:text-sm ${activeCategory === null ? 'font-semibold text-[#8E181F]' : 'text-[#67544D] hover:bg-[#F7EEE7] hover:text-[#8E181F]'}`}
        >
          {/* Icon */}
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${activeCategory === null ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/20' : 'bg-[#F4E9E2] text-[#67544D] group-hover:scale-105 group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F]'}`}
          >
            <Zap size={19} strokeWidth={2} />
          </div>

          <span className="whitespace-nowrap">For You</span>

          {/* Active Indicator */}
          {activeCategory === null && <span className="absolute bottom-0 left-4 right-4 h-0.75 rounded-t-full bg-linear-to-r from-[#7D171C] to-[#B5262D]" />}
        </NavLink>
      </div>

      {/* Categories */}
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar flex w-full items-center overflow-x-auto scroll-smooth">
          {categories?.data?.map((category) => {
            const Icon = iconMap[category.categoryLucideIcons]
            const active = activeCategory === category._id

            return (
              <Link
                key={category._id}
                to={`/category/${category._id}/products`}
                onClick={() => setActiveCategory(category._id)}
                className={`group relative flex min-w-20 shrink-0 flex-col items-center gap-1.5 px-3 py-3 text-xs transition-all duration-300 sm:min-w-23 sm:px-4 sm:py-3.5 sm:text-sm ${active ? 'font-semibold text-[#8E181F]' : 'text-[#67544D] hover:bg-[#FCF5F0] hover:text-[#8E181F]'}`}
              >
                {/* Icon */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${active ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/20' : 'bg-[#F7EEE7] text-[#67544D] group-hover:scale-105 group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F]'}`}
                >
                  {Icon && <Icon size={19} strokeWidth={1.9} />}
                </div>

                {/* Name */}
                <span className="max-w-22 truncate whitespace-nowrap">{category.categoryName}</span>

                {/* Active Indicator */}
                {active && <span className="absolute bottom-0 left-3 right-3 h-1 rounded-t-full bg-linear-to-r from-[#7D171C] to-[#B5262D]" />}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

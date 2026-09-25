import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link, NavLink } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'
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
    <div className="fixed left-0 top-26 z-40 w-full border-y border-[#E8DDD4] bg-[#FFFDFC]/98 shadow-[0_4px_18px_rgba(73,54,49,0.08)] backdrop-blur-xl">
      <div className="flex w-full items-stretch">
        {/* For You */}
        <div className="shrink-0 border-r border-[#E8DDD4] bg-[#FBF7F2]">
          <NavLink
            to="/"
            onClick={() => setActiveCategory(null)}
            className={`group relative flex h-full min-w-24 flex-col items-center justify-center gap-1.5 px-4 py-2.5 transition-all duration-300 sm:min-w-28 sm:px-5 ${
              activeCategory === null ? 'text-[#8E181F]' : 'text-[#67544D] hover:bg-[#F7EEE7] hover:text-[#8E181F]'
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                activeCategory === null ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_5px_12px_rgba(125,23,28,0.22)]' : 'bg-[#F1E7E0] text-[#67544D] group-hover:scale-105 group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F]'
              }`}
            >
              <Zap size={18} strokeWidth={2.2} fill="currentColor" />
            </div>

            <span className={`whitespace-nowrap text-[11px] sm:text-xs ${activeCategory === null ? 'font-bold' : 'font-semibold'}`}>For You</span>

            {/* Active line */}
            {activeCategory === null && <span className="absolute bottom-0 left-3 right-3 h-0.75 rounded-t-full bg-linear-to-r from-[#7D171C] to-[#B5262D]" />}
          </NavLink>
        </div>

        {/* Categories */}
        <div className="min-w-0 flex-1">
          <div className="no-scrollbar flex h-full w-full items-stretch overflow-x-auto scroll-smooth">
            {categories?.data?.map((category) => {
              const Icon = iconMap[category.categoryLucideIcons]
              const active = activeCategory === category._id

              return (
                <Link
                  key={category._id}
                  to={`/category/${category._id}/products`}
                  onClick={() => setActiveCategory(category._id)}
                  className={`group relative flex min-w-21 shrink-0 flex-col items-center justify-center gap-1.5 px-3 py-2.5 transition-all duration-300 sm:min-w-24 sm:px-4 ${
                    active ? 'bg-[#FFF8F5] text-[#8E181F]' : 'text-[#67544D] hover:bg-[#FCF5F0] hover:text-[#8E181F]'
                  }`}
                >
                  {/* Category Icon */}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                      active ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_5px_12px_rgba(125,23,28,0.22)]' : 'bg-[#F7EEE7] text-[#67544D] group-hover:scale-105 group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F]'
                    }`}
                  >
                    {Icon && <Icon size={18} strokeWidth={1.9} />}
                  </div>

                  {/* Category Name */}
                  <span className={`max-w-23 truncate whitespace-nowrap text-[11px] sm:text-xs ${active ? 'font-bold' : 'font-semibold'}`}>{category.categoryName}</span>

                  {/* Active Indicator */}
                  {active && <span className="absolute bottom-0 left-3 right-3 h-0.75 rounded-t-full bg-linear-to-r from-[#7D171C] to-[#B5262D]" />}
                </Link>
              )
            })}

            {/* More / Scroll Hint */}
            {/* {categories?.data?.length > 0 && (
              <div className="sticky right-0 flex shrink-0 items-center border-l border-[#E8DDD4] bg-linear-to-l from-[#FFFDFC] via-[#FFFDFC] to-transparent pl-3 pr-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DDD4] bg-white text-[#8E181F] shadow-sm">
                  <ChevronRight size={15} strokeWidth={2.2} />
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

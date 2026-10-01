import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link, NavLink } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { iconMap } from '../data/iconMap'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCategories = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/category')
      setCategories(res.data)
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div className="fixed left-0 top-23 sm:top-26 z-40 w-full">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-stretch border-y border-[#E8DDD4] bg-[#FFFDFC]/98 shadow-[0_4px_18px_rgba(73,54,49,0.08)] backdrop-blur-xl sm:h-23">
        {/* FOR YOU */}
        <div className="shrink-0 border-r border-[#E8DDD4] bg-[#FBF7F2]">
          {loading ? (
            <div className="flex h-full w-18 flex-col items-center justify-center gap-1.5 px-2 sm:w-28 sm:px-5">
              <div className="h-8 w-8 animate-pulse rounded-xl bg-[#E8DDD4] sm:h-9 sm:w-9" />
              <div className="h-2 w-10 animate-pulse rounded bg-[#E8DDD4] sm:h-2.5 sm:w-12" />
            </div>
          ) : (
            <NavLink
              to="/"
              onClick={() => setActiveCategory(null)}
              className={`group relative flex h-full w-18 flex-col items-center justify-center gap-1 px-2 transition-colors duration-200 sm:w-28 sm:gap-1.5 sm:px-5 ${
                activeCategory === null ? 'text-[#8E181F]' : 'text-[#67544D] hover:bg-[#F7EEE7] hover:text-[#8E181F]'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
                  activeCategory === null ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_5px_12px_rgba(125,23,28,0.22)]' : 'bg-[#F1E7E0] text-[#67544D] group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F]'
                }`}
              >
                <Zap size={16} strokeWidth={2.2} fill="currentColor" className="sm:h-18 sm:w-18" />
              </div>

              <span className={`whitespace-nowrap text-[9px] sm:text-xs ${activeCategory === null ? 'font-bold' : 'font-semibold'}`}>For You</span>

              {activeCategory === null && <span className="absolute bottom-0 left-2 right-2 h-0.75 rounded-t-full bg-linear-to-r from-[#7D171C] to-[#B5262D] sm:left-3 sm:right-3" />}
            </NavLink>
          )}
        </div>

        {/* CATEGORIES */}
        <div className="min-w-0 flex-1">
          <div className="no-scrollbar flex h-full w-full items-stretch overflow-x-auto scroll-smooth">
            {loading ? (
              <div className="flex h-full min-w-max items-stretch">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex min-w-18 shrink-0 animate-pulse flex-col items-center justify-center gap-1.5 px-2 sm:min-w-24 sm:px-4">
                    <div className="h-8 w-8 rounded-xl bg-[#E8DDD4] sm:h-9 sm:w-9" />

                    <div className={`h-2 rounded bg-[#EDE5DF] ${index % 3 === 0 ? 'w-10' : index % 3 === 1 ? 'w-14' : 'w-12'}`} />
                  </div>
                ))}
              </div>
            ) : (
              categories?.data?.map((category) => {
                const Icon = iconMap[category.categoryLucideIcons]

                const active = activeCategory === category._id

                const isDisabled = category.status === 'Inactive'

                const categoryContent = (
                  <>
                    {/* CATEGORY ICON */}
                    <div
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
                        isDisabled
                          ? 'bg-[#E8E5E2] text-[#999999]'
                          : active
                            ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_5px_12px_rgba(125,23,28,0.22)]'
                            : 'bg-[#F7EEE7] text-[#67544D] group-hover:bg-[#F2DDD5] group-hover:text-[#8E181F]'
                      }`}
                    >
                      {Icon && <Icon size={16} strokeWidth={1.9} className="sm:h-18 sm:w-18" />}
                    </div>

                    {/* CATEGORY NAME */}
                    <span className={`max-w-18 truncate whitespace-nowrap text-[9px] sm:max-w-23 sm:text-xs ${isDisabled ? 'font-semibold text-[#888888]' : active ? 'font-bold text-[#8E181F]' : 'font-semibold'}`}>{category.categoryName}</span>

                    {/* INACTIVE */}
                    {isDisabled && <span className="rounded-md bg-[#E8E5E2] px-1 py-0.5 text-[6px] font-bold uppercase tracking-wide text-[#888888] sm:px-1.5 sm:text-[7px]">Inactive</span>}

                    {/* ACTIVE INDICATOR */}
                    {active && !isDisabled && <span className="absolute bottom-0 left-2 right-2 h-0.75 rounded-t-full bg-linear-to-r from-[#7D171C] to-[#B5262D] sm:left-3 sm:right-3" />}
                  </>
                )

                {
                  /* DISABLED CATEGORY */
                }
                if (isDisabled) {
                  return (
                    <div key={category._id} aria-disabled="true" className="group relative flex min-w-18 shrink-0 cursor-not-allowed flex-col items-center justify-center gap-1 px-2 text-[#888888] sm:min-w-24 sm:gap-1.5 sm:px-4">
                      {categoryContent}
                    </div>
                  )
                }

                {
                  /* ACTIVE CATEGORY */
                }
                return (
                  <Link
                    key={category._id}
                    to={`/category/${category._id}/products`}
                    onClick={() => setActiveCategory(category._id)}
                    className={`group relative flex min-w-18 shrink-0 flex-col items-center justify-center gap-1 px-2 transition-colors duration-200 sm:min-w-24 sm:gap-1.5 sm:px-4 ${
                      active ? 'bg-[#FFF8F5] text-[#8E181F]' : 'text-[#67544D] hover:bg-[#FCF5F0] hover:text-[#8E181F]'
                    }`}
                  >
                    {categoryContent}
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

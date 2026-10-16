import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link, NavLink } from 'react-router-dom'
import { Image, Zap, ArrowRight } from 'lucide-react'
import { getImageUrl } from '../utils/imageUrl'

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
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
  }, [])

  return (
    <div className="fixed left-0 top-23 z-40 w-full sm:top-26">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-stretch border-y border-mk-border bg-mk-card/98 shadow-[0_4px_18px_rgba(73,54,49,0.08)] backdrop-blur-xl sm:h-23">
        {/* FOR YOU */}
        <div className="shrink-0 border-r border-mk-border bg-mk-bg">
          {loading ? (
            <div className="flex h-full w-18 flex-col items-center justify-center gap-1 px-2 sm:w-28 sm:gap-1.5 sm:px-5">
              <div className="h-8 w-8 animate-pulse rounded-xl bg-mk-border sm:h-9 sm:w-9" />
              <div className="h-2 w-10 animate-pulse rounded bg-mk-border sm:h-2.5 sm:w-12" />
            </div>
          ) : (
            <NavLink
              to="/"
              onClick={() => setActiveCategory(null)}
              className={`group relative flex h-full w-18 flex-col items-center justify-center gap-1 px-2 transition-colors duration-200 sm:w-28 sm:gap-1.5 sm:px-5 ${
                activeCategory === null ? 'text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-primary-soft hover:text-mk-primary-hover'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
                  activeCategory === null ? 'bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_5px_12px_rgba(125,23,28,0.22)]' : 'bg-mk-surface text-mk-muted group-hover:bg-mk-primary-soft group-hover:text-mk-primary-hover'
                }`}
              >
                <Zap size={16} strokeWidth={2.2} fill="currentColor" />
              </div>

              <span className={`whitespace-nowrap text-[9px] sm:text-xs ${activeCategory === null ? 'font-bold' : 'font-semibold'}`}>For You</span>

              {activeCategory === null && <span className="absolute bottom-0 left-2 right-2 h-0.75 rounded-t-full bg-linear-to-r from-mk-primary-deep to-mk-primary sm:left-3 sm:right-3" />}
            </NavLink>
          )}
        </div>

        {/* CATEGORIES */}
        <div className="min-w-0 flex-1">
          <div className="no-scrollbar flex h-full w-full items-stretch overflow-x-auto scroll-smooth">
            {loading ? (
              <div className="flex h-full min-w-max items-stretch">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex min-w-18 shrink-0 animate-pulse flex-col items-center justify-center gap-1 px-2 sm:min-w-24 sm:gap-1.5 sm:px-4">
                    <div className="h-8 w-8 rounded-xl bg-mk-border sm:h-9 sm:w-9" />

                    <div className={`h-2 rounded bg-mk-disabled-bg ${index % 3 === 0 ? 'w-10' : index % 3 === 1 ? 'w-14' : 'w-12'}`} />
                  </div>
                ))}
              </div>
            ) : (
              categories?.data?.map((category) => {
                const active = activeCategory === category._id

                const isDisabled = category.status === 'Inactive'

                const categoryContent = (
                  <>
                    {/* CATEGORY IMAGE */}
                    <div
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9 ${
                        isDisabled
                          ? 'bg-mk-disabled-bg text-mk-subtle'
                          : active
                            ? 'bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_5px_12px_rgba(125,23,28,0.22)]'
                            : 'bg-mk-primary-soft text-mk-muted group-hover:bg-mk-primary-soft group-hover:text-mk-primary-hover'
                      }`}
                    >
                      {category.categoryImage ? (
                        <img src={getImageUrl(category.categoryImage)} alt={category.categoryName} className={`h-full w-full overflow-hidden rounded-md object-contain ${isDisabled ? 'grayscale opacity-40' : ''}`} />
                      ) : (
                        <Image size={16} strokeWidth={2} />
                      )}
                    </div>

                    {/* CATEGORY NAME */}
                    <span className={`max-w-18 truncate whitespace-nowrap text-[9px] sm:max-w-23 sm:text-xs ${isDisabled ? 'font-semibold text-mk-disabled' : active ? 'font-bold text-mk-primary-hover' : 'font-semibold'}`}>{category.categoryName}</span>

                    {/* ACTIVE INDICATOR */}
                    {active && !isDisabled && <span className="absolute bottom-0 left-2 right-2 h-0.75 rounded-t-full bg-linear-to-r from-mk-primary-deep to-mk-primary sm:left-3 sm:right-3" />}
                  </>
                )

                return (
                  <Link
                    key={category._id}
                    to={`/category/${category._id}/products`}
                    onClick={() => setActiveCategory(category._id)}
                    className={`group relative flex min-w-18 shrink-0 flex-col items-center justify-center gap-1 px-2 transition-colors duration-200 sm:min-w-24 sm:gap-1.5 sm:px-4 ${
                      active ? 'bg-mk-primary-soft text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-primary-soft hover:text-mk-primary-hover'
                    }`}
                  >
                    {categoryContent}
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* VIEW ALL */}
        <div className="shrink-0 border-l border-mk-border bg-mk-bg">
          {loading ? (
            <div className="flex h-full w-18 flex-col items-center justify-center gap-1 px-2 sm:w-28 sm:gap-1.5 sm:px-5">
              <div className="h-8 w-8 animate-pulse rounded-xl bg-mk-border sm:h-9 sm:w-9" />

              <div className="h-2 w-12 animate-pulse rounded bg-mk-border sm:h-2.5 sm:w-14" />
            </div>
          ) : (
            <Link
              to="/category"
              onClick={() => setActiveCategory(null)}
              className="group relative flex h-full w-18 flex-col items-center justify-center gap-1 px-2 text-mk-muted transition-colors duration-200 hover:bg-mk-primary-soft hover:text-mk-primary-hover sm:w-28 sm:gap-1.5 sm:px-5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-mk-surface text-mk-muted transition-all duration-200 group-hover:bg-mk-primary-soft group-hover:text-mk-primary-hover sm:h-9 sm:w-9">
                <ArrowRight size={16} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>

              <span className="whitespace-nowrap text-[9px] font-semibold sm:text-xs">View All</span>

              <span className="absolute bottom-0 left-2 right-2 h-0.75 origin-center scale-x-0 rounded-t-full bg-linear-to-r from-mk-primary-deep to-mk-primary transition-transform duration-200 group-hover:scale-x-100 sm:left-3 sm:right-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

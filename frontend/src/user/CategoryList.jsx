import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link, NavLink } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { iconMap } from '../data/iconMap'

export default function CategoryList() {
  const [categories, setCategories] = useState([])

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

  return (
    <div className="flex items-center  border-t border-[#E2E8F0] bg-[#F8FAFC] ">
      {/* For You */}
      <NavLink
        to="/"
        onClick={() => setActiveCategory(null)}
        className={`group relative flex min-w-18 flex-col items-center gap-1 px-2 py-4 text-sm transition ${activeCategory === null ? 'font-semibold text-[#1D4ED8]' : 'text-[#64748B] hover:text-[#1D4ED8]'}`}
      >
        <Zap size={27} strokeWidth={1.8} className={`transition ${activeCategory === null ? 'text-[#1D4ED8]' : 'text-[#64748B] group-hover:text-[#1D4ED8]'}`} />

        <span className="whitespace-nowrap">For You</span>

        {activeCategory === null && <span className="absolute bottom-0 left-2 right-2 h-1 rounded-t-full bg-[#1D4ED8]" />}
      </NavLink>

      {/* map category */}
      {categories?.data?.map((category) => {
        const Icon = iconMap[category.categoryLucideIcons]
        const active = activeCategory === category._id

        return (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            onClick={() => setActiveCategory(category._id)}
            className={`group relative flex min-w-18 flex-col items-center gap-1 px-2 py-4 text-sm transition ${active ? 'font-semibold text-[#1D4ED8]' : 'text-[#64748B] hover:text-[#1D4ED8]'}`}
          >
            {Icon && <Icon size={27} strokeWidth={1.8} className={`transition ${active ? 'text-[#1D4ED8]' : 'text-[#64748B] group-hover:text-[#1D4ED8]'}`} />}

            <span className="whitespace-nowrap">{category.categoryName}</span>

            {active && <span className="absolute bottom-0 left-2 right-2 h-1 rounded-t-full bg-[#1D4ED8]" />}
          </Link>
        )
      })}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../config/axiosConfig'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, Store } from 'lucide-react'
import BreadCrumb from './BreadCrumb'

export default function Brands() {
  const [brand, setBrand] = useState([])

  // category theme mate
  const [activeCategory, setActiveCategory] = useState(null)

  const getBrand = async () => {
    try {
      const res = await axiosInstance.get('/brand')
      setBrand(res.data)
      //   console.log(res.data.data);
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    } finally {
    }
  }

  useEffect(() => {
    getBrand()
  }, [])

  //   console.log('brand', brand?.data)

  const items = [{ title: 'Brand', link: '/brand' }]

  return (
    <div className="min-h-screen ">
      <BreadCrumb items={items} />
      {/* Heading */}
      <div className="mb-5 mt-5 rounded-md bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Brand Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#1D4ED8] shadow-sm sm:h-15 sm:w-15">
              <Store size={32} strokeWidth={1.8} />
            </div>

            {/* Heading */}
            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-[#1D4ED8]" />

                <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">All Brands</h1>
              </div>

              <p className="mt-1 ml-3 text-sm text-[#64748B] sm:text-base">Explore products from popular brands</p>
            </div>
          </div>

          {/* Brand Count */}
          <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#2563EB]">
            <Sparkles size={16} />
            <span>{brand?.data?.length || 0} Brands</span>
          </div>
        </div>
      </div>


      {/* All Brands */}
      <div className=" ">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {brand?.data
            ?.filter((value) => value.status === 'Active')
            .map((value) => {
              return (
                <Link
                  to={`/brand/${value._id}/products`}
                  key={value._id}
                  className="group overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-lg flex flex-col justify-between"
                >
                  {/* Brand Image */}
                  <div className="h-32 w-full overflow-hidden bg-white">
                    <img src={`http://localhost:3000${value.brandLogo}`} alt={value.brandName} className="h-full w-full object-fill transition-transform duration-300 group-hover:scale-105" />
                  </div>

                  {/* Brand Details */}
                  <div className="border-t bg-[#F8FAFC] border-[#E2E8F0] px-4 py-4 h-30">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-bold text-[#172033]">{value.brandName}</h3>

                      <ChevronRight size={16} className="shrink-0 text-[#1D4ED8] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#64748B]">{value.description}</p>

                    <div className="mt-3 text-xs font-semibold text-[#1D4ED8]">View Products →</div>
                  </div>
                </Link>
              )
            })}
        </div>
      </div>
    </div>
  )
}

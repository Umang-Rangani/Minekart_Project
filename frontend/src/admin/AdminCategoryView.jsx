import React, { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, LayoutGrid } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { iconList } from '../data/iconMap'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminCategoryView() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  // GET CATEGORY
  const getCategory = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/category/${id}`)

      setCategory(res.data.data)
    } catch (error) {
      console.error('Get category error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCategory()
  }, [id])

  // CATEGORY ICON
  const getCategoryIcon = (iconValue) => {
    const foundIcon = iconList.find((item) => item.value === iconValue)

    return foundIcon?.icon || LayoutGrid
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm font-medium text-[#6F6A64]">Loading category...</p>
      </div>
    )
  }

  // NOT FOUND
  if (!category) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <p className="text-sm font-semibold text-[#292725]">Category not found</p>

        <button type="button" onClick={() => navigate('/admin/category')} className="mt-4 rounded-xl bg-[#6B6258] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F3A35]">
          Back to Categories
        </button>
      </div>
    )
  }

  const CategoryIcon = getCategoryIcon(category.categoryLucideIcons)

  const items = [
    {
      title: 'Categories',
      link: '/admin/category',
    },
    {
      title: `${category.categoryName}`,
      link: null,
    },
  ]

  return (
    <div className="space-y-6">
      <AdminBreadCrumb items={items} />

      {/* CATEGORY MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="p-5">
          {/* CATEGORY OVERVIEW */}
          <div className="border-b border-[#E3DED6] pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="flex size-18 shrink-0 items-center justify-center rounded-2xl bg-[#F1EEE8] text-[#6B6258]">
                  <CategoryIcon size={36} />
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#99938B]">Category</p>

                  <h2 className="mt-1 text-2xl font-bold text-[#292725]">{category.categoryName}</h2>

                  <p className="mt-1 text-sm text-[#6F6A64]">{category.categoryLucideIcons || 'Default Icon'}</p>
                </div>
              </div>

              {/* STATUS */}
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${category.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                <span className={`size-1.5 rounded-full ${category.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                {category.status}
              </span>
            </div>
          </div>

          {/* CATEGORY INFORMATION */}
          <div className="py-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category Name */}
              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Category Name</p>

                <p className="mt-1 text-sm font-bold text-[#292725]">{category.categoryName || '-'}</p>
              </div>

              {/* Icon */}
              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Category Icon</p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white text-[#6B6258]">
                    <CategoryIcon size={17} />
                  </div>

                  <p className="text-sm font-bold text-[#292725]">{category.categoryLucideIcons || '-'}</p>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Status</p>

                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                    <span className={`size-1.5 rounded-full ${category.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                    {category.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="border-t border-[#E3DED6] pt-5">
            <p className="text-[11px] text-[#99938B]">Description</p>

            <div className="mt-2 rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-4">
              <p className="text-sm leading-7 text-[#6F6A64]">{category.description || 'No description available.'}</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

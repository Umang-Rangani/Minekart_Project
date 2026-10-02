import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
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

  const items = [
    {
      title: 'Categories',
      link: '/admin/category',
    },
    {
      title: category.categoryName,
      link: null,
    },
  ]

  return (
    <div className="space-y-6">
      <AdminBreadCrumb items={items} />

      {/* CATEGORY MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-[360px_1fr]">
          {/* CATEGORY IMAGE */}
          <div>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#F8F6F2]">
              {category.categoryImage ? (
                <img src={getImageUrl(category.categoryImage)} alt={category.categoryName} className="h-full w-full object-contain p-8" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="mx-auto text-[#99938B]" />

                  <p className="mt-2 text-sm text-[#99938B]">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* BASIC CATEGORY INFO */}
          <div>
            {/* CATEGORY NAME */}
            <div className="border-b border-[#E3DED6] pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#99938B]">Category</p>

                  <h2 className="mt-1 text-2xl font-bold text-[#292725]">{category.categoryName}</h2>
                </div>

                {/* STATUS */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${category.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                  <span className={`size-1.5 rounded-full ${category.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                  {category.status}
                </span>
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-2">
              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Category Name</p>

                <p className="mt-1 text-sm font-bold text-[#292725]">{category.categoryName || '-'}</p>
              </div>

              <div className="rounded-xl bg-[#F1EEE8] p-4">
                <p className="text-[11px] text-[#99938B]">Status</p>

                <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                  <span className={`size-1.5 rounded-full ${category.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                  {category.status}
                </span>
              </div>
            </div>

            {/* CATEGORY IMAGE */}
            <div className="border-t border-[#E3DED6] pt-5">
              <p className="text-[11px] text-[#99938B]">Category Image</p>

              <p className="mt-1 break-all text-sm font-semibold text-[#292725]">{category.categoryImage || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
        <div className="border-b border-[#E3DED6] pb-4">
          <h3 className="text-base font-bold text-[#292725]">Category Description</h3>
        </div>

        <p className="pt-4 text-sm leading-7 text-[#6F6A64]">{category.description || 'No description available.'}</p>
      </div>
    </div>
  )
}

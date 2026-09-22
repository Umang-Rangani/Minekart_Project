import React, { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Layers, FolderTree } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminSubCategoryView() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [subCategory, setSubCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get SubCategory
  const getSubCategory = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/subcategory/${id}`)

      setSubCategory(res.data.data)
    } catch (error) {
      console.error('Get subcategory error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubCategory()
  }, [id])

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm font-medium text-[#6F6A64]">Loading subcategory...</p>
      </div>
    )
  }

  // Not Found
  if (!subCategory) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EEEAE4] text-[#99938B]">
          <Layers size={28} />
        </div>

        <p className="mt-4 text-sm font-semibold text-[#292725]">SubCategory not found</p>

        <button type="button" onClick={() => navigate('/admin/subcategory')} className="mt-4 rounded-xl bg-[#6B6258] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F3A35]">
          Back to SubCategories
        </button>
      </div>
    )
  }

  // Breadcrumb
  const items = [
    {
      title: 'SubCategories',
      link: '/admin/subcategory',
    },
    {
      title: subCategory.subCategoryName,
      link: null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadCrumb items={items} />

      {/*  SUBCATEGORY DETAILS  */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* TOP HEADER */}
        <div className="border-b border-[#E3DED6] px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#99938B]">SubCategory Details</p>

              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#292725]">{subCategory.subCategoryName}</h2>
            </div>

            <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold ${subCategory.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
              <span className={`size-1.5 rounded-full ${subCategory.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

              {subCategory.status}
            </span>
          </div>
        </div>

        {/* INFORMATION */}
        <div className="divide-y divide-[#E3DED6]">
          {/* PARENT CATEGORY */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Parent Category</p>
              </div>

              <div>
                <p className="text-base font-semibold text-[#292725]">{subCategory.category?.categoryName || '-'}</p>

                <p className="mt-1 text-xs text-[#99938B]">Main category associated with this subcategory</p>
              </div>
            </div>
          </div>

          {/* SUBCATEGORY NAME */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">SubCategory Name</p>
              </div>

              <div>
                <p className="text-base font-semibold text-[#292725]">{subCategory.subCategoryName}</p>

                <p className="mt-1 text-xs text-[#99938B]">Name used for this subcategory</p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</p>
              </div>

              <div>
                <span className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold ${subCategory.status === 'Active' ? 'bg-[#F1EEE8] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>{subCategory.status || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  DESCRIPTION  */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="border-b border-[#E3DED6] px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Description</p>
        </div>

        <div className="px-6 py-6">
          <p className="max-w-4xl text-sm leading-7 text-[#6F6A64]">{subCategory.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  )
}

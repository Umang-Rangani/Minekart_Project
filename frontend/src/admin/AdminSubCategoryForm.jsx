import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'

const resetSubCategoryData = {
  subCategoryName: '',
  category: '',
  description: '',
  status: 'Active',
}

export default function AdminSubCategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [subCategoryData, setSubCategoryData] = useState(resetSubCategoryData)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Get Categories
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('/category')
      setCategories(res.data.data || [])
    } catch (error) {
      console.error('Get categories error:', error.response?.data || error.message)
    }
  }

  // Get SubCategory
  const getSubCategory = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/subcategory/${id}`)
      const data = res.data.data

      setSubCategoryData({
        subCategoryName: data?.subCategoryName || '',
        category: data?.category?._id || data?.category || '',
        description: data?.description || '',
        status: data?.status || 'Active',
      })
    } catch (error) {
      console.error('Get subcategory error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Page Load
  useEffect(() => {
    getCategories()

    if (isEdit) {
      getSubCategory()
    }
  }, [id, isEdit])

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target

    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Submit
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const payload = {
        subCategoryName: subCategoryData.subCategoryName.trim(),
        category: subCategoryData.category,
        description: subCategoryData.description.trim(),
        status: subCategoryData.status,
      }

      if (!payload.subCategoryName) {
        return
      }

      if (!payload.category) {
        return
      }

      if (isEdit) {
        await axiosInstance.put(`/subcategory/${id}`, payload)
      } else {
        await axiosInstance.post('/subcategory', payload)
      }

      navigate('/admin/subcategory')
    } catch (error) {
      console.error('SubCategory submit error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Cancel
  const cancelHandle = () => {
    navigate('/admin/subcategory')
  }

  // Breadcrumb
  const selectedCategory = categories.find((category) => category._id === subCategoryData.category)

  const items = isEdit
    ? [
        {
          title: 'SubCategories',
          link: '/admin/subcategory',
        },
        {
          title: subCategoryData.subCategoryName || 'SubCategory',
          link: null,
        },
        {
          title: 'Update',
          link: null,
        },
      ]
    : [
        {
          title: 'SubCategories',
          link: '/admin/subcategory',
        },
        {
          title: 'New',
          link: null,
        },
      ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadCrumb items={items} />

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* Header */}
        <div className="border-b border-[#E3DED6] bg-[#FBFAF7] px-5 py-4">
          <h2 className="text-base font-bold text-[#292725]">{isEdit ? 'Update SubCategory' : 'Create SubCategory'}</h2>

          <p className="mt-0.5 text-xs text-[#99938B]">{isEdit ? 'Update subcategory information' : 'Add a new store subcategory'}</p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandle} className="p-5">
          {/* BASIC INFORMATION */}
          <div>
            <div className="border-b border-[#E3DED6] pb-3">
              <h3 className="text-sm font-bold text-[#292725]">Basic Information</h3>

              <p className="mt-0.5 text-xs text-[#99938B]">Enter subcategory details</p>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-2">
              {/* SubCategory Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">SubCategory Name</label>

                <input
                  type="text"
                  name="subCategoryName"
                  value={subCategoryData.subCategoryName}
                  onChange={handleChange}
                  placeholder="e.g. Shirts"
                  required
                  className="h-12 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Category</label>

                <select
                  name="category"
                  value={subCategoryData.category}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <div className="border-b border-[#E3DED6] pb-3">
              <h3 className="text-sm font-bold text-[#292725]">Description</h3>

              <p className="mt-0.5 text-xs text-[#99938B]">Add a short description for this subcategory</p>
            </div>

            <div className="pt-5">
              <textarea
                name="description"
                value={subCategoryData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Enter subcategory description..."
                className="w-full resize-none rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
              />
            </div>
          </div>

          {/* STORE & DISPLAY */}
          <div className="mt-6">
            <div className="border-b border-[#E3DED6] pb-3">
              <h3 className="text-sm font-bold text-[#292725]">Store & Display</h3>

              <p className="mt-0.5 text-xs text-[#99938B]">Manage subcategory visibility</p>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-5 lg:grid-cols-2">
              {/* Selected Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Selected Category</label>

                <div className="flex h-12 items-center rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4">
                  <span className="text-sm font-medium text-[#6F6A64]">{selectedCategory?.categoryName || 'No category selected'}</span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Status</label>

                <select
                  name="status"
                  value={subCategoryData.status}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
            <button type="button" onClick={cancelHandle} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Update SubCategory' : 'Create SubCategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

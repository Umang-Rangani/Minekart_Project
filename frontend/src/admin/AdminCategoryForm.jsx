import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { iconList } from '../data/iconMap'
import AdminBreadCrumb from './AdminBreadCrumb'

const resetCategoryData = {
  categoryName: '',
  categoryLucideIcons: '',
  description: '',
  status: 'Active',
}

export default function AdminCategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)

  const [categoryData, setCategoryData] = useState(resetCategoryData)

  // ! GET CATEGORY FOR EDIT
  const getCategory = async () => {
    try {
      setPageLoading(true)

      const res = await axiosInstance.get(`/category/${id}`)

      const category = res.data.data

      setCategoryData({
        categoryName: category.categoryName || '',
        categoryLucideIcons: category.categoryLucideIcons || '',
        description: category.description || '',
        status: category.status || 'Active',
      })
    } catch (error) {
      console.error('Get category error:', error.response?.data || error.message)
    } finally {
      setPageLoading(false)
    }
  }

  // ! INITIAL DATA
  useEffect(() => {
    if (isEdit) {
      getCategory()
    } else {
      setCategoryData(resetCategoryData)
      setPageLoading(false)
    }
  }, [id])

  // ! INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target

    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ! SUBMIT
  const submitHandle = async (e) => {
    e.preventDefault()

    if (!categoryData.categoryName.trim()) {
      return
    }

    try {
      setLoading(true)

      const payload = {
        categoryName: categoryData.categoryName.trim(),
        categoryLucideIcons: categoryData.categoryLucideIcons,
        description: categoryData.description.trim(),
        status: categoryData.status,
      }

      // UPDATE
      if (isEdit) {
        await axiosInstance.put(`/category/${id}`, payload)
      }

      // CREATE
      else {
        await axiosInstance.post('/category', payload)
      }

      // Back to category list
      navigate('/admin/category')
    } catch (error) {
      console.error('Submit category error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ! CANCEL
  const closeForm = () => {
    navigate('/admin/category')
  }

  // ! LOADING
  if (pageLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm font-medium text-[#6F6A64]">Loading category...</div>
      </div>
    )
  }

  // ! BREADCRUMB
  let items

  if (isEdit) {
    items = [
      {
        title: 'Categories',
        link: '/admin/category',
      },
      {
        title: categoryData.categoryName || 'Category',
        link: `/admin/category/${id}`,
      },
      {
        title: 'Update',
        link: null,
      },
    ]
  } else {
    items = [
      {
        title: 'Categories',
        link: '/admin/category',
      },
      {
        title: 'New',
        link: null,
      },
    ]
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <AdminBreadCrumb items={items} />

      {/* FORM */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
        <form onSubmit={submitHandle} className="p-5">
          <div className="space-y-8">
            {/* BASIC INFORMATION */}
            <section>
              <div className="mb-5">
                <h3 className="text-base font-semibold text-[#292725]">Basic Information *</h3>

                <p className="mt-1 text-xs text-[#99938B]">Add basic details about your category.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* CATEGORY NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Category Name</label>

                  <input
                    type="text"
                    name="categoryName"
                    value={categoryData.categoryName}
                    onChange={handleChange}
                    placeholder="e.g. Mobiles"
                    required
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* CATEGORY ICON */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Category Icon</label>

                  <select
                    name="categoryLucideIcons"
                    value={categoryData.categoryLucideIcons}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="">Select Icon</option>

                    {iconList.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DESCRIPTION */}
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Description</label>

                  <textarea
                    name="description"
                    value={categoryData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Enter category description..."
                    className="w-full resize-none rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>
              </div>
            </section>

            {/* STORE */}
            <section>
              <div className="mb-5 border-t border-[#E3DED6] pt-7">
                <h3 className="text-base font-semibold text-[#292725]">Store & Display *</h3>

                <p className="mt-1 text-xs text-[#99938B]">Control category visibility.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* STATUS */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Status</label>

                  <select
                    name="status"
                    value={categoryData.status}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
            <button type="button" onClick={closeForm} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

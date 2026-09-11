import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, LayoutGrid } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { iconList } from '../data/iconMap'

export default function AdminCategory() {
  const [categories, setCategories] = useState([])

  const [categoryData, setCategoryData] = useState({
    categoryName: '',
    categoryLucideIcons: '',
    description: '',
    status: 'Active',
  })

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)

  // ! GET
  const getCategories = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/category')
      setCategories(res.data.data)
    } catch (error) {
      console.log('Get Categories Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])

  // ! INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target

    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ! OPEN CREATE
  const openCreateForm = () => {
    setEditId(null)

    setCategoryData({
      categoryName: '',
      categoryLucideIcons: '',
      description: '',
      status: 'Active',
    })

    setShowForm(true)
  }

  // ! OPEN EDIT
  const editHandle = (category) => {
    setEditId(category._id)

    setCategoryData({
      categoryName: category.categoryName || '',
      categoryLucideIcons: category.categoryLucideIcons || '',
      description: category.description || '',
      status: category.status || 'Active',
    })

    setShowForm(true)
  }

  // ! CLOSE FORM
  const closeForm = () => {
    setShowForm(false)
    setEditId(null)

    setCategoryData({
      categoryName: '',
      categoryLucideIcons: '',
      description: '',
      status: 'Active',
    })
  }

  // ! POST / PUT
  const submitHandle = async (e) => {
    e.preventDefault()

    if (!categoryData.categoryName.trim()) {
      alert('Category name is required')
      return
    }

    try {
      setLoading(true)

      if (editId) {
        // ! PUT
        await axiosInstance.put(`/category/${editId}`, categoryData)
      } else {
        // ! POST
        await axiosInstance.post('/category', categoryData)
      }

      await getCategories()
      closeForm()
    } catch (error) {
      console.log('Category Save Error:', error.response?.data || error.message)

      alert(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ! DELETE
  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?')

    if (!confirmDelete) return

    try {
      setDeleteLoading(id)

      await axiosInstance.delete(`/category/${id}`)

      setCategories((prev) => prev.filter((item) => item._id !== id))
    } catch (error) {
      console.log('Delete Category Error:', error.response?.data || error.message)

      alert(error.response?.data?.message || 'Category delete failed')
    } finally {
      setDeleteLoading(null)
    }
  }

  // ! ICON
  const getCategoryIcon = (iconValue) => {
    const foundIcon = iconList.find((item) => item.value === iconValue)

    return foundIcon?.icon || LayoutGrid
  }

  // ! SEARCH
  const filteredCategories = categories?.filter((item) => item.categoryName?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-[calc(100vh-70px)]">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#6B6258]">
              <LayoutGrid size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#292725]">Categories</h1>

              <p className="mt-0.5 text-sm text-[#99938B]">Manage your product categories</p>
            </div>
          </div>
        </div>

        {/* Add Category */}
        <button type="button" onClick={openCreateForm} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3F3A35]">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#FFFFFF] shadow-sm">
          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-[#E3DED6] bg-[#F7F7F5] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#292725]">{editId ? 'Edit Category' : 'Create Category'}</h2>

              <p className="mt-0.5 text-xs text-[#99938B]">{editId ? 'Update category information' : 'Add a new product category'}</p>
            </div>

            <button type="button" onClick={closeForm} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              <X size={19} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submitHandle} className="p-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Icon */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Category Icon</label>

                <select
                  name="categoryLucideIcons"
                  value={categoryData.categoryLucideIcons}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                >
                  <option value="">Select Icon</option>

                  {iconList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Category Name</label>

                <input
                  type="text"
                  name="categoryName"
                  value={categoryData.categoryName}
                  onChange={handleChange}
                  placeholder="e.g. Mobiles"
                  className="h-11 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Description</label>

                <textarea
                  name="description"
                  value={categoryData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Enter category description..."
                  className="w-full resize-none rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#292725]">Status</label>

                <select
                  name="status"
                  value={categoryData.status}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
              <button type="button" onClick={closeForm} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
                Cancel
              </button>

              <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Saving...' : editId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#FFFFFF] shadow-sm">
        {/* Table Top */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#292725]">All Categories</h2>

            <p className="mt-0.5 text-xs text-[#99938B]">{filteredCategories.length} categories</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-70">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F7F7F5] pl-10 pr-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-187">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F7F7F5]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Icon</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Category</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Description</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Status</th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#99938B]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#99938B]">
                        <LayoutGrid size={22} />
                      </div>

                      <p className="text-sm font-medium text-[#6F6A64]">No categories found</p>

                      <p className="mt-1 text-xs text-[#99938B]">Create your first category</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  const Icon = getCategoryIcon(category.categoryLucideIcons)

                  return (
                    <tr key={category._id} className="border-b border-[#E3DED6] transition last:border-b-0 hover:bg-[#F7F7F5]">
                      {/* Icon */}
                      <td className="px-5 py-4">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#6B6258]">
                          <Icon size={20} />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#292725]">{category.categoryName}</p>
                      </td>

                      {/* Description */}
                      <td className="max-w-75 px-5 py-4">
                        <p className="truncate text-sm text-[#6F6A64]">{category.description || 'No description'}</p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${category.status === 'Active' ? 'bg-[#E8F0E8] text-[#4F684F]' : 'bg-[#F3E8E6] text-[#8A554E]'}`}>{category.status}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Edit */}
                          <button type="button" onClick={() => editHandle(category)} className="flex size-9 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6B6258] transition hover:bg-[#EEEAE4]" title="Edit">
                            <Pencil size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteHandle(category._id)}
                            disabled={deleteLoading === category._id}
                            className="flex size-9 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#9A5A53] transition hover:bg-[#F3E8E6] disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

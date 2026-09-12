import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Layers } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function AdminSubCategory() {
  // ! SubCategories
  const [subCategories, setSubCategories] = useState([])

  // ! Categories
  const [categories, setCategories] = useState([])

  // ! Form Data
  const [subCategoryData, setSubCategoryData] = useState({
    subCategoryName: '',
    category: '',
    description: '',
    status: 'Active',
  })

  // ! Search
  const [search, setSearch] = useState('')

  // ! Error & Success
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ! Form
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  // ! Loading
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)

  // =========================================================
  // ! Get SubCategories
  // =========================================================

  const getSubCategories = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/subcategory')

      setSubCategories(res.data.data || [])
    } catch (error) {
      console.log('Get subcategories error:', error.response?.data || error.message)

      setError(error.response?.data?.message || 'Failed to load subcategories')
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // ! Get Categories
  // =========================================================

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('/category')

      setCategories(res.data.data || [])
    } catch (error) {
      console.log('Get categories error:', error.response?.data || error.message)
    }
  }

  // =========================================================
  // ! Page Load
  // =========================================================

  useEffect(() => {
    getSubCategories()
    getCategories()
  }, [])

  // =========================================================
  // ! Handle Change
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =========================================================
  // ! Reset Form
  // =========================================================

  const resetForm = () => {
    setSubCategoryData({
      subCategoryName: '',
      category: '',
      description: '',
      status: 'Active',
    })

    setError('')
    setSuccess('')
    setEditId(null)
  }

  // =========================================================
  // ! Open Create Form
  // =========================================================

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  // =========================================================
  // ! Close Form
  // =========================================================

  const closeForm = () => {
    setShowForm(false)
    resetForm()
  }

  // =========================================================
  // ! Edit SubCategory
  // =========================================================

  const editHandle = (subCategory) => {
    setSubCategoryData({
      subCategoryName: subCategory.subCategoryName || '',

      category: subCategory.category?._id || subCategory.category || '',

      description: subCategory.description || '',

      status: subCategory.status || 'Active',
    })

    setError('')
    setSuccess('')

    setEditId(subCategory._id)
    setShowForm(true)
  }

  // =========================================================
  // ! Submit
  // =========================================================

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      // ! Validation
      if (!subCategoryData.subCategoryName.trim()) {
        setError('SubCategory name is required')
        return
      }

      if (!subCategoryData.category) {
        setError('Please select a category')
        return
      }

      // ! Edit
      if (editId) {
        await axiosInstance.put(`/subcategory/${editId}`, subCategoryData)

        setSuccess('SubCategory updated successfully')
      } else {
        // ! Create
        await axiosInstance.post('/subcategory', subCategoryData)

        setSuccess('SubCategory created successfully')
      }

      await getSubCategories()

      closeForm()
    } catch (error) {
      console.log('SubCategory submit error:', error.response?.data || error.message)

      setError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // ! Delete
  // =========================================================

  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this subcategory?')

    if (!confirmDelete) return

    try {
      setDeleteLoading(id)

      await axiosInstance.delete(`/subcategory/${id}`)

      setSubCategories((prev) => prev.filter((item) => item._id !== id))

      setSuccess('SubCategory deleted successfully')
    } catch (error) {
      console.log('Delete subcategory error:', error.response?.data || error.message)

      setError(error.response?.data?.message || 'Failed to delete subcategory')
    } finally {
      setDeleteLoading(null)
    }
  }

  // =========================================================
  // ! Search
  // =========================================================

  const filteredSubCategories = subCategories.filter((item) => {
    const searchText = search.toLowerCase()

    const subCategoryName = item.subCategoryName?.toLowerCase() || ''

    const categoryName = item.category?.categoryName?.toLowerCase() || ''

    return subCategoryName.includes(searchText) || categoryName.includes(searchText)
  })

  return (
    <div className="min-h-[calc(100vh-70px)]">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#6B6258]">
              <Layers size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#292725]">SubCategories</h1>

              <p className="mt-0.5 text-sm text-[#99938B]">Manage your store subcategories</p>
            </div>
          </div>
        </div>

        {/* Add SubCategory */}

        <button type="button" onClick={openCreateForm} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3F3A35]">
          <Plus size={18} />
          Add SubCategory
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && <div className="mb-4 rounded-xl border border-[#E3DED6] bg-[#F3E8E6] px-4 py-3 text-sm font-medium text-[#8A554E]">{error}</div>}

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && !showForm && <div className="mb-4 rounded-xl border border-[#E3DED6] bg-[#E8F0E8] px-4 py-3 text-sm font-medium text-[#4F684F]">{success}</div>}

      {/* =====================================================
          CREATE / EDIT FORM
      ===================================================== */}

      {showForm && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
          {/* Form Header */}

          <div className="flex items-center justify-between border-b border-[#E3DED6] bg-[#F7F7F5] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#292725]">{editId ? 'Edit SubCategory' : 'Create SubCategory'}</h2>

              <p className="mt-0.5 text-xs text-[#99938B]">{editId ? 'Update subcategory information' : 'Add a new store subcategory'}</p>
            </div>

            <button type="button" onClick={closeForm} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              <X size={19} />
            </button>
          </div>

          {/* Form */}

          <form onSubmit={submitHandle} className="p-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* LEFT */}

              <div className="space-y-5">
                {/* SubCategory Name */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">SubCategory Name</label>

                  <input
                    type="text"
                    name="subCategoryName"
                    value={subCategoryData.subCategoryName}
                    onChange={handleChange}
                    placeholder="e.g. Shirt"
                    required
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
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
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Status</label>

                  <select
                    name="status"
                    value={subCategoryData.status}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* RIGHT */}

              <div>
                {/* Description */}

                <label className="mb-2 block text-sm font-medium text-[#292725]">Description</label>

                <textarea
                  name="description"
                  value={subCategoryData.description}
                  onChange={handleChange}
                  rows={9}
                  placeholder="Enter subcategory description..."
                  className="w-full resize-none rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                />
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-6 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
              <button type="button" onClick={closeForm} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
                Cancel
              </button>

              <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Saving...' : editId ? 'Update SubCategory' : 'Create SubCategory'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
        {/* Table Top */}

        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#292725]">All SubCategories</h2>

            <p className="mt-0.5 text-xs text-[#99938B]">{filteredSubCategories.length} subcategories</p>
          </div>

          {/* Search */}

          <div className="relative w-full sm:w-70">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subcategory..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F7F7F5] pl-10 pr-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-187">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F7F7F5]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">SubCategory</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Category</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Description</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Status</th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#99938B]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}

              {loading && subCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading subcategories...
                  </td>
                </tr>
              ) : filteredSubCategories.length === 0 ? (
                /* Empty */

                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#99938B]">
                        <Layers size={22} />
                      </div>

                      <p className="text-sm font-medium text-[#6F6A64]">No subcategories found</p>

                      <p className="mt-1 text-xs text-[#99938B]">Create your first subcategory</p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* List */

                filteredSubCategories.map((subCategory) => (
                  <tr key={subCategory._id} className="border-b border-[#E3DED6] transition last:border-b-0 hover:bg-[#F7F7F5]">
                    {/* SubCategory */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[#EEEAE4] text-[#6B6258]">
                          <Layers size={18} />
                        </div>

                        <p className="text-sm font-semibold text-[#292725]">{subCategory.subCategoryName}</p>
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-[#F1EEE8] px-3 py-1.5 text-xs font-semibold text-[#6B6258]">{subCategory.category?.categoryName || 'No category'}</span>
                    </td>

                    {/* Description */}

                    <td className="max-w-75 px-5 py-4">
                      <p className="truncate text-sm text-[#6F6A64]">{subCategory.description || 'No description'}</p>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${subCategory.status === 'Active' ? 'bg-[#E8F0E8] text-[#4F684F]' : 'bg-[#F3E8E6] text-[#8A554E]'}`}>{subCategory.status}</span>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}

                        <button type="button" onClick={() => editHandle(subCategory)} className="flex size-9 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6B6258] transition hover:bg-[#EEEAE4]" title="Edit">
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() => deleteHandle(subCategory._id)}
                          disabled={deleteLoading === subCategory._id}
                          className="flex size-9 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#9A5A53] transition hover:bg-[#F3E8E6] disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

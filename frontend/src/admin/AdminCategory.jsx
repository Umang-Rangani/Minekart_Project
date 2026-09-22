import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, LayoutGrid, X, Layers, CheckCircle2, CircleOff, Tags } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { iconList } from '../data/iconMap'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminCategory() {
  const navigate = useNavigate()

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminCategoriesSearch') || ''
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // delete popup
  const [deleteCategoryId, setDeleteCategoryId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // ! Get all categories
  const getCategories = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/category')

      setCategories(res.data.data || [])
    } catch (error) {
      console.error('Get categories error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ! Delete category
  const deleteHandle = async () => {
    if (!deleteCategoryId) return

    try {
      setDeleting(true)

      await axiosInstance.delete(`/category/${deleteCategoryId}`)

      await getCategories()

      setDeleteCategoryId(null)
    } catch (error) {
      console.error('Delete category error:', error.response?.data || error.message)
    } finally {
      setDeleting(false)
    }
  }

  // ! Search
  const filteredCategories = categories.filter((category) => category.categoryName?.toLowerCase().includes(search.toLowerCase()))

  // ! Pagination
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredCategories.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredCategories.length : startIndex + itemsPerPage

  const currentCategories = itemsPerPage === 'all' ? filteredCategories : filteredCategories.slice(startIndex, endIndex)

  // ! Pagination change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  // ! Initial API
  useEffect(() => {
    getCategories()
  }, [])

  // ! Delete scroll lock
  useEffect(() => {
    if (deleteCategoryId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [deleteCategoryId])

  // ! Category statistics
  const totalCategories = categories.length

  const activeCategories = categories.filter((category) => category.status === 'Active').length

  const inactiveCategories = categories.filter((category) => category.status === 'Inactive').length

  const categoriesWithIcon = categories.filter((category) => category.categoryLucideIcons).length

  const stats = [
    {
      title: 'Total Categories',
      value: totalCategories,
      icon: LayoutGrid,
    },
    {
      title: 'Active Categories',
      value: activeCategories,
      icon: CheckCircle2,
    },
    {
      title: 'Inactive Categories',
      value: inactiveCategories,
      icon: CircleOff,
    },
    {
      title: 'Categories With Icon',
      value: categoriesWithIcon,
      icon: Tags,
    },
  ]

  // ! Category icon
  const getCategoryIcon = (iconValue) => {
    const foundIcon = iconList.find((item) => item.value === iconValue)

    return foundIcon?.icon || LayoutGrid
  }

  const items = [{ title: 'Categories', link: null }]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      {/*  STATS  */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-[#E3DED6] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#99938B]">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-[#292725]">{item.value}</h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/*  CATEGORY TABLE  */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                const value = e.target.value

                setSearch(value)
                localStorage.setItem('adminCategoriesSearch', value)

                setCurrentPage(1)
              }}
              placeholder="Search categories..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  localStorage.removeItem('adminCategoriesSearch')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Add Category */}
          <button type="button" onClick={() => navigate('/admin/category/new')} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D554C]">
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Description</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading categories...
                  </td>
                </tr>
              ) : currentCategories.length > 0 ? (
                currentCategories.map((category, index) => {
                  const Icon = getCategoryIcon(category.categoryLucideIcons)

                  return (
                    <tr key={category._id} className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                      {/* Index */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#6F6A64]">{startIndex + index + 1}</span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
                            <Icon size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-55 truncate text-sm font-semibold text-[#292725]">{category.categoryName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4">
                        <p className="max-w-75 truncate text-sm text-[#6F6A64]">{category.description || '-'}</p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                          <span className={`size-1.5 rounded-full ${category.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                          {category.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/category/${category._id}/update`)}
                            className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                            title="Edit Category"
                          >
                            <Pencil size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteCategoryId(category._id)}
                            className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]"
                            title="Delete Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  FOOTER  */}
        <div className="flex flex-col gap-3 border-t border-[#E3DED6] bg-[#FCFBF9] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Showing */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#99938B]">Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                const value = e.target.value

                handleItemsPerPageChange(value === 'all' ? 'all' : Number(value))
              }}
              className="h-8 rounded-lg border border-[#E3DED6] bg-white px-2.5 pr-7 text-xs font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258]"
            >
              <option value={5}>5 Documents</option>
              <option value={10}>10 Documents</option>
              <option value={20}>20 Documents</option>
              <option value="all">All Documents</option>
            </select>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#E3DED6] bg-white px-2 text-xs font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${currentPage === page ? 'bg-[#6B6258] text-white' : 'border border-[#E3DED6] bg-white text-[#6F6A64] hover:bg-[#EEEAE4]'}`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#E3DED6] bg-white px-2 text-xs font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/*  DELETE MODAL  */}
      {deleteCategoryId && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-130 overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Icon */}
            <div className="px-6 pb-5 pt-8 text-center sm:px-8">
              <div className="relative mx-auto flex size-24 items-center justify-center">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-[#FFF1ED]">
                  <Trash2 size={50} strokeWidth={1.8} className="text-[#F15A3A]" />
                </div>
              </div>

              {/* Title */}
              <h2 className="mt-5 text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                Are you sure you want to delete
                <br />
                this category?
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">This action cannot be undone. The category will be permanently deleted.</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-6 pb-7 sm:px-8">
              {/* Cancel */}
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteCategoryId(null)}
                className="h-12 flex-1 rounded-xl border-2 border-[#F15A3A] bg-white px-4 text-sm font-semibold text-[#F15A3A] transition hover:bg-[#FFF1ED] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Delete */}
              <button type="button" disabled={deleting} onClick={deleteHandle} className="h-12 flex-1 rounded-xl bg-[#F15A3A] px-4 text-sm font-semibold text-white transition hover:bg-[#E84F32] disabled:cursor-not-allowed disabled:opacity-60">
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

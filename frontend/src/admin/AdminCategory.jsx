import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, LayoutGrid, X, CheckCircle2, CircleOff, Image, Eye, ArrowUpDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { getImageUrl } from '../utils/imageUrl'
import AdminBreadCrumb from './AdminBreadCrumb'
import AdminTrashBox from './AdminTrashBox'
import toast from 'react-hot-toast'
import { useUser } from '../context/userProvider'
import { ACTIONS, SECTION_KEYS } from '../constants/permission'
import { hasPermission } from '../lib/permission'

export default function AdminCategory() {
  const navigate = useNavigate()
  const { user } = useUser()
  const canCreate = hasPermission(user, SECTION_KEYS.Category, ACTIONS.Category.CREATE)
  const canView = hasPermission(user, SECTION_KEYS.Category, ACTIONS.Category.VIEW)
  const canUpdate = hasPermission(user, SECTION_KEYS.Category, ACTIONS.Category.UPDATE)
  const canDelete = hasPermission(user, SECTION_KEYS.Category, ACTIONS.Category.DELETE)

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminCategoriesSearch') || ''
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // ! switch filter
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem('adminCategoriesSort') || 'newest'
  })

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

  const handleModalOpen = (data) => {
    setDeleteItem(data)
    setDeleteModalOpen(true)
  }

  const deleteHandle = async () => {
    if (!deleteItem) return

    try {
      await axiosInstance.delete(`/category/${deleteItem._id}`)

      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Delete category error:', error.response?.data || error.message)
    } finally {
      setDeleteModalOpen(false)
      await getCategories()
    }
  }

  // ! switch filter & search
  const filteredCategories = categories
    .filter((category) => category.categoryName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredCategories.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredCategories.length : startIndex + itemsPerPage

  const currentCategories = itemsPerPage === 'all' ? filteredCategories : filteredCategories.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  useEffect(() => {
    getCategories()
  }, [])

  const totalCategories = categories.length

  const activeCategories = categories.filter((category) => category.status === 'Active').length

  const inactiveCategories = categories.filter((category) => category.status === 'Inactive').length

  const categoriesWithImage = categories.filter((category) => category.categoryImage).length

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
      title: 'Categories With Image',
      value: categoriesWithImage,
      icon: Image,
    },
  ]

  const items = [{ title: 'Categories', link: null }]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-mk-border-admin bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-mk-subtle">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-mk-ink-admin">{item.value}</h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-mk-surface text-mk-admin">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CATEGORY TABLE */}
      <div className="overflow-hidden rounded-2xl border border-mk-border-admin bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-mk-border-admin p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mk-subtle" />

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
              className="h-10 w-full rounded-xl border border-mk-border-admin bg-mk-bg-admin pl-10 pr-10 text-sm text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  localStorage.removeItem('adminCategoriesSearch')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-mk-subtle transition hover:bg-mk-surface hover:text-mk-ink-admin"
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            {/* Sort */}
            <div className="relative">
              <ArrowUpDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mk-admin" />

              <select
                value={sortOrder}
                onChange={(e) => {
                  const value = e.target.value

                  setSortOrder(value)
                  localStorage.setItem('adminCategoriesSort', value)
                  setCurrentPage(1)
                }}
                className="h-10 w-full appearance-none rounded-xl border border-mk-border-admin bg-mk-bg-admin pl-9 pr-8 text-sm font-semibold text-mk-muted-admin outline-none transition focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin sm:w-44"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {canCreate && (
              <button type="button" onClick={() => navigate('/admin/category/new')} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-mk-admin px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-mk-admin-hover">
                <Plus size={18} />
                Add Category
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-mk-border-admin bg-mk-bg-admin">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Description</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-mk-subtle">
                    Loading categories...
                  </td>
                </tr>
              ) : currentCategories.length > 0 ? (
                currentCategories.map((category, index) => {
                  return (
                    <tr key={category._id} className="border-b border-mk-border-admin transition hover:bg-mk-bg-admin">
                      {/* Index */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-mk-muted-admin">{startIndex + index + 1}</span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-mk-surface">
                            {category.categoryImage ? <img src={getImageUrl(category.categoryImage)} alt={category.categoryName} className="h-full w-full object-contain p-1.5" /> : <Image size={19} className="text-mk-admin" />}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-55 truncate text-sm font-semibold text-mk-ink-admin">{category.categoryName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4">
                        <p className="max-w-75 truncate text-sm text-mk-muted-admin">{category.description || '-'}</p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${category.status === 'Active' ? 'bg-mk-surface text-mk-admin-hover' : 'bg-mk-danger-soft text-mk-danger'}`}>
                          <span className={`size-1.5 rounded-full ${category.status === 'Active' ? 'bg-mk-admin' : 'bg-mk-danger'}`} />

                          {category.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {canView && (
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/category/${category._id}`)}
                              className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-surface hover:text-mk-ink-admin"
                              title="View Category"
                            >
                              <Eye size={16} />
                            </button>
                          )}

                          {canUpdate && (
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/category/${category._id}/update`)}
                              className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-surface hover:text-mk-ink-admin"
                              title="Edit Category"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {canDelete && (
                            <button type="button" onClick={() => handleModalOpen(category)} className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-danger-soft hover:text-mk-danger" title="Delete Category">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-mk-subtle">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col gap-3 border-t border-mk-border-admin bg-mk-bg-admin px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Showing */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-mk-subtle">Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                const value = e.target.value

                handleItemsPerPageChange(value === 'all' ? 'all' : Number(value))
              }}
              className="h-8 rounded-lg border border-mk-border-admin bg-white px-2.5 pr-7 text-xs font-semibold text-mk-muted-admin outline-none transition focus:border-mk-admin"
            >
              <option value={5}>5 Documents</option>
              <option value={10}>10 Documents</option>
              <option value={20}>20 Documents</option>
              <option value="all">All Documents</option>
            </select>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-mk-border-admin bg-white px-2 text-xs font-medium text-mk-muted-admin transition hover:bg-mk-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${currentPage === page ? 'bg-mk-admin text-white' : 'border border-mk-border-admin bg-white text-mk-muted-admin hover:bg-mk-surface'}`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-mk-border-admin bg-white px-2 text-xs font-medium text-mk-muted-admin transition hover:bg-mk-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <AdminTrashBox
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          type="danger"
          title="Delete Category?"
          message={`Are you sure you want to delete this ${deleteItem.categoryName}`}
          actionButtonText="Delete"
          cancelButtonText="Cancel"
          onAction={deleteHandle}
        />
      )}
    </div>
  )
}

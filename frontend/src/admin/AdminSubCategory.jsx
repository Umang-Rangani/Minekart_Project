import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Layers, Eye, CheckCircle2, CircleOff, Tags, ArrowUpDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import AdminTrashBox from './AdminTrashBox'
import toast from 'react-hot-toast'
import { useUser } from '../context/userProvider'
import { ACTIONS, SECTION_KEYS } from '../constants/permission'
import { hasPermission } from '../lib/permission'

export default function AdminSubCategory() {
  const navigate = useNavigate()
  const { user } = useUser()
  const canCreate = hasPermission(user, SECTION_KEYS.SubCategory, ACTIONS.SubCategory.CREATE)
  const canView = hasPermission(user, SECTION_KEYS.SubCategory, ACTIONS.SubCategory.VIEW)
  const canUpdate = hasPermission(user, SECTION_KEYS.SubCategory, ACTIONS.SubCategory.UPDATE)
  const canDelete = hasPermission(user, SECTION_KEYS.SubCategory, ACTIONS.SubCategory.DELETE)

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminSubCategoriesSearch') || ''
  })

  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem('adminSubCategoriesSort') || 'newest'
  })

  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // delete popup
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // ! Get all subcategories
  const getSubCategories = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/subcategory')

      setSubCategories(res.data.data || [])
    } catch (error) {
      console.error('Get subcategories error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ! open pop up
  const handleModalOpen = (data) => {
    setDeleteItem(data)
    setDeleteModalOpen(true)
  }

  // ! Delete category
  const deleteHandle = async () => {
    if (!deleteItem) return

    try {
      await axiosInstance.delete(`/subcategory/${deleteItem._id}`)
      // setDeleteItem(null)

      toast.success('subcategory deleted successfully')
    } catch (error) {
      console.error('Delete subcategory error:', error.response?.data || error.message)
    } finally {
      setDeleteModalOpen(false)
      await getSubCategories()
    }
  }

  // ! Search
  const filteredSubCategories = subCategories
    .filter((subCategory) => {
      const searchText = search.toLowerCase()

      const subCategoryName = subCategory.subCategoryName?.toLowerCase() || ''

      const categoryName = subCategory.category?.categoryName?.toLowerCase() || ''

      return subCategoryName.includes(searchText) || categoryName.includes(searchText)
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  // ! Pagination
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredSubCategories.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredSubCategories.length : startIndex + itemsPerPage

  const currentSubCategories = itemsPerPage === 'all' ? filteredSubCategories : filteredSubCategories.slice(startIndex, endIndex)

  // ! Pagination change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  // ! Initial API
  useEffect(() => {
    getSubCategories()
  }, [])

  // ! SubCategory statistics
  const totalSubCategories = subCategories.length

  const activeSubCategories = subCategories.filter((subCategory) => subCategory.status === 'Active').length

  const inactiveSubCategories = subCategories.filter((subCategory) => subCategory.status === 'Inactive').length

  const categoriesUsed = new Set(subCategories.map((subCategory) => subCategory.category?._id || subCategory.category).filter(Boolean)).size

  const stats = [
    {
      title: 'Total SubCategories',
      value: totalSubCategories,
      icon: Layers,
    },
    {
      title: 'Active SubCategories',
      value: activeSubCategories,
      icon: CheckCircle2,
    },
    {
      title: 'Inactive SubCategories',
      value: inactiveSubCategories,
      icon: CircleOff,
    },
    {
      title: 'Categories Used',
      value: categoriesUsed,
      icon: Tags,
    },
  ]

  const items = [
    {
      title: 'SubCategories',
      link: null,
    },
  ]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      {/*  STATS  */}
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

      {/*  SUBCATEGORY TABLE  */}
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
                localStorage.setItem('adminSubCategoriesSearch', value)
                setCurrentPage(1)
              }}
              placeholder="Search subcategories..."
              className="h-10 w-full rounded-xl border border-mk-border-admin bg-mk-bg-admin pl-10 pr-10 text-sm text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  localStorage.removeItem('adminSubCategoriesSearch')
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
                  localStorage.setItem('adminSubCategoriesSort', value)
                  setCurrentPage(1)
                }}
                className="h-10 w-full appearance-none rounded-xl border border-mk-border-admin bg-mk-bg-admin pl-9 pr-8 text-sm font-semibold text-mk-muted-admin outline-none transition focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin sm:w-44"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {canCreate && (
              <button type="button" onClick={() => navigate('/admin/subcategory/new')} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-mk-admin px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-mk-admin-hover">
                <Plus size={18} />
                Add SubCategory
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b border-mk-border-admin bg-mk-bg-admin">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">SubCategory</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Description</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-sm text-mk-subtle">
                    Loading subcategories...
                  </td>
                </tr>
              ) : currentSubCategories.length > 0 ? (
                currentSubCategories.map((subCategory, index) => (
                  <tr key={subCategory._id} className="border-b border-mk-border-admin transition hover:bg-mk-bg-admin">
                    {/* Index */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-mk-muted-admin">{startIndex + index + 1}</span>
                    </td>

                    {/* SubCategory */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <p className="max-w-55 truncate text-sm font-semibold text-mk-ink-admin">{subCategory.subCategoryName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-mk-surface px-3 py-1.5 text-xs font-semibold text-mk-admin">{subCategory.category?.categoryName || 'No category'}</span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4">
                      <p className="max-w-75 truncate text-sm text-mk-muted-admin">{subCategory.description || '-'}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${subCategory.status === 'Active' ? 'bg-mk-surface text-mk-admin-hover' : 'bg-mk-danger-soft text-mk-danger'}`}>
                        <span className={`size-1.5 rounded-full ${subCategory.status === 'Active' ? 'bg-mk-admin' : 'bg-mk-danger'}`} />

                        {subCategory.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {canView && (
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/subcategory/${subCategory._id}`)}
                            className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-surface hover:text-mk-ink-admin"
                            title="View SubCategory"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {canUpdate && (
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/subcategory/${subCategory._id}/update`)}
                            className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-surface hover:text-mk-ink-admin"
                            title="Edit SubCategory"
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        {canDelete && (
                          <button type="button" onClick={() => handleModalOpen(subCategory)} className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-danger-soft hover:text-mk-danger" title="Delete SubCategory">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-sm text-mk-subtle">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  FOOTER  */}
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
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-mk-border-admin bg-white px-2 text-xs font-medium text-mk-muted-admin transition hover:bg-mk-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>

            {/* Pages */}
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

            {/* Next */}
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

      {/*  DELETE MODAL  */}
      {deleteModalOpen && (
        <AdminTrashBox
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          type="danger"
          title="Delete SubCategory?"
          message={`Are you sure you want to delete this ${deleteItem.subCategoryName}`}
          actionButtonText="Delete"
          cancelButtonText="Cancel"
          onAction={deleteHandle}
        />
      )}
    </div>
  )
}

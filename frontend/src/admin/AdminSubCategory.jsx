import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Layers, Eye, CheckCircle2, CircleOff, Tags } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import AdminTrashBox from './AdminTrashBox'
import toast from 'react-hot-toast'

export default function AdminSubCategory() {
  const navigate = useNavigate()

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminSubCategoriesSearch') || ''
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
  const filteredSubCategories = subCategories.filter((subCategory) => {
    const searchText = search.toLowerCase()

    const subCategoryName = subCategory.subCategoryName?.toLowerCase() || ''

    const categoryName = subCategory.category?.categoryName?.toLowerCase() || ''

    return subCategoryName.includes(searchText) || categoryName.includes(searchText)
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

      {/*  SUBCATEGORY TABLE  */}
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
                localStorage.setItem('adminSubCategoriesSearch', value)

                setCurrentPage(1)
              }}
              placeholder="Search subcategories..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  localStorage.removeItem('adminSubCategoriesSearch')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Add SubCategory */}
          <button type="button" onClick={() => navigate('/admin/subcategory/new')} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D554C]">
            <Plus size={18} />
            Add SubCategory
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-225">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">SubCategory</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Description</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading subcategories...
                  </td>
                </tr>
              ) : currentSubCategories.length > 0 ? (
                currentSubCategories.map((subCategory, index) => (
                  <tr key={subCategory._id} className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                    {/* Index */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#6F6A64]">{startIndex + index + 1}</span>
                    </td>

                    {/* SubCategory */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <p className="max-w-55 truncate text-sm font-semibold text-[#292725]">{subCategory.subCategoryName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-[#F1EEE8] px-3 py-1.5 text-xs font-semibold text-[#6B6258]">{subCategory.category?.categoryName || 'No category'}</span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4">
                      <p className="max-w-75 truncate text-sm text-[#6F6A64]">{subCategory.description || '-'}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${subCategory.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                        <span className={`size-1.5 rounded-full ${subCategory.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                        {subCategory.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/subcategory/${subCategory._id}`)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                          title="View SubCategory"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/subcategory/${subCategory._id}/update`)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                          title="Edit SubCategory"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleModalOpen(subCategory)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]"
                          title="Delete SubCategory"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    No subcategories found
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
      {deleteModalOpen && (
        <AdminTrashBox
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          type="danger"
          title="Delete User?"
          message={`Are you sure you want to delete this ${deleteItem.subCategoryName}`}
          actionButtonText="Delete"
          cancelButtonText="Cancel"
          onAction={deleteHandle}
        />
      )}
    </div>
  )
}

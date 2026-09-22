import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Package, ShoppingBag, CircleDollarSign, AlertTriangle, Eye, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from '../user/BreadCrumb'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminProducts() {
  const navigate = useNavigate()

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminProductsSearch') || ''
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // delete popup
  const [deleteProductId, setDeleteProductId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // pagination 1.
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // ! Get all products
  const getProducts = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/product')

      setProducts(res.data.data || [])
    } catch (error) {
      console.error('Get products error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ! Delete product
  const deleteHandle = async () => {
    if (!deleteProductId) return

    try {
      setDeleting(true)

      await axiosInstance.delete(`/product/${deleteProductId}`)

      await getProducts()

      setDeleteProductId(null)
    } catch (error) {
      console.error('Delete product error:', error.response?.data || error.message)
    } finally {
      setDeleting(false)
    }
  }

  // ! Search
  const filteredProducts = products.filter((product) => product.productName?.toLowerCase().includes(search.toLowerCase()))

  // ! pagination 2.
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredProducts.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredProducts.length : startIndex + itemsPerPage

  const currentProducts = itemsPerPage === 'all' ? filteredProducts : filteredProducts.slice(startIndex, endIndex)

  // ! pagination 3.
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  // ! Initial API
  useEffect(() => {
    getProducts()
  }, [])

  // ! delete lock
  useEffect(() => {
    if (deleteProductId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [deleteProductId])

  // ! Product statistics
  const totalProducts = products.length

  const activeProducts = products.filter((product) => product.status === 'Active').length

  const bestSellingProducts = products.filter((product) => product.homeSection === 'BestSelling').length

  const outOfStockProducts = products.filter((product) => Number(product.stock) === 0).length

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
    },
    {
      title: 'Active Products',
      value: activeProducts,
      icon: ShoppingBag,
    },
    {
      title: 'Best Selling',
      value: bestSellingProducts,
      icon: CircleDollarSign,
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: AlertTriangle,
    },
  ]

  const items = [{ title: 'Products', link: null }]

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

      {/*  PRODUCT TABLE  */}
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
                localStorage.setItem('adminProductsSearch', value)

                setCurrentPage(1)
              }}
              placeholder="Search products..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  localStorage.removeItem('adminProductsSearch')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button type="button" onClick={() => navigate('/admin/products/new')} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D554C]">
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-250">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Product</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Brand</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Price</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Stock</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading products...
                  </td>
                </tr>
              ) : currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <tr key={product._id} className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                    {/* Index */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#6F6A64]">{index + 1}</span>
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="min-w-0">
                        <p className="max-w-60 truncate text-sm font-semibold text-[#292725]">{product.productName}</p>

                        {product.homeSection === 'BestSelling' && <span className="mt-1 inline-flex rounded-full bg-[#F1EEE8] px-2 py-0.5 text-[10px] font-semibold text-[#6B6258]">Best Selling</span>}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#6F6A64]">{product.category?.categoryName || '-'}</span>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#292725]">{product.brand?.brandName || '-'}</span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#292725]">₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}</p>

                      {product.discount > 0 && (
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="text-xs text-[#99938B] line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>

                          <span className="text-[10px] font-semibold text-[#6B6258]">{product.discount}% OFF</span>
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${Number(product.stock) === 0 ? 'text-[#A44A3F]' : 'text-[#6F6A64]'}`}>{product.stock}</span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${product.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                        <span className={`size-1.5 rounded-full ${product.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${product._id}`)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                          title="View Product"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${product._id}/update`)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                          title="Edit Product"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}
                        <button type="button" onClick={() => setDeleteProductId(product._id)} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
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
      {deleteProductId && (
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
                this product?
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#77736E]">This action cannot be undone. The product will be permanently deleted.</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-6 pb-7 sm:px-8">
              {/* Cancel */}
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteProductId(null)}
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

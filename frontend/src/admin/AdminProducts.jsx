import React, { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Package, ShoppingBag, CircleDollarSign, AlertTriangle, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'

export default function AdminProducts() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

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
  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?')

    if (!confirmDelete) return

    try {
      await axiosInstance.delete(`/product/${id}`)

      await getProducts()

      console.log('Product deleted successfully')
    } catch (error) {
      console.error('Delete product error:', error.response?.data || error.message)
    }
  }

  // ! Search
  const filteredProducts = products.filter((product) => product.productName?.toLowerCase().includes(search.toLowerCase()))

  // ! Initial API
  useEffect(() => {
    getProducts()
  }, [])

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

  return (
    <div className="space-y-6 transition-all duration-700">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292725]">Products</h1>

          <p className="mt-1 text-sm text-[#6F6A64]">Manage your products, pricing and inventory.</p>
        </div>

        <button type="button" onClick={() => navigate('/admin/products/new')} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D554C]">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* ================= STATS ================= */}
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

      {/* ================= PRODUCT TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />
          </div>

          <p className="text-xs text-[#99938B]">Manage your product inventory</p>
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
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
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
                        <button type="button" onClick={() => deleteHandle(product._id)} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]" title="Delete Product">
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
        <div className="flex items-center justify-between border-t border-[#E3DED6] bg-[#FCFBF9] px-5 py-3">
          <p className="text-xs text-[#99938B]">
            Showing <span className="font-semibold text-[#6F6A64]">{filteredProducts.length}</span> products
          </p>

          <p className="text-xs font-medium text-[#6F6A64]">Total {products.length} products</p>
        </div>
      </div>
    </div>
  )
}

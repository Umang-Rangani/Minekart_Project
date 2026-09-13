import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { iconMap } from '../data/iconMap'

export default function CategoryProducts() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCategoryProducts = async () => {
    try {
      setLoading(true)

      // Get all products
      const productRes = await axiosInstance.get('/product')

      const allProducts = productRes.data.data || []

      // Filter products by category
      const filteredProducts = allProducts.filter((product) => product.category?._id === id)

      setProducts(filteredProducts)

      // Get category information
      const categoryRes = await axiosInstance.get('/category')

      const categories = categoryRes.data.data || []

      const currentCategory = categories.find((item) => item._id === id)

      setCategory(currentCategory)
    } catch (error) {
      console.error('Get category products error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getCategoryProducts()
  }, [id])

  const Icon = category ? iconMap[category.categoryLucideIcons] : null

  return (
    <div className="min-h-screen bg-[#F8FAFC]  py-6">
      <div className="mx-auto ">
        {/* Product Heading */}
        {!loading && products.length > 0 && (
          <div className="mb-5 flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Category Icon */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] shadow-sm sm:h-24 sm:w-24">{Icon && <Icon size={40} strokeWidth={1.8} />}</div>

              {/* Category Name */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-[#1D4ED8]" />

                  <h2 className="text-xl font-extrabold tracking-tight text-[#172033] sm:text-2xl">{category?.categoryName} Products</h2>
                </div>

                <p className="mt-1 ml-3 text-sm text-[#64748B]">Discover the latest products in this category</p>
              </div>
            </div>

            {/* Right Side */}
            <span className="shrink-0 rounded-full bg-[#FFF7ED] px-3 py-1.5 text-xs font-bold text-[#B45309]">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
                <div className="h-64 animate-pulse bg-[#F1F5F9]" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#E2E8F0]" />

                  <div className="h-4 w-full animate-pulse rounded bg-[#E2E8F0]" />

                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#E2E8F0]" />

                  <div className="h-6 w-24 animate-pulse rounded bg-[#E2E8F0]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty */
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#CBD5E1] bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF] text-2xl">🛍️</div>

            <h2 className="mt-4 text-lg font-extrabold text-[#172033]">No products found</h2>

            <p className="mt-1 max-w-sm text-sm text-[#64748B]">There are currently no products available in this category.</p>
          </div>
        ) : (
          /* Products */
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#F8FAFC] p-5">
                  {/* Discount */}
                  {product.discount > 0 && <span className="absolute left-3 top-3 z-10 rounded-lg bg-[#F59E0B] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">{product.discount}% OFF</span>}

                  {/* Stock */}
                  {product.stock <= 0 && <span className="absolute right-3 top-3 z-10 rounded-lg bg-[#FEF2F2] px-2.5 py-1 text-[10px] font-bold text-[#DC2626]">Out of Stock</span>}

                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-sm text-[#94A3B8]">No Image</span>
                  )}
                </div>

                {/* Details */}
                <div className="border-t border-[#E2E8F0] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">{product.category?.categoryName}</p>

                  <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-[#172033] transition group-hover:text-[#1D4ED8]">{product.productName}</h3>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-[#16A34A] px-2 py-1 text-[11px] font-extrabold text-white">
                      {product.rating}

                      <Star size={11} fill="currentColor" strokeWidth={2.5} />
                    </span>

                    {product.soldCount > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />

                        <span className="text-[11px] text-[#64748B]">{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight text-[#172033]">₹{product.discountPrice}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className="text-sm text-[#94A3B8] line-through">₹{product.price}</span>

                        <span className="text-xs font-bold text-green-600">{product.discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
                    <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{product.stock > 0 ? '● In Stock' : '● Unavailable'}</span>

                    <span className="text-xs font-bold text-[#1D4ED8] transition group-hover:translate-x-1">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

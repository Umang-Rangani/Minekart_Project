import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

export default function BrandProducts() {
  const { id } = useParams()

  const [products, setProducts] = useState([])
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getBrandProducts = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/product')

      const allProducts = res.data.data || []

      const filteredProducts = allProducts.filter((product) => product.brand?._id === id)

      setProducts(filteredProducts)

      if (filteredProducts.length > 0) {
        setBrand(filteredProducts[0].brand)
      }
    } catch (error) {
      console.error('Get brand products error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getBrandProducts()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading products...</p>
      </div>
    )
  }

  // console.log("brand.brandLogo", brand);

  const items = [
    { title: 'Brand', link: '/brand' },
    { title: `${brand?.brandName}`, link: null },
  ]

  return (
    <div className="min-h-screen ">
      <BreadCrumb items={items} />
      <div className="mx-auto pt-5 ">
        {/*  PRODUCT HEADING  */}
        {!loading && products.length > 0 && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-md bg-white p-3 shadow-sm">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Brand Logo */}
              {brand?.brandLogo && (
                <div className="flex h-12 w-15 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#E2E8F0] bg-white shadow-sm sm:h-15 sm:w-19">
                  <img src={`http://localhost:3000${brand.brandLogo}`} alt={brand.brandName} className="h-full w-full object-contain" />
                </div>
              )}

              {/* Brand Name */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-[#1D4ED8]" />

                  <h2 className="text-xl font-extrabold tracking-tight text-[#172033] sm:text-2xl">{brand?.brandName} Products</h2>
                </div>

                <p className="mt-1 ml-3 text-sm text-[#64748B]">Discover the latest products from {brand?.brandName}</p>
              </div>
            </div>

            {/* Product Count */}
            <span className="shrink-0 rounded-full bg-[#FFF7ED] px-3 py-1.5 text-xs font-bold text-[#B45309]">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        )}

        {/*  LOADING  */}
        {loading ? (
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-5">
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
          /*  EMPTY  */
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-dashed border-[#CBD5E1] bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF] text-2xl">🛍️</div>

            <h2 className="mt-4 text-lg font-extrabold text-[#172033]">No products found</h2>

            <p className="mt-1 max-w-sm text-sm text-[#64748B]">There are currently no products available for this brand.</p>
          </div>
        ) : (
          /*  PRODUCT GRID  */
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-xl"
              >
                {/*  IMAGE  */}
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#F8FAFC] p-5">
                  {/* Discount Badge */}
                  {product.discount > 0 && <span className="absolute left-3 top-3 z-10 rounded-lg bg-[#F59E0B] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">{product.discount}% OFF</span>}

                  {/* Stock Badge */}
                  {product.stock <= 0 ? (
                    <span className="absolute right-3 top-3 z-10 rounded-lg bg-[#FEF2F2] px-2.5 py-1 text-[10px] font-bold text-[#DC2626]">Out of Stock</span>
                  ) : product.stock <= 5 ? (
                    <span className="absolute right-3 top-3 z-10 rounded-lg bg-[#FFF7ED] px-2.5 py-1 text-[10px] font-bold text-[#C2410C]">Only {product.stock} left</span>
                  ) : null}

                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#94A3B8]">
                      <span className="text-3xl">📦</span>

                      <span className="mt-2 text-xs">No Image</span>
                    </div>
                  )}

                  {/* Bottom image overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                {/*  DETAILS  */}
                <div className="border-t border-[#E2E8F0] p-4">
                  {/* Category */}
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">{product.category?.categoryName}</p>

                  {/* Product Name */}
                  <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-[#172033] transition group-hover:text-[#1D4ED8]">{product.productName}</h3>

                  {/* Rating + Sold */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-[#16A34A] px-2 py-1 text-[11px] font-extrabold text-white">
                      {product.rating}
                      <Star size={11} fill="currentColor" strokeWidth={2.5} />
                    </span>

                    {product.soldCount > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />

                        <span className="text-[11px] font-medium text-[#64748B]">{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tight text-[#172033]">₹{product.discountPrice}</span>

                    {product.price > product.discountPrice && <span className="text-sm font-medium text-[#94A3B8] line-through">₹{product.price}</span>}
                  </div>

                  {/* Bottom row */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ECFDF5]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                      </span>

                      <span className="text-[10px] font-semibold text-[#16A34A]">{product.stock > 0 ? 'In Stock' : 'Unavailable'}</span>
                    </div>

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

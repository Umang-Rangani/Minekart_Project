import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, ChevronRight, Package, ArrowRight, Sparkles } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const getProducts = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/product/normal')

      setProducts(res.data?.data || [])
    } catch (error) {
      console.error('Get normal products error:', error.response?.data || error.message)

      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  const getImageUrl = (image) => {
    if (!image) return ''

    return image.startsWith('http') ? image : `http://localhost:3000${image}`
  }

  if (loading) {
    return (
      <section className="w-full">
        {/* Loading Header */}
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7]">
                <Sparkles size={16} className="text-[#A51D26]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A857B] sm:text-xs">Collection</span>
            </div>

            <div className="h-7 w-36 animate-pulse rounded-lg bg-[#E8DDD4]" />

            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-[#EEE5DF]" />
          </div>
        </div>

        {/* Product Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.04)]">
              <div className="aspect-square animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2]" />

              <div className="space-y-3 border-t border-[#EEE5DF] bg-[#FFFCFA] p-3">
                <div className="h-2.5 w-16 animate-pulse rounded bg-[#E8DDD4]" />

                <div className="h-3 w-full animate-pulse rounded bg-[#E8DDD4]" />

                <div className="h-3 w-3/4 animate-pulse rounded bg-[#EEE5DF]" />

                <div className="h-4 w-20 animate-pulse rounded bg-[#E8DDD4]" />

                <div className="h-3 w-full animate-pulse rounded bg-[#EEE5DF]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
              <Sparkles size={16} strokeWidth={2} />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A857B] sm:text-xs">Collection</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Latest Products</h2>

          <p className="mt-1 truncate text-xs text-[#806C63] sm:text-sm">Explore our latest products</p>
        </div>

        {/* Product Count + View All */}
        <div className="flex shrink-0 items-center gap-2">
          {products.length > 0 && (
            <span className="hidden rounded-full bg-[#F7EEE7] px-3 py-1.5 text-[10px] font-bold text-[#8E181F] sm:inline-flex">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>
          )}

          <Link
            to="/products"
            className="group flex items-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-2 text-xs font-semibold text-[#8E181F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:shadow-md sm:px-3.5 sm:text-sm"
          >
            <span>View All</span>

            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <Package size={27} strokeWidth={1.6} />
          </div>

          <h3 className="mt-4 text-sm font-extrabold text-[#351C18]">No Products Available</h3>

          <p className="mt-1 text-xs text-[#806C63]">Products will appear here once they are available.</p>
        </div>
      ) : (
        /* Products */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
          {products.map((product) => {
            const isInactive = product.status === 'Inactive'
            const isOutOfStock = product.stock <= 0
            const isDisabled = isInactive || isOutOfStock
            const isLowStock = !isDisabled && product.stock > 0 && product.stock <= 5

            const productContent = (
              <>
                {/* Image */}
                <div className={`relative flex aspect-square items-center justify-center overflow-hidden p-4 ${isDisabled ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
                  {/* Decorative Circle */}
                  {!isDisabled && <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#A51D26]/5 transition-transform duration-500 group-hover:scale-150" />}

                  {/* Discount */}
                  {!isDisabled && product.discount > 0 && (
                    <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-linear-to-r from-[#7D171C] to-[#A51D26] px-2 py-1 text-[8px] font-extrabold text-white shadow-sm sm:left-3 sm:top-3 sm:text-[9px]">{product.discount}% OFF</span>
                  )}

                  {/* Status Badge */}
                  {isInactive ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#E5E5E5] px-2 py-1 text-[8px] font-bold text-[#888888] sm:right-3 sm:top-3 sm:text-[9px]">Inactive</span>
                  ) : isOutOfStock ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#E5E5E5] px-2 py-1 text-[8px] font-bold text-[#888888] sm:right-3 sm:top-3 sm:text-[9px]">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF5E7] px-2 py-1 text-[8px] font-bold text-[#B87935] sm:right-3 sm:top-3 sm:text-[9px]">Only {product.stock} left</span>
                  ) : null}

                  {/* Product Image */}
                  {product.images?.length > 0 ? (
                    <img src={getImageUrl(product.images[0])} alt={product.productName} className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-500 group-hover:scale-105'}`} />
                  ) : (
                    <div className={`relative z-10 flex flex-col items-center gap-2 ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                      <ShoppingCart size={28} strokeWidth={1.5} />

                      <span className="text-[9px]">No Image</span>
                    </div>
                  )}

                  {/* Bottom Glow */}
                  {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-t from-[#351C18]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
                </div>

                {/* Product Info */}
                <div className={`border-t px-3 py-3 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#EEE5DF] bg-[#FFFCFA] transition-colors duration-300 group-hover:bg-[#FBF5F1]'}`}>
                  {/* Category */}
                  <p className={`truncate text-[8px] font-bold uppercase tracking-wider sm:text-[9px] ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product.category?.categoryName || 'Product'}</p>

                  {/* Product Name */}
                  <h3 className={`mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4 sm:text-[13px] ${isDisabled ? 'text-[#777777]' : 'text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]'}`}>{product.productName}</h3>

                  {/* Rating + Sold */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${isDisabled ? 'bg-[#E5E5E5] text-[#888888]' : 'bg-[#3E8B62] text-white'}`}>
                      {product.rating || '0.0'}

                      <Star size={8} fill="currentColor" strokeWidth={2} />
                    </span>

                    {product.soldCount > 0 && (
                      <>
                        <span className={`h-0.5 w-0.5 rounded-full ${isDisabled ? 'bg-[#BDBDBD]' : 'bg-[#C9B8AF]'}`} />

                        <span className={`truncate text-[8px] font-medium sm:text-[9px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className={`text-sm font-extrabold tracking-tight sm:text-base ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className={`text-[9px] line-through sm:text-[10px] ${isDisabled ? 'text-[#AAAAAA]' : 'text-[#9A857B]'}`}>₹{product.price?.toLocaleString('en-IN')}</span>

                        {!isDisabled && <span className="text-[8px] font-bold text-[#3E8B62] sm:text-[9px]">{product.discount}% off</span>}
                      </>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className={`mt-2 flex items-center justify-between border-t pt-2 ${isDisabled ? 'border-[#D9D9D9]' : 'border-[#EFE5DF]'}`}>
                    {/* Availability */}
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${isDisabled ? 'bg-[#999999]' : isLowStock ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                      <span className={`text-[8px] font-bold sm:text-[9px] ${isDisabled ? 'text-[#888888]' : isLowStock ? 'text-[#B87935]' : 'text-[#3E8B62]'}`}>
                        {isInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                      </span>
                    </div>

                    {/* View */}
                    {!isDisabled && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1 sm:text-[10px]">
                        View
                        <ChevronRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </div>
                </div>
              </>
            )

            return isDisabled ? (
              <div key={product._id} aria-disabled="true" className="group relative cursor-not-allowed overflow-hidden rounded-2xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_3px_10px_rgba(0,0,0,0.04)]">
                {productContent}
              </div>
            ) : (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_15px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_16px_35px_rgba(73,54,49,0.15)]"
              >
                {productContent}
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

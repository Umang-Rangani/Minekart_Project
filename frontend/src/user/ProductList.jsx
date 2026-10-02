import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, ChevronRight, Package, ArrowRight, Sparkles } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import ProductListShimmer from '../userShimmer/ProductListShimmer'

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

  if (loading) {
    return <ProductListShimmer />
  }

  return (
    <section className="w-full">
      {/* Section Header */}

      <div className="mb-3 flex items-end justify-between gap-2 sm:mb-6 sm:gap-4">
        <div className="min-w-0">
          {/* Collection */}

          <div className="mb-1 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[#8E181F] sm:h-8 sm:w-8 sm:rounded-lg">
              <Sparkles size={13} strokeWidth={2} className="sm:h-4 sm:w-4" />
            </span>

            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9A857B] sm:text-xs sm:tracking-[0.16em]">Collection</span>
          </div>

          {/* Title */}

          <h2 className="text-lg font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Latest Products</h2>

          {/* Subtitle */}

          <p className="mt-0.5 truncate text-[10px] text-[#806C63] sm:mt-1 sm:text-sm">Explore our latest products</p>
        </div>

        {/* View All */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            to="/products"
            className="group flex items-center gap-1 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-2.5 py-1.5 text-[10px] font-semibold text-[#8E181F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:shadow-md sm:gap-1.5 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <span>View All</span>

            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1 sm:h-3.75 sm:w-3.75" />
          </Link>
        </div>
      </div>

      {/* Empty State */}

      {products.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-4 text-center sm:min-h-60 sm:rounded-2xl sm:px-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F] sm:h-14 sm:w-14 sm:rounded-2xl">
            <Package size={23} strokeWidth={1.6} className="sm:h-6.75 sm:w-6.75" />
          </div>

          <h3 className="mt-3 text-xs font-extrabold text-[#351C18] sm:mt-4 sm:text-sm">No Products Available</h3>

          <p className="mt-1 text-[10px] text-[#806C63] sm:text-xs">Products will appear here once they are available.</p>
        </div>
      ) : (
        /* Products */
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-4">
          {products.map((product) => {
            const isInactive = product.status === 'Inactive'

            const stock = Number(product.stock || 0)

            const isOutOfStock = stock <= 0

            const isDisabled = isInactive || isOutOfStock

            const isLowStock = !isDisabled && stock > 0 && stock <= 5

            const price = Number(product.price || 0)

            const discountPrice = Number(product.discountPrice || 0)

            const displayPrice = discountPrice > 0 ? discountPrice : price

            const hasDiscount = price > displayPrice && displayPrice > 0

            const productContent = (
              <>
                {/* Image */}

                <div className={`relative flex aspect-square items-center justify-center overflow-hidden p-2 sm:p-3 ${isDisabled ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
                  {/* Decorative Circle */}

                  {!isDisabled && <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#A51D26]/5 transition-transform duration-500 group-hover:scale-150 sm:-right-8 sm:-top-8 sm:h-24 sm:w-24" />}

                  {/* Discount */}

                  {!isDisabled && product.discount > 0 && (
                    <span className="absolute left-1.5 top-1.5 z-20 rounded-md bg-linear-to-r from-[#7D171C] to-[#A51D26] px-1.5 py-0.5 text-[6.5px] font-extrabold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">
                      {product.discount}% OFF
                    </span>
                  )}

                  {/* Status */}

                  {isInactive ? (
                    <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-[#E5E5E5] px-1.5 py-0.5 text-[6.5px] font-bold text-[#888888] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Inactive</span>
                  ) : isOutOfStock ? (
                    <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-[#E5E5E5] px-1.5 py-0.5 text-[6.5px] font-bold text-[#888888] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-[#FFF5E7] px-1.5 py-0.5 text-[6.5px] font-bold text-[#B87935] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Only {stock} left</span>
                  ) : null}

                  {/* Product Image */}

                  {product.images?.length > 0 ? (
                    <img src={getImageUrl(product.images[0])} alt={product.productName} className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-500 group-hover:scale-105'}`} />
                  ) : (
                    <div className={`relative z-10 flex flex-col items-center gap-1 ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>
                      <ShoppingCart size={22} strokeWidth={1.5} className="sm:h-6 sm:w-6" />

                      <span className="text-[7px] sm:text-[8px]">No Image</span>
                    </div>
                  )}

                  {/* Bottom Glow */}

                  {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-[#351C18]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-14" />}
                </div>

                {/* Product Info */}

                <div className={`border-t px-1.5 py-1.5 sm:px-2.5 sm:py-2.5 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#EEE5DF] bg-[#FFFCFA] transition-colors duration-300 group-hover:bg-[#FBF5F1]'}`}>
                  {/* Category */}

                  <p className={`truncate text-[6.5px] font-bold uppercase tracking-wider sm:text-[8px] ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product.category?.categoryName || 'Product'}</p>

                  {/* Product Name */}

                  <h3 className={`mt-1 line-clamp-2 min-h-8 text-[10px] font-bold leading-4 sm:min-h-10 sm:text-[12px] sm:leading-5 ${isDisabled ? 'text-[#777777]' : 'text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]'}`}>
                    {product.productName}
                  </h3>

                  {/* Rating */}

                  <div className="mt-1 flex items-center gap-1 sm:mt-1.5">
                    <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] font-bold sm:px-1.5 sm:text-[8px] ${isDisabled ? 'bg-[#E5E5E5] text-[#888888]' : 'bg-[#3E8B62] text-white'}`}>
                      {Number(product.rating || 0).toFixed(1)}

                      <Star size={6} fill="currentColor" strokeWidth={2} className="sm:h-1.75 sm:w-1.75" />
                    </span>

                    {Number(product.soldCount || 0) > 0 && (
                      <>
                        <span className={`h-0.5 w-0.5 rounded-full ${isDisabled ? 'bg-[#BDBDBD]' : 'bg-[#C9B8AF]'}`} />

                        <span className={`truncate text-[6.5px] font-medium sm:text-[8px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}

                  <div className="mt-1 flex items-baseline gap-1 sm:mt-1.5 sm:gap-1">
                    <span className={`text-[12px] font-extrabold tracking-tight sm:text-[14px] ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>

                    {hasDiscount && (
                      <>
                        <span className={`text-[7px] line-through sm:text-[9px] ${isDisabled ? 'text-[#AAAAAA]' : 'text-[#9A857B]'}`}>₹{price.toLocaleString('en-IN')}</span>

                        {!isDisabled && <span className="text-[6.5px] font-bold text-[#3E8B62] sm:text-[8px]">{product.discount}% off</span>}
                      </>
                    )}
                  </div>

                  {/* Bottom */}

                  <div className={`mt-1 flex items-center justify-between border-t pt-1 sm:mt-1.5 sm:pt-1.5 ${isDisabled ? 'border-[#D9D9D9]' : 'border-[#EFE5DF]'}`}>
                    {/* Availability */}

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${isDisabled ? 'bg-[#999999]' : isLowStock ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                      <span className={`text-[6.5px] font-bold sm:text-[8px] ${isDisabled ? 'text-[#888888]' : isLowStock ? 'text-[#B87935]' : 'text-[#3E8B62]'}`}>
                        {isInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                      </span>
                    </div>

                    {/* View */}

                    {!isDisabled && (
                      <span className="flex items-center gap-0.5 text-[7px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1 sm:text-[9px]">
                        View
                        <ChevronRight size={9} className="transition-transform duration-300 group-hover:translate-x-0.5 sm:h-2.5 sm:w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </>
            )

            // Disabled Product

            if (isDisabled) {
              return (
                <div
                  key={product._id}
                  aria-disabled="true"
                  className="group relative cursor-not-allowed overflow-hidden rounded-lg border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:rounded-xl sm:shadow-[0_3px_10px_rgba(0,0,0,0.04)]"
                >
                  {productContent}
                </div>
              )
            }

            // Active Product

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-lg border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)] sm:rounded-xl sm:shadow-[0_3px_12px_rgba(73,54,49,0.05)]"
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

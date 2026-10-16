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
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-mk-primary-soft text-mk-primary-hover sm:h-8 sm:w-8 sm:rounded-lg">
              <Sparkles size={13} strokeWidth={2} className="sm:h-4 sm:w-4" />
            </span>

            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-mk-muted sm:text-xs sm:tracking-[0.16em]">Collection</span>
          </div>

          {/* Title */}

          <h2 className="text-lg font-extrabold tracking-tight text-mk-ink sm:text-2xl">Latest Products</h2>

          {/* Subtitle */}

          <p className="mt-0.5 truncate text-[10px] text-mk-muted sm:mt-1 sm:text-sm">Explore our latest products</p>
        </div>

        {/* View All */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            to="/products"
            className="group flex items-center gap-1 rounded-lg border border-mk-border bg-mk-card px-2.5 py-1.5 text-[10px] font-semibold text-mk-primary-hover shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-mk-border hover:bg-mk-primary-soft hover:shadow-md sm:gap-1.5 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <span>View All</span>

            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1 sm:h-3.75 sm:w-3.75" />
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-mk-border bg-mk-card px-4 text-center sm:min-h-60 sm:rounded-2xl sm:px-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mk-primary-soft text-mk-primary-hover sm:h-14 sm:w-14 sm:rounded-2xl">
            <Package size={23} strokeWidth={1.6} className="sm:h-6.75 sm:w-6.75" />
          </div>

          <h3 className="mt-3 text-xs font-extrabold text-mk-ink sm:mt-4 sm:text-sm">No Products Available</h3>

          <p className="mt-1 text-[10px] text-mk-muted sm:text-xs">Products will appear here once they are available.</p>
        </div>
      ) : (
        /* Products */
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-4">
          {products.map((product) => {
            const isInactive = product.status === 'Inactive'
            const isCategoryInactive = product.category?.status === 'Inactive'

            const stock = Number(product.stock || 0)
            const isOutOfStock = stock <= 0

            const isDisabled = isInactive || isCategoryInactive || isOutOfStock
            const isLowStock = !isDisabled && stock > 0 && stock <= 5

            const price = Number(product.price || 0)

            const discountPrice = Number(product.discountPrice || 0)

            const displayPrice = discountPrice > 0 ? discountPrice : price

            const hasDiscount = price > displayPrice && displayPrice > 0

            const productContent = (
              <>
                {/* Image */}

                {/* <div className={`relative flex aspect-square items-center justify-center overflow-hidden p-2 sm:p-3 ${isDisabled ? 'bg-mk-disabled-bg' : 'bg-white'}`}> */}
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-2 sm:p-3">
                  {/* Decorative Circle */}

                  {!isDisabled && <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-mk-primary/5 transition-transform duration-500 group-hover:scale-150 sm:-right-8 sm:-top-8 sm:h-24 sm:w-24" />}

                  {/* Discount */}
                  {product.discount > 0 && (
                    <span
                      className={`absolute left-1.5 top-1.5 z-20 rounded-md px-1.5 py-0.5 text-[6.5px] font-extrabold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px] ${
                        isDisabled ? 'bg-linear-to-r from-mk-disabled to-mk-subtle' : 'bg-linear-to-r from-mk-primary-deep to-mk-primary'
                      }`}
                    >
                      {product.discount}% OFF
                    </span>
                  )}

                  {/* Status */}
                  {isInactive || isCategoryInactive ? (
                    <span className="absolute right-1.5 top-1.5 z-20 rounded-md border border-mk-border bg-mk-primary-soft px-1.5 py-0.5 text-[6.5px] font-bold text-mk-primary-hover sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">
                      {isInactive ? 'Inactive' : 'Currently Unavailable'}
                    </span>
                  ) : isOutOfStock ? (
                    <span className="absolute right-1.5 top-1.5 z-20 rounded-md border border-mk-border bg-mk-primary-soft px-1.5 py-0.5 text-[6.5px] font-bold text-mk-primary-hover sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Out of Stock</span>
                  ) : isLowStock ? (
                    <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-mk-primary-soft px-1.5 py-0.5 text-[6.5px] font-bold text-mk-accent sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Only {stock} left</span>
                  ) : null}

                  {/* Product Image */}
                  {product.images?.length > 0 ? (
                    <img src={getImageUrl(product.images[0])} alt={product.productName} className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-500 group-hover:scale-105'}`} />
                  ) : (
                    <div className={`relative z-10 flex flex-col items-center gap-1 ${isDisabled ? 'text-mk-subtle' : 'text-mk-muted'}`}>
                      <ShoppingCart size={22} strokeWidth={1.5} className="sm:h-6 sm:w-6" />

                      <span className="text-[7px] sm:text-[8px]">No Image</span>
                    </div>
                  )}

                  {/* Bottom Glow */}

                  {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-mk-ink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-14" />}
                </div>

                {/* Product Info */}
                <div className={`border-t px-1.5 py-1.5 sm:px-2.5 sm:py-2.5 ${isDisabled ? 'border-mk-disabled-bg bg-mk-disabled-bg' : 'border-mk-surface bg-mk-card transition-colors duration-300 group-hover:bg-mk-bg'}`}>
                  {/* Category */}

                  <p className={`truncate text-[6.5px] font-bold uppercase tracking-wider sm:text-[8px] ${isDisabled ? 'text-mk-subtle' : 'text-mk-muted'}`}>{product.category?.categoryName || 'Product'}</p>

                  {/* Product Name */}

                  <h3 className={`mt-1 line-clamp-2 min-h-8 text-[10px] font-bold leading-4 sm:min-h-10 sm:text-[12px] sm:leading-5 ${isDisabled ? 'text-mk-disabled' : 'text-mk-ink transition-colors duration-300 group-hover:text-mk-primary-hover'}`}>
                    {product.productName}
                  </h3>

                  {/* Rating */}

                  <div className="mt-1 flex items-center gap-1 sm:mt-1.5">
                    <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] font-bold sm:px-1.5 sm:text-[8px] ${isDisabled ? 'bg-mk-disabled-bg text-mk-disabled' : 'bg-mk-success text-white'}`}>
                      {Number(product.rating || 0).toFixed(1)}

                      <Star size={6} fill="currentColor" strokeWidth={2} className="sm:h-1.75 sm:w-1.75" />
                    </span>

                    {Number(product.soldCount || 0) > 0 && (
                      <>
                        <span className={`h-0.5 w-0.5 rounded-full ${isDisabled ? 'bg-mk-border-admin' : 'bg-mk-border'}`} />

                        <span className={`truncate text-[6.5px] font-medium sm:text-[8px] ${isDisabled ? 'text-mk-subtle' : 'text-mk-muted'}`}>{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}

                  <div className="mt-1 flex items-baseline gap-1 sm:mt-1.5 sm:gap-1">
                    <span className={`text-[12px] font-extrabold tracking-tight sm:text-[14px] ${isDisabled ? 'text-mk-disabled' : 'text-mk-ink'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>

                    {hasDiscount && (
                      <>
                        <span className={`text-[7px] line-through sm:text-[9px] ${isDisabled ? 'text-mk-disabled' : 'text-mk-muted'}`}>₹{price.toLocaleString('en-IN')}</span>

                        {!isDisabled && <span className="text-[6.5px] font-bold text-mk-success sm:text-[8px]">{product.discount}% off</span>}
                      </>
                    )}
                  </div>

                  {/* Bottom */}

                  <div className={`mt-1 flex items-center justify-between border-t pt-1 sm:mt-1.5 sm:pt-1.5 ${isDisabled ? 'border-mk-disabled-bg' : 'border-mk-surface'}`}>
                    {/* Availability */}

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${isDisabled ? 'bg-mk-subtle' : isLowStock ? 'bg-mk-accent' : 'bg-mk-success'}`} />

                      <span className={`text-[6.5px] font-bold sm:text-[8px] ${isDisabled ? 'text-mk-disabled' : isLowStock ? 'text-mk-accent' : 'text-mk-success'}`}>
                        {isInactive || isCategoryInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                      </span>
                    </div>

                    {/* View */}

                    {!isDisabled && (
                      <span className="flex items-center gap-0.5 text-[7px] font-bold text-mk-primary-hover transition-all duration-300 group-hover:gap-1 sm:text-[9px]">
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
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group relative overflow-hidden rounded-lg border border-mk-border bg-mk-card shadow-[0_2px_8px_rgba(73,54,49,0.04)] transition-all duration-300 hover:border-mk-border hover:shadow-[0_8px_20px_rgba(73,54,49,0.08)] sm:rounded-xl sm:shadow-[0_3px_10px_rgba(73,54,49,0.04)]"
                >
                  {productContent}
                </Link>
              )
            }

            // Active Product

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-lg border border-mk-border bg-mk-card shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-mk-border hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)] sm:rounded-xl sm:shadow-[0_3px_12px_rgba(73,54,49,0.05)]"
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
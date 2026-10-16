import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, ShoppingBag, ChevronRight, Store } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

export default function BrandProducts() {
  const { id } = useParams()

  const [products, setProducts] = useState([])
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)

  const getBrandProducts = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/product/brand/${id}`)

      const productsData = res.data?.data || []

      setProducts(productsData)

      if (productsData.length > 0) {
        setBrand(productsData[0].brand)
      } else {
        setBrand(null)
      }
    } catch (error) {
      console.error('Get brand products error:', error.response?.data || error.message)

      setProducts([])
      setBrand(null)
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

  useEffect(() => {
    document.title = `${brand?.brandName || ''} | MineKart`
  }, [brand])

  const items = [
    { title: 'Brands', link: '/brands' },
    { title: `${brand?.brandName || ''}`, link: null },
  ]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-3 pb-8 sm:pt-4 sm:pb-10">
        {/* BRAND HEADER */}
        {!loading && (
          <div className="mb-3 flex h-14 items-center justify-between gap-2 overflow-hidden rounded-xl border border-mk-border bg-white px-2.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white sm:h-10 sm:w-10">
                {brand?.brandLogo ? (
                  <img src={getImageUrl(brand.brandLogo)} alt={brand.brandName} className="h-full w-full object-contain p-1" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-linear-to-br from-mk-primary-deep to-mk-primary text-white">
                    <Store size={16} strokeWidth={1.8} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[11px] font-extrabold tracking-tight text-mk-ink sm:text-sm">{brand?.brandName} Products</h1>

                <p className="mt-0.5 truncate text-[8px] text-mk-muted sm:text-[10px]">Discover the latest products from {brand?.brandName}</p>
              </div>
            </div>

            <div className="flex h-7 shrink-0 items-center gap-1 rounded-lg border border-mk-border bg-mk-bg px-1.5 text-[7px] font-bold text-mk-muted sm:h-8 sm:px-2.5 sm:text-[9px]">
              <ShoppingBag size={11} strokeWidth={2} className="text-mk-primary-hover" />

              <span>
                {products.length} {products.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="space-y-3 sm:space-y-5">
            {/* BRAND HEADER SHIMMER */}
            <div className="flex h-14 animate-pulse items-center justify-between gap-2 overflow-hidden rounded-xl border border-mk-border bg-white px-2.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                {/* Logo */}
                <div className="h-8 w-8 shrink-0 rounded-lg bg-mk-danger-soft sm:h-10 sm:w-10" />

                {/* Brand Name + Description */}
                <div className="min-w-0">
                  <div className="h-3 w-24 rounded bg-mk-border-admin sm:w-32" />

                  <div className="mt-1.5 h-2 w-36 rounded bg-mk-danger-soft sm:mt-2 sm:h-2.5 sm:w-56" />
                </div>
              </div>

              {/* Items */}
              <div className="h-7 w-14 shrink-0 rounded-lg bg-mk-surface sm:h-8 sm:w-20" />
            </div>

            {/* PRODUCT SHIMMER GRID */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 xl:gap-5">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-mk-border bg-mk-card shadow-[0_2px_10px_rgba(73,54,49,0.05)]">
                  {/* IMAGE SHIMMER */}
                  <div className="relative h-36 animate-pulse overflow-hidden bg-mk-bg sm:h-48 lg:h-52">
                    <div className="absolute inset-0 bg-linear-to-br from-mk-primary-soft via-mk-surface to-mk-primary-soft" />

                    <div className="absolute inset-x-3 bottom-3 top-6 flex items-center justify-center rounded-xl sm:inset-x-6 sm:bottom-6 sm:top-9">
                      <ShoppingBag size={25} strokeWidth={1.5} className="text-mk-border-admin" />
                    </div>
                  </div>

                  {/* DETAILS SHIMMER */}
                  <div className="border-t border-mk-surface bg-mk-card px-2.5 py-2.5 sm:space-y-3 sm:px-3 sm:py-3">
                    {/* Category */}
                    <div className="h-1.5 w-16 animate-pulse rounded bg-mk-border sm:h-2 sm:w-20" />

                    {/* Product Name */}
                    <div className="mt-2 space-y-1 sm:mt-3">
                      <div className="h-3 w-full animate-pulse rounded bg-mk-border-admin sm:h-3.5" />

                      <div className="h-3 w-4/5 animate-pulse rounded bg-mk-border-admin sm:h-3.5" />
                    </div>

                    {/* Rating */}
                    <div className="mt-2 h-4 w-9 animate-pulse rounded bg-mk-disabled-bg sm:mt-3 sm:h-5 sm:w-10" />

                    {/* Price */}
                    <div className="mt-2 flex items-center gap-1.5 sm:mt-3">
                      <div className="h-4 w-14 animate-pulse rounded bg-mk-border-admin sm:h-5 sm:w-16" />

                      <div className="h-2.5 w-10 animate-pulse rounded bg-mk-surface sm:h-3 sm:w-12" />

                      <div className="h-2.5 w-8 animate-pulse rounded bg-mk-disabled-bg sm:h-3 sm:w-10" />
                    </div>

                    {/* Bottom */}
                    <div className="mt-2 flex items-center justify-between border-t border-mk-surface pt-2 sm:mt-3 sm:pt-2.5">
                      <div className="h-2.5 w-11 animate-pulse rounded bg-mk-border-admin sm:h-3 sm:w-14" />

                      <div className="h-2.5 w-7 animate-pulse rounded bg-mk-border sm:h-3 sm:w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          /* EMPTY */
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-mk-border bg-mk-card px-4 text-center shadow-sm sm:min-h-105 sm:rounded-3xl sm:px-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-mk-primary-soft text-mk-primary-hover sm:h-16 sm:w-16 sm:rounded-2xl">
              <ShoppingBag size={27} strokeWidth={1.7} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-mk-ink sm:mt-5 sm:text-xl">No Products Found</h2>

            <p className="mt-1.5 max-w-xs text-[11px] leading-5 text-mk-muted sm:mt-2 sm:max-w-sm sm:text-sm sm:leading-6">There are currently no products available for this brand.</p>

            <Link
              to="/brand"
              className="mt-4 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-mk-primary-deep/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Browse Brands
            </Link>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 xl:gap-5">
            {products.map((product) => {
              const isDisabled = product.status === 'Inactive' || product.category?.status === 'Inactive' || Number(product.stock) <= 0

              const cardClass = isDisabled
                ? 'group relative overflow-hidden rounded-xl border border-mk-disabled-bg bg-mk-disabled-bg shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
                : 'group overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_2px_10px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-mk-border hover:shadow-[0_10px_25px_rgba(73,54,49,0.12)]'

              const imageClass = isDisabled ? 'relative z-10 h-full w-full object-contain grayscale opacity-60' : 'relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105'

              const nameClass = isDisabled
                ? 'mt-0.5 line-clamp-2 min-h-8 text-[11px] font-bold leading-4 text-mk-disabled sm:mt-1 sm:min-h-9 sm:text-[13px] sm:leading-4.5'
                : 'mt-0.5 line-clamp-2 min-h-8 text-[11px] font-bold leading-4 text-mk-ink transition-colors duration-200 group-hover:text-mk-primary-hover sm:mt-1 sm:min-h-9 sm:text-[13px] sm:leading-4.5'

              return isDisabled ? (
                <Link key={product._id} to={`/product/${product._id}`} className={cardClass}>
                  {/* IMAGE */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-white  p-2.5 sm:h-48 sm:p-3 lg:h-52">
                    {/* Disabled Badge */}
                    <span className="absolute right-2 top-2 z-20 rounded-md bg-mk-disabled-bg px-1.5 py-0.5 text-[7px] font-bold text-mk-disabled sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-1 sm:text-[9px]">
                      {product.status === 'Inactive' ? 'Inactive' : 'Out of Stock'}
                    </span>

                    {/* Discount */}
                    {product.discount > 0 && <span className="absolute left-2 top-2 z-20 rounded-md bg-mk-disabled-bg px-1.5 py-0.5 text-[7px] font-bold text-mk-disabled sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-1 sm:text-[9px]">{product.discount}% OFF</span>}

                    {/* Soft Background */}
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-mk-disabled-bg opacity-60 sm:-right-12 sm:-top-12 sm:h-28 sm:w-28" />

                    {/* Product Image */}
                    {product.images?.length > 0 ? (
                      <img src={getImageUrl(product.images[0])} alt={product.productName} className={imageClass} />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-1.5 text-mk-subtle sm:gap-2">
                        <ShoppingBag size={25} strokeWidth={1.5} />

                        <span className="text-[9px] sm:text-[10px]">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="border-t border-mk-disabled-bg bg-mk-disabled-bg px-2.5 py-2.5 sm:px-3 sm:py-3">
                    {/* CATEGORY */}
                    <p className="truncate text-[7px] font-semibold uppercase tracking-wider text-mk-subtle sm:text-[9px]">{product.category?.categoryName || 'Product'}</p>

                    {/* PRODUCT NAME */}
                    <h3 className={nameClass}>{product.productName}</h3>

                    {/* RATING */}
                    <div className="mt-1.5 flex items-center gap-1 sm:mt-2 sm:gap-1.5">
                      <span className="flex items-center gap-0.5 rounded bg-mk-disabled-bg px-1.5 py-0.5 text-[8px] font-bold text-mk-disabled sm:text-[9px]">
                        {product.rating || '0.0'}

                        <Star size={7} fill="currentColor" strokeWidth={2.5} />
                      </span>

                      {product.soldCount > 0 && <span className="truncate text-[8px] text-mk-subtle sm:text-[9px]">{product.soldCount}+ sold</span>}
                    </div>

                    {/* PRICE */}
                    <div className="mt-1.5 flex items-baseline gap-1 sm:mt-2 sm:gap-1.5">
                      <span className="text-sm font-extrabold text-mk-disabled sm:text-base">₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                      {product.price > product.discountPrice && (
                        <>
                          <span className="text-[8px] text-mk-disabled line-through sm:text-[10px]">₹{product.price?.toLocaleString('en-IN')}</span>

                          <span className="text-[8px] font-bold text-mk-disabled sm:text-[9px]">{product.discount}% off</span>
                        </>
                      )}
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-2 flex items-center justify-between border-t border-mk-disabled-bg pt-2 sm:mt-2.5 sm:pt-2.5">
                      {/* STOCK */}
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-mk-subtle" />

                        <span className="text-[8px] font-semibold text-mk-disabled sm:text-[9px]">{product.status === 'Inactive' ? 'Unavailable' : 'Out of Stock'}</span>
                      </div>

                      {/* DISABLED VIEW */}
                      <span className="flex items-center gap-0.5 text-[8px] font-bold text-mk-disabled sm:text-[9px]">
                        View
                        <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link key={product._id} to={`/product/${product._id}`} className={cardClass}>
                  {/* IMAGE */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-white p-2.5 sm:h-48 sm:p-3 lg:h-52">
                    {/* DISCOUNT */}
                    {product.discount > 0 && (
                      <span className="absolute left-2 top-2 z-20 rounded-md bg-mk-primary px-1.5 py-0.5 text-[7px] font-bold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-1 sm:text-[9px]">{product.discount}% OFF</span>
                    )}

                    {/* STOCK */}
                    {product.stock <= 0 ? (
                      <span className="absolute right-2 top-2 z-20 rounded-md bg-mk-bg px-1.5 py-0.5 text-[7px] font-bold text-mk-primary sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-1 sm:text-[9px]">Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="absolute right-2 top-2 z-20 rounded-md bg-mk-bg px-1.5 py-0.5 text-[7px] font-bold text-mk-accent sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-1 sm:text-[9px]">Only {product.stock} left</span>
                    ) : null}

                    {/* SOFT BACKGROUND */}
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-mk-primary-soft opacity-60 transition-transform duration-500 group-hover:scale-150 sm:-right-12 sm:-top-12 sm:h-28 sm:w-28" />

                    {/* PRODUCT IMAGE */}
                    {product.images?.length > 0 ? (
                      <img src={getImageUrl(product.images[0])} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-1.5 text-mk-muted sm:gap-2">
                        <ShoppingBag size={25} strokeWidth={1.5} />

                        <span className="text-[9px] sm:text-[10px]">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="border-t border-mk-surface bg-mk-card px-2.5 py-2.5 sm:px-3 sm:py-3">
                    {/* CATEGORY */}
                    <p className="truncate text-[7px] font-semibold uppercase tracking-wider text-mk-muted sm:text-[9px]">{product.category?.categoryName || 'Product'}</p>

                    {/* PRODUCT NAME */}
                    <h3 className={nameClass}>{product.productName}</h3>

                    {/* RATING */}
                    <div className="mt-1.5 flex items-center gap-1 sm:mt-2 sm:gap-1.5">
                      <span className="flex items-center gap-0.5 rounded bg-mk-success px-1.5 py-0.5 text-[8px] font-bold text-white sm:text-[9px]">
                        {product.rating || '0.0'}

                        <Star size={7} fill="currentColor" strokeWidth={2.5} />
                      </span>

                      {product.soldCount > 0 && <span className="truncate text-[8px] text-mk-muted sm:text-[9px]">{product.soldCount}+ sold</span>}
                    </div>

                    {/* PRICE */}
                    <div className="mt-1.5 flex items-baseline gap-1 sm:mt-2 sm:gap-1.5">
                      <span className="text-sm font-extrabold text-mk-ink sm:text-base">₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                      {product.price > product.discountPrice && (
                        <>
                          <span className="text-[8px] text-mk-muted line-through sm:text-[10px]">₹{product.price?.toLocaleString('en-IN')}</span>

                          <span className="text-[8px] font-bold text-mk-success sm:text-[9px]">{product.discount}% off</span>
                        </>
                      )}
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-2 flex items-center justify-between border-t border-mk-surface pt-2 sm:mt-2.5 sm:pt-2.5">
                      {/* STOCK */}
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-mk-success' : 'bg-mk-primary'}`} />

                        <span className={`text-[8px] font-semibold sm:text-[9px] ${product.stock > 0 ? 'text-mk-success' : 'text-mk-primary'}`}>{product.stock > 0 ? 'In Stock' : 'Unavailable'}</span>
                      </div>

                      {/* VIEW */}
                      <span className="flex items-center gap-0.5 text-[8px] font-bold text-mk-primary-hover transition-all duration-300 group-hover:gap-1 sm:text-[9px]">
                        View
                        <ChevronRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, ShoppingBag, ChevronRight, Package, SlidersHorizontal, Check } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { iconMap } from '../data/iconMap'
import BreadCrumb from './BreadCrumb'

export default function CategoryProducts() {
  const { id } = useParams()

  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  const getCategoryProducts = async () => {
    try {
      setLoading(true)

      const [productRes, categoryRes] = await Promise.all([axiosInstance.get(`/product/category/${id}`), axiosInstance.get(`/category/${id}`)])

      const productsData = productRes.data?.data || []
      const categoryData = categoryRes.data?.data || null

      setProducts(productsData)
      setAllProducts(productsData)
      setCategory(categoryData)

      if (categoryData) {
        document.title = `${categoryData.categoryName} | MineKart`
      }
    } catch (error) {
      console.error('Get category products error:', error.response?.data || error.message)

      setProducts([])
      setAllProducts([])
      setCategory(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    setSelectedSubCategory('')
    getCategoryProducts()
  }, [id])

  const Icon = category ? iconMap[category.categoryLucideIcons] : null

  const uniqueNames = useMemo(() => {
    return [...new Set(allProducts.map((item) => item.subCategory?.subCategoryName).filter(Boolean))]
  }, [allProducts])

  const filterBySubCategory = async (subCategoryName) => {
    try {
      setSelectedSubCategory(subCategoryName)
      setLoading(true)

      if (subCategoryName === '') {
        setProducts(allProducts)
        setLoading(false)
        return
      }

      const res = await axiosInstance.get(`/product/category/${id}/subcategory/${encodeURIComponent(subCategoryName)}`)

      setProducts(res.data?.data || [])
    } catch (error) {
      console.error('Filter subcategory error:', error.response?.data || error.message)

      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (image) => {
    if (!image) return ''

    return image.startsWith('http') ? image : `http://localhost:3000${image}`
  }

  const items = [
    {
      title: 'Categories',
      link: '/category',
    },
    {
      title: category?.categoryName || '',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4">
        {/* CATEGORY HEADER */}
        {!loading && category && (
          <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

                {Icon && <Icon size={18} strokeWidth={1.8} className="relative z-10" />}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">{category.categoryName} Products</h1>

                <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Explore products in this category</p>
              </div>
            </div>

            <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 text-[8px] font-bold text-[#67544D] sm:px-2.5 sm:text-[9px]">
              <ShoppingBag size={12} strokeWidth={2} className="text-[#8E181F]" />

              <span>
                {products.length} {products.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        )}

        {/* SUBCATEGORY FILTER */}
        {!loading && uniqueNames.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-[#8E181F]" />

              <span className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Shop By</span>
            </div>

            <div className="no-scrollbar overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
                {/* ALL */}
                <button
                  type="button"
                  onClick={() => filterBySubCategory('')}
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[10px] font-bold transition-all duration-200 active:scale-95 sm:text-[11px] ${
                    selectedSubCategory === ''
                      ? 'bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.18)]'
                      : 'border border-[#E2D5CC] bg-white text-[#67544D] hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]'
                  }`}
                >
                  {selectedSubCategory === '' && <Check size={12} strokeWidth={2.5} />}

                  <span>All</span>

                  <span className={`rounded-md px-1.5 py-0.5 text-[8px] ${selectedSubCategory === '' ? 'bg-white/15' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>{allProducts.length}</span>
                </button>

                {/* SUBCATEGORIES */}
                {uniqueNames.map((name) => {
                  const active = selectedSubCategory === name

                  const count = allProducts.filter((product) => product.subCategory?.subCategoryName === name).length

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => filterBySubCategory(name)}
                      className={`group flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[10px] font-semibold transition-all duration-200 active:scale-95 sm:text-[11px] ${
                        active ? 'bg-[#8E181F] text-white shadow-[0_4px_12px_rgba(142,24,31,0.16)]' : 'border border-[#E2D5CC] bg-white text-[#67544D] hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]'
                      }`}
                    >
                      {active && <Check size={12} strokeWidth={2.5} />}

                      <span>{name}</span>

                      <span className={`rounded-md px-1.5 py-0.5 text-[8px] ${active ? 'bg-white/15 text-white' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.04)]">
                <div className="aspect-square animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2]" />

                <div className="space-y-3 border-t border-[#EEE5DF] bg-[#FFFCFA] p-3">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#E8DDD4]" />

                  <div className="h-3.5 w-full animate-pulse rounded bg-[#EEE5DF]" />

                  <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#EEE5DF]" />

                  <div className="flex gap-2">
                    <div className="h-4 w-10 animate-pulse rounded bg-[#E5EEE8]" />
                    <div className="h-3 w-14 animate-pulse rounded bg-[#EEE5DF]" />
                  </div>

                  <div className="h-5 w-20 animate-pulse rounded bg-[#F2DDD5]" />

                  <div className="flex justify-between border-t border-[#EEE5DF] pt-2.5">
                    <div className="h-3 w-16 animate-pulse rounded bg-[#EEE5DF]" />
                    <div className="h-3 w-10 animate-pulse rounded bg-[#F2DDD5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* EMPTY */
          <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-white px-5 text-center shadow-[0_2px_10px_rgba(73,54,49,0.03)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <Package size={28} strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">No Products Found</h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#806C63]">{selectedSubCategory ? `No products found in ${selectedSubCategory}.` : `There are currently no products available in this category.`}</p>

            {selectedSubCategory ? (
              <button
                type="button"
                onClick={() => filterBySubCategory('')}
                className="mt-4 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
              >
                View All Products
              </button>
            ) : (
              <Link to="/category" className="mt-4 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                Browse Categories
              </Link>
            )}
          </div>
        ) : (
          /* PRODUCTS */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {products.map((product) => {
              const isInactive = product.status === 'Inactive'
              const isOutOfStock = product.stock <= 0
              const isDisabled = isInactive || isOutOfStock

              const isLowStock = !isDisabled && product.stock > 0 && product.stock <= 5

              const productCard = (
                <>
                  {/* IMAGE */}
                  <div className={`relative flex aspect-square items-center justify-center overflow-hidden p-3 ${isDisabled ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
                    {/* Decorative */}
                    {!isDisabled && <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F7EEE7] opacity-70 transition-transform duration-500 group-hover:scale-150" />}

                    {/* DISCOUNT */}
                    {!isDisabled && product.discount > 0 && (
                      <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-linear-to-r from-[#7D171C] to-[#A51D26] px-2 py-1 text-[8px] font-extrabold text-white shadow-sm sm:text-[9px]">{product.discount}% OFF</span>
                    )}

                    {/* STATUS */}
                    {isInactive ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#E5E5E5] px-2 py-1 text-[8px] font-bold text-[#888888] sm:text-[9px]">Inactive</span>
                    ) : isOutOfStock ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#E5E5E5] px-2 py-1 text-[8px] font-bold text-[#888888] sm:text-[9px]">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF7EA] px-2 py-1 text-[8px] font-bold text-[#B87935] sm:text-[9px]">Only {product.stock} left</span>
                    ) : null}

                    {/* IMAGE */}
                    {product.images?.length > 0 ? (
                      <img src={getImageUrl(product.images[0])} alt={product.productName} className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-40' : 'transition-transform duration-500 group-hover:scale-105'}`} />
                    ) : (
                      <div className={`relative z-10 flex flex-col items-center gap-1.5 ${isDisabled ? 'text-[#999999]' : 'text-[#A28E85]'}`}>
                        <ShoppingBag size={26} strokeWidth={1.5} />

                        <span className="text-[9px]">No Image</span>
                      </div>
                    )}

                    {/* Bottom Glow */}
                    {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-t from-[#351C18]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
                  </div>

                  {/* DETAILS */}
                  <div className={`flex flex-1 flex-col border-t px-3 py-3 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#EEE5DF] bg-[#FFFCFA] transition-colors duration-300 group-hover:bg-[#FBF5F1]'}`}>
                    {/* CATEGORY */}
                    <p className={`truncate text-[8px] font-bold uppercase tracking-wider sm:text-[9px] ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product.category?.categoryName || 'Product'}</p>

                    {/* NAME */}
                    <h3 className={`mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4.5 sm:text-[13px] ${isDisabled ? 'text-[#777777]' : 'text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F]'}`}>{product.productName}</h3>

                    {/* RATING */}
                    <div className="mt-2 flex min-h-5 items-center gap-1.5">
                      <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold ${isDisabled ? 'bg-[#E5E5E5] text-[#888888]' : 'bg-[#3E8B62] text-white'}`}>
                        {product.rating || '0.0'}

                        <Star size={8} fill="currentColor" strokeWidth={2.5} />
                      </span>

                      {product.soldCount > 0 && <span className={`truncate text-[9px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>}
                    </div>

                    {/* PRICE */}
                    <div className="mt-2.5 flex min-h-6 flex-wrap items-baseline gap-1.5">
                      <span className={`text-base font-extrabold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                      {product.price > product.discountPrice && (
                        <>
                          <span className={`text-[9px] line-through ${isDisabled ? 'text-[#AAAAAA]' : 'text-[#9A857B]'}`}>₹{product.price?.toLocaleString('en-IN')}</span>

                          {!isDisabled && <span className="text-[9px] font-bold text-[#3E8B62]">{product.discount}% off</span>}
                        </>
                      )}
                    </div>

                    {/* BOTTOM */}
                    <div className={`mt-auto flex min-h-7 items-center justify-between border-t pt-2.5 ${isDisabled ? 'border-[#D9D9D9]' : 'border-[#EEE5DF]'}`}>
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${isDisabled ? 'bg-[#999999]' : isLowStock ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                        <span className={`text-[8px] font-semibold sm:text-[9px] ${isDisabled ? 'text-[#888888]' : isLowStock ? 'text-[#B87935]' : 'text-[#3E8B62]'}`}>
                          {isInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                        </span>
                      </div>

                      {!isDisabled && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1">
                          View
                          <ChevronRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )

              return isDisabled ? (
                <div key={product._id} aria-disabled="true" className="group flex min-h-88 cursor-not-allowed flex-col overflow-hidden rounded-2xl border border-[#D9D9D9] bg-[#F3F3F3] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  {productCard}
                </div>
              ) : (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group flex min-h-88 flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_12px_28px_rgba(73,54,49,0.12)]"
                >
                  {productCard}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

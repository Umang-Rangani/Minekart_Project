import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, ShoppingBag, ChevronRight, Package, SlidersHorizontal, Check } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
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

  const uniqueNames = [...new Set(allProducts.map((product) => product.subCategory?.subCategoryName).filter(Boolean))]

  const filterBySubCategory = async (subCategoryName) => {
    try {
      setSelectedSubCategory(subCategoryName)
      setLoading(true)

      const url = subCategoryName ? `/product/category/${id}/subcategory/${encodeURIComponent(subCategoryName)}` : `/product/category/${id}`

      const res = await axiosInstance.get(url)

      setProducts(res.data?.data || [])
    } catch (error) {
      console.error('Filter error:', error.response?.data || error.message)

      setProducts([])
    } finally {
      setLoading(false)
    }
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
    <div className="pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-4 sm:pt-5">
        {!loading && category && (
          <div className="mb-4 flex min-h-14 items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-2.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:min-h-17 sm:gap-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7EEE7] text-[#8E181F] shadow-[0_3px_10px_rgba(73,54,49,0.06)] sm:h-10 sm:w-10">
                {category.categoryImage ? <img src={getImageUrl(category.categoryImage)} alt={category.categoryName} className="h-full w-full object-contain" /> : <Package size={18} strokeWidth={1.8} />}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[11px] font-extrabold tracking-tight text-[#351C18] sm:text-sm">{category.categoryName} Products</h1>

                <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Explore products in this category</p>
              </div>
            </div>

            <div className="flex h-7 shrink-0 items-center gap-1 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-1.5 text-[8px] font-bold text-[#67544D] sm:h-8 sm:gap-1.5 sm:px-2.5 sm:text-[9px]">
              <ShoppingBag size={12} strokeWidth={2} className="text-[#8E181F]" />

              <span>
                {products.length} {products.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        )}

        {!loading && uniqueNames.length > 0 && (
          <div className="mb-4 sm:mb-5">
            <div className="mb-2 flex items-center gap-1.5">
              <SlidersHorizontal size={13} strokeWidth={2} className="text-[#8E181F]" />

              <span className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Shop By</span>
            </div>

            <div className="no-scrollbar overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => filterBySubCategory('')}
                  className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold transition-all duration-200 active:scale-95 sm:h-9 sm:rounded-xl sm:px-3 sm:text-[11px] ${
                    selectedSubCategory === ''
                      ? 'bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.18)]'
                      : 'border border-[#E2D5CC] bg-white text-[#67544D] hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]'
                  }`}
                >
                  {selectedSubCategory === '' && <Check size={12} strokeWidth={2.5} />}

                  <span>All</span>

                  <span className={`rounded-md px-1.5 py-0.5 text-[8px] ${selectedSubCategory === '' ? 'bg-white/15' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>{allProducts.length}</span>
                </button>

                {uniqueNames.map((name) => {
                  const active = selectedSubCategory === name

                  const count = allProducts.reduce((total, product) => {
                    return product.subCategory?.subCategoryName === name ? total + 1 : total
                  }, 0)

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => filterBySubCategory(name)}
                      className={`group flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-semibold transition-all duration-200 active:scale-95 sm:h-9 sm:rounded-xl sm:px-3 sm:text-[11px] ${
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

        {loading ? (
          <div className="animate-pulse space-y-5">
            <div className="flex min-h-14 items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-2.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:min-h-17 sm:gap-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-[#F0E5DE] sm:h-10 sm:w-10" />

                <div className="min-w-0 space-y-2">
                  <div className="h-3.5 w-32 rounded-md bg-[#E3D8D1] sm:w-36" />
                  <div className="h-2.5 w-40 rounded-md bg-[#EEE5DF] sm:w-52" />
                </div>
              </div>

              <div className="flex h-7 w-16 shrink-0 items-center justify-center gap-1 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] sm:h-8 sm:w-22 sm:gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#DCCDC5]" />
                <div className="h-2.5 w-8 rounded bg-[#E3D8D1]" />
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 rounded bg-[#E3D8D1]" />
                <div className="h-2.5 w-14 rounded bg-[#E3D8D1]" />
              </div>

              <div className="no-scrollbar overflow-hidden pb-1">
                <div className="flex min-w-max items-center gap-1.5 sm:gap-2">
                  <div className="flex h-8 w-20 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#F0E7E1] px-2.5 sm:h-9 sm:rounded-xl sm:px-3">
                    <div className="h-2.5 w-7 rounded bg-[#DCCDC5]" />
                    <div className="h-4 w-5 rounded-md bg-[#E3D8D1]" />
                  </div>

                  <div className="flex h-8 w-32 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-white px-2.5 sm:h-9 sm:rounded-xl sm:px-3">
                    <div className="h-2.5 w-16 rounded bg-[#E3D8D1]" />
                    <div className="h-4 w-5 rounded-md bg-[#F0E7E1]" />
                  </div>

                  <div className="flex h-8 w-36 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-white px-2.5 sm:h-9 sm:rounded-xl sm:px-3">
                    <div className="h-2.5 w-20 rounded bg-[#E3D8D1]" />
                    <div className="h-4 w-5 rounded-md bg-[#F0E7E1]" />
                  </div>

                  <div className="flex h-8 w-28 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-white px-2.5 sm:h-9 sm:rounded-xl sm:px-3">
                    <div className="h-2.5 w-14 rounded bg-[#E3D8D1]" />
                    <div className="h-4 w-5 rounded-md bg-[#F0E7E1]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.04)] sm:min-h-90 sm:rounded-2xl">
                  <div className="aspect-square shrink-0 bg-[#F3EAE4]" />

                  <div className="flex flex-1 flex-col space-y-3 border-t border-[#EEE5DF] bg-[#FFFCFA] p-2.5 sm:p-3">
                    <div className="h-2.5 w-14 rounded bg-[#E3D8D1]" />

                    <div className="space-y-1.5">
                      <div className="h-3.5 w-full rounded bg-[#E5DDD7]" />
                      <div className="h-3.5 w-4/5 rounded bg-[#E5DDD7]" />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-5 w-9 rounded bg-[#DDE8DF]" />
                      <div className="h-3 w-12 rounded bg-[#E8DDD4]" />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-5 w-20 rounded bg-[#E5D3CD]" />
                      <div className="h-3 w-12 rounded bg-[#E8DDD4]" />
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-[#EEE5DF] pt-2.5">
                      <div className="h-3 w-16 rounded bg-[#E8DDD4]" />
                      <div className="h-3 w-10 rounded bg-[#E5D3CD]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-white px-5 text-center shadow-[0_2px_10px_rgba(73,54,49,0.03)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <Package size={28} strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">No Products Found</h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#806C63]">{selectedSubCategory ? `No products found in ${selectedSubCategory}.` : 'There are currently no products available in this category.'}</p>

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
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {products.map((product) => {
              const isCategoryInactive = category?.status === 'Inactive'
              const isInactive = product.status === 'Inactive' || isCategoryInactive
              const isOutOfStock = product.stock <= 0
              const isDisabled = isInactive || isOutOfStock
              const isLowStock = !isDisabled && product.stock > 0 && product.stock <= 5

              const productCard = (
                <>
                  <div className={`relative flex aspect-square shrink-0 items-center justify-center overflow-hidden p-2 sm:p-3 ${isDisabled ? 'bg-[#F3F3F3]' : 'bg-white'}`}>
                    {!isDisabled && <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F7EEE7] opacity-70 transition-transform duration-500 group-hover:scale-150" />}
                    {/* {Number(product.discount) > 0 && (
                      <span
                        className={`absolute left-2 top-2 z-20 rounded-md border px-1.5 py-1 text-[7px] font-extrabold shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:text-[9px] ${
                          isDisabled ? 'border-[#D6CCC6] bg-[#E9E2DD] text-[#796B64]' : 'border-[#E8DDD4] bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white'
                        }`}
                      >
                        {product.discount}% OFF
                      </span>
                    )} */}

                    {product.discount > 0 && (
                      <span
                        className={`absolute left-1.5 top-1.5 z-20 rounded-md px-1.5 py-0.5 text-[6.5px] font-extrabold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px] ${
                          isDisabled ? 'bg-linear-to-r from-[#737373] to-[#A3A3A3]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26]'
                        }`}
                      >
                        {product.discount}% OFF
                      </span>
                    )}

                    {isDisabled && (
                      <span className="absolute right-2 top-2 z-20 max-w-[65%] rounded-md border border-[#DED3CD] bg-[#E9E2DD] px-1.5 py-1 text-right text-[7px] font-extrabold leading-3 text-[#695750] sm:right-2.5 sm:top-2.5 sm:px-2 sm:text-[9px]">
                        {isInactive ? 'Currently Unavailable' : 'Out of Stock'}
                      </span>
                    )}

                    {product.images?.length > 0 ? (
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.productName}
                        className={`relative z-10 h-full w-full bg-white object-contain transition-all duration-300 ${isDisabled ? 'scale-95 opacity-50 grayscale' : 'group-hover:scale-105'}`}
                      />
                    ) : (
                      <div className={`relative z-10 flex flex-col items-center gap-1.5 ${isDisabled ? 'text-[#999999]' : 'text-[#A28E85]'}`}>
                        <ShoppingBag size={26} strokeWidth={1.5} />
                        <span className="text-[9px]">No Image</span>
                      </div>
                    )}

                    {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-t from-[#351C18]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
                  </div>

                  <div className={`flex flex-1 flex-col border-t px-2 py-2.5 sm:px-3 sm:py-3 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#EEE5DF] bg-[#FFFCFA] transition-colors duration-300 group-hover:bg-[#FBF5F1]'}`}>
                    <p className={`truncate text-[7px] font-bold uppercase tracking-wider sm:text-[9px] ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product.category?.categoryName || 'Product'}</p>

                    <h3 className={`mt-1 line-clamp-2 min-h-8 text-[11px] font-bold leading-4 sm:min-h-9 sm:text-[13px] sm:leading-4.5 ${isDisabled ? 'text-[#777777]' : 'text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F]'}`}>
                      {product.productName}
                    </h3>

                    <div className="mt-1.5 flex min-h-5 items-center gap-1 sm:mt-2 sm:gap-1.5">
                      <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[8px] font-bold sm:px-1.5 ${isDisabled ? 'bg-[#E5E5E5] text-[#888888]' : 'bg-[#3E8B62] text-white'}`}>
                        {product.rating || '0.0'}
                        <Star size={8} fill="currentColor" strokeWidth={2.5} />
                      </span>

                      {product.soldCount > 0 && <span className={`truncate text-[8px] sm:text-[9px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>}
                    </div>
                    <div className="mt-2 flex min-h-6 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:mt-2.5">
                      <span className={`text-sm font-extrabold sm:text-base ${isDisabled ? 'text-[#8D817A]' : 'text-[#351C18]'}`}>₹{Number(product.discountPrice ?? product.price ?? 0).toLocaleString('en-IN')}</span>

                      {Number(product.price) > Number(product.discountPrice) && (
                        <>
                          <span className={`text-[8px] line-through sm:text-[9px] ${isDisabled ? 'text-[#B2A7A0]' : 'text-[#9A857B]'}`}>₹{Number(product.price).toLocaleString('en-IN')}</span>

                          {Number(product.discount) > 0 && <span className={`text-[8px] font-bold sm:text-[9px] ${isDisabled ? 'text-[#A69A93]' : 'text-[#3E8B62]'}`}>{product.discount}% off</span>}
                        </>
                      )}
                    </div>

                    <div className={`mt-auto flex min-h-7 items-center justify-between gap-1 border-t pt-2 sm:pt-2.5 ${isDisabled ? 'border-[#E6DDD7]' : 'border-[#EEE5DF]'}`}>
                      <div className="flex min-w-0 items-center gap-1">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isDisabled ? 'bg-[#999]' : isLowStock ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                        <span className={`truncate text-[7px] font-semibold sm:text-[9px] ${isDisabled ? 'text-[#888]' : isLowStock ? 'text-[#B87935]' : 'text-[#3E8B62]'}`}>
                          {isInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                        </span>
                      </div>

                      <span className={`flex shrink-0 items-center gap-0.5 text-[8px] font-bold transition-all duration-300 sm:text-[9px] ${isDisabled ? 'text-[#999]' : 'text-[#8E181F] group-hover:gap-1'}`}>
                        View
                        <ChevronRight size={11} strokeWidth={2.5} className={`transition-transform duration-300 ${isDisabled ? '' : 'group-hover:translate-x-0.5'}`} />
                      </span>
                    </div>
                  </div>
                </>
              )

              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className={`group flex min-h-0 flex-col overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 sm:min-h-90 sm:rounded-2xl ${
                    isDisabled ? 'border border-[#E6DDD7] bg-[#F8F5F2] shadow-[0_2px_8px_rgba(73,54,49,0.03)]' : 'border border-[#E8DDD4] bg-white hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_12px_28px_rgba(73,54,49,0.12)]'
                  }`}
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

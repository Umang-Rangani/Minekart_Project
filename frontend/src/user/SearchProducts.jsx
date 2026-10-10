import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { PackageSearch, Search, ChevronRight, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'

export default function SearchProducts() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const searchQuery = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const items = [
    { title: 'Products', link: '/products' },
    { title: 'Search', link: null },
  ]

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)

        const query = searchQuery.trim()

        if (!query) {
          setProducts([])
          return
        }

        const res = await axiosInstance.get('/product/search', {
          params: { q: query },
        })

        setProducts(res.data?.data || [])
      } catch (error) {
        console.log('Search Products Error:', error.response?.data || error.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    document.title = `Search ${searchQuery ? `"${searchQuery}"` : ''} | MineKart`

    getProducts()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [searchQuery])

  return (
    <div className="pb-10">
      <BreadCrumb items={items} />

      <main className="mx-auto w-full pt-5">
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />
              <Search size={18} strokeWidth={2} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Search Results</h1>
              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">{searchQuery ? `Products matching "${searchQuery}"` : 'Search products, brands and categories'}</p>
            </div>
          </div>

          {!loading && (
            <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 sm:px-2.5">
              <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[#A51D26] px-1 text-[8px] font-extrabold text-white">{products.length}</span>
              <span className="hidden text-[9px] font-bold text-[#67544D] sm:inline">{products.length === 1 ? 'Product' : 'Products'}</span>
              <span className="text-[8px] font-bold text-[#67544D] sm:hidden">Items</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="flex min-h-88 flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.04)]">
                <div className="relative h-44 shrink-0 overflow-hidden bg-[#F7EEE7] sm:h-48 lg:h-52">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col border-t border-[#EEE5DF] bg-[#FFFCFA] p-3">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-3.5 w-full animate-pulse rounded bg-[#EEE5DF]" />
                    <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#EEE5DF]" />
                  </div>
                  <div className="mt-3 flex min-h-5 items-center gap-2">
                    <div className="h-4 w-9 animate-pulse rounded bg-[#E5EEE8]" />
                    <div className="h-2.5 w-14 animate-pulse rounded bg-[#EEE5DF]" />
                  </div>
                  <div className="mt-3 h-5 w-20 animate-pulse rounded bg-[#F2DDD5]" />
                  <div className="mt-auto flex items-center justify-between border-t border-[#EEE5DF] pt-2.5">
                    <div className="h-2.5 w-14 animate-pulse rounded bg-[#EEE5DF]" />
                    <div className="h-2.5 w-9 animate-pulse rounded bg-[#F2DDD5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <section className="relative flex min-h-90 flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white px-5 text-center shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
            <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#F7EEE7]" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-[#F7EEE7]" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-[#F7EEE7] to-[#F2DDD5] text-[#8E181F] shadow-sm">
              <PackageSearch size={36} strokeWidth={1.4} />
            </div>

            <h2 className="relative mt-5 text-xl font-extrabold tracking-tight text-[#351C18]">No products found</h2>

            <p className="relative mt-2 max-w-md text-xs leading-5 text-[#806C63]">
              {searchQuery ? (
                <>
                  We couldn't find anything matching <span className="font-bold text-[#67544D]">"{searchQuery}"</span>. Try searching for another product, brand or category.
                </>
              ) : (
                'Search for products, brands, categories or subcategories.'
              )}
            </p>

            <div className="relative mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-xs font-bold text-white shadow-[0_6px_18px_rgba(125,23,28,0.17)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(125,23,28,0.22)]"
              >
                <ShoppingBag size={14} />
                Continue Shopping
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFCFA] px-5 py-2.5 text-xs font-bold text-[#67544D] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F7EEE7]"
              >
                <ArrowLeft size={14} />
                Go Back
              </button>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {products.map((product) => {
              // / variable logic
              const isProductInactive = product.status?.toLowerCase() === 'inactive'

              const isCategoryInactive = product.category?.status?.toLowerCase() === 'inactive'

              const stock = Number(product.stock ?? 0)
              const isOutOfStock = stock <= 0

              const isInactive = isProductInactive || isCategoryInactive
              const isDisabled = isInactive || isOutOfStock
              const isLowStock = !isDisabled && stock <= 5

              const price = Number(product.price || 0)
              const discountPrice = Number(product.discountPrice || 0)

              const displayPrice = discountPrice > 0 && discountPrice < price ? discountPrice : price

              const hasDiscount = Number(product.discount) > 0 && discountPrice > 0 && discountPrice < price

              return (
                <div
                  key={product._id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/product/${product._id}`)
                    }
                  }}
                  aria-label={`${product.productName}, ${isInactive ? 'Currently Unavailable' : isOutOfStock ? 'Out of Stock' : 'View product'}`}
                  className={`group relative flex min-h-88 cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
                    isDisabled
                      ? 'border-[#E6DDD7] bg-[#F8F5F2] shadow-[0_2px_8px_rgba(73,54,49,0.03)]'
                      : 'border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.05)] hover:-translate-y-1 hover:border-[#D5BFB5] hover:shadow-[0_12px_28px_rgba(73,54,49,0.12)]'
                  }`}
                >
                  <div className={`relative flex h-44 shrink-0 items-center justify-center overflow-hidden p-3 sm:h-48 lg:h-52 ${isDisabled ? 'bg-[#F2EFEC]' : 'bg-white'}`}>
                    {/* {hasDiscount && (
                      <span className={`absolute left-2.5 top-2.5 z-20 rounded-md px-2 py-1 text-[8px] font-extrabold shadow-sm sm:text-[9px] ${isDisabled ? 'bg-[#D8CECA] text-[#6E625D]' : 'bg-[#A51D26] text-white'}`}>{product.discount}% OFF</span>
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

                    {/* {isDisabled ? (
                      <span className="absolute right-2.5 top-2.5 z-20 max-w-[65%] rounded-md border border-[#DED3CD] bg-[#E9E2DD] px-2 py-1 text-right text-[8px] font-extrabold leading-3 text-[#695750] sm:text-[9px]">{disabledMessage}</span>
                    ) : product.stock <= 5 ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF7EA] px-2 py-1 text-[8px] font-bold text-[#B87935] sm:text-[9px]">Only {product.stock} left</span>
                    ) : null} */}

                    {isInactive || isCategoryInactive ? (
                      <span className="absolute right-1.5 top-1.5 z-20 rounded-md border border-[#E8DDD4] bg-[#F7EEE7] px-1.5 py-0.5 text-[6.5px] font-bold text-[#8E181F] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">
                        Currently Unavailable
                      </span>
                    ) : isOutOfStock ? (
                      <span className="absolute right-1.5 top-1.5 z-20 rounded-md border border-[#E8DDD4] bg-[#F7EEE7] px-1.5 py-0.5 text-[6.5px] font-bold text-[#8E181F] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-[#FFF5E7] px-1.5 py-0.5 text-[6.5px] font-bold text-[#B87935] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Only {stock} left</span>
                    ) : null}

                    <div className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full transition-transform duration-500 ${isDisabled ? 'bg-white opacity-50' : 'bg-[#F7EEE7]   opacity-70 group-hover:scale-150'}`} />

                    {product.images?.[0] ? (
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.productName}
                        className={`relative z-10 h-full w-full object-contain p-2 transition-all duration-300 bg-white ${isDisabled ? 'scale-95 opacity-50 grayscale-35' : 'group-hover:scale-105'}`}
                      />
                    ) : (
                      <div className={`relative z-10 flex flex-col items-center gap-1.5 ${isDisabled ? 'text-[#B7ACA6]' : 'text-[#B7A49B]'}`}>
                        <PackageSearch size={27} strokeWidth={1.4} />
                        <span className="text-[9px] font-semibold">No Image</span>
                      </div>
                    )}

                    {/* <div
                      className={`absolute bottom-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg shadow-[0_4px_12px_rgba(73,54,49,0.15)] transition-all duration-300 ${
                        isDisabled ? 'bg-[#E5DDD8] text-[#76665F]' : 'bg-white text-[#8E181F] opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </div> */}
                  </div>

                  <div className={`flex flex-1 flex-col border-t px-3 py-3 ${isDisabled ? 'border-[#E6DDD7] bg-[#F8F5F2]' : 'border-[#EEE5DF] bg-[#FFFCFA]'}`}>
                    <p className={`truncate text-[9px] font-bold uppercase tracking-[0.12em] ${isDisabled ? 'text-[#A69A93]' : 'text-[#9A857B]'}`}>{product.category?.categoryName || 'Product'}</p>

                    <h3 className={`mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4.5 transition-colors duration-200 sm:text-[13px] ${isDisabled ? 'text-[#8D817A]' : 'text-[#351C18] group-hover:text-[#8E181F]'}`}>{product.productName}</h3>

                    <div className="mt-2 flex min-h-5 items-center gap-1.5">
                      <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold ${isDisabled ? 'bg-[#DDD7D2] text-[#7A706A]' : 'bg-[#3E8B62] text-white'}`}>
                        {Number(product.rating || 0).toFixed(1)}
                        <span className="text-[8px]">★</span>
                      </span>

                      {product.soldCount > 0 && <span className={`truncate text-[9px] ${isDisabled ? 'text-[#A69A93]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>}
                    </div>

                    <div className="mt-2.5 flex min-h-6 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                      <span className={`text-base font-extrabold ${isDisabled ? 'text-[#8D817A]' : 'text-[#351C18]'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>

                      {hasDiscount && (
                        <>
                          <span className={`text-[9px] line-through ${isDisabled ? 'text-[#B2A7A0]' : 'text-[#9A857B]'}`}>₹{Number(product.price).toLocaleString('en-IN')}</span>

                          <span className={`text-[9px] font-bold ${isDisabled ? 'text-[#A69A93]' : 'text-[#3E8B62]'}`}>{product.discount}% off</span>
                        </>
                      )}
                    </div>

                    <div className={`mt-auto flex min-h-8 items-center justify-between border-t pt-2.5 ${isDisabled ? 'border-[#E6DDD7]' : 'border-[#EEE5DF]'}`}>
                      <div className="flex min-w-0 items-center gap-1">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isDisabled ? 'bg-[#999]' : 'bg-[#3E8B62]'}`} />

                        <span className={`truncate text-[9px] font-semibold ${isDisabled ? 'text-[#888]' : 'text-[#3E8B62]'}`}>{isInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}</span>
                      </div>

                      <span className={`flex shrink-0 items-center gap-0.5 text-[9px] font-bold transition-all duration-300 ${isDisabled ? 'text-[#999]' : 'text-[#8E181F] group-hover:gap-1'}`}>
                        View
                        <ChevronRight size={11} strokeWidth={2.5} className={`transition-transform duration-300 ${isDisabled ? '' : 'group-hover:translate-x-0.5'}`} />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

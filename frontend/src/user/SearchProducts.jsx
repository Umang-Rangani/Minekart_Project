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

  const items = [{ title: 'Search', link: null }]

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
          params: {
            q: query,
          },
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
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <main className="mx-auto w-full  pb-10 pt-4  sm:pt-5 ">
        {/* PAGE HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* ICON */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <Search size={18} strokeWidth={2} className="relative z-10" />
            </div>

            {/* TITLE */}
            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Search Results</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">{searchQuery ? `Products matching "${searchQuery}"` : 'Search products, brands and categories'}</p>
            </div>
          </div>

          {/* COUNT */}
          {!loading && (
            <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 sm:h-8 sm:px-2.5">
              <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[#A51D26] px-1 text-[8px] font-extrabold text-white">{products.length}</span>

              <span className="hidden text-[9px] font-bold text-[#67544D] sm:inline">{products.length === 1 ? 'Product' : 'Products'}</span>

              <span className="text-[8px] font-bold text-[#67544D] sm:hidden">Items</span>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="flex min-h-88 flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.04)]">
                {/* IMAGE SHIMMER */}
                <div className="relative h-44 shrink-0 overflow-hidden bg-[#F7EEE7] sm:h-48 lg:h-52">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
                </div>

                {/* DETAILS SHIMMER */}
                <div className="flex flex-1 flex-col border-t border-[#EEE5DF] bg-[#FFFCFA] p-3">
                  {/* CATEGORY */}
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#EEE5DF]" />

                  {/* NAME */}
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-3.5 w-full animate-pulse rounded bg-[#EEE5DF]" />
                    <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#EEE5DF]" />
                  </div>

                  {/* RATING */}
                  <div className="mt-3 flex min-h-5 items-center gap-2">
                    <div className="h-4 w-9 animate-pulse rounded bg-[#E5EEE8]" />
                    <div className="h-2.5 w-14 animate-pulse rounded bg-[#EEE5DF]" />
                  </div>

                  {/* PRICE */}
                  <div className="mt-3 h-5 w-20 animate-pulse rounded bg-[#F2DDD5]" />

                  {/* BOTTOM */}
                  <div className="mt-auto flex items-center justify-between border-t border-[#EEE5DF] pt-2.5">
                    <div className="h-2.5 w-14 animate-pulse rounded bg-[#EEE5DF]" />
                    <div className="h-2.5 w-9 animate-pulse rounded bg-[#F2DDD5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* EMPTY STATE */
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
          /* PRODUCTS */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-5">
            {products.map((product) => {
              const sellingPrice = Number(product.discountPrice || product.price || 0)

              const hasDiscount = product.discount > 0 && Number(product.price) > Number(product.discountPrice)

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group flex min-h-88 cursor-pointer flex-col overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5BFB5] hover:shadow-[0_12px_28px_rgba(73,54,49,0.12)]"
                >
                  {/* IMAGE */}
                  <div className="relative flex h-44 shrink-0 items-center justify-center overflow-hidden bg-white p-3 sm:h-48 lg:h-52">
                    {/* DISCOUNT */}
                    {hasDiscount && <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-[#A51D26] px-2 py-1 text-[8px] font-extrabold text-white shadow-sm sm:text-[9px]">{product.discount}% OFF</span>}

                    {/* STOCK */}
                    {product.stock <= 0 ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF1F1] px-2 py-1 text-[8px] font-bold text-[#A51D26] sm:text-[9px]">Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF7EA] px-2 py-1 text-[8px] font-bold text-[#B87935] sm:text-[9px]">Only {product.stock} left</span>
                    ) : null}

                    {/* DECORATION */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F7EEE7] opacity-70 transition-transform duration-500 group-hover:scale-150" />

                    {/* PRODUCT IMAGE */}
                    {product.images?.[0] ? (
                      <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-1.5 text-[#B7A49B]">
                        <PackageSearch size={27} strokeWidth={1.4} />

                        <span className="text-[9px] font-semibold">No Image</span>
                      </div>
                    )}

                    {/* VIEW ICON */}
                    <div className="absolute bottom-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#8E181F] opacity-0 shadow-[0_4px_12px_rgba(73,54,49,0.15)] transition-all duration-300 group-hover:opacity-100">
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="flex flex-1 flex-col border-t border-[#EEE5DF] bg-[#FFFCFA] px-3 py-3">
                    {/* CATEGORY */}
                    <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A857B]">{product.category?.categoryName || 'Product'}</p>

                    {/* PRODUCT NAME */}
                    <h3 className="mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4.5 text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F] sm:text-[13px]">{product.productName}</h3>

                    {/* RATING */}
                    <div className="mt-2 flex min-h-5 items-center gap-1.5">
                      <span className="flex items-center gap-0.5 rounded bg-[#3E8B62] px-1.5 py-0.5 text-[8px] font-bold text-white">
                        {product.rating || '0.0'}

                        <span className="text-[8px]">★</span>
                      </span>

                      {product.soldCount > 0 && <span className="truncate text-[9px] text-[#806C63]">{product.soldCount}+ sold</span>}
                    </div>

                    {/* PRICE */}
                    <div className="mt-2.5 flex min-h-6 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                      <span className="text-base font-extrabold text-[#351C18]">₹{sellingPrice.toLocaleString('en-IN')}</span>

                      {hasDiscount && (
                        <>
                          <span className="text-[9px] text-[#9A857B] line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>

                          <span className="text-[9px] font-bold text-[#3E8B62]">{product.discount}% off</span>
                        </>
                      )}
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-auto flex min-h-8 items-center justify-between border-t border-[#EEE5DF] pt-2.5">
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-[#3E8B62]' : 'bg-[#A51D26]'}`} />

                        <span className={`text-[9px] font-semibold ${product.stock > 0 ? 'text-[#3E8B62]' : 'text-[#A51D26]'}`}>{product.stock > 0 ? 'In Stock' : 'Unavailable'}</span>
                      </div>

                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1">
                        View
                        <ChevronRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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

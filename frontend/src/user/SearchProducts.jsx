import React, { useEffect, useState } from 'react'
import { PackageSearch, Search, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
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

        const res = await axiosInstance.get('/product')

        const allProducts = res.data?.data || []

        const query = searchQuery.trim().toLowerCase()

        if (!query) {
          setProducts([])
          return
        }

        const filteredProducts = allProducts.filter((product) => {
          const searchableText = [product.productName, product.description, product.brand?.brandName, product.category?.categoryName, product.subCategory?.subCategoryName].filter(Boolean).join(' ').toLowerCase()

          return searchableText.includes(query)
        })

        setProducts(filteredProducts)
      } catch (error) {
        console.log('Search Products Error:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }


     document.title = `Search | MineKart`

    getProducts()
  }, [searchQuery])

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-5">
     

        {/* TOOLBAR */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Products for you</h2>

            <p className="mt-0.5 text-[10px] text-[#806C63] sm:text-xs">Explore products matching your search</p>
          </div>

          <span className="rounded-lg bg-[#F7EEE7] px-2.5 py-1.5 text-[9px] font-bold text-[#8E181F] sm:hidden">{products.length} found</span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:gap-5">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white">
                <div className="m-2.5 h-44 animate-pulse rounded-lg bg-[#F7EEE7] sm:h-48" />

                <div className="space-y-2 px-3 pb-4">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="h-3.5 w-full animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="h-3.5 w-2/3 animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="mt-3 h-4 w-20 animate-pulse rounded bg-[#F2DDD5]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* EMPTY */
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-white px-5 text-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <PackageSearch size={32} strokeWidth={1.5} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">No products found</h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#806C63]">We couldn't find products matching "{searchQuery}". Try another product, category, or brand.</p>

            <button type="button" onClick={() => navigate('/')} className="mt-4 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              Continue Shopping
            </button>
          </div>
        ) : (
          /* PRODUCTS */
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 xl:gap-5">
            {products.map((product) => {
              const sellingPrice = Number(product.discountPrice || product.price || 0)

              const hasDiscount = product.discount > 0 && product.price > product.discountPrice

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5BFB5] hover:shadow-[0_10px_25px_rgba(73,54,49,0.11)]"
                >
                  {/* IMAGE */}
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-white p-3 sm:h-48 lg:h-52">
                    {/* DISCOUNT */}
                    {hasDiscount && <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-[#A51D26] px-2 py-1 text-[9px] font-extrabold text-white shadow-sm">{product.discount}% OFF</span>}

                    {/* STOCK */}
                    {product.stock <= 0 ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF1F1] px-2 py-1 text-[9px] font-bold text-[#A51D26]">Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF7EA] px-2 py-1 text-[9px] font-bold text-[#B87935]">Only {product.stock} left</span>
                    ) : null}

                    {/* SOFT DECORATION */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#F7EEE7] opacity-70 transition-transform duration-500 group-hover:scale-150" />

                    {/* IMAGE */}
                    {product.images?.[0] ? (
                      <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-1.5 text-[#B7A49B]">
                        <PackageSearch size={25} strokeWidth={1.5} />
                        <span className="text-[9px] font-semibold">No Image</span>
                      </div>
                    )}

                    {/* HOVER ACTION */}
                    <div className="absolute bottom-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#8E181F] opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                      <ChevronRight size={14} />
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="border-t border-[#EEE5DF] bg-[#FFFCFA] px-3 py-3">
                    {/* BRAND */}
                    <p className="truncate text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                    {/* NAME */}
                    <h3 className="mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4.5 text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F] sm:text-[13px]">{product.productName}</h3>

                    {/* RATING */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="flex items-center gap-0.5 rounded bg-[#3E8B62] px-1.5 py-0.5 text-[8px] font-bold text-white">
                        {product.rating || '0.0'}
                        <span className="text-[8px]">★</span>
                      </span>

                      {product.soldCount > 0 && <span className="truncate text-[9px] text-[#806C63]">{product.soldCount}+ sold</span>}
                    </div>

                    {/* PRICE */}
                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-[#351C18]">₹{sellingPrice.toLocaleString('en-IN')}</span>

                      {hasDiscount && <span className="text-[9px] font-medium text-[#9A857B] line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>}
                    </div>

                    {/* BOTTOM */}
                    <div className="mt-2.5 flex items-center justify-between border-t border-[#EEE5DF] pt-2.5">
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-[#3E8B62]' : 'bg-[#A51D26]'}`} />

                        <span className={`text-[9px] font-semibold ${product.stock > 0 ? 'text-[#3E8B62]' : 'text-[#A51D26]'}`}>{product.stock > 0 ? 'In Stock' : 'Unavailable'}</span>
                      </div>

                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1">
                        View
                        <ChevronRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

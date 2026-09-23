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

    getProducts()
  }, [searchQuery])

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-6">
        {/* SEARCH RESULT HEADER */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_6px_24px_rgba(73,54,49,0.07)]">
          <div className="flex min-h-24 items-center justify-between gap-5 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/15">
                <Search size={26} strokeWidth={1.9} />

                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#FFFDFC] bg-[#D4A373]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />

                  <h1 className="truncate text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Search Results</h1>
                </div>

                <p className="ml-3.5 mt-1 text-xs font-medium text-[#806C63] sm:text-sm">Results for "{searchQuery}"</p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#8E181F] shadow-sm sm:flex">
              <PackageSearch size={16} />
              <span>
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#351C18]">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
            </h2>

            <p className="mt-1 text-xs font-medium text-[#806C63]">Matching products for your search</p>
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="flex min-h-95 items-center justify-center rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-95 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-6 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F7EEE7] text-[#8E181F]">
              <PackageSearch size={38} strokeWidth={1.5} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">No products found</h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#806C63]">We couldn't find any products matching "{searchQuery}". Try searching with another product or brand name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_16px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5C0B5] hover:shadow-[0_12px_28px_rgba(73,54,49,0.11)]"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative m-2.5 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-[#FBF7F2] via-[#F7EEE7] to-[#F1E4DC] sm:h-52">
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-[#7D171C]/5 transition-transform duration-500 group-hover:scale-150" />

                  {/* Brand Badge */}
                  <span className="absolute left-2.5 top-2.5 z-10 rounded-lg border border-white/70 bg-white/85 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63] shadow-sm backdrop-blur-sm">
                    {product.brand?.brandName || 'Brand'}
                  </span>

                  {product.images?.[0] ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-1 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="text-sm font-semibold text-[#B7A49B]">No Image</div>
                  )}

                  {/* Hover Arrow */}
                  <div className="absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-[#8E181F] opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <ChevronRight size={16} />
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="px-3.5 pb-4 pt-1">
                  <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                  <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F]">{product.productName}</h3>

                  {/* PRICE */}
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-base font-extrabold text-[#8E181F]">₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}</p>

                      {product.discountPrice && product.price > product.discountPrice && <p className="mt-0.5 text-[10px] font-medium text-[#A9988F] line-through">₹{Number(product.price).toLocaleString('en-IN')}</p>}
                    </div>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white">
                      <ChevronRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

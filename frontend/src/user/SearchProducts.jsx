import React, { useEffect, useState } from 'react'
import { PackageSearch, Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'

export default function SearchProducts() {
  const [searchParams] = useSearchParams()

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-5">
            {products.map((product) => (
              <div key={product._id} className="rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-3 shadow-sm">
                <div className="flex h-52 items-center justify-center rounded-xl bg-[#F7EEE7]">
                  {product.images?.[0] && <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain p-4" />}
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-[#351C18]">{product.productName}</h3>

                <p className="mt-2 text-base font-extrabold text-[#8E181F]">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

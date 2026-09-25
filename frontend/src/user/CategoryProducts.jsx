import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, ShoppingBag, SlidersHorizontal, ChevronRight } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { iconMap } from '../data/iconMap'
import BreadCrumb from './BreadCrumb'

export default function CategoryProducts() {
  const { id } = useParams()

  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCategoryProducts = async () => {
    try {
      setLoading(true)

      const productRes = await axiosInstance.get('/product')
      const allProductsData = productRes.data.data || []

      const filteredProducts = allProductsData.filter((product) => product.category?._id === id)

      setProducts(filteredProducts)
      setAllProducts(filteredProducts)

      const categoryRes = await axiosInstance.get('/category')
      const categories = categoryRes.data.data || []
      const currentCategory = categories.find((item) => item._id === id)

      setCategory(currentCategory)
      document.title = `${currentCategory.categoryName} | MineKart`
    } catch (error) {
      console.error('Get category products error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getCategoryProducts()
  }, [id])

  const Icon = category ? iconMap[category.categoryLucideIcons] : null

  const uniqueNames = [...new Set(allProducts.map((item) => item.subCategory?.subCategoryName).filter(Boolean))]

  const filterBySubCategory = (subCategoryName) => {
    if (subCategoryName === '') {
      setProducts(allProducts)
      return
    }

    setProducts(allProducts.filter((item) => item.subCategory?.subCategoryName === subCategoryName))
  }

  const items = [
    { title: 'Category', link: '/category' },
    { title: `${category?.categoryName || 'Category'}`, link: null },
  ]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-4">
        {/* CATEGORY HEADER */}
        {!loading && (
          <div className="mb-4 flex items-center justify-between border-b border-[#E8DDD4] bg-white px-1 pb-4 sm:mb-5 sm:px-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm sm:h-11 sm:w-11">{Icon && <Icon size={21} strokeWidth={1.8} />}</div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-extrabold text-[#351C18] sm:text-lg">{category?.categoryName} Products</h1>

                <p className="mt-0.5 text-[10px] text-[#806C63] sm:text-xs">Explore products in this category</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#E8DDD4] bg-[#FFFDFC] px-2.5 py-1.5 text-[10px] font-bold text-[#67544D] sm:px-3 sm:text-xs">
              <ShoppingBag size={13} />
              <span>
                {products.length} {products.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        )}

        {/* SUBCATEGORY FILTER */}
        <div className="mb-5 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex min-w-max items-center gap-2">
            <button
              type="button"
              onClick={() => filterBySubCategory('')}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-[#A51D26] px-3 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#7D171C] active:scale-95"
            >
              <span>All</span>
              <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px]">{allProducts.length}</span>
            </button>

            {uniqueNames.map((unique, i) => (
              <button
                key={i}
                type="button"
                onClick={() => filterBySubCategory(unique)}
                className="group flex h-8 shrink-0 items-center gap-1 rounded-md border border-[#E2D5CC] bg-white px-3 text-[11px] font-semibold text-[#67544D] transition-all duration-200 hover:border-[#BFA69B] hover:bg-[#FBF5F1] hover:text-[#8E181F] active:scale-95"
              >
                <span>{unique}</span>
                <ChevronRight size={12} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white">
                <div className="h-44 animate-pulse bg-[#F7EEE7] sm:h-48 lg:h-52" />

                <div className="space-y-2.5 p-3">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="h-3.5 w-full animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#EEE5DF]" />
                  <div className="mt-3 h-4 w-20 animate-pulse rounded bg-[#F2DDD5]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* EMPTY */
          <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-white px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={28} strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">No Products Found</h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#806C63]">There are currently no products available in this category.</p>

            <Link to="/category" className="mt-4 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              Browse Categories
            </Link>
          </div>
        ) : (
          /* PRODUCTS */
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6 xl:gap-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4BDB2] hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)]"
              >
                {/* IMAGE */}
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-white p-3 sm:h-48 lg:h-52">
                  {/* DISCOUNT */}
                  {product.discount > 0 && <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-[#A51D26] px-2 py-1 text-[9px] font-extrabold text-white shadow-sm">{product.discount}% OFF</span>}

                  {/* STOCK */}
                  {product.stock <= 0 ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF2F1] px-2 py-1 text-[9px] font-bold text-[#A51D26]">Out of Stock</span>
                  ) : product.stock <= 5 ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF7EA] px-2 py-1 text-[9px] font-bold text-[#B87935]">Only {product.stock} left</span>
                  ) : null}

                  {/* IMAGE */}
                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-[#A28E85]">
                      <ShoppingBag size={26} strokeWidth={1.5} />
                      <span className="text-[9px]">No Image</span>
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div className="border-t border-[#EEE5DF] bg-[#FFFCFA] px-3 py-3">
                  {/* CATEGORY */}
                  <p className="truncate text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">{product.category?.categoryName || 'Product'}</p>

                  {/* NAME */}
                  <h3 className="mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4.5 text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F] sm:text-[13px]">{product.productName}</h3>

                  {/* RATING */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 rounded bg-[#3E8B62] px-1.5 py-0.5 text-[8px] font-bold text-white">
                      {product.rating || '0.0'}
                      <Star size={8} fill="currentColor" strokeWidth={2.5} />
                    </span>

                    {product.soldCount > 0 && <span className="truncate text-[9px] text-[#806C63]">{product.soldCount}+ sold</span>}
                  </div>

                  {/* PRICE */}
                  <div className="mt-2.5 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#351C18]">₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className="text-[9px] text-[#9A857B] line-through">₹{product.price?.toLocaleString('en-IN')}</span>

                        <span className="text-[9px] font-bold text-[#3E8B62]">{product.discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* BOTTOM */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#EEE5DF] pt-2.5">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
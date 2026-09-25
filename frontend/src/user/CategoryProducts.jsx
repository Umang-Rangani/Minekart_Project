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
      document.title = `${currentCategory.categoryName } | MineKart`
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

      <div className="mx-auto pt-5">
        {/* Category Header */}
        {!loading && (
          <div className="mb-5 overflow-hidden rounded-xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_4px_16px_rgba(73,54,49,0.06)]">
            <div className="flex min-h-19 items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 sm:h-12 sm:w-12">
                  {Icon && <Icon size={23} strokeWidth={1.8} />}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#FFFDFC] bg-[#D4A373]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                    <h1 className="truncate text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">{category?.categoryName} Products</h1>
                  </div>

                  <p className="ml-3 mt-0.5 truncate text-[11px] text-[#806C63] sm:text-xs">Discover the latest products in this category</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-2 text-[11px] font-bold text-[#8E181F] shadow-sm sm:px-3.5">
                <ShoppingBag size={14} />
                <span>
                  {products.length} {products.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Filter */}
        <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => filterBySubCategory('')}
            className="group flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#7D171C] bg-linear-to-r from-[#7D171C] to-[#A51D26] px-3.5 text-xs font-bold text-white shadow-sm shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <span>All</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[9px] font-bold">{allProducts.length}</span>
          </button>

          {uniqueNames.map((unique, i) => (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => filterBySubCategory(unique)}
                className="group flex h-9 shrink-0 items-center gap-1 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-3.5 text-xs font-semibold text-[#67544D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#8E181F] hover:shadow-md active:scale-95"
              >
                <span>{unique}</span>
                <ChevronRight size={13} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-sm">
                <div className="h-52 animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2] sm:h-56 lg:h-60" />
                <div className="space-y-3 p-4">
                  <div className="h-2.5 w-20 animate-pulse rounded bg-[#E8DDD4]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#E8DDD4]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#E8DDD4]" />
                  <div className="h-6 w-24 animate-pulse rounded bg-[#E8DDD4]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={30} strokeWidth={1.7} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">No Products Found</h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#806C63]">There are currently no products available in this category.</p>

            <Link to="/category" className="mt-5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              Browse Categories
            </Link>
          </div>
        ) : (
          /* Products */
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D6BDB2] hover:shadow-[0_16px_35px_rgba(73,54,49,0.13)]"
              >
                {/*  IMAGE  */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-linear-to-br from-[#FFFDFC] via-[#FBF7F2] to-[#F5EAE2] p-4 sm:h-56 lg:h-60">
                  {/* Decorative Circle */}
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#A51D26]/5 transition-transform duration-700 group-hover:scale-150" />

                  {/* Discount */}
                  {product.discount > 0 && <span className="absolute left-3 top-3 z-20 rounded-md bg-[#8E181F] px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-sm">{product.discount}% OFF</span>}

                  {/* Stock */}
                  {product.stock <= 0 && <span className="absolute right-3 top-3 z-20 rounded-md border border-[#E5D8D0] bg-white/90 px-2.5 py-1 text-[10px] font-bold text-[#8E181F] shadow-sm backdrop-blur-sm">Out of Stock</span>}

                  {/* Product Image */}
                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110" />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center gap-2 text-[#9A857B]">
                      <ShoppingBag size={28} strokeWidth={1.5} />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}

                  {/* Bottom Image Fade */}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#F7EEE7]/60 to-transparent" />
                </div>

                {/*  DETAILS  */}
                <div className="bg-[#FFFDFC] p-3.5 sm:p-4">
                  {/* Category */}
                  <p className="truncate text-[10px] font-bold uppercase tracking-[0.09em] text-[#9A857B]">{product.category?.categoryName || 'Product'}</p>

                  {/* Product Name */}
                  <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]">{product.productName}</h3>

                  {/* Rating + Sold */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F3E7D7] px-2 py-1 text-[11px] font-extrabold text-[#715329]">
                      {product.rating || '0.0'}
                      <Star size={10} fill="currentColor" strokeWidth={2.5} />
                    </span>

                    {product.soldCount > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#C9B8AF]" />

                        <span className="text-[11px] font-medium text-[#806C63]">{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[19px] font-extrabold tracking-tight text-[#351C18]">₹{product.discountPrice}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className="text-xs font-medium text-[#A28E85] line-through">₹{product.price}</span>

                        <span className="text-[10px] font-extrabold text-[#3E8B62]">{product.discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#EFE5DF] pt-3">
                    {/* Stock */}
                    <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-[#3E8B62]' : 'text-[#A51D26]'}`}>{product.stock > 0 ? '● In Stock' : '● Unavailable'}</span>

                    {/* CTA */}
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#8E181F] transition-all duration-300 group-hover:gap-1.5">
                      View Details
                      <ChevronRight size={13} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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

// {/* Products */}
// <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">

// </div>

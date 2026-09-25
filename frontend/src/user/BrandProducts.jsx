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

      const res = await axiosInstance.get('/product')
      const allProducts = res.data.data || []

      const filteredProducts = allProducts.filter((product) => product.brand?._id === id)

      setProducts(filteredProducts)

      if (filteredProducts.length > 0) {
        setBrand(filteredProducts[0].brand)
      }
    } catch (error) {
      console.error('Get brand products error:', error.response?.data || error.message)
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
    document.title = `${brand?.brandName || ""} | MineKart`
  }, [brand])

  const items = [
    { title: 'Brand', link: '/brand' },
    { title: `${brand?.brandName || ''}`, link: null },
  ]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-5">
        {/* Brand Header */}
        {!loading && (
          <div className="mb-5 overflow-hidden rounded-xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_4px_16px_rgba(73,54,49,0.06)]">
            <div className="flex min-h-19 items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                {brand?.brandLogo ? (
                  <div className="relative flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden   bg-white p-1.5 shadow-sm sm:h-12 sm:w-20">
                    <img src={`http://localhost:3000${brand.brandLogo}`} alt={brand.brandName} className="h-full w-full object-contain transition-transform duration-300 hover:scale-105" />
                    <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#D4A373]" />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 sm:h-12 sm:w-12">
                    <Store size={23} strokeWidth={1.8} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                    <h1 className="truncate text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">{brand?.brandName} Products</h1>
                  </div>

                  <p className="ml-3 mt-0.5 truncate text-[11px] text-[#806C63] sm:text-xs">Discover the latest products from {brand?.brandName}</p>
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
          /* Empty */
          <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={30} strokeWidth={1.7} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">No Products Found</h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#806C63]">There are currently no products available for this brand.</p>

            <Link to="/brand" className="mt-5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              Browse Brands
            </Link>
          </div>
        ) : (
          // Product Grid
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 xl:gap-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_10px_25px_rgba(73,54,49,0.12)]"
              >
                {/* Image */}
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-white p-3 sm:h-48 lg:h-52">
                  {/* Discount */}
                  {product.discount > 0 && <span className="absolute left-2.5 top-2.5 z-20 rounded-md bg-[#A51D26] px-2 py-1 text-[9px] font-bold text-white shadow-sm">{product.discount}% OFF</span>}

                  {/* Stock */}
                  {product.stock <= 0 ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF4F2] px-2 py-1 text-[9px] font-bold text-[#A51D26]">Out of Stock</span>
                  ) : product.stock <= 5 ? (
                    <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF8ED] px-2 py-1 text-[9px] font-bold text-[#B87935]">Only {product.stock} left</span>
                  ) : null}

                  {/* Soft Background */}
                  <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#F7EEE7] opacity-60 transition-transform duration-500 group-hover:scale-150" />

                  {/* Product Image */}
                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center gap-2 text-[#9A857B]">
                      <ShoppingBag size={28} strokeWidth={1.5} />

                      <span className="text-[10px]">No Image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="border-t border-[#EEE5DF] bg-[#FFFCFA] px-3 py-3">
                  {/* Category */}
                  <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[#9A857B]">{product.category?.categoryName || 'Product'}</p>

                  {/* Product Name */}
                  <h3 className="mt-1 line-clamp-2 min-h-9 text-[13px] font-bold leading-4.5 text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F]">{product.productName}</h3>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 rounded bg-[#3E8B62] px-1.5 py-0.5 text-[9px] font-bold text-white">
                      {product.rating || '0.0'}

                      <Star size={8} fill="currentColor" strokeWidth={2.5} />
                    </span>

                    {product.soldCount > 0 && <span className="truncate text-[9px] text-[#806C63]">{product.soldCount}+ sold</span>}
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#351C18]">₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className="text-[10px] text-[#9A857B] line-through">₹{product.price?.toLocaleString('en-IN')}</span>

                        <span className="text-[9px] font-bold text-[#3E8B62]">{product.discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#EEE5DF] pt-2.5">
                    {/* Stock */}
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-[#3E8B62]' : 'bg-[#A51D26]'}`} />

                      <span className={`text-[9px] font-semibold ${product.stock > 0 ? 'text-[#3E8B62]' : 'text-[#A51D26]'}`}>{product.stock > 0 ? 'In Stock' : 'Unavailable'}</span>
                    </div>

                    {/* View */}
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1">
                      View
                      <ChevronRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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

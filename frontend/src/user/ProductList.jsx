import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Zap, ChevronRight } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const getProducts = async () => {
    try {
      const res = await axiosInstance.get('/product')
      setProducts(res.data.data || [])
    } catch (error) {
      console.error('Get products error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />
          <p className="text-sm font-medium text-[#806C63]">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                <Zap size={17} strokeWidth={2} />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A857B]">Collection</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#351C18] sm:text-3xl">All Products</h1>

            <p className="mt-1 text-sm text-[#806C63]">Explore our latest products</p>
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="flex min-h-87.5 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingCart size={28} strokeWidth={1.6} />
            </div>

            <p className="mt-4 text-sm font-bold text-[#351C18]">No products found</p>
            <p className="mt-1 text-xs text-[#806C63]">Products will appear here once available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:gap-5">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_15px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_16px_35px_rgba(73,54,49,0.15)]"
              >
                {/* Image Area */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-linear-to-br from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] p-4 sm:h-56 lg:h-60">
                  {/* Decorative Circle */}
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#A51D26]/5 transition-transform duration-500 group-hover:scale-150" />

                  {/* Discount */}
                  {product.discount > 0 && (
                    <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">  
                      <Zap size={11} fill="currentColor" />
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Stock */}
                  {product.stock <= 0 ? (
                    <span className="absolute right-3 top-3 z-20 rounded-lg border border-[#E8DDD4] bg-[#FFFDFC]/95 px-2 py-1 text-[10px] font-bold text-[#A51D26] shadow-sm backdrop-blur-sm">Out of Stock</span>
                  ) : product.stock <= 5 ? (
                    <span className="absolute right-3 top-3 z-20 rounded-lg border border-[#E8DDD4] bg-[#FFFDFC]/95 px-2 py-1 text-[10px] font-bold text-[#B87935] shadow-sm backdrop-blur-sm">Only {product.stock} left</span>
                  ) : null}

                  {/* Product Image */}
                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center gap-2 text-[#9A857B]">
                      <ShoppingCart size={30} strokeWidth={1.5} />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}

                  {/* Bottom Image Glow */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#351C18]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Product Info */}
                <div className="border-t border-[#E8DDD4] bg-[#FFFDFC] p-3.5 transition-colors duration-300 group-hover:bg-[#FFFCFA] sm:p-4">
                  {/* Category */}
                  <p className="truncate text-[10px] font-bold uppercase tracking-widest text-[#9A857B]">{product.category?.categoryName || 'Product'}</p>

                  {/* Product Name */}
                  <h2 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]">{product.productName}</h2>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-lg bg-[#F3E7D7] px-2 py-1 text-[11px] font-extrabold text-[#715329]">
                      {product.rating || '0.0'}
                      <Star size={11} fill="currentColor" strokeWidth={2} />
                    </span>

                    {product.soldCount > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#C9B8AF]" />
                        <span className="text-[11px] font-medium text-[#806C63]">{product.soldCount}+ sold</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-lg font-extrabold tracking-tight text-[#351C18]">₹{product.discountPrice}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className="text-xs font-medium text-[#9A857B] line-through">₹{product.price}</span>
                        <span className="text-[10px] font-bold text-[#3E8B62]">{product.discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-center justify-between border-t border-[#EFE5DF] pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${product.stock > 0 ? 'bg-[#EAF5EE]' : 'bg-[#FBEAEA]'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-[#3E8B62]' : 'bg-[#A51D26]'}`} />
                      </span>

                      <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-[#3E8B62]' : 'text-[#A51D26]'}`}>{product.stock > 0 ? 'In Stock' : 'Unavailable'}</span>
                    </div>

                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1.5">
                      View
                      <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
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

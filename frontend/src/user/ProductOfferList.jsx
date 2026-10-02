import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Tag, Zap } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function ProductOfferList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const getOfferProducts = async () => {
    try {
      const res = await axiosInstance.get('/product/offers')

      setProducts(res.data?.data || [])
    } catch (error) {
      console.error('Get offer products error:', error.response?.data || error.message)

      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOfferProducts()
  }, [])

  // Loading
  if (loading) {
    return (
      <div className="w-full">
        {/* Header Shimmer */}
        <div className="mb-3 flex items-end justify-between gap-2 sm:mb-5 sm:gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 sm:mb-1.5 sm:gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[#A51D26] sm:h-7 sm:w-7 sm:rounded-lg">
                <Tag size={11} strokeWidth={2} className="sm:h-3.25 sm:w-3.25" />
              </span>

              <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9A857B] sm:text-[10px] sm:tracking-[0.16em]">Special Deals</span>
            </div>

            <div className="h-5 w-24 animate-pulse rounded-md bg-[#E8DDD4] sm:h-7 sm:w-32 sm:rounded-lg" />

            <div className="mt-1 h-2.5 w-36 animate-pulse rounded bg-[#EEE5DF] sm:mt-2 sm:h-4 sm:w-56" />
          </div>
        </div>

        {/* Product Shimmer */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-lg border border-[#E8DDD4] bg-white sm:rounded-2xl">
              <div className="aspect-square animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2] sm:aspect-4/5" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-3 flex items-end justify-between gap-2 sm:mb-5 sm:gap-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 sm:mb-1.5 sm:gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[#A51D26] sm:h-7 sm:w-7 sm:rounded-lg">
              <Tag size={11} strokeWidth={2} className="sm:h-3.75 sm:w-3.75" />
            </span>

            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9A857B] sm:text-[10px] sm:tracking-[0.16em]">Special Deals</span>
          </div>

          <h2 className="text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">Best Offers</h2>

          <p className="mt-0.5 truncate text-[10px] text-[#806C63] sm:text-xs">Grab the latest deals before they&apos;re gone</p>
        </div>

        {products.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#F7EEE7] px-2.5 py-1 text-[9px] font-bold text-[#8E181F] sm:px-3 sm:py-1.5 sm:text-[10px]">
            {products.length} {products.length === 1 ? 'Offer' : 'Offers'}
          </span>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-4 text-center sm:min-h-60 sm:rounded-2xl sm:px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] sm:h-14 sm:w-14 sm:rounded-xl">
            <Tag size={20} strokeWidth={1.6} className="sm:h-6 sm:w-6" />
          </div>

          <p className="mt-2.5 text-xs font-bold text-[#351C18] sm:mt-3 sm:text-sm">No offers available</p>

          <p className="mt-1 text-[10px] text-[#806C63] sm:text-xs">Special offers will appear here.</p>
        </div>
      ) : (
        /* Offer Products */
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group relative overflow-hidden rounded-lg border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)] sm:rounded-b-2xl sm:shadow-[0_4px_14px_rgba(73,54,49,0.06)]"
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-white pt-0.5 sm:aspect-4/5 sm:pt-1">
                {/* Offer Badge */}
                {product.discount > 0 && (
                  <div className="absolute left-1.5 top-1.5 z-20 flex items-center gap-0.5 rounded-md bg-[#A51D26] px-1.5 py-0.5 text-[7px] font-extrabold text-white shadow-sm sm:left-3 sm:top-3 sm:gap-1 sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                    <Zap size={8} fill="currentColor" strokeWidth={2} className="sm:h-2.75 sm:w-2.75" />
                    {product.discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                {product.offerImage ? (
                  <img src={getImageUrl(product.offerImage)} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="relative z-10 flex h-full w-full items-center justify-center bg-white text-[#9A857B]">
                    <ShoppingCart size={22} strokeWidth={1.5} className="sm:h-7.5 sm:w-7.5" />
                  </div>
                )}

                {/* Bottom Gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-16" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

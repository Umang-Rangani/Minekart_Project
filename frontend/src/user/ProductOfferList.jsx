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

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#A51D26]">
                <Tag size={15} strokeWidth={2} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A857B]">Special Deals</span>
            </div>

            <div className="h-7 w-32 animate-pulse rounded-lg bg-[#E8DDD4]" />

            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-[#EEE5DF]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white">
              <div className="aspect-4/5 animate-pulse bg-linear-to-br from-[#F7EEE7] to-[#FBF7F2]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#A51D26]">
              <Tag size={15} strokeWidth={2} />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A857B] sm:text-xs">Special Deals</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Best Offers</h2>

          <p className="mt-0.5 truncate text-xs text-[#806C63] sm:text-sm">Grab the latest deals before they&apos;re gone</p>
        </div>

        {products.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#F7EEE7] px-3 py-1.5 text-[10px] font-bold text-[#8E181F]">
            {products.length} {products.length === 1 ? 'Offer' : 'Offers'}
          </span>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
            <Tag size={24} strokeWidth={1.6} />
          </div>

          <p className="mt-3 text-sm font-bold text-[#351C18]">No offers available</p>

          <p className="mt-1 text-xs text-[#806C63]">Special offers will appear here.</p>
        </div>
      ) : (
        /* Offer Products */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group relative overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_14px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C1B6] hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)]"
            >
              {/* Image */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-white">
                {/* Offer Badge */}
                {product.discount > 0 && (
                  <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-lg bg-[#A51D26] px-2.5 py-1.5 text-[9px] font-extrabold text-white shadow-md sm:text-[10px]">
                    <Zap size={11} fill="currentColor" strokeWidth={2} />
                    {product.discount}% OFF
                  </div>
                )}

                {/* Decorative Circle */}
                <div className="absolute -right-10 -top-10 z-10 h-24 w-24 rounded-full bg-[#F7EEE7] opacity-60 transition-transform duration-500 group-hover:scale-150" />

                {/* Product Image */}
                {product.offerImage ? (
                  <img src={`http://localhost:3000${product.offerImage}`} alt={product.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="relative z-10 flex h-full w-full items-center justify-center bg-white text-[#9A857B]">
                    <ShoppingCart size={30} strokeWidth={1.5} />
                  </div>
                )}

                {/* Bottom Gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-linear-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

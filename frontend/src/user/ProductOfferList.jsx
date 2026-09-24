import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Zap, ChevronRight, Tag } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function ProductOfferList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const getOfferProducts = async () => {
    try {
      const res = await axiosInstance.get('/product')

      const offerProducts = (res.data.data || []).filter((product) => product.isOffer === true)

      setProducts(offerProducts)
    } catch (error) {
      console.error('Get offer products error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOfferProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />

          <p className="text-xs font-medium text-[#806C63]">Loading offers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#A51D26]">
              <Tag size={15} strokeWidth={2} />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A857B]">Special Deals</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Best Offers</h2>

          <p className="mt-0.5 text-xs text-[#806C63]">Grab the latest deals before they&apos;re gone</p>
        </div>

        {products.length > 0 && <span className="rounded-full bg-[#F7EEE7] px-3 py-1.5 text-[10px] font-bold text-[#8E181F]">{products.length} Offers</span>}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
            <Tag size={24} strokeWidth={1.6} />
          </div>

          <p className="mt-3 text-sm font-bold text-[#351C18]">No offers available</p>

          <p className="mt-1 text-xs text-[#806C63]">Special offers will appear here.</p>
        </div>
      ) : (
        // Offer Products
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group relative   transition-all duration-300 hover:-translate-y-1 "
            >
              {/* Image */}
              <div className="relative aspect-4/5 w-full overflow-hidden ">
            

                {/* Image */}
                {product.offerImage ? (
                  <img src={`http://localhost:3000${product.offerImage}`} alt={product.productName} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-102" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white text-[#9A857B]">
                    <ShoppingCart size={30} strokeWidth={1.5} />
                  </div>
                )}

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

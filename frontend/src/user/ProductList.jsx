import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Zap } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // ! Get Products
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
        <p className="text-sm text-[#64748B]">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] ">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#172033]">All Products</h1>

          <p className="mt-1 text-sm text-[#64748B]">Explore our latest products</p>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white py-16 text-center">
            <p className="text-sm text-[#64748B]">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <Link key={product._id} className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                {/* Product Image */}
                <div className="flex h-64 items-center justify-center bg-white p-5">
                  {product.images?.length > 0 ? (
                    <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="text-sm text-[#99938B]">No Image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="border-t border-[#E2E8F0] p-4">
                  {/* Category */}
                  <p className="mb-1 text-xs text-[#64748B]">{product.category?.categoryName}</p>

                  {/* Name */}
                  <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-[#292725]">{product.productName}</h2>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-1">
                    <span className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                      {product.rating}
                      <Star size={12} fill="currentColor" />
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#172033]">₹{product.discountPrice}</span>

                    {product.price > product.discountPrice && (
                      <>
                        <span className="text-sm text-[#99938B] line-through">₹{product.price}</span>

                        <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      navigate(`/product/${product._id}`)
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#D97706] hover:shadow-md active:scale-[0.98]"
                  >
                    <Zap size={17} strokeWidth={2.2} />
                    Buy Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

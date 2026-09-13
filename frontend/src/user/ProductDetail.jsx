import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { ShoppingCart, Star, Zap, Minus, Plus, Heart, Truck, ShieldCheck, RotateCcw, BadgeCheck, Info, ArrowLeft } from 'lucide-react'
import { useUser } from '../context/userProvider'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setShowLogin } = useUser()

  // para Id
  const [product, setProduct] = useState(null)

  // img ne select krin show krvamate
  const [selectedImage, setSelectedImage] = useState('')

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(0)

  // ! 1. product loop mate
  const [relatedProducts, setRelatedProducts] = useState([])

  // ! 2. product loop mate
  const getRelatedProducts = async (subCategoryId) => {
    try {
      const res = await axiosInstance.get('/product')

      const products = res.data.data || []

      const filteredProducts = products.filter((item) => item.subCategory?._id === subCategoryId && item._id !== id)

      setRelatedProducts(filteredProducts)
    } catch (error) {
      console.error('Get related products error:', error.response?.data || error.message)
    }
  }

  // ! Get Product
  const getProduct = async () => {
    try {
      const res = await axiosInstance.get(`/product/${id}`)

      const data = res.data.data

      setProduct(data)

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0])
      }

      if (data.subCategory?._id) {
        getRelatedProducts(data.subCategory._id)
      }
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    getProduct()
  }, [id])

  // ! Quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  // ! Add To Cart
  const addToCart = () => {
    if (!user) {
      setShowLogin(true)
    }

    console.log({
      productId: product._id,
      quantity,
      size: selectedSize,
    })

    // ! Cart API logic later
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading product...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]  py-6 ">
      <div className="mx-auto pb-10 ">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm">
          <button type="button" onClick={() => navigate('/')} className="font-semibold text-[#1D4ED8] transition hover:text-[#1E40AF]">
            Home
          </button>

          <span className="text-[#CBD5E1]">/</span>

          <Link to={`/category/${product?.category?._id}`} type="button" className="font-medium text-[#64748B] transition hover:text-[#1D4ED8]">
            {product.category?.categoryName}
          </Link>

          {product.subCategory?.subCategoryName && (
            <>
              <span className="text-[#CBD5E1]">/</span>

              <button type="button" className="font-medium text-[#64748B] transition hover:text-[#1D4ED8]">
                {product.subCategory.subCategoryName}
              </button>
            </>
          )}
        </div>

        {/* Main Product */}
        <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-[53%_47%]">
            {/* LEFT SIDE */}
            <div className="border-b border-[#E2E8F0] bg-[#FBFCFE] p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
              {/* Image Area */}
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-3 shadow-sm sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Thumbnails */}
                  <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-19 sm:flex-col sm:overflow-visible">
                    {product.images?.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`group relative flex h-17 w-17 shrink-0 items-center justify-center rounded-xl border bg-white p-2 transition-all duration-200 ${
                          selectedImage === image ? 'border-[#1D4ED8] bg-[#EFF6FF] shadow-md ring-2 ring-[#DBEAFE]' : 'border-[#E2E8F0] hover:-translate-y-0.5 hover:border-[#93C5FD] hover:shadow-sm'
                        }`}
                      >
                        <img src={`http://localhost:3000${image}`} alt={`${product.productName} ${index + 1}`} className="h-full w-full object-contain transition duration-200 group-hover:scale-105" />
                      </button>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="relative order-1 flex min-h-95 flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-linear-to-br from-[#F8FAFC] via-white to-[#EFF6FF] p-6 sm:min-h-125">
                    {/* Decorative circles */}
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#DBEAFE]/50" />

                    <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#FEF3C7]/40" />

                    {selectedImage ? (
                      <img src={`http://localhost:3000${selectedImage}`} alt={product.productName} className="relative z-10 max-h-117 w-full object-contain transition duration-500 hover:scale-[1.03]" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#64748B]">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9]">
                          <Info size={24} />
                        </div>

                        <p className="text-sm font-medium">No image available</p>
                      </div>
                    )}

                    {/* Image Counter */}
                    {product.images?.length > 0 && (
                      <div className="absolute bottom-4 right-4 z-20 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#475569] shadow-sm backdrop-blur">
                        {product.images.findIndex((image) => image === selectedImage) + 1} / {product.images.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="max-h-[calc(100vh-100px)] no-scrollbar overflow-y-auto bg-white p-5 sm:p-7 lg:p-8">
              {/* Product Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-lg bg-[#EFF6FF] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8]">{product.category?.categoryName}</span>

                  <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#172033] sm:text-3xl">{product.productName}</h1>
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F9A8D4] hover:bg-[#FDF2F8] hover:text-[#DB2777] hover:shadow-md"
                >
                  <Heart size={20} strokeWidth={2.2} className="transition duration-200 group-hover:scale-110 group-hover:fill-[#FCE7F3]" />
                </button>
              </div>

              {/* Brand */}
              {product.brand?.brandName && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF7ED]">
                    <BadgeCheck size={14} className="text-[#D97706]" />
                  </div>

                  <p className="text-sm text-[#64748B]">
                    Brand: <span className="font-bold text-[#292725]">{product.brand.brandName}</span>
                  </p>
                </div>
              )}

              {/* Rating */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-3 py-1.5 text-sm font-extrabold text-white shadow-sm">
                  <Star size={14} fill="currentColor" strokeWidth={2} />

                  <span>{product.rating}</span>
                </div>

                <span className="text-sm font-medium text-[#64748B]">Customer Rating</span>

                {product.soldCount > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />

                    <span className="text-sm font-semibold text-[#64748B]">{product.soldCount}+ sold</span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-linear-to-r from-[#E2E8F0] via-[#CBD5E1] to-transparent" />

              {/* Price Card */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-linear-to-r from-[#F8FAFC] to-[#EFF6FF] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-extrabold tracking-tight text-[#172033]">₹{product.discountPrice}</span>

                  {product.price > product.discountPrice && (
                    <>
                      <span className="text-base font-medium text-[#94A3B8] line-through">₹{product.price}</span>

                      <span className="rounded-lg bg-[#FEF3C7] px-2.5 py-1.5 text-xs font-extrabold text-[#B45309]">{product.discount}% OFF</span>
                    </>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                  </div>

                  <p className="text-xs font-medium text-[#64748B]">Inclusive of all taxes</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF]">
                    <Info size={16} strokeWidth={2.2} className="text-[#1D4ED8]" />
                  </div>

                  <h2 className="text-base font-extrabold text-[#172033]">About this product</h2>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] p-3.5">
                  <p className="text-sm leading-6 text-[#64748B]">{product.description || 'No description available.'}</p>
                </div>
              </div>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mt-7">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-[#172033]">Select Size</h2>

                      <p className="mt-1 text-xs text-[#64748B]">Choose your preferred size</p>
                    </div>

                    <button type="button" className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#D97706] transition hover:bg-[#FFF7ED]">
                      Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const selected = selectedSize === size

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`relative flex h-12 min-w-16 items-center justify-center overflow-hidden rounded-xl border px-5 text-sm font-extrabold transition-all duration-200 ${
                            selected
                              ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-lg shadow-blue-200'
                              : 'border-[#E2E8F0] bg-white text-[#172033] shadow-sm hover:-translate-y-0.5 hover:border-[#F59E0B] hover:bg-[#FFF7ED] hover:text-[#B45309] hover:shadow-md'
                          }`}
                        >
                          <span>{size}</span>
                        </button>
                      )
                    })}
                  </div>

                  {!selectedSize && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#FFFBEB] px-3 py-2.5">
                      <Info size={14} className="text-[#D97706]" />

                      <p className="text-xs font-medium text-[#92400E]">Please select a size before adding to cart.</p>
                    </div>
                  )}

                  {selectedSize && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-[10px] font-black text-white">✓</div>

                      <p className="text-xs font-semibold text-[#92400E]">
                        Selected Size: <span className="font-extrabold">{selectedSize}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mt-7">
                <h2 className="mb-3 text-base font-extrabold text-[#172033]">Quantity</h2>

                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-12 w-12 items-center justify-center text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={17} strokeWidth={2.5} />
                  </button>

                  <span className="flex h-12 w-14 items-center justify-center border-x border-[#E2E8F0] text-sm font-extrabold text-[#172033]">{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="flex h-12 w-12 items-center justify-center text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={17} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                  <p className="text-xs font-semibold text-[#16A34A]">{product.stock} items available</p>
                </div>
              </div>

              {/* Delivery */}
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#DBEAFE] bg-[#F8FBFF]">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] shadow-sm">
                    <Truck size={20} strokeWidth={2.2} className="text-[#1D4ED8]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-[#172033]">Delivery available</p>

                      <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[9px] font-bold text-[#16A34A]">AVAILABLE</span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{product.deliveryInfo || 'Fast and reliable delivery available.'}</p>
                  </div>
                </div>
              </div>

              {/* Warranty */}
              {product.warrantyType !== 'No Warranty' && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#E9D5FF] bg-linear-to-r from-[#FAF5FF] to-[#F5F3FF] px-4 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShieldCheck size={19} strokeWidth={2.2} className="text-[#7C3AED]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#64748B]">Warranty</p>

                    <p className="mt-0.5 text-sm font-extrabold text-[#292725]">
                      {product.warrantyType}

                      {product.warrantyDuration && ` • ${product.warrantyDuration}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Add To Cart */}
              <div className="mt-7 ">
                <button
                  type="button"
                  onClick={addToCart}
                  className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-linear-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] px-5 text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300 active:translate-y-0"
                >
                  {/* Gold shine */}
                  <span className="absolute inset-y-0 -left-full w-1/3 skew-x-[-20deg] bg-white/15 transition-all duration-700 group-hover:left-[120%]" />

                  <span className="relative flex h-9 w-9 items-center justify-center  shadow-sm">
                    <ShoppingCart size={20} strokeWidth={2.4} className="transition-transform duration-200 group-hover:scale-110" />
                  </span>

                  <span className="relative text-base font-extrabold">Add to Cart</span>

                  <span className="relative h-7 w-px bg-white/25" />

                  <span className="relative rounded-lg bg-white/10 px-3 py-1.5 text-base font-extrabold">{user ? `₹${product.discountPrice * quantity}` : 'Login...'}</span>
                </button>
              </div>

              {/* Bottom Benefits */}
              <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white ">
                {/* Returns */}
                <div className="group flex flex-col items-center justify-center px-2 py-4 text-center transition hover:bg-[#F8FAFC]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] transition group-hover:scale-105">
                    <RotateCcw size={17} strokeWidth={2.2} className="text-[#1D4ED8]" />
                  </div>

                  <p className="mt-2 text-[11px] font-bold text-[#64748B]">Easy Returns</p>
                </div>

                {/* Payment */}
                <div className="group flex flex-col items-center justify-center border-x border-[#E2E8F0] px-2 py-4 text-center transition hover:bg-[#FAF5FF]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F3FF] transition group-hover:scale-105">
                    <ShieldCheck size={17} strokeWidth={2.2} className="text-[#7C3AED]" />
                  </div>

                  <p className="mt-2 text-[11px] font-bold text-[#64748B]">Secure Payment</p>
                </div>

                {/* Genuine */}
                <div className="group flex flex-col items-center justify-center px-2 py-4 text-center transition hover:bg-[#F0FDF4]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECFDF5] transition group-hover:scale-105">
                    <BadgeCheck size={17} strokeWidth={2.2} className="text-[#16A34A]" />
                  </div>

                  <p className="mt-2 text-[11px] font-bold text-[#64748B]">Genuine Product</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. product loop mate */}
      {relatedProducts.length > 0 && (
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#172033]">More from {product.subCategory?.subCategoryName}</h2>

            <p className="mt-1 text-sm text-[#64748B]">Explore more products from this category</p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {relatedProducts.map((item) => (
              <Link key={item._id} to={`/product/${item._id}`} className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition duration-700  hover:scale-102 hover:shadow-lg">
                <div className="flex h-52 items-center justify-center bg-[#FAFBFC] p-4">
                  {item.images?.length > 0 ? (
                    <img src={`http://localhost:3000${item.images[0]}`} alt={item.productName} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="text-sm text-[#99938B]">No Image</span>
                  )}
                </div>

                <div className="border-t border-[#E2E8F0] p-4">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-[#292725]">{item.productName}</h3>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#172033]">₹{item.discountPrice}</span>

                    {item.price > item.discountPrice && <span className="text-xs text-[#99938B] line-through">₹{item.price}</span>}
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <span className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                      {item.rating}
                      <Star size={11} fill="currentColor" />
                    </span>

                    <span className="text-xs text-[#99938B]">Rating</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { ShoppingCart, Star, Minus, Plus, Heart, Truck, ShieldCheck, RotateCcw, BadgeCheck, Info, IndianRupee } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setShowLogin } = useUser()
  const { addToCart, mergeGuestCart } = useCart()

  // para Id
  const [product, setProduct] = useState(null)

  // img ne select krin show krvamate
  const [selectedImage, setSelectedImage] = useState('')

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

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

  // ! Guest bnavu login pela value localstorage ma rakhva mate
  const saveGuestCart = (newQuantity, newSize = selectedSize) => {
    const existingCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')

    const existingItemIndex = existingCart.findIndex((item) => item.productId === product._id && item.size === (newSize || null))

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity = newQuantity
    } else {
      existingCart.push({
        productId: product._id,
        quantity: newQuantity,
        size: newSize || null,
      })
    }

    localStorage.setItem('guest_cart', JSON.stringify(existingCart))
  }

  // ! addtocart button
  const addProductToCart = async () => {
    // Guest User
    if (!user) {
      setShowLogin(true)
      saveGuestCart(quantity, selectedSize)
      return
    }

    // Size check
    if (product.sizes?.length > 0 && !selectedSize) {
      return
    }

    // Check Guest Cart
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')

    // Guest cart available
    if (guestCart.length > 0) {
      const res = await mergeGuestCart()

      if (res.success) {
        navigate('/cart')
      } else {
        console.log('Merge cart error:', res.message)
      }

      return
    }

    // Normal Logged-in User
    const res = await addToCart({
      productId: product._id,
      quantity,
      size: selectedSize || null,
    })

    if (res.success) {
      navigate('/cart')
    } else {
      console.log('Add to cart error:', res.message)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      const newQuantity = quantity + 1

      setQuantity(newQuantity)

      if (!user) {
        saveGuestCart(newQuantity)
      }
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1

      setQuantity(newQuantity)

      if (!user) {
        saveGuestCart(newQuantity)
      }
    }
  }

  // ! localstorage mathi value get kri ne SHOW krva mate
  useEffect(() => {
    const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')

    const item = guestCart.find((item) => item.productId === id)

    if (!item) {
      return
    }

    setQuantity(item.quantity || 1)
    setSelectedSize(item.size || '')
  }, [id])

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading product...</p>
      </div>
    )
  }

  // ! BreadCrumb

  const items = [
    { title: `${product.category?.categoryName}`, link: `/category/${product?.category?._id}/products` },
    { title: `${product.subCategory?.subCategoryName}`, link: null },
  ]

  return (
    <div className="min-h-screen ">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-5 ">
        {/* Main Product */}
        <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-[53%_47%]">
            {/* leftside */}
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

            {/* rightside */}
            <div className="max-h-[calc(100vh-100px)] no-scrollbar overflow-y-auto bg-white p-5 sm:p-6 lg:p-7">
              {/* Product Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-md bg-[#FFF7ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">{product.category?.categoryName}</span>

                  <h1 className="mt-2.5 text-xl font-bold leading-7 tracking-tight text-[#292725] sm:text-2xl">{product.productName}</h1>
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E3DED6] bg-white text-[#6F6A64] shadow-sm transition-all duration-200 hover:border-[#F9A8D4] hover:bg-[#FDF2F8] hover:text-[#DB2777]"
                >
                  <Heart size={19} strokeWidth={2} className="transition-transform duration-200 group-hover:scale-110" />
                </button>
              </div>

              {/* Brand */}
              {product.brand?.brandName && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF7ED]">
                    <BadgeCheck size={14} className="text-[#D97706]" />
                  </div>

                  <p className="text-xs text-[#6F6A64]">
                    Brand: <span className="font-semibold text-[#292725]">{product.brand.brandName}</span>
                  </p>
                </div>
              )}

              {/* Rating */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 rounded-md bg-[#16A34A] px-2.5 py-1 text-xs font-bold text-white">
                  <Star size={13} fill="currentColor" strokeWidth={2} />

                  <span>{product.rating}</span>
                </div>

                <span className="text-xs text-[#6F6A64]">Customer Rating</span>

                {product.soldCount > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />

                    <span className="text-xs font-medium text-[#6F6A64]">{product.soldCount}+ sold</span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-[#E3DED6]" />

              {/* Price Card */}
              <div className="rounded-xl border border-[#E3DED6] bg-[#FFFBF5] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-extrabold tracking-tight text-[#292725]">₹{product.discountPrice}</span>

                  {product.price > product.discountPrice && (
                    <>
                      <span className="text-sm text-[#99938B] line-through">₹{product.price}</span>

                      <span className="rounded-md bg-[#FEF3C7] px-2 py-1 text-[10px] font-bold text-[#B45309]">{product.discount}% OFF</span>
                    </>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                  <p className="text-[11px] text-[#6F6A64]">Inclusive of all taxes</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FFF7ED]">
                    <Info size={15} strokeWidth={2} className="text-[#D97706]" />
                  </div>

                  <h2 className="text-sm font-bold text-[#292725]">About this product</h2>
                </div>

                <div className="rounded-lg bg-[#F8F6F2] p-3">
                  <p className="text-xs leading-5 text-[#6F6A64]">{product.description || 'No description available.'}</p>
                </div>
              </div>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[#292725]">Select Size</h2>

                      <p className="mt-0.5 text-[11px] text-[#6F6A64]">Choose your preferred size</p>
                    </div>

                    <button type="button" className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#B45309] transition hover:bg-[#FFF7ED]">
                      Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => {
                      const selected = selectedSize === size

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size)

                            if (!user) {
                              saveGuestCart(quantity, size)
                            }
                          }}
                          className={`flex h-10 min-w-14 items-center justify-center rounded-lg border px-4 text-xs font-bold transition-all duration-200 ${
                            selected ? 'border-[#D97706] bg-[#F59E0B] text-white shadow-sm' : 'border-[#E3DED6] bg-white text-[#292725] hover:border-[#F59E0B] hover:bg-[#FFF7ED] hover:text-[#B45309]'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>

                  {!selectedSize && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#FFFBEB] px-3 py-2">
                      <Info size={13} className="shrink-0 text-[#D97706]" />

                      <p className="text-[11px] text-[#92400E]">Please select a size before adding to cart.</p>
                    </div>
                  )}

                  {selectedSize && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#FFFBEB] px-3 py-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-[9px] font-bold text-white">✓</div>

                      <p className="text-[11px] font-medium text-[#92400E]">
                        Selected Size: <span className="font-bold">{selectedSize}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <h2 className="mb-2.5 text-sm font-bold text-[#292725]">Quantity</h2>

                <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#E3DED6] bg-white">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center text-[#6F6A64] transition hover:bg-[#FFF7ED] hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>

                  <span className="flex h-10 w-12 items-center justify-center border-x border-[#E3DED6] text-sm font-bold text-[#292725]">{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="flex h-10 w-10 items-center justify-center text-[#6F6A64] transition hover:bg-[#FFF7ED] hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                  <p className="text-[11px] font-medium text-[#16A34A]">{product.stock} items available</p>
                </div>
              </div>

              {/* Delivery */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Truck size={18} strokeWidth={2} className="text-[#D97706]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#292725]">Delivery available</p>

                    <span className="rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[9px] font-bold text-[#16A34A]">AVAILABLE</span>
                  </div>

                  <p className="mt-0.5 text-[11px] leading-4 text-[#6F6A64]">{product.deliveryInfo || 'Fast and reliable delivery available.'}</p>
                </div>
              </div>

              {/* Warranty */}
              {product.warrantyType !== 'No Warranty' && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3.5 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <ShieldCheck size={17} strokeWidth={2} className="text-[#7C3AED]" />
                  </div>

                  <div>
                    <p className="text-[11px] text-[#6F6A64]">Warranty</p>

                    <p className="mt-0.5 text-xs font-bold text-[#292725]">
                      {product.warrantyType}

                      {product.warrantyDuration && ` • ${product.warrantyDuration}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Add To Cart */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={addProductToCart}
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#F59E0B] px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#D97706] hover:shadow-md active:scale-[0.99]"
                >
                  <ShoppingCart size={18} strokeWidth={2.2} />

                  <span>{user ? 'Add to Cart' : 'Login to Add'}</span>

                  {user && (
                    <>
                      <span className="h-5 w-px bg-white/40" />

                      <span className="flex items-center gap-0.5 text-lg font-extrabold">
                        <IndianRupee size={16} strokeWidth={2.5} />

                        {(product.discountPrice * quantity).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Benefits */}
              <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-[#E3DED6] bg-white">
                {/* Returns */}
                <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF7ED]">
                    <RotateCcw size={15} strokeWidth={2} className="text-[#D97706]" />
                  </div>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#6F6A64]">Easy Returns</p>
                </div>

                {/* Payment */}
                <div className="flex flex-col items-center justify-center border-x border-[#E3DED6] px-2 py-3.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F3FF]">
                    <ShieldCheck size={15} strokeWidth={2} className="text-[#7C3AED]" />
                  </div>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#6F6A64]">Secure Payment</p>
                </div>

                {/* Genuine */}
                <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF5]">
                    <BadgeCheck size={15} strokeWidth={2} className="text-[#16A34A]" />
                  </div>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#6F6A64]">Genuine Product</p>
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

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_8px_25px_rgba(29,78,216,0.10)]"
              >
                {/* Product Image */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#F8FAFC] p-4">
                  {item.images?.length > 0 ? (
                    <img src={`http://localhost:3000${item.images[0]}`} alt={item.productName} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="text-sm text-[#94A3B8]">No Image</span>
                  )}

                  {/* Discount Badge */}
                  {item.price > item.discountPrice && <span className="absolute left-3 top-3 rounded-md bg-[#16A34A] px-2 py-1 text-[10px] font-bold text-white">{item.discount}% OFF</span>}
                </div>

                {/* Product Info */}
                <div className="border-t border-[#E2E8F0] p-4">
                  {/* Product Name */}
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#172033] transition-colors group-hover:text-[#1D4ED8]">{item.productName}</h3>

                  {/* Price */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-extrabold text-[#172033]">₹{item.discountPrice.toLocaleString('en-IN')}</span>

                    {item.price > item.discountPrice && <span className="text-xs font-medium text-[#94A3B8] line-through">₹{item.price.toLocaleString('en-IN')}</span>}
                  </div>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-[#16A34A] px-2 py-1 text-xs font-bold text-white">
                      {item.rating}
                      <Star size={11} fill="currentColor" strokeWidth={2} />
                    </span>

                    <span className="text-[11px] font-medium text-[#64748B]">Rating</span>
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

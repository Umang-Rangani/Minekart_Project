import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { ShoppingCart, Star, Minus, Plus, Trash2, Truck, ShieldCheck, RotateCcw, BadgeCheck, Info, ChevronRight } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function ProductDetail() {
  const { id } = useParams()
  const { user, setShowLogin } = useUser()
  const { cart, addToCart, increaseCartItem, decreaseCartItem } = useCart()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(0)

  const navigate = useNavigate()

  // ! toast
  const [toast, setToast] = useState('')

  // Get Related Products
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

  // Get Product
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

  // Cart Quantity Sync
  useEffect(() => {
    if (!cart?.items || !product) return

    const cartItem = cart.items.find((item) => item.productId?._id?.toString() === product._id?.toString() && item.size === (selectedSize || null))

    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(0)
    }
  }, [cart, product, selectedSize])

  // ! Add To Cart
  const addProductToCart = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setToast('Please select a size before adding to cart.')

      setTimeout(() => {
        setToast('')
      }, 2500)

      return
    }

    // ⚡ Instant UI update
    setQuantity(1)

    try {
      const res = await addToCart({
        productId: product._id,
        quantity: 1,
        size: selectedSize || null,
      })

      if (!res.success) {
        setQuantity(0)

        setToast(res.message || 'Unable to add product to cart.')

        setTimeout(() => {
          setToast('')
        }, 2500)

        console.log('Add to cart error:', res.message)
      }
    } catch (error) {
      setQuantity(0)

      setToast('Something went wrong. Please try again.')

      setTimeout(() => {
        setToast('')
      }, 2500)

      console.log('Add to cart error:', error)
    }
  }

  // ! Increase Quantity
  const increaseQuantity = async () => {
    if (quantity >= product.stock) {
      return
    }

    // ⚡ UI immediately update
    setQuantity((prev) => prev + 1)

    try {
      const res = await increaseCartItem({
        productId: product._id,
        size: selectedSize || null,
      })

      if (!res.success) {
        // API fail → rollback
        setQuantity((prev) => Math.max(prev - 1, 0))

        console.log('Increase quantity error:', res.message)
      }
    } catch (error) {
      // API fail → rollback
      setQuantity((prev) => Math.max(prev - 1, 0))

      console.log('Increase quantity error:', error)
    }
  }

  // ! Decrease Quantity
  const decreaseQuantity = async () => {
    if (quantity <= 0) {
      return
    }

    // ⚡ UI immediately update
    setQuantity((prev) => prev - 1)

    try {
      const res = await decreaseCartItem({
        productId: product._id,
        size: selectedSize || null,
      })

      if (!res.success) {
        // API fail → rollback
        setQuantity((prev) => prev + 1)

        console.log('Decrease quantity error:', res.message)
      }
    } catch (error) {
      // API fail → rollback
      setQuantity((prev) => prev + 1)

      console.log('Decrease quantity error:', error)
    }
  }

  // Loading
  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />
          <p className="text-sm font-medium text-[#806C63]">Loading product...</p>
        </div>
      </div>
    )
  }

  // Breadcrumb
  const items = [
    {
      title: product.category?.categoryName,
      link: `/category/${product?.category?._id}/products`,
    },
    {
      title: product.subCategory?.subCategoryName,
      link: null,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed right-5 top-5 z-9999 animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-4 py-3 shadow-[0_10px_30px_rgba(73,54,49,0.18)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF3E8]">
              <Info size={16} className="text-[#B87935]" />
            </div>

            <p className="text-xs font-semibold text-[#493631]">{toast}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <BreadCrumb items={items} />

      {/* Product Detail */}
      <section className="mx-auto pt-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[53%_47%]">
          {/* Left - Product Images */}
          <div className="self-start overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.06)] lg:sticky lg:top-28">
            <div className="p-3 sm:p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Thumbnails */}
                <div className="order-2 flex gap-3 overflow-x-auto px-1 pb-1 sm:order-1 sm:w-19 sm:flex-col sm:overflow-visible sm:px-0 sm:pb-0">
                  {product.images?.map((image, index) => {
                    const selected = selectedImage === image

                    return (
                      <button
                        key={index}
                        type="button"
                        onMouseEnter={() => setSelectedImage(image)}
                        onClick={() => setSelectedImage(image)}
                        className={`group relative flex h-17 w-17 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2.5 transition-all duration-200 ${
                          selected ? 'border-[#A51D26] bg-[#FFF8F5] shadow-sm ring-1 ring-[#A51D26]/20' : 'border-[#E8DDD4] hover:border-[#CDAFA4] hover:shadow-sm'
                        }`}
                      >
                        <img src={`http://localhost:3000${image}`} alt={`${product.productName} ${index + 1}`} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />

                        {selected && <span className="absolute bottom-0.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-[#A51D26]" />}
                      </button>
                    )
                  })}
                </div>

                {/* Main Image */}
                <div className="relative order-1 flex min-h-95 flex-1 items-center justify-center overflow-hidden rounded-xl bg-white p-5 sm:min-h-127 sm:p-8">
                  {/* Subtle decorative elements */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#A51D26]/3" />
                  <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#D4A373]/[0.035]" />

                  {selectedImage ? (
                    <img src={`http://localhost:3000${selectedImage}`} alt={product.productName} className="relative z-10 max-h-118 w-full object-contain transition-transform duration-500 hover:scale-[1.035]" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#806C63]">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E8E1]">
                        <Info size={24} />
                      </div>

                      <p className="text-sm font-medium">No image available</p>
                    </div>
                  )}

                  {/* Image Counter */}
                  {product.images?.length > 0 && (
                    <div className="absolute bottom-4 right-4 z-20 rounded-lg border border-[#E8DDD4] bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#67544D] shadow-sm">
                      {product.images.findIndex((image) => image === selectedImage) + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Product Information */}
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-5 shadow-[0_5px_20px_rgba(73,54,49,0.06)] sm:p-6 lg:p-7">
            {/* Product Header */}
            <div>
              <span className="inline-flex items-center rounded-lg bg-[#F7EEE7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#8E181F]">{product.category?.categoryName}</span>

              <h1 className="mt-3 text-xl font-extrabold leading-7 tracking-tight text-[#351C18] sm:text-2xl lg:text-[27px] lg:leading-9">{product.productName}</h1>
            </div>

            {/* Brand */}
            {product.brand?.brandName && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7]">
                  <BadgeCheck size={15} strokeWidth={2} className="text-[#A51D26]" />
                </div>

                <p className="text-xs text-[#806C63]">
                  Brand: <span className="font-bold text-[#493631]">{product.brand.brandName}</span>
                </p>
              </div>
            )}

            {/* Rating */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-lg bg-[#8E181F] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm">
                <Star size={13} fill="currentColor" strokeWidth={2} />
                <span>{product.rating}</span>
              </div>

              <span className="text-xs text-[#806C63]">Customer Rating</span>

              {product.soldCount > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#D5C7C0]" />
                  <span className="text-xs font-medium text-[#806C63]">{product.soldCount}+ sold</span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-[#E8DDD4]" />

            {/* Price */}
            <div className="rounded-2xl border border-[#E8DDD4] bg-linear-to-br from-[#FFFDFC] to-[#FBF3ED] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-extrabold tracking-tight text-[#351C18]">₹{product.discountPrice?.toLocaleString('en-IN')}</span>

                {product.price > product.discountPrice && (
                  <>
                    <span className="text-sm text-[#9A857B] line-through">₹{product.price?.toLocaleString('en-IN')}</span>
                    <span className="rounded-lg bg-[#8E181F] px-2 py-1 text-[10px] font-bold text-white">{product.discount}% OFF</span>
                  </>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3E8B62]" />
                <p className="text-[11px] text-[#806C63]">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7]">
                  <Info size={15} strokeWidth={2} className="text-[#A51D26]" />
                </div>

                <h2 className="text-sm font-bold text-[#351C18]">About this product</h2>
              </div>

              <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                <p className="text-xs leading-5 text-[#806C63]">{product.description || 'No description available.'}</p>
              </div>
            </div>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <div className="mb-3">
                  <h2 className="text-sm font-bold text-[#351C18]">Select Size</h2>
                  <p className="mt-0.5 text-[11px] text-[#806C63]">Choose your preferred size</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => {
                    const selected = selectedSize === size

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-10 min-w-14 items-center justify-center rounded-xl border px-4 text-xs font-bold transition-all duration-300 ${selected ? 'border-[#8E181F] bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#8E181F]/20' : 'border-[#E3D6CE] bg-white text-[#493631] hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#8E181F]'}`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>

                {!selectedSize && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-[#E9D9C9] bg-[#FFF8EF] px-3 py-2">
                    <Info size={13} className="shrink-0 text-[#B87935]" />
                    <p className="text-[11px] text-[#8B5E34]">Please select a size before adding to cart.</p>
                  </div>
                )}

                {selectedSize && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-[#E6D8D0] bg-[#F8EEE8] px-3 py-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8E181F] text-[9px] font-bold text-white">✓</div>

                    <p className="text-[11px] font-medium text-[#67544D]">
                      Selected Size: <span className="font-bold text-[#8E181F]">{selectedSize}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Delivery */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <Truck size={18} strokeWidth={2} className="text-[#8E181F]" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold text-[#351C18]">Delivery available</p>
                  <span className="rounded-full bg-[#EAF4ED] px-1.5 py-0.5 text-[9px] font-bold text-[#3E8B62]">AVAILABLE</span>
                </div>

                <p className="mt-0.5 text-[11px] leading-4 text-[#806C63]">{product.deliveryInfo || 'Fast and reliable delivery available.'}</p>
              </div>
            </div>

            {/* Warranty */}
            {product.warrantyType !== 'No Warranty' && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3.5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <ShieldCheck size={17} strokeWidth={2} className="text-[#7D171C]" />
                </div>

                <div>
                  <p className="text-[11px] text-[#806C63]">Warranty</p>

                  <p className="mt-0.5 text-xs font-bold text-[#351C18]">
                    {product.warrantyType}
                    {product.warrantyDuration && ` • ${product.warrantyDuration}`}
                  </p>
                </div>
              </div>
            )}

            {/* Add To Cart */}
            <div className="mx-auto grid w-full grid-cols-1 gap-5 sm:grid-cols-2 mt-15">
              {/* Continue Shopping */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="group flex h-12 w-full items-center justify-between rounded-xl border border-[#E2D5CC] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                    <ShoppingCart size={16} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-extrabold text-[#351C18]">Continue Shopping</p>
                  </div>
                </div>
              </button>

              {/* Add To Cart / Quantity */}
              <div className="w-full ">
                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={addProductToCart}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] via-[#8E181F] to-[#A51D26] px-5 text-sm font-bold text-white shadow-lg shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7D171C]/25 active:scale-[0.98]"
                  >
                    <ShoppingCart size={18} strokeWidth={2.2} className="transition-transform duration-300 group-hover:-translate-x-0.5" />

                    <span>Add to cart</span>
                  </button>
                ) : (
                  <div className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-[#D7C6BC] bg-[#FBF7F2] shadow-sm">
                    {/* Minus */}
                    <button type="button" onClick={decreaseQuantity} className="flex h-full w-14 shrink-0 items-center justify-center border-r border-[#E3D6CE] text-[#493631] transition-all duration-200 hover:bg-[#F3E4DC] hover:text-[#8E181F]">
                      {quantity === 1 ? <Trash2 size={18} strokeWidth={2.2} /> : <Minus size={19} strokeWidth={2.5} />}
                    </button>

                    {/* Quantity */}
                    <div className="flex h-full flex-1 items-center justify-center">
                      <span className="text-sm font-bold text-[#351C18]">{quantity} in cart</span>
                    </div>

                    {/* Plus */}
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-full w-14 shrink-0 items-center justify-center border-l border-[#E3D6CE] text-[#493631] transition-all duration-200 hover:bg-[#F3E4DC] hover:text-[#8E181F] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={19} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                {/* Stock */}
                <div className="mt-2 flex h-4 items-center justify-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3E8B62]" />
                  <p className="text-[11px] text-[#806C63]">{product.stock} items available</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white">
              {/* Returns */}
              <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7EEE7]">
                  <RotateCcw size={15} strokeWidth={2} className="text-[#8E181F]" />
                </div>

                <p className="mt-1.5 text-[10px] font-semibold text-[#806C63]">Easy Returns</p>
              </div>

              {/* Payment */}
              <div className="flex flex-col items-center justify-center border-x border-[#E8DDD4] px-2 py-3.5 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7EEE7]">
                  <ShieldCheck size={15} strokeWidth={2} className="text-[#8E181F]" />
                </div>

                <p className="mt-1.5 text-[10px] font-semibold text-[#806C63]">Secure Payment</p>
              </div>

              {/* Genuine */}
              <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7EEE7]">
                  <BadgeCheck size={15} strokeWidth={2} className="text-[#8E181F]" />
                </div>

                <p className="mt-1.5 text-[10px] font-semibold text-[#806C63]">Genuine Product</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-linear-to-r from-[#7D171C] to-[#B5262D]" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A857B]">You may also like</span>
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">More from {product.subCategory?.subCategoryName}</h2>

                <p className="mt-1 text-sm text-[#806C63]">Explore more products from this category</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D7C3B9] hover:shadow-[0_14px_32px_rgba(73,54,49,0.12)]"
                >
                  {/* Product Image */}
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-white p-4 sm:h-52">
                    {/* Soft decorative circle */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#A51D26]/3 transition-transform duration-500 group-hover:scale-150" />

                    {item.images?.length > 0 ? (
                      <img src={`http://localhost:3000${item.images[0]}`} alt={item.productName} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#9A857B]">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EEE7]">
                          <Info size={18} />
                        </div>

                        <span className="text-xs font-medium">No Image</span>
                      </div>
                    )}

                    {/* Discount */}
                    {item.price > item.discountPrice && <span className="absolute left-3 top-3 z-20 rounded-md bg-[#A51D26] px-2 py-1 text-[10px] font-bold text-white shadow-sm">{item.discount}% OFF</span>}
                  </div>

                  {/* Product Info */}
                  <div className="border-t border-[#E8DDD4] bg-white p-3.5 transition-colors duration-300 group-hover:bg-[#FFFCFA]">
                    {/* Product Name */}
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]">{item.productName}</h3>

                    {/* Price */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-extrabold tracking-tight text-[#351C18]">₹{item.discountPrice?.toLocaleString('en-IN')}</span>

                      {item.price > item.discountPrice && <span className="text-xs font-medium text-[#9A857B] line-through">₹{item.price?.toLocaleString('en-IN')}</span>}
                    </div>

                    {/* Rating */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-1 rounded-md bg-[#388E3C] px-2 py-1 text-[10px] font-bold text-white">
                        {item.rating}
                        <Star size={10} fill="currentColor" strokeWidth={2} />
                      </span>

                      <span className="text-[10px] font-medium text-[#9A857B]">{item.soldCount ? `${item.soldCount}+ sold` : 'Product rating'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  )
}

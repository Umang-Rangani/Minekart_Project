import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Star, Minus, Plus, Trash2, Truck, ShieldCheck, RotateCcw, BadgeCheck, Info, ChevronRight, Tag, AlertCircle, PackageCheck, XCircle } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user, setShowLogin } = useUser()
  const { cart, addToCart, increaseCartItem, decreaseCartItem } = useCart()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  // Product status
  const isInactive = product?.status === 'Inactive'
  const isOutOfStock = product?.stock <= 0
  const isDisabled = isInactive || isOutOfStock

  const hasDiscount = product && product.discount > 0 && product.price > product.discountPrice

  const displayPrice = product?.discountPrice > 0 ? product.discountPrice : product?.price || 0

  // Toast
  const showToast = (message) => {
    setToast(message)

    setTimeout(() => {
      setToast('')
    }, 2500)
  }

  // Get related products
  const getRelatedProducts = async (subCategoryId) => {
    try {
      const res = await axiosInstance.get(`/product/related/${subCategoryId}/${id}`)

      setRelatedProducts(res.data?.data || [])
    } catch (error) {
      console.error('Get related products error:', error.response?.data || error.message)

      setRelatedProducts([])
    }
  }

  // Get Product
  const getProduct = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/product/${id}`)

      const data = res.data?.data

      if (!data) {
        setProduct(null)
        return
      }

      setProduct(data)

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0])
      } else {
        setSelectedImage('')
      }

      setSelectedSize('')

      if (data.subCategory?._id) {
        getRelatedProducts(data.subCategory._id)
      } else {
        setRelatedProducts([])
      }

      document.title = `${data.productName} | MineKart`
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)

      setProduct(null)
      setRelatedProducts([])
    } finally {
      setLoading(false)
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

  // Add Product
  const addProductToCart = async () => {
    if (isDisabled) {
      showToast(isInactive ? 'This product is currently unavailable.' : 'This product is out of stock.')
      return
    }

    if (!user) {
      setShowLogin(true)
      return
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      showToast('Please select a size before adding to cart.')
      return
    }

    setQuantity(1)

    try {
      const res = await addToCart({
        productId: product._id,
        quantity: 1,
        size: selectedSize || null,
      })

      if (!res?.success) {
        setQuantity(0)
        showToast(res?.message || 'Unable to add product to cart.')
      }
    } catch (error) {
      setQuantity(0)

      showToast('Something went wrong. Please try again.')

      console.log('Add to cart error:', error)
    }
  }

  // Increase Quantity
  const increaseQuantity = async () => {
    if (isDisabled) return

    if (quantity >= product.stock) {
      showToast('Maximum available stock reached.')
      return
    }

    setQuantity((prev) => prev + 1)

    try {
      const res = await increaseCartItem({
        productId: product._id,
        size: selectedSize || null,
      })

      if (!res?.success) {
        setQuantity((prev) => Math.max(prev - 1, 0))
        showToast(res?.message || 'Unable to increase quantity.')
      }
    } catch (error) {
      setQuantity((prev) => Math.max(prev - 1, 0))
      console.log('Increase quantity error:', error)
    }
  }

  // Decrease Quantity
  const decreaseQuantity = async () => {
    if (quantity <= 0) return

    setQuantity((prev) => Math.max(prev - 1, 0))

    try {
      const res = await decreaseCartItem({
        productId: product._id,
        size: selectedSize || null,
      })

      if (!res?.success) {
        setQuantity((prev) => prev + 1)
        showToast(res?.message || 'Unable to decrease quantity.')
      }
    } catch (error) {
      setQuantity((prev) => prev + 1)
      console.log('Decrease quantity error:', error)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF7F2]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />
          <p className="text-sm font-medium text-[#806C63]">Loading product...</p>
        </div>
      </div>
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBF7F2]">
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F3F3] text-[#888888]">
            <XCircle size={30} strokeWidth={1.6} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#351C18]">Product Not Found</h1>

          <p className="mt-2 text-sm leading-6 text-[#806C63]">This product may have been removed or is no longer available.</p>

          <Link to="/" className="mt-5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const items = [
    {
      title: product.category?.categoryName,
      link: `/category/${product.category?._id}/products`,
    },
    {
      title: product.subCategory?.subCategoryName,
      link: null,
    },
  ]

  return (
    <div className="min-h-screen ">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-5 z-9999 animate-[slideIn_0.3s_ease-out] sm:right-5">
          <div className="flex max-w-xs items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-4 py-3 shadow-[0_10px_30px_rgba(73,54,49,0.18)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF3E8]">
              <Info size={16} className="text-[#B87935]" />
            </div>

            <p className="text-xs font-semibold text-[#493631]">{toast}</p>
          </div>
        </div>
      )}

      <BreadCrumb items={items} />

      <section className="mx-auto w-full pb-10 pt-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[53%_47%]">
          {/* LEFT - IMAGES */}
          <div className={`self-start overflow-hidden rounded-2xl border shadow-[0_5px_20px_rgba(73,54,49,0.06)] lg:sticky lg:top-28 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#E8DDD4] bg-white'}`}>
            <div className="p-3 sm:p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* THUMBNAILS */}
                <div className="order-2 flex gap-3 overflow-x-auto px-1 pb-1 sm:order-1 sm:w-19 sm:flex-col sm:overflow-visible sm:px-0 sm:pb-0">
                  {product.images?.map((image, index) => {
                    const selected = selectedImage === image

                    return (
                      <button
                        key={index}
                        type="button"
                        onMouseEnter={() => setSelectedImage(image)}
                        onClick={() => setSelectedImage(image)}
                        className={`group relative flex h-17 w-17 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2.5 transition-all duration-200 ${
                          isDisabled ? 'cursor-not-allowed border-[#D9D9D9] bg-[#F3F3F3]' : selected ? 'border-[#A51D26] bg-[#FFF8F5] shadow-sm ring-1 ring-[#A51D26]/20' : 'border-[#E8DDD4] bg-white hover:border-[#CDAFA4] hover:shadow-sm'
                        }`}
                      >
                        <img
                          src={`http://localhost:3000${image}`}
                          alt={`${product.productName} ${index + 1}`}
                          className={`h-full w-full object-contain transition-transform duration-300 ${isDisabled ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}
                        />

                        {!isDisabled && selected && <span className="absolute bottom-0.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-[#A51D26]" />}
                      </button>
                    )
                  })}
                </div>

                {/* MAIN IMAGE */}
                <div className={`relative order-1 flex min-h-95 flex-1 items-center justify-center overflow-hidden rounded-xl p-5 sm:min-h-127 sm:p-8 ${isDisabled ? 'bg-[#EEEEEE]' : 'bg-white'}`}>
                  <div className={`pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full ${isDisabled ? 'bg-[#D9D9D9]' : 'bg-[#A51D26]/3'}`} />

                  <div className={`pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full ${isDisabled ? 'bg-[#E2E2E2]' : 'bg-[#D4A373]/[0.035]'}`} />

                  {selectedImage ? (
                    <img
                      src={`http://localhost:3000${selectedImage}`}
                      alt={product.productName}
                      className={`relative z-10 max-h-118 w-full object-contain transition-transform duration-500 ${isDisabled ? 'grayscale opacity-50' : 'hover:scale-[1.035]'}`}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#888888]">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5E5E5]">
                        <Info size={24} />
                      </div>

                      <p className="text-sm font-medium">No image available</p>
                    </div>
                  )}

                  {/* Disabled Overlay */}
                  {isDisabled && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#F3F3F3]/45">
                      <div className="flex items-center gap-2 rounded-xl border border-[#D1D1D1] bg-[#F3F3F3]/95 px-4 py-2.5 shadow-sm">
                        {isInactive ? <XCircle size={17} className="text-[#888888]" /> : <PackageCheck size={17} className="text-[#888888]" />}

                        <span className="text-xs font-extrabold text-[#777777]">{isInactive ? 'Currently Unavailable' : 'Out of Stock'}</span>
                      </div>
                    </div>
                  )}

                  {/* Image Counter */}
                  {product.images?.length > 0 && (
                    <div className="absolute bottom-4 right-4 z-30 rounded-lg border border-[#E8DDD4] bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#67544D] shadow-sm">
                      {product.images.findIndex((image) => image === selectedImage) + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - INFORMATION */}
          <div className={`overflow-hidden rounded-2xl border p-5 shadow-[0_5px_20px_rgba(73,54,49,0.06)] sm:p-6 lg:p-7 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#E8DDD4] bg-[#FFFDFC]'}`}>
            {/* STATUS */}
            {isDisabled && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#D9D9D9] bg-[#E8E8E8] px-3.5 py-3">
                <AlertCircle size={17} className="text-[#888888]" />

                <div>
                  <p className="text-xs font-extrabold text-[#666666]">{isInactive ? 'Product currently unavailable' : 'Product out of stock'}</p>

                  <p className="mt-0.5 text-[10px] text-[#888888]">{isInactive ? 'This product is not available for purchase right now.' : 'This product is temporarily out of stock.'}</p>
                </div>
              </div>
            )}

            {/* PRODUCT HEADER */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${isDisabled ? 'bg-[#E5E5E5] text-[#888888]' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>
                  {product.category?.categoryName}
                </span>

                {product.isOffer && (
                  <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${isDisabled ? 'bg-[#E2E2E2] text-[#888888]' : 'bg-[#A51D26] text-white'}`}>
                    <Tag size={11} />
                    SPECIAL OFFER
                  </span>
                )}
              </div>

              <h1 className={`mt-3 text-xl font-extrabold leading-7 tracking-tight sm:text-2xl lg:text-[27px] lg:leading-9 ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>{product.productName}</h1>
            </div>

            {/* BRAND */}
            {product.brand?.brandName && (
              <div className="mt-3 flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDisabled ? 'bg-[#E5E5E5]' : 'bg-[#F7EEE7]'}`}>
                  <BadgeCheck size={15} strokeWidth={2} className={isDisabled ? 'text-[#999999]' : 'text-[#A51D26]'} />
                </div>

                <p className={`text-xs ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>
                  Brand: <span className={`font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#493631]'}`}>{product.brand.brandName}</span>
                </p>
              </div>
            )}

            {/* RATING */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold shadow-sm ${isDisabled ? 'bg-[#D9D9D9] text-[#888888]' : 'bg-[#8E181F] text-white'}`}>
                <Star size={13} fill="currentColor" strokeWidth={2} />
                <span>{product.rating || '0.0'}</span>
              </div>

              <span className={`text-xs ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Customer Rating</span>

              {product.soldCount > 0 && (
                <>
                  <span className={`h-1 w-1 rounded-full ${isDisabled ? 'bg-[#C5C5C5]' : 'bg-[#D5C7C0]'}`} />

                  <span className={`text-xs font-medium ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>
                </>
              )}
            </div>

            <div className={`my-5 h-px ${isDisabled ? 'bg-[#D9D9D9]' : 'bg-[#E8DDD4]'}`} />

            {/* PRICE */}
            <div className={`rounded-2xl border p-4 ${isDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#E8DDD4] bg-linear-to-br from-[#FFFDFC] to-[#FBF3ED]'}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-2xl font-extrabold tracking-tight ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>

                {hasDiscount && (
                  <>
                    <span className={`text-sm line-through ${isDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>₹{product.price?.toLocaleString('en-IN')}</span>

                    <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${isDisabled ? 'bg-[#D9D9D9] text-[#888888]' : 'bg-[#8E181F] text-white'}`}>{product.discount}% OFF</span>
                  </>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isDisabled ? 'bg-[#999999]' : 'bg-[#3E8B62]'}`} />

                <p className={`text-[11px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Inclusive of all taxes</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <div className="mb-2.5 flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDisabled ? 'bg-[#E5E5E5]' : 'bg-[#F7EEE7]'}`}>
                  <Info size={15} strokeWidth={2} className={isDisabled ? 'text-[#999999]' : 'text-[#A51D26]'} />
                </div>

                <h2 className={`text-sm font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>About this product</h2>
              </div>

              <div className={`rounded-xl border p-3.5 ${isDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#E8DDD4] bg-[#FBF7F2]'}`}>
                <p className={`text-xs leading-5 ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{product.description || 'No description available.'}</p>
              </div>
            </div>

            {/* SIZE */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <div className="mb-3">
                  <h2 className={`text-sm font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>Select Size</h2>

                  <p className={`mt-0.5 text-[11px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Choose your preferred size</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((size) => {
                    const selected = selectedSize === size

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-10 min-w-14 items-center justify-center rounded-xl border px-4 text-xs font-bold transition-all duration-300 ${
                          isDisabled
                            ? 'cursor-not-allowed border-[#D9D9D9] bg-[#E8E8E8] text-[#999999]'
                            : selected
                              ? 'border-[#8E181F] bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#8E181F]/20'
                              : 'border-[#E3D6CE] bg-white text-[#493631] hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#8E181F]'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>

                {!isDisabled && !selectedSize && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-[#E9D9C9] bg-[#FFF8EF] px-3 py-2">
                    <Info size={13} className="shrink-0 text-[#B87935]" />

                    <p className="text-[11px] text-[#8B5E34]">Please select a size before adding to cart.</p>
                  </div>
                )}

                {!isDisabled && selectedSize && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl border border-[#E6D8D0] bg-[#F8EEE8] px-3 py-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8E181F] text-[9px] font-bold text-white">✓</div>

                    <p className="text-[11px] font-medium text-[#67544D]">
                      Selected Size: <span className="font-bold text-[#8E181F]">{selectedSize}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STOCK STATUS */}
            <div className={`mt-5 flex items-center gap-3 rounded-xl border p-3.5 ${isDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#E8DDD4] bg-[#FBF7F2]'}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${isDisabled ? 'bg-[#DCDCDC]' : 'bg-white'}`}>
                {isDisabled ? <AlertCircle size={18} className="text-[#888888]" /> : <Truck size={18} strokeWidth={2} className="text-[#8E181F]" />}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-xs font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>{isInactive ? 'Currently unavailable' : isOutOfStock ? 'Out of stock' : 'Delivery available'}</p>

                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${isDisabled ? 'bg-[#D9D9D9] text-[#888888]' : 'bg-[#EAF4ED] text-[#3E8B62]'}`}>{isInactive ? 'UNAVAILABLE' : isOutOfStock ? 'OUT OF STOCK' : 'AVAILABLE'}</span>
                </div>

                <p className={`mt-0.5 text-[11px] leading-4 ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{isDisabled ? 'This product cannot be purchased right now.' : product.deliveryInfo || 'Fast and reliable delivery available.'}</p>
              </div>
            </div>

            {/* WARRANTY */}
            {product.warrantyType !== 'No Warranty' && (
              <div className={`mt-3 flex items-center gap-3 rounded-xl border px-3.5 py-3 ${isDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#E8DDD4] bg-[#FBF7F2]'}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${isDisabled ? 'bg-[#DCDCDC]' : 'bg-white'}`}>
                  <ShieldCheck size={17} strokeWidth={2} className={isDisabled ? 'text-[#999999]' : 'text-[#7D171C]'} />
                </div>

                <div>
                  <p className={`text-[11px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Warranty</p>

                  <p className={`mt-0.5 text-xs font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>
                    {product.warrantyType}
                    {product.warrantyDuration && ` • ${product.warrantyDuration}`}
                  </p>
                </div>
              </div>
            )}

            {/* RETURN POLICY */}
            {product.returnPolicy && (
              <div className={`mt-3 flex items-center gap-3 rounded-xl border px-3.5 py-3 ${isDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#E8DDD4] bg-[#FBF7F2]'}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${isDisabled ? 'bg-[#DCDCDC]' : 'bg-white'}`}>
                  <RotateCcw size={17} className={isDisabled ? 'text-[#999999]' : 'text-[#8E181F]'} />
                </div>

                <div>
                  <p className={`text-[11px] ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Return Policy</p>

                  <p className={`mt-0.5 text-xs font-bold ${isDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>{product.returnPolicy}</p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
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

                  <p className="truncate text-xs font-extrabold text-[#351C18]">Continue Shopping</p>
                </div>

                <ChevronRight size={16} className="text-[#8E181F] transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* CART */}
              <div className="w-full">
                {isDisabled ? (
                  <button type="button" disabled className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#D9D9D9] bg-[#DCDCDC] px-5 text-sm font-bold text-[#888888]">
                    {isInactive ? <XCircle size={18} /> : <PackageCheck size={18} />}

                    <span>{isInactive ? 'Currently Unavailable' : 'Out of Stock'}</span>
                  </button>
                ) : quantity === 0 ? (
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
                    <button type="button" onClick={decreaseQuantity} className="flex h-full w-14 shrink-0 items-center justify-center border-r border-[#E3D6CE] text-[#493631] transition-all duration-200 hover:bg-[#F3E4DC] hover:text-[#8E181F]">
                      {quantity === 1 ? <Trash2 size={18} strokeWidth={2.2} /> : <Minus size={19} strokeWidth={2.5} />}
                    </button>

                    <div className="flex h-full flex-1 items-center justify-center">
                      <span className="text-sm font-bold text-[#351C18]">{quantity} in cart</span>
                    </div>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-full w-14 shrink-0 items-center justify-center border-l border-[#E3D6CE] text-[#493631] transition-all duration-200 hover:bg-[#F3E4DC] hover:text-[#8E181F] disabled:cursor-not-allowed disabled:bg-[#E4E4E4] disabled:text-[#999999] disabled:opacity-100"
                    >
                      <Plus size={19} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                {/* Stock */}
                <div className="mt-2 flex h-4 items-center justify-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${isDisabled ? 'bg-[#999999]' : product.stock <= 5 ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                  <p className={`text-[11px] ${isDisabled ? 'text-[#999999]' : product.stock <= 5 ? 'text-[#B87935]' : 'text-[#806C63]'}`}>
                    {isInactive ? 'Product unavailable' : isOutOfStock ? 'No stock available' : product.stock <= 5 ? `Only ${product.stock} items left` : `${product.stock} items available`}
                  </p>
                </div>
              </div>
            </div>

            {/* BENEFITS */}
            <div className={`mt-5 grid grid-cols-3 overflow-hidden rounded-xl border ${isDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#E8DDD4] bg-white'}`}>
              <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isDisabled ? 'bg-[#DCDCDC]' : 'bg-[#F7EEE7]'}`}>
                  <RotateCcw size={15} strokeWidth={2} className={isDisabled ? 'text-[#999999]' : 'text-[#8E181F]'} />
                </div>

                <p className={`mt-1.5 text-[10px] font-semibold ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Easy Returns</p>
              </div>

              <div className={`flex flex-col items-center justify-center border-x px-2 py-3.5 text-center ${isDisabled ? 'border-[#D9D9D9]' : 'border-[#E8DDD4]'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isDisabled ? 'bg-[#DCDCDC]' : 'bg-[#F7EEE7]'}`}>
                  <ShieldCheck size={15} strokeWidth={2} className={isDisabled ? 'text-[#999999]' : 'text-[#8E181F]'} />
                </div>

                <p className={`mt-1.5 text-[10px] font-semibold ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Secure Payment</p>
              </div>

              <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isDisabled ? 'bg-[#DCDCDC]' : 'bg-[#F7EEE7]'}`}>
                  <BadgeCheck size={15} strokeWidth={2} className={isDisabled ? 'text-[#999999]' : 'text-[#8E181F]'} />
                </div>

                <p className={`mt-1.5 text-[10px] font-semibold ${isDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>Genuine Product</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 border-t border-[#E8DDD4] pt-8 sm:mt-12 sm:pt-10 ">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-linear-to-r from-[#7D171C] to-[#B5262D]" />

                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A857B]">You may also like</span>
                </div>

                <h2 className="text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">More from {product.subCategory?.subCategoryName}</h2>

                <p className="mt-1 text-[10px] text-[#806C63] sm:text-xs">Explore similar products you may like</p>
              </div>

              <span className="shrink-0 rounded-md border border-[#E8DDD4] bg-[#FFFDFC] px-2.5 py-1.5 text-[9px] font-bold text-[#67544D] sm:text-[10px]">{relatedProducts.length} Products</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {relatedProducts.map((item) => {
                const itemInactive = item.status === 'Inactive'
                const itemOutOfStock = item.stock <= 0
                const itemDisabled = itemInactive || itemOutOfStock

                const itemDiscount = item.discount > 0 && item.price > item.discountPrice

                const itemPrice = item.discountPrice > 0 ? item.discountPrice : item.price

                const card = (
                  <>
                    {/* IMAGE */}
                    <div className={`relative flex h-44 shrink-0 items-center justify-center overflow-hidden p-3 sm:h-48 lg:h-52 ${itemDisabled ? 'bg-[#E9E9E9]' : 'bg-white'}`}>
                      {itemDiscount && (
                        <span className={`absolute left-2.5 top-2.5 z-20 rounded-md px-2 py-1 text-[9px] font-extrabold shadow-sm ${itemDisabled ? 'bg-[#D9D9D9] text-[#888888]' : 'bg-[#A51D26] text-white'}`}>{item.discount}% OFF</span>
                      )}

                      {itemDisabled && <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#D9D9D9] px-2 py-1 text-[9px] font-bold text-[#888888]">{itemInactive ? 'Inactive' : 'Out of Stock'}</span>}

                      {!itemDisabled && item.stock > 0 && item.stock <= 5 && <span className="absolute right-2.5 top-2.5 z-20 rounded-md bg-[#FFF7EA] px-2 py-1 text-[9px] font-bold text-[#B87935]">Only {item.stock} left</span>}

                      {item.isOffer && (
                        <span className={`absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 rounded-md px-2 py-1 text-[8px] font-bold ${itemDisabled ? 'bg-[#D9D9D9] text-[#888888]' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>
                          <Tag size={9} />
                          Offer
                        </span>
                      )}

                      {item.images?.length > 0 ? (
                        <img src={`http://localhost:3000${item.images[0]}`} alt={item.productName} className={`h-full w-full object-contain transition-transform duration-500 ${itemDisabled ? 'grayscale opacity-45' : 'group-hover:scale-105'}`} />
                      ) : (
                        <div className={`flex flex-col items-center gap-1.5 ${itemDisabled ? 'text-[#999999]' : 'text-[#A28E85]'}`}>
                          <Info size={25} strokeWidth={1.5} />

                          <span className="text-[9px] font-medium">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className={`border-t px-3 py-3 ${itemDisabled ? 'border-[#D9D9D9] bg-[#E9E9E9]' : 'border-[#EEE5DF] bg-[#FFFCFA]'}`}>
                      <p className={`truncate text-[9px] font-bold uppercase tracking-wider ${itemDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{item.category?.categoryName || 'Product'}</p>

                      <h3 className={`mt-1 line-clamp-2 min-h-9 text-[12px] font-bold leading-4.5 sm:text-[13px] ${itemDisabled ? 'text-[#888888]' : 'text-[#351C18] transition-colors duration-200 group-hover:text-[#8E181F]'}`}>{item.productName}</h3>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold ${itemDisabled ? 'bg-[#D9D9D9] text-[#888888]' : 'bg-[#3E8B62] text-white'}`}>
                          {item.rating || '0.0'}

                          <Star size={8} fill="currentColor" strokeWidth={2.5} />
                        </span>

                        {item.soldCount > 0 && <span className={`truncate text-[9px] ${itemDisabled ? 'text-[#999999]' : 'text-[#806C63]'}`}>{item.soldCount}+ sold</span>}
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-baseline gap-1.5">
                        <span className={`text-base font-extrabold ${itemDisabled ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{itemPrice?.toLocaleString('en-IN')}</span>

                        {itemDiscount && (
                          <>
                            <span className={`text-[9px] line-through ${itemDisabled ? 'text-[#999999]' : 'text-[#9A857B]'}`}>₹{item.price?.toLocaleString('en-IN')}</span>

                            <span className={`text-[9px] font-bold ${itemDisabled ? 'text-[#999999]' : 'text-[#3E8B62]'}`}>{item.discount}% off</span>
                          </>
                        )}
                      </div>

                      <div className={`mt-2.5 flex items-center justify-between border-t pt-2.5 ${itemDisabled ? 'border-[#D9D9D9]' : 'border-[#EEE5DF]'}`}>
                        <div className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${itemDisabled ? 'bg-[#999999]' : item.stock <= 5 ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                          <span className={`text-[9px] font-semibold ${itemDisabled ? 'text-[#999999]' : item.stock <= 5 ? 'text-[#B87935]' : 'text-[#3E8B62]'}`}>
                            {itemInactive ? 'Inactive' : item.stock <= 0 ? 'Unavailable' : item.stock <= 5 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>

                        {!itemDisabled && (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-[#8E181F] transition-all duration-300 group-hover:gap-1">
                            View
                            <ChevronRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )

                return itemDisabled ? (
                  <div key={item._id} aria-disabled="true" className="overflow-hidden rounded-xl border border-[#D9D9D9] bg-[#E9E9E9] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    {card}
                  </div>
                ) : (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className="group overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4BDB2] hover:shadow-[0_10px_24px_rgba(73,54,49,0.11)]"
                  >
                    {card}
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </section>
    </div>
  )
}

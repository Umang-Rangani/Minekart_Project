import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag, ExternalLink, AlertCircle, CircleCheck, PackageCheck, BadgeIndianRupee, CreditCard, X, LockKeyhole, ShoppingCart, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import toast from 'react-hot-toast'
import CartShimmer from '../userShimmer/CartShimmer'

export default function Cart() {
  const navigate = useNavigate()

  const { cart, cartLoading, increaseCartItem, decreaseCartItem, removeCartItem } = useCart()

  const [updatingItem, setUpdatingItem] = useState(null)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)

  const getItemKey = (item) => `${item.productId?._id}-${item.size || 'no-size'}`

  const cartItems = cart?.items || []

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Cart | MineKart'
  }, [])

  useEffect(() => {
    if (!mobileCartOpen) return

    const previousOverflow = document.body.style.overflow
    const previousOverscroll = document.body.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileCartOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.overscrollBehavior = previousOverscroll
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileCartOpen])

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const subtotal = cart?.subtotal || 0

  const originalTotal = cartItems.reduce((total, item) => {
    const product = item.productId
    const originalPrice = product?.price || item.price || 0
    return total + originalPrice * item.quantity
  }, 0)

  const totalSavings = Math.max(originalTotal - subtotal, 0)
  const deliveryCharge = subtotal >= 499 ? 0 : 40
  const grandTotal = subtotal + deliveryCharge
  const deliveryProgress = Math.min((subtotal / 499) * 100, 100)
  const remainingForFreeDelivery = Math.max(499 - subtotal, 0)

  const isItemDisabled = (item) => {
    const product = item.productId
    return product?.status === 'Inactive' || (product?.stock || 0) <= 0
  }

  const isStockExceeded = (item) => {
    const stock = item.productId?.stock || 0
    return stock > 0 && item.quantity > stock
  }

  const hasUnavailableItems = cartItems.some((item) => isItemDisabled(item) || isStockExceeded(item))

  const increaseQuantity = async (item) => {
    const product = item.productId

    if (isItemDisabled(item)) {
      toast.error('This product is currently unavailable')
      return
    }

    const productStock = product?.stock || 0

    if (item.quantity >= productStock) {
      toast.error('Maximum available stock reached')
      return
    }

    try {
      const res = await increaseCartItem({
        productId: product._id,
        size: item.size || null,
      })

      if (!res?.success) {
        toast.error(res?.message || 'Unable to increase quantity')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to increase quantity')
    }
  }

  const decreaseQuantity = async (item) => {
    const product = item.productId
    const itemKey = getItemKey(item)

    if (isItemDisabled(item)) {
      toast.error('This product is currently unavailable')
      return
    }

    if (updatingItem === itemKey) return

    setUpdatingItem(itemKey)

    try {
      const res = await decreaseCartItem({
        productId: product._id,
        size: item.size || null,
      })

      if (!res?.success) {
        toast.error(res?.message || 'Unable to decrease quantity')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to decrease quantity')
    } finally {
      setUpdatingItem(null)
    }
  }

  const removeItem = async (item) => {
    try {
      const res = await removeCartItem({
        productId: item.productId._id,
        size: item.size || null,
      })

      if (!res?.success) {
        toast.error(res?.message || 'Unable to remove product')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to remove product')
    }
  }

  const items = [{ title: 'Cart', link: null }]

  const formatPrice = (price) => Number(price || 0).toLocaleString('en-IN')

  const getUnitPrice = (item) => {
    const product = item.productId
    return item.discountPrice
  }

  const getPrice = (item) => {
    const product = item.productId
    return item.price
  }
  const renderCartProducts = () =>
    cartItems.map((item) => {
      const product = item.productId
      const disabled = isItemDisabled(item)
      const stockExceeded = isStockExceeded(item)
      const itemKey = getItemKey(item)
      const isUpdating = updatingItem === itemKey
      const unitPrice = getUnitPrice(item)
      const originalPrice = item.price || product?.price || unitPrice
      const itemTotal = unitPrice * item.quantity

      return (
        <article key={itemKey} className={`overflow-hidden rounded-lg border col-span-1 transition-colors ${disabled || stockExceeded ? 'border-[#D7D7D7] bg-[#F3F3F3]' : 'border-[#E8DDD4] bg-white'}`}>
          {(disabled || stockExceeded) && (
            <div className="flex min-h-6 items-center gap-1.5 border-b border-[#D8D8D8] bg-[#E9E9E9] px-2.5 py-1">
              <AlertCircle size={12} className="shrink-0 text-[#777777]" />
              <span className="truncate text-[10px] font-semibold text-[#686868]">{disabled ? (product?.status === 'Inactive' ? 'Product is currently inactive' : 'Product is out of stock') : 'Requested quantity exceeds available stock'}</span>
            </div>
          )}

          <div className="flex gap-2.5 p-2">
            <button
              type="button"
              onClick={() => navigate(`/product/${product?._id}`)}
              aria-label={`View ${product?.productName || 'product'}`}
              className={`relative h-[88px] w-[76px]    sm:h-[110px] sm:w-[86px] shrink-0 overflow-hidden rounded-md ${disabled || stockExceeded ? 'bg-[#E7E7E7]' : 'bg-[#FBF7F2]'}`}
            >
              {product?.images?.[0] ? (
                <img src={getImageUrl(product.images[0])} alt={product?.productName || 'Product'} className={`h-full w-full object-contain p-1.5 ${disabled || stockExceeded ? 'grayscale opacity-50' : ''}`} />
              ) : (
                <ShoppingBag size={23} className="mx-auto text-[#C4B2A7]" />
              )}

              {(disabled || stockExceeded) && <span className="absolute inset-x-0 bottom-0 truncate bg-[#777777]/90 px-1 py-1 text-center text-[9px] font-bold text-white">{disabled ? 'Unavailable' : 'Stock Limited'}</span>}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1 ">
                  <p className={`truncate text-[9px] sm:text-[11px] font-semibold uppercase tracking-wide ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product?.brand?.brandName || 'MineKart'}</p>

                  <h3 className={`line-clamp-2 text-[12px] sm:text-[14px] font-medium sm:mt-1 leading-4 sm:leading-5 ${disabled || stockExceeded ? 'text-[#858585]' : 'text-[#351C18]'}`}>{product?.productName || 'Product'}</h3>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  {!disabled && (
                    <button type="button" onClick={() => navigate(`/product/${product?._id}`)} aria-label="View product" className="flex h-6 w-6 items-center justify-center rounded text-[#806C63] active:bg-[#F7EEE7]">
                      <ExternalLink size={13} />
                    </button>
                  )}

                  <button type="button" onClick={() => removeItem(item)} aria-label={`Remove ${product?.productName || 'product'}`} className="flex h-6 w-6 items-center justify-center rounded text-[#9A857B] active:bg-[#FCECEB] active:text-[#8E181F]">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex min-w-0 items-center justify-between gap-1.5 border-t border-[#F0E7E1] pt-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    <span className={`text-[14px] font-medium ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{formatPrice(unitPrice)}</span>

                    {originalPrice > unitPrice && <span className="text-[9px] text-[#9A857B] line-through">₹{formatPrice(originalPrice)}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className={`flex h-7 sm:h-9 items-center overflow-hidden rounded-md border ${disabled || stockExceeded ? 'border-[#D1D1D1] bg-[#E8E8E8]' : 'border-[#DCCFC7] bg-white'}`}>
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item)}
                      disabled={disabled || isUpdating}
                      aria-label="Decrease quantity"
                      className={`flex h-full w-7 sm:w-9 items-center justify-center border-r ${disabled || isUpdating ? 'cursor-not-allowed border-[#D1D1D1] text-[#999999]' : 'border-[#DCCFC7] text-[#67544D] active:bg-[#F7EEE7]'}`}
                    >
                      {isUpdating ? <span className="h-3 w-3  sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-[#D8CBC4] border-t-[#8E181F]" /> : item.quantity === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                    </button>

                    <span className={`flex min-w-7 sm:min-w-9 items-center justify-center text-[11px] sm:text-[14px] font-bold ${disabled || stockExceeded ? 'text-[#888888]' : 'text-[#351C18]'}`}>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item)}
                      disabled={disabled || isUpdating || item.quantity >= (product?.stock || 0)}
                      aria-label="Increase quantity"
                      className={`flex h-full w-7 sm:w-9 items-center justify-center border-l ${
                        disabled || isUpdating || item.quantity >= (product?.stock || 0) ? 'cursor-not-allowed border-[#D1D1D1] text-[#999999]' : 'border-[#DCCFC7] text-[#8E181F] active:bg-[#F7EEE7]'
                      }`}
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                
                </div>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className={`text-[15px] sm:text-[19px] font-bold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#8E181F]'}`}>₹{formatPrice(itemTotal)}</span>
                  </div>
              </div>
            </div>
          </div>
        </article>
      )
    })

  if (cartLoading) return <CartShimmer />

  return (
    <div className="min-h-screen overflow-x-clip bg-[#FBF7F2] text-[#351C18]">
      <BreadCrumb items={items} />

      <main className="mx-auto w-full pb-10 pt-3">
        {/* header */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#351C18] to-[#512720] shadow-[0_8px_24px_rgba(53,28,24,0.16)]">
          <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-2 sm:gap-5 sm:px-6 sm:py-2.5">
            {/* Cart Heading */}
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white shadow-inner sm:h-9 sm:w-9">
                <ShoppingBag size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-extrabold tracking-tight text-white sm:text-xl">My Cart</h1>
                <p className="mt-0.5 text-[9px] font-medium text-[#E8DDD4] sm:text-xs">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            {/* Checkout Progress */}
            <div className="flex shrink-0 items-center">
              {/* Cart */}
              <div className="flex flex-col items-center gap-1 text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#351C18] shadow-md ring-2 ring-white/10 sm:h-8 sm:w-8">
                  <ShoppingBag size={13} strokeWidth={2.2} />
                </span>
                <span className="text-[9px] font-bold sm:text-xs">Cart</span>
              </div>

              <div className="mx-1.5 mb-4 h-0.5 w-3 rounded-full bg-white/35 sm:mx-3 sm:w-9" />

              {/* Checkout */}
              <div className="flex flex-col items-center gap-1 text-[#E8DDD4]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 sm:h-8 sm:w-8">
                  <CreditCard size={13} strokeWidth={1.8} />
                </span>
                <span className="text-[9px] font-medium sm:text-xs">Checkout</span>
              </div>

              <div className="mx-1.5 mb-4 h-0.5 w-3 rounded-full bg-white/35 sm:mx-3 sm:w-9" />

              {/* Confirm */}
              <div className="flex flex-col items-center gap-1 text-[#E8DDD4]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 sm:h-8 sm:w-8">
                  <CircleCheck size={14} strokeWidth={1.8} />
                </span>
                <span className="text-[9px] font-medium sm:text-xs">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length === 0 && (
          <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white px-5 py-10 text-center shadow-[0_2px_8px_rgba(53,28,24,0.04)] sm:min-h-[380px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={30} strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold sm:text-xl">Your cart is waiting</h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#806C63] sm:text-sm">You haven't added any products yet. Discover something you'll love.</p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-5 flex h-10 items-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 transition hover:brightness-110 sm:text-sm"
            >
              Start Shopping
              <ChevronRight size={16} />
            </button>
          </section>
        )}

        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-5">
            <section className="hidden min-w-0 lg:block">
              {hasUnavailableItems && (
                <div className="mb-2.5 flex items-start gap-2.5 rounded-lg bg-[#ECECEC] px-3 py-2.5">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#777777]" />
                  <div>
                    <p className="text-xs font-bold text-[#555555]">Some products need attention</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-[#777777]">Remove unavailable products or adjust quantities before checkout.</p>
                  </div>
                </div>
              )}

              <div className="max-sm:space-y-2.5 grid sm:grid-cols-2 sm:gap-5 sm:h-72">{renderCartProducts()}</div>
              <Benefits />
            </section>

            {/* order summary */}
            <aside className="min-w-0">
              <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_14px_rgba(53,28,24,0.05)] lg:sticky lg:top-24">
                <div className="flex items-center justify-between gap-2.5 bg-[#8E181F] px-3.5 py-3 text-white sm:px-4">
                  <div>
                    <h2 className="text-base font-extrabold">Order Summary</h2>
                    <p className="mt-0.5 text-[10px] text-white/70">Your order at a glance</p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <BadgeIndianRupee size={18} />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4">
                  <div className="min-w-0">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#E8DDD4] bg-[#FBF7F2] px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#806C63]">
                      <span>Product Details</span>
                      <span className="text-right">Amount</span>
                    </div>

                    {cartItems.map((item) => {
                      const product = item.productId
                      const disabled = isItemDisabled(item)
                      const stockExceeded = isStockExceeded(item)

                      const discounPrice = getUnitPrice(item)
                      const unitPrice = getPrice(item)

                      const itemTotal = discounPrice * item.quantity

                      return (
                        <div key={getItemKey(item)} className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#E8DDD4] px-2.5 py-3 ${disabled || stockExceeded ? 'opacity-65' : ''}`}>
                          <div className="min-w-0">
                            <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[#9A857B]">{product?.brand?.brandName || 'MineKart'}</p>

                            <p title={product?.productName || 'Product'} className="mt-1 truncate text-xs font-bold leading-4 text-[#351C18]">
                              {product?.productName || 'Product'}
                            </p>

                            <div className="mt-1 flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap text-[10px] text-[#806C63]">
                              <span className="flex shrink-0 items-center gap-1.5">
                                <span className="text-sm font-medium tracking-tight text-[#8E181F] sm:text-base">₹{formatPrice(discounPrice)}</span>

                                <span className="text-[10px] font-medium text-[#9A857B] line-through decoration-[#B9A79D] sm:text-xs">₹{formatPrice(unitPrice)}</span>
                              </span>

                              <span className="shrink-0 text-[#C7B6AC]">·</span>
                              <span className="shrink-0">Qty: {item.quantity}</span>

                              {item.size && (
                                <>
                                  <span className="shrink-0 text-[#C7B6AC]">·</span>
                                  <span className="shrink-0">Size: {item.size}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-end justify-center h-full">
                            <span className="text-sm font-extrabold tracking-tight text-[#8E181F] sm:text-base">₹{formatPrice(itemTotal)}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {totalSavings > 0 && (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-[#EFF6F0] px-2.5 py-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#34704F]">
                        <Tag size={13} />
                        Total savings
                      </span>
                      <span className="text-xs font-extrabold text-[#34704F]">−₹{formatPrice(totalSavings)}</span>
                    </div>
                  )}

                  <div className="mt-3.5 space-y-2.5 border-t border-[#E8DDD4] pt-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#806C63]">Subtotal</span>
                      <span className="font-semibold text-[#351C18]">₹{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#806C63]">Delivery</span>
                      {deliveryCharge === 0 ? <span className="font-bold text-[#47805D]">FREE</span> : <span className="font-semibold text-[#351C18]">₹{formatPrice(deliveryCharge)}</span>}
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-[#E8DDD4] pt-3">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-[#351C18]">Total amount</p>
                        <p className="mt-0.5 text-[10px] text-[#806C63]">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'} · Including delivery
                        </p>
                      </div>

                      <span className="shrink-0 text-xl font-extrabold tracking-tight text-[#8E181F]">₹{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 rounded-lg bg-[#FBF7F2] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Truck size={15} className={`shrink-0 ${deliveryCharge === 0 ? 'text-[#47805D]' : 'text-[#8E181F]'}`} />
                        <p className="truncate text-[11px] font-bold text-[#351C18]">{deliveryCharge === 0 ? 'Free delivery unlocked' : 'Unlock free delivery'}</p>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-[#806C63]">₹499</span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6DDD7]">
                      <div className={`h-full rounded-full transition-all duration-300 ${deliveryCharge === 0 ? 'bg-[#47805D]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26]'}`} style={{ width: `${deliveryProgress}%` }} />
                    </div>

                    <p className="mt-1.5 text-[10px] leading-4 text-[#806C63]">
                      {deliveryCharge > 0 ? (
                        <>
                          Add <span className="font-extrabold text-[#8E181F]">₹{formatPrice(remainingForFreeDelivery)}</span> more for free delivery.
                        </>
                      ) : (
                        <span className="font-medium text-[#47805D]">You've qualified for free delivery.</span>
                      )}
                    </p>
                  </div>

                  {hasUnavailableItems && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#EEEEEE] p-2.5">
                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#777777]" />
                      <p className="text-[10px] leading-4 text-[#686868]">Checkout is unavailable until unavailable products are removed or their quantities are adjusted.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={hasUnavailableItems}
                    onClick={() => navigate('/checkout')}
                    className={`mt-3.5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition sm:text-sm ${
                      hasUnavailableItems ? 'cursor-not-allowed bg-[#E5E5E5] text-[#888888]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 hover:-translate-y-0.5 hover:brightness-110'
                    }`}
                  >
                    {hasUnavailableItems ? 'Unavailable Items in Cart' : 'Proceed to Checkout'}
                    {!hasUnavailableItems && <ChevronRight size={16} />}
                  </button>

                  <button type="button" onClick={() => navigate('/')} className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-white text-xs font-bold text-[#67544D] transition hover:bg-[#FBF7F2]">
                    <ChevronLeft size={14} />
                    Continue Shopping
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[#806C63]">
                    <LockKeyhole size={12} className="text-[#47805D]" />
                    Safe & secure checkout
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-5 lg:hidden">
          <div className="pointer-events-auto mx-auto max-w-md">
            <button
              type="button"
              onClick={() => setMobileCartOpen(true)}
              className="group flex min-h-[58px] w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/15 bg-linear-to-r from-[#351C18] to-[#512720] px-3.5 py-2.5 text-white shadow-[0_8px_28px_rgba(53,28,24,0.30)] transition-all duration-200 active:scale-[0.98]"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-inner">
                  <ShoppingCart size={19} strokeWidth={1.8} />

                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#351C18] bg-white px-1 text-[9px] font-extrabold text-[#351C18]">{totalItems}</span>
                </span>

                <span className="min-w-0 text-left">
                  <span className="block truncate text-xs font-extrabold tracking-wide sm:text-sm">Shopping Cart</span>
                  <span className="mt-1 block truncate text-[10px] text-white/70">View items & manage quantity</span>
                </span>
              </span>

              <span className="flex shrink-0 items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight sm:text-base">₹{formatPrice(grandTotal)}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-white/20">
                  <ChevronRight size={17} />
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {mobileCartOpen && cartItems.length > 0 && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button type="button" aria-label="Close shopping cart" onClick={() => setMobileCartOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-[#211310]/55 backdrop-blur-[3px]" />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-cart-title"
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] min-h-[50dvh] flex-col overflow-hidden rounded-t-2xl border-t border-white/70 bg-[#FBF7F2] shadow-[0_-15px_60px_rgba(30,15,12,0.25)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="shrink-0 border-b border-[#E8DDD4] bg-white/95 px-3.5 pb-2.5 pt-2.5 backdrop-blur-xl sm:px-4">
              <div className="mx-auto mb-2.5 h-1 w-9 rounded-full bg-[#D8C9C1]" />

              <div className="flex items-center justify-between gap-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <ShoppingBag size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 id="mobile-cart-title" className="text-sm font-extrabold tracking-tight text-[#351C18]">
                      Shopping Cart
                    </h2>
                    <p className="mt-0.5 text-[10px] text-[#806C63]">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} · ₹{formatPrice(grandTotal)} total
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileCartOpen(false)}
                  aria-label="Close shopping cart"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7EEE7] text-[#351C18] transition hover:bg-[#EEDFD5] active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              {hasUnavailableItems && (
                <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-[#EAEAEA] px-2.5 py-2">
                  <AlertCircle size={13} className="mt-0.5 shrink-0 text-[#777777]" />
                  <p className="text-[10px] leading-4 text-[#686868]">Some products need attention before checkout.</p>
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
              {renderCartProducts()}

              <div className="rounded-lg bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Truck size={15} className={deliveryCharge === 0 ? 'text-[#47805D]' : 'text-[#8E181F]'} />
                    <span className="text-xs font-bold text-[#351C18]">{deliveryCharge === 0 ? 'Free delivery unlocked' : 'Free delivery at ₹499'}</span>
                  </div>

                  <span className="text-[10px] font-bold text-[#806C63]">{Math.round(deliveryProgress)}%</span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6DDD7]">
                  <div className={`h-full rounded-full ${deliveryCharge === 0 ? 'bg-[#47805D]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26]'}`} style={{ width: `${deliveryProgress}%` }} />
                </div>

                {deliveryCharge > 0 && (
                  <p className="mt-1.5 text-[10px] text-[#806C63]">
                    Add <span className="font-bold text-[#8E181F]">₹{formatPrice(remainingForFreeDelivery)}</span> more for free delivery.
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-[#E8DDD4] bg-white/95 px-3.5 pb-2.5 pt-2.5 backdrop-blur-xl sm:px-4">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] text-[#806C63]">Total including delivery</p>
                  <p className="mt-0.5 text-xl font-extrabold text-[#8E181F]">₹{formatPrice(grandTotal)}</p>
                </div>

                <span className="rounded-md bg-[#F7EEE7] px-2.5 py-1.5 text-[10px] font-bold text-[#67544D]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <button
                type="button"
                disabled={hasUnavailableItems}
                onClick={() => {
                  setMobileCartOpen(false)
                  navigate('/checkout')
                }}
                className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-extrabold transition ${
                  hasUnavailableItems ? 'cursor-not-allowed bg-[#E5E5E5] text-[#888888]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 active:scale-[0.99]'
                }`}
              >
                {hasUnavailableItems ? 'Unavailable Items in Cart' : 'Proceed to Checkout'}
                {!hasUnavailableItems && <ChevronRight size={16} />}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function Benefits() {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-2.5">
      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white px-2 py-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F0F6F0] text-[#47805D]">
          <Truck size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold leading-4 text-[#351C18] sm:text-[11px]">Free Delivery</p>
          <p className="text-[9px] leading-3.5 text-[#806C63]">Orders ₹499+</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white px-2 py-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[#8E181F]">
          <ShieldCheck size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold leading-4 text-[#351C18] sm:text-[11px]">Secure Pay</p>
          <p className="text-[9px] leading-3.5 text-[#806C63]">Safe checkout</p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white px-2 py-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FFF5E7] text-[#A36A2D]">
          <Tag size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold leading-4 text-[#351C18] sm:text-[11px]">Best Prices</p>
          <p className="text-[9px] leading-3.5 text-[#806C63]">Great deals</p>
        </div>
      </div>
    </div>
  )
}

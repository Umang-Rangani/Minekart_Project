import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag, ExternalLink, AlertCircle, CircleCheck, PackageCheck, BadgeIndianRupee, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import toast from 'react-hot-toast'
import CartShimmer from '../userShimmer/CartShimmer'

export default function Cart() {
  const navigate = useNavigate()

  const { cart, cartLoading, increaseCartItem, decreaseCartItem, removeCartItem } = useCart()

  // quantity board ma loading
  const [updatingItem, setUpdatingItem] = useState(null)
  const getItemKey = (item) => `${item.productId?._id}-${item.size || 'no-size'}`

  const cartItems = cart?.items || []

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Cart | MineKart'
  }, [])

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

  if (cartLoading) {
    return <CartShimmer />
  }

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-3 sm:pt-5">
        {/* PAGE HEADER */}
        <div className="mb-3 flex h-14 items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-2.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-20 sm:px-4">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <ShoppingBag size={18} strokeWidth={1.9} className="relative z-10 " />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[11px] font-extrabold tracking-tight text-[#351C18] sm:text-sm">My Cart</h1>

              <p className="mt-0.5 truncate text-[8px] text-[#806C63] sm:text-[10px]">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="flex min-w-0 flex-1 items-center justify-center px-1 sm:px-6">
            <div className="flex w-full max-w-100 items-center">
              {/* CART */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A51D26] text-white shadow-[0_3px_9px_rgba(165,29,38,0.25)] ring-2 ring-[#F1E3DC] sm:h-9 sm:w-9 sm:ring-3">
                  <ShoppingBag size={12} strokeWidth={2} />
                </div>

                <span className="hidden text-[9px] font-extrabold text-[#7D171C] sm:block">Cart</span>
              </div>

              <div className="mx-1.5 h-0.5 flex-1 bg-[#D8C9C1] sm:mx-3">
                <div className="h-full w-0 rounded-full bg-[#A51D26]" />
              </div>

              {/* CHECKOUT */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8CCC5] bg-[#F7F3F0] text-[#9A857B] sm:h-9 sm:w-9">
                  <CreditCard size={12} strokeWidth={1.8} />
                </div>

                <span className="hidden text-[9px] font-bold text-[#9A857B] sm:block">Checkout</span>
              </div>

              <div className="mx-1.5 h-0.5 flex-1 bg-[#D8C9C1] sm:mx-3" />

              {/* CONFIRM */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8CCC5] bg-[#F7F3F0] text-[#9A857B] sm:h-9 sm:w-9">
                  <CircleCheck size={12} strokeWidth={1.8} />
                </div>

                <span className="hidden text-[9px] font-bold text-[#9A857B] sm:block">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-white px-4 text-center shadow-[0_3px_12px_rgba(73,54,49,0.04)] sm:min-h-96 sm:px-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F] sm:h-16 sm:w-16">
              <ShoppingBag size={27} strokeWidth={1.6} />
            </div>

            <h2 className="mt-4 text-base font-extrabold text-[#351C18] sm:mt-5 sm:text-xl">Your cart is empty</h2>

            <p className="mt-2 max-w-sm text-[11px] leading-5 text-[#806C63] sm:text-sm">You haven't added any products yet. Start shopping and discover something you love.</p>

            <button type="button" onClick={() => navigate('/')} className="mt-4 flex h-10 items-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 sm:mt-5">
              Start Shopping
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* CART */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* LEFT */}
            <div className="min-w-0">
              {/* SECTION HEADER */}
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-extrabold text-[#351C18] sm:text-lg">Shopping Cart</h2>

                  <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-xs">Review your products before checkout</p>
                </div>

                <span className="shrink-0 rounded-lg bg-[#F7EEE7] px-2 py-1 text-[8px] font-extrabold text-[#8E181F] sm:px-2.5 sm:py-1.5 sm:text-[9px]">{totalItems} ITEMS</span>
              </div>

              {/* WARNING */}
              {hasUnavailableItems && (
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] px-2.5 py-2.5 sm:gap-2.5 sm:px-3 sm:py-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#E7E7E7] text-[#888888] sm:h-7 sm:w-7">
                    <AlertCircle size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold text-[#666666] sm:text-[10px]">Some products need attention</p>

                    <p className="mt-0.5 text-[8px] leading-4 text-[#888888] sm:text-[9px]">Remove unavailable products or adjust quantities before checkout.</p>
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              <div className="space-y-2.5 sm:space-y-3">
                {cartItems.map((item) => {
                  const product = item.productId

                  const disabled = isItemDisabled(item)
                  const stockExceeded = isStockExceeded(item)

                  const unitPrice = item.discountPrice || item.price || product?.discountPrice || product?.price || 0

                  const originalPrice = item.price || product?.price || unitPrice

                  const itemTotal = unitPrice * item.quantity

                  return (
                    <div
                      key={`${product?._id}-${item.size || 'no-size'}`}
                      className={`overflow-hidden rounded-xl border sm:rounded-2xl ${
                        disabled || stockExceeded
                          ? 'border-[#D9D9D9] bg-[#F3F3F3] shadow-none'
                          : 'border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.045)] sm:hover:-translate-y-0.5 sm:hover:border-[#D4BDB2] sm:hover:shadow-[0_8px_22px_rgba(73,54,49,0.08)]'
                      }`}
                    >
                      {/* DISABLED TOP BAR */}
                      {(disabled || stockExceeded) && (
                        <div className="flex items-center gap-2 border-b border-[#D9D9D9] bg-[#EAEAEA] px-2.5 py-1.5 sm:px-3 sm:py-2">
                          <AlertCircle size={12} className="shrink-0 text-[#888888]" />

                          <span className="text-[8px] font-bold text-[#777777] sm:text-[9px]">
                            {disabled ? (product?.status === 'Inactive' ? 'Product is currently inactive' : 'Product is out of stock') : 'Requested quantity exceeds available stock'}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2.5 p-2.5 sm:gap-4 sm:p-4">
                        {/* IMAGE */}
                        <button
                          type="button"
                          onClick={() => navigate(`/product/${product._id}`)}
                          disabled={disabled}
                          className={`relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border sm:h-32 sm:w-32 sm:rounded-xl ${
                            disabled || stockExceeded ? 'cursor-not-allowed border-[#D9D9D9] bg-[#EAEAEA]' : 'border-[#E8DDD4] bg-white'
                          }`}
                        >
                          {product?.images?.[0] ? (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.productName}
                              className={`h-full w-full object-contain p-2 sm:p-3 ${disabled || stockExceeded ? 'grayscale opacity-50' : 'sm:transition-transform sm:duration-300 sm:hover:scale-105'}`}
                            />
                          ) : (
                            <div className="text-[8px] text-[#999999] sm:text-[9px]">No Image</div>
                          )}

                          {disabled && (
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#777777] px-1.5 py-0.5 text-[7px] font-bold text-white sm:bottom-2 sm:px-2 sm:py-1 sm:text-[8px]">Unavailable</span>
                          )}

                          {!disabled && stockExceeded && (
                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#777777] px-1.5 py-0.5 text-[7px] font-bold text-white sm:bottom-2 sm:px-2 sm:py-1 sm:text-[8px]">Stock Limited</span>
                          )}
                        </button>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">
                          {/* TOP */}
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <p className={`truncate text-[8px] font-bold uppercase tracking-wider sm:text-[9px] ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product?.brand?.brandName || 'Brand'}</p>

                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${disabled || stockExceeded ? 'bg-[#999999]' : 'bg-[#3E8B62]'}`} />
                              </div>

                              <h3 className={`mt-0.5 truncate text-[11px] font-bold leading-4 sm:mt-1 sm:text-sm ${disabled || stockExceeded ? 'text-[#888888]' : 'text-[#351C18]'}`}>{product?.productName}</h3>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex shrink-0 items-center gap-0.5">
                              {!disabled && (
                                <button
                                  type="button"
                                  onClick={() => navigate(`/product/${product._id}`)}
                                  className="flex h-6 w-6 items-center justify-center rounded-md text-[#9A857B] hover:bg-[#F7EEE7] hover:text-[#8E181F] sm:h-7 sm:w-7"
                                  title="View Product"
                                >
                                  <ExternalLink size={12} />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className={`flex h-6 w-6 items-center justify-center rounded-md ${
                                  disabled || stockExceeded ? 'text-[#888888] hover:bg-[#E4E4E4] hover:text-[#666666]' : 'text-[#9A857B] hover:bg-[#FFF0F0] hover:text-[#A51D26]'
                                } sm:h-7 sm:w-7`}
                                title="Remove"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {/* SIZE + STOCK */}
                          <div className="flex flex-wrap items-end gap-x-2 gap-y-1.5 sm:items-center sm:gap-5">
                            {/* SIZE */}
                            {item.size && (
                              <div
                                className={`mt-1.5 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[8px] font-semibold sm:mt-2 sm:px-2 sm:py-1 sm:text-[9px] ${
                                  disabled || stockExceeded ? 'border-[#D9D9D9] bg-[#EAEAEA] text-[#888888]' : 'border-[#E8DDD4] bg-[#FBF7F2] text-[#67544D]'
                                }`}
                              >
                                Size:
                                <span className={`font-extrabold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#351C18]'}`}>{item.size}</span>
                              </div>
                            )}

                            {/* STOCK - DESKTOP ONLY */}
                            <div className="mt-1.5 hidden flex-wrap items-center gap-1.5 sm:mt-2 sm:flex sm:gap-2">
                              {disabled ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#E7E7E7] px-1.5 py-0.5 text-[7px] font-bold text-[#888888] sm:px-2 sm:py-1 sm:text-[8px]">
                                  <AlertCircle size={9} />
                                  Unavailable
                                </span>
                              ) : stockExceeded ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#E7E7E7] px-1.5 py-0.5 text-[7px] font-bold text-[#777777] sm:px-2 sm:py-1 sm:text-[8px]">
                                  <AlertCircle size={9} />
                                  Only {product?.stock || 0} available
                                </span>
                              ) : product?.stock <= 5 ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF7EA] px-1.5 py-0.5 text-[7px] font-bold text-[#B87935] sm:px-2 sm:py-1 sm:text-[8px]">
                                  <PackageCheck size={9} />
                                  Only {product.stock} left
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#F0F8F3] px-1.5 py-0.5 text-[7px] font-bold text-[#3E8B62] sm:px-2 sm:py-1 sm:text-[8px]">
                                  <CircleCheck size={9} />
                                  In Stock
                                </span>
                              )}
                            </div>

                            {/* MOBILE PRICE */}
                            <div className="mt-1 flex w-full items-end gap-2 sm:hidden">
                              <p className={`text-[7px] font-bold uppercase leading-none tracking-wider ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>PRICE</p>

                              <div className="flex items-end gap-1 leading-none">
                                <span className={`text-base font-extrabold leading-none ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{unitPrice.toLocaleString('en-IN')}</span>

                                {originalPrice > unitPrice && <span className={`text-[8px] font-medium leading-none line-through ${disabled || stockExceeded ? 'text-[#AAAAAA]' : 'text-[#9A857B]'}`}>₹{originalPrice.toLocaleString('en-IN')}</span>}
                              </div>
                            </div>
                          </div>

                          {/* PRICE + QUANTITY */}
                          <div className={`mt-2.5 flex items-center justify-between gap-2 border-t pt-2.5 sm:mt-3 sm:items-end sm:gap-3 sm:pt-3 ${disabled || stockExceeded ? 'border-[#D9D9D9]' : 'border-[#F0E7E1]'}`}>
                            {/* DESKTOP PRICE */}
                            <div className="hidden sm:block">
                              <p className={`text-[8px] font-bold uppercase tracking-wider ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>Price</p>

                              <div className="mt-0.5 flex flex-wrap items-center gap-1">
                                <span className={`text-base font-extrabold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{unitPrice.toLocaleString('en-IN')}</span>

                                {originalPrice > unitPrice && <span className={`text-[9px] line-through ${disabled || stockExceeded ? 'text-[#AAAAAA]' : 'text-[#9A857B]'}`}>₹{originalPrice.toLocaleString('en-IN')}</span>}
                              </div>
                            </div>

                            {/* QUANTITY + TOTAL */}
                            <div className="flex w-full items-center justify-between sm:w-auto sm:items-end sm:gap-3">
                              {/* QUANTITY */}
                              <div className={`flex h-8 overflow-hidden rounded-lg border ${disabled || stockExceeded ? 'border-[#D1D1D1] bg-[#EAEAEA]' : 'border-[#DCCFC7] bg-white'}`}>
                                <button
                                  type="button"
                                  onClick={() => decreaseQuantity(item)}
                                  disabled={disabled || updatingItem === getItemKey(item)}
                                  className={`flex w-8 items-center justify-center border-r ${
                                    disabled || updatingItem === getItemKey(item) ? 'cursor-not-allowed border-[#D1D1D1] text-[#999999]' : 'border-[#DCCFC7] text-[#67544D] hover:bg-[#F7EEE7] hover:text-[#8E181F]'
                                  }`}
                                >
                                  {updatingItem === getItemKey(item) ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#D8CBC4] border-t-[#8E181F]" /> : item.quantity === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                                </button>

                                <span className={`flex min-w-9 items-center justify-center border-x text-[10px] font-extrabold ${disabled || stockExceeded ? 'border-[#D1D1D1] text-[#888888]' : 'border-[#DCCFC7] text-[#351C18]'}`}>
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => increaseQuantity(item)}
                                  disabled={disabled || item.quantity >= (product?.stock || 0)}
                                  className={`flex w-8 items-center justify-center ${disabled || item.quantity >= (product?.stock || 0) ? 'cursor-not-allowed text-[#999999]' : 'text-[#8E181F] hover:bg-[#F7EEE7]'}`}
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              {/* MOBILE TOTAL */}
                              <div className="text-right sm:hidden">
                                <p className="text-[7px] font-bold uppercase tracking-wider text-[#9A857B]">Total</p>

                                <p className={`text-sm font-extrabold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#8E181F]'}`}>₹{itemTotal.toLocaleString('en-IN')}</p>
                              </div>

                              {/* DESKTOP TOTAL */}
                              <div className="hidden min-w-20 text-right sm:block">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Total</p>

                                <p className={`text-sm font-extrabold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#8E181F]'}`}>₹{itemTotal.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* BENEFITS */}
              <div className="mt-4 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2.5">
                <div className="flex flex-col items-center justify-center rounded-xl border border-[#E8DDD4] bg-white px-1.5 py-2.5 text-center sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3 sm:text-left">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F0F8F3] text-[#3E8B62] sm:h-8 sm:w-8">
                    <Truck size={14} />
                  </div>

                  <div>
                    <p className="text-[8px] font-extrabold text-[#351C18] sm:text-[10px]">Free Delivery</p>

                    <p className="mt-0.5 text-[7px] text-[#806C63] sm:text-[9px]">On orders ₹499+</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border border-[#E8DDD4] bg-white px-1.5 py-2.5 text-center sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3 sm:text-left">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F] sm:h-8 sm:w-8">
                    <ShieldCheck size={14} />
                  </div>

                  <div>
                    <p className="text-[8px] font-extrabold text-[#351C18] sm:text-[10px]">Secure Payment</p>

                    <p className="mt-0.5 text-[7px] text-[#806C63] sm:text-[9px]">Safe checkout</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border border-[#E8DDD4] bg-white px-1.5 py-2.5 text-center sm:flex-row sm:gap-2.5 sm:px-3 sm:py-3 sm:text-left">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EA] text-[#B87935] sm:h-8 sm:w-8">
                    <Tag size={14} />
                  </div>

                  <div>
                    <p className="text-[8px] font-extrabold text-[#351C18] sm:text-[10px]">Best Prices</p>

                    <p className="mt-0.5 text-[7px] text-[#806C63] sm:text-[9px]">Great deals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.07)] lg:sticky lg:top-24">
                {/* SUMMARY HEADER */}
                <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-3 py-3.5 sm:px-5 sm:py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Order Summary</h2>

                      <p className="mt-0.5 text-[9px] text-[#806C63] sm:text-[10px]">Price details</p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm sm:h-9 sm:w-9">
                      <BadgeIndianRupee size={15} />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-5">
                  {/* ITEMS */}
                  <div className="max-h-44 space-y-2.5 overflow-y-auto pr-1 sm:max-h-52 sm:space-y-3">
                    {cartItems.map((item, index) => {
                      const disabled = isItemDisabled(item)
                      const stockExceeded = isStockExceeded(item)

                      return (
                        <div key={`${item.productId?._id}-${index}`} className={`flex items-start justify-between gap-2 ${disabled || stockExceeded ? 'opacity-60' : ''}`}>
                          <div className="flex min-w-0 items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[8px] font-extrabold text-[#8E181F] sm:h-6 sm:w-6 sm:text-[9px]">{index + 1}</span>

                            <div className="min-w-0">
                              <p className="truncate text-[10px] font-bold text-[#351C18] sm:text-[11px]">{item.productId?.productName}</p>

                              <p className="mt-0.5 text-[8px] text-[#9A857B] sm:text-[9px]">
                                Qty {item.quantity}
                                {item.size ? ` · Size ${item.size}` : ''}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 text-[10px] font-extrabold text-[#351C18] sm:text-[11px]">₹{(item.totalPrice || 0).toLocaleString('en-IN')}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* SAVINGS */}
                  {totalSavings > 0 && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-2.5 py-2 sm:mt-4 sm:px-3 sm:py-2.5">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Tag size={12} className="text-[#3E8B62]" />

                        <span className="text-[8px] font-bold text-[#34704F] sm:text-[9px]">Total Savings</span>
                      </div>

                      <span className="text-[9px] font-extrabold text-[#3E8B62] sm:text-[10px]">₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* PRICE */}
                  <div className="mt-4 space-y-2.5 border-t border-[#E8DDD4] pt-3 sm:mt-5 sm:space-y-3 sm:pt-4">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-[#806C63]">Subtotal</span>

                      <span className="font-bold text-[#351C18]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-[#806C63]">Delivery</span>

                      {deliveryCharge === 0 ? <span className="font-extrabold text-[#3E8B62]">FREE</span> : <span className="font-bold text-[#351C18]">₹{deliveryCharge}</span>}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E8DDD4] pt-3 sm:pt-4">
                      <div>
                        <p className="text-xs font-extrabold text-[#351C18] sm:text-sm">Total Amount</p>

                        <p className="mt-0.5 text-[8px] text-[#9A857B] sm:text-[9px]">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </p>
                      </div>

                      <span className="text-lg font-extrabold text-[#8E181F] sm:text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* DELIVERY */}
                  <div className="mt-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-2.5 sm:mt-4 sm:p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Truck size={14} className={deliveryCharge === 0 ? 'text-[#3E8B62]' : 'text-[#B87935]'} />

                        <p className="text-[9px] font-extrabold text-[#351C18] sm:text-[10px]">{deliveryCharge === 0 ? 'Free delivery unlocked' : 'Free delivery'}</p>
                      </div>

                      <span className="text-[8px] font-bold text-[#806C63] sm:text-[9px]">₹499</span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6DDD7]">
                      <div
                        className={`h-full rounded-full ${deliveryCharge === 0 ? 'bg-[#3E8B62]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26]'}`}
                        style={{
                          width: `${deliveryProgress}%`,
                        }}
                      />
                    </div>

                    {deliveryCharge > 0 ? (
                      <p className="mt-1.5 text-[8px] text-[#806C63] sm:mt-2 sm:text-[9px]">
                        Add <span className="font-extrabold text-[#8E181F]">₹{remainingForFreeDelivery.toLocaleString('en-IN')}</span> more for free delivery.
                      </p>
                    ) : (
                      <p className="mt-1.5 text-[8px] font-medium text-[#5F806C] sm:mt-2 sm:text-[9px]">You qualify for free delivery.</p>
                    )}
                  </div>

                  {/* WARNING */}
                  {hasUnavailableItems && (
                    <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-[#D9D9D9] bg-[#F3F3F3] px-2.5 py-2 sm:mt-3 sm:px-3 sm:py-2.5">
                      <AlertCircle size={12} className="mt-0.5 shrink-0 text-[#888888]" />

                      <p className="text-[8px] leading-4 text-[#777777] sm:text-[9px]">Checkout is unavailable until all unavailable products are removed or their quantities are adjusted.</p>
                    </div>
                  )}

                  {/* CHECKOUT */}
                  <button
                    type="button"
                    disabled={hasUnavailableItems}
                    onClick={() => navigate('/checkout')}
                    className={`group mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[10px] font-bold sm:mt-4 sm:h-11 sm:text-xs ${
                      hasUnavailableItems
                        ? 'cursor-not-allowed border border-[#D9D9D9] bg-[#E5E5E5] text-[#888888] shadow-none'
                        : 'bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 sm:hover:-translate-y-0.5 sm:hover:shadow-lg'
                    }`}
                  >
                    {hasUnavailableItems ? 'Unavailable Items in Cart' : 'Proceed to Checkout'}

                    {!hasUnavailableItems && <ChevronRight size={15} />}
                  </button>

                  {/* CONTINUE */}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="group mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-white text-[9px] font-bold text-[#67544D] sm:mt-2.5 sm:h-10 sm:text-[10px]"
                  >
                    <ChevronLeft size={13} />
                    Continue Shopping
                  </button>

                  {/* SECURE */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[8px] text-[#9A857B] sm:mt-4 sm:text-[9px]">
                    <ShieldCheck size={12} className="text-[#3E8B62]" />

                    <span>Safe & Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

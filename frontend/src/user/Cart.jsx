import React, { useEffect } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag, ExternalLink, AlertCircle, CircleCheck, PackageCheck, BadgeIndianRupee } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()

  const { cart, increaseCartItem, decreaseCartItem, removeCartItem } = useCart()

  const cartItems = cart?.items || []

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Cart | MineKart'
  }, [])

  /* cart calculations */
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

  /* disabled product logic */
  const isItemDisabled = (item) => {
    const product = item.productId

    return product?.status === 'Inactive' || (product?.stock || 0) <= 0
  }

  const isStockExceeded = (item) => {
    const stock = item.productId?.stock || 0
    return stock > 0 && item.quantity > stock
  }

  const hasUnavailableItems = cartItems.some((item) => isItemDisabled(item) || isStockExceeded(item))

  /* increase quantity */
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

  /* decrease quantity */
  const decreaseQuantity = async (item) => {
    const product = item.productId

    if (isItemDisabled(item)) {
      toast.error('This product is currently unavailable')
      return
    }

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
    }
  }

  /* remove item */
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

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4 sm:pt-5">
        {/* PAGE HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <ShoppingBag size={18} strokeWidth={1.9} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">My Cart</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 text-[8px] font-bold text-[#67544D] sm:px-2.5 sm:text-[9px]">
            <ShoppingBag size={12} strokeWidth={2} className="text-[#8E181F]" />

            <span>
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 && (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C9C0] bg-white px-5 text-center shadow-[0_3px_12px_rgba(73,54,49,0.04)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={30} strokeWidth={1.6} />
            </div>

            <h2 className="mt-5 text-lg font-extrabold text-[#351C18] sm:text-xl">Your cart is empty</h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#806C63] sm:text-sm">You haven't added any products yet. Start shopping and discover something you love.</p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-5 flex h-10 items-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              Start Shopping
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* CART */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* LEFT */}
            <div className="min-w-0">
              {/* SECTION HEADER */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-[#351C18] sm:text-lg">Shopping Cart</h2>

                  <p className="mt-0.5 truncate text-[10px] text-[#806C63] sm:text-xs">Review your products before checkout</p>
                </div>

                <span className="shrink-0 rounded-lg bg-[#F7EEE7] px-2.5 py-1.5 text-[9px] font-extrabold text-[#8E181F]">{totalItems} ITEMS</span>
              </div>

              {/* UNAVAILABLE WARNING */}
              {hasUnavailableItems && (
                <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-[#D9D9D9] bg-[#F3F3F3] px-3 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E7E7E7] text-[#888888]">
                    <AlertCircle size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold text-[#666666]">Some products need attention</p>

                    <p className="mt-0.5 text-[9px] leading-4 text-[#888888]">Remove unavailable products or adjust quantities before checkout.</p>
                  </div>
                </div>
              )}

              {/* PRODUCTS */}
              <div className="space-y-3">
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
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        disabled || stockExceeded
                          ? 'border-[#D9D9D9] bg-[#F3F3F3] shadow-none'
                          : 'border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.045)] hover:-translate-y-0.5 hover:border-[#D4BDB2] hover:shadow-[0_8px_22px_rgba(73,54,49,0.08)]'
                      }`}
                    >
                      {/* DISABLED TOP BAR */}
                      {(disabled || stockExceeded) && (
                        <div className="flex items-center gap-2 border-b border-[#D9D9D9] bg-[#EAEAEA] px-3 py-2">
                          <AlertCircle size={13} className="shrink-0 text-[#888888]" />

                          <span className="text-[9px] font-bold text-[#777777]">{disabled ? (product?.status === 'Inactive' ? 'Product is currently inactive' : 'Product is out of stock') : 'Requested quantity exceeds available stock'}</span>
                        </div>
                      )}

                      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                        {/* IMAGE */}
                        <button
                          type="button"
                          onClick={() => navigate(`/product/${product._id}`)}
                          disabled={disabled}
                          className={`relative flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border sm:h-32 sm:w-32 ${
                            disabled || stockExceeded ? 'cursor-not-allowed border-[#D9D9D9] bg-[#EAEAEA]' : 'border-[#E8DDD4] bg-white'
                          }`}
                        >
                          {product?.images?.[0] ? (
                            <img
                              src={`http://localhost:3000${product.images[0]}`}
                              alt={product.productName}
                              className={`h-full w-full object-contain p-2.5 transition-transform duration-300 sm:p-3 ${disabled || stockExceeded ? 'grayscale opacity-50' : 'hover:scale-105'}`}
                            />
                          ) : (
                            <div className="text-[9px] text-[#999999]">No Image</div>
                          )}

                          {disabled && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#777777] px-2 py-1 text-[8px] font-bold text-white">Unavailable</span>}

                          {!disabled && stockExceeded && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#777777] px-2 py-1 text-[8px] font-bold text-white">Stock Limited</span>}
                        </button>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">
                          {/* TOP */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className={`truncate text-[9px] font-bold uppercase tracking-wider ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>{product?.brand?.brandName || 'Brand'}</p>

                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${disabled || stockExceeded ? 'bg-[#999999]' : 'bg-[#3E8B62]'}`} />
                              </div>

                              <h3 className={`mt-1 line-clamp-2 text-[13px] font-bold leading-4.5 sm:text-sm ${disabled || stockExceeded ? 'text-[#888888]' : 'text-[#351C18]'}`}>{product?.productName}</h3>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex shrink-0 items-center gap-1">
                              {!disabled && (
                                <button
                                  type="button"
                                  onClick={() => navigate(`/product/${product._id}`)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9A857B] transition-colors hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                                  title="View Product"
                                >
                                  <ExternalLink size={14} />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                                  disabled || stockExceeded ? 'text-[#888888] hover:bg-[#E4E4E4] hover:text-[#666666]' : 'text-[#9A857B] hover:bg-[#FFF0F0] hover:text-[#A51D26]'
                                }`}
                                title="Remove"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* SIZE */}
                          {item.size && (
                            <div
                              className={`mt-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[9px] font-semibold ${
                                disabled || stockExceeded ? 'border-[#D9D9D9] bg-[#EAEAEA] text-[#888888]' : 'border-[#E8DDD4] bg-[#FBF7F2] text-[#67544D]'
                              }`}
                            >
                              Size:
                              <span className={`font-extrabold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#351C18]'}`}>{item.size}</span>
                            </div>
                          )}

                          {/* STOCK INFO */}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {disabled ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#E7E7E7] px-2 py-1 text-[8px] font-bold text-[#888888]">
                                <AlertCircle size={10} />
                                Unavailable
                              </span>
                            ) : stockExceeded ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#E7E7E7] px-2 py-1 text-[8px] font-bold text-[#777777]">
                                <AlertCircle size={10} />
                                Only {product?.stock || 0} available
                              </span>
                            ) : product?.stock <= 5 ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#FFF7EA] px-2 py-1 text-[8px] font-bold text-[#B87935]">
                                <PackageCheck size={10} />
                                Only {product.stock} left
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-[#F0F8F3] px-2 py-1 text-[8px] font-bold text-[#3E8B62]">
                                <CircleCheck size={10} />
                                In Stock
                              </span>
                            )}
                          </div>

                          {/* PRICE + QUANTITY */}
                          <div className={`mt-3 flex flex-wrap items-end justify-between gap-3 border-t pt-3 ${disabled || stockExceeded ? 'border-[#D9D9D9]' : 'border-[#F0E7E1]'}`}>
                            {/* PRICE */}
                            <div>
                              <p className={`text-[8px] font-bold uppercase tracking-wider ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>Price</p>

                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                                <span className={`text-base font-extrabold ${disabled || stockExceeded ? 'text-[#777777]' : 'text-[#351C18]'}`}>₹{unitPrice.toLocaleString('en-IN')}</span>

                                {originalPrice > unitPrice && <span className={`text-[9px] line-through ${disabled || stockExceeded ? 'text-[#AAAAAA]' : 'text-[#9A857B]'}`}>₹{originalPrice.toLocaleString('en-IN')}</span>}
                              </div>
                            </div>

                            {/* QUANTITY + TOTAL */}
                            <div className="flex items-end gap-3">
                              <div className={`flex h-8 overflow-hidden rounded-lg border ${disabled || stockExceeded ? 'border-[#D1D1D1] bg-[#EAEAEA]' : 'border-[#DCCFC7] bg-white'}`}>
                                <button
                                  type="button"
                                  onClick={() => decreaseQuantity(item)}
                                  disabled={disabled}
                                  className={`flex w-8 items-center justify-center border-r transition-colors ${
                                    disabled ? 'cursor-not-allowed border-[#D1D1D1] text-[#999999]' : 'border-[#DCCFC7] text-[#67544D] hover:bg-[#F7EEE7] hover:text-[#8E181F]'
                                  }`}
                                >
                                  {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                </button>

                                <span className={`flex min-w-9 items-center justify-center border-x text-[11px] font-extrabold ${disabled || stockExceeded ? 'border-[#D1D1D1] text-[#888888]' : 'border-[#DCCFC7] text-[#351C18]'}`}>
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => increaseQuantity(item)}
                                  disabled={disabled || item.quantity >= (product?.stock || 0)}
                                  className={`flex w-8 items-center justify-center transition-colors ${disabled || item.quantity >= (product?.stock || 0) ? 'cursor-not-allowed text-[#999999]' : 'text-[#8E181F] hover:bg-[#F7EEE7]'}`}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <div className="min-w-20 text-right">
                                <p className={`text-[8px] font-bold uppercase tracking-wider ${disabled || stockExceeded ? 'text-[#999999]' : 'text-[#9A857B]'}`}>Total</p>

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
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-[#E8DDD4] bg-white px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F8F3] text-[#3E8B62]">
                    <Truck size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#351C18]">Free Delivery</p>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">On orders ₹499+</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-[#E8DDD4] bg-white px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#351C18]">Secure Payment</p>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">Safe checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-[#E8DDD4] bg-white px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF7EA] text-[#B87935]">
                    <Tag size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#351C18]">Best Prices</p>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">Great deals for you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SUMMARY */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.07)] lg:sticky lg:top-24">
                {/* SUMMARY HEADER */}
                <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-4 py-4 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-extrabold text-[#351C18]">Order Summary</h2>

                      <p className="mt-0.5 text-[10px] text-[#806C63]">Price details</p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                      <BadgeIndianRupee size={16} />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {/* ITEMS */}
                  <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
                    {cartItems.map((item, index) => {
                      const disabled = isItemDisabled(item)
                      const stockExceeded = isStockExceeded(item)

                      return (
                        <div key={`${item.productId?._id}-${index}`} className={`flex items-start justify-between gap-3 ${disabled || stockExceeded ? 'opacity-60' : ''}`}>
                          <div className="flex min-w-0 items-start gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[9px] font-extrabold text-[#8E181F]">{index + 1}</span>

                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-bold text-[#351C18]">{item.productId?.productName}</p>

                              <p className="mt-0.5 text-[9px] text-[#9A857B]">
                                Qty {item.quantity}
                                {item.size ? ` · Size ${item.size}` : ''}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 text-[11px] font-extrabold text-[#351C18]">₹{(item.totalPrice || 0).toLocaleString('en-IN')}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* SAVINGS */}
                  {totalSavings > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag size={13} className="text-[#3E8B62]" />

                        <span className="text-[9px] font-bold text-[#34704F]">Total Savings</span>
                      </div>

                      <span className="text-[10px] font-extrabold text-[#3E8B62]">₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* PRICE */}
                  <div className="mt-5 space-y-3 border-t border-[#E8DDD4] pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#806C63]">Subtotal</span>

                      <span className="font-bold text-[#351C18]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#806C63]">Delivery</span>

                      {deliveryCharge === 0 ? <span className="font-extrabold text-[#3E8B62]">FREE</span> : <span className="font-bold text-[#351C18]">₹{deliveryCharge}</span>}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E8DDD4] pt-4">
                      <div>
                        <p className="text-sm font-extrabold text-[#351C18]">Total Amount</p>

                        <p className="mt-0.5 text-[9px] text-[#9A857B]">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </p>
                      </div>

                      <span className="text-xl font-extrabold text-[#8E181F]">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* DELIVERY PROGRESS */}
                  <div className="mt-4 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Truck size={15} className={deliveryCharge === 0 ? 'text-[#3E8B62]' : 'text-[#B87935]'} />

                        <p className="text-[10px] font-extrabold text-[#351C18]">{deliveryCharge === 0 ? 'Free delivery unlocked' : 'Free delivery'}</p>
                      </div>

                      <span className="text-[9px] font-bold text-[#806C63]">₹499</span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6DDD7]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${deliveryCharge === 0 ? 'bg-[#3E8B62]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26]'}`}
                        style={{
                          width: `${deliveryProgress}%`,
                        }}
                      />
                    </div>

                    {deliveryCharge > 0 ? (
                      <p className="mt-2 text-[9px] text-[#806C63]">
                        Add <span className="font-extrabold text-[#8E181F]">₹{remainingForFreeDelivery.toLocaleString('en-IN')}</span> more for free delivery.
                      </p>
                    ) : (
                      <p className="mt-2 text-[9px] font-medium text-[#5F806C]">You qualify for free delivery.</p>
                    )}
                  </div>

                  {/* CHECKOUT DISABLED WARNING */}
                  {hasUnavailableItems && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#D9D9D9] bg-[#F3F3F3] px-3 py-2.5">
                      <AlertCircle size={13} className="mt-0.5 shrink-0 text-[#888888]" />

                      <p className="text-[9px] leading-4 text-[#777777]">Checkout is unavailable until all unavailable products are removed or their quantities are adjusted.</p>
                    </div>
                  )}

                  {/* CHECKOUT */}
                  <button
                    type="button"
                    disabled={hasUnavailableItems}
                    onClick={() => navigate('/checkout')}
                    className={`group mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      hasUnavailableItems
                        ? 'cursor-not-allowed border border-[#D9D9D9] bg-[#E5E5E5] text-[#888888] shadow-none'
                        : 'bg-linear-to-r from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    {hasUnavailableItems ? 'Unavailable Items in Cart' : 'Proceed to Checkout'}

                    {!hasUnavailableItems && <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
                  </button>

                  {/* CONTINUE */}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="group mt-2.5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-white text-[10px] font-bold text-[#67544D] transition-all duration-200 hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]"
                  >
                    <ChevronLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                    Continue Shopping
                  </button>

                  {/* SECURE */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-[#9A857B]">
                    <ShieldCheck size={13} className="text-[#3E8B62]" />

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

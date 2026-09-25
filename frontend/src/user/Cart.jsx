import React, { useEffect } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag, Sparkles, Share, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, increaseCartItem, decreaseCartItem, removeCartItem } = useCart()
  const cartItems = cart?.items || []
  // not here

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Cart | MineKart'
  }, [])

  // ! increase Quantity
  const increaseQuantity = async (item) => {
    const product = item.productId
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
        return
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to increase quantity')
    }
  }

  // ! Decrease Quantity
  const decreaseQuantity = async (item) => {
    const product = item.productId

    try {
      const res = await decreaseCartItem({
        productId: product._id,
        size: item.size || null,
      })

      if (!res?.success) {
        toast.error(res?.message || 'Unable to decrease quantity')
        return
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to decrease quantity')
    }
  }

  const removeItem = async (item) => {
    const res = await removeCartItem({
      productId: item.productId._id,
      size: item.size || null,
    })

    if (!res?.success) {
      toast.error(res?.message || 'Unable to remove product')
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart?.subtotal || 0
  const deliveryCharge = subtotal >= 499 ? 0 : 40
  const grandTotal = subtotal + deliveryCharge

  const items = [{ title: 'Cart', link: null }]

  return (
    <div className="min-h-screen bg-[#FBF9F7]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-4 pb-10 sm:pt-6">
        {/* PAGE HEADER */}
        <div className="mb-5 flex items-center justify-between border-b border-[#E8DDD4] bg-white px-1 pb-4 sm:mb-6 sm:px-0">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#A51D26] text-white sm:h-11 sm:w-11">
              <ShoppingBag size={21} strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">My Cart</h1>

              <p className="mt-0.5 text-[10px] text-[#806C63] sm:text-xs">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 rounded-md border border-[#E8DDD4] bg-[#FFFDFC] px-3 py-2 text-[10px] font-bold text-[#67544D] sm:flex">
            <ShoppingBag size={13} />
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </div>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 && (
          <div className="mx-auto flex min-h-96 max-w-3xl flex-col items-center justify-center rounded-xl border border-[#E8DDD4] bg-white px-5 text-center shadow-[0_2px_10px_rgba(73,54,49,0.04)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={34} strokeWidth={1.5} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">Your cart is empty</h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#806C63] sm:text-sm">You haven't added any products yet. Start shopping and add your favourite products to the cart.</p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-5 flex items-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              Start Shopping
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* CART */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* LEFT */}
            <div className="min-w-0">
              {/* CART SECTION HEADER */}
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#351C18] sm:text-lg">Shopping Cart</h2>

                  <p className="mt-0.5 text-[10px] text-[#806C63] sm:text-xs">Review your products before checkout</p>
                </div>

                <span className="rounded-md bg-[#F7EEE7] px-2.5 py-1.5 text-[9px] font-bold text-[#8E181F]">{totalItems} ITEMS</span>
              </div>

              {/* PRODUCTS */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = item.productId
                  const unitPrice = item.discountPrice || item.price
                  const itemTotal = unitPrice * item.quantity

                  return (
                    <div
                      key={`${product._id}-${item.size || 'no-size'}`}
                      className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_8px_rgba(73,54,49,0.045)] transition-all duration-200 hover:border-[#D4BDB2] hover:shadow-[0_6px_18px_rgba(73,54,49,0.08)]"
                    >
                      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                        {/* IMAGE */}
                        <button type="button" onClick={() => navigate(`/product/${product._id}`)} className="relative flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8DDD4] bg-white sm:h-32 sm:w-32">
                          {product?.images?.[0] ? (
                            <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain p-2.5 transition-transform duration-300 hover:scale-105 sm:p-3" />
                          ) : (
                            <div className="text-[9px] text-[#9A857B]">No Image</div>
                          )}

                          {product.stock <= 0 && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#351C18]/90 px-2 py-1 text-[8px] font-bold text-white">Out of Stock</span>}
                        </button>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">
                          {/* TOP */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="truncate text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${product.stock > 0 ? 'bg-[#3E8B62]' : 'bg-[#A51D26]'}`} />
                              </div>

                              <h3 className="mt-1 line-clamp-2 text-[13px] font-bold leading-4.5 text-[#351C18] sm:text-sm">{product.productName}</h3>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-[#9A857B] transition-colors hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                                title="View Product"
                              >
                                <ExternalLink size={14} />
                              </button>

                              <button type="button" onClick={() => removeItem(item)} className="flex h-7 w-7 items-center justify-center rounded-md text-[#9A857B] transition-colors hover:bg-[#FFF0F0] hover:text-[#A51D26]" title="Remove">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* SIZE */}
                          {item.size && (
                            <div className="mt-2 inline-flex items-center gap-1 rounded border border-[#E8DDD4] bg-[#FBF7F2] px-2 py-1 text-[9px] font-semibold text-[#67544D]">
                              Size:
                              <span className="font-extrabold text-[#351C18]">{item.size}</span>
                            </div>
                          )}

                          {/* PRICE + QUANTITY */}
                          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[#F0E7E1] pt-3">
                            {/* PRICE */}
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Price</p>

                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="text-base font-extrabold text-[#351C18]">₹{unitPrice.toLocaleString('en-IN')}</span>

                                {item.price > unitPrice && <span className="text-[9px] text-[#9A857B] line-through">₹{item.price.toLocaleString('en-IN')}</span>}
                              </div>
                            </div>

                            {/* QUANTITY + TOTAL */}
                            <div className="flex items-end gap-3">
                              {/* QUANTITY */}
                              <div className="flex h-8 overflow-hidden rounded-md border border-[#DCCFC7] bg-white">
                                <button type="button" onClick={() => decreaseQuantity(item)} className="flex w-8 items-center justify-center text-[#67544D] transition-colors hover:bg-[#F7EEE7] hover:text-[#8E181F]">
                                  <Minus size={12} />
                                </button>

                                <span className="flex min-w-8 items-center justify-center border-x border-[#DCCFC7] text-[11px] font-extrabold text-[#351C18]">{item.quantity}</span>

                                <button
                                  type="button"
                                  onClick={() => increaseQuantity(item)}
                                  disabled={item.quantity >= (product.stock || 0)}
                                  className="flex w-8 items-center justify-center text-[#8E181F] transition-colors hover:bg-[#F7EEE7] disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* TOTAL */}
                              <div className="min-w-20 text-right">
                                <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Total</p>

                                <p className="text-sm font-extrabold text-[#8E181F]">₹{itemTotal.toLocaleString('en-IN')}</p>
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
                <div className="flex items-center gap-2.5 rounded-lg border border-[#E8DDD4] bg-white px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F0F8F3] text-[#3E8B62]">
                    <Truck size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#351C18]">Free Delivery</p>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">On orders ₹499+</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-[#E8DDD4] bg-white px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[#8E181F]">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#351C18]">Secure Payment</p>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">Safe checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-[#E8DDD4] bg-white px-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FFF7EA] text-[#B87935]">
                    <Tag size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#351C18]">Best Prices</p>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">Great deals for you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.08)] lg:sticky lg:top-24">
                {/* HEADER */}
                <div className="border-b border-[#E8DDD4] bg-[#FBF7F2] px-4 py-4 sm:px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-[#351C18]">Order Summary</h2>

                      <p className="mt-0.5 text-[10px] text-[#806C63]">Price details</p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A51D26] text-white">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4 sm:p-5">
                  {/* ITEMS */}
                  <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-start justify-between gap-3">
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

                        <span className="shrink-0 text-[11px] font-extrabold text-[#351C18]">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* PRICE DETAILS */}
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

                  {/* FREE DELIVERY MESSAGE */}
                  {subtotal < 499 ? (
                    <div className="mt-4 rounded-lg border border-[#EADCC8] bg-[#FFF8EF] px-3 py-3">
                      <div className="flex items-start gap-2.5">
                        <Truck size={15} className="mt-0.5 shrink-0 text-[#B87935]" />

                        <div>
                          <p className="text-[10px] font-bold text-[#79562F]">Add ₹{(499 - subtotal).toLocaleString('en-IN')} more</p>

                          <p className="mt-0.5 text-[9px] leading-4 text-[#8B6A46]">Get free delivery on your order.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <Truck size={15} className="shrink-0 text-[#3E8B62]" />

                        <div>
                          <p className="text-[10px] font-bold text-[#34704F]">Free delivery unlocked</p>

                          <p className="mt-0.5 text-[9px] text-[#5F806C]">You qualify for free delivery.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHECKOUT */}
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="group mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                  >
                    Proceed to Checkout
                    <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
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

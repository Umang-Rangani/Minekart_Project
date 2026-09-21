import React, { useEffect } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, increaseCartItem, decreaseCartItem, removeCartItem } = useCart()
  const cartItems = cart?.items || []

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  const increaseQuantity = async (item) => {
    const productStock = item.productId?.stock || 0

    if (item.quantity >= productStock) {
      return
    }

    await increaseCartItem({
      productId: item.productId._id,
      size: item.size || null,
    })
  }

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 0) {
      return
    }

    await decreaseCartItem({
      productId: item.productId._id,
      size: item.size || null,
    })
  }

  const removeItem = async (item) => {
    await removeCartItem({
      productId: item.productId._id,
      size: item.size || null,
    })
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart?.subtotal || 0
  const deliveryCharge = subtotal >= 499 ? 0 : 40
  const grandTotal = subtotal + deliveryCharge

  const items = [{ title: 'Cart', link: null }]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-6">
        {/* PAGE HEADER */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_6px_24px_rgba(73,54,49,0.07)]">
          <div className="flex min-h-22 items-center justify-between gap-5 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/15">
                <ShoppingBag size={26} strokeWidth={1.8} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#FFFDFC] bg-[#D4A373]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                  <h1 className="truncate text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">My Cart</h1>
                </div>

                <p className="ml-3.5 mt-1 text-xs font-medium text-[#806C63] sm:text-sm">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#8E181F] shadow-sm">
              <ShoppingBag size={16} />
              <span>
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT */}
          <div className="min-w-0">
            {cartItems.length === 0 ? (
              <div className="flex min-h-115 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-6 text-center shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F7EEE7] text-[#8E181F]">
                  <ShoppingBag size={36} strokeWidth={1.5} />
                </div>

                <h2 className="mt-6 text-2xl font-extrabold text-[#351C18]">Your cart is empty</h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#806C63]">Looks like you haven't added anything to your cart yet. Explore our products and find something you love.</p>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-7 flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Start Shopping
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <>
                {/* CART TITLE */}
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#351C18]">Shopping Cart</h2>
                    <p className="mt-1 text-xs font-medium text-[#806C63] sm:text-sm">Review your selected products</p>
                  </div>

                  <span className="hidden rounded-lg bg-[#F7EEE7] px-3.5 py-2 text-[10px] font-extrabold tracking-wide text-[#8E181F] sm:block">
                    {totalItems} {totalItems === 1 ? 'PRODUCT' : 'PRODUCTS'}
                  </span>
                </div>

                {/* PRODUCTS */}
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = item.productId
                    const unitPrice = item.discountPrice || item.price
                    const itemTotal = unitPrice * item.quantity

                    return (
                      <div
                        key={`${product._id}-${item.size || 'no-size'}`}
                        className="group rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 shadow-[0_4px_16px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:shadow-[0_12px_30px_rgba(73,54,49,0.10)] sm:p-5"
                      >
                        <div className="flex gap-4 sm:gap-5">
                          {/* IMAGE + QUANTITY */}
                          <div className="w-27 shrink-0 sm:w-34">
                            <button
                              type="button"
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="group/image relative block h-32 w-27 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-br from-[#FFFDFC] to-[#F7EEE7] sm:h-36 sm:w-34"
                            >
                              <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#A51D26]/5" />

                              <img src={`http://localhost:3000${product?.images?.[0]}`} alt={product?.productName} className="relative z-10 h-full w-full object-contain p-3 transition-transform duration-500 group-hover/image:scale-110" />

                              {product.stock <= 0 && <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#351C18]/90 px-2.5 py-1.5 text-[9px] font-bold text-white">Out of Stock</span>}
                            </button>

                            {/* QUANTITY */}
                            <div className="mt-3 flex h-10 items-center justify-center overflow-hidden rounded-xl border border-[#E2D5CC] bg-[#FFFDFC]">
                              <button type="button" onClick={() => decreaseQuantity(item)} className="flex h-full w-10 items-center justify-center text-[#806C63] transition-colors duration-200 hover:bg-[#F7EEE7] hover:text-[#8E181F]">
                                <Minus size={15} />
                              </button>

                              <span className="flex h-full min-w-10 items-center justify-center border-x border-[#E2D5CC] text-sm font-extrabold text-[#351C18]">{item.quantity}</span>

                              <button type="button" onClick={() => increaseQuantity(item)} className="flex h-full w-10 items-center justify-center text-[#8E181F] transition-colors duration-200 hover:bg-[#F7EEE7]">
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>

                          {/* DETAILS */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                                <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold leading-6 text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F] sm:text-lg">{product.productName}</h3>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#B3A39B] transition-all duration-200 hover:bg-[#FFF0F0] hover:text-[#A51D26]"
                                title="Remove"
                              >
                                <Trash2 size={17} strokeWidth={1.8} />
                              </button>
                            </div>

                            {item.size && (
                              <div className="mt-3 inline-flex items-center rounded-lg border border-[#E8DDD4] bg-[#F7EEE7] px-3 py-1.5 text-[11px] font-semibold text-[#67544D]">
                                Size <span className="ml-1.5 font-extrabold text-[#351C18]">{item.size}</span>
                              </div>
                            )}

                            {/* PRICE AREA */}
                            <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t border-[#F0E7E1] pt-4">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Unit Price</p>

                                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                                  <span className="text-lg font-extrabold text-[#351C18]">₹{unitPrice.toLocaleString('en-IN')}</span>

                                  {item.price > unitPrice && <span className="text-xs font-medium text-[#9A857B] line-through">₹{item.price.toLocaleString('en-IN')}</span>}
                                </div>
                              </div>

                              <div className="rounded-xl bg-[#F7EEE7] px-4 py-2.5 text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Item Total</p>

                                <p className="mt-0.5 text-lg font-extrabold text-[#8E181F]">₹{itemTotal.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* BENEFITS */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F8F3] text-[#3E8B62]">
                      <Truck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#351C18]">Free Delivery</p>
                      <p className="mt-1 text-[10px] text-[#806C63]">On orders ₹499+</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#351C18]">Secure Payment</p>
                      <p className="mt-1 text-[10px] text-[#806C63]">Safe checkout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8EEE1] text-[#B87935]">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#351C18]">Best Prices</p>
                      <p className="mt-1 text-[10px] text-[#806C63]">Great deals for you</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT - SUMMARY */}
          {cartItems.length > 0 && (
            <div className="min-w-0">
              <div className="h-fit overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_10px_35px_rgba(73,54,49,0.10)] lg:sticky lg:top-24">
                {/* SUMMARY HEADER */}
                <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-6 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold text-[#351C18]">Order Summary</h2>
                      <p className="mt-1 text-xs font-medium text-[#806C63]">Review your items before checkout</p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md">
                      <ShoppingBag size={18} strokeWidth={2} />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* ITEMS */}
                  <div className="max-h-60 space-y-4 overflow-y-auto pr-1 [scrollbar-color:#CDBDB4_transparent] scrollbar-thin">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[10px] font-extrabold text-[#8E181F]">{index + 1}</span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#351C18]">{item.productId?.productName}</p>

                            <p className="mt-1 text-[11px] text-[#9A857B]">
                              {item.productId?.brand?.brandName} · Qty {item.quantity}
                            </p>

                            {item.size && <p className="mt-1 text-[11px] font-medium text-[#9A857B]">Size: {item.size}</p>}
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-extrabold text-[#351C18]">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* PRICE DETAILS */}
                  <div className="mt-6 space-y-4 border-t border-[#E8DDD4] pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#806C63]">Subtotal</span>
                      <span className="font-bold text-[#351C18]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#806C63]">Delivery</span>

                      {deliveryCharge === 0 ? <span className="font-extrabold text-[#3E8B62]">FREE</span> : <span className="font-bold text-[#351C18]">₹{deliveryCharge}</span>}
                    </div>

                    <div className="flex items-end justify-between border-t border-[#E8DDD4] pt-5">
                      <div>
                        <p className="text-base font-extrabold text-[#351C18]">Grand Total</p>
                        <p className="mt-1 text-[11px] font-medium text-[#9A857B]">{totalItems} items</p>
                      </div>

                      <span className="text-3xl font-extrabold tracking-tight text-[#8E181F]">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* DELIVERY MESSAGE */}
                  {subtotal < 499 ? (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#EADCC8] bg-[#FFF8EF] px-4 py-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                        <Truck size={16} strokeWidth={2} className="text-[#B87935]" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-[#79562F]">Almost there!</p>
                        <p className="mt-1 text-[10px] leading-4 text-[#8B6A46]">Add ₹{(499 - subtotal).toLocaleString('en-IN')} more to unlock free delivery.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#D5E8DA] bg-[#F0F8F3] px-4 py-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                        <Truck size={16} strokeWidth={2} className="text-[#3E8B62]" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-[#34704F]">Free delivery unlocked!</p>
                        <p className="mt-1 text-[10px] text-[#5F806C]">You qualify for free delivery on this order.</p>
                      </div>
                    </div>
                  )}

                  {/* CHECKOUT */}
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="group mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] via-[#8E181F] to-[#A51D26] px-5 text-sm font-bold text-white shadow-lg shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#7D171C]/25 active:scale-[0.98]"
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronRight size={19} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  {/* CONTINUE SHOPPING */}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="group mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] text-xs font-bold text-[#67544D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#8E181F]"
                  >
                    <ChevronLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                    <span>Continue Shopping</span>
                  </button>

                  {/* SECURE CHECKOUT */}
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#9A857B]">
                    <ShieldCheck size={14} strokeWidth={2} className="text-[#3E8B62]" />
                    <span>Safe & Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

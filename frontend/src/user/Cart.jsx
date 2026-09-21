import React, { useEffect } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, updateCartItem, removeCartItem } = useCart()
  const cartItems = cart?.items || []

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [cart])

  const increaseQuantity = async (item) => {
    const newQuantity = item.quantity + 1
    const productStock = item.productId?.stock || 0

    if (newQuantity > productStock) {
      return
    }

    await updateCartItem({
      productId: item.productId._id,
      size: item.size || null,
      quantity: newQuantity,
    })
  }

  const decreaseQuantity = async (item) => {
    if (item.quantity === 1) {
      await removeCartItem({
        productId: item.productId._id,
        size: item.size || null,
      })

      return
    }

    const newQuantity = item.quantity - 1

    await updateCartItem({
      productId: item.productId._id,
      size: item.size || null,
      quantity: newQuantity,
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
    <div className="min-h-screen ">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-5">
        {/* PAGE HEADER */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_4px_18px_rgba(73,54,49,0.06)]">
          <div className="flex min-h-19 items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15 sm:h-12 sm:w-12">
                <ShoppingBag size={23} strokeWidth={1.8} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#FFFDFC] bg-[#D4A373]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                  <h1 className="truncate text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">My Cart</h1>
                </div>

                <p className="ml-3 mt-0.5 truncate text-[11px] text-[#806C63] sm:text-xs">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-2 text-[11px] font-bold text-[#8E181F] shadow-sm sm:px-3.5">
              <ShoppingBag size={14} />
              <span>
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* LEFT */}
          <div className="min-w-0">
            {cartItems.length === 0 ? (
              <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-6 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
                  <ShoppingBag size={30} strokeWidth={1.6} />
                </div>

                <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">Your cart is empty</h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#806C63]">Looks like you haven't added anything to your cart yet. Explore our products and find something you love.</p>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start Shopping
                  <ChevronRight size={17} />
                </button>
              </div>
            ) : (
              <>
                {/* CART TITLE */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-[#351C18]">Shopping Cart</h2>
                    <p className="mt-0.5 text-xs text-[#806C63]">Review your selected products</p>
                  </div>

                  <span className="hidden rounded-lg bg-[#F7EEE7] px-3 py-1.5 text-[10px] font-bold text-[#8E181F] sm:block">
                    {totalItems} {totalItems === 1 ? 'PRODUCT' : 'PRODUCTS'}
                  </span>
                </div>

                {/* PRODUCTS */}
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const product = item.productId

                    return (
                      <div
                        key={`${product._id}-${item.size || 'no-size'}`}
                        className="group rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5 shadow-[0_3px_12px_rgba(73,54,49,0.05)] transition-all duration-300 hover:border-[#CDAFA4] hover:shadow-[0_10px_25px_rgba(73,54,49,0.10)] sm:p-4"
                      >
                        <div className="flex gap-3 sm:gap-4">
                          {/* IMAGE */}
                          <div className="w-23 shrink-0 sm:w-28">
                            <button
                              type="button"
                              onClick={() => navigate(`/product/${product._id}`)}
                              className="group/image relative block h-28 w-23 overflow-hidden rounded-xl border border-[#E8DDD4] bg-linear-to-br from-[#FFFDFC] to-[#F7EEE7] sm:h-32 sm:w-28"
                            >
                              <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-[#A51D26]/5" />

                              <img src={`http://localhost:3000${product?.images?.[0]}`} alt={product?.productName} className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-500 group-hover/image:scale-110" />

                              {product.stock <= 0 && <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-md bg-[#351C18]/90 px-2 py-1 text-[9px] font-bold text-white">Out of Stock</span>}
                            </button>

                            {/* QUANTITY */}
                            <div className="mt-2.5 flex h-9 items-center justify-center overflow-hidden rounded-lg border border-[#E2D5CC] bg-[#FFFDFC]">
                              <button type="button" onClick={() => decreaseQuantity(item)} className="flex h-full w-8 items-center justify-center text-[#806C63] transition-colors duration-200 hover:bg-[#F7EEE7] hover:text-[#8E181F]">
                                <Minus size={13} />
                              </button>

                              <span className="flex h-full min-w-9 items-center justify-center border-x border-[#E2D5CC] text-xs font-extrabold text-[#351C18]">{item.quantity}</span>

                              <button type="button" onClick={() => increaseQuantity(item)} className="flex h-full w-8 items-center justify-center text-[#8E181F] transition-colors duration-200 hover:bg-[#F7EEE7]">
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* DETAILS */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-[9px] font-bold uppercase tracking-[0.13em] text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                                <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-5 text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F] sm:text-[15px]">{product.productName}</h3>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#B3A39B] transition-all duration-200 hover:bg-[#FFF0F0] hover:text-[#A51D26]"
                                title="Remove"
                              >
                                <Trash2 size={16} strokeWidth={1.8} />
                              </button>
                            </div>

                            {item.size && (
                              <div className="mt-2 inline-flex items-center rounded-lg border border-[#E8DDD4] bg-[#F7EEE7] px-2.5 py-1 text-[10px] font-semibold text-[#67544D]">
                                Size <span className="ml-1 font-extrabold text-[#351C18]">{item.size}</span>
                              </div>
                            )}

                            <div className="mt-3 flex items-end justify-between gap-3">
                              <div>
                                <p className="text-[10px] text-[#9A857B]">Price</p>

                                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                  <span className="text-base font-extrabold text-[#351C18]">₹{(item.discountPrice || item.price).toLocaleString('en-IN')}</span>

                                  {item.price > (item.discountPrice || item.price) && <span className="text-[11px] text-[#9A857B] line-through">₹{item.price.toLocaleString('en-IN')}</span>}
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-[10px] text-[#9A857B]">Item Total</p>
                                <p className="mt-0.5 text-base font-extrabold text-[#8E181F]">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</p>
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
                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F8F3] text-[#3E8B62]">
                      <Truck size={17} />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-[#351C18]">Free Delivery</p>
                      <p className="mt-0.5 text-[10px] text-[#806C63]">On orders ₹499+</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                      <ShieldCheck size={17} />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-[#351C18]">Secure Payment</p>
                      <p className="mt-0.5 text-[10px] text-[#806C63]">Safe checkout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F8EEE1] text-[#B87935]">
                      <Tag size={17} />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-[#351C18]">Best Prices</p>
                      <p className="mt-0.5 text-[10px] text-[#806C63]">Great deals for you</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT - SUMMARY */}
          {cartItems.length > 0 && (
            <div className="min-w-0">
              <div className="h-fit overflow-hidden rounded-2xl border border-[#E2D5CC] bg-[#FFFDFC] shadow-[0_8px_30px_rgba(73,54,49,0.09)] lg:sticky lg:top-24">
                {/* SUMMARY HEADER */}
                <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-[#351C18]">Order Summary</h2>
                      <p className="mt-0.5 text-[11px] text-[#806C63]">Review before checkout</p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                      <ShoppingBag size={17} />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* ITEMS */}
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F7EEE7] text-[10px] font-extrabold text-[#8E181F]">{index + 1}</span>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#351C18]">{item.productId?.productName}</p>
                            <p className="mt-0.5 truncate text-[10px] text-[#9A857B]">
                              {item.productId?.brand?.brandName} · Qty {item.quantity}
                            </p>
                            {item.size && <p className="mt-0.5 text-[10px] text-[#9A857B]">Size: {item.size}</p>}
                          </div>
                        </div>

                        <span className="shrink-0 text-xs font-extrabold text-[#351C18]">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* PRICE */}
                  <div className="mt-5 space-y-3 border-t border-[#E8DDD4] pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#806C63]">Subtotal</span>
                      <span className="font-bold text-[#351C18]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#806C63]">Delivery</span>
                      {deliveryCharge === 0 ? <span className="font-bold text-[#3E8B62]">FREE</span> : <span className="font-bold text-[#351C18]">₹{deliveryCharge}</span>}
                    </div>

                    <div className="flex items-end justify-between border-t border-[#E8DDD4] pt-4">
                      <div>
                        <p className="text-sm font-extrabold text-[#351C18]">Grand Total</p>
                        <p className="mt-0.5 text-[10px] text-[#9A857B]">{totalItems} items</p>
                      </div>

                      <span className="text-2xl font-extrabold tracking-tight text-[#8E181F]">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* DELIVERY MESSAGE */}
                  {subtotal < 499 ? (
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#EADCC8] bg-[#FBF4E8] px-3.5 py-3">
                      <Truck size={16} className="mt-0.5 shrink-0 text-[#B87935]" />
                      <p className="text-[10px] font-semibold leading-4 text-[#79562F]">Add ₹{(499 - subtotal).toLocaleString('en-IN')} more to unlock free delivery.</p>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#D5E8DA] bg-[#F0F8F3] px-3.5 py-3">
                      <Truck size={16} className="shrink-0 text-[#3E8B62]" />
                      <p className="text-[10px] font-bold text-[#34704F]">Free delivery unlocked!</p>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] text-sm font-bold text-white shadow-md shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F] hover:shadow-lg"
                  >
                    Proceed to Checkout
                    <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  {/* CONTINUE */}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] text-xs font-bold text-[#67544D] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#8E181F]"
                  >
                    <ChevronLeft size={15} />
                    Continue Shopping
                  </button>

                  {/* SECURE */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#9A857B]">
                    <ShieldCheck size={13} className="text-[#3E8B62]" />
                    Safe & Secure Checkout
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

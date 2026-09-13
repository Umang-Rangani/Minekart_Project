import React, { useState } from 'react'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck, Tag, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      productName: 'Nike Air Max Running Shoes',
      brand: 'Nike',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      size: 'M',
      price: 2499,
      quantity: 2,
      totalPrice: 4998,
    },
    {
      id: 2,
      productName: 'Premium Casual T-Shirt',
      brand: 'Puma',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      size: 'L',
      price: 999,
      quantity: 1,
      totalPrice: 999,
    },
  ])

  const increaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.price * (item.quantity + 1),
            }
          : item,
      ),
    )
  }

  const decreaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: item.price * (item.quantity - 1),
            }
          : item,
      ),
    )
  }

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0)

  const deliveryCharge = subtotal >= 499 ? 0 : 40

  const grandTotal = subtotal + deliveryCharge

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-3 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-bold text-[#172033] shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] hover:shadow-md"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-1 rounded-full bg-[#1D4ED8]" />

              <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">My Cart</h1>
            </div>

            <p className="mt-1 ml-3 text-sm text-[#64748B]">Review your items before checkout</p>
          </div>

          {cartItems.length > 0 && (
            <span className="rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-bold text-[#1D4ED8]">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="flex min-h-[55vh] items-center justify-center rounded-3xl border border-[#E2E8F0] bg-white px-6 py-12 shadow-sm">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
                <ShoppingBag size={42} strokeWidth={1.7} />
              </div>

              <h2 className="mt-6 text-2xl font-extrabold text-[#172033]">Your cart is empty</h2>

              <p className="mt-2 text-sm leading-6 text-[#64748B]">Looks like you haven't added anything to your cart yet. Explore our products and find something you love.</p>

              <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#1E40AF] hover:shadow-xl">
                Continue Shopping
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            {/* LEFT - Cart Items */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                <div className="border-b border-[#E2E8F0] px-5 py-4">
                  <h2 className="text-base font-extrabold text-[#172033]">Cart Items</h2>
                </div>

                <div className="divide-y divide-[#E2E8F0]">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4 transition hover:bg-[#FAFBFD] sm:p-5">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link to={`/product/${item.id}`} className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] sm:h-32 sm:w-28">
                          <img src={item.image} alt={item.productName} className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105" />
                        </Link>

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-[#64748B]">{item.brand}</p>

                              <Link to={`/product/${item.id}`} className="mt-1 block text-sm font-extrabold leading-5 text-[#172033] transition hover:text-[#1D4ED8] sm:text-base">
                                {item.productName}
                              </Link>
                            </div>

                            {/* Remove */}
                            <button type="button" onClick={() => removeItem(item.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#FEF2F2] hover:text-[#DC2626]" title="Remove">
                              <Trash2 size={17} />
                            </button>
                          </div>

                          {/* Size */}
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-[#64748B]">Size:</span>

                            <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-bold text-[#172033]">{item.size}</span>
                          </div>

                          {/* Price + Quantity */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <span className="text-lg font-extrabold text-[#172033]">₹{item.price.toLocaleString('en-IN')}</span>

                              <span className="ml-2 text-xs text-[#64748B]">each</span>
                            </div>

                            {/* Quantity */}
                            <div className="flex h-10 items-center overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(item.id)}
                                disabled={item.quantity === 1}
                                className="flex h-full w-10 items-center justify-center text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Minus size={15} />
                              </button>

                              <span className="flex h-full min-w-10 items-center justify-center border-x border-[#E2E8F0] px-2 text-sm font-extrabold text-[#172033]">{item.quantity}</span>

                              <button type="button" onClick={() => increaseQuantity(item.id)} className="flex h-full w-10 items-center justify-center text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F8FAFC] px-4 py-3">
                        <span className="text-xs font-semibold text-[#64748B]">Item Total</span>

                        <span className="text-base font-extrabold text-[#1D4ED8]">₹{item.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#16A34A]">
                    <Truck size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#172033]">Fast Delivery</p>
                    <p className="mt-0.5 text-[11px] text-[#64748B]">Quick doorstep delivery</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#172033]">Secure Shopping</p>
                    <p className="mt-0.5 text-[11px] text-[#64748B]">Safe & trusted checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#D97706]">
                    <Tag size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#172033]">Best Prices</p>
                    <p className="mt-0.5 text-[11px] text-[#64748B]">Great deals every day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT - Order Summary */}
            <div className="h-fit lg:sticky lg:top-5">
              <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-[#E2E8F0] px-5 py-4">
                  <h2 className="text-base font-extrabold text-[#172033]">Order Summary</h2>
                </div>

                <div className="p-5">
                  {/* Price Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">
                        Price ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                      </span>

                      <span className="font-semibold text-[#172033]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">Delivery</span>

                      {deliveryCharge === 0 ? <span className="font-bold text-[#16A34A]">FREE</span> : <span className="font-semibold text-[#172033]">₹{deliveryCharge}</span>}
                    </div>
                  </div>

                  {/* Free Delivery Message */}
                  {deliveryCharge > 0 && <div className="mt-4 rounded-xl bg-[#FFF7ED] px-3 py-2.5 text-xs font-semibold text-[#B45309]">Add ₹{(499 - subtotal).toLocaleString('en-IN')} more for FREE delivery</div>}

                  {/* Divider */}
                  <div className="my-5 border-t border-dashed border-[#CBD5E1]" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-[#172033]">Total Amount</span>

                    <span className="text-xl font-extrabold text-[#1D4ED8]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Checkout */}
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    className="group relative mt-5 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300"
                  >
                    <span className="absolute inset-y-0 left-[-100%] w-1/3 skew-x-[-20deg] bg-white/15 transition-all duration-700 group-hover:left-[120%]" />

                    <span className="relative">Proceed to Checkout</span>

                    <ChevronRight size={18} className="relative transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Continue Shopping */}
                  <Link to="/products" className="mt-3 flex h-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-sm font-bold text-[#172033] transition hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]">
                    Continue Shopping
                  </Link>

                  {/* Secure Note */}
                  <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
                    <ShieldCheck size={14} className="text-[#16A34A]" />
                    Secure & trusted checkout
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

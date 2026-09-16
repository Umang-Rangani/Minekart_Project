import React, { useState } from 'react'
import { ShoppingBag, ChevronRight, ChevronLeft, Trash2, Minus, Plus, Truck, ShieldCheck, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, cartLoading, updateCartItem, removeCartItem, clearCart } = useCart()
  const cartItems = cart?.items || []

  // ! Increase Quantity
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

  // ! Decrease Quantity
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

  // ! Remove Item
  const removeItem = async (item) => {
    await removeCartItem({
      productId: item.productId._id,
      size: item.size || null,
    })
  }

  // ! Total Items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // ! Subtotal
  const subtotal = cart?.subtotal || 0

  // ! Delivery Charge
  const deliveryCharge = subtotal >= 499 ? 0 : 40

  // ! Grand Total
  const grandTotal = subtotal + deliveryCharge

  // console.log('cart', cart)
  // console.log('cartItems', cartItems)

  // ! BreadCrumb

  const items = [{ title: `cart`, link: null }]

  return (
    <div className="min-h-screen ">
      <BreadCrumb items={items} />

      <div className="mx-auto  pt-5">
        {/*  HEADER */}
        <div className="mb-5 rounded-md bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#1D4ED8] shadow-sm sm:h-15 sm:w-15">
                <ShoppingBag size={32} strokeWidth={1.8} />
              </div>

              {/* Heading */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 rounded-full bg-[#1D4ED8]" />

                  <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">My Cart</h1>
                </div>

                <p className="mt-1 ml-3 text-sm text-[#64748B] sm:text-base">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            {/* Cart Count */}
            <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#2563EB]">
              <ShoppingBag size={16} />
              <span>
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            </div>
          </div>
        </div>

        {/*   MAIN GRID  */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          {/*  LEFT SIDE - CART ITEMS = */}
          <div className="min-w-0  space-y-5  lg:col-span-4">
            {cartItems.length === 0 ? (
              <div className="rounded-2xl   border border-[#E2E8F0] bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
                  <ShoppingBag size={30} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#172033]">Your cart is empty</h2>

                <p className="mt-2 text-sm text-[#64748B]">Looks like you haven't added anything to your cart yet.</p>

                <button type="button" onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E40AF]">
                  Start Shopping
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <>
                {/* Cart Products - 2 Column Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {cartItems.map((item) => {
                    const product = item.productId

                    // console.log('product', product)
                    // to={`/product/${product._id}`}
                    return (
                      <Link key={`${product._id}-${item.size || 'no-size'}`} className="rounded-2xl border-2 border-white bg-white p-4 shadow-sm transition hover:shadow-md hover:border-r-blue-400 hover:border-b-blue-400 hover:border-2">
                        <div className="flex gap-4">
                          {/*    IMAGE + QUANTITY  */}
                          <div className="w-28 shrink-0">
                            {/* Image */}
                            <div onClick={() => navigate(`/product/${product._id}`)} className="h-32 w-28 overflow-hidden rounded-xl bg-[#F8FAFC]">
                              <img src={`http://localhost:3000${product?.images?.[0]}`} alt={product?.productName} className="h-full w-full object-contain" />
                            </div>

                            {/* Quantity - Image ni niche */}
                            <div className="mt-3 flex h-9 items-center justify-center overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                              <button type="button" onClick={() => decreaseQuantity(item)} className="flex h-full w-9 items-center justify-center text-[#64748B] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40">
                                <Minus size={14} />
                              </button>

                              <span className="flex h-full min-w-10 items-center justify-center border-x border-[#E2E8F0] text-sm font-bold text-[#172033]">{item.quantity}</span>

                              <button type="button" onClick={() => increaseQuantity(item)} className="flex h-full w-9 items-center justify-center text-[#1D4ED8] transition hover:bg-[#EFF6FF]">
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/*   PRODUCT DETAILS  */}
                          <div className="min-w-0 flex-1">
                            {/* Brand + Delete */}
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B]">{product.brand?.brandName}</p>

                              <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#94A3B8] transition-all duration-200 hover:bg-[#FEF2F2] hover:text-[#EF4444]"
                                title="Remove"
                              >
                                <Trash2 size={16} strokeWidth={2} />
                              </button>
                            </div>

                            {/* Product Name */}
                            <h3 className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-5 text-[#172033] sm:text-base">{product.productName}</h3>

                            {/* Size */}
                            {item.size && (
                              <div className="mt-2.5 inline-flex items-center rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#475569]">
                                Size:
                                <span className="ml-1 text-[#172033]">{item.size}</span>
                              </div>
                            )}

                            {/* Price Details */}
                            <div className="mt-4 space-y-1.5">
                              {/* Original Price */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-medium text-[#94A3B8]">Price</span>

                                <span className="text-xs font-medium text-[#94A3B8] line-through">₹{item.price.toLocaleString('en-IN')}</span>
                              </div>

                              {/* Discount Price */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold text-[#64748B]">Discount Price</span>

                                <span className="text-base font-extrabold text-[#1D4ED8]">₹{(item.discountPrice || item.price).toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="mt-3 border-t border-[#F1F5F9] pt-3">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold text-[#64748B]">Item Total</span>

                                <span className="text-base font-extrabold text-[#172033]">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/*  BENEFITS  */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 ">
                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#16A34A]">
                      <Truck size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#172033]">Free Delivery</p>

                      <p className="text-[11px] text-[#64748B]">On orders ₹499+</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                      <ShieldCheck size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#172033]">Secure Payment</p>

                      <p className="text-[11px] text-[#64748B]">100% secure checkout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#D97706]">
                      <Tag size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#172033]">Best Prices</p>

                      <p className="text-[11px] text-[#64748B]">Great deals for you</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/*   RIGHT SIDE - ORDER SUMMARY  */}
          {cartItems.length > 0 && (
            <div className="min-w-0 lg:col-span-2">
              <div className="h-fit rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24">
                {/* Heading */}
                <div className="mb-5">
                  <h2 className="text-lg font-extrabold text-[#172033]">Order Summary</h2>

                  <p className="mt-1 text-xs text-[#64748B]">Check your items before placing the order</p>
                </div>

                {/* 
                    SUMMARY TABLE
                = */}
                <div className="w-full">
                  <table className="w-full table-fixed border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#E2E8F0]">
                        <th className="w-[10%] pb-3 text-left text-xs font-bold text-[#64748B]">#</th>

                        <th className="w-[42%] pb-3 text-left text-xs font-bold text-[#64748B]">Product</th>

                        <th className="w-[15%] pb-3 text-center text-xs font-bold text-[#64748B]">Qty</th>

                        <th className="w-[33%] pb-3 text-right text-xs font-bold text-[#64748B]">Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index} className="border-b border-[#F1F5F9]">
                          {/* Index */}
                          <td className="py-4 align-top text-xs font-semibold text-[#94A3B8]">{index + 1}</td>

                          {/* Product */}
                          <td className="min-w-0 py-4 pr-2 align-top">
                            <p className="truncate text-xs font-bold text-[#172033]">{item.productId?.productName}</p>

                            <p className="mt-1 truncate text-[11px] text-[#64748B]">{item.productId?.brand?.brandName}</p>

                            {item.size && <p className="mt-1 text-[11px] text-[#94A3B8]">Size: {item.size}</p>}
                          </td>

                          {/* Quantity */}
                          <td className="py-4 text-center align-top text-xs font-bold text-[#172033]">{item.quantity}</td>

                          {/* Price */}
                          <td className="py-4 text-right align-top">
                            <p className="text-xs font-bold text-[#172033]">₹{item.totalPrice.toLocaleString('en-IN')}</p>

                            <p className="mt-1 text-[10px] text-[#94A3B8]">
                              ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    {/* 
                        TABLE FOOTER
                    = */}
                    <tfoot>
                      <tr>
                        <td colSpan="2" className="pt-4 text-sm font-extrabold text-[#172033]">
                          Total
                        </td>

                        <td className="pt-4 text-center text-sm font-extrabold text-[#172033]">{totalItems}</td>

                        <td className="pt-4 text-right text-sm font-extrabold text-[#1D4ED8]">₹{subtotal.toLocaleString('en-IN')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 
                    PRICE DETAILS
                = */}
                <div className="mt-5 space-y-3 border-t border-[#E2E8F0] pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">Subtotal</span>

                    <span className="font-semibold text-[#172033]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748B]">Delivery</span>

                    {deliveryCharge === 0 ? <span className="font-bold text-[#16A34A]">FREE</span> : <span className="font-semibold text-[#172033]">₹{deliveryCharge}</span>}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                    <span className="text-base font-extrabold text-[#172033]">Grand Total</span>

                    <span className="text-xl font-extrabold text-[#1D4ED8]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Free Delivery Message */}
                {subtotal < 499 && (
                  <div className="mt-4 rounded-xl bg-[#FFFBEB] px-4 py-3">
                    <p className="text-xs font-semibold leading-5 text-[#92400E]">Add ₹{(499 - subtotal).toLocaleString('en-IN')} more to get free delivery.</p>
                  </div>
                )}

                {subtotal >= 499 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#ECFDF5] px-4 py-3">
                    <Truck size={17} className="shrink-0 text-[#16A34A]" />

                    <p className="text-xs font-semibold text-[#166534]">Congratulations! You got free delivery.</p>
                  </div>
                )}

                {/* 
                    PLACE ORDER BUTTON
                = */}
                <button type="button" onClick={() => navigate('/checkout')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E40AF]">
                  Place Order
                  <ChevronRight size={18} />
                </button>

                {/* 
                    CONTINUE SHOPPING
                = */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-bold text-[#172033] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
                >
                  <ChevronLeft size={17} />
                  Continue Shopping
                </button>

                {/* Secure Checkout */}
                <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
                  <ShieldCheck size={14} />
                  <span>Safe & Secure Checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

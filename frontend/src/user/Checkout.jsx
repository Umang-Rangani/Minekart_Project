import React, { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, CreditCard, MapPin, Plus, X, ShieldCheck, ShoppingBag, Smartphone, Truck, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import { useEffect } from 'react'
import { axiosInstance } from '../config/axiosConfig'

export default function Checkout() {
  const navigate = useNavigate()

  const { cart, cartLoading, clearCart } = useCart()

  const cartItems = cart?.items || []

  // ! payment 1.
  const [selectedPayment, setSelectedPayment] = useState(() => {
    return localStorage.getItem('minekart_payment_method') || 'COD'
  })
  const [paymentOption, setPaymentOption] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)

  // ! address 1.
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)

  // ! address 2.
  const getAddresses = async () => {
    try {
      setAddressLoading(true)

      const res = await axiosInstance.get('/address')

      if (res.data.success) {
        const addressList = res.data.data || []

        setAddresses(addressList)

        // Default address automatically select
        const defaultAddress = addressList.find((address) => address.isDefault)

        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id)
        } else if (addressList.length > 0) {
          setSelectedAddress(addressList[0]._id)
        } else {
          setSelectedAddress(null)
        }
      }
    } catch (error) {
      console.log('Get Addresses Error:', error.response?.data || error.message)
    } finally {
      setAddressLoading(false)
    }
  }

  useEffect(() => {
    getAddresses()
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [cart])

  const handleSelectAddress = async (addressId) => {
    try {
      const res = await axiosInstance.put(`/address/${addressId}/default`)

      if (res.data.success) {
        await getAddresses()
      }
    } catch (error) {
      console.log('Select Address Error:', error.response?.data || error.message)
    }
  }

  const subtotal = cart?.subtotal || 0

  const deliveryCharge = subtotal >= 499 ? 0 : 40

  const tax = cart?.tax || 0

  const grandTotal = subtotal + deliveryCharge + tax

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // ! Place Order
  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true)

      const selectedAddressData = addresses.find((address) => address._id === selectedAddress)

      if (!selectedAddressData) {
        console.log('Please select a delivery address')
        return
      }

      if (!selectedPayment) {
        console.log('Please select a payment method')
        return
      }

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          productName: item.productId.productName,
          image: item.productId.images?.[0] || '',
          size: item.size || null,
          price: item.price,
          discountPrice: item.discountPrice || item.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),

        addressId: selectedAddress,

        subtotal,
        deliveryCharge,
        tax,
        totalAmount: grandTotal,

        paymentMethod: selectedPayment,
      }

      const res = await axiosInstance.post('/order', orderData)

      if (!res.data.success) {
        return
      }

      const order = res.data.data.order
      const payment = res.data.data.payment

      console.log('Order Created:', order)
      console.log('Payment Created:', payment)

      // COD PAYMENT
      const clearCartResponse = await clearCart()

      if (!clearCartResponse.success) {
        console.log('Cart Clear Error:', clearCartResponse.message)
        return
      }

      navigate('/order-success', {
        state: {
          orderId: order._id,
          order,
          payment,
        },
      })
    } catch (error) {
      console.log('Place Order Error:', error.response?.data || error.message)
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading checkout...</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
            <ShoppingBag size={30} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#172033]">Your cart is empty</h1>

          <p className="mt-2 text-sm text-[#64748B]">Add some products before proceeding to checkout.</p>

          <button type="button" onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E40AF]">
            Start Shopping
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // ! BreadCrumb
  const items = [
    { title: `cart`, link: '/cart' },
    { title: `checkout`, link: null },
  ]

  return (
    <div className="min-h-screen ">
      <BreadCrumb items={items} />
      {/* HEADER */}

      <div className=" my-5 rounded-md bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Checkout Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#1D4ED8] shadow-sm sm:h-15 sm:w-15">
              <ShoppingBag size={32} strokeWidth={1.8} />
            </div>

            {/* Heading */}
            <div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-[#1D4ED8]" />

                <h1 className="text-xl font-extrabold tracking-tight text-[#172033] sm:text-2xl">Checkout</h1>
              </div>

              <p className="mt-1 ml-3 text-sm text-[#64748B]">Complete your order securely</p>
            </div>
          </div>

          {/* Right Side */}
          <span className="shrink-0 rounded-full bg-[#EFF6FF] px-3 py-1.5 text-xs font-bold text-[#1D4ED8]">Secure Checkout</span>
        </div>
      </div>

      {/* CHECKOUT GRID */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-6">
        {/* LEFT SIDE */}
        <div className="min-w-0 space-y-5 lg:col-span-4">
          {/* PAYMENT METHOD */}

          {/* ORDER ITEMS */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#172033]">Order Items</h2>

                <p className="mt-1 text-xs text-[#64748B]">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
                </p>
              </div>

              <button type="button" onClick={() => navigate('/cart')} className="text-xs font-bold text-[#1D4ED8] hover:underline">
                Edit Cart
              </button>
            </div>

            <div className="space-y-3">
              {cartItems.map((item) => {
                const product = item.productId

                return (
                  <div key={`${product._id}-${item.size || 'no-size'}`} className="flex gap-3 rounded-xl border border-[#F1F5F9] p-3">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
                      <img src={product.images?.[0] ? `http://localhost:3000${product.images[0]}` : '/placeholder.png'} alt={product.productName} className="h-full w-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">{product.brand?.brandName}</p>

                      <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[#172033]">{product.productName}</h3>

                      <div className="mt-2 flex items-center gap-3">
                        {item.size && <span className="rounded-md bg-[#F1F5F9] px-2 py-1 text-[10px] font-semibold text-[#64748B]">Size: {item.size}</span>}

                        <span className="text-[11px] font-semibold text-[#64748B]">Qty: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-[#172033]">₹{item.totalPrice.toLocaleString('en-IN')}</p>

                      <p className="mt-1 text-[10px] text-[#94A3B8]">
                        ₹{(item.discountPrice || item.price).toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SECURITY */}
          <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#16A34A]">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-xs font-bold text-[#172033]">Safe & Secure Checkout</p>

              <p className="mt-0.5 text-[11px] text-[#64748B]">Your personal and payment information is protected.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="min-w-0  self-start lg:col-span-2">
          <div className="h-fit rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="mb-5">
              <h2 className="text-lg font-extrabold text-[#172033]">Order Summary</h2>

              <p className="mt-1 text-xs text-[#64748B]">Review your order before placing it</p>
            </div>

            {/* ITEM COUNT */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <span className="text-sm text-[#64748B]">Items</span>

              <span className="text-sm font-bold text-[#172033]">{totalItems}</span>
            </div>

            {/* PRICE */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Subtotal</span>

                <span className="font-semibold text-[#172033]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Delivery</span>

                {deliveryCharge === 0 ? <span className="font-bold text-[#16A34A]">FREE</span> : <span className="font-semibold text-[#172033]">₹{deliveryCharge}</span>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Tax</span>

                <span className="font-semibold text-[#172033]">₹{tax.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* GRAND TOTAL */}
            <div className="mt-5 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
              <span className="text-base font-extrabold text-[#172033]">Grand Total</span>

              <span className="text-xl font-extrabold text-[#1D4ED8]">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* DELIVERY MESSAGE */}
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

            {/* PAYMENT METHOD */}
            <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Payment Method</p>

                  <p className="mt-1 text-sm font-extrabold text-[#172033]">{selectedPayment === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                </div>

                <button type="button" onClick={() => setPaymentOption((prev) => !prev)} className="text-xs font-bold text-[#1D4ED8] transition hover:text-[#1E40AF] hover:underline">
                  {paymentOption ? 'Close' : 'Change'}
                </button>
              </div>

              {/* PAYMENT OPTIONS */}
              {paymentOption && (
                <div className="border-t border-[#E2E8F0] p-4">
                  <div className="space-y-3">
                    {/* CASH ON DELIVERY */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPayment('COD')
                        localStorage.setItem('minekart_payment_method', 'COD')
                        setPaymentOption(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${selectedPayment === 'COD' ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'}`}
                    >
                      {/* Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selectedPayment === 'COD' ? 'bg-[#1D4ED8] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                        <Wallet size={19} />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#172033]">Cash on Delivery</p>

                        <p className="mt-0.5 text-[11px] text-[#64748B]">Pay cash when your order is delivered</p>
                      </div>

                      {/* Check */}
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedPayment === 'COD' ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-[#CBD5E1] bg-white'}`}>
                        {selectedPayment === 'COD' && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>

                    {/* ONLINE ON DELIVERY */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPayment('ONLINE_ON_DELIVERY')
                        localStorage.setItem('minekart_payment_method', 'ONLINE_ON_DELIVERY')
                        setPaymentOption(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                        selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'bg-[#1D4ED8] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                        <Smartphone size={19} />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#172033]">Online on Delivery</p>

                        <p className="mt-0.5 text-[11px] text-[#64748B]">Pay online when your order is delivered</p>
                      </div>

                      {/* Check */}
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-[#CBD5E1] bg-white'}`}>
                        {selectedPayment === 'ONLINE_ON_DELIVERY' && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* PAYMENT INFO */}
              <div className="border-t border-[#E2E8F0] px-4 py-3">
                <div className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] px-3 py-3">
                  <Truck size={17} className="mt-0.5 shrink-0 text-[#1D4ED8]" />

                  <div>
                    <p className="text-xs font-bold text-[#172033]">Payment at the time of delivery</p>

                    <p className="mt-1 text-[11px] leading-5 text-[#64748B]">No payment is required now. You can pay when your order is delivered.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* address main*/}
            <div className="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Delivery Address</p>

                <button type="button" onClick={() => navigate('/profile')} className="text-xs font-bold text-blue-700  hover:underline">
                  new
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {addressLoading ? (
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 text-center">
                    <p className="text-xs font-semibold text-[#64748B]">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-5 text-center">
                    <MapPin className="mx-auto mb-2 text-[#94A3B8]" size={22} />

                    <p className="text-xs font-semibold text-[#64748B]">No delivery address found</p>

                    <Link to="/profile" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1D4ED8] hover:underline">
                      <Plus size={13} />
                      Add Address
                    </Link>
                  </div>
                ) : (
                  addresses.map((address) => {
                    const isSelected = address.isDefault

                    return (
                      <button
                        key={address._id}
                        type="button"
                        onClick={() => handleSelectAddress(address._id)}
                        className={`w-full rounded-xl border p-4 text-left transition ${isSelected ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#BFDBFE]'}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Check Icon */}
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-[#CBD5E1] bg-white'}`}>
                            {isSelected && <Check size={13} strokeWidth={3} />}
                          </div>

                          {/* Address Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-extrabold text-[#172033]">{address.fullName}</p>

                              <span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-bold text-[#64748B]">{address.addressType}</span>

                              {address.isDefault && <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#16A34A]">Default</span>}

                              <span className="text-xs font-semibold text-[#64748B]">{address.phone}</span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-[#64748B]">
                              {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                            </p>

                            {address.landmark && <p className="mt-1 text-[11px] text-[#94A3B8]">Landmark: {address.landmark}</p>}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* PLACE ORDER */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddress}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder ? 'Placing Order...' : 'Place Order'}

              {!placingOrder && <ChevronRight size={18} />}
            </button>

            {/* BACK CART */}
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-bold text-[#172033] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
            >
              <ArrowLeft size={17} />
              Back to Cart
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
              <ShieldCheck size={14} />
              <span>Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

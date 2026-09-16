import React, { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, CreditCard, MapPin, Plus, ShieldCheck, ShoppingBag, Smartphone, Truck, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function Checkout() {
  const navigate = useNavigate()

  const { cart, cartLoading } = useCart()

  const cartItems = cart?.items || []

  const [selectedAddress, setSelectedAddress] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState('COD')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentOption, setPaymentOption] = useState(false)

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',
  })

  // ! Dummy Saved Addresses
  // Later API mathi aavse
  const [addresses] = useState([
    {
      id: 1,
      fullName: 'Umang Rangani',
      phone: '9876543210',
      addressLine: '123, Main Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      landmark: '',
      addressType: 'Home',
    },
  ])

  const subtotal = cart?.subtotal || 0

  const deliveryCharge = subtotal >= 499 ? 0 : 40

  const tax = cart?.tax || 0

  const grandTotal = subtotal + deliveryCharge + tax

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // ! Address Change
  const handleAddressChange = (e) => {
    const { name, value } = e.target

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ! Add New Address
  const handleAddAddress = (e) => {
    e.preventDefault()

    console.log('New Address:', addressForm)

    setShowAddressForm(false)
  }

  // ! Place Order
  const handlePlaceOrder = () => {
    console.log('Selected Address:', selectedAddress)
    console.log('Payment Method:', selectedPayment)
    console.log('Grand Total:', grandTotal)

    // ! Later:
    // POST /order
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

            {/* PAYMENT SELECTED */}
            <div className="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-3">
              <div className="flex justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Payment Method</p>

                <button onClick={() => setPaymentOption(!paymentOption)} className="text-xs font-bold text-blue-700  hover:underline">
                  Change
                </button>
              </div>

              <p className="mt-1 text-xs font-bold text-[#172033]">{selectedPayment === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
            </div>

            {/* address */}
            <div className="mt-4 rounded-xl bg-[#F8FAFC] px-4 py-3">
              <div className="flex justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Delivery Address</p>

                <Link to={"/profile"} onClick={() => setPaymentOption(!paymentOption)} className="text-xs font-bold text-blue-700  hover:underline">
                  Change
                </Link>
              </div>

              <div className="space-y-3 mt-5">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddress(address.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${selectedAddress === address.id ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#BFDBFE]'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedAddress === address.id ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-[#CBD5E1]'}`}>
                        {selectedAddress === address.id && <Check size={13} strokeWidth={3} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-extrabold text-[#172033]">{address.fullName}</p>

                          <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#64748B]">{address.addressType}</span>

                          <span className="text-xs font-semibold text-[#64748B]">{address.phone}</span>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-[#64748B]">
                          {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                        </p>

                        {address.landmark && <p className="mt-1 text-[11px] text-[#94A3B8]">Landmark: {address.landmark}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PLACE ORDER */}
            <button type="button" onClick={handlePlaceOrder} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E40AF]">
              Place Order
              <ChevronRight size={18} />
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

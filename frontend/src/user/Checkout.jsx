import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, CreditCard, MapPin, Plus, ShieldCheck, ShoppingBag, Smartphone, Truck, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()

  const { cart, cartLoading, clearCart } = useCart()

  const cartItems = cart?.items || []

  // ! Payment
  const [selectedPayment, setSelectedPayment] = useState(() => {
    return localStorage.getItem('minekart_payment_method') || 'COD'
  })

  const [paymentOption, setPaymentOption] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)

  // ! Address
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)

  // ! Get Addresses
  const getAddresses = async () => {
    try {
      setAddressLoading(true)

      const res = await axiosInstance.get('/address')

      if (res.data.success) {
        const addressList = res.data.data || []

        setAddresses(addressList)

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
      toast.error(error.response?.data?.message || 'Failed to load delivery addresses')
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

    document.title = 'Checkout | MineKart'
  }, [cart])

  // ! Select address only for this order
  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId)
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
        toast.error('Please select a delivery address')
        return
      }

      if (!selectedPayment) {
        toast.error('Please select a payment method')
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
        toast.error(res.data.message || 'Failed to place order')
        return
      }

      const order = res.data.data.order

      toast.success('Order placed successfully!')

      const clearCartResponse = await clearCart()

      if (!clearCartResponse.success) {
        console.log('Cart Clear Error:', clearCartResponse.message)

        toast.error(clearCartResponse.message || 'Failed to clear cart')

        return
      }

      const params = new URLSearchParams({
        orderId: order.orderId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        totalAmount: String(order.totalAmount),
      })

      navigate(`/order-success?${params.toString()}`)
    } catch (error) {
      console.log('Place Order Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Something went wrong while placing order')
    } finally {
      setPlacingOrder(false)
    }
  }

  // ! Cart Loading
  if (cartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF7F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />

          <p className="text-sm font-semibold text-[#806C63]">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // ! Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#FBF7F2] px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] px-6 py-14 text-center shadow-[0_10px_35px_rgba(73,54,49,0.08)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-[#F7EEE7] to-[#F2E3DA] text-[#8E181F]">
            <ShoppingBag size={34} strokeWidth={1.6} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#351C18]">Your cart is empty</h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#806C63]">Add some products to your cart before proceeding to checkout.</p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Start Shopping
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  const items = [
    {
      title: 'cart',
      link: '/cart',
    },
    {
      title: 'checkout',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4 sm:pt-6">
        {/* CHECKOUT HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <ShoppingBag size={18} strokeWidth={1.9} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Checkout</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Complete your order securely</p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-2.5 sm:px-3">
            <ShieldCheck size={13} className="text-[#3E8B62]" />

            <span className="hidden text-[9px] font-bold text-[#34704F] sm:inline">Secure Checkout</span>
          </div>
        </div>

    

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <ShoppingBag size={15} />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Order Items</h2>

                    <p className="mt-0.5 text-[9px] text-[#806C63] sm:text-[10px]">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
                    </p>
                  </div>
                </div>

                <button type="button" onClick={() => navigate('/cart')} className="rounded-lg px-2.5 py-1.5 text-[9px] font-bold text-[#8E181F] transition-colors hover:bg-[#F7EEE7] sm:text-[10px]">
                  Edit Cart
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-3 sm:p-4">
                <div className="space-y-2.5">
                  {cartItems.map((item) => {
                    const product = item.productId

                    return (
                      <div
                        key={`${product._id}-${item.size || 'no-size'}`}
                        className="group flex gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] p-2.5 transition-all duration-200 hover:border-[#D4BDB2] hover:shadow-[0_3px_12px_rgba(73,54,49,0.05)]"
                      >
                        {/* IMAGE */}
                        <div className="flex h-22 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8DDD4] bg-white sm:h-24 sm:w-20">
                          <img
                            src={product.images?.[0] ? `http://localhost:3000${product.images[0]}` : '/placeholder.png'}
                            alt={product.productName}
                            className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                          <h3 className="mt-1 line-clamp-2 text-[12px] font-bold leading-4.5 text-[#351C18] sm:text-[13px]">{product.productName}</h3>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.size && <span className="rounded-md bg-[#F7EEE7] px-2 py-1 text-[8px] font-bold text-[#67544D]">Size: {item.size}</span>}

                            <span className="rounded-md border border-[#E8DDD4] bg-white px-2 py-1 text-[8px] font-bold text-[#806C63]">Qty: {item.quantity}</span>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-[#351C18] sm:text-base">₹{item.totalPrice.toLocaleString('en-IN')}</p>

                          <p className="mt-1 text-[8px] text-[#9A857B]">
                            ₹{(item.discountPrice || item.price).toLocaleString('en-IN')} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_2px_10px_rgba(73,54,49,0.04)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <MapPin size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Delivery Address</h2>

                    <p className="mt-0.5 text-[9px] text-[#806C63] sm:text-[10px]">Select where you want your order delivered</p>
                  </div>
                </div>

                <button type="button" onClick={() => navigate('/profile')} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[9px] font-bold text-[#8E181F] transition-colors hover:bg-[#F7EEE7] sm:text-[10px]">
                  <Plus size={13} />
                  New
                </button>
              </div>

              <div className="p-3 sm:p-4">
                {addressLoading ? (
                  <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-[#FBF7F2]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8DDD4] border-t-[#8E181F]" />

                      <p className="text-[10px] font-semibold text-[#806C63]">Loading addresses...</p>
                    </div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D8C9C0] bg-[#FBF7F2] p-6 text-center">
                    <MapPin className="mx-auto text-[#9A857B]" size={24} />

                    <p className="mt-2 text-[11px] font-semibold text-[#67544D]">No delivery address found</p>

                    <Link to="/profile" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#F7EEE7] px-3 py-2 text-[10px] font-bold text-[#8E181F]">
                      <Plus size={13} />
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {addresses.map((address) => {
                      const isSelected = selectedAddress === address._id

                      return (
                        <button
                          key={address._id}
                          type="button"
                          onClick={() => handleSelectAddress(address._id)}
                          className={`group w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                            isSelected ? 'border-[#A51D26] bg-[#FFF7F5] shadow-[0_4px_15px_rgba(142,24,31,0.07)]' : 'border-[#E8DDD4] bg-white hover:border-[#CDAFA4] hover:bg-[#FFFCFA]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* RADIO */}
                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${isSelected ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4] bg-white'}`}>
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>

                            {/* ADDRESS */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <p className="text-xs font-extrabold text-[#351C18]">{address.fullName}</p>

                                <span className="rounded-md bg-[#F7EEE7] px-1.5 py-0.5 text-[8px] font-bold text-[#67544D]">{address.addressType}</span>

                                {address.isDefault && <span className="rounded-md bg-[#F0F8F3] px-1.5 py-0.5 text-[8px] font-bold text-[#3E8B62]">Default</span>}
                              </div>

                              <p className="mt-1.5 text-[10px] leading-4.5 text-[#67544D]">
                                {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                              </p>

                              <p className="mt-1 text-[9px] font-semibold text-[#806C63]">{address.phone}</p>

                              {address.landmark && <p className="mt-1 text-[8px] text-[#9A857B]">Landmark: {address.landmark}</p>}
                            </div>

                            {isSelected && <span className="hidden shrink-0 rounded-md bg-[#F7EEE7] px-2 py-1 text-[8px] font-bold text-[#8E181F] sm:block">Selected</span>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* SECURITY */}
            <div className="flex items-center gap-3 rounded-xl border border-[#D5E8DA] bg-[#F0F8F3] p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#3E8B62] shadow-sm">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-[11px] font-extrabold text-[#351C18]">Safe & Secure Checkout</p>

                <p className="mt-0.5 text-[9px] text-[#5F806C]">Your personal information is protected.</p>
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="min-w-0">
            <div className="h-fit overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_5px_22px_rgba(73,54,49,0.08)] lg:sticky lg:top-24">
              {/* SUMMARY HEADER */}
              <div className="border-b border-[#E8DDD4] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#351C18]">Order Summary</h2>

                    <p className="mt-0.5 text-[9px] text-[#806C63]">Review your order before placing it</p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <CreditCard size={17} />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* ITEM COUNT */}
                <div className="flex items-center justify-between rounded-lg bg-[#FBF7F2] px-3 py-2.5">
                  <span className="text-[10px] font-semibold text-[#806C63]">Items in order</span>

                  <span className="rounded-md bg-[#F7EEE7] px-2 py-1 text-[10px] font-extrabold text-[#8E181F]">{totalItems}</span>
                </div>

                {/* PRICE DETAILS */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#806C63]">Subtotal</span>

                    <span className="font-bold text-[#351C18]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#806C63]">Delivery</span>

                    {deliveryCharge === 0 ? <span className="font-bold text-[#3E8B62]">FREE</span> : <span className="font-bold text-[#351C18]">₹{deliveryCharge}</span>}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#806C63]">Tax</span>

                    <span className="font-bold text-[#351C18]">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="mt-5 flex items-end justify-between border-t border-[#E8DDD4] pt-4">
                  <div>
                    <p className="text-sm font-extrabold text-[#351C18]">Grand Total</p>

                    <p className="mt-0.5 text-[9px] text-[#9A857B]">{totalItems} items</p>
                  </div>

                  <span className="text-2xl font-extrabold text-[#8E181F]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* FREE DELIVERY */}
                {subtotal < 499 ? (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#EADCC8] bg-[#FFF8EF] px-3 py-2.5">
                    <Truck size={15} className="mt-0.5 shrink-0 text-[#B87935]" />

                    <p className="text-[9px] font-semibold leading-4 text-[#79562F]">Add ₹{(499 - subtotal).toLocaleString('en-IN')} more to unlock free delivery.</p>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-3 py-2.5">
                    <Truck size={15} className="shrink-0 text-[#3E8B62]" />

                    <p className="text-[9px] font-bold text-[#34704F]">Free delivery unlocked!</p>
                  </div>
                )}

                {/* PAYMENT METHOD */}
                <div className="mt-4 overflow-hidden rounded-lg border border-[#E8DDD4]">
                  <div className="flex items-center justify-between bg-[#FBF7F2] px-3.5 py-3">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Payment Method</p>

                      <p className="mt-1 text-xs font-extrabold text-[#351C18]">{selectedPayment === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                    </div>

                    <button type="button" onClick={() => setPaymentOption((prev) => !prev)} className="rounded-md px-2 py-1.5 text-[9px] font-bold text-[#8E181F] hover:bg-[#F7EEE7]">
                      {paymentOption ? 'Close' : 'Change'}
                    </button>
                  </div>

                  {paymentOption && (
                    <div className="space-y-2 border-t border-[#E8DDD4] p-2.5">
                      {/* COD */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPayment('COD')
                          localStorage.setItem('minekart_payment_method', 'COD')
                          setPaymentOption(false)
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${selectedPayment === 'COD' ? 'border-[#A51D26] bg-[#FFF5F3]' : 'border-[#E8DDD4] bg-white hover:bg-[#FBF7F2]'}`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${selectedPayment === 'COD' ? 'bg-[#A51D26] text-white' : 'bg-[#F7EEE7] text-[#806C63]'}`}>
                          <Wallet size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-extrabold text-[#351C18]">Cash on Delivery</p>

                          <p className="mt-0.5 text-[8px] text-[#806C63]">Pay when order is delivered</p>
                        </div>

                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === 'COD' ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4]'}`}>
                          {selectedPayment === 'COD' && <Check size={9} strokeWidth={3} />}
                        </div>
                      </button>

                      {/* ONLINE */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPayment('ONLINE_ON_DELIVERY')
                          localStorage.setItem('minekart_payment_method', 'ONLINE_ON_DELIVERY')
                          setPaymentOption(false)
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#A51D26] bg-[#FFF5F3]' : 'border-[#E8DDD4] bg-white hover:bg-[#FBF7F2]'}`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'bg-[#A51D26] text-white' : 'bg-[#F7EEE7] text-[#806C63]'}`}>
                          <Smartphone size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-extrabold text-[#351C18]">Online on Delivery</p>

                          <p className="mt-0.5 text-[8px] text-[#806C63]">Pay online on delivery</p>
                        </div>

                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4]'}`}>
                          {selectedPayment === 'ONLINE_ON_DELIVERY' && <Check size={9} strokeWidth={3} />}
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="border-t border-[#E8DDD4] p-2.5">
                    <div className="flex items-start gap-2 rounded-md bg-[#F7EEE7] px-2.5 py-2.5">
                      <Truck size={14} className="mt-0.5 shrink-0 text-[#8E181F]" />

                      <p className="text-[8px] leading-4 text-[#806C63]">Payment will be collected at the time of delivery.</p>
                    </div>
                  </div>
                </div>

                {/* SELECTED ADDRESS INFO */}
                {selectedAddress && (
                  <div className="mt-4 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="shrink-0 text-[#8E181F]" />

                      <div className="min-w-0">
                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Delivering to</p>

                        <p className="truncate text-[10px] font-extrabold text-[#351C18]">{addresses.find((address) => address._id === selectedAddress)?.fullName || 'Selected Address'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PLACE ORDER */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddress || addresses.length === 0}
                  className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 active:scale-[0.98]"
                >
                  {placingOrder ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* BACK TO CART */}
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E2D5CC] bg-white text-[10px] font-bold text-[#67544D] transition-colors hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]"
                >
                  <ArrowLeft size={14} />
                  Back to Cart
                </button>

                {/* SECURITY */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] font-medium text-[#9A857B]">
                  <ShieldCheck size={13} className="text-[#3E8B62]" />
                  Safe & Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

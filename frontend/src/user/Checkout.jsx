import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, MapPin, Plus, ShieldCheck, ShoppingBag, Smartphone, Truck, Wallet, CreditCard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'
import toast from 'react-hot-toast'

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
  }, [cart])

  const handleSelectAddress = async (addressId) => {
    try {
      const res = await axiosInstance.put(`/address/${addressId}/default`)

      if (res.data.success) {
        await getAddresses()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to select delivery address')
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
      const payment = res.data.data.payment

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
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />
          <p className="text-sm font-medium text-[#806C63]">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] py-10">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#E8DDD4] bg-[#FFFDFC] px-6 py-16 text-center shadow-[0_10px_35px_rgba(73,54,49,0.08)]">
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
    { title: 'cart', link: '/cart' },
    { title: 'checkout', link: null },
  ]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      {/* HEADER */}
      <div className="my-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] shadow-[0_4px_18px_rgba(73,54,49,0.06)]">
        <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/20 sm:h-13 sm:w-13">
              <ShoppingBag size={25} strokeWidth={1.8} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#FFFDFC] bg-[#D4A373]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 shrink-0 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                <h1 className="truncate text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Checkout</h1>
              </div>

              <p className="ml-3 mt-1 truncate text-[11px] text-[#806C63] sm:text-xs">Complete your order securely</p>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3.5 py-2 sm:flex">
            <ShieldCheck size={16} className="text-[#3E8B62]" />
            <span className="text-[11px] font-bold text-[#67544D]">Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* CHECKOUT GRID */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_410px]">
        {/* LEFT SIDE */}
        <div className="min-w-0 space-y-5">
          {/* ORDER ITEMS */}
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
            <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <ShoppingBag size={17} />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#351C18]">Order Items</h2>
                  <p className="mt-0.5 text-[10px] text-[#806C63]">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => navigate('/cart')} className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#8E181F] transition-all duration-200 hover:bg-[#F7EEE7]">
                Edit Cart
              </button>
            </div>

            {/* Products Scroll Area */}
            <div className="max-h-105 overflow-y-auto p-4 pr-3 sm:p-5 sm:pr-4">
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = item.productId

                  return (
                    <div
                      key={`${product._id}-${item.size || 'no-size'}`}
                      className="group flex gap-3 rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-3 transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#FFFBF8] hover:shadow-[0_8px_22px_rgba(73,54,49,0.07)] sm:p-3.5"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E8DDD4] bg-linear-to-br from-[#FFFDFC] to-[#F7EEE7] sm:h-28 sm:w-22">
                        <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[#A51D26]/5" />

                        <img
                          src={product.images?.[0] ? `http://localhost:3000${product.images[0]}` : '/placeholder.png'}
                          alt={product.productName}
                          className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-bold uppercase tracking-[0.13em] text-[#9A857B]">{product.brand?.brandName || 'Brand'}</p>

                        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-5 text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]">{product.productName}</h3>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {item.size && <span className="rounded-lg border border-[#E8DDD4] bg-[#F7EEE7] px-2 py-1 text-[9px] font-bold text-[#67544D]">Size: {item.size}</span>}

                          <span className="rounded-lg border border-[#E8DDD4] bg-[#FFFDFC] px-2 py-1 text-[9px] font-bold text-[#806C63]">Qty: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-base font-extrabold text-[#8E181F]">₹{item.totalPrice.toLocaleString('en-IN')}</p>

                        <p className="mt-1 text-[9px] text-[#9A857B]">
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
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
            <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <MapPin size={17} />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#351C18]">Delivery Address</h2>
                  <p className="mt-0.5 text-[10px] text-[#806C63]">Choose where your order should be delivered</p>
                </div>
              </div>

              <button type="button" onClick={() => navigate('/profile')} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#8E181F] transition-all duration-200 hover:bg-[#F7EEE7]">
                <Plus size={14} />
                New
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {addressLoading ? (
                <div className="flex min-h-27 items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-[#FBF7F2]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-7 w-7 animate-spin rounded-full border-3 border-[#E8DDD4] border-t-[#8E181F]" />
                    <p className="text-xs font-semibold text-[#806C63]">Loading addresses...</p>
                  </div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D8C9C0] bg-[#FBF7F2] p-7 text-center">
                  <MapPin className="mx-auto text-[#9A857B]" size={25} />
                  <p className="mt-2 text-xs font-semibold text-[#67544D]">No delivery address found</p>

                  <Link to="/profile" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#F7EEE7] px-3 py-2 text-xs font-bold text-[#8E181F] transition hover:bg-[#F0E2DA]">
                    <Plus size={14} />
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => {
                    const isSelected = address.isDefault

                    return (
                      <button
                        key={address._id}
                        type="button"
                        onClick={() => handleSelectAddress(address._id)}
                        className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ${isSelected ? 'border-[#A51D26] bg-linear-to-r from-[#FFF8F6] to-[#FDF1EB] shadow-[0_5px_18px_rgba(142,24,31,0.08)]' : 'border-[#E8DDD4] bg-[#FFFDFC] hover:border-[#CDAFA4] hover:bg-[#FFFBF8]'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4] bg-white'}`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-extrabold text-[#351C18]">{address.fullName}</p>

                              <span className="rounded-md bg-[#F7EEE7] px-2 py-0.5 text-[9px] font-bold text-[#67544D]">{address.addressType}</span>

                              {address.isDefault && <span className="rounded-md bg-[#F0F8F3] px-2 py-0.5 text-[9px] font-bold text-[#3E8B62]">Default</span>}

                              <span className="text-[11px] font-semibold text-[#806C63]">{address.phone}</span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-[#67544D]">
                              {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                            </p>

                            {address.landmark && <p className="mt-1 text-[10px] text-[#9A857B]">Landmark: {address.landmark}</p>}
                          </div>

                          {isSelected && (
                            <div className="hidden shrink-0 items-center gap-1 rounded-lg bg-[#F7EEE7] px-2 py-1 text-[9px] font-bold text-[#8E181F] sm:flex">
                              <Check size={11} /> Selected
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SECURITY */}
          <div className="flex items-center gap-3 rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#FBF7F2] p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F8F3] text-[#3E8B62]">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-[#351C18]">Safe & Secure Checkout</p>
              <p className="mt-0.5 text-[10px] leading-4 text-[#806C63]">Your personal and payment information is protected.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="min-w-0">
          <div className="h-fit overflow-hidden rounded-2xl border border-[#E2D5CC] bg-[#FFFDFC] shadow-[0_10px_35px_rgba(73,54,49,0.10)] lg:sticky lg:top-24">
            {/* SUMMARY HEADER */}
            <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FBF7F2] to-[#F7EEE7] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#351C18]">Order Summary</h2>
                  <p className="mt-0.5 text-[10px] text-[#806C63]">Review your order before placing it</p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                  <CreditCard size={17} />
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* ITEM COUNT */}
              <div className="flex items-center justify-between rounded-xl bg-[#FBF7F2] px-3.5 py-3">
                <span className="text-xs font-semibold text-[#806C63]">Items in order</span>
                <span className="rounded-lg bg-[#F7EEE7] px-2.5 py-1 text-xs font-extrabold text-[#8E181F]">{totalItems}</span>
              </div>

              {/* PRICE */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#806C63]">Subtotal</span>
                  <span className="font-bold text-[#351C18]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#806C63]">Delivery</span>
                  {deliveryCharge === 0 ? <span className="font-bold text-[#3E8B62]">FREE</span> : <span className="font-bold text-[#351C18]">₹{deliveryCharge}</span>}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#806C63]">Tax</span>
                  <span className="font-bold text-[#351C18]">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* GRAND TOTAL */}
              <div className="mt-5 flex items-end justify-between border-t border-[#E8DDD4] pt-4">
                <div>
                  <p className="text-sm font-extrabold text-[#351C18]">Grand Total</p>
                  <p className="mt-0.5 text-[10px] text-[#9A857B]">{totalItems} items</p>
                </div>

                <span className="text-2xl font-extrabold tracking-tight text-[#8E181F]">₹{grandTotal.toLocaleString('en-IN')}</span>
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

              {/* PAYMENT METHOD */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC]">
                <div className="flex items-center justify-between bg-[#FBF7F2] px-4 py-3.5">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A857B]">Payment Method</p>
                    <p className="mt-1 text-sm font-extrabold text-[#351C18]">{selectedPayment === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                  </div>

                  <button type="button" onClick={() => setPaymentOption((prev) => !prev)} className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#8E181F] transition-all duration-200 hover:bg-[#F7EEE7]">
                    {paymentOption ? 'Close' : 'Change'}
                  </button>
                </div>

                {paymentOption && (
                  <div className="space-y-2.5 border-t border-[#E8DDD4] p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPayment('COD')
                        localStorage.setItem('minekart_payment_method', 'COD')
                        setPaymentOption(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${selectedPayment === 'COD' ? 'border-[#A51D26] bg-[#FFF5F3]' : 'border-[#E8DDD4] bg-[#FFFDFC] hover:border-[#CDAFA4] hover:bg-[#FBF7F2]'}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selectedPayment === 'COD' ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white' : 'bg-[#F7EEE7] text-[#806C63]'}`}>
                        <Wallet size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-[#351C18]">Cash on Delivery</p>
                        <p className="mt-0.5 text-[10px] text-[#806C63]">Pay cash when your order is delivered</p>
                      </div>

                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedPayment === 'COD' ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4] bg-white'}`}>
                        {selectedPayment === 'COD' && <Check size={11} strokeWidth={3} />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPayment('ONLINE_ON_DELIVERY')
                        localStorage.setItem('minekart_payment_method', 'ONLINE_ON_DELIVERY')
                        setPaymentOption(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#A51D26] bg-[#FFF5F3]' : 'border-[#E8DDD4] bg-[#FFFDFC] hover:border-[#CDAFA4] hover:bg-[#FBF7F2]'}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white' : 'bg-[#F7EEE7] text-[#806C63]'}`}>
                        <Smartphone size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-[#351C18]">Online on Delivery</p>
                        <p className="mt-0.5 text-[10px] text-[#806C63]">Pay online when your order is delivered</p>
                      </div>

                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4] bg-white'}`}>
                        {selectedPayment === 'ONLINE_ON_DELIVERY' && <Check size={11} strokeWidth={3} />}
                      </div>
                    </button>
                  </div>
                )}

                <div className="border-t border-[#E8DDD4] px-3.5 py-3">
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F7EEE7] px-3 py-3">
                    <Truck size={16} className="mt-0.5 shrink-0 text-[#8E181F]" />

                    <div>
                      <p className="text-[10px] font-extrabold text-[#351C18]">Payment at the time of delivery</p>
                      <p className="mt-1 text-[10px] leading-4 text-[#806C63]">No payment is required now. You can pay when your order is delivered.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PLACE ORDER */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddress}
                className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] text-sm font-bold text-white shadow-lg shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {placingOrder ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* BACK CART */}
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="mt-2.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] text-xs font-bold text-[#67544D] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#8E181F]"
              >
                <ArrowLeft size={15} />
                Back to Cart
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[#9A857B]">
                <ShieldCheck size={13} className="text-[#3E8B62]" />
                <span>Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

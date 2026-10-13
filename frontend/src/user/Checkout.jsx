import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, CircleCheck, CreditCard, FileText, MapPin, Plus, ShieldCheck, ShoppingBag, Smartphone, Truck, Wallet, CalendarDays, UserRound, ReceiptText, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'
import toast from 'react-hot-toast'
import CheckoutShimmer from '../userShimmer/CheckoutShimmer'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, cartLoading, clearCart } = useCart()

  const cartItems = cart?.items || []

  const [selectedPayment, setSelectedPayment] = useState(() => {
    return localStorage.getItem('minekart_payment_method') || 'COD'
  })

  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)

  const getAddresses = async () => {
    try {
      setAddressLoading(true)

      const res = await axiosInstance.get('/address')

      if (res.data.success) {
        const addressList = res.data.data || []

        setAddresses(addressList)

        const defaultAddress = addressList.find((address) => address.isDefault)

        setSelectedAddress(defaultAddress?._id || addressList[0]?._id || null)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.title = 'Invoice & Checkout | MineKart'
  }, [cart])

  const subtotal = Number(cart?.subtotal || 0)
  const deliveryCharge = subtotal >= 499 ? 0 : 40
  const tax = Number(cart?.tax || 0)
  const grandTotal = subtotal + deliveryCharge + tax

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  const selectedAddressData = addresses.find((address) => address._id === selectedAddress)

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const invoiceDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const handlePaymentChange = (method) => {
    setSelectedPayment(method)
    localStorage.setItem('minekart_payment_method', method)
  }

  const handlePlaceOrder = async () => {
    if (placingOrder) return

    if (!selectedAddressData) {
      toast.error('Please select a delivery address')
      return
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method')
      return
    }

    if (!cartItems.length) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setPlacingOrder(true)

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

      const params = new URLSearchParams({
        orderId: order.orderId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        totalAmount: String(order.totalAmount),
      })

      navigate(`/order-success?${params.toString()}`)

      clearCart().then((response) => {
        if (!response?.success) {
          console.log('Cart Clear Error:', response?.message)
        }
      })
    } catch (error) {
      console.log('Place Order Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Something went wrong while placing order')
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cartLoading) {
    return <CheckoutShimmer />
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[65vh] bg-[#FBF7F2] px-4 py-12">
        <div className="mx-auto  rounded-2xl border border-[#E8DDD4] bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <ShoppingBag size={30} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#351C18]">Your cart is empty</h1>

          <p className="mt-2 text-sm text-[#806C63]">Add products to your cart before proceeding to checkout.</p>

          <button type="button" onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8E181F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7D171C]">
            Start Shopping
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { title: 'cart', link: '/cart' },
    { title: 'checkout', link: null },
  ]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={breadcrumbItems} />

      <main className="mx-auto w-full pt-3 sm:pt-5  ">
        {/* Page Header */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-20 sm:px-4">
          {/* Left - Checkout */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <CreditCard size={18} strokeWidth={1.9} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Checkout</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Complete your order securely</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex min-w-0 flex-1 items-center justify-center px-2 sm:px-6">
            <div className="flex w-full max-w-100 items-center">
              {/* Cart - Completed */}
              <Link to={'/cart'} className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A51D26] text-white shadow-[0_3px_9px_rgba(165,29,38,0.25)] ring-3 ring-[#F1E3DC] sm:h-9 sm:w-9">
                  <ShoppingBag size={14} strokeWidth={2} />
                </div>

                <span className="hidden text-[9px] font-extrabold text-[#7D171C] sm:block">Cart</span>
              </Link>

              {/* Completed Line */}
              <div className="mx-2 h-0.5 flex-1 rounded-full bg-[#A51D26] sm:mx-3" />

              {/* Checkout - Active */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8E181F] text-white shadow-[0_3px_10px_rgba(142,24,31,0.30)] ring-3 ring-[#F1E3DC] sm:h-9 sm:w-9">
                  <CreditCard size={14} strokeWidth={2} />
                </div>

                <span className="hidden text-[9px] font-extrabold text-[#7D171C] sm:block">Checkout</span>
              </div>

              {/* Upcoming Line */}
              <div className="mx-2 h-0.5 flex-1 rounded-full bg-[#D8C9C1] sm:mx-3" />

              {/* Confirm - Upcoming */}
              <button type="button" onClick={handlePlaceOrder} disabled={placingOrder || !selectedAddress || addresses.length === 0 || addressLoading} className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8CCC5] bg-[#F7F3F0] text-[#9A857B] sm:h-9 sm:w-9">
                  {placingOrder ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D8CCC5] border-t-[#A51D26]" /> : <CircleCheck size={14} strokeWidth={1.8} />}
                </div>

                <span className="hidden text-[9px] font-bold text-[#9A857B] sm:block">{placingOrder ? 'Processing...' : 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* LEFT: INVOICE */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_4px_24px_rgba(73,54,49,0.07)]">
            {/* Invoice Header */}
            <div className="border-b border-[#E8DDD4] bg-[#FFFCFA] px-3 py-3.5 sm:px-5 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8DDD4] bg-white sm:h-12 sm:w-12">
                    <img src="/cart_image.jpg" alt="MineKart" className="h-full w-full object-contain p-1" />
                  </div>

                  <div className="min-w-0">
                    {/* <h2 className="text-lg font-black leading-tight tracking-tight text-[#351C18] sm:text-2xl">MineKart</h2> */}
                    <h1 className="text-lg font-black leading-tight tracking-tight  sm:text-2xl text-[#35231F] ">
                      Mine
                      <span className="text-[#9D2932]">Kart</span>
                    </h1>
                    <p className="mt-1 text-[8px] font-extrabold tracking-widest text-[#8E181F] sm:text-[10px]">SHOP MORE • LIVE BETTER</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-base font-black tracking-wider text-[#8E181F] sm:text-xl">INVOICE</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#806C63] sm:text-[10px]">
                    <CalendarDays size={11} />
                    <span>{invoiceDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-[#F7EEE7] px-3 py-2">
                <p className="text-[10px] font-semibold text-[#67544D] sm:text-xs">Thank you for shopping with MineKart!</p>
                <span className="shrink-0 text-[9px] font-extrabold text-[#8E181F]">
                  {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
            </div>

            {/* Itemized Bill */}
            <div className="px-3 py-3 sm:px-5 sm:py-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-[#351C18] sm:text-base">Order Items</h3>
                  <p className="mt-0.5 text-[9px] text-[#806C63] sm:text-[10px]">Product details and pricing</p>
                </div>

                <span className="rounded-md border border-[#E8DDD4] bg-white px-2.5 py-1.5 text-[9px] font-bold text-[#67544D]">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#A51D26] scrollbar-track-[#F7EEE7] rounded-lg border border-[#E8DDD4]">
                <table className="w-full min-w-97.5 table-fixed border-collapse text-left">
                  <colgroup>
                    <col className="w-[8%]" />
                    <col className="w-[40%]" />
                    <col className="w-[12%]" />
                    <col className="w-[19%]" />
                    <col className="w-[21%]" />
                  </colgroup>

                  <thead>
                    <tr className="bg-[#F7EEE7] text-[9px] font-extrabold uppercase tracking-wide text-[#67544D]">
                      <th className="px-2 py-2.5">#</th>
                      <th className="px-2 py-2.5">Product</th>
                      <th className="px-1 py-2.5 text-center">Qty</th>
                      <th className="px-2 py-2.5 text-right">Price</th>
                      <th className="px-2 py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => {
                      const product = item.productId
                      const unitPrice = Number(item.discountPrice || item.price || 0)

                      return (
                        <tr key={`${product._id}-${item.size || 'no-size'}`} className="border-t border-[#EEE5DF] align-middle transition-colors hover:bg-[#FFFCFA]">
                          <td className="px-2 py-3 text-[10px] text-[#806C63]">{index + 1}</td>

                          <td className="px-2 py-3">
                            <div className="min-w-0">
                              <p title={product.productName} className="line-clamp-2 text-[10px] font-bold leading-4 text-[#351C18] sm:text-xs">
                                {product.productName}
                              </p>

                              <p className="mt-0.5 truncate text-[9px] text-[#806C63]">
                                {product.brand?.brandName || 'MineKart'}
                                {item.size ? ` • Size: ${item.size}` : ''}
                              </p>
                            </div>
                          </td>

                          <td className="px-1 py-3 text-center text-[10px] font-bold text-[#351C18]">{item.quantity}</td>

                          <td className="whitespace-nowrap px-2 py-3 text-right text-[9px] text-[#67544D] sm:text-[11px]">₹{formatPrice(unitPrice)}</td>

                          <td className="whitespace-nowrap px-2 py-3 text-right text-[9px] font-extrabold text-[#351C18] sm:text-[11px]">₹{formatPrice(item.totalPrice)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Address + Payment Summary */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:items-stretch">
                {/* Delivery Address */}
                <div className="min-w-0 rounded-lg border border-[#E8DDD4] bg-[#FFFCFA] p-3 sm:p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                      <MapPin size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#351C18]">Delivery Address</p>
                      <p className="mt-0.5 text-[9px] text-[#806C63]">Billing & shipping address</p>
                    </div>
                  </div>

                  {selectedAddressData ? (
                    <div className="mt-3 border-t border-dashed border-[#E8DDD4] pt-2.5">
                      <p className="text-xs font-extrabold text-[#351C18]">{selectedAddressData.fullName}</p>

                      <p className="mt-1 wrap-break-word text-[10px] leading-4.5 text-[#67544D]">
                        {selectedAddressData.addressLine}, {selectedAddressData.city}, {selectedAddressData.state} - {selectedAddressData.pincode}
                      </p>

                      {selectedAddressData.landmark && <p className="mt-1 wrap-break-word text-[9px] text-[#806C63]">Landmark: {selectedAddressData.landmark}</p>}

                      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#67544D]">
                        <Phone size={11} className="shrink-0 text-[#8E181F]" />
                        {selectedAddressData.phone}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-[10px] text-[#806C63]">Select a delivery address to continue.</p>
                  )}
                </div>

                {/* Price Summary */}
                <div className="min-w-0 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] p-3 sm:p-3.5">
                  <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-wide text-[#351C18]">Payment Summary</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-[#806C63]">Subtotal</span>
                      <span className="font-bold text-[#351C18]">₹{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-[#806C63]">Delivery Charges</span>
                      {deliveryCharge === 0 ? <span className="font-extrabold text-[#34704F]">FREE</span> : <span className="font-bold text-[#351C18]">₹{formatPrice(deliveryCharge)}</span>}
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-[#806C63]">Tax</span>
                      <span className="font-bold text-[#351C18]">₹{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-white p-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Grand Total</p>

                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-1">
                      <p className="text-xl font-black tracking-tight text-[#8E181F] sm:text-2xl">₹{formatPrice(grandTotal)}</p>

                      <span className="text-[9px] font-semibold text-[#806C63]">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold text-[#34704F]">
                    <ShieldCheck size={12} />
                    Secure order summary
                  </div>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8DDD4] pt-3">
                <p className="text-[9px] font-semibold text-[#67544D]">Thank you for choosing MineKart.</p>

                <p className="text-[9px] text-[#9A857B]">{invoiceDate}</p>
              </div>
            </div>
          </section>

          {/* RIGHT: ADDRESS + PAYMENT */}
          <aside className="min-w-0 space-y-4 xl:sticky xl:top-5">
            {/* Address Selection */}
            <section className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_15px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between gap-2 border-b border-[#E8DDD4] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <MapPin size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-[#351C18]">Delivery Address</h2>
                    <p className="mt-0.5 text-[9px] text-[#806C63]">Select your address</p>
                  </div>
                </div>

                <button type="button" onClick={() => navigate('/profile?fromcheckout=true')} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#F7EEE7] px-2.5 py-2 text-[10px] font-bold text-[#8E181F] transition hover:bg-[#F0E2D9]">
                  <Plus size={13} />
                  Add
                </button>
              </div>

              <div className="space-y-2.5 p-3.5">
                {addressLoading ? (
                  <div className="flex min-h-28 flex-col items-center justify-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8DDD4] border-t-[#8E181F]" />
                    <p className="text-[10px] text-[#806C63]">Loading addresses...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D8C9C0] bg-[#FBF7F2] px-4 py-6 text-center">
                    <MapPin size={25} className="mx-auto text-[#9A857B]" />
                    <p className="mt-2 text-xs font-bold text-[#351C18]">No address found</p>
                    <p className="mt-1 text-[10px] text-[#806C63]">Add a delivery address to continue.</p>

                    <Link to="/profile?fromcheckout=true" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#8E181F] px-3 py-2 text-[10px] font-bold text-white">
                      <Plus size={13} />
                      Add Address
                    </Link>
                  </div>
                ) : (
                  addresses.map((address) => {
                    const isSelected = selectedAddress === address._id

                    return (
                      <button
                        key={address._id}
                        type="button"
                        onClick={() => setSelectedAddress(address._id)}
                        className={`w-full rounded-xl border p-3 text-left transition-all ${
                          isSelected ? 'border-[#A51D26] bg-[#FFF7F5] shadow-[0_3px_12px_rgba(142,24,31,0.07)]' : 'border-[#E8DDD4] bg-white hover:border-[#CDAFA4] hover:bg-[#FFFCFA]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#CDBDB4] bg-white'}`}>
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="text-xs font-extrabold text-[#351C18]">{address.fullName}</p>

                              {address.addressType && <span className="rounded bg-[#F7EEE7] px-1.5 py-0.5 text-[8px] font-bold text-[#67544D]">{address.addressType}</span>}

                              {address.isDefault && <span className="rounded bg-[#F0F8F3] px-1.5 py-0.5 text-[8px] font-bold text-[#34704F]">Default</span>}
                            </div>

                            <p className="mt-1.5 wrap-break-word text-[10px] leading-4.5 text-[#67544D]">
                              {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-[#806C63]">{address.phone}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </section>

            {/* Payment Method */}
            <section className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_15px_rgba(73,54,49,0.05)]">
              <div className="flex items-center gap-2.5 border-b border-[#E8DDD4] px-4 py-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <CreditCard size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-[#351C18]">Payment Method</h2>
                  <p className="mt-0.5 text-[9px] text-[#806C63]">Choose how you want to pay</p>
                </div>
              </div>

              <div className="space-y-2.5 p-3.5">
                <button
                  type="button"
                  onClick={() => handlePaymentChange('COD')}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${selectedPayment === 'COD' ? 'border-[#A51D26] bg-[#FFF7F5]' : 'border-[#E8DDD4] hover:bg-[#FBF7F2]'}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selectedPayment === 'COD' ? 'bg-[#8E181F] text-white' : 'bg-[#F7EEE7] text-[#806C63]'}`}>
                    <Wallet size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#351C18]">Cash on Delivery</p>
                    <p className="mt-1 text-[9px] text-[#806C63]">Pay when your order arrives</p>
                  </div>

                  {selectedPayment === 'COD' && <CircleCheck size={18} className="shrink-0 text-[#8E181F]" />}
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentChange('ONLINE_ON_DELIVERY')}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'border-[#A51D26] bg-[#FFF7F5]' : 'border-[#E8DDD4] hover:bg-[#FBF7F2]'}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${selectedPayment === 'ONLINE_ON_DELIVERY' ? 'bg-[#8E181F] text-white' : 'bg-[#F7EEE7] text-[#806C63]'}`}>
                    <Smartphone size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-[#351C18]">Online on Delivery</p>
                    <p className="mt-1 text-[9px] text-[#806C63]">Pay digitally on delivery</p>
                  </div>

                  {selectedPayment === 'ONLINE_ON_DELIVERY' && <CircleCheck size={18} className="shrink-0 text-[#8E181F]" />}
                </button>

                <div className="flex items-start gap-2 rounded-lg bg-[#FBF7F2] p-3">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#3E8B62]" />
                  <p className="text-[9px] leading-4 text-[#806C63]">Payment will be collected at the time of delivery.</p>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <section className="rounded-xl border border-[#E8DDD4] bg-white p-4 shadow-[0_3px_15px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-[#806C63]">Amount Payable</p>
                  <p className="mt-1 text-xl font-black text-[#8E181F]">₹{formatPrice(grandTotal)}</p>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-[#F0F8F3] px-2.5 py-2 text-[9px] font-bold text-[#34704F]">
                  <ShieldCheck size={14} />
                  Secure
                </div>
              </div>

              {!selectedAddress || addresses.length === 0 ? <p className="mt-3 rounded-lg bg-[#FFF5F3] p-3 text-[10px] leading-4 text-[#8E181F]">Please add and select a delivery address to proceed.</p> : null}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddress || addresses.length === 0 || addressLoading}
                className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 text-xs font-extrabold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 active:scale-[0.98]"
              >
                {placingOrder ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Place Order
                    <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-white text-xs font-bold text-[#67544D] transition hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]"
              >
                <ArrowLeft size={15} />
                Back to Cart
              </button>

              <p className="mt-3 text-center text-[9px] leading-4 text-[#9A857B]">Review your invoice before placing your order.</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

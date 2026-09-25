import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, CreditCard, MapPin, Package, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('orderId')

  const getOrder = async () => {
    try {
      setLoading(true)

      if (!orderId) {
        setOrder(null)
        return
      }

      const res = await axiosInstance.get(`/order/${orderId}`)

      if (res.data.success) {
        setOrder(res.data.data)
      } else {
        setOrder(null)
      }

      document.title = 'Order Successfully | MineKart'
    } catch (error) {
      console.log('Get Order Error:', error.response?.data || error.message)

      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getOrder()
  }, [orderId])

  // ! Loading
  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FBF7F2] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[55vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD4] border-t-[#8E181F]" />

              <p className="text-xs font-semibold text-[#806C63]">Loading your order...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ! Order not found
  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#FBF7F2] px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_8px_30px_rgba(73,54,49,0.08)]">
            <div className="bg-linear-to-br from-[#351C18] to-[#7D171C] px-5 py-10 text-center sm:px-8">
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <Package size={32} strokeWidth={1.6} />
              </div>

              <h1 className="mt-5 text-xl font-extrabold text-white sm:text-2xl">Order Not Found</h1>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/70 sm:text-sm">We could not find the order information you're looking for.</p>
            </div>

            <div className="p-5 text-center sm:p-7">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:text-sm"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isCOD = order.paymentMethod === 'COD'
  const isOnlineOnDelivery = order.paymentMethod === 'ONLINE_ON_DELIVERY'

  const orderItems = order.items || []

  const items = [
    { title: 'cart', link: '/cart' },
    { title: 'checkout', link: '/checkout' },
    { title: 'success', link: null },
  ]

  const totalQuantity = orderItems.reduce((total, item) => total + (item.quantity || 0), 0)

  const paymentStatus = order.paymentStatus || 'Pending'
  const orderStatus = order.orderStatus || 'Pending'

  const getPaymentStatusStyle = () => {
    if (paymentStatus === 'Paid') {
      return 'border-[#D5E8DA] bg-[#F0F8F3] text-[#34704F]'
    }

    if (paymentStatus === 'Failed' || paymentStatus === 'Cancelled') {
      return 'border-[#E7D2CF] bg-[#FFF5F3] text-[#A44A3F]'
    }

    return 'border-[#EBD7B7] bg-[#FFF9ED] text-[#A05A16]'
  }

  const getOrderStatusStyle = () => {
    if (orderStatus === 'Delivered') {
      return 'border-[#D5E8DA] bg-[#F0F8F3] text-[#34704F]'
    }

    if (orderStatus === 'Cancelled' || orderStatus === 'Returned') {
      return 'border-[#E7D2CF] bg-[#FFF5F3] text-[#A44A3F]'
    }

    return 'border-[#E8DDD4] bg-[#FBF7F2] text-[#67544D]'
  }

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4 sm:pt-6">
        {/* HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <Package size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Order Confirmation</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Your order has been successfully placed</p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#D5E8DA] bg-[#F0F8F3] px-2 sm:px-2.5">
            <ShieldCheck size={12} className="text-[#3E8B62]" />

            <span className="hidden text-[9px] font-bold text-[#34704F] sm:inline">Order Confirmed</span>
          </div>
        </div>

        {/* SUCCESS HERO */}
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-br from-[#351C18] via-[#5A2A25] to-[#7D171C] px-5 py-8 shadow-[0_10px_30px_rgba(73,54,49,0.12)] sm:px-8 sm:py-10">
          <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-8 h-44 w-44 rounded-full bg-[#D4A373]/10" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm sm:h-20 sm:w-20">
              <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white sm:h-14 sm:w-14">
                <Check size={30} strokeWidth={2.8} className="text-[#7D171C]" />
              </div>
            </div>

            <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white sm:text-3xl">Order Placed Successfully!</h2>

            <p className="mx-auto mt-2 max-w-xl text-[11px] leading-5 text-white/70 sm:text-sm sm:leading-6">Thank you for shopping with MineKart. Your order has been successfully placed and is now being processed.</p>

            {/* ORDER ID */}
            <div className="mt-5 flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-sm">
              <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider text-white/50">Order ID</span>

              <span className="truncate text-[10px] font-extrabold text-white sm:text-xs">{orderId}</span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {/* ORDER PROGRESS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <Truck size={15} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#351C18]">Order Progress</h3>

                    <p className="mt-0.5 text-[9px] text-[#806C63]">Track the current stage of your order</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-5">
                <div className="flex items-start">
                  {/* PLACED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A51D26] text-white shadow-sm">
                      <Check size={13} strokeWidth={3} />
                    </div>

                    <p className="mt-2 text-[9px] font-extrabold text-[#8E181F]">Placed</p>
                  </div>

                  <div className="mt-4 h-px flex-1 bg-[#D8C9C0]" />

                  {/* CONFIRMED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'bg-[#A51D26] text-white' : 'border border-[#D8C9C0] bg-[#FBF7F2] text-[#9A857B]'
                      }`}
                    >
                      {['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? <Check size={13} strokeWidth={3} /> : <Clock3 size={13} />}
                    </div>

                    <p className={`mt-2 text-[9px] font-bold ${['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'text-[#8E181F]' : 'text-[#9A857B]'}`}>Confirmed</p>
                  </div>

                  <div className="mt-4 h-px flex-1 bg-[#D8C9C0]" />

                  {/* SHIPPED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${['Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'bg-[#A51D26] text-white' : 'border border-[#D8C9C0] bg-[#FBF7F2] text-[#9A857B]'}`}>
                      {['Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? <Check size={13} strokeWidth={3} /> : <Package size={13} />}
                    </div>

                    <p className={`mt-2 text-[9px] font-bold ${['Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'text-[#8E181F]' : 'text-[#9A857B]'}`}>Shipped</p>
                  </div>

                  <div className="mt-4 h-px flex-1 bg-[#D8C9C0]" />

                  {/* DELIVERED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${orderStatus === 'Delivered' ? 'bg-[#3E8B62] text-white' : 'border border-[#D8C9C0] bg-[#FBF7F2] text-[#9A857B]'}`}>
                      {orderStatus === 'Delivered' ? <Check size={13} strokeWidth={3} /> : <ShoppingBag size={13} />}
                    </div>

                    <p className={`mt-2 text-[9px] font-bold ${orderStatus === 'Delivered' ? 'text-[#34704F]' : 'text-[#9A857B]'}`}>Delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <ShoppingBag size={15} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#351C18]">Order Items</h3>

                    <p className="mt-0.5 text-[9px] text-[#806C63]">
                      {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} ordered
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="space-y-2.5">
                  {orderItems.map((item, index) => {
                    const itemPrice = item.discountPrice || item.price || 0

                    return (
                      <div
                        key={`${item.productId?._id || index}-${item.size || 'no-size'}`}
                        className="flex gap-3 rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] p-2.5 transition-all duration-200 hover:border-[#D4BDB2] hover:shadow-[0_3px_12px_rgba(73,54,49,0.05)]"
                      >
                        {/* IMAGE */}
                        <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8DDD4] bg-white sm:h-22 sm:w-18">
                          {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain p-1.5" /> : <Package size={22} className="text-[#9A857B]" />}
                        </div>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-[11px] font-bold leading-4.5 text-[#351C18] sm:text-xs">{item.productName}</h4>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.size && <span className="rounded-md bg-[#F7EEE7] px-2 py-1 text-[8px] font-bold text-[#67544D]">Size: {item.size}</span>}

                            <span className="rounded-md border border-[#E8DDD4] bg-white px-2 py-1 text-[8px] font-bold text-[#806C63]">Qty: {item.quantity}</span>
                          </div>

                          <p className="mt-2 text-[9px] text-[#9A857B]">
                            ₹{Number(itemPrice).toLocaleString('en-IN')} × {item.quantity}
                          </p>
                        </div>

                        {/* PRICE */}
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-[#351C18]">₹{Number(item.totalPrice || itemPrice * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            {order.shippingAddress && (
              <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
                <div className="flex items-center gap-2.5 border-b border-[#E8DDD4] px-4 py-3.5 sm:px-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <MapPin size={15} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#351C18]">Delivery Address</h3>

                    <p className="mt-0.5 text-[9px] text-[#806C63]">Your order will be delivered here</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#8E181F] shadow-sm">
                        <MapPin size={14} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-extrabold text-[#351C18]">{order.shippingAddress.fullName}</p>

                          {order.shippingAddress.addressType && <span className="rounded-md bg-[#F7EEE7] px-1.5 py-0.5 text-[8px] font-bold text-[#67544D]">{order.shippingAddress.addressType}</span>}
                        </div>

                        <p className="mt-1.5 text-[10px] leading-4.5 text-[#67544D]">{order.shippingAddress.address}</p>

                        <p className="mt-1 text-[9px] font-semibold text-[#806C63]">
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>

                        {order.shippingAddress.phone && <p className="mt-1 text-[9px] font-semibold text-[#806C63]">Phone: {order.shippingAddress.phone}</p>}

                        {order.shippingAddress.landmark && <p className="mt-1 text-[8px] text-[#9A857B]">Landmark: {order.shippingAddress.landmark}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT MESSAGE */}
            {isCOD && (
              <div className="flex items-start gap-3 rounded-xl border border-[#EBD7B7] bg-[#FFF9ED] px-4 py-3.5">
                <Package size={17} className="mt-0.5 shrink-0 text-[#B87935]" />

                <div>
                  <p className="text-[11px] font-extrabold text-[#79521F]">Cash on Delivery</p>

                  <p className="mt-1 text-[9px] font-semibold leading-4 text-[#8A683C]">Please keep the exact amount ready when your order is delivered.</p>
                </div>
              </div>
            )}

            {isOnlineOnDelivery && (
              <div className="flex items-start gap-3 rounded-xl border border-[#E8DDD4] bg-[#F7EEE7] px-4 py-3.5">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#8E181F]" />

                <div>
                  <p className="text-[11px] font-extrabold text-[#351C18]">Online on Delivery</p>

                  <p className="mt-1 text-[9px] font-semibold leading-4 text-[#67544D]">Your payment will be collected online when your order is delivered.</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_5px_22px_rgba(73,54,49,0.08)] lg:sticky lg:top-24">
              {/* SUMMARY HEADER */}
              <div className="border-b border-[#E8DDD4] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#351C18]">Order Summary</h3>

                    <p className="mt-0.5 text-[9px] text-[#806C63]">Payment & order details</p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <CreditCard size={16} />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* ORDER ID */}
                <div className="rounded-lg bg-[#FBF7F2] px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Order ID</p>

                  <p className="mt-1 break-all text-[10px] font-extrabold text-[#351C18]">{order.orderId || orderId}</p>
                </div>

                {/* PAYMENT */}
                <div className="mt-3 rounded-lg border border-[#E8DDD4] p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                      <CreditCard size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Payment</p>

                      <p className="mt-0.5 truncate text-[10px] font-extrabold text-[#351C18]">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                    </div>
                  </div>

                  <div className={`mt-3 inline-flex rounded-md border px-2 py-1 text-[8px] font-bold ${getPaymentStatusStyle()}`}>{paymentStatus}</div>
                </div>

                {/* ORDER STATUS */}
                <div className="mt-3 rounded-lg border border-[#E8DDD4] p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                      <Package size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Order Status</p>

                      <p className="mt-0.5 truncate text-[10px] font-extrabold text-[#351C18]">{orderStatus}</p>
                    </div>
                  </div>

                  <div className={`mt-3 inline-flex rounded-md border px-2 py-1 text-[8px] font-bold ${getOrderStatusStyle()}`}>{orderStatus}</div>
                </div>

                {/* TOTAL */}
                <div className="mt-4 rounded-xl bg-linear-to-r from-[#F7EEE7] to-[#FFF4EE] px-3.5 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#806C63]">Total Amount</span>

                    <span className="text-xl font-extrabold text-[#8E181F]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* SUMMARY DETAILS */}
                <div className="mt-4 space-y-2.5 border-t border-[#E8DDD4] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C63]">Items</span>

                    <span className="text-[10px] font-bold text-[#351C18]">{totalQuantity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C63]">Subtotal</span>

                    <span className="text-[10px] font-bold text-[#351C18]">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C63]">Delivery</span>

                    <span className="text-[10px] font-bold text-[#3E8B62]">{Number(order.deliveryCharge || 0) === 0 ? 'FREE' : `₹${Number(order.deliveryCharge).toLocaleString('en-IN')}`}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#806C63]">Tax</span>

                    <span className="text-[10px] font-bold text-[#351C18]">₹{Number(order.tax || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('/orders')}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] text-xs font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <ShoppingBag size={15} />
                    My Orders
                    <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E2D5CC] bg-white text-[10px] font-bold text-[#67544D] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#FBF5F1] hover:text-[#8E181F]"
                  >
                    <ArrowLeft size={14} />
                    Continue Shopping
                  </button>
                </div>

                {/* SECURITY */}
                <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-[#E8DDD4] pt-4">
                  <ShieldCheck size={13} className="text-[#3E8B62]" />

                  <span className="text-[8px] font-semibold text-[#9A857B]">Your order information is secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-5">
          <ShieldCheck size={14} className="text-[#9A857B]" />

          <p className="text-[10px] font-medium text-[#9A857B]">Thank you for choosing MineKart.</p>
        </div>
      </div>
    </div>
  )
}

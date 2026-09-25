import React, { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronRight, CircleCheck, Clock3, CreditCard, MapPin, Package, Receipt, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

// ! Order Tracking
const orderStatuses = [
  {
    status: 'Pending',
    label: 'Order Placed',
    description: 'Your order has been placed successfully.',
    icon: Clock3,
  },
  {
    status: 'Confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been confirmed.',
    icon: Check,
  },
  {
    status: 'Processing',
    label: 'Processing',
    description: 'Your order is being prepared.',
    icon: Package,
  },
  {
    status: 'Shipped',
    label: 'Shipped',
    description: 'Your order has been shipped.',
    icon: Package,
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    description: 'Your order is on the way to you.',
    icon: Truck,
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    description: 'Your order has been delivered successfully.',
    icon: CircleCheck,
  },
]

export default function OrderDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // ! Return Order
  const [showReturnBox, setShowReturnBox] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returning, setReturning] = useState(false)

  const getOrderDetails = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/order/${id}`)

      if (res.data.success) {
        setOrder(res.data.data)
      } else {
        setOrder(null)
      }

      document.title = `Order-Details | MineKart`
    } catch (error) {
      console.log('Get Order Details Error:', error.response?.data || error.message)

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

    getOrderDetails()
  }, [id])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('en-IN')
  }

  const currentStatusIndex = orderStatuses.findIndex((item) => item.status === order?.orderStatus)

  const isCancelled = order?.orderStatus === 'Cancelled'
  const isReturned = order?.orderStatus === 'Returned'
  const isCOD = order?.paymentMethod === 'COD'
  const isDelivered = order?.orderStatus === 'Delivered'

  const paymentStatusClass = order?.paymentStatus === 'Paid' ? 'bg-[#EAF6EF] text-[#3E8B62]' : order?.paymentStatus === 'Failed' ? 'bg-[#FCEBEC] text-[#A51D26]' : 'bg-[#FFF4DD] text-[#A05A16]'

  // ! Return Order
  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      return
    }

    try {
      setReturning(true)

      const res = await axiosInstance.put(`/order/${order._id}/return`, {
        returnReason,
      })

      if (res.data.success) {
        setOrder(res.data.data)
        setShowReturnBox(false)
        setReturnReason('')
      }
    } catch (error) {
      console.log('Return Order Error:', error.response?.data || error.message)
    } finally {
      setReturning(false)
    }
  }

  // ! Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F2]">
        <div className="mx-auto w-full animate-pulse">
          <div className="h-16 rounded-xl border border-[#E8DDD4] bg-white sm:h-17" />

          <div className="mt-4 h-24 rounded-xl border border-[#E8DDD4] bg-white sm:mt-5" />

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[270px_minmax(0,1fr)_310px] sm:mt-5">
            <div className="h-125 rounded-2xl bg-white" />
            <div className="h-125 rounded-2xl bg-white" />
            <div className="h-100 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    )
  }

  // ! Order Not Found
  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBF7F2] py-8 sm:py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-6 text-center shadow-[0_8px_30px_rgba(73,54,49,0.07)] sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <Package size={30} strokeWidth={1.6} />
          </div>

          <span className="mt-5 inline-flex rounded-full bg-[#F7EEE7] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#8E181F]">Order</span>

          <h1 className="mt-3 text-xl font-extrabold text-[#351C18]">Order Not Found</h1>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#806C63] sm:text-sm">We could not find this order. Please check your order history and try again.</p>

          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.24)]"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const items = [
    { title: 'Orders', link: '/orders' },
    { title: 'Order Details', link: null },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-4 sm:pt-5">
        {/* HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <Package size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Order Details</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Order #{order.orderId || order._id}</p>
            </div>
          </div>

          <div
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2 text-[8px] font-bold sm:px-2.5 sm:text-[9px] ${
              isCancelled ? 'border-[#F0C8CB] bg-[#FCEBEC] text-[#A51D26]' : isReturned ? 'border-[#EBD7B7] bg-[#FFF9ED] text-[#A05A16]' : isDelivered ? 'border-[#D5E8DA] bg-[#F0F8F3] text-[#34704F]' : 'border-[#E8DDD4] bg-[#FBF7F2] text-[#67544D]'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isCancelled ? 'bg-[#A51D26]' : isReturned ? 'bg-[#B87935]' : isDelivered ? 'bg-[#3E8B62]' : 'bg-[#D4A373]'}`} />

            <span>{order.orderStatus}</span>
          </div>
        </div>

        {/* ORDER META */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-5 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E8DDD4] bg-white p-3 shadow-[0_3px_12px_rgba(73,54,49,0.04)]">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                <Receipt size={13} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Order ID</span>
            </div>

            <p className="mt-2 truncate text-[10px] font-extrabold text-[#351C18] sm:text-xs">#{order.orderId || order._id}</p>
          </div>

          <div className="rounded-xl border border-[#E8DDD4] bg-white p-3 shadow-[0_3px_12px_rgba(73,54,49,0.04)]">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                <CalendarDays size={13} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Ordered On</span>
            </div>

            <p className="mt-2 text-[10px] font-extrabold text-[#351C18] sm:text-xs">{formatDate(order.createdAt)}</p>
          </div>

          <div className="col-span-2 rounded-xl border border-[#E8DDD4] bg-white p-3 shadow-[0_3px_12px_rgba(73,54,49,0.04)] sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                <CreditCard size={13} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Payment</span>
            </div>

            <p className="mt-2 truncate text-[10px] font-extrabold text-[#351C18] sm:text-xs">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[270px_minmax(0,1fr)_310px] sm:gap-5">
          {/* TRACKING */}
          <div className="order-2 rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)] lg:order-1">
            <div className="border-b border-[#EEE5DF] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-[#351C18]">Order Tracking</h2>

                  <p className="mt-1 text-[10px] leading-4 text-[#806C63]">Track your order progress.</p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <Truck size={17} />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {orderStatuses.map((item, index) => {
                const Icon = item.icon

                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isLast = index === orderStatuses.length - 1

                return (
                  <div key={item.status} className="relative flex gap-3">
                    {!isLast && <div className={`absolute left-4.5 top-9 h-[calc(100%-8px)] w-0.5 ${index < currentStatusIndex ? 'bg-[#A51D26]' : 'bg-[#E8DDD4]'}`} />}

                    <div
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                        isCompleted ? 'border-[#8E181F] bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white' : 'border-[#E2D5CC] bg-white text-[#B7A49B]'
                      } ${isCurrent ? 'ring-4 ring-[#F7EEE7]' : ''}`}
                    >
                      <Icon size={15} strokeWidth={2.3} />
                    </div>

                    <div className={`${isLast ? 'pb-0' : 'pb-6'} min-w-0`}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className={`text-xs font-extrabold ${isCompleted ? 'text-[#351C18]' : 'text-[#B7A49B]'}`}>{item.label}</h3>

                        {isCurrent && <span className="rounded-md bg-[#F7EEE7] px-1.5 py-0.5 text-[8px] font-extrabold text-[#8E181F]">Current</span>}
                      </div>

                      <p className={`mt-1 text-[10px] leading-4 ${isCompleted ? 'text-[#806C63]' : 'text-[#B7A49B]'}`}>{item.description}</p>
                    </div>
                  </div>
                )
              })}

              {/* CANCELLED */}
              {isCancelled && (
                <div className="mt-5 rounded-xl border border-[#F0C8CB] bg-[#FCEBEC] p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#A51D26]">
                      <Package size={15} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs font-extrabold text-[#A51D26]">Order Cancelled</h3>

                      <p className="mt-1 text-[10px] leading-4 text-[#A51D26]">This order has been cancelled.</p>

                      {order.cancellationReason && <p className="mt-1.5 text-[10px] font-semibold text-[#8E181F]">Reason: {order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* RETURNED */}
              {isReturned && (
                <div className="mt-5 rounded-xl border border-[#EBD7B7] bg-[#FFF9ED] p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#B87935]">
                      <Package size={15} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs font-extrabold text-[#A05A16]">Order Returned</h3>

                      <p className="mt-1 text-[10px] leading-4 text-[#A05A16]">Your return request has been submitted successfully.</p>

                      {order.cancellationReason && <p className="mt-1.5 text-[10px] font-semibold text-[#79521F]">Reason: {order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER CONTENT */}
          <div className="order-1 min-w-0 space-y-4 lg:order-2 sm:space-y-5">
            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={17} className="text-[#8E181F]" />

                  <h2 className="text-sm font-extrabold text-[#351C18]">Ordered Items</h2>
                </div>

                <span className="rounded-lg bg-white px-2.5 py-1 text-[9px] font-extrabold text-[#67544D] shadow-sm">
                  {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="max-h-97 overflow-y-auto scrollbar-thin [scrollbar-color:#CDBDB4_transparent]">
                <div className="divide-y divide-[#EEE5DF]">
                  {order.items?.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="flex gap-3 p-3.5 transition-colors duration-200 hover:bg-[#FFFCFA] sm:gap-4 sm:p-4">
                      {/* IMAGE */}
                      <div className="flex h-19 w-19 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] sm:h-20 sm:w-20">
                        {item.image ? (
                          <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain p-1.5 transition-transform duration-300 hover:scale-105" />
                        ) : (
                          <Package size={26} strokeWidth={1.5} className="text-[#B7A49B]" />
                        )}
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-xs font-bold leading-5 text-[#351C18] sm:text-sm">{item.productName}</h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-[10px] font-semibold text-[#806C63]">Qty: {item.quantity}</span>

                          {item.size && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-[#CDBDB4]" />

                              <span className="text-[10px] font-semibold text-[#806C63]">Size: {item.size}</span>
                            </>
                          )}
                        </div>

                        <p className="mt-2 text-sm font-extrabold text-[#8E181F]">₹{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#8E181F]" />

                  <h2 className="text-sm font-extrabold text-[#351C18]">Delivery Address</h2>
                </div>

                <span className="rounded-md bg-[#F7EEE7] px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#8E181F]">Delivery</span>
              </div>

              <div className="p-4 sm:p-5">
                <div className="relative overflow-hidden rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-4">
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#A51D26]/[0.035]" />

                  <div className="relative flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8E181F] shadow-sm">
                      <MapPin size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-[#351C18]">{order.shippingAddress?.fullName}</p>

                      <p className="mt-1.5 text-xs leading-5 text-[#806C63]">
                        {order.shippingAddress?.addressLine}
                        <br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>

                      {order.shippingAddress?.landmark && <p className="mt-1.5 text-[10px] font-medium text-[#806C63]">Landmark: {order.shippingAddress.landmark}</p>}

                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#9A857B]">Phone</span>

                        <span className="text-xs font-bold text-[#351C18]">{order.shippingAddress?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2">
                  <CreditCard size={17} className="text-[#8E181F]" />

                  <h2 className="text-sm font-extrabold text-[#351C18]">Payment Information</h2>
                </div>

                <ShieldCheck size={16} className="text-[#3E8B62]" />
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Payment Method</p>

                  <p className="mt-1.5 text-xs font-extrabold text-[#351C18]">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                </div>

                <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Payment Status</p>

                  <span className={`mt-1.5 inline-flex rounded-md px-2 py-1 text-[9px] font-extrabold ${paymentStatusClass}`}>{order.paymentStatus || 'Pending'}</span>
                </div>
              </div>

              <div className="border-t border-[#E8DDD4] px-4 pb-4 sm:px-5">
                <div className="flex items-start gap-2.5 rounded-xl bg-[#F7EEE7] p-3.5">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#8E181F]" />

                  <p className="text-[10px] font-semibold leading-5 text-[#67544D]">{isCOD ? 'Payment will be collected in cash when your order is delivered.' : 'Payment will be collected online when your order is delivered.'}</p>
                </div>
              </div>
            </div>

            {/* RETURN ORDER */}
            {isDelivered && (
              <div className="overflow-hidden rounded-2xl border border-[#EBD7B7] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.04)]">
                <div className="flex flex-col gap-3 border-b border-[#F1E3CB] bg-[#FFFDF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt size={16} className="text-[#B87935]" />

                      <h2 className="text-sm font-extrabold text-[#351C18]">Return Order</h2>
                    </div>

                    <p className="mt-1 text-[10px] leading-5 text-[#806C63]">Need to return this order? Submit a return request.</p>
                  </div>

                  {!showReturnBox && (
                    <button type="button" onClick={() => setShowReturnBox(true)} className="w-full rounded-xl bg-[#FFF4DD] px-4 py-2.5 text-xs font-extrabold text-[#A05A16] transition-all duration-300 hover:bg-[#FFECC4] sm:w-auto">
                      Return Order
                    </button>
                  )}
                </div>

                {showReturnBox && (
                  <div className="p-4 sm:p-5">
                    <label className="text-xs font-bold text-[#67544D]">Return Reason</label>

                    <textarea
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Why do you want to return this order?"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] px-3 py-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A89890] focus:border-[#B87935] focus:bg-white"
                    />

                    <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReturnBox(false)
                          setReturnReason('')
                        }}
                        disabled={returning}
                        className="rounded-xl border border-[#E2D5CC] bg-white px-4 py-2.5 text-xs font-bold text-[#67544D] transition hover:bg-[#F7EEE7] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleReturnOrder}
                        disabled={returning || !returnReason.trim()}
                        className="rounded-xl bg-linear-to-r from-[#A05A16] to-[#B87935] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {returning ? 'Submitting...' : 'Submit Return Request'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="order-3">
            <div className="sticky top-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_6px_24px_rgba(73,54,49,0.07)]">
              {/* SUMMARY HEADER */}
              <div className="relative overflow-hidden bg-linear-to-br from-[#351C18] via-[#5A2A25] to-[#7D171C] px-4 py-4 sm:px-5">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/5" />

                <div className="relative flex items-center gap-2">
                  <Receipt size={17} className="text-white/80" />

                  <h2 className="text-sm font-extrabold text-white">Order Summary</h2>
                </div>

                <p className="relative mt-1 text-[9px] text-white/55">Payment & order total</p>
              </div>

              <div className="p-4 sm:p-5">
                {/* ORDER TOTAL */}
                <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Total Amount</p>

                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#8E181F]">₹{formatPrice(order.totalAmount)}</p>
                </div>

                {/* PRICE DETAILS */}
                <div className="mt-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#67544D]">Price Details</p>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#806C63]">Subtotal</span>

                      <span className="text-xs font-bold text-[#351C18]">₹{formatPrice(order.subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#806C63]">Delivery</span>

                      <span className="text-xs font-bold text-[#3E8B62]">{order.deliveryCharge === 0 ? 'FREE' : `₹${formatPrice(order.deliveryCharge)}`}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#806C63]">Tax</span>

                      <span className="text-xs font-bold text-[#351C18]">₹{formatPrice(order.tax)}</span>
                    </div>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-[#DCCBC1]" />

                {/* FINAL TOTAL */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-[#67544D]">Total Paid</span>

                  <span className="text-lg font-extrabold text-[#8E181F]">₹{formatPrice(order.totalAmount)}</span>
                </div>

                {/* PAYMENT STATUS */}
                <div className={`mt-4 rounded-xl px-3 py-3 ${order.paymentStatus === 'Paid' ? 'bg-[#EAF6EF]' : order.paymentStatus === 'Failed' ? 'bg-[#FCEBEC]' : 'bg-[#FFF9ED]'}`}>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className={order.paymentStatus === 'Paid' ? 'text-[#3E8B62]' : order.paymentStatus === 'Failed' ? 'text-[#A51D26]' : 'text-[#B87935]'} />

                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#67544D]">Payment</span>

                    <span className={`ml-auto text-[9px] font-extrabold ${order.paymentStatus === 'Paid' ? 'text-[#3E8B62]' : order.paymentStatus === 'Failed' ? 'text-[#A51D26]' : 'text-[#A05A16]'}`}>{order.paymentStatus || 'Pending'}</span>
                  </div>
                </div>

                {/* SECURITY */}
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EAF6EF] px-3 py-2.5">
                  <CheckCircle2 size={14} className="shrink-0 text-[#3E8B62]" />

                  <p className="text-[9px] font-bold text-[#3E8B62]">Your order information is secure</p>
                </div>

                {/* BACK BUTTON */}
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-white px-4 py-3 text-xs font-extrabold text-[#67544D] transition-all duration-300 hover:border-[#8E181F] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                >
                  <ArrowLeft size={15} />
                  Back to My Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-5">
          <CheckCircle2 size={13} className="text-[#9A857B]" />

          <p className="text-[10px] font-medium text-[#9A857B] sm:text-[11px]">Thank you for shopping with MineKart.</p>
        </div>
      </div>
    </div>
  )
}

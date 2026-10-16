import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, Check, CheckCircle2, CircleCheck, Clock3, CreditCard, MapPin, Package, Receipt, ShieldCheck, ShoppingBag, Truck, XCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'
import OrderDetailsShimmer from '../userShimmer/OrderDetailsShimmer'

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

  // ! Cancel Order
  const [showCancelBox, setShowCancelBox] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

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
  const isTrackingDisabled = isCancelled || isReturned

  const isCOD = order?.paymentMethod === 'COD'
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'COD':
        return 'Cash on Delivery'
      case 'ONLINE_ON_DELIVERY':
        return 'Online on Delivery'
      case 'RAZORPAY':
        return 'Razorpay'
      default:
        return method || 'Not specified'
    }
  }

  const isDelivered = order?.orderStatus === 'Delivered'

  const returnStatus = order?.returnStatus || 'Not Requested'

  const hasReturnRequest = returnStatus !== 'Not Requested'

  const returnStatusStyles = {
    Requested: 'border-mk-accent bg-mk-warning-soft text-mk-warning',
    Approved: 'border-mk-success-soft bg-mk-success-soft text-mk-success',
    Rejected: 'border-mk-danger-soft bg-mk-danger-soft text-mk-danger',
    'Pickup Scheduled': 'border-mk-disabled-bg bg-mk-bg-admin text-mk-info',
    'Item Received': 'border-mk-success-soft bg-mk-success-soft text-mk-success',
    'Refund Processing': 'border-mk-accent bg-mk-warning-soft text-mk-warning',
    Refunded: 'border-mk-border-admin bg-mk-info-soft text-mk-info',
  }

  const canRequestReturn = isDelivered && !hasReturnRequest && !isCancelled && !isReturned

  // ! User can cancel only these statuses
  const canCancelOrder = ['Pending', 'Confirmed', 'Processing'].includes(order?.orderStatus)

  const getPaymentStatusClass = (status) => {
    switch (
      String(status || 'Pending')
        .trim()
        .toLowerCase()
    ) {
      case 'paid':
        return 'bg-mk-success-soft text-mk-success'

      case 'failed':
        return 'bg-mk-primary-soft text-mk-primary'

      case 'refunded':
      case 'partially refunded':
        return 'bg-mk-info-soft text-mk-info'

      case 'pending':
      case 'initiated':
      case 'processing':
        return 'bg-mk-primary-soft text-mk-warning'

      default:
        return 'bg-mk-surface text-mk-muted-admin'
    }
  }

  // ! Cancel Order
  const handleCancelOrder = async () => {
    try {
      setCancelling(true)

      const res = await axiosInstance.put(`/order/${order._id}/cancel`, {
        cancellationReason: cancelReason,
      })

      if (res.data.success) {
        setOrder(res.data.data)
        setShowCancelBox(false)
        setCancelReason('')
      }
    } catch (error) {
      console.log('Cancel Order Error:', error.response?.data || error.message)
    } finally {
      setCancelling(false)
    }
  }

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
    return <OrderDetailsShimmer />
  }

  // ! Order Not Found
  if (!order) {
    return (
      <div className="min-h-screen bg-mk-bg py-8 sm:py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-mk-border bg-mk-card p-6 text-center shadow-[0_8px_30px_rgba(73,54,49,0.07)] sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mk-primary-soft text-mk-primary-hover">
            <Package size={30} strokeWidth={1.6} />
          </div>

          <span className="mt-5 inline-flex rounded-full bg-mk-primary-soft px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-mk-primary-hover">Order</span>

          <h1 className="mt-3 text-xl font-extrabold text-mk-ink">Order Not Found</h1>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-mk-muted sm:text-sm">We could not find this order. Please check your order history and try again.</p>

          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-5 py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.24)]"
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
    <div className={`min-h-screen ${isCancelled ? 'bg-mk-bg-admin' : 'bg-mk-bg'}`}>
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-4 sm:pt-5">
        {/* HEADER */}
        <div
          className={`mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4 ${
            isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'
          }`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-10 sm:w-10 ${
                isCancelled ? 'bg-mk-disabled-bg text-mk-disabled' : 'bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)]'
              }`}
            >
              <div className={`absolute -right-2 -top-2 h-6 w-6 rounded-full ${isCancelled ? 'bg-white/40' : 'bg-white/10'}`} />

              {isCancelled ? <XCircle size={18} strokeWidth={1.8} className="relative z-10" /> : <Package size={18} strokeWidth={1.8} className="relative z-10" />}
            </div>

            <div className="min-w-0">
              <h1 className={`truncate text-xs font-extrabold tracking-tight sm:text-sm ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>Order Details</h1>

              <p className={`mt-0.5 truncate text-[9px] sm:text-[10px] ${isCancelled ? 'text-mk-subtle' : 'text-mk-muted'}`}>Order #{order.orderId || order._id}</p>
            </div>
          </div>

          <div
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2 text-[8px] font-bold sm:px-2.5 sm:text-[9px] ${
              isCancelled ? 'border-mk-border-admin bg-mk-surface text-mk-muted-admin' : isReturned ? 'border-mk-accent bg-mk-warning-soft text-mk-warning' : isDelivered ? 'border-mk-success-soft bg-mk-success-soft text-mk-success' : 'border-mk-border bg-mk-bg text-mk-muted'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isCancelled ? 'bg-mk-disabled' : isReturned ? 'bg-mk-accent' : isDelivered ? 'bg-mk-success' : 'bg-mk-accent'}`} />

            <span>{order.orderStatus}</span>
          </div>
        </div>

        {/* CANCELLED NOTICE */}
        {isCancelled && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-mk-border-admin bg-mk-surface px-4 py-3 sm:mb-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mk-disabled-bg text-mk-muted">
              <XCircle size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-extrabold text-mk-admin">This order is cancelled</p>

              <p className="mt-0.5 text-[10px] text-mk-subtle">This order is closed and no longer active.</p>
            </div>

            <span className="ml-auto hidden shrink-0 rounded-md border border-mk-border-admin bg-white px-2 py-1 text-[8px] font-extrabold uppercase tracking-wide text-mk-subtle sm:inline-flex">Closed</span>
          </div>
        )}

        {/* ORDER META */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-5 sm:grid-cols-3">
          <div className={`rounded-xl border p-3 shadow-[0_3px_12px_rgba(73,54,49,0.04)] ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCancelled ? 'bg-mk-success-soft text-mk-subtle' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>
                <Receipt size={13} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Order ID</span>
            </div>

            <p className={`mt-2 truncate text-[10px] font-extrabold sm:text-xs ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>#{order.orderId || order._id}</p>
          </div>

          <div className={`rounded-xl border p-3 shadow-[0_3px_12px_rgba(73,54,49,0.04)] ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCancelled ? 'bg-mk-success-soft text-mk-subtle' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>
                <CalendarDays size={13} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Ordered On</span>
            </div>

            <p className={`mt-2 text-[10px] font-extrabold sm:text-xs ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>{formatDate(order.createdAt)}</p>
          </div>

          <div className={`col-span-2 rounded-xl border p-3 shadow-[0_3px_12px_rgba(73,54,49,0.04)] sm:col-span-1 ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCancelled ? 'bg-mk-success-soft text-mk-subtle' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>
                <CreditCard size={13} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Payment</span>
            </div>

            <p className={`mt-2 truncate text-[10px] font-extrabold sm:text-xs ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>{getPaymentMethodLabel(order.paymentMethod)}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[270px_minmax(0,1fr)_310px]">
          {/* TRACKING */}
          <div className={`order-2 rounded-2xl border shadow-[0_4px_18px_rgba(73,54,49,0.05)] lg:order-1 ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
            <div className={`border-b p-4 sm:p-5 ${isCancelled ? 'border-mk-border-admin bg-linear-to-r from-mk-bg-admin to-mk-surface' : 'border-mk-surface bg-linear-to-r from-mk-card to-mk-primary-soft'}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className={`text-sm font-extrabold ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>Order Tracking</h2>

                  <p className="mt-1 text-[10px] leading-4 text-mk-subtle">
                    {isCancelled ? 'Tracking is disabled because this order is cancelled.' : isReturned ? 'Tracking is closed because this order has been returned.' : 'Track your order progress.'}
                  </p>
                </div>

                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isTrackingDisabled ? 'bg-mk-disabled-bg text-mk-subtle' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>
                  {isTrackingDisabled ? <XCircle size={17} /> : <Truck size={17} />}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {orderStatuses.map((item, index) => {
                const Icon = item.icon

                const isCompleted = !isTrackingDisabled && index <= currentStatusIndex
                const isCurrent = !isTrackingDisabled && index === currentStatusIndex

                const isLast = index === orderStatuses.length - 1

                return (
                  <div key={item.status} className="relative flex gap-3">
                    {!isLast && <div className={`absolute left-4.5 top-9 h-[calc(100%-8px)] w-0.5 ${isTrackingDisabled ? 'bg-mk-border-admin' : index < currentStatusIndex ? 'bg-mk-primary' : 'bg-mk-border'}`} />}

                    <div
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                        isTrackingDisabled ? 'border-mk-border-admin bg-mk-surface text-mk-subtle' : isCompleted ? 'border-mk-primary-hover bg-linear-to-br from-mk-primary-deep to-mk-primary text-white' : 'border-mk-border bg-white text-mk-muted'
                      } ${isCurrent ? 'ring-4 ring-mk-primary-soft' : ''}`}
                    >
                      <Icon size={15} strokeWidth={2.3} />
                    </div>

                    <div className={`${isLast ? 'pb-0' : 'pb-6'} min-w-0`}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className={`text-xs font-extrabold ${isTrackingDisabled ? 'text-mk-disabled' : isCompleted ? 'text-mk-ink' : 'text-mk-muted'}`}>{item.label}</h3>

                        {isCurrent && <span className="rounded-md bg-mk-primary-soft px-1.5 py-0.5 text-[8px] font-extrabold text-mk-primary-hover">Current</span>}
                      </div>

                      <p className={`mt-1 text-[10px] leading-4 ${isTrackingDisabled ? 'text-mk-subtle' : isCompleted ? 'text-mk-muted' : 'text-mk-muted'}`}>{item.description}</p>
                    </div>
                  </div>
                )
              })}

              {/* CANCELLED */}
              {isCancelled && (
                <div className="mt-5 rounded-xl border border-mk-border-admin bg-mk-bg-admin p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mk-disabled-bg text-mk-muted">
                      <XCircle size={15} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xs font-extrabold text-mk-admin">Order Cancelled</h3>

                        <span className="rounded-md border border-mk-border-admin bg-white px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-mk-subtle">Closed</span>
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-mk-disabled">This order is no longer active.</p>

                      {order.cancellationReason && <p className="mt-1.5 text-[10px] font-semibold text-mk-muted">Reason: {order.cancellationReason}</p>}

                      {order.cancelledAt && <p className="mt-1 text-[9px] font-medium text-mk-subtle">Cancelled on: {formatDate(order.cancelledAt)}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* RETURNED */}
              {isReturned && (
                <div className="mt-5 rounded-xl border border-mk-accent bg-mk-warning-soft p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-mk-accent">
                      <Package size={15} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs font-extrabold text-mk-warning">Order Returned</h3>

                      <p className="mt-1 text-[10px] leading-4 text-mk-warning">Your return request has been submitted successfully.</p>

                      {(order.returnReason || order.cancellationReason) && <p className="mt-1.5 text-[10px] font-semibold text-mk-warning">Reason: {order.returnReason || order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER CONTENT */}
          <div className="order-1 min-w-0 space-y-4 sm:space-y-5 lg:order-2">
            {/* ORDER ITEMS */}
            <div className={`overflow-hidden rounded-2xl border shadow-[0_4px_18px_rgba(73,54,49,0.05)] ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3.5 sm:px-5 ${isCancelled ? 'border-mk-border-admin bg-linear-to-r from-mk-bg-admin to-mk-surface' : 'border-mk-border bg-linear-to-r from-mk-card to-mk-primary-soft'}`}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={17} className={isCancelled ? 'text-mk-subtle' : 'text-mk-primary-hover'} />

                  <h2 className={`text-sm font-extrabold ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>Ordered Items</h2>
                </div>

                <span className="rounded-lg bg-white px-2.5 py-1 text-[9px] font-extrabold text-mk-muted shadow-sm">
                  {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="max-h-97 overflow-y-auto scrollbar-thin [scrollbar-color:#CDBDB4_transparent]">
                <div className="divide-y divide-mk-surface">
                  {order.items?.map((item, index) => (
                    <div key={`${order._id}-${index}`} className={`flex gap-3 p-3.5 sm:gap-4 sm:p-4 ${isCancelled ? 'opacity-70' : 'transition-colors duration-200 hover:bg-mk-card'}`}>
                      <div className={`flex h-19 w-19 shrink-0 items-center justify-center overflow-hidden rounded-xl border sm:h-20 sm:w-20 ${isCancelled ? 'border-mk-border-admin bg-mk-surface grayscale' : 'border-mk-border bg-mk-bg'}`}>
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.productName} className="h-full w-full object-contain p-1.5 transition-transform duration-300 hover:scale-105" />
                        ) : (
                          <Package size={26} strokeWidth={1.5} className="text-mk-muted" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className={`line-clamp-2 text-xs font-bold leading-5 sm:text-sm ${isCancelled ? 'text-mk-muted-admin' : 'text-mk-ink'}`}>{item.productName}</h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-[10px] font-semibold text-mk-muted">Qty: {item.quantity}</span>

                          {item.size && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-mk-border-admin" />

                              <span className="text-[10px] font-semibold text-mk-muted">Size: {item.size}</span>
                            </>
                          )}
                        </div>

                        <p className={`mt-2 text-sm font-extrabold ${isCancelled ? 'text-mk-disabled' : 'text-mk-primary-hover'}`}>₹{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className={`overflow-hidden rounded-2xl border shadow-[0_4px_18px_rgba(73,54,49,0.05)] ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3.5 sm:px-5 ${isCancelled ? 'border-mk-border-admin bg-linear-to-r from-mk-bg-admin to-mk-surface' : 'border-mk-border bg-linear-to-r from-mk-card to-mk-primary-soft'}`}>
                <div className="flex items-center gap-2">
                  <MapPin size={17} className={isCancelled ? 'text-mk-subtle' : 'text-mk-primary-hover'} />

                  <h2 className={`text-sm font-extrabold ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>Delivery Address</h2>
                </div>

                <span className={`rounded-md px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider ${isCancelled ? 'bg-mk-success-soft text-mk-subtle' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>Delivery</span>
              </div>

              <div className="p-4 sm:p-5">
                <div className={`relative overflow-hidden rounded-xl border p-4 ${isCancelled ? 'border-mk-border-admin bg-mk-surface' : 'border-mk-border bg-mk-bg'}`}>
                  <div className={`absolute -right-8 -top-8 h-20 w-20 rounded-full ${isCancelled ? 'bg-mk-disabled/5' : 'bg-mk-primary/[0.035]'}`} />

                  <div className="relative flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${isCancelled ? 'bg-mk-disabled-bg text-mk-subtle' : 'bg-white text-mk-primary-hover'}`}>
                      <MapPin size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className={`text-sm font-extrabold ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>{order.shippingAddress?.fullName}</p>

                      <p className="mt-1.5 text-xs leading-5 text-mk-muted">
                        {order.shippingAddress?.addressLine}
                        <br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>

                      {order.shippingAddress?.landmark && <p className="mt-1.5 text-[10px] font-medium text-mk-muted">Landmark: {order.shippingAddress.landmark}</p>}

                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-mk-muted">Phone</span>

                        <span className={`text-xs font-bold ${isCancelled ? 'text-mk-muted' : 'text-mk-ink'}`}>{order.shippingAddress?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className={`overflow-hidden rounded-2xl border shadow-[0_4px_18px_rgba(73,54,49,0.05)] ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
              <div className={`flex items-center justify-between border-b px-4 py-3.5 sm:px-5 ${isCancelled ? 'border-mk-border-admin bg-linear-to-r from-mk-bg-admin to-mk-surface' : 'border-mk-border bg-linear-to-r from-mk-card to-mk-primary-soft'}`}>
                <div className="flex items-center gap-2">
                  <CreditCard size={17} className={isCancelled ? 'text-mk-subtle' : 'text-mk-primary-hover'} />

                  <h2 className={`text-sm font-extrabold ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>Payment Information</h2>
                </div>

                <ShieldCheck size={16} className={isCancelled ? 'text-mk-subtle' : 'text-mk-success'} />
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                <div className={`rounded-xl border p-3.5 ${isCancelled ? 'border-mk-border-admin bg-mk-surface' : 'border-mk-border bg-mk-bg'}`}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-mk-muted">Payment Method</p>

                  <p className={`mt-1.5 text-xs font-extrabold ${isCancelled ? 'text-mk-admin' : 'text-mk-ink'}`}>{getPaymentMethodLabel(order.paymentMethod)}</p>
                </div>

                <div className={`rounded-xl border p-3.5 ${isCancelled ? 'border-mk-border-admin bg-mk-surface' : 'border-mk-border bg-mk-bg'}`}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-mk-muted">Payment Status</p>

                  <span className={`mt-1.5 inline-flex rounded-md px-2 py-1 text-[9px] font-extrabold ${getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</span>
                </div>
              </div>

              <div className="border-t border-mk-border px-4 py-5 sm:px-5">
                <div className={`flex items-start gap-2.5 rounded-xl p-3.5 ${isCancelled ? 'bg-mk-surface' : 'bg-mk-primary-soft'}`}>
                  <ShieldCheck size={16} className={`mt-0.5 shrink-0 ${isCancelled ? 'text-mk-subtle' : 'text-mk-primary-hover'}`} />

                  {isCOD
                    ? 'Payment will be collected in cash when your order is delivered.'
                    : order.paymentStatus === 'Paid'
                      ? 'Your online payment has been completed successfully.'
                      : order.paymentStatus === 'Failed'
                        ? 'Your online payment failed. Please contact support if any amount was deducted.'
                        : order.paymentStatus === 'Refunded'
                          ? 'Your payment has been refunded.'
                          : order.paymentStatus === 'Partially Refunded'
                            ? 'A partial refund has been issued for your payment.'
                            : 'Your online payment is awaiting confirmation.'}
                </div>
              </div>
            </div>

            {/* CANCEL ORDER */}
            {canCancelOrder && (
              <div className="overflow-hidden rounded-2xl border border-mk-border bg-white shadow-[0_4px_18px_rgba(125,23,28,0.06)]">
                <div className="flex flex-col gap-3 border-b border-mk-accent bg-linear-to-r from-mk-primary-deep to-mk-primary px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                        <XCircle size={16} />
                      </div>

                      <h2 className="text-sm font-extrabold text-white">Cancel Order</h2>
                    </div>

                    <p className="mt-1 text-[10px] leading-5 text-white/75">You can cancel this order before it is shipped.</p>
                  </div>

                  {!showCancelBox && (
                    <button
                      type="button"
                      onClick={() => setShowCancelBox(true)}
                      className="w-full rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-mk-primary-hover shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-mk-bg hover:shadow-md sm:w-auto"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                {showCancelBox && (
                  <div className="bg-mk-card p-4 sm:p-5">
                    <div className="rounded-xl border border-mk-border bg-mk-primary-soft p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mk-primary text-white">
                          <XCircle size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-extrabold text-mk-primary-deep">Are you sure you want to cancel this order?</p>

                          <p className="mt-1 text-[10px] leading-4 text-mk-primary-hover">This action cannot be undone once the order is cancelled.</p>
                        </div>
                      </div>
                    </div>

                    <label className="mt-4 block text-xs font-bold text-mk-muted">
                      Cancellation Reason
                      <span className="ml-1 font-medium text-mk-muted">(Optional)</span>
                    </label>

                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Why do you want to cancel this order?"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-mk-border bg-white px-3 py-3 text-xs text-mk-ink outline-none transition placeholder:text-mk-muted focus:border-mk-primary focus:ring-2 focus:ring-mk-primary/10"
                    />

                    <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCancelBox(false)
                          setCancelReason('')
                        }}
                        disabled={cancelling}
                        className="rounded-xl border border-mk-border bg-white px-4 py-2.5 text-xs font-bold text-mk-muted transition hover:bg-mk-primary-soft disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Keep Order
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        className="rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_14px_rgba(125,23,28,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(125,23,28,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RETURN ORDER */}

            {/* RETURN & REFUND */}
            {(isDelivered || hasReturnRequest) && (
              <div className="overflow-hidden rounded-2xl border border-mk-accent bg-white shadow-[0_4px_18px_rgba(73,54,49,0.04)]">
                <div className="flex flex-col gap-3 border-b border-mk-border bg-mk-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt size={16} className="text-mk-accent" />
                      <h2 className="text-sm font-extrabold text-mk-ink">Return & Refund</h2>
                    </div>

                    <p className="mt-1 text-[10px] leading-5 text-mk-muted">{hasReturnRequest ? 'Track your return request and refund progress.' : 'Need to return your delivered order?'}</p>
                  </div>

                  {canRequestReturn && !showReturnBox && (
                    <button type="button" onClick={() => setShowReturnBox(true)} className="w-full rounded-xl bg-mk-primary-soft px-4 py-2.5 text-xs font-extrabold text-mk-warning transition hover:bg-mk-border sm:w-auto">
                      Request Return
                    </button>
                  )}
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  {hasReturnRequest && (
                    <div className="rounded-xl border border-mk-border bg-mk-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-mk-ink">Return Request Status</span>

                        <span className={`inline-flex rounded-md border px-2 py-1 text-[9px] font-bold ${returnStatusStyles[returnStatus] || 'border-mk-border bg-mk-bg text-mk-muted'}`}>{returnStatus}</span>
                      </div>

                      {order.returnReason && (
                        <p className="mt-3 text-[11px] leading-5 text-mk-muted">
                          <span className="font-bold text-mk-muted">Your reason:</span> {order.returnReason}
                        </p>
                      )}

                      {order.returnRejectionReason && (
                        <div className="mt-3 rounded-lg border border-mk-danger-soft bg-mk-danger-soft p-3">
                          <p className="text-[10px] font-extrabold text-mk-danger">Return request rejected</p>
                          <p className="mt-1 text-[10px] leading-4 text-mk-muted">{order.returnRejectionReason}</p>
                        </div>
                      )}

                      {returnStatus === 'Refund Processing' && <p className="mt-3 text-[10px] leading-5 text-mk-warning">Your return has been received. Your refund is being processed.</p>}

                      {returnStatus === 'Refunded' && (
                        <div className="mt-3 rounded-lg border border-mk-border-admin bg-mk-info-soft p-3">
                          <p className="text-[11px] font-extrabold text-mk-info">Refund completed</p>

                          {order.refundAmount != null && <p className="mt-1 text-xs font-bold text-mk-info">Refund amount: ₹{formatPrice(order.refundAmount)}</p>}

                          {order.refundedAt && <p className="mt-1 text-[10px] text-mk-info">Refunded on: {formatDate(order.refundedAt)}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {canRequestReturn && showReturnBox && (
                    <div>
                      <div className="rounded-xl border border-mk-accent bg-mk-warning-soft p-3">
                        <p className="text-xs font-extrabold text-mk-warning">Before submitting</p>
                        <p className="mt-1 text-[10px] leading-5 text-mk-muted">Please provide a clear reason for returning your order.</p>
                      </div>

                      <label className="mt-4 block text-xs font-bold text-mk-muted">
                        Return Reason
                        <span className="ml-1 text-mk-primary">*</span>
                      </label>

                      <textarea
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        placeholder="Explain why you want to return this order..."
                        rows={4}
                        maxLength={500}
                        className="mt-2 w-full resize-none rounded-xl border border-mk-border bg-mk-bg px-3 py-3 text-xs text-mk-ink outline-none transition placeholder:text-mk-muted focus:border-mk-accent focus:bg-white"
                      />

                      <p className="mt-1 text-right text-[9px] text-mk-muted">{returnReason.length}/500</p>

                      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReturnBox(false)
                            setReturnReason('')
                          }}
                          disabled={returning}
                          className="rounded-xl border border-mk-border bg-white px-4 py-2.5 text-xs font-bold text-mk-muted transition hover:bg-mk-primary-soft disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleReturnOrder}
                          disabled={returning || !returnReason.trim()}
                          className="rounded-xl bg-linear-to-r from-mk-warning to-mk-accent px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {returning ? 'Submitting...' : 'Submit Return Request'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="order-3">
            <div className={`sticky top-5 overflow-hidden rounded-2xl border shadow-[0_6px_24px_rgba(73,54,49,0.07)] ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-white'}`}>
              {/* SUMMARY HEADER */}
              <div className={`relative overflow-hidden px-4 py-4 sm:px-5 ${isCancelled ? 'bg-linear-to-br from-mk-admin-hover via-mk-muted-admin to-mk-muted' : 'bg-linear-to-br from-mk-ink via-mk-primary-deep to-mk-primary-deep'}`}>
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/5" />

                <div className="relative flex items-center gap-2">
                  {isCancelled ? <XCircle size={17} className="text-white/80" /> : <Receipt size={17} className="text-white/80" />}

                  <h2 className="text-sm font-extrabold text-white">Order Summary</h2>
                </div>

                <p className="relative mt-1 text-[9px] text-white/55">{isCancelled ? 'Cancelled order summary' : 'Payment & order total'}</p>
              </div>

              <div className="p-4 sm:p-5">
                {/* ORDER TOTAL */}
                <div className={`rounded-xl border p-3.5 ${isCancelled ? 'border-mk-border-admin bg-mk-surface' : 'border-mk-border bg-mk-bg'}`}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-mk-muted">Total Amount</p>

                  <p className={`mt-1 text-2xl font-extrabold tracking-tight ${isCancelled ? 'text-mk-muted-admin' : 'text-mk-primary-hover'}`}>₹{formatPrice(order.totalAmount)}</p>
                </div>

                {/* PRICE DETAILS */}
                <div className="mt-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-mk-muted">Price Details</p>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-mk-muted">Subtotal</span>

                      <span className={`text-xs font-bold ${isCancelled ? 'text-mk-muted-admin' : 'text-mk-ink'}`}>₹{formatPrice(order.subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-mk-muted">Delivery</span>

                      <span className={`text-xs font-bold ${isCancelled ? 'text-mk-subtle' : 'text-mk-success'}`}>{order.deliveryCharge === 0 ? 'FREE' : `₹${formatPrice(order.deliveryCharge)}`}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-mk-muted">Tax</span>

                      <span className={`text-xs font-bold ${isCancelled ? 'text-mk-muted-admin' : 'text-mk-ink'}`}>₹{formatPrice(order.tax)}</span>
                    </div>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-mk-border" />

                {/* FINAL TOTAL */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-mk-muted">Total Amount</span>

                  <span className={`text-lg font-extrabold ${isCancelled ? 'text-mk-muted-admin' : 'text-mk-primary-hover'}`}>₹{formatPrice(order.totalAmount)}</span>
                </div>

                {/* PAYMENT STATUS */}
                <div
                  className={`mt-4 rounded-xl px-3 py-3 ${
                    isCancelled
                      ? 'bg-mk-surface'
                      : order.paymentStatus === 'Paid'
                        ? 'bg-mk-success-soft'
                        : order.paymentStatus === 'Failed'
                          ? 'bg-mk-primary-soft'
                          : ['Refunded', 'Partially Refunded'].includes(order.paymentStatus)
                            ? 'bg-mk-info-soft'
                            : 'bg-mk-warning-soft'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard
                      size={14}
                      className={
                        isCancelled
                          ? 'text-mk-subtle'
                          : order.paymentStatus === 'Paid'
                            ? 'text-mk-success'
                            : order.paymentStatus === 'Failed'
                              ? 'text-mk-primary'
                              : ['Refunded', 'Partially Refunded'].includes(order.paymentStatus)
                                ? 'text-mk-info'
                                : 'text-mk-accent'
                      }
                    />

                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Payment</span>

                    <span className={`ml-auto text-[9px] font-extrabold ${isCancelled ? 'text-mk-subtle' : getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</span>
                  </div>
                </div>

                {/* SECURITY */}
                <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 ${isCancelled ? 'bg-mk-surface' : 'bg-mk-success-soft'}`}>
                  <CheckCircle2 size={14} className={`shrink-0 ${isCancelled ? 'text-mk-subtle' : 'text-mk-success'}`} />

                  <p className={`text-[9px] font-bold ${isCancelled ? 'text-mk-subtle' : 'text-mk-success'}`}>{isCancelled ? 'This order is closed and no longer active.' : 'Your order information is secure'}</p>
                </div>

                {/* BACK BUTTON */}
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-extrabold transition-all duration-300 ${
                    isCancelled
                      ? 'border-mk-border-admin bg-mk-surface text-mk-muted-admin hover:border-mk-subtle hover:bg-mk-disabled-bg hover:text-mk-admin'
                      : 'border-mk-border bg-white text-mk-muted hover:border-mk-primary-hover hover:bg-mk-primary-soft hover:text-mk-primary-hover'
                  }`}
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
          <CheckCircle2 size={13} className={isCancelled ? 'text-mk-subtle' : 'text-mk-muted'} />

          <p className={`text-[10px] font-medium sm:text-[11px] ${isCancelled ? 'text-mk-subtle' : 'text-mk-muted'}`}>Thank you for shopping with MineKart.</p>
        </div>
      </div>
    </div>
  )
}

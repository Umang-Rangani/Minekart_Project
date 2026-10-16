import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, CreditCard, MapPin, Package, ShieldCheck, ShoppingBag, Truck, CircleCheck } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'
import OrderSuccessShimmer from '../userShimmer/OrderSuccessShimmer'

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
    return <OrderSuccessShimmer />
  }

  // ! Order not found
  if (!order) {
    return (
      <div className="min-h-[70vh] bg-mk-bg px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-mk-border bg-white shadow-[0_8px_30px_rgba(73,54,49,0.08)]">
            <div className="bg-linear-to-br from-mk-ink to-mk-primary-deep px-5 py-10 text-center sm:px-8">
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
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-5 py-3 text-xs font-bold text-white shadow-md shadow-mk-primary-deep/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:text-sm"
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
  const isRazorpay = order.paymentMethod === 'RAZORPAY'

  const paymentMethodLabel = isCOD ? 'Cash on Delivery' : isOnlineOnDelivery ? 'Online on Delivery' : isRazorpay ? 'Razorpay' : order.paymentMethod || 'Payment'

  const orderItems = order.items || []

  const items = [
    { title: 'Products', link: '/products' },
    { title: 'cart', link: '/cart' },
    { title: 'checkout', link: '/checkout' },
    { title: 'success', link: null },
  ]

  const totalQuantity = orderItems.reduce((total, item) => total + (item.quantity || 0), 0)

  const paymentStatus = order.paymentStatus || 'Pending'

  const isPaymentPaid = paymentStatus === 'Paid'
  const isPaymentFailed = ['Failed', 'Cancelled'].includes(paymentStatus)

  const successTitle = isPaymentPaid ? 'Order Placed Successfully!' : isPaymentFailed ? 'Payment Not Completed' : isCOD ? 'Order Placed Successfully!' : 'Order Received!'

  const successDescription = isPaymentPaid
    ? 'Your payment is confirmed. Thank you for shopping with MineKart!'
    : isPaymentFailed
      ? 'Your payment is not completed. Please check your order details before trying again.'
      : isCOD
        ? 'Your order has been placed. Please pay when your order is delivered.'
        : 'Your order has been received. Your payment status is pending confirmation.'

  const orderStatus = order.orderStatus || 'Pending'

  const getPaymentStatusStyle = () => {
    if (paymentStatus === 'Paid') {
      return 'border-mk-success-soft bg-mk-success-soft text-mk-success'
    }

    if (paymentStatus === 'Failed' || paymentStatus === 'Cancelled') {
      return 'border-mk-danger-soft bg-mk-danger-soft text-mk-danger'
    }

    return 'border-mk-accent bg-mk-warning-soft text-mk-warning'
  }

  const getOrderStatusStyle = () => {
    if (orderStatus === 'Delivered') {
      return 'border-mk-success-soft bg-mk-success-soft text-mk-success'
    }

    if (orderStatus === 'Cancelled' || orderStatus === 'Returned') {
      return 'border-mk-danger-soft bg-mk-danger-soft text-mk-danger'
    }

    return 'border-mk-border bg-mk-bg text-mk-muted'
  }

  return (
    <div className="pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full  pt-5">
        {/* HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-mk-border bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-20 sm:px-4">
          {/* Left - Order Confirmation */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <CircleCheck size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-mk-ink sm:text-sm">Order Confirmation</h1>

              <p className="mt-0.5 truncate text-[9px] text-mk-muted sm:text-[10px]">Your order has been successfully placed</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex min-w-0 flex-1 items-center justify-center px-2 sm:px-6">
            <div className="flex w-full max-w-100 items-center">
              {/* Cart - Completed */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mk-primary text-white shadow-[0_3px_9px_rgba(165,29,38,0.25)] ring-3 ring-mk-primary-soft sm:h-9 sm:w-9">
                  <ShoppingBag size={14} strokeWidth={2} />
                </div>

                <span className="hidden text-[9px] font-extrabold text-mk-primary-deep sm:block">Cart</span>
              </div>

              {/* Completed Line */}
              <div className="mx-2 h-0.5 flex-1 rounded-full bg-mk-primary sm:mx-3" />

              {/* Checkout - Completed */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mk-primary text-white shadow-[0_3px_9px_rgba(165,29,38,0.25)] ring-3 ring-mk-primary-soft sm:h-9 sm:w-9">
                  <CreditCard size={14} strokeWidth={2} />
                </div>

                <span className="hidden text-[9px] font-extrabold text-mk-primary-deep sm:block">Checkout</span>
              </div>

              {/* Completed Line */}
              <div className="mx-2 h-0.5 flex-1 rounded-full bg-mk-primary sm:mx-3" />

              {/* Confirm - Active */}
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mk-primary-deep text-white shadow-[0_3px_10px_rgba(125,23,28,0.30)] ring-3 ring-mk-primary-soft sm:h-9 sm:w-9">
                  <CircleCheck size={14} strokeWidth={2} />
                </div>

                <span className="hidden text-[9px] font-extrabold text-mk-primary-deep sm:block">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        {/* SUCCESS HERO */}
        <div className="relative mb-5 overflow-hidden rounded-2xl border border-mk-border bg-linear-to-br from-mk-ink via-mk-primary-deep to-mk-primary-deep px-5 py-8 shadow-[0_10px_30px_rgba(73,54,49,0.12)] sm:px-8 sm:py-10">
          <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -right-8 h-44 w-44 rounded-full bg-mk-accent/10" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm sm:h-20 sm:w-20">
              <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white sm:h-14 sm:w-14">
                {isPaymentPaid || isCOD ? (
                  <Check size={30} strokeWidth={2.8} className="text-mk-success" />
                ) : isPaymentFailed ? (
                  <span className="text-3xl font-bold text-mk-danger">!</span>
                ) : (
                  <Clock3 size={28} strokeWidth={2.2} className="text-mk-warning" />
                )}
              </div>
            </div>

            <h2 className="mt-5 text-xl font-extrabold tracking-tight text-white sm:text-3xl">{successTitle}</h2>

            <p className="mx-auto mt-2 max-w-xl text-[11px] leading-5 text-white/70 sm:text-sm sm:leading-6">{successDescription}</p>

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
            <div className="overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="border-b border-mk-border px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                    <Truck size={15} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-mk-ink">Order Progress</h3>

                    <p className="mt-0.5 text-[9px] text-mk-muted">Track the current stage of your order</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-5">
                <div className="flex items-start">
                  {/* PLACED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mk-primary text-white shadow-sm">
                      <Check size={13} strokeWidth={3} />
                    </div>

                    <p className="mt-2 text-[9px] font-extrabold text-mk-primary-hover">Placed</p>
                  </div>

                  <div className="mt-4 h-px flex-1 bg-mk-border" />

                  {/* CONFIRMED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'bg-mk-primary text-white' : 'border border-mk-border bg-mk-bg text-mk-muted'
                      }`}
                    >
                      {['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? <Check size={13} strokeWidth={3} /> : <Clock3 size={13} />}
                    </div>

                    <p className={`mt-2 text-[9px] font-bold ${['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'text-mk-primary-hover' : 'text-mk-muted'}`}>Confirmed</p>
                  </div>

                  <div className="mt-4 h-px flex-1 bg-mk-border" />

                  {/* SHIPPED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${['Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'bg-mk-primary text-white' : 'border border-mk-border bg-mk-bg text-mk-muted'}`}>
                      {['Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? <Check size={13} strokeWidth={3} /> : <Package size={13} />}
                    </div>

                    <p className={`mt-2 text-[9px] font-bold ${['Shipped', 'Out for Delivery', 'Delivered'].includes(orderStatus) ? 'text-mk-primary-hover' : 'text-mk-muted'}`}>Shipped</p>
                  </div>

                  <div className="mt-4 h-px flex-1 bg-mk-border" />

                  {/* DELIVERED */}
                  <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${orderStatus === 'Delivered' ? 'bg-mk-success text-white' : 'border border-mk-border bg-mk-bg text-mk-muted'}`}>
                      {orderStatus === 'Delivered' ? <Check size={13} strokeWidth={3} /> : <ShoppingBag size={13} />}
                    </div>

                    <p className={`mt-2 text-[9px] font-bold ${orderStatus === 'Delivered' ? 'text-mk-success' : 'text-mk-muted'}`}>Delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
              <div className="flex items-center justify-between border-b border-mk-border px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                    <ShoppingBag size={15} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-mk-ink">Order Items</h3>

                    <p className="mt-0.5 text-[9px] text-mk-muted">
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
                        className="flex gap-3 rounded-xl border border-mk-border bg-mk-card p-2.5 transition-all duration-200 hover:border-mk-border hover:shadow-[0_3px_12px_rgba(73,54,49,0.05)]"
                      >
                        {/* IMAGE */}
                        <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mk-border bg-white sm:h-22 sm:w-18">
                          {item.image ? <img src={getImageUrl(item.image)} alt={item.productName} className="h-full w-full object-contain p-1.5" /> : <Package size={22} className="text-mk-muted" />}
                        </div>

                        {/* DETAILS */}
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-[11px] font-bold leading-4.5 text-mk-ink sm:text-xs">{item.productName}</h4>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.size && <span className="rounded-md bg-mk-primary-soft px-2 py-1 text-[8px] font-bold text-mk-muted">Size: {item.size}</span>}

                            <span className="rounded-md border border-mk-border bg-white px-2 py-1 text-[8px] font-bold text-mk-muted">Qty: {item.quantity}</span>
                          </div>

                          <p className="mt-2 text-[9px] text-mk-muted">
                            ₹{Number(itemPrice).toLocaleString('en-IN')} × {item.quantity}
                          </p>
                        </div>

                        {/* PRICE */}
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-extrabold text-mk-ink">₹{Number(item.totalPrice || itemPrice * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            {order.shippingAddress && (
              <div className="overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)]">
                <div className="flex items-center gap-2.5 border-b border-mk-border px-4 py-3.5 sm:px-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                    <MapPin size={15} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-mk-ink">Delivery Address</h3>

                    <p className="mt-0.5 text-[9px] text-mk-muted">Your order will be delivered here</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="rounded-xl border border-mk-border bg-mk-bg p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-mk-primary-hover shadow-sm">
                        <MapPin size={14} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-extrabold text-mk-ink">{order.shippingAddress.fullName}</p>

                          {order.shippingAddress.addressType && <span className="rounded-md bg-mk-primary-soft px-1.5 py-0.5 text-[8px] font-bold text-mk-muted">{order.shippingAddress.addressType}</span>}
                        </div>

                        <p className="mt-1.5 text-[10px] leading-4.5 text-mk-muted">{order.shippingAddress.addressLine}</p>

                        <p className="mt-1 text-[9px] font-semibold text-mk-muted">
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>

                        {order.shippingAddress.phone && <p className="mt-1 text-[9px] font-semibold text-mk-muted">Phone: {order.shippingAddress.phone}</p>}

                        {order.shippingAddress.landmark && <p className="mt-1 text-[8px] text-mk-muted">Landmark: {order.shippingAddress.landmark}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT MESSAGE */}
            {isCOD && (
              <div className="flex items-start gap-3 rounded-xl border border-mk-accent bg-mk-warning-soft px-4 py-3.5">
                <Package size={17} className="mt-0.5 shrink-0 text-mk-accent" />

                <div>
                  <p className="text-[11px] font-extrabold text-mk-warning">Cash on Delivery</p>

                  <p className="mt-1 text-[9px] font-semibold leading-4 text-mk-warning">Please keep the exact amount ready when your order is delivered.</p>
                </div>
              </div>
            )}

            {isOnlineOnDelivery && (
              <div className="flex items-start gap-3 rounded-xl border border-mk-border bg-mk-primary-soft px-4 py-3.5">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-mk-primary-hover" />

                <div>
                  <p className="text-[11px] font-extrabold text-mk-ink">Online on Delivery</p>

                  <p className="mt-1 text-[9px] font-semibold leading-4 text-mk-muted">Your payment will be collected online when your order is delivered.</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_5px_22px_rgba(73,54,49,0.08)] lg:sticky lg:top-24">
              {/* SUMMARY HEADER */}
              <div className="border-b border-mk-border px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-mk-ink">Order Summary</h3>

                    <p className="mt-0.5 text-[9px] text-mk-muted">Payment & order details</p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                    <CreditCard size={16} />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* ORDER ID */}
                <div className="rounded-lg bg-mk-bg px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Order ID</p>

                  <p className="mt-1 break-all text-[10px] font-extrabold text-mk-ink">{order.orderId || orderId}</p>
                </div>

                {/* PAYMENT */}
                <div className="mt-3 rounded-lg border border-mk-border p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                      <CreditCard size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Payment</p>

                      <p className="mt-0.5 truncate text-[10px] font-extrabold text-mk-ink">{paymentMethodLabel}</p>
                    </div>
                  </div>

                  <div className={`mt-3 inline-flex rounded-md border px-2 py-1 text-[8px] font-bold ${getPaymentStatusStyle()}`}>{paymentStatus}</div>
                </div>

                {/* ORDER STATUS */}
                <div className="mt-3 rounded-lg border border-mk-border p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                      <Package size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Order Status</p>

                      <p className="mt-0.5 truncate text-[10px] font-extrabold text-mk-ink">{orderStatus}</p>
                    </div>
                  </div>

                  <div className={`mt-3 inline-flex rounded-md border px-2 py-1 text-[8px] font-bold ${getOrderStatusStyle()}`}>{orderStatus}</div>
                </div>

                {/* CANCEL ORDER */}
                {!['Cancelled', 'Delivered', 'Returned', 'Shipped', 'Out for Delivery'].includes(orderStatus) && (
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order.orderId || orderId}`)}
                    className="group mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-mk-primary-deep to-mk-primary text-[10px] font-extrabold text-white shadow-[0_4px_14px_rgba(125,23,28,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:from-mk-primary-deep hover:to-mk-primary-hover hover:shadow-[0_6px_18px_rgba(125,23,28,0.28)] active:translate-y-0"
                  >
                    <Package size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-110" />
                    Cancel Order
                    <ChevronRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                )}

                {/* TOTAL */}
                <div className="mt-4 rounded-xl bg-linear-to-r from-mk-primary-soft to-mk-bg px-3.5 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-mk-muted">Total Amount</span>

                    <span className="text-xl font-extrabold text-mk-primary-hover">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* SUMMARY DETAILS */}
                <div className="mt-4 space-y-2.5 border-t border-mk-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-mk-muted">Items</span>

                    <span className="text-[10px] font-bold text-mk-ink">{totalQuantity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-mk-muted">Subtotal</span>

                    <span className="text-[10px] font-bold text-mk-ink">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-mk-muted">Delivery</span>

                    <span className="text-[10px] font-bold text-mk-success">{Number(order.deliveryCharge || 0) === 0 ? 'FREE' : `₹${Number(order.deliveryCharge).toLocaleString('en-IN')}`}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-mk-muted">Tax</span>

                    <span className="text-[10px] font-bold text-mk-ink">₹{Number(order.tax || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('/orders')}
                    className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-mk-primary-deep to-mk-primary text-xs font-bold text-white shadow-md shadow-mk-primary-deep/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <ShoppingBag size={15} />
                    My Orders
                    <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-mk-border bg-white text-[10px] font-bold text-mk-muted transition-all duration-300 hover:border-mk-border hover:bg-mk-bg hover:text-mk-primary-hover"
                  >
                    <ArrowLeft size={14} />
                    Continue Shopping
                  </button>
                </div>

                {/* SECURITY */}
                <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-mk-border pt-4">
                  <ShieldCheck size={13} className="text-mk-success" />

                  <span className="text-[8px] font-semibold text-mk-muted">Your order information is secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-5">
          <ShieldCheck size={14} className="text-mk-muted" />

          <p className="text-[10px] font-medium text-mk-muted">Thank you for choosing MineKart.</p>
        </div>
      </div>
    </div>
  )
}

import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { CalendarDays, Check, ChevronRight, Clock3, Package, ShieldCheck, ShoppingBag, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'
import MyOrdersShimmer from '../userShimmer/MyOrdersShimmer'
import { useUser } from '../context/userProvider'

export default function MyOrders() {
  const navigate = useNavigate()
  const { user, setShowLogin } = useUser()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const getOrders = async () => {
    try {
      document.title = 'My Orders | MineKart'

      setLoading(true)

      const res = await axiosInstance.get('/order')

      if (res.data.success) {
        setOrders(res.data.data || [])
      }
    } catch (error) {
      console.log('Get Orders Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    getOrders()
  }, [user])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatPaymentMethod = (method) => {
    if (method === 'COD') return 'Cash on Delivery'

    if (method === 'ONLINE_ON_DELIVERY') {
      return 'Online on Delivery'
    }

    if (method === 'RAZORPAY') {
      return 'Razorpay'
    }

    return method || 'Payment'
  }

  const isDisabledOrder = (status) => {
    return ['Cancelled', 'Returned'].includes(status)
  }

  const getPaymentStatusClass = (status) => {
    const normalizedStatus = String(status || 'Pending')
      .trim()
      .toLowerCase()

    if (normalizedStatus === 'paid') {
      return 'border-mk-success-soft bg-mk-success-soft text-mk-success'
    }

    if (['failed', 'cancelled'].includes(normalizedStatus)) {
      return 'border-mk-danger-soft bg-mk-danger-soft text-mk-danger'
    }

    if (['refunded', 'partially refunded'].includes(normalizedStatus)) {
      return 'border-mk-border-admin bg-mk-info-soft text-mk-info'
    }

    if (['processing', 'initiated'].includes(normalizedStatus)) {
      return 'border-mk-disabled-bg bg-mk-bg-admin text-mk-info'
    }

    return 'border-mk-accent bg-mk-warning-soft text-mk-warning'
  }

  const getReturnStatusClass = (status) => {
    const normalized = String(status || '').toLowerCase()

    if (['refunded', 'approved', 'item received'].includes(normalized)) {
      return 'border-mk-success-soft bg-mk-success-soft text-mk-success'
    }

    if (['rejected'].includes(normalized)) {
      return 'border-mk-danger-soft bg-mk-danger-soft text-mk-danger'
    }

    if (['requested', 'pickup scheduled', 'refund processing'].includes(normalized)) {
      return 'border-mk-accent bg-mk-warning-soft text-mk-warning'
    }

    return 'border-mk-border bg-mk-bg text-mk-muted'
  }

  const getReturnStatus = (order) => {
    return order.returnStatus || 'Not Requested'
  }

  const getOrderStatusClass = (status) => {
    if (status === 'Delivered') {
      return 'border-mk-success-soft bg-mk-success-soft text-mk-success'
    }

    if (status === 'Cancelled') {
      return 'border-mk-border bg-mk-bg-admin text-mk-muted'
    }

    if (status === 'Returned') {
      return 'border-mk-accent bg-mk-warning-soft text-mk-warning'
    }

    return 'border-mk-border bg-mk-bg text-mk-muted'
  }

  const getOrderStatusIcon = (status) => {
    if (status === 'Delivered') {
      return <Check size={12} strokeWidth={3} />
    }

    if (status === 'Cancelled') {
      return <XCircle size={12} strokeWidth={2.2} />
    }

    if (status === 'Returned') {
      return <Package size={12} />
    }

    return <Clock3 size={12} />
  }

  const getProgressWidth = (status) => {
    if (status === 'Pending') return 'w-0'
    if (status === 'Confirmed') return 'w-1/4'
    if (status === 'Processing') return 'w-2/4'
    if (status === 'Shipped') return 'w-3/4'
    if (status === 'Out for Delivery') return 'w-[90%]'
    if (status === 'Delivered') return 'w-full'

    return 'w-0'
  }

  // ! Loading
  if (loading) {
    return <MyOrdersShimmer />
  }

  const items = [
    {
      title: 'orders',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-5">
        {/* PAGE HEADER */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-mk-border bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <ShoppingBag size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-mk-ink sm:text-sm">My Orders</h1>

              <p className="mt-0.5 truncate text-[9px] text-mk-muted sm:text-[10px]">Track and manage your MineKart orders</p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-mk-border bg-mk-bg px-2 sm:px-2.5">
            <Package size={12} className="text-mk-primary-hover" />

            <span className="text-[8px] font-bold text-mk-muted sm:text-[9px]">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </div>

        {/* EMPTY STATE */}
        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          !user ? (
            <div className="overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
              <div className="flex min-h-105 flex-col items-center justify-center px-5 py-16 text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-mk-primary-soft text-mk-primary-hover">
                  <div className="absolute inset-0 rounded-2xl border border-mk-border" />

                  <ShieldCheck size={34} strokeWidth={1.5} />
                </div>

                <span className="mt-5 rounded-full bg-mk-bg px-3 py-1 text-[8px] font-extrabold uppercase tracking-wider text-mk-muted">My Orders</span>

                <h2 className="mt-3 text-xl font-extrabold text-mk-ink">Login Required</h2>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-mk-muted sm:text-sm sm:leading-6">Please login to view your orders and track your purchases on MineKart.</p>

                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-5 py-3 text-xs font-bold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.24)] sm:text-sm"
                >
                  Login to View Orders
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-mk-border bg-white shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
              <div className="flex min-h-105 flex-col items-center justify-center px-5 py-16 text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-mk-primary-soft text-mk-primary-hover">
                  <div className="absolute inset-0 rounded-2xl border border-mk-border" />

                  <ShoppingBag size={34} strokeWidth={1.5} />
                </div>

                <span className="mt-5 rounded-full bg-mk-bg px-3 py-1 text-[8px] font-extrabold uppercase tracking-wider text-mk-muted">Order History</span>

                <h2 className="mt-3 text-xl font-extrabold text-mk-ink">No Orders Yet</h2>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-mk-muted sm:text-sm sm:leading-6">You haven't placed any orders yet. Explore MineKart and your purchases will appear here.</p>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary px-5 py-3 text-xs font-bold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.24)] sm:text-sm"
                >
                  Start Shopping
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {orders.map((order) => {
              const orderStatus = order.orderStatus || 'Pending'
              const disabledOrder = isDisabledOrder(orderStatus)
              const isCancelled = orderStatus === 'Cancelled'
              const isReturned = orderStatus === 'Returned'

              return (
                <div
                  key={order._id}
                  className={`group overflow-hidden rounded-xl border transition-all duration-300 ${
                    isCancelled
                      ? 'border-mk-border-admin bg-mk-bg-admin opacity-90 shadow-[0_3px_14px_rgba(73,54,49,0.035)]'
                      : isReturned
                        ? 'border-mk-accent bg-mk-card shadow-[0_4px_18px_rgba(73,54,49,0.05)]'
                        : 'border-mk-border bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)] hover:-translate-y-0.5 hover:border-mk-border hover:shadow-[0_12px_30px_rgba(73,54,49,0.10)]'
                  }`}
                >
                  {/* ORDER HEADER */}
                  <div
                    className={`border-b px-4 py-3.5 sm:px-5 ${
                      isCancelled ? 'border-mk-border-admin bg-linear-to-r from-mk-bg-admin to-mk-bg' : isReturned ? 'border-mk-border bg-linear-to-r from-mk-card to-mk-warning-soft' : 'border-mk-border bg-linear-to-r from-mk-card to-mk-bg'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isCancelled ? 'bg-white text-mk-muted shadow-sm' : isReturned ? 'bg-mk-primary-soft text-mk-warning' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>
                          {isCancelled ? <XCircle size={15} /> : <Package size={15} />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Order ID</p>

                          <p className={`mt-0.5 truncate text-[11px] font-extrabold sm:text-xs ${isCancelled ? 'text-mk-muted-admin' : 'text-mk-ink'}`}>#{order.orderId}</p>
                        </div>
                      </div>

                      <div className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 ${isCancelled ? 'bg-white/80 text-mk-subtle' : 'bg-white text-mk-muted'}`}>
                        <CalendarDays size={11} />

                        <span className="text-[8px] font-bold sm:text-[9px]">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ORDER STATUS BAR */}
                  <div className={`border-b px-4 py-3 sm:px-5 ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : isReturned ? 'border-mk-border bg-mk-card' : 'border-mk-surface bg-white'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${getOrderStatusClass(orderStatus)}`}>{getOrderStatusIcon(orderStatus)}</div>

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-wider text-mk-muted">Current Status</p>

                          <p className={`mt-0.5 text-[10px] font-extrabold ${isCancelled ? 'text-mk-muted' : 'text-mk-ink'}`}>{orderStatus}</p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[8px] font-bold ${getOrderStatusClass(orderStatus)}`}>
                        {getOrderStatusIcon(orderStatus)}
                        {orderStatus}
                      </span>
                    </div>

                    {isCancelled && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-mk-border-admin bg-white/70 px-3 py-2">
                        <XCircle size={13} className="shrink-0 text-mk-muted" />

                        <p className="text-[8px] font-semibold text-mk-disabled sm:text-[9px]">This order has been cancelled and is no longer active.</p>
                      </div>
                    )}

                    {isReturned && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-mk-accent bg-mk-warning-soft px-3 py-2">
                        <Package size={13} className="shrink-0 text-mk-warning" />

                        <p className="text-[8px] font-semibold text-mk-warning sm:text-[9px]">This order has been returned.</p>
                      </div>
                    )}

                    {!disabledOrder && (
                      <div className="mt-4">
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-mk-disabled-bg">
                          <div className={`h-full rounded-full bg-linear-to-r from-mk-primary-deep to-mk-primary transition-all duration-700 ${getProgressWidth(orderStatus)}`} />
                        </div>

                        <div className="mt-1.5 flex justify-between text-[7px] font-bold text-mk-muted">
                          <span>Placed</span>
                          <span>Confirmed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RETURN & REFUND STATUS */}
                  {order.returnStatus && order.returnStatus !== 'Not Requested' && (
                    <div className="border-b border-mk-border bg-mk-card px-4 py-3 sm:px-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-mk-border bg-white text-mk-primary-hover">
                          <ShieldCheck size={17} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-extrabold text-mk-ink">Return & Refund</p>

                          <span className={`mt-1.5 inline-flex rounded-md border px-2 py-1 text-[9px] font-bold ${getReturnStatusClass(getReturnStatus(order))}`}>{getReturnStatus(order)}</span>

                          {order.returnReason && (
                            <p className="mt-2 text-[10px] leading-4 text-mk-muted">
                              <span className="font-bold">Reason:</span> {order.returnReason}
                            </p>
                          )}

                          {order.returnRejectionReason && (
                            <p className="mt-1 text-[10px] leading-4 text-mk-danger">
                              <span className="font-bold">Rejection reason:</span> {order.returnRejectionReason}
                            </p>
                          )}

                          {order.refundAmount != null && (
                            <p className="mt-1 text-[10px] text-mk-muted">
                              <span className="font-bold">Refund amount:</span> ₹{Number(order.refundAmount).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ORDER ITEMS */}
                  <div className={`px-4 py-4 sm:px-5 ${isCancelled ? 'bg-mk-bg-admin' : 'bg-white'}`}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={14} className={isCancelled ? 'text-mk-muted' : 'text-mk-primary-hover'} />

                        <span className={`text-[9px] font-extrabold uppercase tracking-wider ${isCancelled ? 'text-mk-disabled' : 'text-mk-muted'}`}>Order Items</span>
                      </div>

                      <span className={`rounded-md px-2 py-1 text-[8px] font-bold ${isCancelled ? 'bg-white text-mk-subtle' : 'bg-mk-bg text-mk-muted'}`}>
                        {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-1">
                      <div className="space-y-2.5">
                        {order.items?.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all duration-200 ${
                              isCancelled ? 'border-mk-border-admin bg-white/70' : isReturned ? 'border-mk-accent bg-mk-card' : 'border-mk-border bg-mk-bg hover:border-mk-border hover:bg-mk-primary-soft'
                            }`}
                          >
                            <div
                              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border sm:h-17 sm:w-17 ${
                                isCancelled ? 'border-mk-border-admin bg-mk-bg-admin grayscale' : isReturned ? 'border-mk-accent bg-mk-warning-soft' : 'border-mk-border bg-white'
                              }`}
                            >
                              {item.image ? (
                                <img src={getImageUrl(item.image)} alt={item.productName} className={`h-full w-full object-contain p-1.5 ${isCancelled ? 'grayscale opacity-65' : ''}`} />
                              ) : (
                                <Package size={23} strokeWidth={1.5} className="text-mk-muted" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={`line-clamp-2 text-[11px] font-bold leading-4 sm:text-[12px] ${isCancelled ? 'text-mk-muted' : 'text-mk-ink'}`}>{item.productName}</p>

                              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className={`text-[8px] font-semibold sm:text-[9px] ${isCancelled ? 'text-mk-subtle' : 'text-mk-muted'}`}>Qty: {item.quantity}</span>

                                {item.size && (
                                  <>
                                    <span className="h-1 w-1 rounded-full bg-mk-border-admin" />

                                    <span className={`text-[8px] font-semibold sm:text-[9px] ${isCancelled ? 'text-mk-subtle' : 'text-mk-muted'}`}>Size: {item.size}</span>
                                  </>
                                )}
                              </div>

                              <p className={`mt-1 text-[8px] ${isCancelled ? 'text-mk-subtle' : 'text-mk-muted'}`}>₹{Number(item.discountPrice || item.price || 0).toLocaleString('en-IN')} each</p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className={`text-[10px] font-extrabold sm:text-xs ${isCancelled ? 'text-mk-disabled' : 'text-mk-primary-hover'}`}>₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className={`border-t px-4 py-4 sm:px-5 ${isCancelled ? 'border-mk-border-admin bg-mk-bg-admin' : 'border-mk-border bg-mk-bg'}`}>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      <div className={`rounded-lg border px-3 py-2.5 ${isCancelled ? 'border-mk-border-admin bg-white/70' : 'border-mk-border bg-white'}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${isCancelled ? 'bg-mk-muted' : 'bg-mk-primary-hover'}`} />

                          <p className="text-[7px] font-bold uppercase tracking-wider text-mk-muted">Total</p>
                        </div>

                        <p className={`mt-1.5 text-sm font-extrabold ${isCancelled ? 'text-mk-muted' : 'text-mk-ink'}`}>₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </div>

                      <div className={`rounded-lg border px-3 py-2.5 ${isCancelled ? 'border-mk-border-admin bg-white/70' : 'border-mk-border bg-white'}`}>
                        <p className="text-[7px] font-bold uppercase tracking-wider text-mk-muted">Payment Method</p>

                        <p className={`mt-1.5 truncate text-[9px] font-bold ${isCancelled ? 'text-mk-muted' : 'text-mk-ink'}`}>{formatPaymentMethod(order.paymentMethod)}</p>

                        <span className={`mt-1.5 inline-flex rounded-md border px-1.5 py-0.5 text-[7px] font-bold ${getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</span>
                      </div>

                      <div className={`rounded-lg border px-3 py-2.5 ${isCancelled ? 'border-mk-border-admin bg-white/70' : 'border-mk-border bg-white'}`}>
                        <p className="text-[7px] font-bold uppercase tracking-wider text-mk-muted">Items</p>

                        <p className={`mt-1.5 text-sm font-extrabold ${isCancelled ? 'text-mk-muted' : 'text-mk-ink'}`}>{order.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0}</p>

                        <p className="mt-0.5 text-[7px] text-mk-muted">Total quantity</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className={`group mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[10px] font-extrabold transition-all duration-300 sm:text-[11px] ${
                        disabledOrder
                          ? 'border border-mk-border-admin bg-mk-success-soft text-mk-disabled hover:bg-mk-disabled-bg'
                          : 'bg-linear-to-r from-mk-primary-deep to-mk-primary text-white shadow-[0_5px_14px_rgba(125,23,28,0.14)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(125,23,28,0.22)]'
                      }`}
                    >
                      {isCancelled ? 'View Cancelled Order' : isReturned ? 'View Returned Order' : 'View Order Details'}

                      <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* FOOTER */}
        {orders.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-5">
            <ShieldCheck size={14} className="text-mk-muted" />

            <p className="text-[10px] font-medium text-mk-muted sm:text-[11px]">Your orders are safely managed by MineKart.</p>
          </div>
        )}
      </div>
    </div>
  )
}

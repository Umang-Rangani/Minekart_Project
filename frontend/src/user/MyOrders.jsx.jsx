import React, { useEffect, useState } from 'react'
import { CalendarDays, Check, ChevronRight, Clock3, Package, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

export default function MyOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const getOrders = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/order')

      if (res.data.success) {
        setOrders(res.data.data || [])
      }

      document.title = 'My Orders | MineKart'
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

    getOrders()
  }, [])

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

    return method || 'Payment'
  }

  const getPaymentStatusClass = (status) => {
    if (status === 'Paid') {
      return 'border-[#D5E8DA] bg-[#F0F8F3] text-[#34704F]'
    }

    if (status === 'Failed' || status === 'Cancelled') {
      return 'border-[#E7D2CF] bg-[#FFF5F3] text-[#A44A3F]'
    }

    return 'border-[#EBD7B7] bg-[#FFF9ED] text-[#A05A16]'
  }

  const getOrderStatusClass = (status) => {
    if (status === 'Delivered') {
      return 'border-[#D5E8DA] bg-[#F0F8F3] text-[#34704F]'
    }

    if (status === 'Cancelled' || status === 'Returned') {
      return 'border-[#E7D2CF] bg-[#FFF5F3] text-[#A44A3F]'
    }

    return 'border-[#E8DDD4] bg-[#FBF7F2] text-[#67544D]'
  }

  const getOrderStatusIcon = (status) => {
    if (status === 'Delivered') {
      return <Check size={12} strokeWidth={3} />
    }

    if (status === 'Cancelled' || status === 'Returned') {
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
    return (
      <div className="min-h-screen bg-[#FBF7F2]">
        <div className="mx-auto w-full pt-4 sm:pt-5">
          {/* HEADER SKELETON */}
          <div className="mb-5 h-16 animate-pulse rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-[#E8DDD4] sm:h-10 sm:w-10" />

                <div>
                  <div className="h-3 w-24 rounded bg-[#E8DDD4]" />

                  <div className="mt-1.5 h-2 w-40 rounded bg-[#F0E8E2]" />
                </div>
              </div>

              <div className="h-8 w-20 rounded-lg bg-[#F0E8E2]" />
            </div>
          </div>

          {/* CARD SKELETON */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse overflow-hidden rounded-xl border border-[#E8DDD4] bg-white">
                <div className="border-b border-[#E8DDD4] bg-[#FBF7F2] p-4">
                  <div className="h-4 w-36 rounded bg-[#E8DDD4]" />

                  <div className="mt-2 h-2.5 w-24 rounded bg-[#F0E8E2]" />
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex gap-3">
                    <div className="h-18 w-16 rounded-lg bg-[#F0E8E2]" />

                    <div className="flex-1">
                      <div className="h-3 w-3/4 rounded bg-[#E8DDD4]" />

                      <div className="mt-2 h-2.5 w-1/2 rounded bg-[#F0E8E2]" />
                    </div>
                  </div>

                  <div className="h-20 rounded-xl bg-[#F7EEE7]" />

                  <div className="h-10 rounded-lg bg-[#E8DDD4]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const items = [
    {
      title: 'orders',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pb-10 pt-4 sm:pt-5">
        {/* PAGE HEADER */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <ShoppingBag size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">My Orders</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Track and manage your MineKart orders</p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2 sm:px-2.5">
            <Package size={12} className="text-[#8E181F]" />

            <span className="text-[8px] font-bold text-[#67544D] sm:text-[9px]">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
            <div className="flex min-h-105 flex-col items-center justify-center px-5 py-16 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
                <div className="absolute inset-0 rounded-2xl border border-[#E8DDD4]" />

                <ShoppingBag size={34} strokeWidth={1.5} />
              </div>

              <span className="mt-5 rounded-full bg-[#FBF7F2] px-3 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#9A857B]">Order History</span>

              <h2 className="mt-3 text-xl font-extrabold text-[#351C18]">No Orders Yet</h2>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#806C63] sm:text-sm sm:leading-6">You haven't placed any orders yet. Explore MineKart and your purchases will appear here.</p>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-xs font-bold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.24)] sm:text-sm"
              >
                Start Shopping
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {orders.map((order) => {
              const orderStatus = order.orderStatus || 'Pending'

              return (
                <div
                  key={order._id}
                  className="group overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D5C1B7] hover:shadow-[0_12px_30px_rgba(73,54,49,0.10)]"
                >
                  {/* ORDER HEADER */}
                  <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#FBF7F2] px-4 py-3.5 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                          <Package size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Order ID</p>

                          <p className="mt-0.5 truncate text-[11px] font-extrabold text-[#351C18] sm:text-xs">#{order.orderId}</p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 text-[#806C63]">
                        <CalendarDays size={11} />

                        <span className="text-[8px] font-bold sm:text-[9px]">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ORDER STATUS BAR */}
                  <div className="border-b border-[#EEE5DF] px-4 py-3 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${getOrderStatusClass(orderStatus)}`}>{getOrderStatusIcon(orderStatus)}</div>

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Current Status</p>

                          <p className="mt-0.5 text-[10px] font-extrabold text-[#351C18]">{orderStatus}</p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[8px] font-bold ${getOrderStatusClass(orderStatus)}`}>
                        {getOrderStatusIcon(orderStatus)}
                        {orderStatus}
                      </span>
                    </div>

                    {/* PROGRESS */}
                    {!['Cancelled', 'Returned'].includes(orderStatus) && (
                      <div className="mt-4">
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-[#EDE5E0]">
                          <div className={`h-full rounded-full bg-linear-to-r from-[#7D171C] to-[#A51D26] transition-all duration-700 ${getProgressWidth(orderStatus)}`} />
                        </div>

                        <div className="mt-1.5 flex justify-between text-[7px] font-bold text-[#9A857B]">
                          <span>Placed</span>
                          <span>Confirmed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="px-4 py-4 sm:px-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={14} className="text-[#8E181F]" />

                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#67544D]">Order Items</span>
                      </div>

                      <span className="rounded-md bg-[#FBF7F2] px-2 py-1 text-[8px] font-bold text-[#9A857B]">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-1">
                      <div className="space-y-2.5">
                        {order.items?.map((item, index) => (
                          <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-2.5 transition-all duration-200 hover:border-[#D8C5BA] hover:bg-[#F8F0EA]">
                            {/* IMAGE */}
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E2D5CC] bg-white sm:h-17 sm:w-17">
                              {item.image ? (
                                <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain p-1.5 transition-transform duration-300 hover:scale-105" />
                              ) : (
                                <Package size={23} strokeWidth={1.5} className="text-[#B7A49B]" />
                              )}
                            </div>

                            {/* INFO */}
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-[11px] font-bold leading-4 text-[#351C18] sm:text-[12px]">{item.productName}</p>

                              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="text-[8px] font-semibold text-[#806C63] sm:text-[9px]">Qty: {item.quantity}</span>

                                {item.size && (
                                  <>
                                    <span className="h-1 w-1 rounded-full bg-[#CDBDB4]" />

                                    <span className="text-[8px] font-semibold text-[#806C63] sm:text-[9px]">Size: {item.size}</span>
                                  </>
                                )}
                              </div>

                              <p className="mt-1 text-[8px] text-[#9A857B]">₹{Number(item.discountPrice || item.price || 0).toLocaleString('en-IN')} each</p>
                            </div>

                            {/* PRICE */}
                            <div className="shrink-0 text-right">
                              <p className="text-[10px] font-extrabold text-[#8E181F] sm:text-xs">₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className="border-t border-[#E8DDD4] bg-[#FBF7F2] px-4 py-4 sm:px-5">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {/* TOTAL */}
                      <div className="rounded-lg border border-[#E8DDD4] bg-white px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#8E181F]" />

                          <p className="text-[7px] font-bold uppercase tracking-wider text-[#9A857B]">Total</p>
                        </div>

                        <p className="mt-1.5 text-sm font-extrabold text-[#351C18]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </div>

                      {/* PAYMENT */}
                      <div className="rounded-lg border border-[#E8DDD4] bg-white px-3 py-2.5">
                        <p className="text-[7px] font-bold uppercase tracking-wider text-[#9A857B]">Payment</p>

                        <p className="mt-1.5 truncate text-[9px] font-bold text-[#351C18]">{formatPaymentMethod(order.paymentMethod)}</p>

                        <span className={`mt-1.5 inline-flex rounded-md border px-1.5 py-0.5 text-[7px] font-bold ${getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</span>
                      </div>

                      {/* ITEMS */}
                      <div className="rounded-lg border border-[#E8DDD4] bg-white px-3 py-2.5">
                        <p className="text-[7px] font-bold uppercase tracking-wider text-[#9A857B]">Items</p>

                        <p className="mt-1.5 text-sm font-extrabold text-[#351C18]">{order.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0}</p>

                        <p className="mt-0.5 text-[7px] text-[#9A857B]">Total quantity</p>
                      </div>
                    </div>

                    {/* VIEW DETAILS */}
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                      className="group mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-3 text-[10px] font-extrabold text-white shadow-[0_5px_14px_rgba(125,23,28,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(125,23,28,0.22)] sm:text-[11px]"
                    >
                      View Order Details
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
            <ShieldCheck size={14} className="text-[#9A857B]" />

            <p className="text-[10px] font-medium text-[#9A857B] sm:text-[11px]">Your orders are safely managed by MineKart.</p>
          </div>
        )}
      </div>
    </div>
  )
}

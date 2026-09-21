import React, { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, MapPin, Package, ShoppingBag, Truck, Check, CircleCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

// ! Order Tracking logic
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

  // ! Order return
  const [showReturnBox, setShowReturnBox] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returning, setReturning] = useState(false)

  const getOrderDetails = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/order/${id}`)

      if (res.data.success) {
        setOrder(res.data.data)
      }
    } catch (error) {
      console.log('Get Order Details Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrderDetails()
  }, [id])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const currentStatusIndex = orderStatuses.findIndex((item) => item.status === order?.orderStatus)

  const isCancelled = order?.orderStatus === 'Cancelled'
  const isReturned = order?.orderStatus === 'Returned'
  const isCOD = order?.paymentMethod === 'COD'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F2]">
        <div className="mx-auto animate-pulse">
          <div className="h-7 w-48 rounded-lg bg-[#E8DDD4]" />

          <div className="mt-6 h-28 rounded-2xl bg-[#FFFDFC]" />

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
            <div className="h-125 rounded-2xl bg-[#FFFDFC]" />
            <div className="h-125 rounded-2xl bg-[#FFFDFC]" />
            <div className="h-100 rounded-2xl bg-[#FFFDFC]" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBF7F2] py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-8 text-center shadow-[0_8px_30px_rgba(73,54,49,0.07)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <Package size={30} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#351C18]">Order Not Found</h1>

          <p className="mt-2 text-sm text-[#806C63]">We could not find this order.</p>

          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
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
    { title: 'Detail', link: null },
  ]

  return (
    <div className="min-h-screen ">
      <BreadCrumb items={items} />

      <div className="mx-auto pt-5 ">
        {/* PAGE HEADER */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF5EF] to-[#F7EEE7] shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                  <h1 className="truncate text-xl font-extrabold tracking-tight text-[#351C18] sm:text-2xl">Order Details</h1>
                </div>

                <p className="ml-3 mt-0.5 truncate text-xs text-[#806C63]">Order #{order._id}</p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3.5 py-2 sm:flex">
              <span className={`h-2.5 w-2.5 rounded-full ${isCancelled ? 'bg-[#A51D26]' : isReturned ? 'bg-[#B87935]' : order.orderStatus === 'Delivered' ? 'bg-[#3E8B62]' : 'bg-[#D4A373]'}`} />

              <span className="text-xs font-bold text-[#67544D]">{order.orderStatus}</span>
            </div>
          </div>
        </div>

        {/* STATUS CARD */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Order Status</p>

              <div className="mt-2 flex items-center gap-2.5">
                {isCancelled ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FCEBEC] text-[#A51D26]">
                    <Package size={19} />
                  </div>
                ) : isReturned ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF4DD] text-[#B87935]">
                    <Package size={19} />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF6EF] text-[#3E8B62]">
                    <CheckCircle2 size={19} />
                  </div>
                )}

                <p className="text-lg font-extrabold text-[#351C18]">{order.orderStatus}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Ordered On</p>

              <p className="mt-2 text-sm font-bold text-[#67544D]">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          {/* ORDER TRACKING */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-5 shadow-[0_5px_20px_rgba(73,54,49,0.06)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-[#351C18]">Order Tracking</h2>

                <p className="mt-1 text-xs leading-5 text-[#806C63]">Track your order status and delivery progress.</p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                <Truck size={19} />
              </div>
            </div>

            <div className="mt-7">
              {orderStatuses.map((item, index) => {
                const Icon = item.icon

                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isLast = index === orderStatuses.length - 1

                return (
                  <div key={item.status} className="relative flex gap-3.5">
                    {!isLast && <div className={`absolute left-5 top-10 h-[calc(100%-10px)] w-0.5 ${index < currentStatusIndex ? 'bg-[#8E181F]' : 'bg-[#E8DDD4]'}`} />}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${isCompleted ? 'border-[#8E181F] bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white' : 'border-[#E2D5CC] bg-[#FFFDFC] text-[#B7A49B]'} ${isCurrent ? 'ring-4 ring-[#F7EEE7]' : ''}`}
                    >
                      <Icon size={17} strokeWidth={2.3} />
                    </div>

                    <div className={`${isLast ? 'pb-0' : 'pb-7'} min-w-0`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm font-extrabold ${isCompleted ? 'text-[#351C18]' : 'text-[#B7A49B]'}`}>{item.label}</h3>

                        {isCurrent && <span className="rounded-md bg-[#F7EEE7] px-2 py-0.5 text-[9px] font-bold text-[#8E181F]">Current</span>}
                      </div>

                      <p className={`mt-1 text-[11px] leading-5 ${isCompleted ? 'text-[#806C63]' : 'text-[#B7A49B]'}`}>{item.description}</p>
                    </div>
                  </div>
                )
              })}

              {/* CANCELLED */}
              {isCancelled && (
                <div className="mt-3 rounded-xl border border-[#F0C8CB] bg-[#FCEBEC] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A51D26]">
                      <Package size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#A51D26]">Order Cancelled</h3>

                      <p className="mt-1 text-xs leading-5 text-[#A51D26]">This order has been cancelled.</p>

                      {order.cancellationReason && <p className="mt-2 text-xs font-semibold text-[#8E181F]">Reason: {order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* RETURNED */}
              {isReturned && (
                <div className="mt-3 rounded-xl border border-[#EBD7B7] bg-[#FFF9ED] p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#B87935]">
                      <Package size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#A05A16]">Order Returned</h3>

                      <p className="mt-1 text-xs leading-5 text-[#A05A16]">Your return request has been submitted successfully.</p>

                      {order.cancellationReason && <p className="mt-2 text-xs font-semibold text-[#79521F]">Reason: {order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIN DETAILS */}
          <div className="min-w-0 space-y-5">
            {/* ORDERED ITEMS */}
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={19} className="text-[#8E181F]" />

                  <h2 className="text-sm font-extrabold text-[#351C18]">Ordered Items</h2>
                </div>

                <span className="rounded-lg bg-[#FFFDFC] px-2.5 py-1 text-[10px] font-bold text-[#806C63] shadow-sm">{order.items?.length || 0} Items</span>
              </div>

              <div className="max-h-97 overflow-y-auto [scrollbar-color:#CDBDB4_transparent] scrollbar-thin">
                <div className="divide-y divide-[#E8DDD4]">
                  {order.items?.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="flex gap-4 p-4 transition-colors duration-200 hover:bg-[#FBF7F2] sm:p-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2D5CC] bg-[#FBF7F2]">
                        {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain p-1" /> : <Package size={28} className="text-[#B7A49B]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#351C18]">{item.productName}</h3>

                        <p className="mt-1 text-xs text-[#806C63]">
                          Qty: {item.quantity}
                          {item.size && <> • Size: {item.size}</>}
                        </p>

                        <p className="mt-2 text-sm font-extrabold text-[#8E181F]">₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DELIVERY ADDRESS */}
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
              <div className="flex items-center gap-2 border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-5 py-4">
                <MapPin size={19} className="text-[#8E181F]" />

                <h2 className="text-sm font-extrabold text-[#351C18]">Delivery Address</h2>
              </div>

              <div className="p-5">
                <p className="text-sm font-extrabold text-[#351C18]">{order.shippingAddress?.fullName}</p>

                <p className="mt-2 text-sm leading-6 text-[#806C63]">
                  {order.shippingAddress?.addressLine}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>

                {order.shippingAddress?.landmark && <p className="mt-2 text-xs text-[#806C63]">Landmark: {order.shippingAddress.landmark}</p>}

                <p className="mt-2 text-sm font-semibold text-[#351C18]">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
              <div className="flex items-center gap-2 border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-5 py-4">
                <Truck size={19} className="text-[#8E181F]" />

                <h2 className="text-sm font-extrabold text-[#351C18]">Payment Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Payment Method</p>

                  <p className="mt-1 text-sm font-bold text-[#351C18]">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Payment Status</p>

                  <p className={`mt-1 text-sm font-bold ${order.paymentStatus === 'Paid' ? 'text-[#3E8B62]' : order.paymentStatus === 'Failed' ? 'text-[#A51D26]' : 'text-[#B87935]'}`}>{order.paymentStatus || 'Pending'}</p>
                </div>
              </div>

              <div className="border-t border-[#E8DDD4] px-5 py-4">
                <div className="rounded-xl bg-[#F7EEE7] px-4 py-3">
                  <p className="text-xs font-semibold leading-5 text-[#67544D]">{isCOD ? 'Payment will be collected in cash when your order is delivered.' : 'Payment will be collected online when your order is delivered.'}</p>
                </div>
              </div>
            </div>

            {/* RETURN ORDER */}
            {order.orderStatus === 'Delivered' && (
              <div className="overflow-hidden rounded-2xl border border-[#EBD7B7] bg-[#FFFDFC] shadow-[0_5px_20px_rgba(73,54,49,0.05)]">
                <div className="flex items-center justify-between gap-4 border-b border-[#F1E3CB] px-5 py-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#351C18]">Return Order</h2>

                    <p className="mt-1 text-xs text-[#806C63]">Need to return this order? Submit a return request.</p>
                  </div>

                  {!showReturnBox && (
                    <button type="button" onClick={() => setShowReturnBox(true)} className="shrink-0 rounded-xl bg-[#FFF4DD] px-4 py-2.5 text-xs font-bold text-[#A05A16] transition hover:bg-[#FFECC4]">
                      Return Order
                    </button>
                  )}
                </div>

                {showReturnBox && (
                  <div className="p-5">
                    <label className="text-xs font-bold text-[#67544D]">Return Reason</label>

                    <textarea
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Why do you want to return this order?"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] px-3 py-3 text-sm text-[#351C18] outline-none placeholder:text-[#A89890] focus:border-[#B87935] focus:bg-white"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReturnBox(false)
                          setReturnReason('')
                        }}
                        disabled={returning}
                        className="rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#67544D] transition hover:bg-[#F7EEE7] disabled:opacity-50"
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
          <div>
            <div className="sticky top-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_6px_24px_rgba(73,54,49,0.07)]">
              <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#351C18] to-[#5A2A25] px-5 py-4">
                <h2 className="text-sm font-extrabold text-white">Order Summary</h2>

                <p className="mt-1 text-[10px] text-white/60">Payment & order total</p>
              </div>

              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#806C63]">Subtotal</span>

                    <span className="font-semibold text-[#351C18]">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#806C63]">Delivery</span>

                    <span className="font-semibold text-[#3E8B62]">{order.deliveryCharge === 0 ? 'FREE' : `₹${Number(order.deliveryCharge || 0).toLocaleString('en-IN')}`}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#806C63]">Tax</span>

                    <span className="font-semibold text-[#351C18]">₹{Number(order.tax || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="my-5 border-t border-[#E8DDD4]" />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#67544D]">Total Amount</span>

                  <span className="text-xl font-extrabold text-[#8E181F]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="mt-5 rounded-xl bg-[#F7EEE7] p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-[#8E181F]" />

                    <p className="text-xs font-bold text-[#8E181F]">Order Status: {order.orderStatus}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-3 text-sm font-bold text-[#67544D] transition-all duration-300 hover:border-[#8E181F] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                >
                  <ArrowLeft size={17} />
                  Back to My Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex items-center justify-center gap-2 py-5">
          <CheckCircle2 size={14} className="text-[#9A857B]" />
          <p className="text-[11px] font-medium text-[#9A857B]">Thank you for shopping with MineKart.</p>
        </div>
      </div>
    </div>
  )
}

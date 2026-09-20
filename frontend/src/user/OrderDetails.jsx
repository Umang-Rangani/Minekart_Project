import React, { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, MapPin, Package, ShoppingBag, Truck } from 'lucide-react'
import { Check, CircleCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import BreadCrumb from './BreadCrumb'

// !  Order Tracking  logic
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

  // ! order return 1.
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

  // !  Order Tracking  logic
  const currentStatusIndex = orderStatuses.findIndex((item) => item.status === order?.orderStatus)

  const isCancelled = order?.orderStatus === 'Cancelled'
  const isReturned = order?.orderStatus === 'Returned'

  // ! order return 2.
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
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-7 w-48 rounded bg-[#E2E8F0]" />
          <div className="mt-6 h-40 rounded-2xl bg-white" />
          <div className="mt-4 h-64 rounded-2xl bg-white" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
            <Package size={30} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#172033]">Order Not Found</h1>

          <p className="mt-2 text-sm text-[#64748B]">We could not find this order.</p>

          <button type="button" onClick={() => navigate('/orders')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E40AF]">
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  const isCOD = order.paymentMethod === 'COD'

  const items = [
    { title: `Orders`, link: "/orders" },
    { title: `Detail`, link: null },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] ">
      <BreadCrumb items={items} />

      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button type="button" onClick={() => navigate('/orders')} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]">
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-extrabold text-[#172033]">Order Details</h1>

            <p className="mt-1 text-sm text-[#64748B]">Order #{order._id}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Order Status</p>

              <div className="mt-2 flex items-center gap-2">
                {isCancelled ? <Package size={20} className="text-red-600" /> : isReturned ? <Package size={20} className="text-orange-600" /> : <CheckCircle2 size={20} className="text-[#16A34A]" />}

                <p className="text-lg font-extrabold text-[#172033]">{order.orderStatus}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Ordered On</p>

              <p className="mt-2 text-sm font-bold text-[#64748B]">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 grid-cols-4">
          {/* Left */}

          {/* Order Tracking */}
          <div className=" rounded-2xl col-span-1 border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#172033] sm:text-lg">Order Tracking</h2>

                <p className="mt-1 text-xs text-[#64748B]">Track your order status and delivery progress.</p>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8] sm:flex">
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
                  <div key={item.status} className="relative flex gap-4">
                    {/* Timeline line */}
                    {!isLast && <div className={`absolute left-5 top-10 h-[calc(100%-10px)] w-0.5 ${index < currentStatusIndex ? 'bg-[#1D4ED8]' : 'bg-[#E2E8F0]'}`} />}

                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${isCompleted ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white' : 'border-[#E2E8F0] bg-white text-[#94A3B8]'} ${
                        isCurrent ? 'ring-4 ring-[#DBEAFE]' : ''
                      }`}
                    >
                      <Icon size={17} strokeWidth={2.3} />
                    </div>

                    {/* Content */}
                    <div className={`${isLast ? 'pb-0' : 'pb-7'}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm font-extrabold ${isCompleted ? 'text-[#172033]' : 'text-[#94A3B8]'}`}>{item.label}</h3>

                        {isCurrent && <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#1D4ED8]">Current</span>}
                      </div>

                      <p className={`mt-1 text-xs leading-5 ${isCompleted ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{item.description}</p>
                    </div>
                  </div>
                )
              })}

              {isCancelled && (
                <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Package size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-red-700">Order Cancelled</h3>

                      <p className="mt-1 text-xs leading-5 text-red-600">This order has been cancelled.</p>

                      {order.cancellationReason && <p className="mt-2 text-xs font-semibold text-red-700">Reason: {order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}

              {isReturned && (
                <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <Package size={18} />
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-orange-700">Order Returned</h3>

                      <p className="mt-1 text-xs leading-5 text-orange-600">Your return request has been submitted successfully.</p>

                      {order.cancellationReason && <p className="mt-2 text-xs font-semibold text-orange-700">Reason: {order.cancellationReason}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 col-span-2">
            {/* Products */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-5 py-4">
                <ShoppingBag size={19} className="text-[#1D4ED8]" />

                <h2 className="text-sm font-extrabold text-[#172033]">Ordered Items</h2>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {order.items?.map((item, index) => (
                  <div key={`${order._id}-${index}`} className="flex gap-4 p-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
                      {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain" /> : <Package size={28} className="text-[#94A3B8]" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#172033]">{item.productName}</h3>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Qty: {item.quantity}
                        {item.size && <> • Size: {item.size}</>}
                      </p>

                      <p className="mt-2 text-sm font-extrabold text-[#172033]">₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-5 py-4">
                <MapPin size={19} className="text-[#1D4ED8]" />

                <h2 className="text-sm font-extrabold text-[#172033]">Delivery Address</h2>
              </div>

              <div className="p-5">
                <p className="text-sm font-extrabold text-[#172033]">{order.shippingAddress?.fullName}</p>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {order.shippingAddress?.addressLine}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>

                {order.shippingAddress?.landmark && <p className="mt-2 text-xs text-[#64748B]">Landmark: {order.shippingAddress.landmark}</p>}

                <p className="mt-2 text-sm font-semibold text-[#172033]">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment */}
            {/* Payment */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-5 py-4">
                <Truck size={19} className="text-[#1D4ED8]" />

                <h2 className="text-sm font-extrabold text-[#172033]">Payment Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Payment Method</p>

                  <p className="mt-1 text-sm font-bold text-[#172033]">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Payment Status</p>

                  <p className={`mt-1 text-sm font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : order.paymentStatus === 'Failed' ? 'text-red-500' : 'text-[#F59E0B]'}`}>{order.paymentStatus || 'Pending'}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-[#E2E8F0] px-5 py-4">
                <div className="rounded-xl bg-[#EFF6FF] px-4 py-3">
                  <p className="text-xs font-semibold leading-5 text-[#1E40AF]">{isCOD ? 'Payment will be collected in cash when your order is delivered.' : 'Payment will be collected online when your order is delivered.'}</p>
                </div>
              </div>
            </div>

            {/* Return Order */}
            {order.orderStatus === 'Delivered' && (
              <div className="rounded-2xl border border-orange-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#172033]">Return Order</h2>

                    <p className="mt-1 text-xs text-[#64748B]">Need to return this order? Submit a return request.</p>
                  </div>

                  {!showReturnBox && (
                    <button type="button" onClick={() => setShowReturnBox(true)} className="rounded-xl bg-orange-50 px-4 py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-100">
                      Return Order
                    </button>
                  )}
                </div>

                {showReturnBox && (
                  <div className="p-5">
                    <label className="text-xs font-bold text-[#292725]">Return Reason</label>

                    <textarea
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="Why do you want to return this order?"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 py-3 text-sm text-[#292725] outline-none placeholder:text-[#99938B] focus:border-orange-400 focus:bg-white"
                    />

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReturnBox(false)
                          setReturnReason('')
                        }}
                        disabled={returning}
                        className="rounded-xl border border-[#E3DED6] bg-white px-4 py-2.5 text-xs font-bold text-[#6F6A64] transition hover:bg-[#F8F6F2] disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleReturnOrder}
                        disabled={returning || !returnReason.trim()}
                        className="rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {returning ? 'Submitting...' : 'Submit Return Request'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Summary */}
          <div>
            <div className="sticky top-5 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <h2 className="text-sm font-extrabold text-[#172033]">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Subtotal</span>

                  <span className="font-semibold text-[#172033]">₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#64748B]">Delivery</span>

                  <span className="font-semibold text-[#16A34A]">{order.deliveryCharge === 0 ? 'FREE' : `₹${Number(order.deliveryCharge || 0).toLocaleString('en-IN')}`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#64748B]">Tax</span>

                  <span className="font-semibold text-[#172033]">₹{Number(order.tax || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="my-5 border-t border-[#E2E8F0]" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#64748B]">Total Amount</span>

                <span className="text-xl font-extrabold text-[#1D4ED8]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-5 rounded-xl bg-[#EFF6FF] p-4">
                <div className="flex items-center gap-2">
                  <Clock3 size={17} className="text-[#1D4ED8]" />

                  <p className="text-xs font-bold text-[#1D4ED8]">Order Status: {order.orderStatus}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-bold text-[#172033] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
              >
                <ArrowLeft size={17} />
                Back to My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Check, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import BreadCrumb from './BreadCrumb'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const location = useLocation()

  const { orderId, order, payment } = location.state || {}

  // If user directly opens /order-success
  if (!orderId || !order) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] ">
        <div className="mx-auto  rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
            <Package size={30} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#172033]">Order Not Found</h1>

          <p className="mt-2 text-sm text-[#64748B]">We could not find your order information.</p>

          <button type="button" onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E40AF]">
            Continue Shopping
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    )
  }

  const isCOD = payment?.paymentMethod === 'COD'
  const isOnlineOnDelivery = payment?.paymentMethod === 'ONLINE_ON_DELIVERY'

  // ! BreadCrumb
  const items = [
    { title: `cart`, link: '/cart' },
    { title: `checkout`, link: '/checkout' },
    { title: `success`, link: null },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] ">
      <BreadCrumb items={items} />
      <div className="mx-auto ">
        {/* SUCCESS CARD */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          {/* SUCCESS ICON */}
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A]">
              <Check size={42} strokeWidth={2.5} />
            </div>
          </div>

          {/* HEADING */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#172033] sm:text-3xl">Order Placed Successfully!</h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">Thank you for shopping with MineKart. Your order has been successfully placed.</p>
          </div>

          {/* ORDER ID */}
          <div className="mt-7 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Order ID</p>

            <p className="mt-1 break-all text-sm font-extrabold text-[#172033]">#{orderId}</p>
          </div>

          {/* ORDER DETAILS */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* PAYMENT */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Payment Method</p>

              <p className="mt-1 text-sm font-bold text-[#172033]">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>

              <p className="mt-1 text-xs font-semibold text-[#F59E0B]">{payment?.paymentStatus || 'Pending'}</p>
            </div>

            {/* ORDER STATUS */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Order Status</p>

              <p className="mt-1 text-sm font-bold text-[#172033]">{order.orderStatus || 'Pending'}</p>

              <p className="mt-1 text-xs font-semibold text-[#64748B]">We will process your order shortly.</p>
            </div>
          </div>

          {/* TOTAL */}
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-4">
            <span className="text-sm font-bold text-[#64748B]">Total Amount</span>

            <span className="text-xl font-extrabold text-[#1D4ED8]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
          </div>

          {/* COD MESSAGE */}
          {isCOD && (
            <div className="mt-4 rounded-xl bg-[#FFFBEB] px-4 py-3">
              <p className="text-xs font-semibold leading-5 text-[#92400E]">Please keep the exact amount ready when your order is delivered.</p>
            </div>
          )}

          {isOnlineOnDelivery && (
            <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3">
              <p className="text-xs font-semibold leading-5 text-[#1E40AF]">Your payment will be collected online when your order is delivered.</p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => navigate('/')} className="flex items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E40AF]">
              Continue Shopping
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-5 py-3.5 text-sm font-bold text-[#172033] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
            >
              <ShoppingBag size={18} />
              My Orders
            </button>
          </div>
        </div>

        {/* SECURITY */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#94A3B8]">Thank you for choosing MineKart.</p>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Check, ShoppingBag, ArrowRight, Package, ShieldCheck } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BreadCrumb from './BreadCrumb'
import { axiosInstance } from '../config/axiosConfig'

export default function OrderSuccess() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()

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
    } catch (error) {
      console.log('Get Order Error:', error.response?.data || error.message)

      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrder()
  }, [orderId])

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FBF7F2]">
        <div className="text-sm font-semibold text-[#806C63]">Loading order...</div>
      </div>
    )
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#FBF7F2] py-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-8 text-center shadow-[0_8px_30px_rgba(73,54,49,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <Package size={30} strokeWidth={1.8} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#351C18]">Order Not Found</h1>

          <p className="mt-2 text-sm text-[#806C63]">We could not find your order information.</p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    )
  }

  const isCOD = order.paymentMethod === 'COD'
  const isOnlineOnDelivery = order.paymentMethod === 'ONLINE_ON_DELIVERY'

  const items = [
    { title: 'cart', link: '/cart' },
    { title: 'checkout', link: '/checkout' },
    { title: 'success', link: null },
  ]

  return (
    <div className="min-h-screen">
      <BreadCrumb items={items} />

      <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl bg-[#FBF7F2]">
        <div className="overflow-hidden border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_10px_35px_rgba(73,54,49,0.08)]">
          {/* SUCCESS BANNER */}
          <div className="relative overflow-hidden bg-linear-to-br from-[#351C18] via-[#5A2A25] to-[#7D171C] px-6 py-10 text-center sm:px-8">
            <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-[#D4A373]/10" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <Check size={34} strokeWidth={2.8} className="text-[#7D171C]" />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Order Placed Successfully!</h1>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/75">Thank you for shopping with MineKart. Your order has been successfully placed.</p>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5 sm:p-7">
            {/* ORDER ID */}
            <div className="rounded-xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Order ID</p>

                <p className="break-all text-sm font-extrabold text-[#351C18]">{orderId}</p>
              </div>
            </div>

            {/* ORDER DETAILS */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* PAYMENT */}
              <div className="rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 transition-all duration-300 hover:border-[#CDAFA4] hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <ShoppingBag size={17} />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Payment Method</p>
                </div>

                <p className="mt-3 text-sm font-bold text-[#351C18]">{isCOD ? 'Cash on Delivery' : 'Online on Delivery'}</p>

                <p className="mt-1 inline-flex rounded-md bg-[#FFF4DD] px-2 py-1 text-[10px] font-bold text-[#A05A16]">{order.paymentStatus || 'Pending'}</p>
              </div>

              {/* ORDER STATUS */}
              <div className="rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-4 transition-all duration-300 hover:border-[#CDAFA4] hover:shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <Package size={17} />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Order Status</p>
                </div>

                <p className="mt-3 text-sm font-bold text-[#351C18]">{order.orderStatus || 'Pending'}</p>

                <p className="mt-1 text-xs font-semibold text-[#806C63]">We will process your order shortly.</p>
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-linear-to-r from-[#F7EEE7] to-[#FFF4EE] px-4 py-4">
              <span className="text-sm font-bold text-[#806C63]">Total Amount</span>

              <span className="text-xl font-extrabold text-[#8E181F]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>

            {/* COD MESSAGE */}
            {isCOD && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#EBD7B7] bg-[#FFF9ED] px-4 py-3">
                <div className="mt-0.5 shrink-0 text-[#B87935]">
                  <Package size={16} />
                </div>

                <p className="text-xs font-semibold leading-5 text-[#79521F]">Please keep the exact amount ready when your order is delivered.</p>
              </div>
            )}

            {/* ONLINE ON DELIVERY */}
            {isOnlineOnDelivery && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#E8DDD4] bg-[#F7EEE7] px-4 py-3">
                <div className="mt-0.5 shrink-0 text-[#8E181F]">
                  <ShieldCheck size={16} />
                </div>

                <p className="text-xs font-semibold leading-5 text-[#67544D]">Your payment will be collected online when your order is delivered.</p>
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-5 py-3.5 text-sm font-bold text-[#351C18] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
              >
                <ShoppingBag size={18} />
                My Orders
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-center gap-2 py-5 text-center">
          <ShieldCheck size={14} className="text-[#9A857B]" />

          <p className="text-[11px] font-medium text-[#9A857B]">Thank you for choosing MineKart.</p>
        </div>
      </div>
    </div>
  )
}

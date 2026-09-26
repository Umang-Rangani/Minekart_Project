import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PackageSearch, Search, Package, Truck, MapPin, CheckCircle2, LoaderCircle, XCircle, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import BreadCrumb from '../../user/BreadCrumb'
import { axiosInstance } from '../../config/axiosConfig'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'TrackOrder | MineKart'
  }, [])

  const items = [
    {
      title: 'TrackOrder',
      link: null,
    },
  ]

  const trackingSteps = [
    {
      status: 'Pending',
      title: 'Order Placed',
      Icon: Package,
    },
    {
      status: 'Confirmed',
      title: 'Confirmed',
      Icon: CheckCircle2,
    },
    {
      status: 'Processing',
      title: 'Processing',
      Icon: LoaderCircle,
    },
    {
      status: 'Shipped',
      title: 'Shipped',
      Icon: Package,
    },
    {
      status: 'Out for Delivery',
      title: 'Out for Delivery',
      Icon: Truck,
    },
    {
      status: 'Delivered',
      title: 'Delivered',
      Icon: MapPin,
    },
  ]

  const handleTrackOrder = async () => {
    const trimmedOrderId = orderId.trim()

    if (!trimmedOrderId) {
      toast.error('Please enter your order ID')
      return
    }

    try {
      setLoading(true)
      setOrder(null)

      const response = await axiosInstance.get(`/order/${trimmedOrderId}`)

      if (response.data?.success) {
        setOrder(response.data.data)
        toast.success('Order found successfully')
      } else {
        toast.error(response.data?.message || 'Order not found')
      }
    } catch (error) {
      setOrder(null)

      toast.error(error?.response?.data?.message || 'Unable to find this order')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTrackOrder()
    }
  }

  const getStepState = (index) => {
    const currentStatus = String(order?.orderStatus || '').trim()

    if (!currentStatus) {
      return 'upcoming'
    }

    if (currentStatus === 'Cancelled') {
      return 'cancelled'
    }

    if (currentStatus === 'Returned') {
      return 'returned'
    }

    const currentIndex = trackingSteps.findIndex((step) => step.status === currentStatus)

    if (currentIndex === -1) {
      return 'upcoming'
    }

    if (index < currentIndex) {
      return 'completed'
    }

    if (index === currentIndex) {
      return 'active'
    }

    return 'upcoming'
  }

  return (
    <div className="min-h-screen bg-[#FBF7F2] mx-auto max-w-350">
      <BreadCrumb items={items} />

      <div className="  py-5 ">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          <div className="bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                <PackageSearch size={27} strokeWidth={1.8} />
              </div>

              <h2 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Track your order</h2>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Enter your MineKart order ID to check the latest delivery status.</p>

              <div className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white p-1.5 shadow-[0_5px_20px_rgba(0,0,0,0.12)]">
                <Search size={17} className="ml-2 shrink-0 text-[#806C63]" />

                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter order ID"
                  disabled={loading}
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#351C18] outline-none placeholder:text-[#A8978F] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={handleTrackOrder}
                  disabled={loading}
                  className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#351C18] px-3 text-[10px] font-bold text-white transition hover:bg-[#7D171C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={13} className="animate-spin" />
                      Tracking
                    </>
                  ) : (
                    <>
                      Track
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 divide-x divide-[#E8DDD4] bg-[#FBF7F2] sm:grid-cols-3">
            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Tracking</p>

              <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">Real-time</p>
            </div>

            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Status</p>

              <p className="mt-0.5 truncate text-xs font-extrabold text-[#351C18]">{order?.orderStatus || 'Order Status'}</p>
            </div>

            <div className="col-span-2 border-t border-[#E8DDD4] px-4 py-3 text-center sm:col-span-1 sm:border-t-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Support</p>

              <Link to="/contact" className="mt-0.5 inline-flex text-xs font-extrabold text-[#A51D26] transition hover:text-[#351C18]">
                Need Help?
              </Link>
            </div>
          </div>
        </div>

        {/* Order Result */}
        {order && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.04)]">
            {/* Order Header */}
            <div className="flex flex-col gap-3 border-b border-[#E8DDD4] bg-[#FBF7F2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Order ID</p>

                <p className="mt-1 break-all text-sm font-extrabold tracking-wide text-[#351C18]">{order?.orderId || order?._id || 'N/A'}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <p className="text-[9px] font-semibold text-[#806C63]">Current Status</p>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-[9px] font-extrabold ${
                    order?.orderStatus === 'Delivered'
                      ? 'border-[#BBDDC8] bg-[#EAF5EE] text-[#3E8B62]'
                      : order?.orderStatus === 'Cancelled'
                        ? 'border-[#D9D9D9] bg-[#F3F3F3] text-[#888888]'
                        : order?.orderStatus === 'Returned'
                          ? 'border-[#F0D2A8] bg-[#FFF4E5] text-[#A05A16]'
                          : 'border-[#E2B7BA] bg-[#FCEBED] text-[#A51D26]'
                  }`}
                >
                  {order?.orderStatus || 'N/A'}
                </span>
              </div>
            </div>

            {/* Cancelled */}
            {order.orderStatus === 'Cancelled' && (
              <div className="border-b border-[#E8DDD4] bg-[#F3F3F3] px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E7E7E7] text-[#888888]">
                    <XCircle size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-[#555555]">Order Cancelled</p>

                    <p className="mt-0.5 text-[10px] leading-4 text-[#888888]">This order is no longer active and will not be delivered.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Returned */}
            {order.orderStatus === 'Returned' && (
              <div className="border-b border-[#E8DDD4] bg-[#FFF8EF] px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBEBD5] text-[#A05A16]">
                    <RotateCcw size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-[#8A4D0B]">Order Returned</p>

                    <p className="mt-0.5 text-[10px] leading-4 text-[#A05A16]">This order has been returned successfully.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking */}
            {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned' && (
              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#351C18]">Order tracking</h3>

                    <p className="mt-1 text-[10px] text-[#806C63]">Follow your order from placement to delivery</p>
                  </div>

                  <div className="hidden h-8 items-center gap-1.5 rounded-lg bg-[#F7EEE7] px-2.5 text-[9px] font-bold text-[#351C18] sm:flex">
                    <Truck size={13} />
                    Easy Tracking
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:gap-0">
                  {trackingSteps.map(({ Icon, title, status }, index) => {
                    const state = getStepState(index)

                    const isCompleted = state === 'completed'
                    const isActive = state === 'active'

                    return (
                      <div key={status} className="relative flex items-center gap-3 sm:block sm:text-center">
                        {/* Connector */}
                        {index < trackingSteps.length - 1 && <div className={`absolute left-5 top-10 h-5 w-0.5 sm:left-[calc(50%+24px)] sm:top-5 sm:h-0.5 sm:w-[calc(100%-48px)] ${isCompleted ? 'bg-[#A51D26]' : 'bg-[#E8DDD4]'}`} />}

                        {/* Icon */}
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition sm:mx-auto sm:h-11 sm:w-11 ${
                            isCompleted
                              ? 'border-[#A51D26] bg-[#A51D26] text-white shadow-[0_4px_12px_rgba(165,29,38,0.18)]'
                              : isActive
                                ? 'border-[#A51D26] bg-[#FCEBED] text-[#A51D26] shadow-[0_4px_12px_rgba(165,29,38,0.12)]'
                                : 'border-[#E8DDD4] bg-white text-[#9A857B]'
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.8} className={isActive ? 'animate-pulse' : ''} />
                        </div>

                        {/* Text */}
                        <div className="sm:mt-2.5">
                          <p className={`text-xs font-bold ${isCompleted || isActive ? 'text-[#351C18]' : 'text-[#9A857B]'}`}>{title}</p>

                          <p className={`mt-0.5 text-[9px] font-medium ${isCompleted ? 'text-[#A51D26]' : isActive ? 'font-bold text-[#A51D26]' : 'text-[#A8978F]'}`}>{isCompleted ? 'Completed' : isActive ? 'Current' : 'Upcoming'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty / How it works */}
        {!order && (
          <div className="mt-5 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#351C18]">How order tracking works</h3>

                <p className="mt-1 text-[10px] text-[#806C63]">Follow your order from placement to delivery</p>
              </div>

              <div className="hidden h-8 items-center gap-1.5 rounded-lg bg-[#F7EEE7] px-2.5 text-[9px] font-bold text-[#351C18] sm:flex">
                <Truck size={13} />
                Easy Tracking
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                [Package, 'Order Placed'],
                [CheckCircle2, 'Confirmed'],
                [Truck, 'Out for Delivery'],
                [MapPin, 'Delivered'],
              ].map(([Icon, title], index) => (
                <div key={title} className="relative flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3 sm:block sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#351C18] text-white shadow-[0_4px_10px_rgba(53,28,24,0.12)]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <div className="sm:mt-3">
                    <p className="text-xs font-bold text-[#351C18]">{title}</p>

                    <p className="mt-0.5 text-[10px] text-[#806C63]">Step {index + 1}</p>
                  </div>

                  {index < 3 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
                      <ArrowRight size={14} className="text-[#C7B6AE]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer / Help */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 text-center shadow-[0_5px_18px_rgba(53,28,24,0.10)] sm:px-6 sm:py-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
            <PackageSearch size={20} strokeWidth={1.8} />
          </div>

          <h3 className="mt-3 text-sm font-extrabold text-white sm:text-base">Don't have your order ID?</h3>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-4 text-white/65 sm:text-xs">You can find your order ID in My Orders and use it here to track your delivery.</p>

          <Link to="/orders" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-[#351C18] transition hover:bg-[#F7EEE7]">
            View My Orders
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

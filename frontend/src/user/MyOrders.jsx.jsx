import React, { useEffect, useState } from 'react'
import { CalendarDays, ChevronRight, Package, ShoppingBag, Truck } from 'lucide-react'
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

      document.title = `My-Orders | MineKart`
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

  const getPaymentStatusClass = (status) => {
    if (status === 'Paid') return 'bg-[#EAF6EF] text-[#3E8B62]'
    if (status === 'Failed') return 'bg-[#FCEBEC] text-[#A51D26]'
    return 'bg-[#FFF4DD] text-[#A05A16]'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7F2]">
        <div className="mx-auto">
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_8px_30px_rgba(73,54,49,0.06)]">
            <div className="animate-pulse p-5 sm:p-6">
              <div className="h-6 w-40 rounded-lg bg-[#E8DDD4]" />
              <div className="mt-2 h-4 w-64 rounded bg-[#F0E8E2]" />

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-72 rounded-2xl bg-[#F7EEE7]" />
                <div className="h-72 rounded-2xl bg-[#F7EEE7]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ! BreadCrumb
  const items = [{ title: 'orders', link: null }]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-4 sm:pt-5">
        {/* PAGE HEADER */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.06)]">
          <div className="relative overflow-hidden bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] px-4 py-4 sm:px-6 sm:py-5">
            <div className="absolute -right-10 -top-16 h-32 w-32 rounded-full bg-[#A51D26]/[0.035]" />
            <div className="absolute -bottom-16 left-1/3 h-28 w-28 rounded-full bg-[#D4A373]/6" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_5px_15px_rgba(125,23,28,0.18)] sm:h-12 sm:w-12">
                  <ShoppingBag size={22} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                    <h1 className="truncate text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">My Orders</h1>
                  </div>

                  <p className="ml-3 mt-0.5 text-[10px] text-[#806C63] sm:text-xs">Track and manage your MineKart orders</p>
                </div>
              </div>

              <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#E8DDD4] bg-white px-3.5 py-2.5 shadow-sm sm:flex">
                <Package size={15} className="text-[#8E181F]" />

                <span className="text-[11px] font-bold text-[#67544D]">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
            </div>
          </div>

          {/* MOBILE ORDER COUNT */}
          <div className="flex items-center justify-between border-t border-[#EEE5DF] bg-[#FFFCFA] px-4 py-2.5 sm:hidden">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A857B]">Your Orders</span>

            <span className="rounded-lg bg-[#F7EEE7] px-2.5 py-1 text-[9px] font-extrabold text-[#8E181F]">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_6px_25px_rgba(73,54,49,0.06)]">
            <div className="flex min-h-105 flex-col items-center justify-center px-5 py-16 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
                <div className="absolute inset-0 rounded-2xl border border-[#E8DDD4]" />
                <ShoppingBag size={34} strokeWidth={1.5} />
              </div>

              <span className="mt-5 rounded-full bg-[#FBF7F2] px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#9A857B]">Order history</span>

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
          /* ORDERS */
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D5C1B7] hover:shadow-[0_12px_30px_rgba(73,54,49,0.10)]"
              >
                {/* ORDER TOP */}
                <div className="border-b border-[#EEE5DF] bg-linear-to-r from-[#FFFDFC] to-[#FBF7F2] px-4 py-4 sm:px-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                          <Package size={15} />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A857B]">Order ID</p>

                          <p className="mt-0.5 truncate text-xs font-extrabold text-[#351C18] sm:text-sm">#{order.orderId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-[#9A857B]">
                        <CalendarDays size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Ordered</span>
                      </div>

                      <p className="mt-1 text-[10px] font-bold text-[#67544D] sm:text-xs">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="px-4 py-4 sm:px-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={14} className="text-[#8E181F]" />

                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#67544D]">Order Items</span>
                    </div>

                    <span className="rounded-md bg-[#FBF7F2] px-2 py-1 text-[9px] font-bold text-[#9A857B]">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto pr-1 scrollbar-thin [scrollbar-color:#CDBDB4_transparent]">
                    <div className="space-y-2.5">
                      {order.items?.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-2.5 transition-all duration-200 hover:border-[#D8C5BA] hover:bg-[#F8F0EA]">
                          {/* PRODUCT IMAGE */}
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E2D5CC] bg-white sm:h-17 sm:w-17">
                            {item.image ? (
                              <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain p-1.5 transition-transform duration-300 hover:scale-105" />
                            ) : (
                              <Package size={23} strokeWidth={1.5} className="text-[#B7A49B]" />
                            )}
                          </div>

                          {/* PRODUCT INFO */}
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-[12px] font-bold leading-4 text-[#351C18] sm:text-[13px]">{item.productName}</p>

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-[9px] font-semibold text-[#806C63]">Qty: {item.quantity}</span>

                              {item.size && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-[#CDBDB4]" />
                                  <span className="text-[9px] font-semibold text-[#806C63]">Size: {item.size}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* ITEM PRICE */}
                          <div className="shrink-0 text-right">
                            <p className="text-[11px] font-extrabold text-[#8E181F] sm:text-xs">₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="border-t border-[#E8DDD4] bg-[#FBF7F2] px-4 py-4 sm:px-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {/* TOTAL */}
                    <div className="rounded-xl border border-[#E8DDD4] bg-white px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8E181F]" />

                        <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Total</p>
                      </div>

                      <p className="mt-1.5 text-sm font-extrabold text-[#351C18]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>

                    {/* PAYMENT */}
                    <div className="rounded-xl border border-[#E8DDD4] bg-white px-3 py-3">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Payment</p>

                      <p className="mt-1.5 truncate text-[10px] font-bold text-[#351C18]">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>

                      <span className={`mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[9px] font-bold ${getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</span>
                    </div>

                    {/* STATUS */}
                    <div className="col-span-2 rounded-xl border border-[#E8DDD4] bg-white px-3 py-3 sm:col-span-1">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Order Status</p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3E8B62]/40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3E8B62]" />
                        </span>

                        <p className="truncate text-[10px] font-extrabold text-[#351C18]">{order.orderStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* VIEW DETAILS */}
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-3 text-[11px] font-extrabold text-white shadow-[0_5px_14px_rgba(125,23,28,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(125,23,28,0.22)]"
                  >
                    View Order Details
                    <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM INFO */}
        {orders.length > 0 && (
          <div className="mt-5 flex items-center justify-center gap-2 py-4">
            <Truck size={14} className="text-[#9A857B]" />

            <p className="text-[10px] font-medium text-[#9A857B] sm:text-[11px]">Thank you for shopping with MineKart.</p>
          </div>
        )}
      </div>
    </div>
  )
}

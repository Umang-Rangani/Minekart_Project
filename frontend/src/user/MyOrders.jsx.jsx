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
    } catch (error) {
      console.log('Get Orders Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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

      <div className="mx-auto pt-5">
        {/* PAGE HEADER */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF5EF] to-[#F7EEE7] shadow-[0_5px_20px_rgba(73,54,49,0.06)]">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15">
                <ShoppingBag size={23} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
                  <h1 className="truncate text-xl font-extrabold tracking-tight text-[#351C18]">My Orders</h1>
                </div>

                <p className="ml-3 mt-0.5 text-xs text-[#806C63]">View and track your orders</p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3.5 py-2 text-xs font-bold text-[#8E181F] shadow-sm sm:flex">
              <Package size={15} />
              <span>
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] px-6 py-16 text-center shadow-[0_8px_30px_rgba(73,54,49,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
              <ShoppingBag size={30} strokeWidth={1.8} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">No Orders Yet</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#806C63]">You haven't placed any orders yet. Start shopping and your orders will appear here.</p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start Shopping
              <ChevronRight size={17} />
            </button>
          </div>
        ) : (
          /* ORDERS GRID */
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_6px_24px_rgba(73,54,49,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5C1B7] hover:shadow-[0_12px_35px_rgba(73,54,49,0.1)]"
              >
                {/* ORDER HEADER */}
                <div className="border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Order ID</p>

                      <p className="mt-1 truncate text-sm font-extrabold text-[#351C18]">#{order._id}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-[#9A857B]">
                        <CalendarDays size={13} />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Order Date</p>
                      </div>

                      <p className="mt-1 text-sm font-semibold text-[#67544D]">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="flex-1 p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Package size={15} className="text-[#8E181F]" />
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#67544D]">Order Items</p>
                    </div>

                    {order.items?.length > 3 && <span className="text-[10px] font-semibold text-[#9A857B]">{order.items.length} Items</span>}
                  </div>

                  {/* PRODUCTS SCROLL */}
                  <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin [scrollbar-color:#CDBDB4_transparent]">
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-2.5 transition-all duration-200 hover:border-[#D5C1B7] hover:bg-[#F7EEE7]">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E2D5CC] bg-[#FFFDFC]">
                            {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain p-1" /> : <Package size={24} className="text-[#B7A49B]" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#351C18]">{item.productName}</p>

                            <p className="mt-1 text-xs font-medium text-[#806C63]">
                              Qty: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                            </p>

                            <p className="mt-1 text-sm font-extrabold text-[#8E181F]">₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ORDER INFO */}
                <div className="border-t border-[#E8DDD4] bg-[#FBF7F2] px-5 py-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {/* TOTAL */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Total</p>

                      <p className="mt-1 text-sm font-extrabold text-[#8E181F]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>

                    {/* PAYMENT */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Payment</p>

                      <p className="mt-1 truncate text-xs font-bold text-[#351C18]">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>

                      <span className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${getPaymentStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Pending'}</span>
                    </div>

                    {/* STATUS */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Order Status</p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#3E8B62]" />

                        <p className="text-xs font-bold text-[#351C18]">{order.orderStatus}</p>
                      </div>
                    </div>
                  </div>

                  {/* VIEW DETAILS */}
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCCBC1] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#67544D] transition-all duration-300 hover:border-[#8E181F] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
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
          <div className="mt-5 flex items-center justify-center gap-2 py-3">
            <Truck size={14} className="text-[#9A857B]" />
            <p className="text-[11px] font-medium text-[#9A857B]">Thank you for shopping with MineKart.</p>
          </div>
        )}
      </div>
    </div>
  )
}

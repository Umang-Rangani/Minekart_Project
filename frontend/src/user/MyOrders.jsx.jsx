import React, { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, Package, ShoppingBag } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="mx-auto ">
          <div className="animate-pulse rounded-2xl border border-[#E2E8F0] bg-white p-6">
            <div className="h-6 w-40 rounded bg-[#E2E8F0]" />
            <div className="mt-6 h-32 rounded-xl bg-[#F1F5F9]" />
            <div className="mt-4 h-32 rounded-xl bg-[#F1F5F9]" />
          </div>
        </div>
      </div>
    )
  }

  // ! BreadCrumb
  const items = [{ title: `orders`, link: null }]

  return (
    <div className="min-h-screen bg-[#F8FAFC] ">
      <BreadCrumb items={items} />
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button type="button" onClick={() => navigate('/profile')} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]">
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-2xl font-extrabold text-[#172033]">My Orders</h1>

            <p className="mt-1 text-sm text-[#64748B]">View and track your orders</p>
          </div>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1D4ED8]">
              <ShoppingBag size={30} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#172033]">No Orders Yet</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64748B]">You haven't placed any orders yet. Start shopping and your orders will appear here.</p>

            <button type="button" onClick={() => navigate('/')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1E40AF]">
              Start Shopping
              <ChevronRight size={17} />
            </button>
          </div>
        ) : (
          <div className="space-y-4 grid grid-cols-2 gap-5 ">
            {orders.map((order) => (
              <div key={order._id} className="col-span-1 overflow-hidden h-100 flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 ">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Order ID</p>

                    <p className="mt-1 text-sm font-extrabold text-[#172033]">#{order._id}</p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Order Date</p>

                    <p className="mt-1 text-sm font-semibold text-[#64748B]">{formatDate(order.createdAt)}</p>
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    {order.items?.slice(0, 3).map((item, index) => {
                      // console.log('xxxxxxxxxxx', item.image)
                      return (
                        <div key={`${order._id}-${index}`} className="flex items-center gap-3">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
                            {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain" /> : <Package size={24} className="text-[#94A3B8]" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#172033]">{item.productName}</p>

                            <p className="mt-1 text-xs text-[#64748B]">
                              Qty: {item.quantity}
                              {item.size && ` • Size: ${item.size}`}
                            </p>

                            <p className="mt-1 text-sm font-extrabold text-[#172033]">₹{Number(item.totalPrice || 0).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      )
                    })}

                    {order.items?.length > 3 && (
                      <p className="pt-1 text-xs font-semibold text-[#1D4ED8]">
                        + {order.items.length - 3} more item
                        {order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5">
                  {/* Bottom Info */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-5 sm:grid-cols-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Total</p>

                      <p className="mt-1 text-sm font-extrabold text-[#1D4ED8]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Payment</p>

                      <p className="mt-1 text-sm font-bold text-[#172033]">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>

                      <p className={`text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : order.paymentStatus === 'Failed' ? 'text-red-500' : 'text-[#F59E0B]'}`}>{order.paymentStatus || 'Pending'}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Order Status</p>

                      <p className="mt-1 text-sm font-bold text-[#172033]">{order.orderStatus}</p>
                    </div>

                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-bold text-[#172033] transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
                      >
                        View Details
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
